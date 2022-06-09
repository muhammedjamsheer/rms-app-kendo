import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InboundService } from '../../../../core/service/inbound.service';
import { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';


@Component({
  selector: 'org-rms-purchaseorderform',
  templateUrl: './purchaseorderform.component.html',
  styleUrls: ['./purchaseorderform.component.css']
})
export class PurchaseorderformComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  poId !: number;
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
        this.poId = Number(params['id']);
      }
    });
    this.getPurchaseOrderdetails();
  }
  getPurchaseOrderdetails() {
    this.inboundService.getpurchaseorderSummary(this.poId).subscribe({
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
