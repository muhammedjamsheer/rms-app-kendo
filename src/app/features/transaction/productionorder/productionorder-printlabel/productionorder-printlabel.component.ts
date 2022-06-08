import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductionorderService } from '../../../../core/service/productionorder.service';
import { PickListModel } from 'src/app/shared/model/productionorder';
import { ColDef } from 'ag-grid-community';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { PicklistService } from '../../../../core/service/picklist.service';
import { ProductionOrderDocumentLines } from '../../../../shared/model/productionorder';
import { PrintLabelService } from 'src/app/core/service/printlabel.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'org-rms-productionorder-printlabel',
  templateUrl: './productionorder-printlabel.component.html',
  styleUrls: ['./productionorder-printlabel.component.css']
})
export class ProductionorderPrintlabelComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  productionorderdetails: any[] = []
  submitted: boolean = false;
  loading: boolean = false;
  showzerocountvalidation: boolean = false;
  rowcountform!: FormGroup;
  totalGridCount: number;
  printLabelDesignCodes!: string[];
  errorMessage: string = ''
  columnDefs: ColDef[] = [
    {
      field: 'productionNumber', sortable: true, filter: true, resizable: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true, width: 250
    },
    { field: 'productionEntry', sortable: true, resizable: true, filter: true },
    { field: 'productId', sortable: true, resizable: true, filter: true },
    { field: 'productCode', sortable: true, resizable: true, filter: true },
    { field: 'productDescription', sortable: true, resizable: true, filter: true },
    { field: 'plannedQuantity', sortable: true, resizable: true, filter: true },
    { field: 'completedQuantity', sortable: true, resizable: true, filter: true },
    { field: 'uomCode', sortable: true, resizable: true, filter: true },
    { field: 'uomQnty', sortable: true, resizable: true, filter: true },
    { field: 'noOfLabels', sortable: true, resizable: true, filter: true },
    { field: 'warehouseCode', sortable: true, resizable: true, filter: true },
    { field: 'dueDate', sortable: true, resizable: true, filter: true, valueFormatter: this.dateFormatter },
    { field: 'postingDate', sortable: true, resizable: true, filter: true, valueFormatter: this.dateFormatter },
    { field: 'createdBy', sortable: true, resizable: true, filter: true },
    { field: 'createdDate', sortable: true, resizable: true, filter: true, valueFormatter: this.dateFormatter },
    { field: 'modifiedBy', sortable: true, resizable: true, filter: true },
    { field: 'modifiedDate', sortable: true, resizable: true, filter: true, valueFormatter: this.dateFormatter },
  ];

  constructor(
    private route: ActivatedRoute,
    private productionorderService: ProductionorderService,
    private formBuilder: FormBuilder,
    private printLabelService: PrintLabelService, private datePipe: DatePipe,
  ) { }


  dateFormatter(params: any) {
    if (params.value) {
      var dateVal = new Date(params.value);
      if (dateVal)
        return `${dateVal.getDate().toString().padStart(2, '0')}-${(dateVal.getMonth() + 1).toString().padStart(2, '0')}-${dateVal.getFullYear()}`;
      else
        return '';
    }
    else
      return '';
  }
  async ngOnInit() {
    this.rowcountform = this.formBuilder.group({
      PrintTemplateSelCode: [null, Validators.required]
    });
    await this.getProductionOrderdetails();
    this.printLabelDesignCodes = await this.printLabelService.getPrintLabelDesign();
    if (this.printLabelDesignCodes.length == 1) {
      this.formcontrols.PrintTemplateSelCode.setValue(this.printLabelDesignCodes[0]);
    }
  }
  getProductionOrderdetails() {
    this.productionorderService.getPOprintlabels().subscribe({
      next: (data: any) => {
        this.productionorderdetails = data;
        this.totalGridCount = this.productionorderdetails.length
      },
      error: (err => { console.error(err) }),
      complete: () => { }
    });
  }
  onSelectionChanged(event: any) {
    // let selectedNodes = this.agGrid.api.getSelectedNodes();
    // this.selectednodes = selectedNodes.map<any>(node => node.data);
    // this.showzerocountvalidation = true;
    // if (this.selectednodes.length > 0) {
    //   this.showzerocountvalidation = false;
    // }
  }
  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
  }
  get formcontrols() { return this.rowcountform.controls; }

  async PrintLabel() {
    this.submitted = true;
    if (this.rowcountform.invalid) {
      return;
    }
    let selectedNodes = this.agGrid.api.getSelectedNodes();
    let selectedData = selectedNodes.map<ProductionOrderDocumentLines>(node => node.data);
    if (selectedData.length <= 0) {
      this.errorMessage = "* Please select any production order to proceed.";
      this.showzerocountvalidation = true;
      return;
    }
    this.showzerocountvalidation = false;
    this.errorMessage = '';
    this.loading = true;
    var printZPL = '';
    var finalZPL = '';
    var designContent = await this.printLabelService.getPrintLabelDesignData(this.formcontrols.PrintTemplateSelCode.value);
    designContent = designContent.replace(/\r?\n|\r/g, "</br>");
    var noofquantitytoprint = selectedData.length;
    for (let j = 0; j < selectedData.length; j++) {
      printZPL = designContent;
      var sPrintArr: string[] = [];
      sPrintArr.push(selectedData[j].productId, "0", selectedData[j].productionNumber, selectedData[j].uomCode, (selectedData[j].uomQnty).toString())
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
      printZPL = printZPL.replace('[PRODUCTDESCRIPTION]', selectedData[j].productDescription);
      // nedd to change  MATERIALRECEIVEDDATE
      // printZPL = printZPL.replace('[MATERIALRECEIVEDDATE]', this.datePipe.transform(new Date(), "ddMMyy") + selectedData[j].vatGroup);
      finalZPL += printZPL;
      printZPL = '';
      if (j == noofquantitytoprint - 1) {
        await this.PrintOut(finalZPL);
        this.loading = false;
      }
    }
  }
  async PrintOut(params: any) {
    let popupWin;
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
   <body onload="window.print();setTimeout(function(){window.close();}, 10000);">${params}</body>
     </html>`
    );
    popupWin?.document.close();
    this.loading = false;
  }
}
