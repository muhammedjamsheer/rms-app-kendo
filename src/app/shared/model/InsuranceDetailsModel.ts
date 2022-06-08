export class InsuranceDetailsModel {
    insuranceId!: number;
    serialNo!: string;
    insuranceStartDate!: Date;
    insuranceEndDate!: Date;
    insuranceName!: string;
    insuranceValue!: number;
    formfile!: FormData;
    isDeleted!: boolean;
    documentId!: string;
}