import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { AssetCategoryMasterService } from '../../../../core/service/assetcategorymaster.service';
import { AssetDisposalService } from '../../../../core/service/assetdisposal.service';
import { AssetSubCategoryMasterService } from '../../../../core/service/assetsubcategorymaster.service';
import { CommonValueListService } from '../../../../core/service/commonlistvalue.service';
import { EmployeeMasterService } from '../../../../core/service/employeemaster.service';
import { LocationmasterService } from '../../../../core/service/locationmaster.service';
import { ProductMasterService } from '../../../../core/service/productmaster.service';
import { SupplierMasterService } from '../../../../core/service/suppliermaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { AssetCategoryMasterModel } from '../../../../shared/model/AssetCategoryMasterModel';
import { AssetDisposalModel } from '../../../../shared/model/AssetDisposalModel';
import { AssetSubCategoryMasterModel } from '../../../../shared/model/AssetSubCategoryMasterModel';
import { CommonValueListModel } from '../../../../shared/model/CommonValueListModel';
import { DisposalItemLines } from '../../../../shared/model/DisposalItemLines';
import { EmployeeMasterModel } from '../../../../shared/model/EmployeeMasterModel';
import { LocationMasterModel } from '../../../../shared/model/LocationMasterModel';
import { ProductMasterModel } from '../../../../shared/model/ProductMasterModel';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'org-fat-assetdisposalform',
  templateUrl: './assetdisposalform.component.html',
  styleUrls: ['./assetdisposalform.component.scss']
})
export class AssetdisposalformComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  assetDisposalForm: FormGroup;
  submitted = false;
  disposalSubmitted = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  disposalId!: number;
  error = '';
  errorDisposal = '';
  editMode: boolean = false;
  disposalData!: AssetDisposalModel;
  assetDisposalModel: AssetDisposalModel = new AssetDisposalModel;
  rowDisposalData!: DisposalItemLines[];
  columnDisposalDefs: any;
  categoryCodes!: AssetCategoryMasterModel[];
  subCategoryCodes!: AssetSubCategoryMasterModel[];
  disposalMethodCodes!: CommonValueListModel[];
  disposalItemsLine!: DisposalItemLines;
  productCodes!: ProductMasterModel[];
  isDisposalAddHidden: boolean = false;
  isDisposalEditHidden: boolean = true;
  isDisposalDeleteHidden: boolean = true;
  isDisposalUpdateHidden: boolean = true;
  isDisposalCancelHidden: boolean = true;
  productDescription!: string;
  subCategoryCodesSearchHolder!: AssetSubCategoryMasterModel[];
  viewMode: boolean = false;
  disposalSerialNumber!: string;
  disposalAssetName!: string;
  disposalCurrentBookValue!: number;
  employeeCodes!: EmployeeMasterModel[];
  locationCodes!: LocationMasterModel[];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private assetDisposalService: AssetDisposalService,
    private supplierMasterService: SupplierMasterService,
    private assetCategoryMasterService: AssetCategoryMasterService,
    private assetSubCategoryMasterService: AssetSubCategoryMasterService,
    private commonValueListMasterService: CommonValueListService,
    private productMasterService: ProductMasterService,
    private employeeMasterService: EmployeeMasterService,
    private locationMasterService: LocationmasterService,
    private saveAlert: SaveAlert) {

    this.assetDisposalForm = this.formBuilder.group({
      AssetSelCode: [null],
      CategorySelCode: [null],
      SubCategorySelCode: [null],
      assetDisposalSelCode: [null, Validators.required],
      remarks: [null, Validators.required],
      DisposalAmount: [null, Validators.required],
      LocationSelCode: [null],
      EmployeeSelCode: [null],
      ProductSelDesc: [null],
      SerialSelNumber: [null]

    });
  }

  async ngOnInit() {
    this.rowDisposalData = [];
    this.columnDisposalDefs = [
      { field: 'serialNumber', sortable: true, filter: true },
      { field: 'productId', sortable: true, filter: true, hide: true },
      { field: 'assetCode', sortable: true, filter: true },
      { field: 'assetName', sortable: true, filter: true },
      { field: 'disposalMethodId', sortable: true, filter: true, hide: true },
      { headerName: 'Disposal Method', field: 'disposalMethodValue', sortable: true, filter: true },
      { field: 'disposalDate', sortable: true, filter: true },
      { field: 'disposedAmount', sortable: true, filter: true },
      { field: 'remarks', sortable: true, filter: true }

    ];

    this.SetDropDownValueOnChange();

    this.SetDatePickerInitValue();

    //Get Drop Down Items
    await this.GetDropDownInitValues();

    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.disposalId = params['id'];
        this.editMode = true;
        this.disposalData = this.assetDisposalService.getAssetDisposalMasterByKey(this.disposalId) as AssetDisposalModel;
        this.ShowEditViewDisposalMaster(this.disposalData);

        if (params['state'] === 'view') {
          this.disableControls();
          this.viewMode = true;
        }
      } else {
        this.editMode = false;
      }
    });
  }

  private async GetDropDownInitValues() {
    this.productCodes = await this.productMasterService.getProductMaster();
    this.categoryCodes = await this.assetCategoryMasterService.getAssetCategoryMaster();
    this.subCategoryCodes = await this.assetSubCategoryMasterService.getAssetSubCategoryMaster();
    this.subCategoryCodesSearchHolder = this.subCategoryCodes;
    this.disposalMethodCodes = await this.commonValueListMasterService.getAssetDisposalStatusItems();
    this.employeeCodes = await this.employeeMasterService.getEmployeeMaster();
    this.locationCodes = await this.locationMasterService.getLocationMaster();

  }

  private SetDatePickerInitValue() {
    const today = new Date();
    const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    $('#DisposalDate').datetimepicker({
      format: 'L'
    });

    $('[name="#DisposalDate"]').on("change", () => {
      this.assetDisposalFormControls.DisposalDate.setValue($('[name="DisposalDate"]').val());
    });

    $("#DisposalDate .datetimepicker-input").val(datepart); // Assign the value
    $("#DisposalDate .datetimepicker-input").trigger("click"); // Trigger click


  }

  private SetDropDownValueOnChange() {
    $('.select2bs4').select2();


    $('[name="AssetSelCode"]').on("change", () => {
      this.assetDisposalFormControls.AssetSelCode.setValue($('[name="AssetSelCode"]').val());
      this.disposalAssetName = this.productCodes.find(item => item.productId == this.assetDisposalFormControls.AssetSelCode.value)?.productName as string;
    });

    $('[name="CategorySelCode"]').on("change", () => {
      this.assetDisposalFormControls.CategorySelCode.setValue($('[name="CategorySelCode"]').val());
      this.subCategoryCodes = this.subCategoryCodesSearchHolder.filter(item => item.assetCategoryId == $('[name="CategorySelCode"]').val());
    });

    $('[name="SubCategorySelCode"]').on("change", () => {
      this.assetDisposalFormControls.SubCategorySelCode.setValue($('[name="SubCategorySelCode"]').val());
    });

    $('[name="assetDisposalSelCode"]').on("change", () => {
      this.assetDisposalFormControls.assetDisposalSelCode.setValue($('[name="assetDisposalSelCode"]').val());
    });
  }

  get assetDisposalFormControls() { return this.assetDisposalForm.controls; }

  // ngViewInit() {
  //   const today = new Date();
  //   const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
  //   this.assetDisposalFormControls.ReceiptDate.setValue(datepart);
  // }

  AddToDisposalGrid() {
    this.disposalSubmitted = true;
    this.errorDisposal = '';
    if (this.assetDisposalForm.invalid)
      return;

    this.error = '';
    const hasSameProduct = this.rowDisposalData.some(x => x.serialNumber == this.assetDisposalFormControls.SerialSelNumber.value);

    if (hasSameProduct) {
      this.errorDisposal = 'Same record with Serial Number already exists!';
      return;
    }

    this.UpdateDisposalItemLine();
    this.rowDisposalData.push(this.disposalItemsLine);
    this.UpdateDisposalSubGridRows();
    this.ClearAssetLineItemsControlsOnAdd();
    this.disposalSubmitted = false;
  }

  private UpdateDisposalSubGridRows() {
    this.agGrid.api.setRowData(this.rowDisposalData);
    this.agGrid.api.redrawRows();
  }

  private UpdateDisposalItemLine() {
    this.disposalItemsLine = new DisposalItemLines();
    this.disposalItemsLine.productId = this.assetDisposalFormControls.AssetSelCode.value;
    this.disposalItemsLine.assetCode = this.productCodes.filter(x => x.productId == this.assetDisposalFormControls.AssetSelCode.value)[0].productCode;
    this.disposalItemsLine.assetName = this.productCodes.filter(x => x.productId == this.assetDisposalFormControls.AssetSelCode.value)[0].productName;
    this.disposalItemsLine.disposalMethodId = this.assetDisposalFormControls.assetDisposalSelCode.value;
    this.disposalItemsLine.disposalMethodValue = this.assetDisposalFormControls.assetDisposalSelCode.value;
    this.disposalItemsLine.currentBookValue = this.disposalCurrentBookValue;
    this.disposalItemsLine.disposedAmount = this.assetDisposalFormControls.DisposalAmount.value;
    this.disposalItemsLine.disposedDate = $('#DisposalDate .datetimepicker-input').val();
    this.disposalItemsLine.remarks = this.assetDisposalFormControls.remarks.value;
    this.ClearAssetLineItemsControlsOnAdd();
    this.disposalSubmitted = false;
  }

  EditAssetDisposal() {
    this.disposalItemsLine = this.agGrid.api.getSelectedRows()[0];
    this.assetDisposalFormControls.AssetSelCode.setValue(this.disposalItemsLine.productId);
    this.assetDisposalFormControls.assetDisposalSelCode.setValue(this.disposalItemsLine.disposalMethodValue);
    this.assetDisposalFormControls.DisposalAmount.setValue(this.disposalItemsLine.disposedAmount);
    this.disposalCurrentBookValue = this.disposalItemsLine.currentBookValue;
    this.disposalAssetName = this.disposalItemsLine.assetName;
    this.disposalSerialNumber = this.disposalItemsLine.serialNumber;
    $('#DisposalDate .datetimepicker-input').val(this.disposalItemsLine.disposedDate);
    this.assetDisposalFormControls.remarks.setValue(this.disposalItemsLine.remarks);
    $('select').select2().trigger('change');
    this.isDisposalAddHidden = true;
    this.isDisposalDeleteHidden = true;
    this.isDisposalEditHidden = true;
    this.isDisposalUpdateHidden = false;
    this.isDisposalCancelHidden = false;
  }

  DeleteAssetDisposal() {
    this.disposalItemsLine = this.agGrid.api.getSelectedRows()[0];
    const index = this.rowDisposalData.findIndex(x => x.serialNumber == this.disposalItemsLine.serialNumber);
    if (index > -1) {
      this.rowDisposalData.splice(index, 1);
      this.agGrid.api.setRowData(this.rowDisposalData);
      this.agGrid.api.redrawRows();
    }
  }

  onDisposalRowClick(event: any) {

    this.isDisposalEditHidden = !this.isDisposalUpdateHidden || this.viewMode;
    this.isDisposalDeleteHidden = !this.isDisposalUpdateHidden || this.viewMode;

  }

  ClearAssetLineItemsControlsOnAdd() {
    this.assetDisposalFormControls.AssetSelCode.setValue('');
    this.assetDisposalFormControls.assetDisposalSelCode.setValue('');
    this.disposalCurrentBookValue = 0;
    this.disposalAssetName = '';
    this.disposalSerialNumber = '';
    $('#DisposalDate .datetimepicker-input').val('');
    this.assetDisposalFormControls.remarks.setValue('');
    $('select').select2().trigger('change');
  }

  UpdateAssetDisposal() {
    this.submitted = true;
    this.errorDisposal = '';
    if (this.assetDisposalForm.invalid)
      return;

    this.UpdateDisposalItemLine();

    const index = this.rowDisposalData.findIndex(x => x.serialNumber == this.disposalItemsLine.serialNumber);

    if (index > -1) {
      this.rowDisposalData[index] = this.disposalItemsLine;
    }
    this.UpdateDisposalSubGridRows();
    this.isDisposalAddHidden = false;
    this.isDisposalDeleteHidden = true;
    this.isDisposalEditHidden = true;
    this.isDisposalUpdateHidden = true;
    this.isDisposalCancelHidden = true;
  }

  CancelAssetReceipt() {
    this.isDisposalAddHidden = false;
    this.isDisposalDeleteHidden = true;
    this.isDisposalEditHidden = true;
    this.isDisposalUpdateHidden = true;
    this.isDisposalCancelHidden = true;
    this.ClearAssetLineItemsControlsOnAdd();
  }

  ShowGrid() {
    this.router.navigateByUrl('/assetdisposal');
  }

  disableControls() {
    // this.assetDisposalFormControls.ReceiptAgainst.disable();
    // this.assetDisposalFormControls.DocumentNo.disable();
    // this.assetDisposalFormControls.DocumentDate.disable();
    // this.assetDisposalFormControls.ReceiptDate.disable();
    // this.assetDisposalFormControls.supplierSelCode.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
    this.isDisposalDeleteHidden = true;
    this.isDisposalAddHidden = true;
    this.isDisposalEditHidden = true;
    this.isDisposalUpdateHidden = true;
    this.isDisposalCancelHidden = true;
  }

  ClearContents() {
    this.disposalId = 0;
    this.assetDisposalFormControls.AssetSelCode.setValue('');
    this.assetDisposalFormControls.assetDisposalSelCode.setValue('');
    this.disposalCurrentBookValue = 0;
    this.disposalAssetName = '';
    this.disposalSerialNumber = '';
    this.rowDisposalData = [];
    this.UpdateDisposalSubGridRows();

  }

  ShowEditViewDisposalMaster(data: AssetDisposalModel) {
    // this.disposalItemsLine = this.agGrid.api.getSelectedRows()[0];
    // this.assetDisposalFormControls.AssetSelCode.setValue(this.disposalItemsLine.productId);
    // this.assetDisposalFormControls.assetDisposalSelCode.setValue(this.disposalItemsLine.disposalMethodValue);
    // this.assetDisposalFormControls.DisposalAmount.setValue(this.disposalItemsLine.disposedAmount);
    // this.disposalCurrentBookValue = this.disposalItemsLine.currentBookValue;
    // this.disposalAssetName = this.disposalItemsLine.assetName;
    // this.disposalSerialNumber = this.disposalItemsLine.serialNumber;
    // $('#DisposalDate .datetimepicker-input').val(this.disposalItemsLine.disposedDate);
    // this.assetDisposalFormControls.remarks.setValue(this.disposalItemsLine.remarks);
    // $('select').select2().trigger('change');
    this.rowDisposalData = data.disposalItemLines;
    this.UpdateDisposalSubGridRows();
    this.disableControls();
  }

  SaveDisposalMaster() {
    this.submitted = true;
    this.error = '';
    // stop here if form is invalid
    if (this.assetDisposalForm.invalid) {
      return;
    }
    if (!(this.rowDisposalData.length > 0)) {
      this.error = 'Please add disposal line items';
      return;
    }
    let saveResponse: Observable<any>;
    this.loading = true;
    this.assetDisposalModel = new AssetDisposalModel;
    this.assetDisposalModel.disposalId = this.disposalId;
    // this.assetDisposalModel.refDocumentType = this.assetDisposalFormControls.ReceiptAgainst.value;
    // this.assetDisposalModel.refDocumentNo = this.assetDisposalFormControls.DocumentNo.value;
    // this.assetDisposalModel.refDocumentDate = $('#DocumentDate .datetimepicker-input').val();
    // this.assetDisposalModel.receiptDate = $('#ReceiptDate .datetimepicker-input').val();
    // this.assetDisposalModel.supplierId = this.assetDisposalFormControls.supplierSelCode.value;
    this.assetDisposalModel.disposalItemLines = this.rowDisposalData;

    if (this.editMode) {
      saveResponse = this.assetDisposalService.editAssetDisposalmaster(this.assetDisposalModel);
    } else {
      saveResponse = this.assetDisposalService.addAssetDisposalmaster(this.assetDisposalModel);
    }


    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          this.assetDisposalModel.disposalId = result.disposalId;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.assetDisposalService.AddOrEditRecordToCache(this.assetDisposalModel, this.editMode);
        this.submitted = false;
        if (this.editMode) {
          this.ShowGrid();
        }
        this.loading = false;
      },
      err => {
        this.error = err.error ? err.error : err.message;
        this.loading = false;
      }
    );

  }


}

