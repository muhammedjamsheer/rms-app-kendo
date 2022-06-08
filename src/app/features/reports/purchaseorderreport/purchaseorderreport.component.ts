
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerMasterService } from '../../../core/service/customermaster.service';
import { InboundService } from '../../../core/service/inbound.service';
import { ReceiptMasterService } from '../../../core/service/receiptmaster.service';
import { CommonService } from 'src/app/core/service/common.service';
import { ColDef } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { PurchaseOrderHeader } from '../../../shared/model/inbound.model';
import { ExportService } from '../../../core/exports/export.service';
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
    { field: 'poLineDescription', headerName: "Product Description", sortable: true, resizable: true, filter: true, width: 150 },
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
  ) { }

  async ngOnInit() {
    $('.select2bs4').select2();
    this.isSummaryAllowed = localStorage.getItem("isSummaryAllowed") == "true";
    this.filterForm = this.formBuilder.group({
      poNumber: [null],
      poEntry: [null],
      docDateFrom: [null],
      docDateTo: [null],
      CardCode: [null],
    });
    $('[name="customerselect"]').on("change", () => {
      this.formcontrols.CardCode.setValue($('[name="customerselect"]').val());
    });
    this.customerlist = await this.customerMasterService.getCustomersList();
  }
  totalGridItems($event: number) {
    this.totalGridCount = $event;
  }
  get formcontrols() { return this.filterForm.controls; }
  async onSearchPurchaseOrder() {
    this.loading = true;
    this.inboundService.getDocumentHeaders(this.filterForm.value)
      .subscribe({
        next: (data: PurchaseOrderHeader[]) => {
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
      title: 'Purchase Order Summary Report'
    }
    this.exportService.generatePdf(data);

  };

}
