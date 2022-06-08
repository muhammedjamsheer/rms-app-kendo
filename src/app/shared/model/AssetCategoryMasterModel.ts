export class AssetCategoryMasterModel {
  assetCategoryId!: number;
  assetCategoryCode!: string;
  assetCategoryName!: string;
  assetCategoryShortCode!: string;
  isDeleted!: boolean;
  categoryDepreciationPeriod!: string;
  categoryDepreciationPercent!: number;
  nonTag!:boolean;

  /*
  constructor(public assetCategoryId: number | any,
    public assetCategoryCode: string | any,
    public assetCategoryName: string | any,
    public assetCategoryShortCode: string | any,
    public isDeleted: boolean | any,
    public categoryDepreciationPeriod: string | any,
    public categoryDepreciationPercent: number | any) {
  }   */
}