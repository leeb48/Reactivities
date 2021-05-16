import agent from 'app/api/agent';
import { Activity } from 'app/models/activity';
import { makeAutoObservable, runInAction } from 'mobx';
import { v4 as uuid } from 'uuid';

export default class ActivityStore {
  activities: Activity[] = [];
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadActivities = async () => {
    this.setLoadingInitial(true);

    try {
      (await agent.Activities.list()).forEach((activity) => {
        activity.date = activity.date.split('T')[0];

        runInAction(() => {
          this.activities.push(activity);
        });
      });
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  selectActivity = (id: string) => {
    this.selectedActivity = this.activities.find((a) => a.id === id);
  };

  cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  openForm = (id?: string) => {
    id ? this.selectActivity(id) : this.cancelSelectedActivity();
    this.editMode = true;
  };

  closeForm = () => {
    this.editMode = false;
  };

  setLoading = (status: boolean) => {
    this.loading = status;
  };

  createActivity = async (activity: Activity) => {
    this.setLoading(true);
    activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activities.push(activity);
        this.selectedActivity = activity;
        this.editMode = false;
      });
      this.setLoading(false);
    } catch (error) {
      console.log(error);
      this.setLoading(false);
    }
  };

  updateActivity = async (activity: Activity) => {
    this.setLoading(true);
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activities = [
          activity,
          ...this.activities.filter((a) => a.id !== activity.id),
        ];
        this.selectedActivity = activity;
        this.editMode = false;
      });
      this.setLoading(false);
    } catch (error) {
      console.log(error);
      this.setLoading(false);
    }
  };
}
