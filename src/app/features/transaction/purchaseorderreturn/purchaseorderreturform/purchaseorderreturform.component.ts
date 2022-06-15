import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InboundService } from '../../../../core/service/inbound.service';
import { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'org-rms-purchaseorderreturform',
  templateUrl: './purchaseorderreturform.component.html',
  styleUrls: ['./purchaseorderreturform.component.css']
})
export class PurchaseorderreturformComponent implements OnInit {

  @ViewChild('agGrid') agGrid!: AgGridAngular;
  poId !: number;
  isPurchaseorderreturnsummary: boolean = true;
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
    { field: 'poLineDescription', headerName: "Product Description", sortable: true, resizable: true, filter: true, width: 250 },
    { field: 'uomCode', sortable: true, resizable: true, filter: true, width: 130 },
    { field: 'uomQty', sortable: true, resizable: true, filter: true, width: 130 },
    { field: 'orderQty', headerName: "Qty to be Return", sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'price', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'priceAfterVAT', sortable: true, resizable: true, filter: true },

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
    this.purchaseorderdata = []
    this.inboundService.getDocumentprintDetails(this.poId).subscribe({
      next: (data: any) => {
        if (data != null && data.length > 0) {
          this.purchaseorderdata = data;
        }
      },
      error: (err => { }),
      complete: () => { }
    });
  }

  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
  }

}
