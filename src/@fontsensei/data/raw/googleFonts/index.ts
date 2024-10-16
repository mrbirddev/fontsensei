type FontDetails = {
  thickness: number;
  slant: number;
  width: number;
  lineHeight: number;
};

export type Font = Record<string, FontDetails>;

export interface FontMetadata {
  family: string;
  displayName: string | null;
  category: string;
  stroke: string;
  classifications: string[];
  size: number;
  subsets: string[];
  fonts: Font;
  axes: any[];
  designers: string[];
  lastModified: string;
  dateAdded: string;
  popularity: number;
  trending: number;
  defaultSort: number;
  androidFragment: string | null;
  isNoto: boolean;
  colorCapabilities: unknown[];
  primaryScript: string;
  primaryLanguage: string;
  isOpenSource: boolean;
  isBrandFont: boolean;
}

