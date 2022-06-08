import { AssetCategoryMasterModel } from "./AssetCategoryMasterModel";

export class AssetSubCategoryMasterModel {
    assetCategory: AssetCategoryMasterModel = new AssetCategoryMasterModel;
    assetSubCategoryId!: number;
    assetCategoryId!: number;
    assetSubCategoryCode!: string;
    assetSubCategoryName!: string;
    assetSubCategoryShortCode!: string;
    assetCategoryCode!: string;
    assetCategoryName!: string;
    isDeleted!: boolean;
    subCategoryDepreciationPeriod!: string;
    subCategoryDepreciationPercent!: number;
    assetCategoryShortCode!: string;
  nonTag!:boolean;
}