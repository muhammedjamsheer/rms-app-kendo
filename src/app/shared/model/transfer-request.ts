export class TransferRequestModel {
    requestNo!: string;
    requestDate!: Date;
    requestedBy!: string;
    fromWarehouse!: number;
    toWarehouse!: number;
    remarks!: string;
    requestLines: ProductTransferLineItemModel[] = [];



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
    createdBy!: string;
    fromLocationCode!: string;
    fromLocationName!: string;
}
export class ProductTransferLineItemModel {
    productId!: number;
    quantity!: number;
}
export class transferLineItemModel {
    productId !:number;
    productCode !:string
    productDescription !:string;
    category !:string
    quantity !:number
}

