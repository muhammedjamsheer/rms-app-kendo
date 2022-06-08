import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReceiptMasterService } from '../../../../core/service/receiptmaster.service';
import { DatePipe } from '@angular/common';
import { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { Subscription, Observable } from 'rxjs';
import { ExportService } from '../../../../core/exports/export.service';
@Component({
  selector: 'org-rms-receiptdetails',
  templateUrl: './receiptdetails.component.html',
  styleUrls: ['./receiptdetails.component.css']
})
export class ReceiptdetailsComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  selectedHeader: any;
  subscription!: Subscription;
  receiptId!: number;
  receiptType!: string;
  loading: boolean = false;
  receiptdetails: any;
  itemLines: any[] = [];
  detailsForm!: FormGroup;
  totalGridCount: number = 0
  screenname!: string;
  isReceiptsummary: boolean = false;
  isReceiptdetails: boolean = false;

  columnDefs: ColDef[] = [
    { field: 'receiptId', sortable: true, resizable: true, filter: true },
    { field: 'serialNo', sortable: true, resizable: true, filter: true, width: 300 },
    { field: 'productId', sortable: true, resizable: true, filter: true },
    { field: 'productCode', sortable: true, resizable: true, filter: true },
    { field: 'productDescription', sortable: true, resizable: true, filter: true },
    { field: 'batchNo', sortable: true, resizable: true, filter: true },
    { field: 'uomCode', sortable: true, resizable: true, filter: true },
    { field: 'uomQnty', sortable: true, resizable: true, filter: true },
    { field: 'purchasePrice', sortable: true, resizable: true, filter: true },
  ];
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private receiptMasterService: ReceiptMasterService,
    private formBuilder: FormBuilder,
    private saveAlert: SaveAlert,
    private datePipe: DatePipe,
    private exportService: ExportService,
  ) {
    this.subscription = this.receiptMasterService.selectedrowevent.subscribe((e) => {
      this.selectedHeader = e.data;
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.receiptId = Number(params['id']);
        this.receiptType = params['state'];
      }
    });
    this.detailsForm = this.formBuilder.group({
      DocumentType: [null],
      DocumentNo: [null],
      Grn: [null],
      DocumentDate: [null],
      receiptDate: [null],
      receiptStatus: [null],
    });
    this.getscreendetails()
    this.getReceiptdetails();
  }
  getscreendetails() {
    switch (this.receiptType) {
      case 'summary': {
        this.screenname = 'Receipt Summary';
        this.isReceiptsummary = true;
        this.columnDefs = [
          { field: 'receiptId', sortable: true, resizable: true, filter: true },
          { field: 'productId', sortable: true, resizable: true, filter: true },
          { field: 'productCode', sortable: true, resizable: true, filter: true },
          { field: 'productDescription', sortable: true, resizable: true, filter: true },
          { field: 'orderQnty', sortable: true, resizable: true, filter: true },
          { field: 'receivedQnty', sortable: true, resizable: true, filter: true },
          { field: 'pendingQnty', sortable: true, resizable: true, filter: true },
          { field: 'batchNo', sortable: true, resizable: true, filter: true },
          { field: 'uomCode', sortable: true, resizable: true, filter: true },
          { field: 'uomQnty', sortable: true, resizable: true, filter: true },
          { field: 'purchasePrice', sortable: true, resizable: true, filter: true },
        ];
        break;
      }
      case 'details': {
        this.screenname = 'Receipt Details';
        this.isReceiptdetails = true;
        break;
      }
    }
  }
  getReceiptdetails() {
    this.loading = true
    let saveResponse: Observable<any>;
    if (this.isReceiptsummary) {
      saveResponse = this.receiptMasterService.getReceiptsummary(this.receiptId);
    } else {
      saveResponse = this.receiptMasterService.getReceiptdetails(this.receiptId);
    }
    saveResponse.subscribe({
      next: (data: any[]) => {
        this.receiptdetails = data;
        this.itemLines = this.receiptdetails.itemLines;
        this.totalGridCount = this.itemLines.length;
        this.detailsForm.patchValue({
          DocumentType: this.receiptdetails.refDocumentType,
          DocumentNo: this.receiptdetails.refDocumentNo,
          Grn: this.receiptdetails.grn,
          DocumentDate: this.datePipe.transform(this.receiptdetails.refDocumentDate, "dd-MM-yyyy"),
          receiptDate: this.datePipe.transform(this.receiptdetails.receiptDate, "dd-MM-yyyy"),
          receiptStatus: this.receiptdetails.receiptStatusText,
        });
      },
      error: (err => { console.error(err) }),
      complete: () => { this.loading = false; }
    });
  }
  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
  }
  getPDF() {
    var data = {
      headerdata: this.receiptdetails,
      griddata: this.itemLines,
      printtype: 'receipt',
      Receipttype: this.isReceiptsummary ? 'summary' : 'detail',
      title: this.screenname
    }
    this.exportService.generatePdf(data);
  }
  getExcel() {
    var data = {
      headerdata: this.receiptdetails,
      griddata: this.itemLines,
      printtype: this.isReceiptsummary ? 'receiptsummary' : 'receiptdetail',
      title: this.screenname,
    }
    this.exportService.generateExcel(data);
  }
}
