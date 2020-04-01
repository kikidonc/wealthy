export interface Portfolio {
  portfolioValue?: number;
  assetCategoryList?: AssetCategory[];
  portfolioHistory?: Positions[];
}

export interface AssetCategory {
  categoryName: string;
  categoryValue: number;
}


export interface Positions {
  period: number;
  value: number;
}

