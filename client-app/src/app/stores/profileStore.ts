import agent from 'app/api/agent';
import { Photo, Profile } from 'app/models/profile';
import { makeAutoObservable, runInAction } from 'mobx';
import { store } from './store';

export default class ProfileStore {
  profile: Profile | null = null;
  loadingProfile = false;
  uploading = false;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

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
}
