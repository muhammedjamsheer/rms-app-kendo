import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { FileUploader } from "ng2-file-upload";
import { AssetCategoryMasterService } from '../../../../core/service/assetcategorymaster.service';
import { AssetRegisterService } from '../../../../core/service/assetregister.service';
import { AssetSubCategoryMasterService } from '../../../../core/service/assetsubcategorymaster.service';
import { BrandmasterService } from '../../../../core/service/brandmaster.service';
import { BrandmodelmasterService } from '../../../../core/service/brandmodelmaster.service';
import { CommonValueListService } from '../../../../core/service/commonlistvalue.service';
import { DepartmentmasterService } from '../../../../core/service/departmentmaster.service';
import { DownloadService } from '../../../../core/service/download.service';
import { EmployeeMasterService } from '../../../../core/service/employeemaster.service';
import { LocationmasterService } from '../../../../core/service/locationmaster.service';
import { ProductMasterService } from '../../../../core/service/productmaster.service';
import { SupplierMasterService } from '../../../../core/service/suppliermaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { AdditionalCostDetailsModel } from '../../../../shared/model/AdditionalCostDetailsModel';
import { AssetCategoryMasterModel } from '../../../../shared/model/AssetCategoryMasterModel';
import { AssetRegisterDetailsModel } from '../../../../shared/model/AssetRegisterDetailsModel';
import { AssetRegisterModel } from '../../../../shared/model/AssetRegisterModel';
import { AssetSubCategoryMasterModel } from '../../../../shared/model/AssetSubCategoryMasterModel';
import { BrandMasterModel } from '../../../../shared/model/BrandMasterModel';
import { BrandModelMasterModel } from '../../../../shared/model/BrandModelMasterModel';
import { CommonValueListModel } from '../../../../shared/model/CommonValueListModel';
import { DepartmentMasterModel } from '../../../../shared/model/DepartmentMasterModel';
import { EmployeeMasterModel } from '../../../../shared/model/EmployeeMasterModel';
import { LocationMasterModel } from '../../../../shared/model/LocationMasterModel';
import { ProductMasterModel } from '../../../../shared/model/ProductMasterModel';
import { ReceiptItemsLine } from '../../../../shared/model/ReceiptItemsLine';
import { SupplierMasterModel } from '../../../../shared/model/SupplierMasterModel';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'org-fat-assetregisterform',
  templateUrl: './assetregisterform.component.html',
  styleUrls: ['./assetregisterform.component.scss']
})
export class AssetregisterformComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  @ViewChild('fileInput', { static: false })
  fileInputImage!: ElementRef;
  // @ViewChild('fileInputDoc', {static: false})
  // fileInputDoc! : ElementRef;
  IsMaintenanceRequired: boolean = false;
  IsDepreciationRequired: boolean = true;
  IsAssetDisposed: boolean = false;
  assetRegisterForm: FormGroup;
  submitted = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  assetRegisterId!: number;
  error = '';
  errorReceipt = '';
  editMode: boolean = false;
  viewMode: boolean = false;
  receiptData!: AssetRegisterModel;
  assetregistermodel: AssetRegisterModel = new AssetRegisterModel;
  rowAssetAdditions!: AdditionalCostDetailsModel[];
  columnReceiptDefs: any;
  suppCodes!: SupplierMasterModel[];
  categoryCodes!: AssetCategoryMasterModel[];
  subCategoryCodes!: AssetSubCategoryMasterModel[];
  brandCodes!: BrandMasterModel[];
  modelCodes!: BrandModelMasterModel[];
  assetStatusCodes!: CommonValueListModel[];
  assetConditionCodes!: CommonValueListModel[];
  departmentCodes!: DepartmentMasterModel[];
  employeeCodes!: EmployeeMasterModel[];
  receiptItemsLine!: ReceiptItemsLine;
  productCodes!: ProductMasterModel[];
  isReceiptAddHidden: boolean = false;
  isReceiptEditHidden: boolean = true;
  isReceiptDeleteHidden: boolean = true;
  isReceiptUpdateHidden: boolean = true;
  isReceiptCancelHidden: boolean = true;
  employeeCodesSearchHolder!: EmployeeMasterModel[];
  locationCodes!: LocationMasterModel[];
  assetDisposalCodes!: CommonValueListModel[];
  maintenanceTypes!: CommonValueListModel[];
  assetDescription!: string;
  categoryCode!: string;
  subCategoryCode!: string;
  fileList!: FileList;
  fileImageList!: FileList;
  categoryDetails!: string;
  subCategoryDetails!: string;
  SerialNumber!: string;
  locale = 'en-US';
  isPopup: boolean = false;
  auditId!: number;
  auditDate!: Date;
  previewImage!: SafeStyle;

  uploader: FileUploader = new FileUploader({
    isHTML5: true,
    maxFileSize: 2 * 1024 * 1024,
    queueLimit: 3
  });
  downloadDocumentsList: string[] = [];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private assetRegisterService: AssetRegisterService,
    private supplierMasterService: SupplierMasterService,
    private assetCategoryMasterService: AssetCategoryMasterService,
    private assetSubCategoryMasterService: AssetSubCategoryMasterService,
    private brandMasterService: BrandmasterService,
    private brandModelMasterService: BrandmodelmasterService,
    private commonValueListMasterService: CommonValueListService,
    private productMasterService: ProductMasterService,
    private departmentMasterService: DepartmentmasterService,
    private employeeMasterService: EmployeeMasterService,
    private locationMasterService: LocationmasterService,
    private saveAlert: SaveAlert,
    private downloadService: DownloadService,
    private sanitizer: DomSanitizer) {

    this.assetRegisterForm = this.formBuilder.group({
      IsDepreciationRequiredCheckBox: [],
      SerialNo: [],
      supplierSelCode: [null, Validators.required],
      ProductSelDesc: [],
      AssetSelCode: [null, Validators.required],
      SupplierPartNo: [],
      PurchasePrice: [null, Validators.required],
      CategorySelCode: [],
      SubCategorySelCode: [],
      BrandSelCode: [],
      ModelSelCode: [],
      assetStatusSelCode: [],
      assetConditionSelCode: [],
      ReceiptDocDetailsDiv: [],
      departmentSelCode: [],
      EmployeeSelCode: [],
      LocationSelCode: [],
      InsuranceCompany: [],
      InsuranceEndDate: [],
      PurchaseDate: [],
      InsuranceValue: [],
      InsuranceStartDate: [],
      DepreciationStartDate: [],
      DepreciationPeriod: [],
      DepreciationStartValue: [],
      DepreciationPercentage: [],
      IsAssetDisposedCheckBox: [{ disabled: true, checked: false }],
      assetDisposalSelCode: [],
      DisposalAmount: [],
      Comments: [],
      DisposalDate: [],
      EstDisposalAmount: [],
      IsMaintenanceRequiredCheckBox: [],
      MaintenanceStartDate: [],
      ItemDescription: [],
      Qty: [],
      DateBought: [],
      Cost: [],
      SalvageValue: [],
      DepreciationValue: [],
      AccumulatedDepreciation: [],
      CurrentBookValue: [],
      WarrantyValue: [],
      WarrantyEndDate: [],
      WarrantyStartDate: [],
      MaintenanceCode: [],
      fileInputImage: [],      
      fileInputDoc: []
    });
  }

  async ngOnInit() {

    this.route.queryParamMap.subscribe((params: any) => {
      this.isPopup = params.params.popup == 1;
      this.auditId = params.params.auditNo;
      this.auditDate = params.params.auditDate;
    });

    this.rowAssetAdditions = [];
    this.columnReceiptDefs = [
      { field: 'description', sortable: true, filter: true, resizable: true },
      { field: 'dateBought', sortable: true, filter: true, resizable: true },
      { field: 'quantity', sortable: true, filter: true, resizable: true },
      { field: 'amount', sortable: true, filter: true, resizable: true }
    ];
    this.SetDropDownValueOnChange();

    this.SetDatePickerInitValue();

    //Get Drop Down Items
    await this.GetDropDownInitValues();

    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.SerialNumber = params['id'];
        if (params['state'] == 'edit')
          this.editMode = true;
        this.assetRegisterService.getAssetRegisterByKey(this.SerialNumber).subscribe(res => {
          this.assetRegisterService.getAssetRegisterDetails(this.SerialNumber).subscribe(data => {
            console.log(data);
            this.ShowEditViewAssetRegister(res, data);
          })

        });

        if (params['state'] === 'view') {
          this.viewMode = true;
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
    });
  }

  private async GetDropDownInitValues() {
    this.productCodes = await this.productMasterService.getProductMaster();
    this.suppCodes = await this.supplierMasterService.getSupplierMaster();
    this.categoryCodes = await this.assetCategoryMasterService.getAssetCategoryMaster();
    this.subCategoryCodes = await this.assetSubCategoryMasterService.getAssetSubCategoryMaster();
    this.brandCodes = await this.brandMasterService.getBrandMaster();
    this.modelCodes = await this.brandModelMasterService.getBrandmodelMaster();
    this.assetStatusCodes = await this.commonValueListMasterService.getAssetStatusItems();
    this.assetConditionCodes = await this.commonValueListMasterService.getAssetConditionItems();
    this.departmentCodes = await this.departmentMasterService.getDepartmentMaster();
    this.employeeCodes = await this.employeeMasterService.getEmployeeMaster();
    this.employeeCodesSearchHolder = this.employeeCodes;
    this.locationCodes = await this.locationMasterService.getLocationMaster();
    this.assetDisposalCodes = await this.commonValueListMasterService.getAssetDisposalStatusItems();
    this.maintenanceTypes = await this.commonValueListMasterService.getMaintenanceTypes();
  }

  private SetDatePickerInitValue() {
    const today = new Date();
    const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    $('#WarrantyEndDate').datetimepicker({
      format: 'L'
    });

    $('#WarrantyStartDate').datetimepicker({
      format: 'L'
    });

    $('#InsuranceEndDate').datetimepicker({
      format: 'L'
    });

    $('#PurchaseDate').datetimepicker({
      format: 'L'
    });

    $('#InsuranceStartDate').datetimepicker({
      format: 'L'
    });

    $('#DepreciationStartDate').datetimepicker({
      format: 'L'
    });

    $('#DisposalDate').datetimepicker({
      format: 'L'
    });


    $('#MaintenanceStartDate').datetimepicker({
      format: 'L'
    });

    $('#DateBought').datetimepicker({
      format: 'L'
    });

    $("#WarrantyEndDate .datetimepicker-input").val(datepart); // Assign the value
    $("#WarrantyEndDate .datetimepicker-input").trigger("click"); // Trigger click
    $("#WarrantyEndDate .datetimepicker-input").val('');

    $("#InsuranceEndDate .datetimepicker-input").val(datepart); // Assign the value
    $("#InsuranceEndDate .datetimepicker-input").trigger("click");
    $("#InsuranceEndDate .datetimepicker-input").val('');

    $("#PurchaseDate .datetimepicker-input").val(datepart); // Assign the value
    $("#PurchaseDate .datetimepicker-input").trigger("click");
    //$("#PurchaseDate .datetimepicker-input").val('');

    $("#InsuranceStartDate .datetimepicker-input").val(datepart); // Assign the value
    $("#InsuranceStartDate .datetimepicker-input").trigger("click");
    $("#InsuranceStartDate .datetimepicker-input").val('');

    $("#DepreciationStartDate .datetimepicker-input").val(datepart); // Assign the value
    $("#DepreciationStartDate .datetimepicker-input").trigger("click");
    $("#DepreciationStartDate .datetimepicker-input").val('');

    $("#DisposalDate .datetimepicker-input").val(datepart); // Assign the value
    $("#DisposalDate .datetimepicker-input").trigger("click");
    $("#DisposalDate .datetimepicker-input").val('');

    $("#MaintenanceStartDate .datetimepicker-input").val(datepart); // Assign the value
    $("#MaintenanceStartDate .datetimepicker-input").trigger("click");
    $("#MaintenanceStartDate .datetimepicker-input").val('');

    $("#DateBought .datetimepicker-input").val(datepart); // Assign the value
    $("#DateBought .datetimepicker-input").trigger("click");
    $("#DateBought .datetimepicker-input").val('');

    $("#WarrantyStartDate .datetimepicker-input").val(datepart); // Assign the value
    $("#WarrantyStartDate .datetimepicker-input").trigger("click");
    $("#WarrantyStartDate .datetimepicker-input").val('');

  }

  private SetDropDownValueOnChange() {
    $('.select2bs4').select2();



    $('[name="supplierSelCode"]').on("change", () => {
      this.assetRegisterFormControls.supplierSelCode.setValue($('[name="supplierSelCode"]').val());
    });

    $('[name="ProductSelDesc"]').on("change", () => {
      this.assetRegisterFormControls.ProductSelDesc.setValue($('[name="ProductSelDesc"]').val());
    });

    $('[name="AssetSelCode"]').on("change", () => {
      this.assetRegisterFormControls.AssetSelCode.setValue($('[name="AssetSelCode"]').val());
      if ($('[name="AssetSelCode"]').val() > 0) {
        const productDetails = this.productCodes.filter(item => item.productId == $('[name="AssetSelCode"]').val())[0];
        this.categoryDetails = productDetails.assetCategoryCode + ' - ' + productDetails.assetCategoryName;
        this.subCategoryDetails = productDetails.assetSubCategoryCode + ' - ' + productDetails.assetSubCategoryName;
        this.assetDescription = productDetails.productDescription;
      }
    });

    $('[name="CategorySelCode"]').on("change", () => {
      this.assetRegisterFormControls.CategorySelCode.setValue($('[name="CategorySelCode"]').val());
    });

    $('[name="SubCategorySelCode"]').on("change", () => {
      this.assetRegisterFormControls.SubCategorySelCode.setValue($('[name="SubCategorySelCode"]').val());
    });

    $('[name="BrandSelCode"]').on("change", () => {
      this.assetRegisterFormControls.BrandSelCode.setValue($('[name="BrandSelCode"]').val());
    });

    $('[name="ModelSelCode"]').on("change", () => {
      this.assetRegisterFormControls.ModelSelCode.setValue($('[name="ModelSelCode"]').val());
    });

    $('[name="assetStatusSelCode"]').on("change", () => {
      this.assetRegisterFormControls.assetStatusSelCode.setValue($('[name="assetStatusSelCode"]').val());
    });

    $('[name="assetStatusSelCode"]').on("change", () => {
      this.assetRegisterFormControls.assetStatusSelCode.setValue($('[name="assetStatusSelCode"]').val());
    });

    $('[name="assetConditionSelCode"]').on("change", () => {
      this.assetRegisterFormControls.assetConditionSelCode.setValue($('[name="assetConditionSelCode"]').val());
    });

    $('[name="departmentSelCode"]').on("change", () => {
      this.assetRegisterFormControls.departmentSelCode.setValue($('[name="departmentSelCode"]').val());
      if($('[name="departmentSelCode"]').val()>0)
      {
      this.employeeCodes = this.employeeCodesSearchHolder.filter(x => x.departmentId == $('[name="departmentSelCode"]').val());
      console.log(this.employeeCodes);
      }
    });

    $('[name="EmployeeSelCode"]').on("change", () => {
      this.assetRegisterFormControls.EmployeeSelCode.setValue($('[name="EmployeeSelCode"]').val());
    });

    $('[name="LocationSelCode"]').on("change", () => {
      this.assetRegisterFormControls.LocationSelCode.setValue($('[name="LocationSelCode"]').val());
    });

    $('[name="assetDisposalSelCode"]').on("change", () => {
      this.assetRegisterFormControls.assetDisposalSelCode.setValue($('[name="assetDisposalSelCode"]').val());
    });
  }

  get assetRegisterFormControls() { return this.assetRegisterForm.controls; }

  ShowGrid() {
    this.router.navigateByUrl('/assetregister');
  }

  disableOnEditControls() {
    $("#WarrantyEndDate .datetimepicker-input").attr('disabled', true);
    $("#WarrantyStartDate .datetimepicker-input").attr('disabled', true);
    //this.assetRegisterFormControls.WarrantyEndDate.disable();
    //this.assetRegisterFormControls.WarrantyStartDate.disable();
    this.assetRegisterFormControls.InsuranceCompany.disable();
    $("#InsuranceEndDate .datetimepicker-input").attr('disabled', true);
    //this.assetRegisterFormControls.InsuranceEndDate.disable();
    //$("#PurchaseDate .datetimepicker-input").attr('disabled', true);
    //this.assetRegisterFormControls.PurchaseDate.disable();
    this.assetRegisterFormControls.InsuranceValue.disable();
    $("#InsuranceStartDate .datetimepicker-input").attr('disabled', true);
    //this.assetRegisterFormControls.IsAssetDisposedCheckBox.disable();
    this.assetRegisterFormControls.assetDisposalSelCode.disable();
    this.assetRegisterFormControls.DisposalAmount.disable();
    this.assetRegisterFormControls.Comments.disable();
    //this.assetRegisterFormControls.DisposalDate.setValue('');
    this.assetRegisterFormControls.EstDisposalAmount.disable();
    $('#DisposalDate .datetimepicker-input').attr('disabled', true);
    $("#DepreciationStartDate .datetimepicker-input").attr('disabled', true);
    this.assetRegisterFormControls.SalvageValue.disable();
    this.assetRegisterFormControls.WarrantyValue.disable();
    this.assetRegisterFormControls.LocationSelCode.disable();
    this.assetRegisterFormControls.EmployeeSelCode.disable();
    this.assetRegisterFormControls.departmentSelCode.disable();
  }

  disableControls() {
    //this.assetRegisterFormControls.AssetActive.disable();
    this.assetRegisterFormControls.IsDepreciationRequiredCheckBox.disable();
    this.assetRegisterFormControls.IsDepreciationRequiredCheckBox
    this.assetRegisterFormControls.SerialNo.disable();
    this.assetRegisterFormControls.supplierSelCode.disable();
    this.assetRegisterFormControls.ProductSelDesc.disable();
    this.assetRegisterFormControls.AssetSelCode.disable();
    this.assetRegisterFormControls.SupplierPartNo.disable();
    this.assetRegisterFormControls.PurchasePrice.disable();
    //this.assetRegisterFormControls.CategoryId.disable();
    //this.assetRegisterFormControls.SubCategoryId.disable();
    this.assetRegisterFormControls.BrandSelCode.disable();
    this.assetRegisterFormControls.ModelSelCode.disable();
    this.assetRegisterFormControls.assetStatusSelCode.disable();
    this.assetRegisterFormControls.assetConditionSelCode.disable();
    this.assetRegisterFormControls.departmentSelCode.disable();
    this.assetRegisterFormControls.EmployeeSelCode.disable();
    this.assetRegisterFormControls.LocationSelCode.disable();
    $("#WarrantyEndDate .datetimepicker-input").attr('disabled', true);
    $("#WarrantyStartDate .datetimepicker-input").attr('disabled', true);
    //this.assetRegisterFormControls.WarrantyEndDate.disable();
    //this.assetRegisterFormControls.WarrantyStartDate.disable();
    this.assetRegisterFormControls.InsuranceCompany.disable();
    $("#InsuranceEndDate .datetimepicker-input").attr('disabled', true);
    //this.assetRegisterFormControls.InsuranceEndDate.disable();
    $("#PurchaseDate .datetimepicker-input").attr('disabled', true);
    //this.assetRegisterFormControls.PurchaseDate.disable();
    this.assetRegisterFormControls.InsuranceValue.disable();
    $("#InsuranceStartDate .datetimepicker-input").attr('disabled', true);
    //this.assetRegisterFormControls.InsuranceStartDate.disable();
    $("#DepreciationStartDate .datetimepicker-input").attr('disabled', true);
    //this.assetRegisterFormControls.DepreciationStartDate.disable();
    this.assetRegisterFormControls.DepreciationPeriod.disable();
    this.assetRegisterFormControls.DepreciationStartValue.disable();
    this.assetRegisterFormControls.DepreciationPercentage.disable();
    //this.assetRegisterFormControls.IsAssetDisposedCheckBox.disable();
    this.assetRegisterFormControls.assetDisposalSelCode.disable();
    this.assetRegisterFormControls.DisposalAmount.disable();
    this.assetRegisterFormControls.Comments.disable();
    $("#DisposalDate .datetimepicker-input").attr('disabled', true);
    //this.assetRegisterFormControls.DisposalDate.disable();
    this.assetRegisterFormControls.EstDisposalAmount.disable();
    this.assetRegisterFormControls.IsMaintenanceRequiredCheckBox.disable();
    $("#MaintenanceStartDate .datetimepicker-input").attr('disabled', true);
    //this.assetRegisterFormControls.MaintenanceStartDate.disable();
    this.assetRegisterFormControls.ItemDescription.disable();
    this.assetRegisterFormControls.Qty.disable();
    this.assetRegisterFormControls.SalvageValue.disable();
    this.assetRegisterFormControls.DepreciationValue.disable();
    this.assetRegisterFormControls.AccumulatedDepreciation.disable();
    this.assetRegisterFormControls.CurrentBookValue.disable();
    this.assetRegisterFormControls.MaintenanceCode.disable();
    this.assetRegisterFormControls.WarrantyValue.disable();
    $("#DateBought .datetimepicker-input").attr('disabled', true);
    $("#InsuranceStartDate .datetimepicker-input").attr('disabled', true);
    //this.assetRegisterFormControls.DateBought.disable();
    this.assetRegisterFormControls.Cost.disable();
    this.fileInputImage.nativeElement.disabled = true;
    //this.fileInputDoc.nativeElement.disabled = true;
    this.assetRegisterFormControls.fileInputDoc.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.assetRegisterId = 0;
    //this.assetRegisterFormControls.AssetActive.setValue('');
    //this.assetRegisterFormControls.IsDepreciationRequired.setValue('');
    this.IsDepreciationRequired = true;
    
    this.assetRegisterFormControls.SerialNo.setValue('');
    this.assetRegisterFormControls.supplierSelCode.setValue('');
    this.assetRegisterFormControls.ProductSelDesc.setValue('');
    this.assetRegisterFormControls.AssetSelCode.setValue('');
    this.assetRegisterFormControls.SupplierPartNo.setValue('');
    this.assetRegisterFormControls.PurchasePrice.setValue('');
    this.assetRegisterFormControls.CategorySelCode.setValue('');
    this.assetRegisterFormControls.SubCategorySelCode.setValue('');
    this.assetRegisterFormControls.BrandSelCode.setValue('');
    this.assetRegisterFormControls.ModelSelCode.setValue('');
    this.assetRegisterFormControls.assetStatusSelCode.setValue('');
    this.assetRegisterFormControls.assetConditionSelCode.setValue('');
    this.assetRegisterFormControls.departmentSelCode.setValue('');
    this.assetRegisterFormControls.EmployeeSelCode.setValue('');
    this.assetRegisterFormControls.LocationSelCode.setValue('');
    this.assetRegisterFormControls.WarrantyEndDate.setValue('');
    //this.assetRegisterFormControls.WarrantyStartDate.setValue('');
    this.assetRegisterFormControls.InsuranceCompany.setValue('');
    //this.assetRegisterFormControls.InsuranceEndDate.setValue('');
    //this.assetRegisterFormControls.PurchaseDate.setValue('');
    this.assetRegisterFormControls.InsuranceValue.setValue('');
    //this.assetRegisterFormControls.InsuranceStartDate.setValue('');
    //this.assetRegisterFormControls.DepreciationStartDate.setValue('');
    this.assetRegisterFormControls.DepreciationPeriod.setValue('');
    this.assetRegisterFormControls.DepreciationStartValue.setValue('');
    this.assetRegisterFormControls.DepreciationPercentage.setValue('');
    //this.assetRegisterFormControls.IsAssetDisposedCheckBox.setValue('');
    this.IsAssetDisposed = false;
    this.assetRegisterFormControls.assetDisposalSelCode.setValue('');
    this.assetRegisterFormControls.DisposalAmount.setValue('');
    this.assetRegisterFormControls.Comments.setValue('');
    //this.assetRegisterFormControls.DisposalDate.setValue('');
    this.assetRegisterFormControls.EstDisposalAmount.setValue('');
    //this.assetRegisterFormControls.IsMaintenanceRequired.setValue('');
    this.assetRegisterFormControls.MaintenanceStartDate.setValue('');
    this.assetRegisterFormControls.ItemDescription.setValue('');
    this.assetRegisterFormControls.Qty.setValue('');
    this.assetRegisterFormControls.SalvageValue.setValue('');
    this.assetRegisterFormControls.DepreciationValue.setValue('');
    this.assetRegisterFormControls.AccumulatedDepreciation.setValue('');
    this.assetRegisterFormControls.CurrentBookValue.setValue('');
    //this.assetRegisterFormControls.DateBought.setValue('');
    this.assetRegisterFormControls.Cost.setValue('');
    this.assetRegisterFormControls.WarrantyValue.setValue('');
    this.assetRegisterFormControls.MaintenanceCode.setValue('');
    this.fileInputImage.nativeElement.value = '';
    //this.fileInputDoc.nativeElement.value = '';
    this.categoryDetails = '';
    this.assetDescription = '';
    this.subCategoryDetails = '';
    this.SetDatePickerInitValue();

    $('select').select2().trigger('change');

  }

  ShowEditViewAssetRegister(data: AssetRegisterModel, dataDetails: AssetRegisterDetailsModel) {  
    console.log(data);
    console.log(dataDetails);  
    this.IsDepreciationRequired = data.depreciationRequired;
    this.assetRegisterFormControls.SerialNo.setValue(data.serialNo);
    this.assetRegisterFormControls.supplierSelCode.setValue(data.supplierId);
    this.assetRegisterFormControls.ProductSelDesc.setValue(data.productId);
    this.assetRegisterFormControls.AssetSelCode.setValue(data.productId);
    this.assetRegisterFormControls.SupplierPartNo.setValue(data.manufacturePartNo);
    this.assetRegisterFormControls.PurchasePrice.setValue(data.purchasePrice);
    this.assetRegisterFormControls.CategorySelCode.setValue(data.categoryId);
    this.assetRegisterFormControls.SubCategorySelCode.setValue(data.subCategoryId);
    this.assetRegisterFormControls.BrandSelCode.setValue(data.brandId);
    this.assetRegisterFormControls.ModelSelCode.setValue(data.modelId);
    this.assetRegisterFormControls.assetStatusSelCode.setValue(data.assetStatusId);
    this.assetRegisterFormControls.assetConditionSelCode.setValue(data.assetConditionId);
    this.assetRegisterFormControls.departmentSelCode.setValue(dataDetails.departmentId);
    this.assetRegisterFormControls.WarrantyValue.setValue(dataDetails.warrantyAmount);
    this.assetRegisterFormControls.LocationSelCode.setValue(dataDetails.locationId);
    $('#WarrantyEndDate .datetimepicker-input').val(dataDetails.warrantyEndDate ? formatDate(dataDetails.warrantyEndDate, 'MM/dd/yyyy', this.locale) : '');
    //this.assetRegisterFormControls.WarrantyEndDate.setValue(data.warrantyEndDate);
    $('#WarrantyStartDate .datetimepicker-input').val(dataDetails.warrantyStartDate ? formatDate(dataDetails.warrantyStartDate, 'MM/dd/yyyy', this.locale) : '');
    //this.assetRegisterFormControls.WarrantyStartDate.setValue(data.warrantyStartDate);
    this.assetRegisterFormControls.InsuranceCompany.setValue(dataDetails.insuranceName);
    $('#InsuranceEndDate .datetimepicker-input').val(dataDetails.insuranceEndDate ? formatDate(dataDetails.insuranceEndDate, 'MM/dd/yyyy', this.locale) : '');
    //this.assetRegisterFormControls.InsuranceEndDate.setValue(data.insuranceEndDate);
    this.assetRegisterFormControls.PurchaseDate.setValue(data.purchaseDate);
    $('#PurchaseDate .datetimepicker-input').val(data.purchaseDate ? formatDate(data.purchaseDate, 'MM/dd/yyyy', this.locale) : '');
    this.assetRegisterFormControls.InsuranceValue.setValue(dataDetails.insuranceValue);
    $('#InsuranceStartDate .datetimepicker-input').val(dataDetails.insuranceStartDate ? formatDate(dataDetails.insuranceStartDate, 'MM/dd/yyyy', this.locale) : '');
    //this.assetRegisterFormControls.InsuranceStartDate.setValue(data.insuranceStartDate);
    $('#DepreciationStartDate .datetimepicker-input').val(dataDetails.depreciationStartDate ? formatDate(dataDetails.depreciationStartDate, 'MM/dd/yyyy', this.locale) : '');
    //this.assetRegisterFormControls.DepreciationStartDate.setValue(data.depreciationStartDate);
    this.assetRegisterFormControls.DepreciationPeriod.setValue(dataDetails.depreciationPeriod);
    this.assetRegisterFormControls.DepreciationStartValue.setValue(dataDetails.depreciationValue);
    this.assetRegisterFormControls.DepreciationPercentage.setValue(data.depreciationPercentage);
    //this.assetRegisterFormControls.IsAssetDisposed.setValue(dataDetails.disposed);
    this.IsAssetDisposed = dataDetails.disposed;
    this.assetRegisterFormControls.assetDisposalSelCode.setValue(dataDetails.disposalMethodId);
    this.assetRegisterFormControls.DisposalAmount.setValue(dataDetails.disposalAmount);
    this.assetRegisterFormControls.Comments.setValue(dataDetails.disposalComment);
    $('#DisposalDate .datetimepicker-input').val(dataDetails.disposalDate ? formatDate(dataDetails.disposalDate, 'MM/dd/yyyy', this.locale) : '');
    //this.assetRegisterFormControls.DisposalDate.setValue(data.disposalDate);
    this.assetRegisterFormControls.EstDisposalAmount.setValue(dataDetails.disposalEstAmount);
    this.IsMaintenanceRequired = dataDetails.alertMaintenance;
    $('#MaintenanceStartDate .datetimepicker-input').val(dataDetails.alertMaintenanceDate ? formatDate(dataDetails.alertMaintenanceDate, 'MM/dd/yyyy', this.locale) : '');
    //this.assetRegisterFormControls.MaintenanceStartDate.setValue(data.maintenanceStartDate);
    this.assetRegisterFormControls.MaintenanceCode.setValue(dataDetails.alertMaintenanceCode);
    this.assetRegisterFormControls.ItemDescription.setValue(data.addDescription);
    this.assetRegisterFormControls.Qty.setValue(data.addQuantity);
    this.assetRegisterFormControls.SalvageValue.setValue(dataDetails.salvageValue);
    this.assetRegisterFormControls.DepreciationValue.setValue(data.depreciationValue);
    this.assetRegisterFormControls.AccumulatedDepreciation.setValue(data.accumulatedDepreciation);
    this.assetRegisterFormControls.CurrentBookValue.setValue(dataDetails.bookValue);
    this.assetRegisterFormControls.EmployeeSelCode.setValue(dataDetails.employeeId);
    $('#DateBought .datetimepicker-input').val(data.addDateBought ? formatDate(data.addDateBought, 'MM/dd/yyyy', this.locale) : '');
    //this.assetRegisterFormControls.DateBought.setValue(data.addDateBought);
    this.rowAssetAdditions = dataDetails.assetAdditions;
    this.downloadDocumentsList = dataDetails.documentIds ? dataDetails.documentIds.split(';') : [];
    if (this.downloadDocumentsList.length > 1)
      this.downloadDocumentsList.pop();
    $('select').select2().trigger('change');

    this.disableOnEditControls();
    this.ImageDisplay(dataDetails.imageId);
  }

  ImageDisplay(imageId: string) {
    var imageExtension = imageId.substr(imageId.lastIndexOf('.') + 1);
    this.downloadService.DownloadFile(imageId).subscribe((data: any) => {
      let blob = new Blob([data], { type: 'image/' + imageExtension });
      let objectURL = window.URL.createObjectURL(blob);      
      this.previewImage = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);      
    });
  }

  RegisterFileDownLoad(fileName: string) {    
    var docExtension = fileName.substr(fileName.lastIndexOf('.') + 1);
    this.downloadService.DownloadFile(fileName).subscribe((data: any) => {

      var blob = new Blob([data], { type: 'application/' + docExtension });

      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = fileName;
      link.click();

    });
  }

  private UpdateReceiptSubGridRows() {
    this.agGrid.api.setRowData(this.rowAssetAdditions);
    this.agGrid.api.redrawRows();
  }

  IsMaintenanceRequiredCheckBoxvalue(event: any) {
    this.IsMaintenanceRequired = event.target.checked;
  }

  IsDepreciationRequiredCheckBoxvalue(event: any) {
    this.IsDepreciationRequired = event.target.checked;
  }

  IsAssetDisposedCheckBoxvalue(event: any) {
    this.IsAssetDisposed = event.target.checked;
  }

  fileChange(event: any) {
    this.fileList = event.target.files;
  }

  fileImageChange(event: any) {
    this.fileImageList = event.target.files;
  }

  ClosePage() {
    this.router.navigate([{ outlets: { assetregisterpopup: null } }], { queryParams: { auditNo: this.auditId, auditDate: this.auditDate } });
  }
  SaveAssetRegister() {
    this.submitted = true;
    this.error = '';
    // stop here if form is invalid
    if (this.assetRegisterForm.invalid) {
      return;
    }
    this.loading = true;
    let saveResponse: Observable<any>;

    //this.assetRegisterId = this.assetRegisterId;
    const formData = new FormData();
    formData.append('depreciationRequired', this.IsDepreciationRequired.toString());
    formData.append('serialNo', this.SerialNumber);
    formData.append('doNotGenerateSerialNo', this.isPopup.toString());
    formData.append('supplierId', this.assetRegisterFormControls.supplierSelCode.value);
    formData.append('productDescription', this.assetRegisterFormControls.ProductSelDesc.value);
    formData.append('ProductId', this.assetRegisterFormControls.AssetSelCode.value);
    formData.append('manufacturePartNo', this.assetRegisterFormControls.SupplierPartNo.value);
    formData.append('purchasePrice', this.assetRegisterFormControls.PurchasePrice.value);
    formData.append('categoryId', this.assetRegisterFormControls.CategorySelCode.value);
    formData.append('subCategoryId', this.assetRegisterFormControls.SubCategorySelCode.value);
    if (this.assetRegisterFormControls.BrandSelCode.value)
      formData.append('brandId', this.assetRegisterFormControls.BrandSelCode.value);
    if (this.assetRegisterFormControls.ModelSelCode.value)
      formData.append('modelId', this.assetRegisterFormControls.ModelSelCode.value);
    if (this.assetRegisterFormControls.assetStatusSelCode.value)
      formData.append('assetStatusId', this.assetRegisterFormControls.assetStatusSelCode.value);
    if (this.assetRegisterFormControls.assetConditionSelCode.value)
      formData.append('assetConditionId', this.assetRegisterFormControls.assetConditionSelCode.value);
    formData.append('departmentID', this.assetRegisterFormControls.departmentSelCode.value);
    if (this.assetRegisterFormControls.EmployeeSelCode.value)
      formData.append('employeeId', this.assetRegisterFormControls.EmployeeSelCode.value);
    if (this.assetRegisterFormControls.LocationSelCode.value)
      formData.append('locationId', this.assetRegisterFormControls.LocationSelCode.value);
    formData.append('warrantyStartDate', $('#WarrantyStartDate .datetimepicker-input').val() ? formatDate($('#WarrantyStartDate .datetimepicker-input').val(), 'yyyy-MM-dd', this.locale) : '');
    formData.append('warrantyEndDate', $('#WarrantyEndDate .datetimepicker-input').val() ? formatDate($('#WarrantyEndDate .datetimepicker-input').val(), 'yyyy-MM-dd', this.locale) : '');
    if (this.assetRegisterFormControls.InsuranceCompany.value)
      formData.append('insuranceName', this.assetRegisterFormControls.InsuranceCompany.value);
    if ($('#InsuranceStartDate .datetimepicker-input').val())
      formData.append('insuranceStartDate', $('#InsuranceStartDate .datetimepicker-input').val() ? formatDate($('#InsuranceStartDate .datetimepicker-input').val(), 'yyyy-MM-dd', this.locale) : '');
    if ($('#InsuranceEndDate .datetimepicker-input').val())
      formData.append('insuranceEndDate', $('#InsuranceEndDate .datetimepicker-input').val() ? formatDate($('#InsuranceEndDate .datetimepicker-input').val(), 'yyyy-MM-dd', this.locale) : '');
    formData.append('purchaseDate', $('#PurchaseDate .datetimepicker-input').val() ? formatDate($('#PurchaseDate .datetimepicker-input').val(), 'yyyy-MM-dd', this.locale) : '');
    if (this.assetRegisterFormControls.InsuranceValue.value)
      formData.append('insuranceValue', this.assetRegisterFormControls.InsuranceValue.value);
    formData.append('insuranceStartDate', $('#InsuranceStartDate .datetimepicker-input').val() ? formatDate($('#InsuranceStartDate .datetimepicker-input').val(), 'yyyy-MM-dd', this.locale) : '');
    formData.append('depreciationStartDate', $('#DepreciationStartDate .datetimepicker-input').val() ? formatDate($('#DepreciationStartDate .datetimepicker-input').val(), 'yyyy-MM-dd', this.locale) : '');
    formData.append('depreciationPeriod', this.assetRegisterFormControls.DepreciationPeriod.value);
    formData.append('depreciationStartValue', this.assetRegisterFormControls.DepreciationStartValue.value);
    formData.append('depreciationPercentage', this.assetRegisterFormControls.DepreciationPercentage.value);
    //     if (this.editMode) {
    //       formData.append('disposed', this.assetRegisterFormControls.IsAssetDisposed.value);
    //       formData.append('disposalMethodId', this.assetRegisterFormControls.assetDisposalSelCode.value);
    //       formData.append('disposalAmount', this.assetRegisterFormControls.DisposalAmount.value);
    //       formData.append('disposalComment', this.assetRegisterFormControls.Comments.value);
    //       formData.append('disposalDate', $('#DisposalDate .datetimepicker-input').val() ? formatDate($('#DisposalDate .datetimepicker-input').val(), 'yyyy-MM-dd', this.locale) : '');
    //       formData.append('disposalEstAmount', this.assetRegisterFormControls.EstDisposalAmount.value);
    //     }
    //if(this.assetRegisterFormControls.IsMaintenanceRequired.value)
    formData.append('alertMaintenance', this.IsMaintenanceRequired.toString());
    formData.append('alertMaintenanceDate', $('#MaintenanceStartDate .datetimepicker-input').val() ? formatDate($('#MaintenanceStartDate .datetimepicker-input').val(), 'yyyy-MM-dd', this.locale) : '');
    if (this.assetRegisterFormControls.MaintenanceCode.value)
    formData.append('alertMaintenanceCode', this.assetRegisterFormControls.MaintenanceCode.value);
    formData.append('addDescription', this.assetRegisterFormControls.ItemDescription.value);
    if (this.assetRegisterFormControls.Qty.value)
      formData.append('addQuantity', this.assetRegisterFormControls.Qty.value);
    if (this.assetRegisterFormControls.SalvageValue.value != null)
      formData.append('salvageValue', this.assetRegisterFormControls.SalvageValue.value);
    formData.append('depreciationValue', this.assetRegisterFormControls.DepreciationValue.value);
    formData.append('accumulatedDepreciation', this.assetRegisterFormControls.AccumulatedDepreciation.value);
    formData.append('currentBookValue', this.assetRegisterFormControls.CurrentBookValue.value);
    formData.append('addDateBought', $('#DateBought .datetimepicker-input').val() ? formatDate($('#DateBought .datetimepicker-input').val(), 'yyyy-MM-dd', this.locale) : '');
    if (this.assetRegisterFormControls.Cost.value)
      formData.append('addAmount', this.assetRegisterFormControls.Cost.value);
    if (this.assetRegisterFormControls.WarrantyValue.value)
      formData.append('warrantyCost', this.assetRegisterFormControls.WarrantyValue.value);
    formData.append('assetAdditions', JSON.stringify(this.rowAssetAdditions));


    for (let j = 0; j < this.uploader.queue.length; j++) {
      let fileItem = this.uploader.queue[j]._file;
      formData.append('Documents', fileItem, fileItem.name);
    }

    if (this.fileImageList != null && this.fileImageList.length > 0) {
      let imageFile: File = this.fileImageList[0];
      formData.append('Image', imageFile, imageFile.name);
    }

    this.assetregistermodel = new AssetRegisterModel;
    const productDetails = this.productCodes.filter(item => item.productId == this.assetRegisterFormControls.AssetSelCode.value)[0];
    if (productDetails) {
      this.assetregistermodel.productCode = productDetails.productCode;
      this.assetregistermodel.productName = productDetails.productName;
      this.assetregistermodel.assetCategoryCode = productDetails.assetCategoryCode;
      this.assetregistermodel.assetCategoryName = productDetails.assetCategoryName;
      this.assetregistermodel.assetSubCategoryCode = productDetails.assetSubCategoryCode;
      this.assetregistermodel.assetSubCategoryName = productDetails.assetSubCategoryName;
    }
    const supplierDetails = this.suppCodes.filter(item => item.supplierId == this.assetRegisterFormControls.supplierSelCode.value)[0];
    this.assetregistermodel.supplierName = supplierDetails ? supplierDetails.supplierName : '';
    this.assetregistermodel.depreciationRequired = this.IsDepreciationRequired;
    this.assetregistermodel.serialNo = this.SerialNumber;
    this.assetregistermodel.supplierId = this.assetRegisterFormControls.supplierSelCode.value;
    this.assetregistermodel.productDescription = this.assetDescription;
    this.assetregistermodel.assetId = this.assetRegisterFormControls.AssetSelCode.value;
    this.assetregistermodel.manufacturePartNo = this.assetRegisterFormControls.SupplierPartNo.value;
    this.assetregistermodel.purchasePrice = this.assetRegisterFormControls.PurchasePrice.value;
    this.assetregistermodel.categoryId = this.assetRegisterFormControls.CategorySelCode.value;
    this.assetregistermodel.subCategoryId = this.assetRegisterFormControls.SubCategorySelCode.value;

    const brandDetails = this.brandCodes.filter(item => item.brandID == this.assetRegisterFormControls.BrandSelCode.value)[0];
    this.assetregistermodel.brandName = brandDetails ? brandDetails.brandName : '';

    this.assetregistermodel.brandId = this.assetRegisterFormControls.BrandSelCode.value;

    const modelDetails = this.modelCodes.filter(item => item.modelID == this.assetRegisterFormControls.ModelSelCode.value)[0];
    this.assetregistermodel.modelId = this.assetRegisterFormControls.ModelSelCode.value;
    this.assetregistermodel.modelName = modelDetails ? modelDetails.modelName : '';

    this.assetregistermodel.assetStatusId = this.assetRegisterFormControls.assetStatusSelCode.value;
    this.assetregistermodel.assetConditionId = this.assetRegisterFormControls.assetConditionSelCode.value;

    const departmentDetails = this.departmentCodes.filter(item => item.departmentID == this.assetRegisterFormControls.departmentSelCode.value)[0];
    this.assetregistermodel.departmentName = departmentDetails ? departmentDetails.departmentName : '';
    this.assetregistermodel.departmentID = this.assetRegisterFormControls.departmentSelCode.value;

    const employeeDetails = this.employeeCodes.filter(item => item.employeeId == this.assetRegisterFormControls.EmployeeSelCode.value)[0];
    this.assetregistermodel.employeeName = employeeDetails ? employeeDetails.departmentName : '';
    this.assetregistermodel.employeeId = this.assetRegisterFormControls.EmployeeSelCode.value;

    const locationDetails = this.locationCodes.filter(item => item.locationID == this.assetRegisterFormControls.LocationSelCode.value)[0];
    this.assetregistermodel.locationName = locationDetails ? locationDetails.locationName : '';

    this.assetregistermodel.locationId = this.assetRegisterFormControls.LocationSelCode.value;
    this.assetregistermodel.warrantyEndDate = $('#WarrantyEndDate .datetimepicker-input').val();
    this.assetregistermodel.warrantyStartDate = $('#WarrantyStartDate .datetimepicker-input').val();
    this.assetregistermodel.insuranceName = this.assetRegisterFormControls.InsuranceCompany.value;
    this.assetregistermodel.insuranceEndDate = $('#InsuranceEndDate .datetimepicker-input').val();
    this.assetregistermodel.purchaseDate = $('#PurchaseDate .datetimepicker-input').val();
    this.assetregistermodel.insuranceValue = this.assetRegisterFormControls.InsuranceValue.value;
    this.assetregistermodel.insuranceStartDate = $('#InsuranceStartDate .datetimepicker-input').val();
    this.assetregistermodel.depreciationStartDate = $('#DepreciationStartDate .datetimepicker-input').val();
    this.assetregistermodel.depreciationPeriod = this.assetRegisterFormControls.DepreciationPeriod.value;
    this.assetregistermodel.depreciationStartValue = this.assetRegisterFormControls.DepreciationStartValue.value;
    this.assetregistermodel.depreciationPercentage = this.assetRegisterFormControls.DepreciationPercentage.value;
    this.assetregistermodel.disposed = this.IsAssetDisposed;
    this.assetregistermodel.disposalMethodId = this.assetRegisterFormControls.assetDisposalSelCode.value;
    this.assetregistermodel.disposalAmount = this.assetRegisterFormControls.DisposalAmount.value;
    this.assetregistermodel.disposalComment = this.assetRegisterFormControls.Comments.value;
    this.assetregistermodel.disposalDate = $('#DisposalDate .datetimepicker-input').val();
    this.assetregistermodel.disposalEstAmount = this.assetRegisterFormControls.EstDisposalAmount.value;
    this.assetregistermodel.isMaintenanceRequired = this.IsMaintenanceRequired;
    this.assetregistermodel.maintenanceStartDate = $('#MaintenanceStartDate .datetimepicker-input').val();
    this.assetregistermodel.addDescription = this.assetRegisterFormControls.ItemDescription.value;
    this.assetregistermodel.addQuantity = this.assetRegisterFormControls.Qty.value;
    this.assetregistermodel.salvageValue = this.assetRegisterFormControls.SalvageValue.value;
    this.assetregistermodel.depreciationValue = this.assetRegisterFormControls.DepreciationValue.value;
    this.assetregistermodel.accumulatedDepreciation = this.assetRegisterFormControls.AccumulatedDepreciation.value;
    this.assetregistermodel.bookValue = this.assetRegisterFormControls.CurrentBookValue.value;
    this.assetregistermodel.addDateBought = $('#DateBought .datetimepicker-input').val();
    this.assetregistermodel.addAmount = this.assetRegisterFormControls.Cost.value;
    this.assetregistermodel.warrantyAmount = this.assetRegisterFormControls.WarrantyValue.value;


    if (this.editMode) {
      saveResponse = this.assetRegisterService.editRegistermaster(formData, this.SerialNumber);
    } else {
      saveResponse = this.assetRegisterService.addRegistermaster(formData);
    }


    saveResponse.subscribe(
      result => {
        this.uploader.clearQueue();
        if (!this.editMode) {
          this.assetregistermodel.serialNo = result.serialNo;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.assetRegisterService.AddOrEditRecordToCache(this.assetregistermodel, this.editMode);
        this.submitted = false;
        this.loading = false;
        if (this.editMode) {
          this.ShowGrid();
        }

      },
      err => {
        this.error = err.error ? err.error : err.message;
        this.loading = false;
      }
    );
  }
}

