import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { DatePipe } from '@angular/common';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PurchaseDocumentLines, PurchaseOrderHeader } from '../../../../shared/model/inbound.model';
import { InboundService } from '../../../../core/service/inbound.service';
import { DownloadService } from '../../../../core/service/download.service';
import { dateFormatter } from 'src/app/_helpers/utils';
import { Observable } from 'rxjs';
import { PrintLabelService } from 'src/app/core/service/printlabel.service';
import { CommonService } from 'src/app/core/service/common.service';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
declare var $: any;
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Console } from 'console';
@Component({
  selector: 'app-inbound-detail',
  templateUrl: './inbound-detail.component.html',
  styleUrls: ['./inbound-detail.component.scss']
})
export class InboundDetailComponent implements OnInit, OnChanges {

  rowcountform!: FormGroup;
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  @Input() docHeader!: PurchaseOrderHeader;
  @Output() printedDocument = new EventEmitter<boolean>();
  detailLines!: PurchaseDocumentLines[];
  imageSource!: any;
  imageId!: string;
  TotalQnty: any
  rescode!: string
  LocCode: any
  Dtfrmt: any
  SeqNo: any
  ProductLen: any
  labelDesignDataCache: string[] = [];
  private gridApi: any;
  private gridColumnApi: any;
  serialNos: string[] = [];
  isSubmitted: boolean = false;
  columnPrintDefs: any;
  printSaleError = '';
  submitted: boolean = false;
  printLabelDesignCodes!: string[];
  previewImage!: SafeStyle;
  rowClassRules: any;
  validationmessage!: string;
  showvalidation: boolean = false;
  startprinting: boolean = false;
  selectedPO: any[] = [];
  columnDefs: ColDef[] = [
    {
      headerName: 'ProductId', field: 'productId', sortable: true, filter: true, resizable: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
    },
    { field: 'poLineNumber', sortable: true, resizable: true, filter: true, width: 100 },
    { field: 'productCode', sortable: true, resizable: true, filter: true, width: 130 },
    { field: 'uomCode', sortable: true, resizable: true, filter: true, width: 130 },
    { field: 'uomQty', sortable: true, resizable: true, filter: true, width: 130 },
    {
      field: 'noOfLabels', sortable: true, resizable: true, filter: true, width: 150, editable: true,
      singleClickEdit: true,
      valueParser: params => this.commonService.formatIntoNumericvalues(params.newValue),
      cellStyle: params => {
        return { backgroundColor: '#bed3d7' };
      }
    },
    { field: 'openQty', headerName: "Quantity", sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'orderQty', headerName: "Packaging Qty", sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'price', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'priceAfterVAT', sortable: true, resizable: true, filter: true },
    { field: 'poLineDescription', sortable: true, resizable: true, filter: true, width: 150 },
  ];
  constructor(private service: InboundService, private formBuilder: FormBuilder,
    private printLabelService: PrintLabelService, private datePipe: DatePipe,
    private commonService: CommonService
  ) {
    this.rowcountform = this.formBuilder.group({
      PrintTemplateSelCode: [null, Validators.required]
    });
    this.getLabelDesign();
  }

  private async getLabelDesign() {
    this.printLabelDesignCodes = await this.printLabelService.getPrintLabelDesign();
    if (this.printLabelDesignCodes.length == 1) {
      this.rowcountformcontrol.PrintTemplateSelCode.setValue(this.printLabelDesignCodes[0]);
    }
  }
  async ngOnInit(): Promise<void> {
    this.onRefresh();
  }
  get rowcountformcontrol() { return this.rowcountform.controls; }

