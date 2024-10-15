export interface FSFontItem {
  family: string;
  tags: string[];
}

export interface FSFontFilterOptions {
  filterText: string;
  tagValue: string;
  skip: number;
  take: number;
}
