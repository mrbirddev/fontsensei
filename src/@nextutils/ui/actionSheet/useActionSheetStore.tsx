import {ReactNode} from "react";
import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {mountStoreDevtool} from "simple-zustand-devtools";

interface State {
  stack: ReactNode[];
  push: (props: ReactNode) => void;
  pop: (depth?: number) => void;
  clear: () => void;
}

const useActionSheetStore = create<
  State,
  [["zustand/immer", never]]
>(immer(
  (set, getState) => ({
    stack: [],
    push: (props) => {
      set((state) => {
        state.stack.push(props);
      });
    },
    pop: (depth= 1) => {
      set((state) => {
        state.stack = state.stack.slice(0, state.stack.length - depth);
      });
    },
    clear: () => {
      set({stack: []});
    },
  })
));

if (process.env.NODE_ENV !== 'production') {
  mountStoreDevtool('actionSheetStore', useActionSheetStore)
}

export default useActionSheetStore;
