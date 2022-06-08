import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransferorderService } from '../../../../core/service/transferorder.service';
import { PickListModel } from 'src/app/shared/model/sales-order';
import { ColDef } from 'ag-grid-community';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { PicklistService } from '../../../../core/service/picklist.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { ExportService } from '../../../../core/exports/export.service';
@Component({
  selector: 'org-rms-transferorderform',
  templateUrl: './transferorderform.component.html',
  styleUrls: ['./transferorderform.component.css']
})
export class TransferorderformComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  @ViewChild('ViewButton') ViewButton!: ElementRef;
  picklistobj: PickListModel = new PickListModel();
  loading: boolean = false;
  transferorderid!: string;
  transferorderdetails: any;
  selectednodes: any[] = []
  showzerocountvalidation: boolean = false;
  startprinting: boolean = false;
  submitted: boolean = false;
  picklistForm!: FormGroup;
  errorMessage: string = ''
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
    private route: ActivatedRoute,
    private transferorderService: TransferorderService,
    private formBuilder: FormBuilder,
    private picklistService: PicklistService,
    private saveAlert: SaveAlert,
    private exportService: ExportService,

  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.transferorderid = params['id'];
      }
    });
    this.picklistForm = this.formBuilder.group({
      ToWarehouse: [''],
      CustomerLocation: [''],
      Remarks: ['']
    });
    this.getSalesOrderdetails();
  }
  getSalesOrderdetails() {
    this.loading = true
    this.transferorderService.gettransferorderdetails(this.transferorderid).subscribe({
      next: (data: any) => {
        this.transferorderdetails = data;
      },
      error: (err => { console.error(err) }),
      complete: () => { this.loading = false; }
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
      this.errorMessage = "* Please select any transfer order to proceed."
      this.showzerocountvalidation = true;
      return
    }
    if (this.selectednodes.find(x => x.qntyToPick == 0) != undefined) {
      let product = this.selectednodes.find(x => x.qntyToPick == 0);
      this.errorMessage = "* Please enter a valid qty for productid " + product.productId;
      this.showzerocountvalidation = true;
      return
    }
    if (this.selectednodes.find(x => Number(x.qntyToPick) > x.openQty) != undefined) {
      let product = this.selectednodes.find(x => Number(x.qntyToPick) > x.openQty);
      this.errorMessage = "* Please enter a valid qty for productid " + product.productId;
      this.showzerocountvalidation = true;
      return
    }
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
    this.picklistobj.OperationType = "TransferOrder";
    this.picklistobj.docNumber = this.selectednodes[0].toNumber;
    this.picklistobj.docEntry = this.selectednodes[0].toEntry;
    this.picklistobj.docType = 30;
    this.picklistobj.toWarehouse = this.formcontrols.ToWarehouse.value;
    this.picklistobj.customerLocation = this.formcontrols.CustomerLocation.value;
    this.picklistobj.remarks = this.formcontrols.Remarks.value;
    this.picklistobj.documentLines = [];
    this.selectednodes.forEach(element => {
      this.picklistobj.documentLines.push({
        lineNumber: element.toLineNumber,
        lineDescription: element.toLineDescription,
        productId: element.productId,
        pickQuantity: Number(element.qntyToPick),
        UomCode: element.uomCode,
        uomQtytoPick: Number(element.uomQntyToPick),
        fromWarehouse:element.warehouseCode
      })
    });
    this.picklistService.createPicklist(this.picklistobj).subscribe({
      next: (data: any[]) => {
        this.saveAlert.SuccessMessage();
        this.ViewButton.nativeElement.click()
      },
      error: (err => { console.error(err) }),
      complete: () => { this.loading = false; }
    });
  }
  getPDF() {
    var data = {
      headerdata: null,
      griddata: this.transferorderdetails,
      printtype: 'transferorder'
    }
    this.exportService.generatePdf(data);
  }
}
