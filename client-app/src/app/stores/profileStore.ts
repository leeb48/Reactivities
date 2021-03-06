import agent from 'app/api/agent';
import { Pagination, PagingParams } from 'app/models/pagination';
import { Photo, Profile, ProfileActivity } from 'app/models/profile';
import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { store } from './store';

export default class ProfileStore {
  profile: Profile | null = null;
  loadingProfile = false;
  uploading = false;
  loading = false;
  followings: Profile[] = [];
  loadingFollowings = false;
  activeTab = 0;
  profileActivity: ProfileActivity[] = [];
  pagination: Pagination | null = null;
  pagingParams = new PagingParams(1, 10);
  predicate = new Map().set('predicate', 'all');

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.activeTab,

      (activeTab) => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? 'followers' : 'following';
          this.loadFollowings(predicate);
        } else {
          this.followings = [];
        }
      }
    );
  }

  setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
  };

  setPagingParams = (pagingParams: PagingParams) => {
    this.pagingParams = pagingParams;
  };

  setPredicate = (predicate: string) => {
    const resetPredicate = () => {
      this.predicate.forEach((value, key) => {
        this.predicate.delete(key);
      });
    };

    switch (predicate) {
      case 'all':
        resetPredicate();
        this.predicate.set('predicate', 'all');
        break;
      case 'past':
        resetPredicate();
        this.predicate.set('predicate', 'past');
        break;
      case 'future':
        resetPredicate();
        this.predicate.set('predicate', 'future');
        break;
      case 'hosting':
        resetPredicate();
        this.predicate.set('predicate', 'hosting');
        break;
    }
  };

  get axiosPagingParams() {
    const params = new URLSearchParams();
    params.append('pageNumber', this.pagingParams.pageNumber.toString());
    params.append('pageSize', this.pagingParams.pageSize.toString());

    this.predicate.forEach((value, key) => {
      params.append(key, value);
    });

    return params;
  }

  setActiveTab = (activeTab: any) => {
    this.activeTab = activeTab;
  };

  get isCurrentUser() {
    if (store.userStore.user && this.profile) {
      return store.userStore.user.username === this.profile.username;
    }

    return false;
  }

  loadProfile = async (username: string) => {
    this.loadingProfile = true;

    try {
      const profile = await agent.Profiles.get(username);

      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loadingProfile = false));
    }
  };

  loadProfileActivities = async () => {
    try {
      this.loading = true;

      const response = await agent.Profiles.getActivityList(
        this.profile!.username,
        this.axiosPagingParams
      );

      runInAction(() => {
        this.profileActivity = response.data;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  uploadPhoto = async (file: Blob) => {
    this.uploading = true;
    try {
      const response = await agent.Profiles.uploadPhoto(file);
      const photo = response.data;
      runInAction(() => {
        if (this.profile) {
          this.profile.photos?.push(photo);

          // Update the profile photo if the main photo was changed
          if (photo.isMain && store.userStore.user) {
            store.userStore.setImage(photo.url);
            this.profile.image = photo.url;
          }
        }

        this.uploading = false;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.uploading = false));
    }
  };

  setMainPhoto = async (photo: Photo) => {
    this.loading = true;

    try {
      await agent.Profiles.setMainPhoto(photo.id);

      store.userStore.setImage(photo.url);
      runInAction(() => {
        if (this.profile && this.profile.photos) {
          // Sets the current main photo to false
          this.profile.photos.find((p) => p.isMain)!.isMain = false;

          // Set the new main photo
          this.profile.photos.find((p) => p.id === photo.id)!.isMain = true;

          this.profile.image = photo.url;

          // Update photos in the dashboard and attendee list
          store.activityStore.activityRegistry.forEach((activity) => {
            if (
              activity.host &&
              activity.host?.username === this.profile?.username
            ) {
              activity.host.image = photo.url;

              activity.attendees.forEach((attendee) => {
                if (attendee.username === this.profile?.username) {
                  attendee.image = photo.url;
                }
              });
            }
          });

          this.loading = false;
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  deletePhoto = async (photo: Photo) => {
    this.loading = true;

    try {
      await agent.Profiles.deletePhoto(photo.id);

      runInAction(() => {
        if (this.profile && this.profile.photos) {
          this.profile.photos = this.profile.photos.filter(
            (p) => p.id !== photo.id
          );
        }

        this.loading = false;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  updateProfile = async (profile: Partial<Profile>) => {
    this.loading = true;

    try {
      await agent.Profiles.updateProfile(profile);

      runInAction(() => {
        if (
          profile.displayName &&
          profile.displayName !== store.userStore.user?.displayName
        ) {
          store.userStore.setDisplayName(profile.displayName);

          this.profile = { ...this.profile, ...(profile as Profile) };
        }

        this.profile!.bio = profile.bio;

        this.loading = false;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  updateFollowing = async (username: string, following: boolean) => {
    this.loading = true;

    try {
      await agent.Profiles.updateFollowing(username);

      store.activityStore.updateAttendeeFollowing(username);

      runInAction(() => {
        // Update the count when looking at other people's profile
        if (
          this.profile &&
          this.profile.username !== store.userStore.user?.username &&
          this.profile.username === username
        ) {
          following
            ? this.profile.followersCount++
            : this.profile.followersCount--;
          this.profile.following = !this.profile.following;
        }

        // Update the count when looking at own profile
        if (
          this.profile &&
          this.profile.username === store.userStore.user?.username
        ) {
          following
            ? this.profile.followingCount++
            : this.profile.followingCount--;
        }

        this.followings.forEach((profile) => {
          if (profile.username === username) {
            profile.following
              ? profile.followersCount--
              : profile.followersCount++;
            profile.following = !profile.following;
          }
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  loadFollowings = async (predicate: string) => {
    this.loadingFollowings = true;

    try {
      const followings = await agent.Profiles.listFollowings(
        this.profile!.username,
        predicate
      );

      runInAction(() => {
        this.followings = followings;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loadingFollowings = false));
    }
  };
}
