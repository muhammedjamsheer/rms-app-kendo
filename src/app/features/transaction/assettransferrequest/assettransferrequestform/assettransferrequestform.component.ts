import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { AssetTransferDirectModel } from 'src/app/shared/model/AssetTransferDirectModel';
import { AssetCategoryMasterService } from '../../../../core/service/assetcategorymaster.service';
import { AssetRegisterService } from '../../../../core/service/assetregister.service';
import { AssetSubCategoryMasterService } from '../../../../core/service/assetsubcategorymaster.service';
import { AssetTransferRequestService } from '../../../../core/service/assettransferrequest.service';
import { DepartmentmasterService } from '../../../../core/service/departmentmaster.service';
import { EmployeeMasterService } from '../../../../core/service/employeemaster.service';
import { LocationmasterService } from '../../../../core/service/locationmaster.service';
import { ProductMasterService } from '../../../../core/service/productmaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { AssetCategoryMasterModel } from '../../../../shared/model/AssetCategoryMasterModel';
import { AssetRegisterModel } from '../../../../shared/model/AssetRegisterModel';
import { AssetSubCategoryMasterModel } from '../../../../shared/model/AssetSubCategoryMasterModel';
import { AssetTransferLineItemModel } from '../../../../shared/model/AssetTransferLineItemModel';
import { AssetTransferRequestModel } from '../../../../shared/model/AssetTransferRequestModel';
import { DepartmentMasterModel } from '../../../../shared/model/DepartmentMasterModel';
import { EmployeeMasterModel } from '../../../../shared/model/EmployeeMasterModel';
import { LocationMasterModel } from '../../../../shared/model/LocationMasterModel';
import { ProductMasterModel } from '../../../../shared/model/ProductMasterModel';
declare var $: any;

