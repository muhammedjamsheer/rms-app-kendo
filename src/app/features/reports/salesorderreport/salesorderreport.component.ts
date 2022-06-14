import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerMasterService } from '../../../core/service/customermaster.service';
import { SalesorderService } from '../../../core/service/salesorder.service';
import { CommonService } from 'src/app/core/service/common.service';
import { ColDef } from 'ag-grid-community';
import { ExportService } from '../../../core/exports/export.service';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
declare var $: any;
@Component({
  selector: 'org-rms-salesorderreport',
  templateUrl: './salesorderreport.component.html',
  styleUrls: ['./salesorderreport.component.css']
})
export class SalesorderreportComponent implements OnInit {
  @ViewChild('ViewButton') ViewButton!: ElementRef;
  filterForm!: FormGroup;
  loading: boolean = false;
  customerlist: any[] = []
  totalGridCount: number = 0;
  subscription!: Subscription;
  selectedHeader: any;
  isSummaryAllowed: boolean = false;
  isRowUnSelected: boolean = true;
  isSalesOrder: boolean = false;
  isSalesOrderReturn: boolean = false;
  mastertype!: string;
  screenName!: string;
  rowData: any[] = [];
  summaryLines: any[] = [];
  columnDefs: ColDef[] = [
    { field: 'soNumber', sortable: true, resizable: true, filter: true, width: 200 },
    { field: 'soEntry', sortable: true, resizable: true, filter: true, width: 200 },
    { field: 'soDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.commonService.dateFormatter },
    { field: 'soDueDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.commonService.dateFormatter },
    { field: 'cardCode', sortable: true, resizable: true, filter: true },
    { field: 'cardName', sortable: true, resizable: true, filter: true },
    { field: 'customerLocation', sortable: true, resizable: true, filter: true },
    { field: 'docObjectCode', sortable: true, resizable: true, filter: true },
    { field: 'docStatus', sortable: true, resizable: true, filter: true },
    { field: 'externalDocType', sortable: true, resizable: true, filter: true },
    { field: 'journalMemo', sortable: true, resizable: true, filter: true },
    { field: 'numAtCard', sortable: true, resizable: true, filter: true },
    { field: 'vendorName', sortable: true, resizable: true, filter: true },
    { field: 'notes', sortable: true, resizable: true, filter: true, width: 200 },
    { field: 'warehouse', sortable: true, resizable: true, filter: true, width: 200 },
    { field: 'createdBy', sortable: true, resizable: true, filter: true },
    { field: 'createdDate', sortable: true, resizable: true, filter: true, valueFormatter: this.commonService.dateFormatter },
    { field: 'modifiedBy', sortable: true, resizable: true, filter: true },
    { field: 'modifiedDate', sortable: true, resizable: true, filter: true, valueFormatter: this.commonService.dateFormatter },
  ];
  summarycolumnDefs: ColDef[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private customerMasterService: CustomerMasterService,
    private salesorderService: SalesorderService,
    private exportService: ExportService,
    private commonService: CommonService,
    private router: Router,
  ) {

  }
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
      case 'salesorderreport':
        this.screenName = "Sales Order Report";
        this.isSalesOrder = true;
        this.summarycolumnDefs = [
          { field: 'productId', sortable: true, filter: true, resizable: true, width: 150 },
          { field: 'productCode', sortable: true, resizable: true, filter: true, width: 150 },
          { field: 'soLineDescription', headerName: "Product Description", sortable: true, resizable: true, filter: true, width: 250 },
          { field: 'uomCode', sortable: true, resizable: true, filter: true, width: 150 },
          { field: 'uomQty', sortable: true, resizable: true, filter: true, width: 150 },
          { field: 'qntytobeShip', headerName: "Qty to be Ship", sortable: true, resizable: true, filter: true },
          { field: 'shippedQnty', sortable: true, resizable: true, filter: true },
          { field: 'pendingQnty', sortable: true, resizable: true, filter: true },
        ];
        break;
      case 'salesorderreturnreport':
        this.screenName = "Sales Order Return  Report";
        this.isSalesOrderReturn = true;
        this.summarycolumnDefs = [
          { field: 'productId', sortable: true, filter: true, resizable: true, width: 150 },
          { field: 'productCode', sortable: true, resizable: true, filter: true, width: 150 },
          { field: 'soLineDescription', headerName: "Product Description", sortable: true, resizable: true, filter: true, width: 250 },
          { field: 'uomCode', sortable: true, resizable: true, filter: true, width: 150 },
          { field: 'uomQty', sortable: true, resizable: true, filter: true, width: 150 },
          { field: 'qntytobeReceive', headerName: "Qty to be Receive", sortable: true, resizable: true, filter: true, width: 150 },
          { field: 'receivedQnty', sortable: true, resizable: true, filter: true, width: 150 },
          { field: 'pendingQnty', sortable: true, resizable: true, filter: true, width: 150 },
        ];
        break;
    }
  }
  get formcontrols() { return this.filterForm.controls; }

  onSearchFilter() {
    this.loading = true
    this.salesorderService.getSalesOrderReport(this.filterForm.value, this.mastertype).subscribe({
      next: (data: any) => {
        if (data == null) { this.rowData = [] }
        else { this.rowData = data; }
        this.loading = false;
        debugger;
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
    this.summaryLines = []
    let saveResponse: Observable<any>;
    if (this.isSalesOrder) {
      saveResponse = this.salesorderService.getSalesOrderSummary(this.selectedHeader.soId);
    } else {
      saveResponse = this.salesorderService.getSalesOrderReturnSummary(this.selectedHeader.soId);
    }
    saveResponse.subscribe({
      next: (data: any) => {
        if (data != null && data.length > 0) {
          this.summaryLines = data;
        }
      },
      error: (err => { }),
      complete: () => {
        let el: HTMLElement = this.ViewButton.nativeElement as HTMLElement;
        el.click();
      }
    });
  }
  getPDF() {
    var data = {
      headerdata: this.selectedHeader,
      griddata: this.summaryLines,
      printtype: 'salesorder',
      title: this.screenName,
      mastertype: this.mastertype,
      isreport: true
    }
    this.exportService.generatePdf(data);
  };
  getExcel() {
    var data = {
      headerdata: this.selectedHeader,
      griddata: this.summaryLines,
      printtype: 'salesorder',
      title: this.screenName,
      mastertype: this.mastertype,
    }

    this.exportService.generateExcel(data);
  };
}
