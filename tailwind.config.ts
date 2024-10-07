import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx","./src/**/*.ts","./src/**/*.md","./src/**/*.mdx"],
  darkMode: "class",
  theme: {
    // extend: {
    //   fontFamily: {
    //     sans: ["var(--font-sans)", ...fontFamily.sans],
    //   },
    // },
  },
  daisyui: {
    themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "light", // use nightwind to switch? https://github.com/jjranalli/nightwind/issues/82
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/typography"),
    // require("nightwind"),
  ]
} satisfies Config;
