import {FontMetadataReduced} from "@fontsensei/data/raw/googleFonts";

export interface FSFontItem {
  family: string;
  tags: string[];
  metadata: FontMetadataReduced;
}

export interface FSFontFilterOptions {
  filterText: string;
  tagValue: string;
  skip: number;
  take: number;
}
