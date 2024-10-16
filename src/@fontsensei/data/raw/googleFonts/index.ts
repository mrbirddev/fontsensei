type FontDetails = {
  thickness: number;
  slant: number;
  width: number;
  lineHeight: number;
};

export type Font = Record<string, FontDetails>;

export type AxesItem = {
  tag: 'opsz' | 'wght' | 'YTLC' | 'wdth';
  min: number;
  max: number;
  defaultValue: number;
}

export interface FontMetadata {
  family: string;
  displayName: string | null;
  category: string;
  stroke: string;
  classifications: string[];
  size: number;
  subsets: string[];
  fonts: Font;
  axes: AxesItem[];
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

export interface FontMetadataReduced {
  defaultSuffix: string;
  designers: string[];
}

