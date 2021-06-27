import { Activity, ActivityFormValues } from 'app/models/activity';
import { PaginatedResult } from 'app/models/pagination';
import { Photo, Profile } from 'app/models/profile';
import { ProfileActivity } from 'app/models/profileActivity';
import { User, UserFormValues } from 'app/models/user';
import { store } from 'app/stores/store';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { history } from 'index';
import { toast } from 'react-toastify';

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

axios.interceptors.response.use(
  async (response) => {
    await sleep(1000);

    const pagination = response.headers['pagination'];
    if (pagination) {
      response.data = new PaginatedResult(
        response.data,
        JSON.parse(pagination)
      );
      return response as AxiosResponse<PaginatedResult<any>>;
    }

    return response;
  },
  (error: AxiosError) => {
    const { data, status, config } = error.response!;

    switch (status) {
      case 400:
        // Handle simple server errors
        if (typeof data === 'string') {
          toast.error(data);
        }

        // Handle invalid guid error
        if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
          history.push('/not-found');
        }
        // Handle validation errors
        if (data.errors) {
          const modalStateErrors = Object.values(data.errors);

          throw modalStateErrors.flat();
        }
        break;

      case 401:
        toast.error('unauthorized');
        break;

      case 404:
        history.push('/not-found');
        break;

      case 500:
        store.commonStore.setServerError(data);
        history.push('/server-error');
        break;
    }

    return Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),

  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),

  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),

  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
  list: (pagingParams: URLSearchParams) =>
    axios
      .get<PaginatedResult<Activity[]>>('/activities', { params: pagingParams })
      .then(responseBody),

  details: (id: string) => requests.get<Activity>(`/activities/${id}`),

  create: (activity: ActivityFormValues) =>
    requests.post<void>('/activities', activity),

  update: (activity: ActivityFormValues) =>
    requests.put<void>(`/activities/${activity.id}`, activity),

  delete: (id: string) => requests.del<void>(`/activities/${id}`),

  attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
};

const Account = {
  current: () => requests.get<User>('/account'),

  login: (user: UserFormValues) => requests.post<User>('/account/login', user),

  register: (user: UserFormValues) =>
    requests.post<User>('/account/register', user),
};

const Profiles = {
  get: (username: string) => requests.get<Profile>(`/profiles/${username}`),

  getActivityList: (username: string, params: URLSearchParams) =>
    axios
      .get<PaginatedResult<ProfileActivity[]>>(
        `/profiles/${username}/activities`,
        { params }
      )
      .then(responseBody),

  uploadPhoto: (file: Blob) => {
    let formData = new FormData();
    formData.append('File', file);
    return axios.post<Photo>('photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  setMainPhoto: (id: string) => requests.post(`/photos/${id}/setmain`, {}),

  deletePhoto: (id: string) => requests.del(`/photos/${id}`),

  updateProfile: (profile: Partial<Profile>) =>
    requests.put(`/profiles`, profile),

  updateFollowing: (username: string) =>
    requests.post(`/follow/${username}`, {}),

  listFollowings: (username: string, predicate: string) =>
    requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
};

const agent = {
  Activities,
  Account,
  Profiles,
};

export default agent;
