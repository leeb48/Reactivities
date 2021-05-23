import { createContext, useContext } from 'react';
import ActivityStore from './activityStore';
import CommonStore from './commonStore';

interface Store {
  activityStore: ActivityStore;
  commonStore: CommonStore;
}

// Add new instances of stores here
export const store: Store = {
  activityStore: new ActivityStore(),
  commonStore: new CommonStore(),
};

// Create a context so that components can access the store
export const StoreContext = createContext(store);

// A custom hook to use the store
export function useStore() {
  return useContext(StoreContext);
}