  ngOnChanges(_changes: SimpleChanges): void {
   this.onRefresh();

  }
  countDisplayedRows(params: any) {
    // this.lblName = params.api.getDisplayedRowCount();
    // console.log(params.api.getDisplayedRowCount());

  }
  get formcontrols() { return this.rowcountform.controls; }
  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  onRefresh() {
    this.service.getDocumentprintDetails(this.docHeader.poNumber).subscribe(
      (data: PurchaseDocumentLines[]) => {
        this.detailLines = data;
        let Qnty = 0
        for (let data of this.detailLines) {
          //Qnty += data.quantity;

        }
        this.TotalQnty = Qnty;
        console.log(data.length);
      },
      (err => { console.error(err) }));
  }
  onPrintRowClick(event: any) {

  }
  onChangePrintTemplate(event: any) {
    this.onSelectionChanged(event)
  }
  onSelectionChanged(event: any) {
    let selectedNodes = this.agGrid.api.getSelectedNodes();
    this.selectedPO = selectedNodes.map<PurchaseDocumentLines>(node => node.data);
  }
  async PrintTag() {
    this.submitted = true;
    if (this.rowcountform.invalid) {
      return;
    }
    this.showvalidation = false;
    this.validationmessage = "";
    let selectedNodes = this.agGrid.api.getSelectedNodes();
    let selectedData = selectedNodes.map<PurchaseDocumentLines>(node => node.data);
    if (selectedData.length == 0) {
      this.showvalidation = true;
      this.validationmessage = "* Please select any purchase order to proceed."
      return
    } else {
      selectedData.forEach(element => {
        if (isNaN(element.noOfLabels) || Number(element.noOfLabels) <= 0 || Number(element.noOfLabels) > Number(element.orderQty)) {
          this.showvalidation = true;
          this.validationmessage = "* Please enter a valid label count for productid " + element.productId;
          return
        }
      });
      if (this.showvalidation) {
        return
      }
    }
    this.showvalidation = false;
    this.validationmessage = "";
    this.startprinting = true;
    var printZPL = '';
    var finalZPL = '';
    var designContent = await this.printLabelService.getPrintLabelDesignData(this.rowcountformcontrol.PrintTemplateSelCode.value);
    designContent = designContent.replace(/\r?\n|\r/g, "</br>");
    var index = selectedData.length;
    var startedindex = 1;
    for (let j = 0; j < selectedData.length; j++) {
      var qnty = 0;
      var ProductId = selectedData[j].productId;
      var qnty = selectedData[j].noOfLabels;
      let i = 0
      do {
        printZPL = designContent;
        var sPrintArr: string[] = [];
        sPrintArr.push(ProductId, selectedData[j].poLineNumber, this.docHeader.poNumber, selectedData[j].uomCode, selectedData[j].uomQty)
        var encodedrfiddata = await this.printLabelService.getGeneratedSerailNo(sPrintArr);
        var x: any;
        x = encodedrfiddata.split('|');
        printZPL = printZPL.replace('[LOCCODE]', x[0]);
        printZPL = printZPL.replace('[PRODUCTID]', x[1]);
        printZPL = printZPL.replace('[DDMMYY]', x[2]);
        printZPL = printZPL.replace('[SEQNO]', x[3]);
        printZPL = printZPL.replace('[RFID]', encodedrfiddata.replace(/[|]/g, ''));
        printZPL = printZPL.replace('[BARCODE]', encodedrfiddata.replace(/[|]/g, ''));
        printZPL = printZPL.replace('[BARCODE1]', selectedData[j].productCode);
        printZPL = printZPL.replace('[PRODUCTCODE]', selectedData[j].productCode);
        printZPL = printZPL.replace('[PRODUCTDESCRIPTION]', selectedData[j].poLineDescription);
        printZPL = printZPL.replace('[PRICE]', selectedData[j].price);
        printZPL = printZPL.replace('[INVENTORYUOM]', selectedData[j].uomCode);
        // printZPL = printZPL.replace('[INVENTORYUOM]', selectedData[j].inventoryUOM);
        // printZPL = printZPL.replace('[CATEGORY]', selectedData[j].category);
        // printZPL = printZPL.replace('[ASSETSTATUS]', selectedData[j].assetStatus);
        // printZPL = printZPL.replace('[ITEMSGROUPCODE]', selectedData[j].itemsGroupCode);
        // printZPL = printZPL.replace('[PURCHASEITEMPERUNIT]', selectedData[j].purchaseItemsPerUnit);
        // nedd to change  MATERIALRECEIVEDDATE
        printZPL = printZPL.replace('[MATERIALRECEIVEDDATE]', this.datePipe.transform(new Date(), "ddMMyy") + selectedData[j].vatGroup);
        finalZPL += printZPL;
        printZPL = '';
        i++;
      }
      while (i < qnty);
      if (startedindex == index) {
        console.log('output' + finalZPL);
        await this.PrintOut(finalZPL);
        this.printedDocument.emit(true);
      }
      startedindex++;
    }
  }

  async PrintOut(params: any) {
    let popupWin;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin?.document.open();
    popupWin?.document.write(`
     <html>
       <head>
         <style>
         @page { size: auto;  margin: 0mm; }
         </style>
       </head>
       <body onload="window.print();setTimeout(function(){window.close();}, 10000);">${params}</body>
     </html>`
    );
    popupWin?.document.close();
    this.agGrid.api.deselectAll();
    this.submitted = false
    this.startprinting = false;
  }


}
