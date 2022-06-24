import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReceiptMasterService } from '../../../../core/service/receiptmaster.service';
import { DatePipe } from '@angular/common';
import { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { Subscription, Observable } from 'rxjs';
import { ShipmentService } from '../../../../core/service/shipment.service';
import { LocationmasterService } from '../../../../core/service/locationmaster.service';
import { TransferorderService } from '../../../../core/service/transferorder.service';


declare var $: any;
@Component({
  selector: 'org-rms-manaultoreceiptform',
  templateUrl: './manaultoreceiptform.component.html',
  styleUrls: ['./manaultoreceiptform.component.css']
})
export class ManaultoreceiptformComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  selectedHeader: any;
  subscription!: Subscription;
  loading: boolean = false;
  detailsForm!: FormGroup;
  totalGridCount: number = 0
  shipmentList: any[] = [];
  warehouses: any[] = [];
  submitted: boolean = false;
  hidegrid: boolean = false;
  shipmentdetails: any[] = [];
  columnDefs: ColDef[] = [
    {
      field: 'serialNo', sortable: true, filter: true, resizable: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true, width: 250
    },
    { field: 'productId', sortable: true, resizable: true, filter: true },
    { field: 'productCode', sortable: true, resizable: true, filter: true },
    { field: 'productDescription', sortable: true, resizable: true, filter: true },
    { field: 'quantity', sortable: true, resizable: true, filter: true },
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
    private shipmentService: ShipmentService,
    private locationMasterService: LocationmasterService,
    private transferorderService: TransferorderService,

  ) {
    this.subscription = this.receiptMasterService.selectedrowevent.subscribe((e) => {
      this.selectedHeader = e.data;
    });
  }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {

      }
    });
    this.detailsForm = this.formBuilder.group({
      shipmentId: [null, Validators.required],
      warehouse: [null, Validators.required],
      remarks: [null],
    });
    $('.select2bs4').select2();
    $('[name="Shipment"]').on("change", () => {
      this.formcontrols.shipmentId.setValue($('[name="Shipment"]').val());
      this.getshipmentdetails($('[name="Shipment"]').val())
    });
    $('[name="Warehouse"]').on("change", () => {
      this.formcontrols.warehouse.setValue($('[name="Warehouse"]').val());
    });
    this.shipmentList = await this.shipmentService.getShipmentList();
    this.warehouses = await this.locationMasterService.getWarehouseMaster();
  }
  get formcontrols() { return this.detailsForm.controls; }

  getshipmentdetails(shipmentid) {
    if(shipmentid==null){return}
    this.shipmentService.getshipmentdetails(shipmentid).subscribe({
      next: (data: any) => {
        this.shipmentdetails = data.itemLines;
      },
      error: (err => {}),
      complete: () => { }
    });
  }
  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
  }
  async onSubmit() {
    this.submitted = true;
    if (this.detailsForm.invalid) {
      return;
    }
    this.loading = true;
    this.transferorderService.createManualTransferOrderReceipt(this.detailsForm.value).subscribe({
      next: (data: any[]) => {
        this.saveAlert.showMessage('success','Saved Successfully!!!');
        this.detailsForm.reset();
        $('select').select2().trigger('change');
      },
      error: (err => { console.error(err) }),
      complete: () => { this.loading = false; this.submitted = false }
    });
  }
}
