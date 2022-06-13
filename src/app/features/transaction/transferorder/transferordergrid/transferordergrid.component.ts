import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TransferorderService } from '../../../../core/service/transferorder.service';
import { Subscription } from 'rxjs';
import { ColDef } from 'ag-grid-community';
@Component({
  selector: 'org-rms-transferordergrid',
  templateUrl: './transferordergrid.component.html',
  styleUrls: ['./transferordergrid.component.css']
})
export class TransferordergridComponent implements OnInit {
  @ViewChild('ViewButton') ViewButton!: ElementRef;
  @Input() name: string = 'transferorder';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;
  isRowUnSelected: boolean = true;
  totalGridCount: number = 0;
  loading:boolean=false;
  selectedNodes: any;
  picklistdetails: any[] = []
  subscription!: Subscription;
  mastertype!: string;
  columnDefs: ColDef[] = [
    {
      headerName: 'ProductId', field: 'productId', sortable: true, filter: true, resizable: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true
    },
    { field: 'toLineNumber', sortable: true, resizable: true, filter: true },
    { field: 'productCode', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'toLineDescription', sortable: true, resizable: true, filter: true, width: 250  },
    { field: 'availableQnty', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'orderQty', sortable: true, resizable: true, filter: true },
    {
      field: 'qntyToPick', headerName: "No. of Qty to pick", sortable: true, resizable: true, filter: true, width: 150, editable: true,
      singleClickEdit: true,
      cellStyle: params => {
        return { backgroundColor: '#bed3d7' };
      }
    },
    { field: 'uomCode', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'uomQty', sortable: true, resizable: true, filter: true },
    {
      field: 'uomQntyToPick', headerName: "No. of UOM Qty to pick", sortable: true, resizable: true, filter: true, width: 150, editable: true, singleClickEdit: true,
      cellStyle: params => {
        return { backgroundColor: '#bed3d7' };
      }
    },
    { field: 'warehouseCode', sortable: true, resizable: true, filter: true },
    { field: 'docStatus', sortable: true, resizable: true, filter: true },
    { field: 'journalMemo', sortable: true, resizable: true, filter: true },
  ];
  constructor(
    private transferorderService: TransferorderService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
    this.subscription = this.transferorderService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }
  totalGridItems($event: number) {
    this.totalGridCount = $event;
  }
  OnViewClick() {
    localStorage.setItem('headerdata', JSON.stringify(this.selectedNodes));
    this.router.navigate(['/transferorder/view', this.selectedNodes.toNumber]);
  }
  OnSummaryClick() {
    localStorage.setItem('headerdata', JSON.stringify(this.selectedNodes));
    this.router.navigate(['/transferorder/summary', this.selectedNodes.toId]);
  }
  triggerClick() {
    let el: HTMLElement = this.ViewButton.nativeElement as HTMLElement;
    el.click();
  }
  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.transferorderService.refreshClickevent.next();
  }
  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
  }
}
