import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InboundService } from '../../../../core/service/inbound.service';
import { ColDef, ValueParserParams } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PickListModel } from 'src/app/shared/model/sales-order';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { Subscription } from 'rxjs';
import { PicklistService } from '../../../../core/service/picklist.service';
import { ExportService } from '../../../../core/exports/export.service';
import { CustomerMasterService } from '../../../../core/service/customermaster.service';
import { CommonService } from 'src/app/core/service/common.service';

@Component({
  selector: 'org-rms-purchaseorderform',
  templateUrl: './purchaseorderform.component.html',
  styleUrls: ['./purchaseorderform.component.css']
})
export class PurchaseorderformComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  ponumber !: number;
  purchaseorderdata: any[] = []
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
    { field: 'openQty', headerName: "Quantity", sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'orderQty', headerName: "Packaging Qty", sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'price', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'priceAfterVAT', sortable: true, resizable: true, filter: true },
    { field: 'poLineDescription', sortable: true, resizable: true, filter: true, width: 150 },
  ];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private inboundService: InboundService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.ponumber = Number(params['id']);
      }
    });
    this.getPurchaseOrderdetails();
  }
  getPurchaseOrderdetails() {
    this.inboundService.getPurchaseReturndetails(this.ponumber).subscribe({
      next: (data: any[]) => {
        this.purchaseorderdata = data;
      },
      error: (err => { console.error(err) }),
      complete: () => { }
    });
  }
  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
  }
}
