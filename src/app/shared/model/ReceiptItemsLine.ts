export class ReceiptItemsLine{
    receiptId!: string;
    receiptLineId!: number;
    productId!: number;
    productCode!: string;
    productName!: string;
    productDescription!: string;
    //assetProductId!: number;
    quantity!: number;
    manufacturePartNo!: string;
    purchasePrice!: number;
    /*assetCategoryId!: number;
    assetCategoryCode!: string;
    assetCategoryName!: string;
    assetSubCategoryId!: number;
    assetSubCategoryCode!: string;
    assetSubCategoryName!: string;*/
    modelId!: number;
    modelCode!: string;
    modelName!: string;
    brandId!: number;
    brandCode!: string;
    brandName!: string;
    assetStatusId!: string;
    assetStatusValue!: string;
    assetStatusDisplayText!: string;
    assetConditionId!: string;
    assetConditionValue!: string;
    assetConditionDisplayText!: string;
    isDeleted!: boolean;
    /*Added to display serial no of Receipt By Barcode/RFID */
    serialNo!:string;
    extrlTagNumber!:string;
    manufactureSerialNo!:string;
    ownerId!:number;
    employeeId!:number;
    locationId!:number;
    ownerName!:string;
    employeeName!:string;
    locationName!:string;
    imageId!:string;
    imageUrl!:string;
}