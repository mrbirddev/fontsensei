import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {mountStoreDevtool} from "simple-zustand-devtools";

interface FeedbackStoreState {
  isOpen: boolean,
  setOpen: (open: boolean, options?: FeedbackStoreState['options']) => void,
  options?: {
    title?: string,
    desc?: string,
    placeholder?: string,
  },
}

const useFeedbackStore = create<
  FeedbackStoreState,
  [["zustand/immer", never]]
>(immer(
  (set, getState) => ({
    isOpen: false,
    setOpen: (open, options) => {
      set({ isOpen: open, options: options });
    },
  })
));

if (process.env.NODE_ENV !== 'production') {
  mountStoreDevtool('feedbackStore', useFeedbackStore)
}

export default useFeedbackStore;
