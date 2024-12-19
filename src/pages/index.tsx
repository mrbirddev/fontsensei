import FontPickerPage from "../browser/fontPicker/FontPickerPage";
import {NavbarContext} from "../browser/fontPicker/FontPickerPage";
import React from "react";
import {FontPickerPageContext} from "@fontsensei/components/fontPickerCommon";
import {getExtraMenuItems, Toolbar} from "../browser/fontPicker/landingComponents";

export {getServerSideProps} from "../browser/fontPicker/FontPickerPage";
export default (props: Parameters<typeof FontPickerPage>[0]) => {
  return <NavbarContext.Provider value={{
    extraMenuItems: getExtraMenuItems(),
  }}>
    <FontPickerPageContext.Provider value={{
      Toolbar: Toolbar,
    }}>
      <FontPickerPage {...props} />
    </FontPickerPageContext.Provider>
  </NavbarContext.Provider>;
};
