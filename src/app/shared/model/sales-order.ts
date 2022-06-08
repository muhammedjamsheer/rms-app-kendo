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
export class CancelPicklist {
    createdBy!: string;
    pickListNumber!: string;
    remarks!: any;
}