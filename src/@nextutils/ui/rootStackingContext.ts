// applies to LandingLayout, DashLayout, Viewport(editor layout)
const rootStackingContext = {
  // editor, mostly absolute
  editorFrame: {
    base: 1
  },
  editorLeft: {
    base: 2
  },
  editorRight: {
    base: 2
  },

  // fixed items
  topNav: {
    base: "z-[100]",
  },
  leftNav: {
    base: "z-[200]",
  },
  rightNav: {
    base: "z-[200]",
  },
  actionSheetBackdrop: "z-[1000]",
  actionSheetBox: "z-[1000]",
  mobileRteToolbar: {
    // should be the same as action sheet. Since newly pushed action sheet should cover this toolbar
    base: 1000,
  },
  floatingLinkEditor: {
    // should be the same as action sheet. Since newly pushed action sheet should cover this link editor
    base: 1000,
  },
  editorTutorial: "z-[2000]",
  rteDropDown: {
    base: 2010,
  }
};

export default rootStackingContext;
