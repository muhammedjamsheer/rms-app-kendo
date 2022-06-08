import { AssetTransferLineItemModel } from "./AssetTransferLineItemModel";

export class AssetTransferDirectModel {
    transferNo!: string;
    transferDate!: Date;
    serialNo!: string;
    toDepartmentID!: number;
    toEmployeeId!: number;
    toLocationId!: number;
    remarks!: string;
    transferType!: number;
    transferTypeDesc!: string;
    status!: number;
    toDepartmentCode!: string;
    toDepartmentName!: string;
    toEmpCode!: string;
    toEmpFirstName!: string;
    toEmpLastName!: string;
    toLocationCode!: string;
    toLocationName!: string;
    requestNo!: string;
    documentIds!: string;
    statusText!: string;
    lines: AssetTransferLineItemModel[] = [];
}

export class AssetTransferVerifyModel
{
    transferNo!:string;
    status!:number;
    verificationRemark!:string;
    serialNos:string[]=[];
}