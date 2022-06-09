
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerMasterService } from '../../../core/service/customermaster.service';
import { InboundService } from '../../../core/service/inbound.service';
import { CommonService } from 'src/app/core/service/common.service';
import { ColDef } from 'ag-grid-community';
import { PurchaseOrderHeader } from '../../../shared/model/inbound.model';
import { ExportService } from '../../../core/exports/export.service';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
declare var $: any;
@Component({
  selector: 'org-rms-purchaseorderreport',
  templateUrl: './purchaseorderreport.component.html',
  styleUrls: ['./purchaseorderreport.component.css']
})
export class PurchaseorderreportComponent implements OnInit {
  @ViewChild('ViewButton') ViewButton!: ElementRef;
  filterForm!: FormGroup;
  loading: boolean = false;
  customerlist: any[] = []
  totalGridCount: number = 0;
  subscription!: Subscription;
  selectedHeader: any;
  isSummaryAllowed: boolean = false;
  isRowUnSelected: boolean = true;
  isPurchaseOrder: boolean = false;
  isPurchaseReturn: boolean = false;
  mastertype!: string;
  screenName!: string;
  rowData: any[] = [];
  summaryLines: any[] = [];
  columnDefs: ColDef[] = [
    { field: 'poNumber', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'poEntry', sortable: true, resizable: true, filter: true, width: 200 },
    { field: 'warehouse', sortable: true, resizable: true, filter: true, width: 200 },
    { field: 'poDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.commonService.dateFormatter },
    { field: 'poDueDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.commonService.dateFormatter },
    { field: 'notes', sortable: true, resizable: true, filter: true, width: 200 },
    { field: 'createdBy', sortable: true, resizable: true, filter: true },
    { field: 'createdDate', sortable: true, resizable: true, filter: true, valueFormatter: this.commonService.dateFormatter },
    { field: 'modifiedBy', sortable: true, resizable: true, filter: true },
    { field: 'modifiedDate', sortable: true, resizable: true, filter: true, valueFormatter: this.commonService.dateFormatter },
  ];
  summarycolumnDefs: ColDef[] = [
    { field: 'productId', sortable: true, filter: true, resizable: true, width: 150 },
    { field: 'productCode', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'poLineDescription', headerName: "Product Description", sortable: true, resizable: true, filter: true, width: 250 },
    { field: 'uomCode', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'uomQty', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'orderQty', sortable: true, resizable: true, filter: true },
    { field: 'receivedQnty', sortable: true, resizable: true, filter: true },
    { field: 'pendingQnty', sortable: true, resizable: true, filter: true },
    { field: 'price', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'priceAfterVAT', sortable: true, resizable: true, filter: true, width: 150 },

  ];
  constructor(
    private formBuilder: FormBuilder,
    private customerMasterService: CustomerMasterService,
    private inboundService: InboundService,
    private exportService: ExportService,
    private commonService: CommonService,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.filterForm = this.formBuilder.group({
      poNumber: [null],
      poEntry: [null],
      docDateFrom: [null],
      docDateTo: [null],
      CardCode: [null],
    });
    this.mastertype = this.router.url;
    this.mastertype = this.mastertype.split("/").slice(-1)[0];
    this.GetScreenDetails(this.mastertype);

    $('.select2bs4').select2();
    this.isSummaryAllowed = localStorage.getItem("isSummaryAllowed") == "true";

    $('[name="customerselect"]').on("change", () => {
      this.formcontrols.CardCode.setValue($('[name="customerselect"]').val());
    });
    this.customerlist = await this.customerMasterService.getCustomersList();
  }
  async GetScreenDetails(type) {
    switch (type) {
      case 'purchaseorderreport':
        this.screenName = "Purchase Order Report";
        this.isPurchaseOrder = true;
        break;
      case 'purchaseorderreturnreport':
        this.screenName = "Purchase Order Return Report";
        this.isPurchaseReturn = true;
        break;
    }
  }
  totalGridItems($event: number) {
    this.totalGridCount = $event;
  }
  get formcontrols() { return this.filterForm.controls; }


  onSearchFilter() {
    this.loading = true
    let saveResponse: Observable<any>;
    if (this.isPurchaseOrder) {
      saveResponse = this.inboundService.getDocumentHeaders(this.filterForm.value);
    } else {
      saveResponse = this.inboundService.getPurchaseReturnReport(this.filterForm.value);
    }
    saveResponse.subscribe({
      next: (data: any) => {
        if (data == null) { this.rowData = [] }
        else { this.rowData = data; }
        this.loading = false;
      },
      error: (err => { this.loading = false; }),
      complete: () => { this.loading = false; }
    });
  }

  onReset() {
    this.filterForm.reset();
    this.rowData = [];
    this.selectedHeader = undefined;
    this.isRowUnSelected = true;
    $('select').select2().trigger('change');
  }
  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
  }
  onRowClick(event: any) {
    this.selectedHeader = event.data;
    this.isRowUnSelected = false;
  }
  OnSummaryClick() {
    if (this.selectedHeader == undefined) { return }
    this.inboundService.getpurchaseorderSummary(this.selectedHeader.poId).subscribe({
      next: (data: any[]) => {
        if (data == null) { this.summaryLines = [] }
        else { this.summaryLines = data; }
        let el: HTMLElement = this.ViewButton.nativeElement as HTMLElement;
        el.click();
      },
      error: (err => { console.error(err) }),
      complete: () => { this.loading = false; }
    });
  }
  getPDF() {
    var data = {
      headerdata: this.selectedHeader,
      griddata: this.summaryLines,
      printtype: 'purchaseorder',
      title: this.screenName
    }
    this.exportService.generatePdf(data);
  };
  getExcel() {
    var data = {
      headerdata: this.selectedHeader,
      griddata: this.summaryLines,
      printtype: 'purchaseorder',
      title: this.screenName
    }
    this.exportService.generateExcel(data);
  };
}
