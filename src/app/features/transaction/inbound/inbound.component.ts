import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InboundService } from '../../../core/service/inbound.service';
import { getTodayEndTime, getTodayStartTime } from 'src/app/_helpers/utils';
import { CustomerMasterService } from '../../../core/service/customermaster.service';
import { PurchaseDocumentLines, PurchaseOrderHeader } from '../../../shared/model/inbound.model';

declare var $: any;
@Component({
  selector: 'app-inbound',
  templateUrl: './inbound.component.html',
  styleUrls: ['./inbound.component.scss']
})
export class InboundComponent implements OnInit {
  @ViewChild('ViewButton') ViewButton!: ElementRef;
  localData!: PurchaseOrderHeader[];
  filteredData!: PurchaseOrderHeader[];
  filterForm!: FormGroup;
  showFilters: boolean = true;
  loading: boolean = false;
  customerlist: any[] = []
  detailLines!: PurchaseDocumentLines[];

  constructor(private service: InboundService, private formBuilder: FormBuilder, private customerMasterService: CustomerMasterService,) {
    this.filterForm = this.formBuilder.group({
      poNumber: [null],
      poEntry: [null],
      docDateFrom: [null],
      docDateTo: [null],
      CardCode: [null],
    });
  }
  get SelectedDoc(): PurchaseOrderHeader | null {
    return this.service.selectedDoc;
  }
  set SelectedDoc(value: PurchaseOrderHeader | null) {
    this.service.selectedDoc = value;
  }

  async ngOnInit() {
    $('.select2bs4').select2();
    this.customerlist = await this.customerMasterService.getCustomersList();
    if (this.service.filters != undefined)
      this.filterForm.setValue(this.service.filters);
    this.fetchData();
    $('[name="customerselect"]').on("change", () => {
      this.formcontrols.CardCode.setValue($('[name="customerselect"]').val());
    });
  }
  onRefresh() {
    this.SelectedDoc = null;
    this.fetchData();
  }
  triggerClick() {
    let el: HTMLElement = this.ViewButton.nativeElement as HTMLElement;
    el.click();
  }
  get formcontrols() { return this.filterForm.controls; }
  fetchData() {
    this.loading = true;
    this.service.getDocumentHeaders(this.filterForm.value).subscribe({
      next: (data: PurchaseOrderHeader[]) => {
        if (data == null) {
          this.localData = [];
          this.filteredData = [];
        } else {
          this.localData = data;
          this.filteredData = data;
        }
      },
      error: (err => { console.error(err) }),
      complete: () => { this.loading = false; }
    });
  }

  onReset() {
    this.filterForm.reset();
    $('select').select2().trigger('change');
    this.fetchData();
  }

  docSelected(userClickedDoc: PurchaseOrderHeader) {
    this.SelectedDoc = userClickedDoc;
    this.detailLines = [];
    this.service.getDocumentprintDetails(this.SelectedDoc.poNumber).subscribe(
      (data: PurchaseDocumentLines[]) => {
        if (data != null && data.length > 0) {
          this.detailLines = data;
        }
      },
      (err => { console.error(err) }));
    this.triggerClick();
  }

  onFilterToggle(event: Event) {
    this.showFilters = !this.showFilters;
    event.stopPropagation();
  }

  onSearch(event: any) {
    if (event.target.value) {
      this.filteredData = this.localData.filter(x => x.poNumber.includes(event.target.value))
    }
    else {
      this.filteredData = this.localData;
    }
    event.stopPropagation();
  }

  onOnlyPendingChanged(event: any) {
    if (event.target.value)
      this.filterForm.patchValue({ docDateFrom: null, docDateTo: null })
  }
  onFirstDataRendered(params: any) {
    //params.api.sizeColumnsToFit();
    //params.api.autoSizeAllColumns();
  }

  getRowHeight(params: any) {
    return 40;
  }
  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
    console.log(params.api.getDisplayedRowCount());
    console.log(params.api.getDisplayedRowCount());
    console.log(params.api.getModel().getRowCount());
    console.log("hfhhffh");
  }
  onprintDocument($event: boolean) {
    if ($event) { this.fetchData(); }
  }
}
