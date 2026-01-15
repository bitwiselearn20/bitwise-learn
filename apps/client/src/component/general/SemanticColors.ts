import { Palette } from "./Palette";

export const Semantic = {
  background: {
    primary: Palette.custom_black_dark,
    secondary: Palette.custom_black_light,
  },

  hero: {
    primary: Palette.custom_green,
    primaryFaded: Palette.custom_blue_faded,
    secondary: Palette.custom_blue,
    secondaryFaded: Palette.custom_blue_faded,
  },

  text: {
    primary: Palette.custom_white,
    secondary: Palette.custom_gray,
    special: Palette.custom_blue,
  },
  
  border: {
    default: Palette.custom_gray,
    faded: Palette.custom_gray_faded,
    special: Palette.custom_blue,
    green: Palette.custom_green,
  },

  icon: {
    primary: Palette.custom_white,
    secondary: "#000000",
    special: Palette.custom_blue,
  },
};
