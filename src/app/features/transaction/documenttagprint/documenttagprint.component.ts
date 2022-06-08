import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { AssetRegisterService } from 'src/app/core/service/assetregister.service';
import { PrintLabelService } from 'src/app/core/service/printlabel.service';
import { ReceiptMasterService } from 'src/app/core/service/receiptmaster.service';
import { SupplierMasterService } from 'src/app/core/service/suppliermaster.service';
import { AssetRegisterModel } from 'src/app/shared/model/AssetRegisterModel';
import { ReceiptMasterModel } from 'src/app/shared/model/ReceiptMasterModel';
import { SupplierMasterModel } from 'src/app/shared/model/SupplierMasterModel';
declare var $: any;

@Component({
  selector: 'org-fat-documenttagprint',
  templateUrl: './documenttagprint.component.html',
  styleUrls: ['./documenttagprint.component.css']
})
export class DocumenttagprintComponent implements OnInit {
  selectedItemList: any[] = [];
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  serialNos:string[]=[];
  TagPrintForm: FormGroup;
  isRowSelected: boolean = false;
  isSubmitted: boolean = false;
  columnPrintDefs: any;
  printSaleError = '';
  submitted: boolean = false;
  printLabelDesignCodes!: string[];
  printList!: AssetRegisterModel[];
  suppCodes!: SupplierMasterModel[];
  ReceiptDocNos:ReceiptMasterModel[]=[];
  constructor(private formBuilder: FormBuilder, private printLabelService: PrintLabelService,
     private assetservice: AssetRegisterService,private supplierMasterService: SupplierMasterService,
     private receiptService:ReceiptMasterService
     ) {
    this.TagPrintForm = this.formBuilder.group({
      SupplierSelCode:[null],
      DocumentNo: [null, Validators.required],
      PrintTemplateSelCode: [null, Validators.required],
    });
  }

  async ngOnInit() {
    this.printList = [];
    this.suppCodes = await this.supplierMasterService.getSupplierMaster();
    $('.select2bs4').select2();
    $('[name="SupplierSelCode"]').on("change", async () => {
      this.ReceiptDocNos=[];
      this.selectedItemList=[];
      this.printList=[];
      if($('[name="SupplierSelCode"]').val()!=null)
      {
      this.TagPrintFormControls.SupplierSelCode.setValue($('[name="SupplierSelCode"]').val());
      var receiptData=await this.receiptService.onRefreshReceiptMaster();
      if(receiptData.length>0)
      {
        this.ReceiptDocNos=receiptData.filter(p=>p.supplierId==$('[name="SupplierSelCode"]').val());
      }
      }
    });
    $('[name="PrintTemplateSelCode"]').on("change", () => {
      this.TagPrintFormControls.PrintTemplateSelCode.setValue($('[name="PrintTemplateSelCode"]').val());
    });
    // $('[name="DocumentNo"]').on("change", () => {
    //   if($('[name="DocumentNo"]').val()!=null && $('[name="DocumentNo"]').val()!='')
    //   {
        
    //   }
    //  // this.TagPrintFormControls.DocumentNo.setValue($('[name="DocumentNo"]').val());
    // });
    this.columnPrintDefs = [
      {
        headerName: 'Serial Number', field: 'serialNo', sortable: true, filter: true, resizable: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true
      },
      { headerName: 'Printed Status', field: 'printedStatus', sortable: true, filter: true, resizable: true, singleClickEdit: true, editable: false, },
      { headerName: 'Document No', field: 'receiptId', sortable: true, filter: true, resizable: true, singleClickEdit: true, editable: false, },
      { headerName: 'Category', field: 'assetCategoryName', sortable: true, filter: true, resizable: true, singleClickEdit: true, editable: false, },
      { headerName: 'SubCategory', field: 'assetSubCategoryName', sortable: true, filter: true, resizable: true, singleClickEdit: true, editable: false, },
      { headerName: 'Product Name', field: 'productName', sortable: true, filter: true, resizable: true, singleClickEdit: true, editable: false, },
      { headerName: 'Tag Number', field: 'extrlTagNumber', sortable: true, filter: true, resizable: true, singleClickEdit: true, editable: false, },
      { headerName: 'Location Name', field: 'locationName', sortable: true, filter: true, resizable: true, singleClickEdit: true, editable: false, },
    ];
    this.printLabelDesignCodes = await this.printLabelService.getPrintLabelDesign();

  }

  onPrintRowClick(event: any) {
    this.isRowSelected = true;
  }
  onSelectionChanged(event: any) {
    this.isRowSelected = true;
  }

  onClick(x: any[]) {
    console.log(x);
   if(this.selectedItemList.length>0)
   {
    this.isSubmitted=false;
   }
    console.log(this.selectedItemList);
  }

  get TagPrintFormControls() { return this.TagPrintForm.controls; }
   toHexString(byteArray:any) {
    return Array.from(byteArray, function(byte:any) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
  }
  async ViewClicked() {
    this.isSubmitted = false;
    var documents:any;
    //return;
    if (this.selectedItemList == null || this.selectedItemList.length<=0) {
      this.isSubmitted = true;
      return;
    }
    //documents=$('[name="DocumentNo"]').val();
    //var documentArray=documents.toString().split(',');
    this.printList = await this.assetservice.getAssetDetailsDocument(this.selectedItemList);
  }
  error = '';
  async PrintTag() {
    this.error = '';
    this.submitted = true;
    if (this.TagPrintForm.invalid) {
      return;
    }
    var SelectedTemplateContent = '';
    this.submitted = false;
    let selectedNodes = this.agGrid.api.getSelectedNodes();
    let selectedData = selectedNodes.map<AssetRegisterModel>(node => node.data);
    if (selectedData.length <= 0) {
      this.error = 'Please select atleast one tag';
      return;
    }
var printZPL='';
var finalZPL='';
    var designContent = await this.printLabelService.getPrintLabelDesignData(this.TagPrintFormControls.PrintTemplateSelCode.value);
    designContent=designContent.replace(/\r?\n|\r/g, "</br>"); 
    selectedData.forEach(element => {
      this.serialNos.push(element.serialNo);
      printZPL=designContent;
      var prefix:any;var suffix:any;
      prefix=localStorage.getItem('prefix');
      suffix=localStorage.getItem('suffix');
      var bytes= Buffer.from(prefix + element.serialNo + suffix);
      var text =this.toHexString(bytes);
      console.log(text);
      //var encoded=element.serialNo.getBytes(Charsets.UTF_8);
      printZPL=printZPL.replace('[RFID]',text);
      printZPL=printZPL.replace('[BARCODE]',element.serialNo);
      printZPL=printZPL.replace('[BARCODE]',element.serialNo);
      finalZPL += printZPL;
    });
console.log(finalZPL);
let saveResponse: Observable<any>;
saveResponse = this.printLabelService.updatePrintStatus(this.serialNos);
saveResponse.subscribe(
  async result => {
    this.printList = await this.assetservice.getAssetDetailsDocument(this.TagPrintFormControls.DocumentNo.value);  
    this.agGrid.api.setRowData(this.printList);
    this.agGrid.api.refreshCells();
  },
  err => {
    this.error = err.error ? err.error : err.message;
  }
);

    let printContents, popupWin;
   // printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin?.document.open();
    popupWin?.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();setTimeout(function(){window.close();}, 10000);">${finalZPL}</body>
      </html>`
    );
    popupWin?.document.close();

  }

}
