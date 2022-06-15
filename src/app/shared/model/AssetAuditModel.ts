import { AssetAuditVerifyModel } from "./AssetAuditVerifyModel";

export class AssetAuditModel {
  auditId!: number;
  toBeAuditedOn!: Date;
  remark!: string;
  auditStatus!: number;
  auditStatusText!: string;
  locations!: string[];
  subCategories!: string[];
  isDeleted!: boolean;
  createdBy!: string;
  createdDate!: Date;
  modifiedBy!: string;
  modifiedDate!: Date;
  serialNos!: AssetAuditVerifyModel[];
}

export class AuditSummary{
  locationName!:string;
  productCode!:string;
  productDescription!:string;
  category!:string;
  quantity!:number;
}