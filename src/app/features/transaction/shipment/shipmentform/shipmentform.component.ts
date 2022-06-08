import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShipmentService } from '../../../../core/service/shipment.service';
import { ColDef } from 'ag-grid-community';
import { Subscription, Observable } from 'rxjs';
import { ExportService } from '../../../../core/exports/export.service';
@Component({
  selector: 'org-rms-shipmentform',
  templateUrl: './shipmentform.component.html',
  styleUrls: ['./shipmentform.component.css']
})
export class ShipmentformComponent implements OnInit {
  loading: boolean = false;
  screenname!: string;
  shipmentid!: number;
  shipmentType!: string;
  shipmentdetails: any;
  itemLines: any[] = [];
  totalGridCount: number = 0;
  isShipmentsummary: boolean = false;
  isShipmentdetails: boolean = false;
  columnDefs: ColDef[] = [
    { field: 'shipmentId', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'serialNo', sortable: true, resizable: true, filter: true, width: 250 },
    { field: 'productId', sortable: true, resizable: true, filter: true },
    { field: 'productCode', sortable: true, resizable: true, filter: true },
    { field: 'productDescription', sortable: true, resizable: true, filter: true },
    { field: 'quantity', sortable: true, resizable: true, filter: true },
    { field: 'uomCode', sortable: true, resizable: true, filter: true },
    { field: 'uomQnty', sortable: true, resizable: true, filter: true },
    { field: 'purchasePrice', sortable: true, resizable: true, filter: true },
  ];

  constructor(
    private route: ActivatedRoute,
    private shipmentService: ShipmentService,
    private exportService: ExportService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.shipmentid = Number(params['id']);
      }
      if (params['id'] != undefined) {
        this.shipmentid = Number(params['id']);
        this.shipmentType = params['state'];
      }
    });
    this.getscreendetails();
    this.getSalesOrderdetails();
  }
  getscreendetails() {
    switch (this.shipmentType) {
      case 'summary': {
        this.screenname = 'Shipment Summary';
        this.isShipmentsummary = true;
        this.columnDefs = [
          { field: 'shipmentId', sortable: true, resizable: true, filter: true, width: 150 },
          { field: 'productId', sortable: true, resizable: true, filter: true },
          { field: 'productCode', sortable: true, resizable: true, filter: true },
          { field: 'productDescription', sortable: true, resizable: true, filter: true },
          { field: 'quantity', sortable: true, resizable: true, filter: true },
          { field: 'uomCode', sortable: true, resizable: true, filter: true },
          { field: 'uomQnty', sortable: true, resizable: true, filter: true },
          { field: 'purchasePrice', sortable: true, resizable: true, filter: true },
        ];
        break;
      }
      case 'details': {
        this.screenname = 'Shipment Details';
        this.isShipmentdetails = true;
        break;
      }
    }
  }
  getSalesOrderdetails() {
    this.loading = true
    let saveResponse: Observable<any>;
    if (this.isShipmentsummary) {
      saveResponse = this.shipmentService.getshipmentsummary(this.shipmentid);
    } else {
      saveResponse = this.shipmentService.getshipmentdetails(this.shipmentid);
    }
    saveResponse.subscribe({
      next: (data: any) => {
        this.shipmentdetails = data;
        this.itemLines = data.itemLines;
        this.totalGridCount = this.itemLines.length;
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
      headerdata: this.shipmentdetails,
      griddata: this.itemLines,
      printtype: 'shipment',
      Shipmenttype: this.isShipmentsummary ? 'summary' : 'detail',
      title: this.screenname
    }
    this.exportService.generatePdf(data);
  }
  getExcel() {
    var data = {
      headerdata: this.shipmentdetails,
      griddata: this.itemLines,
      printtype: this.isShipmentsummary ? 'shipmentsummary' : 'shipmentdetail',
      title: this.screenname,
    }
    this.exportService.generateExcel(data);
  }
}
