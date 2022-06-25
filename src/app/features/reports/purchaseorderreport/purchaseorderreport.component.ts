
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerMasterService } from '../../../core/service/customermaster.service';
import { InboundService } from '../../../core/service/inbound.service';
import { CommonService } from 'src/app/core/service/common.service';
import { ColDef } from 'ag-grid-community';
import { ExportService } from '../../../core/exports/export.service';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SelectableSettings, SelectableMode, SelectionEvent } from "@progress/kendo-angular-grid";
import { CompositeFilterDescriptor, filterBy, process } from '@progress/kendo-data-query';
declare var $: any;
@Component({
  selector: 'org-rms-purchaseorderreport',
  templateUrl: './purchaseorderreport.component.html',
  styleUrls: ['./purchaseorderreport.component.css']
})
export class PurchaseorderreportComponent implements OnInit {
  @ViewChild('ViewButton') ViewButton!: ElementRef;
  filterForm!: FormGroup;
  shortdateformatpipe: string;
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
  localData: any[] = [];
  public selectableSettings: SelectableSettings = {
    mode: 'single',
  };
  summaryLines: any[] = [];
  showDialogue: boolean = false;
  public filter!: CompositeFilterDescriptor;
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
    this.shortdateformatpipe = environment.shortdateformatpipe
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
        else { this.rowData = data; this.localData = data; }
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
    this.summaryLines = []
    let saveResponse: Observable<any>;
    if (this.isPurchaseOrder) {
      saveResponse = this.inboundService.getpurchaseorderSummary(this.selectedHeader.poId);
    } else {
      saveResponse = this.inboundService.getpurchaseorderReturnSummary(this.selectedHeader.poId);
    }
    saveResponse.subscribe({
      next: (data: any) => {
        if (data != null && data.length > 0) {
          this.summaryLines = data;
        }
      },
      error: (err => { }),
      complete: () => {
        this.showDialogue = true;
      }
    });
  }
  getPDF() {
    var data = {
      headerdata: this.selectedHeader,
      griddata: this.summaryLines,
      printtype: 'purchaseorder',
      title: this.screenName,
      reporttype: this.isPurchaseOrder ? 'purchaseorder' : 'purchaseorderreturn'
    }
    this.exportService.generatePdf(data);
  };
  getExcel() {
    var data = {
      headerdata: this.selectedHeader,
      griddata: this.summaryLines,
      printtype: 'purchaseorder',
      title: this.screenName,
      mastertype: this.mastertype
    }
    this.exportService.generateExcel(data);
  };

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.rowData = filterBy(this.localData, filter);
  }

  keyChange(selectedrows: any) {
    this.selectedHeader = this.rowData.find(x => x.poNumber == selectedrows[0]);
    this.isRowUnSelected = false;
  }
}
