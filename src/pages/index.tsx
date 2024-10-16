import FontPickerPage from "../browser/fontPicker/FontPickerPage";
import {NavbarContext} from "../browser/fontPicker/FontPickerPage";
import React from "react";
import {FontPickerPageContext} from "@fontsensei/components/fontPickerCommon";
import {getExtraMenuItems, Toolbar} from "../browser/fontPicker/landingComponents";
import {useI18n} from "@fontsensei/locales";

export {getServerSideProps} from "../browser/fontPicker/FontPickerPage";
export default (props: Parameters<typeof FontPickerPage>[0]) => {
  const t = useI18n();
  return <NavbarContext.Provider value={{
    extraMenuItems: getExtraMenuItems(t),
  }}>
    <FontPickerPageContext.Provider value={{
      Toolbar: Toolbar,
    }}>
      <FontPickerPage {...props} />
    </FontPickerPageContext.Provider>
  </NavbarContext.Provider>;
};
