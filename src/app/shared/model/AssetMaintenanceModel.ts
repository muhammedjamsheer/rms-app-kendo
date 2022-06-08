import { MaintenanceItemsLine } from "./MaintenanceItemsLine";
export class AssetMaintenanceModel {
    maintenanceId!: number;
    serialNo!: string;
    workOrderNo!: string;
    workOrderDate!: Date;
    remarks!: number;
    scannedBy!: string;
    scannedDate!: Date;
    isDeleted!: boolean;
    maintenanceDetails: MaintenanceItemsLine[] = [];
    details: MaintenanceItemsLine[] = [];
}