import { createContext, useContext } from 'react';
import ActivityStore from './activityStore';

interface Store {
  activityStore: ActivityStore;
}

// Add new instances of stores here
export const store: Store = {
  activityStore: new ActivityStore(),
};

// Create a context so that components can access the store
export const StoreContext = createContext(store);

// A custom hook to use the store
export function useStore() {
  return useContext(StoreContext);
}
