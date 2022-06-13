export interface InboundFilter{    
    docDateFrom? : Date;
    docDateTo?: Date;
    poNumber:string;
    poEntry:string;
}

export interface PurchaseOrderHeader {
          poEntry: string,
          poNumber:string,
          externalDocType: string,
          poDate:string,
          poDueDate: string,
          cardCode:string,
          cardName: string,
          vendorName:string,
          warehouse:string,
          numAtCard: string,
          notes: string,
          createdBy:string,
          createdDate: string,
          modifiedBy:string,
          modifiedDate: string,
          docStatus: string,
          poId:number
       
}



export interface PurchaseDocumentLines {
 
        poLineNumber:string,
        productId: string,
        productCode: string,
        poLineDescription: string,
        warehouseCode: string,
        orderQty: string,
        openQty: string,
        uomCode: string,
        taxCode: string,
        uomQty: string,
        noOfLabels: number,
        qntyValidate: number,
        print: string,
        price:string,
        priceAfterVAT: string,
        lineTotal: string,
        vatGroup: string,
         
}