import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PurchaseOrderHeader } from '../../../../shared/model/inbound.model';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-inbound-head',
  templateUrl: './inbound-head.component.html',
  styleUrls: ['./inbound-head.component.scss']
})
export class InboundHeadComponent implements OnInit, OnChanges {
  @Input() filteredData: PurchaseOrderHeader[]=[];
  @Input() docHeaderInput!: PurchaseOrderHeader;
  @Input() selectedIdInput!: string;
  @Output() docSelected = new EventEmitter<PurchaseOrderHeader>();
  
  selected: boolean = false;
  columnDefs: ColDef[] = [
    { field: 'docId', sortable: true, resizable: true, filter: true, width: 100 },
    { field: 'fromFacility', sortable: true, resizable: true, filter: true, width: 200 },
    { field: 'toFacility', sortable: true, resizable: true, filter: true, width: 200 },
    { field: 'companyName', sortable: true, resizable: true, filter: true, width: 200 },
    { field: 'employeeName', sortable: true, resizable: true, filter: true, width: 200 },
    { field: 'createdBy', sortable: true, resizable: true, filter: true, width: 200 },
    { field: 'createdDate', sortable: true, resizable: true, filter: true, width: 200 },
    { field: 'remarks', sortable: true, resizable: true, filter: true, width: 200 },
    { field: 'acknowledgedBy', sortable: true, resizable: true, filter: true, width: 200 },
     ];
  constructor() { }

  ngOnInit(): void {

  }

  onItemClick(docHeaderInput:PurchaseOrderHeader) {
    this.docHeaderInput= docHeaderInput;   
    this.docSelected.emit( this.docHeaderInput);
  }

  ngOnChanges(_changes: SimpleChanges): void {
    // if (!this.selected && this.docHeaderInput.poNumber == this.selectedIdInput) {
    //   this.selected = true;
    // }
    // else if (this.selected && this.docHeaderInput.poNumber != this.selectedIdInput) {
    //   this.selected = false;
    // };
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

}
