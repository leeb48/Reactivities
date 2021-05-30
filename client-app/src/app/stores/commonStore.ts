import { ServerError } from 'app/models/serverError';
import { makeAutoObservable, reaction } from 'mobx';

export default class CommonStore {
  // This field is an observable, components that are observers of this
  // store will be updated when this field changes
  error: ServerError | null = null;
  token: string | null = window.localStorage.getItem('jwt');
  appLoaded = false;

  constructor() {
    // Make the class fields observable
    makeAutoObservable(this);

    // Only runs when there is a change to values being tracked
    reaction(
      // The value to react to
      () => this.token,
      // Side effects here
      (token) => {
        if (token) {
          window.localStorage.setItem('jwt', token);
        } else {
          window.localStorage.removeItem('jwt');
        }
      }
    );
  }

  setServerError = (error: ServerError) => {
    this.error = error;
  };

  // When token is set, the reaction runs to store the token inside local storage
  setToken = (token: string | null) => {
    this.token = token;
  };

  setAppLoaded = () => {
    this.appLoaded = true;
  };
}
