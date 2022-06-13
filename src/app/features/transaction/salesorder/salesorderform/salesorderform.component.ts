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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
  Sonumber!: number;
  State!: string;
  Soid!: number;
  screenName !: string;
  salesorderdata: any[] = []
  loading: boolean = false;
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
    { field: 'soLineDescription', sortable: true, resizable: true, filter: true, width: 250 },
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
  showzerocountvalidation: boolean = false;
  errorMessage: string = ''
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
      if (params['state'] === 'view' && params['id'] != undefined) {
        this.Sonumber = Number(params['id']);
      }
      if (params['state'] === 'summary' && params['id'] != undefined) {
        this.Soid = Number(params['id']);
      }
    });

    this.picklistForm = this.formBuilder.group({
      Towarehouse: [''],
      Remarks: [''],
      Customer: [null, Validators.required],
      Address: [null, Validators.required],
    });

    switch (this.State) {
      case 'view':
        this.screenName = "Sales Order Details";
        this.getSalesOrderdetails();
        break;
      case 'summary':
        this.screenName = "Sales Order Summary";
        this.getSalesOrderSummary();
        break;
    }
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
    this.salesorderService.getSalesOrderdetails(this.Sonumber).subscribe({
      next: (data: any[]) => {
        if (data != null && data.length > 0) {
          this.salesorderdata = data;
        }
      },
      error: (err => { }),
      complete: () => { }
    });
  }
  getSalesOrderSummary() {
    this.salesorderdata = []
    this.salesorderService.getSalesOrderSummary(this.Soid).subscribe({
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
    this.showzerocountvalidation = true;
    if (this.selectednodes.length > 0) {
      this.showzerocountvalidation = false;
    }
  }
  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
  }

  OnPicklist() {
    if (this.selectednodes.length == 0) {
      this.errorMessage = "* Please select any sales order to proceed."
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
    this.picklistobj.OperationType = "SalesOrder";
    this.picklistobj.docType = 20;
    this.picklistobj.docNumber = this.selectednodes[0].soNumber;
    this.picklistobj.docEntry = this.selectednodes[0].soEntry
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
        },
        error: (err => { console.error(err) }),
      });
    }
  }

  getPDF() {
    var data = {
      headerdata: this.selectedHeader,
      griddata: this.salesorderdata,
      printtype: 'salesorder'
    }
    this.exportService.generatePdf(data);
    // var HTML_Width = $(".canvas_div_pdf").width();
    // var HTML_Height = $(".canvas_div_pdf").height();
    // var top_left_margin = 15;
    // var PDF_Width = HTML_Width + (top_left_margin * 2);
    // var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
    // var canvas_image_width = HTML_Width;
    // var canvas_image_height = HTML_Height;
    // var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
    // html2canvas($(".canvas_div_pdf")[0], { allowTaint: true }).then(function (canvas) {
    //   canvas.getContext('2d');
    //   console.log(canvas.height + "  " + canvas.width);

    //   var imgData = canvas.toDataURL("image/jpeg", 1.0);
    //   var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
    //   pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);

    //   for (var i = 1; i <= totalPDFPages; i++) {
    //     pdf.addPage([PDF_Width, PDF_Height], 'p');
    //     pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
    //   }
    //   pdf.save("SalesOrderDetails.pdf");
    // });
  };
}

