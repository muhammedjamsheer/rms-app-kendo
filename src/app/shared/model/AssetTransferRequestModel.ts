import { AssetTransferLineItemModel } from "./AssetTransferLineItemModel";

export class AssetTransferRequestModel {
    requestNo!: string;
    requestDate!: Date;
    requestedBy!: string;
    fromLocationId!: number;
    toEmployeeId!: number;
    toLocationId!: number;
    remarks!: string;
    toDepartmentID!: number;
    toDepartmentCode!: string;
    toDepartmentName!: string;
    toEmpCode!: string;
    toEmpFirstName!: string;
    toEmpLastName!: string;
    toLocationCode!: string;
    toLocationName!: string;
    requestedByEmpCode!: string;
    requestedByEmpFirstName!: string;
    requestedByEmpLastName!: string;
    status!: number;
    verifiedBy!: string;
    verifiedDate!: Date;
    verificationRemark!: string;
    requestLines: AssetTransferLineItemModel[] = [];
    createdBy!: string;
    fromLocationCode!: string;
    fromLocationName!: string;

    
    toWarehouseCode!: string;
    toWarehouseName!: string;
    fromWarehouseCode!: string;
    fromWarehouseName!: string;
}