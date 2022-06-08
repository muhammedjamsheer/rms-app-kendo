import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { CommonValueListService } from 'src/app/core/service/commonlistvalue.service';
import { EmployeeMasterService } from 'src/app/core/service/employeemaster.service';
import { LocationmasterService } from 'src/app/core/service/locationmaster.service';
import { CommonValueListModel } from 'src/app/shared/model/CommonValueListModel';
import { AssetCategoryMasterService } from '../../../../core/service/assetcategorymaster.service';
import { AssetMaintenanceService } from '../../../../core/service/assetmaintenance.service';
import { AssetRegisterService } from '../../../../core/service/assetregister.service';
import { AssetSubCategoryMasterService } from '../../../../core/service/assetsubcategorymaster.service';
import { ProductMasterService } from '../../../../core/service/productmaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { AssetCategoryMasterModel } from '../../../../shared/model/AssetCategoryMasterModel';
import { AssetMaintenanceModel } from '../../../../shared/model/AssetMaintenanceModel';
import { AssetRegisterModel } from '../../../../shared/model/AssetRegisterModel';
import { AssetSubCategoryMasterModel } from '../../../../shared/model/AssetSubCategoryMasterModel';
import { EmployeeMasterModel } from '../../../../shared/model/EmployeeMasterModel';
import { LocationMasterModel } from '../../../../shared/model/LocationMasterModel';
import { MaintenanceItemsLine } from '../../../../shared/model/MaintenanceItemsLine';
import { ProductMasterModel } from '../../../../shared/model/ProductMasterModel';
declare var $: any;

