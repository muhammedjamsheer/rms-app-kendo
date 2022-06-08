export class PickListModel {
    createdBy!: string;
    docType!:number;
    docNumber!: string;
    docEntry!: string;
    OperationType!: string;
    fromWarehouse!: string;
    toWarehouse!: string;
    customerLocation!: string;
    remarks!: string;
    documentLines!: DocumentModel[]
}
export class DocumentModel {
    lineNumber!: string;
    productId!: number;
    pickQuantity!: number;
    UomCode!: string;
    uomQtytoPick!: number;
    lineDescription!: string;
    fromWarehouse!: string;
}

export interface ProductionOrderDocumentLines {
completedQuantity: number
createdBy: string
createdDate:Date
dueDate:Date
modifiedBy: null
modifiedDate: Date
noOfLabels: number
plannedQuantity: number
postingDate: Date
productCode: string
productDescription: string
productId: string
productionEntry:string
productionNumber: string
uomCode: string
uomQnty: number
warehouseCode: string
     
}