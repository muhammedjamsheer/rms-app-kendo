import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductionorderService } from '../../../../core/service/productionorder.service';
import { PickListModel } from 'src/app/shared/model/productionorder';
import { ColDef } from 'ag-grid-community';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { PicklistService } from '../../../../core/service/picklist.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { ExportService } from '../../../../core/exports/export.service';

@Component({
  selector: 'org-rms-productionorderform',
  templateUrl: './productionorderform.component.html',
  styleUrls: ['./productionorderform.component.css']
})
export class ProductionorderformComponent implements OnInit {
  picklistobj: PickListModel;
  productionorderid: number;
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  @ViewChild('ViewButton') ViewButton!: ElementRef;
  loading: boolean = false;
  productionorderdetails: any;
  selectednodes: any[] = []
  showzerocountvalidation: boolean = false;
  errorMessage: string = '';
  picklistForm!: FormGroup;
  submitted: boolean = false;
  columnDefs: ColDef[] = [
    {
      headerName: 'ProductId', field: 'productId', sortable: true, filter: true, resizable: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true
    },
    { field: 'productionEntry', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'lineNumber', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'productCode', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'lineDescription', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'productType', sortable: true, resizable: true, filter: true },
    { field: 'availableQnty', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'plannedQuantity', sortable: true, resizable: true, filter: true },
    { field: 'uomCode', sortable: true, resizable: true, filter: true },
    { field: 'uomQnty', sortable: true, resizable: true, filter: true },
    { field: 'warehouseCode', sortable: true, resizable: true, filter: true },
    { field: 'issueType', sortable: true, resizable: true, filter: true },


  ];
  constructor(
    private route: ActivatedRoute,
    private productionorderService: ProductionorderService,
    private formBuilder: FormBuilder,
    private picklistService: PicklistService,
    private saveAlert: SaveAlert,
    private exportService: ExportService,
  ) { }

  ngOnInit(): void {
    this.picklistForm = this.formBuilder.group({
      Remarks: [''],
    });
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.productionorderid = Number(params['id']);
      }
    });
    this.getProductionOrderdetails();
  }

  getProductionOrderdetails() {
    this.productionorderService.getproductionorderdetails(this.productionorderid).subscribe({
      next: (data: any) => {
        this.productionorderdetails = data;
      },
      error: (err => { console.error(err) }),
      complete: () => { }
    });
  }
  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
  }
  onSelectionChanged(event: any) {
    let selectedNodes = this.agGrid.api.getSelectedNodes();
    this.selectednodes = selectedNodes.map<any>(node => node.data);
    this.showzerocountvalidation = true;
    if (this.selectednodes.length > 0) {
      this.showzerocountvalidation = false;
    }
  }
  OnPicklist() {
    if (this.selectednodes.length == 0) {
      this.errorMessage = "* Please select any production order to proceed."
      this.showzerocountvalidation = true;
      return
    }
    // if (this.selectednodes.find(x => x.qntyToPick == 0) != undefined) {
    //   let product = this.selectednodes.find(x => x.qntyToPick == 0);
    //   this.errorMessage = "* Please enter a valid qty for productid " + product.productId;
    //   this.showzerocountvalidation = true;
    //   return
    // }
    // if (this.selectednodes.find(x => Number(x.qntyToPick) > x.openQty) != undefined) {
    //   let product = this.selectednodes.find(x => Number(x.qntyToPick) > x.openQty);
    //   this.errorMessage = "* Please enter a valid qty for productid " + product.productId;
    //   this.showzerocountvalidation = true;
    //   return
    // }

    this.showzerocountvalidation = false;
    let el: HTMLElement = this.ViewButton.nativeElement as HTMLElement;
    el.click();
    this.picklistForm.reset();
  }
  get formcontrols() { return this.picklistForm.controls; }
  async createPicklist() {
    this.submitted = true;
    if (this.picklistForm.invalid) {
      return;
    }
    this.picklistobj = new PickListModel();
    this.picklistobj.createdBy = "Admin";
    this.picklistobj.OperationType = "ProductionOrder";
    this.picklistobj.docType = 40;
    this.picklistobj.docNumber = this.selectednodes[0].productionNumber;
    this.picklistobj.docEntry = this.selectednodes[0].productionEntry;
    this.picklistobj.remarks = this.formcontrols.Remarks.value;
    this.picklistobj.documentLines = [];
    this.selectednodes.forEach(element => {
      this.picklistobj.documentLines.push({
        lineNumber: element.lineNumber,
        lineDescription: element.lineDescription,
        productId: element.productId,
        pickQuantity: Number(element.plannedQuantity),
        UomCode: element.uomCode,
        uomQtytoPick: Number(element.uomQnty),
        fromWarehouse:element.warehouseCode,
      })
    });
    this.picklistService.createPicklist(this.picklistobj).subscribe({
      next: (data: any[]) => {
        this.ViewButton.nativeElement.click()
        this.picklistForm.reset()
        this.saveAlert.SuccessMessage();
      },
      error: (err => { console.error(err) }),
      complete: () => { this.loading = false; }
    });
  }
}