@Component({
  selector: 'org-fat-assetmaintenanceform',
  templateUrl: './assetmaintenanceform.component.html',
  styleUrls: ['./assetmaintenanceform.component.scss']
})
export class AssetmaintenanceformComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  assetMaintenanceForm: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  errorMaintenance = '';
  columnDefs: any;
  rowData: any;
  categoryCodes!: AssetCategoryMasterModel[];
  subCategoryCodes!: AssetSubCategoryMasterModel[];
  subCategoryCodesSearchHolder!: AssetSubCategoryMasterModel[];
  productCodes!: ProductMasterModel[];
  editMode!: boolean;
  assetMaintenanceModel: AssetMaintenanceModel = new AssetMaintenanceModel;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  serialNumberCodes!: AssetRegisterModel[];
  serialNumberCodesSerachHolderCodes!: AssetRegisterModel[];
  assetMaintenanceData!: AssetMaintenanceModel;
  SerialNumber!: string;
  maintenanceId!: number;
  productCodesSearchHolder!: ProductMasterModel[];
  employeeCodes!: EmployeeMasterModel[];
  locationCodes!: LocationMasterModel[];
  isMaintenanceAddHidden: boolean = false;
  isMaintenanceEditHidden: boolean = true;
  isMaintenanceDeleteHidden: boolean = true;
  isMaintenanceUpdateHidden: boolean = true;
  isMaintenanceCancelHidden: boolean = true;
  columnMaintenanceDefs: any;
  rowAssetMaintenanceData!: MaintenanceItemsLine[];
  maintenanceItemsLine!: MaintenanceItemsLine;
  errorAssetMaintenance!: string;
  assetStatusCodes!: CommonValueListModel[];
  maintenanceStatusCodes!: CommonValueListModel[];
  assetConditionCodes!: CommonValueListModel[];
  productDescription!: string;
  viewMode: boolean = false;
  
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private assetCategoryMasterService: AssetCategoryMasterService,
    private assetSubCategoryMasterService: AssetSubCategoryMasterService,
    private saveAlert: SaveAlert,
    private productMasterService: ProductMasterService,
    private assetMaintenanceService: AssetMaintenanceService,
    private assetRegisterService: AssetRegisterService,
    private commonValueListMasterService: CommonValueListService,
    private employeeMasterService: EmployeeMasterService,
    private locationMasterService: LocationmasterService) {

    this.assetMaintenanceForm = this.formBuilder.group({
      WorkOrderNo: [null],
      WorkOrderDate: [null],
      assetCategorySelCode: [null],
      assetSubCategorySelCode: [null],
      AssetSelCode: [null],
      EmployeeSelCode: [null],
      LocationSelCode: [null],
      serialNumberSelCode: [null],
      MaintenanceDate: [null],
      AmontSpent: [null],
      assetConditionSelCode: [null],
      assetMaintenanceSelCode: [null],
      assetStatusSelCode: [null]
    });
  }

  async ngOnInit() {
    const today = new Date();
    const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    this.rowAssetMaintenanceData = [];
    $('.select2bs4').select2();

    $('#MaintenanceDate').datetimepicker({
      format: 'L'
    });

    $('#WorkOrderDate').datetimepicker({
      format: 'L'
    });

    $('[name="assetCategorySelCode"]').on("change", () => {
      this.assetMaintenanceFormControls.assetCategorySelCode.setValue($('[name="assetCategorySelCode"]').val());
      this.subCategoryCodes = this.subCategoryCodesSearchHolder.filter(item => item.assetCategoryId == $('[name="assetCategorySelCode"]').val());
      if($('[name="assetCategorySelCode"]').val() > 0) {
        this.productCodes = this.productCodesSearchHolder.filter(item => item.assetCategoryId == $('[name="assetCategorySelCode"]').val());
        this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.categoryId == $('[name="assetCategorySelCode"]').val());
      }
    });

    $('[name="assetSubCategorySelCode"]').on("change", () => {
      this.assetMaintenanceFormControls.assetSubCategorySelCode.setValue($('[name="assetSubCategorySelCode"]').val());
      if($('[name="assetSubCategorySelCode"]').val() > 0) {
        this.productCodes = this.productCodesSearchHolder.filter(item => item.assetSubCategoryId == $('[name="assetCategorySelCode"]').val());
        this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.subCategoryId == $('[name="assetSubCategorySelCode"]').val());
      }
    });


    $('[name="AssetSelCode"]').on("change", () => {
      this.assetMaintenanceFormControls.AssetSelCode.setValue($('[name="AssetSelCode"]').val());
      this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.productId == $('[name="AssetSelCode"]').val());
    });

    $('[name="serialNumberSelCode"]').on("change", () => {
      this.assetMaintenanceFormControls.serialNumberSelCode.setValue($('[name="serialNumberSelCode"]').val());
    });

    $('[name="assetConditionSelCode"]').on("change", () => {
      this.assetMaintenanceFormControls.assetConditionSelCode.setValue($('[name="assetConditionSelCode"]').val());
    });

    $('[name="assetMaintenanceSelCode"]').on("change", () => {
      this.assetMaintenanceFormControls.assetMaintenanceSelCode.setValue($('[name="assetMaintenanceSelCode"]').val());
    });

    $('[name="assetStatusSelCode"]').on("change", () => {
      this.assetMaintenanceFormControls.assetStatusSelCode.setValue($('[name="assetStatusSelCode"]').val());
    });

    $('[name="EmployeeSelCode"]').on("change", () => {
      this.assetMaintenanceFormControls.EmployeeSelCode.setValue($('[name="EmployeeSelCode"]').val());
      this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.employeeId == $('[name="EmployeeSelCode"]').val());
    });

    $('[name="LocationSelCode"]').on("change", () => {
      this.assetMaintenanceFormControls.LocationSelCode.setValue($('[name="LocationSelCode"]').val());
      this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.employeeId == $('[name="LocationSelCode"]').val());
    });

    $("#MaintenanceDate .datetimepicker-input").val(datepart); // Assign the value
    $("#MaintenanceDate .datetimepicker-input").trigger("click"); // Trigger click
    
    $("#WorkOrderDate .datetimepicker-input").val(datepart); // Assign the value
    $("#WorkOrderDate .datetimepicker-input").trigger("click"); // Trigger click
    

    this.columnMaintenanceDefs = [
      { field: 'maintenanceId', sortable: true, filter: true, hide: true, width: 150 },
      { field: 'serialNo', sortable: true, filter: true, width: 120 },
      { headerName: 'Product Code', field: 'productCode', sortable: true, filter: true, width: 150 },
      { headerName: 'Product Name', field: 'productName', sortable: true, filter: true, width: 160 },
      { field: 'productDescription', sortable: true, filter: true, width: 150 },
      { field: 'maintenanceDate', sortable: true, filter: true, width: 160 },
      { field: 'statusText', sortable: true, filter: true, width: 120 },
      //{ field: 'brandId', sortable: true, filter: true, hide: true, width: 150 },
      { field: 'conditionText', sortable: true, filter: true, width: 150 },
      //{ field: 'modelId', sortable: true, filter: true, hide: true, width: 150 },
      { field: 'amount', sortable: true, filter: true, width: 150 },
      //{ field: 'assetStatus', sortable: true, filter: true, width: 150 },
      { field: 'currentStatusText', sortable: true, filter: true, width: 160 },
    ];

    this.categoryCodes = await this.assetCategoryMasterService.getAssetCategoryMaster();
    this.subCategoryCodes = await this.assetSubCategoryMasterService.getAssetSubCategoryMaster();
    this.productCodes = await this.productMasterService.getProductMaster();
    this.subCategoryCodesSearchHolder = this.subCategoryCodes;
    this.serialNumberCodes = await this.assetRegisterService.getAssetRegister();
    this.serialNumberCodesSerachHolderCodes = this.serialNumberCodes;
    this.productCodesSearchHolder = this.productCodes;
    this.assetStatusCodes = await this.commonValueListMasterService.getAssetStatusItems();
    this.maintenanceStatusCodes = await this.commonValueListMasterService.getMaintenanceStatusItems();
    this.assetConditionCodes = await this.commonValueListMasterService.getAssetConditionItems();
    this.employeeCodes = await this.employeeMasterService.getEmployeeMaster();
    //this.employeeCodesSearchHolder = this.employeeCodes;
    this.locationCodes = await this.locationMasterService.getLocationMaster();

    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.maintenanceId = +params['id'];
        this.editMode = true;
        this.assetMaintenanceService.getAssetMaintenanceByKey(this.maintenanceId).subscribe(res => {
          this.assetMaintenanceData = res;
          this.ShowEditViewAssetMaintenance(this.assetMaintenanceData);
        });
        

        if (params['state'] === 'view') {
          this.viewMode = true;
          this.isMaintenanceAddHidden = true;
          this.isMaintenanceDeleteHidden = true;
          this.isMaintenanceEditHidden = true;
          this.isMaintenanceUpdateHidden = true;
          this.isMaintenanceCancelHidden = true;
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
    });
  }

  get assetMaintenanceFormControls() { return this.assetMaintenanceForm.controls; }

  ShowGrid() {
    this.router.navigateByUrl('/maintenance');
  }

  disableControls() {
    this.assetMaintenanceFormControls.WorkOrderNo.disable();
    //this.assetMaintenanceFormControls.Quantity.disable();
    $('#WorkOrderDate .datetimepicker-input').attr('disabled', true);
    //this.assetMaintenanceFormControls.Price.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.assetMaintenanceFormControls.WorkOrderNo.setValue('');
    this.assetMaintenanceFormControls.assetConditionSelCode.setValue('');
    this.assetMaintenanceFormControls.assetMaintenanceSelCode.setValue('');
    $('#WorkOrderDate .datetimepicker-input').val('');
    this.assetMaintenanceFormControls.assetStatusSelCode.setValue('');
    this.assetMaintenanceFormControls.assetCategorySelCode.setValue('');
    this.assetMaintenanceFormControls.AssetSelCode.setValue('');
    this.assetMaintenanceFormControls.assetSubCategorySelCode.setValue('');
    this.assetMaintenanceFormControls.serialNumberSelCode.setValue('');
    this.productCodes = this.productCodesSearchHolder;
    this.rowAssetMaintenanceData = [];
    $('select').select2().trigger('change');
  }

  ShowEditViewAssetMaintenance(data: AssetMaintenanceModel) {
    $('#WorkOrderDate .datetimepicker-input').val(data.workOrderDate ? formatDate(data.workOrderDate, 'MM/dd/yyyy', 'en-US') : '');
    this.assetMaintenanceFormControls.WorkOrderNo.setValue(data.workOrderNo);
    this.rowAssetMaintenanceData = data.details;
    this.UpdateMaintenanceSubGridRows();
    this.assetMaintenanceFormControls.serialNumberSelCode.setValidators(null);
    this.assetMaintenanceFormControls.serialNumberSelCode.updateValueAndValidity();
    this.assetMaintenanceFormControls.WorkOrderNo.disable();
    //this.assetMaintenanceFormControls.Quantity.disable();
    $('#WorkOrderDate .datetimepicker-input').attr('disabled', true);
  }

  
  AddToMaintenanceGrid() {
    this.SetValidatorsForGridAddControls();

    this.submitted = true;

    this.errorMaintenance = '';
    if (this.assetMaintenanceForm.invalid)
      return;

    this.error = '';
    const hasSameProduct = this.rowAssetMaintenanceData.some(x => x.productId == this.productCodes.filter(x => x.productId == this.assetMaintenanceFormControls.AssetSelCode.value)[0].productId);

    if (hasSameProduct) {
      this.errorMaintenance = 'Same record with Product code already exists!';
      return;
    }

    this.UpdateMaintenanceItemLine();
    this.rowAssetMaintenanceData.push(this.maintenanceItemsLine);
    this.UpdateMaintenanceSubGridRows();
    this.ClearAssetLineItemsControlsOnAdd();
    this.DisableValidatorsForGridAddControls();
    this.submitted = false;
  }

  
  private SetValidatorsForGridAddControls() {
    this.assetMaintenanceFormControls.AssetSelCode.setValidators([Validators.required]);
    this.assetMaintenanceFormControls.AmontSpent.setValidators([Validators.required]);
    //this.assetMaintenanceFormControls.SupPartNumber.setValidators([Validators.required]);
    //this.assetMaintenanceFormControls.assetConditionSelCode.setValidators([Validators.required]);
    //this.assetMaintenanceFormControls.assetMaintenanceSelCode.setValidators([Validators.required]);
    //this.assetMaintenanceFormControls.assetStatusSelCode.setValidators([Validators.required]);
    //this.assetMaintenanceFormControls.assetStatusSelCode.setValidators([Validators.required]);
    //this.assetMaintenanceFormControls.assetConditionSelCode.setValidators([Validators.required]);
    this.UpdateValiditityForGridAddControls();
  }

  private UpdateValiditityForGridAddControls() {
    this.assetMaintenanceFormControls.AssetSelCode.updateValueAndValidity();
    this.assetMaintenanceFormControls.AmontSpent.updateValueAndValidity();
    //this.assetMaintenanceFormControls.SupPartNumber.updateValueAndValidity();
    //this.assetMaintenanceFormControls.assetConditionSelCode.updateValueAndValidity();
    //this.assetMaintenanceFormControls.assetMaintenanceSelCode.updateValueAndValidity();
    //this.assetMaintenanceFormControls.assetStatusSelCode.updateValueAndValidity();
    //this.assetMaintenanceFormControls.assetStatusSelCode.updateValueAndValidity();
    //this.assetMaintenanceFormControls.assetConditionSelCode.updateValueAndValidity();
  }

  private DisableValidatorsForGridAddControls() {
    this.assetMaintenanceFormControls.AssetSelCode.setValidators(null);
    this.assetMaintenanceFormControls.AmontSpent.setValidators(null);
    //this.assetMaintenanceFormControls.SupPartNumber.setValidators(null);
    //this.assetMaintenanceFormControls.assetConditionSelCode.setValidators(null);
    //this.assetMaintenanceFormControls.assetMaintenanceSelCode.setValidators(null);
    //this.assetMaintenanceFormControls.assetStatusSelCode.setValidators(null);
    //this.assetMaintenanceFormControls.assetStatusSelCode.setValidators(null);
    //this.assetMaintenanceFormControls.assetConditionSelCode.setValidators(null);
    this.UpdateValiditityForGridAddControls();
  }

  private UpdateMaintenanceSubGridRows() {
    this.agGrid.api.setRowData(this.rowAssetMaintenanceData);
    this.agGrid.api.redrawRows();
  }

  private UpdateMaintenanceItemLine() {
    this.maintenanceItemsLine = new MaintenanceItemsLine();
    this.maintenanceItemsLine.maintenanceDate = $('#MaintenanceDate .datetimepicker-input').val();
    this.maintenanceItemsLine.productId = this.assetMaintenanceFormControls.AssetSelCode.value;
    this.maintenanceItemsLine.serialNo = this.assetMaintenanceFormControls.serialNumberSelCode.value;
    this.maintenanceItemsLine.productCode = this.productCodes.filter(x => x.productId == this.assetMaintenanceFormControls.AssetSelCode.value)[0].productCode;
    this.maintenanceItemsLine.productName = this.productCodes.filter(x => x.productId == this.assetMaintenanceFormControls.AssetSelCode.value)[0].productName;
    this.maintenanceItemsLine.productDescription = this.productCodes.filter(x => x.productId == this.assetMaintenanceFormControls.AssetSelCode.value)[0].productDescription;
    this.maintenanceItemsLine.amount = this.assetMaintenanceFormControls.AmontSpent.value;
    this.maintenanceItemsLine.assetConditionId = this.assetMaintenanceFormControls.assetConditionSelCode.value;
    this.maintenanceItemsLine.currentStatusId = this.assetMaintenanceFormControls.assetMaintenanceSelCode.value;
    this.maintenanceItemsLine.assetStatusId = this.assetMaintenanceFormControls.assetStatusSelCode.value;
    this.ClearAssetLineItemsControlsOnAdd();
    this.submitted = false;
  }

  EditAssetMaintenance() {
    this.maintenanceItemsLine = this.agGrid.api.getSelectedRows()[0];
    //this.productCodes = this.productCodesSearchHolder;
    this.assetMaintenanceFormControls.AssetSelCode.setValue(this.maintenanceItemsLine.productId);
    this.assetMaintenanceFormControls.serialNumberSelCode.setValue(this.maintenanceItemsLine.serialNo);
    this.productDescription = this.productCodes.find(item => item.productId == this.maintenanceItemsLine.productId)?.productDescription as string;
    $('#MaintenanceDate .datetimepicker-input').val(this.maintenanceItemsLine.maintenanceDate ? formatDate(this.maintenanceItemsLine.maintenanceDate, 'MM/dd/yyyy', 'en-US') : '');
    this.assetMaintenanceFormControls.AmontSpent.setValue(this.maintenanceItemsLine.amount);
    this.assetMaintenanceFormControls.assetConditionSelCode.setValue(this.maintenanceItemsLine.assetConditionId);
    this.assetMaintenanceFormControls.assetMaintenanceSelCode.setValue(this.maintenanceItemsLine.currentStatusId);
    this.assetMaintenanceFormControls.assetStatusSelCode.setValue(this.maintenanceItemsLine.assetStatusId);
    $('select').select2().trigger('change');
    this.isMaintenanceAddHidden = true;
    this.isMaintenanceDeleteHidden = true;
    this.isMaintenanceEditHidden = true;
    this.isMaintenanceUpdateHidden = false;
    this.isMaintenanceCancelHidden = false;
  }

  DeleteAssetMaintenance() {
    this.maintenanceItemsLine = this.agGrid.api.getSelectedRows()[0];
    const index = this.rowAssetMaintenanceData.findIndex(x => x.productId == this.maintenanceItemsLine.productId && x.productId == this.maintenanceItemsLine.productId);
    if (index > -1) {
      this.rowAssetMaintenanceData.splice(index, 1);
      this.agGrid.api.setRowData(this.rowAssetMaintenanceData);
      this.agGrid.api.redrawRows();
    }
  }

  onMaintenanceRowClick(event: any) {

    this.isMaintenanceEditHidden = !this.isMaintenanceUpdateHidden || this.viewMode;
    this.isMaintenanceDeleteHidden = !this.isMaintenanceUpdateHidden || this.viewMode;

  }

  ClearAssetLineItemsControlsOnAdd() {
    this.productDescription = '';
    this.assetMaintenanceFormControls.AssetSelCode.setValue('');
    $('#MaintenanceDate .datetimepicker-input').val('');
    this.assetMaintenanceFormControls.AmontSpent.setValue('');
    this.assetMaintenanceFormControls.assetConditionSelCode.setValue('');
    this.assetMaintenanceFormControls.assetMaintenanceSelCode.setValue('');
    this.assetMaintenanceFormControls.assetStatusSelCode.setValue('');
    $('select').select2().trigger('change');
  }

  UpdateAssetMaintenance() {
    this.SetValidatorsForGridAddControls();
    this.submitted = true;
    this.errorMaintenance = '';
    if (this.assetMaintenanceForm.invalid)
      return;

    this.UpdateMaintenanceItemLine();

    // const hasSameProduct = this.rowAssetMaintenanceData.some(x => x.productId == this.assetMaintenanceFormControls.ProductSelDesc.value &&
    //   x.assetCode ==  this.maintenanceItemsLine.assetCode);

    // if (hasSameProduct) {
    //   this.errorMaintenance = 'Same record with Product and Asset Code already exists!';
    //   return;
    // }
    const index = this.rowAssetMaintenanceData.findIndex(x => x.productId == this.maintenanceItemsLine.productId);

    if (index > -1) {
      this.rowAssetMaintenanceData[index] = this.maintenanceItemsLine;
    }
    this.UpdateMaintenanceSubGridRows();
    this.isMaintenanceAddHidden = false;
    this.isMaintenanceDeleteHidden = true;
    this.isMaintenanceEditHidden = true;
    this.isMaintenanceUpdateHidden = true;
    this.isMaintenanceCancelHidden = true;
    this.DisableValidatorsForGridAddControls();
  }

  CancelAssetMaintenance() {
    this.isMaintenanceAddHidden = false;
    this.isMaintenanceDeleteHidden = true;
    this.isMaintenanceEditHidden = true;
    this.isMaintenanceUpdateHidden = true;
    this.isMaintenanceCancelHidden = true;
    this.ClearAssetLineItemsControlsOnAdd();
    this.DisableValidatorsForGridAddControls();
  }

  SaveAssetMaintenance() {
    this.submitted = true;
    this.error = '';
    // stop here if form is invalid
    if (this.assetMaintenanceForm.invalid) {
      return;
    }
    this.loading = true;
    let saveResponse: Observable<any>;
    this.assetMaintenanceModel = new AssetMaintenanceModel;
    this.assetMaintenanceModel.maintenanceId = this.maintenanceId;
    this.assetMaintenanceModel.serialNo = this.editMode ? this.SerialNumber : this.assetMaintenanceFormControls.serialNumberSelCode.value;
    this.assetMaintenanceModel.workOrderNo = this.assetMaintenanceFormControls.WorkOrderNo.value;
    this.assetMaintenanceModel.workOrderDate = $('#WorkOrderDate .datetimepicker-input').val();
    this.assetMaintenanceModel.scannedBy = localStorage.getItem('userName')!;
    this.assetMaintenanceModel.scannedDate = $('#WorkOrderDate .datetimepicker-input').val();
    this.assetMaintenanceModel.maintenanceDetails = this.rowAssetMaintenanceData;
    if (this.editMode) {
      saveResponse = this.assetMaintenanceService.editAssetMaintenancemaster(this.assetMaintenanceModel);
    } else {
      saveResponse = this.assetMaintenanceService.addAssetMaintenance(this.assetMaintenanceModel);
    }


    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          this.assetMaintenanceModel.maintenanceId = result.maintenanceId;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.assetMaintenanceService.AddOrEditRecordToCache(this.assetMaintenanceModel, this.editMode);
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

