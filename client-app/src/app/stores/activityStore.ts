import agent from 'app/api/agent';
import { Activity, ActivityFormValues } from 'app/models/activity';
import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { format } from 'date-fns';
import { store } from './store';
import { Profile } from 'app/models/profile';
import { Pagination, PagingParams } from 'app/models/pagination';

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;
  pagination: Pagination | null = null;
  pagingParams = new PagingParams();
  predicate = new Map().set('all', true);

  constructor() {
    makeAutoObservable(this);

    reaction(
      // observe the key changes and execute the reaction
      () => this.predicate.keys(),
      () => {
        this.pagingParams = new PagingParams();
        this.activityRegistry.clear();
        this.loadActivities();
      }
    );
  }

  setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
  };

  setPagingParams = (pagingParams: PagingParams) => {
    this.pagingParams = pagingParams;
  };

  setPredicate = (predicate: string, startDate?: string | Date) => {
    const resetPredicate = () => {
      this.predicate.forEach((value, key) => {
        if (key !== 'startDate') this.predicate.delete(key);
      });
    };

    switch (predicate) {
      case 'all':
        resetPredicate();
        this.predicate.set('all', true);
        break;
      case 'isGoing':
        resetPredicate();
        this.predicate.set('isGoing', true);
        break;
      case 'isHost':
        resetPredicate();
        this.predicate.set('isHost', true);
        break;
      case 'startDate':
        // deleting here will trigger the change detection
        this.predicate.delete('startDate');
        this.predicate.set('startDate', startDate);
        break;
    }
  };

  get axiosPagingParams() {
    const params = new URLSearchParams();
    params.append('pageNumber', this.pagingParams.pageNumber.toString());
    params.append('pageSize', this.pagingParams.pageSize.toString());

    this.predicate.forEach((value, key) => {
      if (key === 'startDate') {
        params.append(key, (value as Date).toISOString());
      } else {
        params.append(key, value);
      }
    });

    return params;
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = format(activity.date!, 'dd MMM yyyy');

        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];

        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }

  private setActivity = (activity: Activity) => {
    // User must be authenticated
    const user = store.userStore.user;
    if (user) {
      activity.isGoing = activity.attendees!.some(
        (a) => a.username === user.username
      );
      activity.isHost = activity.hostUsername === user.username;
      activity.host = activity.attendees?.find(
        (x) => x.username === activity.hostUsername
      );
    }

    activity.date = new Date(activity.date!);

    this.activityRegistry.set(activity.id, activity);
  };

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  private setSelectedActivity = (activity: Activity) => {
    this.selectedActivity = activity;
  };

  loadActivities = async () => {
    this.setLoadingInitial(true);
    try {
      const result = await agent.Activities.list(this.axiosPagingParams);
      result.data.forEach((activity) => {
        this.setActivity(activity);
      });

      this.setPagination(result.pagination);
    } catch (error) {
      console.log(error);
    } finally {
      this.setLoadingInitial(false);
    }
  };

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);

    if (activity) {
      this.setSelectedActivity(activity);
      return activity;
    } else {
      this.setLoadingInitial(true);

      try {
        activity = await agent.Activities.details(id);

        this.setActivity(activity);

        this.setSelectedActivity(activity);

        return activity;
      } catch (error) {
        console.log(error);
      } finally {
        this.setLoadingInitial(false);
      }
    }
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  setLoading = (status: boolean) => {
    this.loading = status;
  };

  createActivity = async (activity: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);

    try {
      await agent.Activities.create({
        ...activity,
        // z is added to indicate UTC time
        date: new Date(activity.date + 'z'),
      });

      const newActivity = new Activity(activity);
      newActivity.hostUsername = user!.username;
      newActivity.attendees = [attendee];

      this.setActivity(newActivity);

      runInAction(() => {
        this.setSelectedActivity(newActivity);
      });
    } catch (error) {
      console.log(error);
    }
  };

  updateActivity = async (activity: ActivityFormValues) => {
    try {
      await agent.Activities.update(activity);

      runInAction(() => {
        if (activity.id) {
          const updatedActivity = {
            ...this.getActivity(activity.id),
            ...activity,
          } as Activity;

          this.activityRegistry.set(activity.id, updatedActivity);
          this.setSelectedActivity(updatedActivity);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  deleteActivity = async (id: string) => {
    this.setLoading(true);

    try {
      await agent.Activities.delete(id);

      runInAction(() => {
        this.activityRegistry.delete(id);
      });

      this.setLoading(false);
    } catch (error) {
      console.log(error);
      this.setLoading(false);
    }
  };

  updateAttendence = async () => {
    const user = store.userStore.user;
    this.setLoading(true);
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        // Remove the user from the attendee list
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees =
            this.selectedActivity.attendees?.filter(
              (a) => a.username !== user?.username
            );
          this.selectedActivity.isGoing = false;
        } else {
          // Add the user to the attendee list
          const attendee = new Profile(user!);
          this.selectedActivity?.attendees?.push(attendee);
          this.selectedActivity!.isGoing = true;
        }

        // Replace the old activity with the updated activity
        this.activityRegistry.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.setLoading(false);
    }
  };

  cancelActivityToggle = async () => {
    this.setLoading(true);

    try {
      await agent.Activities.attend(this.selectedActivity!.id);

      runInAction(() => {
        this.selectedActivity!.isCancelled =
          !this.selectedActivity!.isCancelled;

        this.activityRegistry.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.setLoading(false);
    }
  };
  clearSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  updateAttendeeFollowing = (username: string) => {
    this.activityRegistry.forEach((activity) => {
      activity.attendees.forEach((attendee) => {
        if (attendee.username === username) {
          attendee.following
            ? attendee.followersCount--
            : attendee.followersCount++;

          attendee.following = !attendee.following;
        }
      });
    });
  };
}
