import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationmasterService } from '../../../../core/service/locationmaster.service';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { ProductMasterModel } from '../../../../shared/model/ProductMasterModel';
import { ProductMasterService } from '../../../../core/service/productmaster.service';
import { TransferRequestModel, transferLineItemModel } from '../../../../shared/model/transfer-request';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { AssetTransferRequestService } from '../../../../core/service/assettransferrequest.service';
import { formatDate } from '@angular/common';

declare var $: any;
@Component({
  selector: 'org-rms-transferrquestform',
  templateUrl: './transferrquestform.component.html',
  styleUrls: ['./transferrquestform.component.css']
})
export class TransferrquestformComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  transferRequestModel!: TransferRequestModel;
  transferRequestForm!: FormGroup;
  submitted = false;
  loading = false;
  userName!: string;
  viewrequestMode: boolean = false;
  warehouses!: any[];
  existingproducts!: any[];
  columnAssetTransferDefs: any;
  pdtinfosubmitted: boolean = false;
  productTransferData: transferLineItemModel[] = [];
  assetTransferLineItem!: transferLineItemModel;
  isAssetTransferAddHidden: boolean = false;
  isAssetTransferEditHidden: boolean = true;
  isAssetTransferDeleteHidden: boolean = true;
  isAssetTransferUpdateHidden: boolean = true;
  isAssetTransferCancelHidden: boolean = true;
  errorProductTransfer!: string;
  requestNo!: string;
  isbtnSaveDisabled: boolean = false;
  editMode: boolean = false;
  error!: string;
  viewMode: boolean = false;
  locale = 'en-US';
  isbtnClearDisabled: boolean = false;
  isUpdateProductGrid: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private locationMasterService: LocationmasterService,
    private productMasterService: ProductMasterService,
    private saveAlert: SaveAlert,
    private assetTransferRequestService: AssetTransferRequestService,
  ) { }

  async ngOnInit() {

    this.transferRequestForm = this.formBuilder.group({
      RequestDate: [null, Validators.required],
      Remarks: [null, Validators.required],
      Towarehouse: [null],
      Fromwarehouse: [null, Validators.required],
      selectedProduct: [null],
      Quantity: [null],
    });

    this.warehouses = await this.locationMasterService.getWarehouseMaster();
    this.existingproducts = await this.productMasterService.getExistingProduct();
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.requestNo = params['id'];
        this.editMode = true;
        if (params['state'] === 'view') {
          this.viewMode = true;
          this.viewrequestMode = false;
          this.disableControls();
        } else if (params['state'] === 'viewrequest') {
          this.viewMode = false;
          this.viewrequestMode = true;
          this.disableControls();
        }
        this.assetTransferRequestService.getAssetTransferRequestByKey(this.requestNo).subscribe(res => {
          this.ShowEditViewTransferRequest(res);
        });

      } else {
        this.editMode = false;
      }
    });


    this.userName = localStorage.getItem('userName')?.toString()!;
    $('.select2bs4').select2();
    $('#RequestDate').datetimepicker({
      format: 'L'
    });
    $('[name="Towarehouse"]').on("change", () => {
      this.assetTransferRequestFormControls.Towarehouse.setValue($('[name="Towarehouse"]').val());
    });
    $('[name="Fromwarehouse"]').on("change", () => {
      this.assetTransferRequestFormControls.Fromwarehouse.setValue($('[name="Fromwarehouse"]').val());
    });
    $('[name="selectedproduct"]').on("change", () => {
      this.assetTransferRequestFormControls.selectedProduct.setValue($('[name="selectedproduct"]').val());
    });
    const today = new Date();
    const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    $("#RequestDate .datetimepicker-input").val(datepart); // Assign the value
    $("#RequestDate .datetimepicker-input").trigger("click"); // Trigger click

    this.columnAssetTransferDefs = [
      { field: 'productId', sortable: true, filter: true },
      { field: 'productCode', sortable: true, filter: true, width: 300 },
      { field: 'productDescription', sortable: true, filter: true, width: 300 },
      { field: 'category', sortable: true, filter: true },
      { field: 'quantity', sortable: true, filter: true },
    ];

  }
  disableControls() {
    $('#RequestDate .datetimepicker-input').attr('disabled', true);
    this.assetTransferRequestFormControls.selectedProduct.disable();
    this.assetTransferRequestFormControls.Quantity.disable();
    this.assetTransferRequestFormControls.Remarks.disable();
    this.assetTransferRequestFormControls.Towarehouse.disable();
    this.assetTransferRequestFormControls.Fromwarehouse.disable();

    this.isbtnSaveDisabled = this.viewMode;
    this.isbtnClearDisabled = this.viewMode;
  }
  ShowEditViewTransferRequest(data: any) {
    $('#RequestDate .datetimepicker-input').val(data.requestDate ? formatDate(data.requestDate, 'MM/dd/yyyy', this.locale) : '');
    let toWarehouse = this.warehouses.find(x => x.warehouseCode == data.toWarehouseCode)
    let fromwarehouse = this.warehouses.find(x => x.warehouseCode == data.fromWarehouseCode);
    this.assetTransferRequestFormControls.Remarks.setValue(data.remarks);
    this.assetTransferRequestFormControls.Towarehouse.setValue(toWarehouse.warehouseID);
    this.assetTransferRequestFormControls.Fromwarehouse.setValue(fromwarehouse.warehouseID);
    this.productTransferData = [];
    let pdttransferdata: any[] = data.requestLines
    pdttransferdata.forEach(element => {
      this.productTransferData.push({
        productId: element.productId,
        productCode: element.productCode,
        productDescription: element.productDescription,
        category: element.category,
        quantity: element.quantity
      })
    });
    $('select').select2().trigger('change');
    this.UpdateAssetTransferSubGridRows()
  }
  get assetTransferRequestFormControls() { return this.transferRequestForm.controls; }

  private SetValidatorsForGridAddControls() {
    this.assetTransferRequestFormControls.selectedProduct.setValidators([Validators.required]);
    this.assetTransferRequestFormControls.Quantity.setValidators([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]);
    this.UpdateValiditityForGridAddControls();
  }
  private DisableValidatorsForGridAddControls() {
    this.assetTransferRequestFormControls.selectedProduct.setValue(null);
    this.assetTransferRequestFormControls.Quantity.setValue(null);
    this.assetTransferRequestFormControls.selectedProduct.setValidators(null);
    this.assetTransferRequestFormControls.Quantity.setValidators(null);
    this.UpdateValiditityForGridAddControls();
  }
  private UpdateValiditityForGridAddControls() {
    this.assetTransferRequestFormControls.selectedProduct.updateValueAndValidity();
    this.assetTransferRequestFormControls.Quantity.updateValueAndValidity()
  }
  AddProducttoTransferGrid() {
    this.pdtinfosubmitted = true;
    this.SetValidatorsForGridAddControls();
    this.assetTransferRequestFormControls.selectedProduct
    let productid = this.assetTransferRequestFormControls.selectedProduct.value;
    let quantity = this.assetTransferRequestFormControls.Quantity.value;
    if (productid == null || quantity == null || quantity < 1) {
      return
    }
    const hasSameProduct = this.productTransferData.some(x => x.productId == Number(productid));
    if (hasSameProduct) {
      var pdtindex = this.productTransferData.findIndex(x => x.productId == Number(productid))
      this.productTransferData[pdtindex].quantity = quantity;
      this.UpdateAssetTransferSubGridRows()
      this.DisableValidatorsForGridAddControls()
      $('select').select2().trigger('change');
      this.isUpdateProductGrid = false;
      // this.errorProductTransfer = '* Same record with Product code already exists!';
      return;
    }
    this.errorProductTransfer = "";
    let productSelected = this.existingproducts.find(x => x.productId == Number(productid));
    if (productSelected != undefined) {
      let pdtdata = {
        productId: productSelected.productId,
        productCode: productSelected.productCode,
        productDescription: productSelected.productDescription,
        category: productSelected.category,
        quantity: quantity
      }
      this.productTransferData.push(pdtdata);
      this.UpdateAssetTransferSubGridRows()
      this.DisableValidatorsForGridAddControls()
      $('select').select2().trigger('change');
      this.pdtinfosubmitted = false;
      this.isUpdateProductGrid = false;
    }

  }
  private UpdateAssetTransferSubGridRows() {
    this.agGrid.api.setRowData(this.productTransferData);
    this.agGrid.api.redrawRows();
  }
  DeleteAssetTransfer() {
    const index = this.productTransferData.findIndex(x => x.productId == this.assetTransferLineItem.productId);
    if (index > -1) {
      this.productTransferData.splice(index, 1);
      this.UpdateAssetTransferSubGridRows();
      this.DisableValidatorsForGridAddControls()
      $('select').select2().trigger('change');
      this.isUpdateProductGrid = false;
    }
  }
  onAssetTransferRowClick(event: any) {
    this.isAssetTransferEditHidden = !this.isAssetTransferUpdateHidden || this.viewMode;
    this.isAssetTransferDeleteHidden = !this.isAssetTransferUpdateHidden || this.viewMode;
    this.assetTransferLineItem = event.data;
    this.assetTransferRequestFormControls.selectedProduct.setValue(event.data.productId);
    this.assetTransferRequestFormControls.Quantity.setValue(event.data.quantity);
    $('select').select2().trigger('change');
    this.SetValidatorsForGridAddControls();
    this.isUpdateProductGrid = true;
  }

  validatedata(data) {
    if (data == null || data == '' || data == undefined) {
      return false;
    }
    return true;
  }

  SaveTransferRequest() {
    this.assetTransferRequestFormControls.RequestDate.setValue($("#RequestDate .datetimepicker-input").val());
    this.submitted = true;
    if (this.transferRequestForm.invalid || this.productTransferData.length == 0) {
      return;
    }
    this.loading = true;
    let saveResponse: Observable<any>;
    this.transferRequestModel = new TransferRequestModel();
    this.transferRequestModel.requestNo = this.requestNo;
    this.transferRequestModel.requestedBy = this.userName;
    this.transferRequestModel.remarks = this.assetTransferRequestFormControls.Remarks.value;
    this.transferRequestModel.requestDate = this.assetTransferRequestFormControls.RequestDate.value;
    this.transferRequestModel.toWarehouse = this.validatedata(this.assetTransferRequestFormControls.Towarehouse.value) ? parseInt(this.assetTransferRequestFormControls.Towarehouse.value) : 0;
    this.transferRequestModel.fromWarehouse = parseInt(this.assetTransferRequestFormControls.Fromwarehouse.value);
    this.transferRequestModel.requestLines = [];
    this.productTransferData.forEach(element => {
      this.transferRequestModel.requestLines.push({
        productId: element.productId,
        quantity: element.quantity
      })
    });
    if (this.editMode) {
      saveResponse = this.assetTransferRequestService.editAssetTransferRequestmaster(this.transferRequestModel);
    } else {
      saveResponse = this.assetTransferRequestService.addAssetTransferRequest(this.transferRequestModel);
    }
    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          console.log(result);
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.submitted = false;
        this.loading = false;
      },
      err => {
        this.error = err.error ? err.error : err.message;
        this.loading = false;
      }
    );
  }
  ClearContents() {
    this.transferRequestForm.reset();
    this.productTransferData = [];
    $('#RequestDate .datetimepicker-input').val('');
    $('select').select2().trigger('change');
  }
  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
  }
}
