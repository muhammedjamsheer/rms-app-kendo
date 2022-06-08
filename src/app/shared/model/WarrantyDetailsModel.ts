export class WarrantyDetailsModel {
    warrantyId!: number;
    serialNo!: string;
    warrantyStartDate!: Date;
    warrantyEndDate!: Date;
    warrantyCost!: number;
    formfile!: FormData;
    isDeleted!: boolean;
    documentId!: string;
}