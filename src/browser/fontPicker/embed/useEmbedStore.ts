import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {mountStoreDevtool} from "simple-zustand-devtools";
import {ReactNode} from "react";

interface EmbedStore {
  popup: ReactNode;
  renderPopup: (popup: ReactNode) => void;
}

const useEmbedStore = create<
  EmbedStore,
  [["zustand/immer", never]]
>(immer(
  (set, getState) => ({
    popup: false,
    renderPopup: (popup) => {
      set({ popup });
    },
  })
));

if (process.env.NODE_ENV !== 'production') {
  mountStoreDevtool('embedStore', useEmbedStore)
}

export default useEmbedStore;