@Component({
  selector: 'org-fat-assettransferrequestform',
  templateUrl: './assettransferrequestform.component.html',
  styleUrls: ['./assettransferrequestform.component.scss']
})
export class AssettransferrequestformComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  assetTransferRequestForm: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  columnDefs: any;
  rowData: any;
  categoryCodes!: AssetCategoryMasterModel[];
  subCategoryCodes!: AssetSubCategoryMasterModel[];
  subCategoryCodesSearchHolder!: AssetSubCategoryMasterModel[];
  productCodes!: ProductMasterModel[];
  editMode!: boolean;
  assetTransferRequestModel: AssetTransferRequestModel = new AssetTransferRequestModel;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  serialNumberCodes!: AssetRegisterModel[];
  serialNumberCodesSerachHolderCodes!: AssetRegisterModel[];
  assetTransferRequestData!: AssetTransferRequestModel;
  SerialNumber!: string;
  requestNo!: string;
  productCodesSearchHolder!: ProductMasterModel[];
  userName!: string;
  employeeCodes!: EmployeeMasterModel[];
  locationCodes!: LocationMasterModel[];
  assetTransferLineItem: AssetTransferLineItemModel = new AssetTransferLineItemModel;
  columnAssetTransferDefs: any;
  rowAssetTransferData!: AssetTransferLineItemModel[];
  isAssetTransferAddHidden: boolean = false;
  isAssetTransferEditHidden: boolean = true;
  isAssetTransferDeleteHidden: boolean = true;
  isAssetTransferUpdateHidden: boolean = true;
  isAssetTransferCancelHidden: boolean = true;
  viewMode: boolean = false;
  errorAssetTransfer = '';
  locale = 'en-US';
  departmentCodes!: DepartmentMasterModel[];
  viewrequestMode: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private employeeMasterService: EmployeeMasterService,
    private assetCategoryMasterService: AssetCategoryMasterService,
    private assetSubCategoryMasterService: AssetSubCategoryMasterService,
    private saveAlert: SaveAlert,
    private productMasterService: ProductMasterService,
    private assetTransferRequestService: AssetTransferRequestService,
    private assetRegisterService: AssetRegisterService,
    private locationMasterService: LocationmasterService,
    private departmentMasterService: DepartmentmasterService) {

    this.assetTransferRequestForm = this.formBuilder.group({
      RequestDate: [null],
      Remarks: [null, Validators.required],
      EmployeeSelCode: [null, Validators.required],
      LocationSelCode: [null, Validators.required],
      LocationFromSelCode: [null, Validators.required],
      assetCategorySelCode: [null],
      assetSubCategorySelCode: [null],
      AssetSelCode: [null, Validators.required],
      Quantity: [null, Validators.required]
    });
  }

  async ngOnInit() {

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
        if (this.viewrequestMode) {
          this.assetTransferRequestService.getAssetTransferViewRequestByKey(this.requestNo).subscribe(res => {
            this.ShowEditViewRequestTransferRequest(res);
          });
        } else {
          this.assetTransferRequestService.getAssetTransferRequestByKey(this.requestNo).subscribe(res => {
            this.assetTransferRequestData = res;
            this.ShowEditViewTransferRequest(this.assetTransferRequestData);
          });
        }
      } else {
        this.editMode = false;
      }
    });

    this.userName = localStorage.getItem('userName')?.toString()!;
    this.rowAssetTransferData = [];
    this.columnAssetTransferDefs = [
      { field: 'serialNo', sortable: true, filter: true, hide: !this.viewrequestMode },      
      { field: 'assetCategoryId', sortable: true, filter: true, hide: true },
      { headerName: 'Category Code', field: 'assetCategoryCode', sortable: true, filter: true },
      { headerName: 'Category Name', field: 'assetCategoryName', sortable: true, filter: true },
      { field: 'assetSubCategoryId', sortable: true, filter: true, hide: true },
      { headerName: 'Sub Category Code', field: 'assetSubCategoryCode', sortable: true, filter: true },
      { headerName: 'Sub Category Name', field: 'assetSubCategoryName', sortable: true, filter: true },
      { field: 'productId', sortable: true, filter: true, hide: true, width: 150 },
      { headerName: 'Product Code', field: 'productCode', sortable: true, filter: true, width: 150 },
      { headerName: 'Product Name', field: 'productName', sortable: true, filter: true, width: 160 },
      { field: 'productDescription', sortable: true, filter: true, width: 150 },
      { field: 'quantity', sortable: true, filter: true, width: 120, hide: this.viewrequestMode }      
    ];

    const today = new Date();
    const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();

    $('.select2bs4').select2();

    $('#RequestDate').datetimepicker({
      format: 'L'
    });

    $('[name="EmployeeSelCode"]').on("change", () => {
      this.assetTransferRequestFormControls.EmployeeSelCode.setValue($('[name="EmployeeSelCode"]').val());
    });

    $('[name="LocationSelCode"]').on("change", () => {
      this.assetTransferRequestFormControls.LocationSelCode.setValue($('[name="LocationSelCode"]').val());
    });

    $('[name="LocationFromSelCode"]').on("change", () => {
      this.assetTransferRequestFormControls.LocationFromSelCode.setValue($('[name="LocationFromSelCode"]').val());
    });

    $('[name="assetCategorySelCode"]').on("change", () => {
      this.assetTransferRequestFormControls.assetCategorySelCode.setValue($('[name="assetCategorySelCode"]').val());
      if ($('[name="assetCategorySelCode"]').val() > 0) {
        this.subCategoryCodes = this.subCategoryCodesSearchHolder.filter(item => item.assetCategoryId == $('[name="assetCategorySelCode"]').val());
        this.productCodes = this.productCodesSearchHolder.filter(item => item.assetCategoryId == $('[name="assetCategorySelCode"]').val());
        //this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.categoryId == $('[name="assetCategorySelCode"]').val());
      }
    });

    $('[name="assetSubCategorySelCode"]').on("change", () => {
      this.assetTransferRequestFormControls.assetSubCategorySelCode.setValue($('[name="assetSubCategorySelCode"]').val());
      if ($('[name="assetSubCategorySelCode"]').val() > 0) {
        this.productCodes = this.productCodesSearchHolder.filter(item => item.assetSubCategoryId == $('[name="assetSubCategorySelCode"]').val());
        //this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.subCategoryId == $('[name="assetSubCategorySelCode"]').val());
      }
    });


    $('[name="AssetSelCode"]').on("change", () => {
      this.assetTransferRequestFormControls.AssetSelCode.setValue($('[name="AssetSelCode"]').val());
      //this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.productId == $('[name="AssetSelCode"]').val());
    });

    $('[name="serialNumberSelCode"]').on("change", () => {
      this.assetTransferRequestFormControls.serialNumberSelCode.setValue($('[name="serialNumberSelCode"]').val());
    });

    $("#RequestDate .datetimepicker-input").val(datepart); // Assign the value
    $("#RequestDate .datetimepicker-input").trigger("click"); // Trigger click
    $("#RequestDate .datetimepicker-input").val('');

    this.employeeMasterService.getEmployeeMaster().then((res)=> this.employeeCodes = res);

    //this.employeeCodes = await this.employeeMasterService.getEmployeeMaster();
    this.locationCodes = await this.locationMasterService.getLocationMaster();
    this.categoryCodes = await this.assetCategoryMasterService.getAssetCategoryMaster();
    this.subCategoryCodes = await this.assetSubCategoryMasterService.getAssetSubCategoryMaster();
    this.productCodes = await this.productMasterService.getProductMaster();
    this.subCategoryCodesSearchHolder = this.subCategoryCodes;
    this.serialNumberCodes = await this.assetRegisterService.getAssetRegister();
    this.serialNumberCodesSerachHolderCodes = this.serialNumberCodes;
    this.productCodesSearchHolder = this.productCodes;
    this.departmentCodes = await this.departmentMasterService.getDepartmentMaster();


  }

  get assetTransferRequestFormControls() { return this.assetTransferRequestForm.controls; }

  AddToAssetTransferGrid() {
    this.SetValidatorsForGridAddControls();

    this.submitted = true;

    this.errorAssetTransfer = '';
    if (this.assetTransferRequestForm.invalid)
      return;

    this.error = '';
    const hasSameProduct = this.rowAssetTransferData.some(x => x.productId == this.assetTransferRequestFormControls.AssetSelCode.value);

    if (hasSameProduct) {
      this.errorAssetTransfer = 'Same record with Product code already exists!';
      return;
    }

    this.UpdateAssetTransferItemLine();
    this.rowAssetTransferData.push(this.assetTransferLineItem);
    this.UpdateAssetTransferSubGridRows();
    this.ClearAssetLineItemsControlsOnAdd();
    this.DisableValidatorsForGridAddControls();
    this.submitted = false;
  }

  ClearAssetLineItemsControlsOnAdd() {
    this.assetTransferRequestFormControls.AssetSelCode.setValue('');
    this.assetTransferRequestFormControls.Quantity.setValue('');
    $('select').select2().trigger('change');
  }

  CancelAssetTransfer() {
    this.isAssetTransferAddHidden = false;
    this.isAssetTransferDeleteHidden = true;
    this.isAssetTransferEditHidden = true;
    this.isAssetTransferUpdateHidden = true;
    this.isAssetTransferCancelHidden = true;
    this.ClearAssetLineItemsControlsOnAdd();
    this.DisableValidatorsForGridAddControls();
  }

  UpdateAssetTransfer() {
    this.SetValidatorsForGridAddControls();
    this.submitted = true;
    this.errorAssetTransfer = '';
    if (this.assetTransferRequestForm.invalid)
      return;

    this.UpdateAssetTransferItemLine();

    const index = this.rowAssetTransferData.findIndex(x => x.productId == this.assetTransferLineItem.productId);

    if (index > -1) {
      this.rowAssetTransferData[index] = this.assetTransferLineItem;
    }
    this.UpdateAssetTransferSubGridRows();
    this.isAssetTransferAddHidden = false;
    this.isAssetTransferDeleteHidden = true;
    this.isAssetTransferEditHidden = true;
    this.isAssetTransferUpdateHidden = true;
    this.isAssetTransferCancelHidden = true;
    this.DisableValidatorsForGridAddControls();
  }

  private SetValidatorsForGridAddControls() {
    this.assetTransferRequestFormControls.AssetSelCode.setValidators([Validators.required]);
    this.assetTransferRequestFormControls.Quantity.setValidators([Validators.required]);
    this.UpdateValiditityForGridAddControls();
  }

  private UpdateValiditityForGridAddControls() {
    this.assetTransferRequestFormControls.AssetSelCode.updateValueAndValidity();
    this.assetTransferRequestFormControls.Quantity.updateValueAndValidity();

  }

  private DisableValidatorsForGridAddControls() {
    this.assetTransferRequestFormControls.AssetSelCode.setValidators(null);
    this.assetTransferRequestFormControls.Quantity.setValidators(null);
    this.UpdateValiditityForGridAddControls();
  }

  private UpdateAssetTransferSubGridRows() {
    this.agGrid.api.setRowData(this.rowAssetTransferData);
    this.agGrid.api.redrawRows();
  }

  private UpdateAssetTransferItemLine() {
    this.assetTransferLineItem = new AssetTransferLineItemModel();
    this.assetTransferLineItem.productId = this.assetTransferRequestFormControls.AssetSelCode.value;
    var productSelected = this.productCodes.filter(x => x.productId == this.assetTransferRequestFormControls.AssetSelCode.value)[0];
    this.assetTransferLineItem.productCode = productSelected.productCode
    this.assetTransferLineItem.productName = productSelected.productName;
    this.assetTransferLineItem.productDescription = productSelected.productDescription;    
    this.assetTransferLineItem.assetCategoryCode = productSelected.assetCategoryCode;
    this.assetTransferLineItem.assetCategoryName = productSelected.assetCategoryName;    
    this.assetTransferLineItem.assetSubCategoryCode = productSelected.assetSubCategoryCode;
    this.assetTransferLineItem.assetSubCategoryName = productSelected.assetSubCategoryCode;
    this.assetTransferLineItem.quantity = this.assetTransferRequestFormControls.Quantity.value;
    this.ClearAssetLineItemsControlsOnAdd();
    this.submitted = false;
  }

  EditAssetTransfer() {
    this.assetTransferLineItem = this.agGrid.api.getSelectedRows()[0];
    this.assetTransferRequestFormControls.AssetSelCode.setValue(this.assetTransferLineItem.productId);
    this.assetTransferRequestFormControls.Quantity.setValue(this.assetTransferLineItem.quantity);
    $('select').select2().trigger('change');
    this.isAssetTransferAddHidden = true;
    this.isAssetTransferDeleteHidden = true;
    this.isAssetTransferEditHidden = true;
    this.isAssetTransferUpdateHidden = false;
    this.isAssetTransferCancelHidden = false;
  }

  DeleteAssetTransfer() {
    this.assetTransferLineItem = this.agGrid.api.getSelectedRows()[0];
    const index = this.rowAssetTransferData.findIndex(x => x.productId == this.assetTransferLineItem.productId);
    if (index > -1) {
      this.rowAssetTransferData.splice(index, 1);
      this.agGrid.api.setRowData(this.rowAssetTransferData);
      this.agGrid.api.redrawRows();
    }
  }

  onAssetTransferRowClick(event: any) {
    this.isAssetTransferEditHidden = !this.isAssetTransferUpdateHidden || this.viewMode;
    this.isAssetTransferDeleteHidden = !this.isAssetTransferUpdateHidden || this.viewMode;
  }
  ShowGrid() {
    this.router.navigateByUrl('/transferrequest');
  }

  disableControls() {
    this.assetTransferRequestFormControls.AssetSelCode.disable();
    this.assetTransferRequestFormControls.Quantity.disable();
    $('#RequestDate .datetimepicker-input').attr('disabled', true);
    this.assetTransferRequestFormControls.EmployeeSelCode.disable();
    this.assetTransferRequestFormControls.LocationSelCode.disable();
    this.assetTransferRequestFormControls.LocationFromSelCode.disable();
    this.assetTransferRequestFormControls.assetCategorySelCode.disable();
    this.assetTransferRequestFormControls.assetSubCategorySelCode.disable();
    this.assetTransferRequestFormControls.Remarks.disable();
    this.isbtnSaveDisabled = this.viewMode;
    this.isbtnClearDisabled = this.viewMode;
    this.isAssetTransferDeleteHidden = true;
    this.isAssetTransferAddHidden = true;
    this.isAssetTransferEditHidden = true;
    this.isAssetTransferUpdateHidden = true;
    this.isAssetTransferCancelHidden = true;
  }

  ClearContents() {
    this.assetTransferRequestFormControls.AssetSelCode.setValue('');
    this.assetTransferRequestFormControls.Quantity.setValue('');
    this.assetTransferRequestFormControls.EmployeeSelCode.setValue('');
    this.assetTransferRequestFormControls.LocationSelCode.setValue('');
    this.assetTransferRequestFormControls.LocationFromSelCode.setValue('');
    this.assetTransferRequestFormControls.Remarks.setValue('');
    this.assetTransferRequestFormControls.assetCategorySelCode.setValue('');
    this.assetTransferRequestFormControls.assetSubCategorySelCode.setValue('');
    this.productCodes = this.productCodesSearchHolder;
    this.rowAssetTransferData = [];
    $('#RequestDate .datetimepicker-input').val('');
    $('select').select2().trigger('change');
  }

  ShowEditViewTransferRequest(data: AssetTransferRequestModel) {
    $('#RequestDate .datetimepicker-input').val(data.requestDate ? formatDate(data.requestDate, 'MM/dd/yyyy', this.locale) : '');
    this.assetTransferRequestFormControls.EmployeeSelCode.setValue(data.toEmployeeId);
    this.assetTransferRequestFormControls.LocationSelCode.setValue(data.toLocationId);
    this.assetTransferRequestFormControls.LocationFromSelCode.setValue(data.fromLocationId);
    this.assetTransferRequestFormControls.Remarks.setValue(data.remarks);
    this.productCodes = this.productCodesSearchHolder;

    this.rowAssetTransferData = data.requestLines;
    $('select').select2().trigger('change');
  }

  ShowEditViewRequestTransferRequest(data: AssetTransferDirectModel) {
    // $('#RequestDate .datetimepicker-input').val(data.requestDate ? formatDate(data.requestDate, 'MM/dd/yyyy', this.locale) : '');
    this.assetTransferRequestFormControls.EmployeeSelCode.setValue(data.toEmployeeId);
    this.assetTransferRequestFormControls.LocationSelCode.setValue(data.toLocationId);
    // this.assetTransferRequestFormControls.LocationFromSelCode.setValue(data.fromLocationId);
    this.assetTransferRequestFormControls.Remarks.setValue(data.remarks);
    // this.productCodes = this.productCodesSearchHolder;

    this.rowAssetTransferData = data.lines;
    $('select').select2().trigger('change');
  }

  SaveAssetTransferRequest() {
    this.submitted = true;
    this.error = '';
    // stop here if form is invalid
    if (this.assetTransferRequestForm.invalid) {
      return;
    }
    this.loading = true;
    let saveResponse: Observable<any>;
    this.assetTransferRequestModel = new AssetTransferRequestModel;
    this.assetTransferRequestModel.requestNo = this.requestNo;
    this.assetTransferRequestModel.requestDate = $('#RequestDate .datetimepicker-input').val();
    this.assetTransferRequestModel.toEmployeeId = this.assetTransferRequestFormControls.EmployeeSelCode.value;
    this.assetTransferRequestModel.toLocationId = this.assetTransferRequestFormControls.LocationSelCode.value;
    this.assetTransferRequestModel.fromLocationId = this.assetTransferRequestFormControls.LocationFromSelCode.value;
    this.assetTransferRequestModel.remarks = this.assetTransferRequestFormControls.Remarks.value;
    this.assetTransferRequestModel.requestLines = this.rowAssetTransferData;
    var departmentSelected = this.departmentCodes.filter(y => y.departmentID == this.employeeCodes.filter(x => x.employeeId == this.assetTransferRequestFormControls.EmployeeSelCode.value)[0].departmentId)[0];
    this.assetTransferRequestModel.toDepartmentCode = departmentSelected.departmentCode
    this.assetTransferRequestModel.toDepartmentName = departmentSelected.departmentName;
    var employeeSelected = this.employeeCodes.filter(x => x.employeeId == this.assetTransferRequestFormControls.EmployeeSelCode.value)[0];
    this.assetTransferRequestModel.toEmpCode = employeeSelected.employeeCode;
    this.assetTransferRequestModel.toEmpFirstName = employeeSelected.firstName;
    this.assetTransferRequestModel.toEmpLastName = employeeSelected.lastName==null ? '' : employeeSelected.lastName;
    var locationSelected = this.locationCodes.filter(x => x.locationID == this.assetTransferRequestFormControls.LocationSelCode.value)[0];
    this.assetTransferRequestModel.toLocationCode = locationSelected.locationCode;
    this.assetTransferRequestModel.toLocationName = locationSelected.locationName;
    var locationFrom = this.locationCodes.filter(x => x.locationID == this.assetTransferRequestFormControls.LocationFromSelCode.value)[0];
    this.assetTransferRequestModel.fromLocationName=locationFrom.locationName;
    this.assetTransferRequestModel.fromLocationCode=locationFrom.locationCode;
    if(this.editMode)
    this.assetTransferRequestModel.status=this.assetTransferRequestData.status;
    // this.assetTransferRequestModel.requestedByEmpCode = employeeSelected.employeeCode;
    this.assetTransferRequestModel.requestedByEmpFirstName = this.userName;
    // this.assetTransferRequestModel.requestedByEmpLastName = employeeSelected.lastName;

    if (this.editMode) {
      saveResponse = this.assetTransferRequestService.editAssetTransferRequestmaster(this.assetTransferRequestModel);
    } else {
      saveResponse = this.assetTransferRequestService.addAssetTransferRequest(this.assetTransferRequestModel);
    }


    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          console.log(result);
          this.assetTransferRequestModel.requestNo = result.requestNo;
          this.assetTransferRequestModel.requestDate = result.requestDate;
          this.assetTransferRequestModel.requestedBy = result.requestedBy;
          this.assetTransferRequestModel.fromLocationId = result.fromLocationId;
          this.assetTransferRequestModel.toEmployeeId = result.toEmployeeId;
          this.assetTransferRequestModel.toLocationId = result.toLocationId;
          this.assetTransferRequestModel.remarks = result.remarks;
          this.assetTransferRequestModel.toDepartmentID = result.toDepartmentID;
          this.assetTransferRequestModel.toDepartmentCode = result.toDepartmentCode;
          this.assetTransferRequestModel.toDepartmentName = result.toDepartmentName;
          this.assetTransferRequestModel.toEmpCode = result.toEmpCode;
          this.assetTransferRequestModel.toEmpFirstName = result.toEmpFirstName;
          this.assetTransferRequestModel.toEmpLastName = result.toEmpLastName;
          this.assetTransferRequestModel.toLocationCode = result.toLocationCode;
          this.assetTransferRequestModel.toLocationName = result.toLocationName;
          this.assetTransferRequestModel.requestedByEmpCode = result.requestedByEmpCode;
          this.assetTransferRequestModel.requestedByEmpFirstName = result.requestedByEmpFirstName;
          this.assetTransferRequestModel.requestedByEmpLastName = result.requestedByEmpLastName;
          this.assetTransferRequestModel.status = result.status;
          this.assetTransferRequestModel.verifiedBy = result.verifiedBy;
          this.assetTransferRequestModel.verifiedDate = result.verifiedDate;
          this.assetTransferRequestModel.verificationRemark = result.verificationRemark;
          this.assetTransferRequestModel.requestLines = result.requestLines;
          this.assetTransferRequestModel.fromLocationName = result.fromLocationName;
          this.assetTransferRequestModel.fromLocationCode = result.fromLocationCode;
          
          
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.submitted = false;
        this.assetTransferRequestService.AddOrEditRecordToCache(this.assetTransferRequestModel, this.editMode);
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

