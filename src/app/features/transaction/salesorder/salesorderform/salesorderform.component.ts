import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesorderService } from '../../../../core/service/salesorder.service';
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
declare var $: any;


@Component({
  selector: 'org-rms-salesorderform',
  templateUrl: './salesorderform.component.html',
  styleUrls: ['./salesorderform.component.css']
})

export class SalesorderformComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  @ViewChild('ViewButton') ViewButton!: ElementRef;
  picklistobj: PickListModel = new PickListModel();
  selectednodes: any[] = []
  State!: string;
  Soid!: number;
  salesorderdata: any[] = []
  loading: boolean = false;
  defaultCustId: number = 0;
  customerlist: any[] = []
  addresslist: any[] = []
  columnDefs: ColDef[] = [
    {
      headerName: 'ProductId', field: 'productId', sortable: true, filter: true, resizable: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true
    },
    { field: 'soLineNumber', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'productCode', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'soLineDescription', headerName: "Product Description", sortable: true, resizable: true, filter: true, width: 250 },
    { field: 'availableQnty', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'openQty', sortable: true, resizable: true, filter: true, width: 150 },
    {
      field: 'qntyToPick', headerName: "No. of Qty to pick", sortable: true, resizable: true, filter: true, width: 150, editable: true,
      singleClickEdit: true,
      valueParser: params => this.commonService.formatIntoNumericvalues(params.newValue),
      cellStyle: params => {
        return { backgroundColor: '#bed3d7' };
      },
    },
    { field: 'uomCode', sortable: true, resizable: true, filter: true },
    { field: 'uomQty', sortable: true, resizable: true, filter: true },
    {
      field: 'uomQntyToPick', headerName: "No. of UOM Qty to pick", sortable: true, resizable: true, filter: true, width: 150, editable: true,
      singleClickEdit: true,
      valueParser: params => this.commonService.formatIntoNumericvalues(params.newValue),
      cellStyle: params => {
        return { backgroundColor: '#bed3d7' };
      },
    },
    { field: 'price', sortable: true, resizable: true, filter: true },
    { field: 'warehouseCode', sortable: true, resizable: true, filter: true }


  ];
  picklistForm!: FormGroup;
  submitted: boolean = false;
  startprinting: boolean = false;
  selectedHeader: any;
  subscription!: Subscription;
  showvalidation: boolean = false;
  validationmessage: string = ''
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private salesorderService: SalesorderService,
    private formBuilder: FormBuilder,
    private saveAlert: SaveAlert,
    private picklistService: PicklistService,
    private exportService: ExportService,
    private customerMasterService: CustomerMasterService,
    private commonService: CommonService

  ) {
    this.subscription = this.salesorderService.selectedrowevent.subscribe((e) => {
      this.selectedHeader = e.data;
    });
  }

  async ngOnInit() {
    $('.select2bs4').select2();
    this.route.params.subscribe(params => {
      this.State = params['state'];
      this.Soid = Number(params['id']);
    });

    this.picklistForm = this.formBuilder.group({
      Towarehouse: [''],
      Remarks: [''],
      Customer: [null, Validators.required],
      Address: [null, Validators.required],
    });

    this.getSalesOrderdetails();

    this.customerlist = await this.customerMasterService.getCustomersList();

    $('[name="Customer"]').on("change", () => {
      this.formcontrols.Customer.setValue($('[name="Customer"]').val());
      this.onChangeCustomer($('[name="Customer"]').val())
    });
    $('[name="Address"]').on("change", () => {
      this.formcontrols.Address.setValue($('[name="Address"]').val());
    });
  }

  getSalesOrderdetails() {
    this.salesorderdata = []
    this.salesorderService.getSalesOrderdetails(this.Soid).subscribe({
      next: (data: any[]) => {
        if (data != null && data.length > 0) {
          this.salesorderdata = data;
        }
      },
      error: (err => { }),
      complete: () => { }
    });
  }



  onSelectionChanged(event: any) {
    let selectedNodes = this.agGrid.api.getSelectedNodes();
    this.selectednodes = selectedNodes.map<any>(node => node.data);
    this.showvalidation = true;
    if (this.selectednodes.length > 0) {
      this.showvalidation = false;
    }
  }
  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
  }

  OnPicklist() {
    this.showvalidation = false;
    this.validationmessage = "";
    if (this.selectednodes.length == 0) {
      this.showvalidation = true;
      this.validationmessage = "* Please select any sales order to proceed."
      return
    } else {
      this.selectednodes.forEach(element => {
        if (isNaN(element.qntyToPick) || Number(element.qntyToPick) <= 0 || Number(element.qntyToPick) > Number(element.availableQnty)) {
          this.showvalidation = true;
          this.validationmessage = "* Please enter a valid quantity for productid " + element.productId;
          return
        }
      });
    }
    if (this.showvalidation) {
      return
    }
    this.picklistForm.reset();
    if (this.defaultCustId > 0) {
      this.formcontrols.Customer.setValue(this.defaultCustId);
      $('select').select2().trigger('change');
    }
    let el: HTMLElement = this.ViewButton.nativeElement as HTMLElement;
    el.click();
  }

  get formcontrols() { return this.picklistForm.controls; }
  async createPicklist() {
    this.submitted = true;
    if (this.picklistForm.invalid) {
      return;
    }
    this.picklistobj = new PickListModel();
    this.picklistobj.createdBy = "Admin";
    this.picklistobj.OperationType = "SalesOrder";
    this.picklistobj.docType = 20;
    this.picklistobj.docNumber = this.selectednodes[0].soNumber;
    this.picklistobj.docEntry = this.selectednodes[0].soEntry;
    this.picklistobj.fromWarehouse = this.selectednodes[0].warehouseCode;
    this.picklistobj.customerLocation = this.formcontrols.Address.value;
    this.picklistobj.remarks = this.formcontrols.Remarks.value;
    this.picklistobj.documentLines = [];
    this.selectednodes.forEach(element => {
      this.picklistobj.documentLines.push({
        lineNumber: element.soLineNumber,
        lineDescription: element.soLineDescription,
        productId: element.productId,
        pickQuantity: Number(element.qntyToPick),
        UomCode: element.uomCode,
        uomQtytoPick: Number(element.uomQntyToPick),
        fromWarehouse: element.warehouseCode,
      })
    });
    this.picklistService.createPicklist(this.picklistobj).subscribe({
      next: (data: any[]) => {
        this.ViewButton.nativeElement.click()
        this.submitted = false;
        this.picklistForm.reset()
        $('select').select2().trigger('change');
        this.saveAlert.SuccessMessage();
      },
      error: (err => { console.error(err) }),
      complete: () => { this.loading = false; }
    });
  }
  onChangeCustomer(cusid: number) {
    if (cusid > 0) {
      this.customerMasterService.getCustomerdetails(cusid).subscribe({
        next: (data: any[]) => {
          this.addresslist = data;
          debugger;
        },
        error: (err => { console.error(err) }),
      });
    }
  }

  getPDF() {
    var data = {
      headerdata: this.selectedHeader,
      griddata: this.salesorderdata,
      printtype: 'salesorder',
      title: 'Sales Order',
      mastertype: 'salesorder',
      isreport: false
    }
    this.exportService.generatePdf(data);
  };
}

