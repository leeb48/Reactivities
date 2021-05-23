import { ServerError } from 'app/models/serverError';
import { makeAutoObservable } from 'mobx';

export default class CommonStore {
  // This field is an observable, components that are observers of this
  // store will be updated when this field changes
  error: ServerError | null = null;

  constructor() {
    // Make the class fields observable
    makeAutoObservable(this);
  }

  setServerError = (error: ServerError) => {
    this.error = error;
  };
}
