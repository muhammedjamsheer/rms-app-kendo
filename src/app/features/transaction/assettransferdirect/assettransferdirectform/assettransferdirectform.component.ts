import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { FileUploader } from 'ng2-file-upload';
import { Observable } from 'rxjs';
import { AssetSerialNosSearch } from 'src/app/shared/model/AssetSerialNosSearch';
import { AssetCategoryMasterService } from '../../../../core/service/assetcategorymaster.service';
import { AssetRegisterService } from '../../../../core/service/assetregister.service';
import { AssetSubCategoryMasterService } from '../../../../core/service/assetsubcategorymaster.service';
import { AssetTransferDirectService } from '../../../../core/service/assettransferdirect.service';
import { DepartmentmasterService } from '../../../../core/service/departmentmaster.service';
import { EmployeeMasterService } from '../../../../core/service/employeemaster.service';
import { LocationmasterService } from '../../../../core/service/locationmaster.service';
import { ProductMasterService } from '../../../../core/service/productmaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { AssetCategoryMasterModel } from '../../../../shared/model/AssetCategoryMasterModel';
import { AssetRegisterModel } from '../../../../shared/model/AssetRegisterModel';
import { AssetSubCategoryMasterModel } from '../../../../shared/model/AssetSubCategoryMasterModel';
import { AssetTransferDirectModel } from '../../../../shared/model/AssetTransferDirectModel';
import { AssetTransferLineItemModel } from '../../../../shared/model/AssetTransferLineItemModel';
import { DepartmentMasterModel } from '../../../../shared/model/DepartmentMasterModel';
import { EmployeeMasterModel } from '../../../../shared/model/EmployeeMasterModel';
import { LocationMasterModel } from '../../../../shared/model/LocationMasterModel';
import { ProductMasterModel } from '../../../../shared/model/ProductMasterModel';
import { TransferLine } from '../../../../shared/model/TransferLine';
declare var $: any;

@Component({
  selector: 'org-fat-assettransferdirectform',
  templateUrl: './assettransferdirectform.component.html',
  styleUrls: ['./assettransferdirectform.component.scss']
})
export class AssettransferdirectformComponent implements OnInit {
  @ViewChild('agGridFilter') agGridFilter!: AgGridAngular;
  @ViewChild('agGridData') agGridData!: AgGridAngular;
  assetTransferDirectForm: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  columnDefs: any;
  rowData: any;
  columnFilterDefs: any;
  columnDataDefs: any;
  categoryCodes!: AssetCategoryMasterModel[];
  subCategoryCodes!: AssetSubCategoryMasterModel[];
  subCategoryCodesSearchHolder!: AssetSubCategoryMasterModel[];
  productCodes!: ProductMasterModel[];
  serialNumber!: number;
  editMode!: boolean;
  assetTransferDirectModel: AssetTransferDirectModel = new AssetTransferDirectModel;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  serialNumberCodes: string[] = [];
  serialNumberCodesData: AssetRegisterModel[] = [];
  rowFilterData: AssetRegisterModel[] = [];
  rowAddedData: AssetRegisterModel[] = [];
  serialNumberCodesSerachHolderCodes!: AssetRegisterModel[];
  transferNo: string = '';
  fileList!: FileList;
  assetTransferDirectData!: AssetTransferDirectModel;
  isSelectedtransferNo!: boolean;
  warrantyFileName!: string;
  productCodesSearchHolder!: ProductMasterModel[];
  employeeCodes!: EmployeeMasterModel[];
  employeeToCodes!: EmployeeMasterModel[];
  employeeCodesSearchHolder!: EmployeeMasterModel[];
  locationCodes!: LocationMasterModel[];
  departmentCodes!: DepartmentMasterModel[];
  uploader: FileUploader = new FileUploader({
    isHTML5: true,
    maxFileSize: 2 * 1024 * 1024,
    queueLimit: 3
  });
  downloadDocumentsList: string[] = [];
  viewMode: boolean = false;
  rowAssetTransferData!: AssetTransferLineItemModel[];
  columnAssetTransferDefs: any;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private assetCategoryMasterService: AssetCategoryMasterService,
    private assetSubCategoryMasterService: AssetSubCategoryMasterService,
    private saveAlert: SaveAlert,
    private productMasterService: ProductMasterService,
    private assetTransferDirectService: AssetTransferDirectService,
    private assetRegisterService: AssetRegisterService,
    private employeeMasterService: EmployeeMasterService,
    private departmentMasterService: DepartmentmasterService,
    private locationMasterService: LocationmasterService,
    private datePipe: DatePipe) {

    this.assetTransferDirectForm = this.formBuilder.group({
      departmentSelCode: [null],
      assetCategorySelCode: [null],
      assetSubCategorySelCode: [null],
      AssetSelCode: [null],
      EmployeeSelCode: [null],
      LocationSelCode: [null],
      departmentToSelCode: [null],
      EmployeeToSelCode: [null],
      LocationToSelCode: [null],
      Remarks: [null, Validators.required],
      SerialNumberSelCode: [null],
      fileInputDoc: [null]
    });
  }

  async ngOnInit() {
    $('.select2bs4').select2();

    //Bootstrap Duallistbox
    $('.duallistbox').bootstrapDualListbox();

    this.columnFilterDefs = [
      {
        headerName: 'Serial Number', field: 'serialNo', sortable: true, filter: true, resizable: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true
      },
      { headerName: 'Product Code', field: 'productCode', sortable: true, filter: true, resizable: true, },
      { headerName: 'Product Name', field: 'productName', sortable: true, filter: true, resizable: true, },
      { headerName: 'Category Code', field: 'assetCategoryCode', sortable: true, filter: true, resizable: true },
      { headerName: 'Category Name', field: 'assetCategoryName', sortable: true, filter: true, resizable: true },
      { headerName: 'SubCategory Code', field: 'assetSubCategoryCode', sortable: true, filter: true, resizable: true },
      { headerName: 'SubCategory Name', field: 'assetSubCategoryName', sortable: true, filter: true, resizable: true },
      { headerName: 'Employee Name', field: 'employeeName', sortable: true, filter: true, resizable: true },
      { headerName: 'Location Name', field: 'locationName', sortable: true, filter: true, resizable: true },

    ];

    this.columnDataDefs = [
      {
        headerName: 'Serial Number', field: 'serialNo', sortable: true, filter: true, resizable: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true
      },
      { headerName: 'Product Code', field: 'productCode', sortable: true, filter: true, resizable: true, },
      { headerName: 'Product Name', field: 'productName', sortable: true, filter: true, resizable: true, },
      { headerName: 'Category Code', field: 'assetCategoryCode', sortable: true, filter: true, resizable: true },
      { headerName: 'Category Name', field: 'assetCategoryName', sortable: true, filter: true, resizable: true },
      { headerName: 'SubCategory Code', field: 'assetSubCategoryCode', sortable: true, filter: true, resizable: true },
      { headerName: 'SubCategory Name', field: 'assetSubCategoryName', sortable: true, filter: true, resizable: true },
      { headerName: 'Employee Name', field: 'employeeName', sortable: true, filter: true, resizable: true },
      { headerName: 'Location Name', field: 'locationName', sortable: true, filter: true, resizable: true },

    ];

    this.columnAssetTransferDefs = [
      { field: 'serialNo', sortable: true, filter: true },
      { field: 'productId', sortable: true, filter: true, hide: true },
      { headerName: 'Product Code', field: 'productCode', sortable: true, filter: true, width: 150 },
      { headerName: 'Product Name', field: 'productName', sortable: true, filter: true, width: 160 },
      { field: 'productDescription', sortable: true, filter: true, width: 150 },
      { field: 'scannedProductCode', sortable: true, filter: true },
      { field: 'scannedProductName', sortable: true, filter: true },
      { field: 'scannedProductDescription', sortable: true, filter: true, width: 120 },
      { field: 'scannedFromLocationCode', sortable: true, filter: true },
      { field: 'scannedFromLocationName', sortable: true, filter: true },
    ];

    $('[name="assetCategorySelCode"]').on("change", () => {
      this.assetTransferDirectFormControls.assetCategorySelCode.setValue($('[name="assetCategorySelCode"]').val());
      this.subCategoryCodes = this.subCategoryCodesSearchHolder.filter(item => item.assetCategoryId == $('[name="assetCategorySelCode"]').val());
      this.productCodes = this.productCodesSearchHolder.filter(item => item.assetCategoryId == $('[name="assetCategorySelCode"]').val());
      //this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.categoryId == $('[name="assetCategorySelCode"]').val());
      //if ($('[name="assetCategorySelCode"]').val() > 0)
      this.assetTransferDirectFormControls.assetSubCategorySelCode.setValue(0);
      $('[name="assetSubCategorySelCode"]').select2().trigger('change');
      //this.SearchSerialNos();
    });

    $('[name="assetSubCategorySelCode"]').on("change", () => {
      this.assetTransferDirectFormControls.assetSubCategorySelCode.setValue($('[name="assetSubCategorySelCode"]').val());
      this.productCodes = this.productCodesSearchHolder.filter(item => item.assetSubCategoryId == $('[name="assetSubCategorySelCode"]').val());
      //this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.subCategoryId == $('[name="assetSubCategorySelCode"]').val());
      //if ($('[name="assetSubCategorySelCode"]').val() > 0)
      this.SearchSerialNos();
    });

    $('[name="AssetSelCode"]').on("change", () => {
      this.assetTransferDirectFormControls.AssetSelCode.setValue($('[name="AssetSelCode"]').val());
      //this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.productId == $('[name="AssetSelCode"]').val());
      //if ($('[name="AssetSelCode"]').val() > 0)
      this.SearchSerialNos();
    });

    $('[name="departmentSelCode"]').on("change", () => {
      this.assetTransferDirectFormControls.departmentSelCode.setValue($('[name="departmentSelCode"]').val());
      this.employeeCodes = this.employeeCodesSearchHolder.filter(x => x.departmentId == $('[name="departmentSelCode"]').val());
      //this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.departmentID == $('[name="departmentSelCode"]').val());
      this.assetTransferDirectFormControls.EmployeeSelCode.setValue(0);
      //this.SearchSerialNos();
    });

    $('[name="EmployeeSelCode"]').on("change", () => {
      this.assetTransferDirectFormControls.EmployeeSelCode.setValue($('[name="EmployeeSelCode"]').val());
      // this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.employeeId == $('[name="EmployeeSelCode"]').val());
      this.SearchSerialNos();
    });

    $('[name="departmentToSelCode"]').on("change", () => {
      this.assetTransferDirectFormControls.departmentToSelCode.setValue($('[name="departmentToSelCode"]').val());
      this.employeeToCodes = this.employeeCodesSearchHolder.filter(x => x.departmentId == $('[name="departmentToSelCode"]').val());
    });

    $('[name="EmployeeToSelCode"]').on("change", () => {
      this.assetTransferDirectFormControls.EmployeeToSelCode.setValue($('[name="EmployeeToSelCode"]').val());
    });

    $('[name="LocationSelCode"]').on("change", () => {
      this.assetTransferDirectFormControls.LocationSelCode.setValue($('[name="LocationSelCode"]').val());
      this.SearchSerialNos();
    });

    $('[name="LocationToSelCode"]').on("change", () => {
      this.assetTransferDirectFormControls.LocationToSelCode.setValue($('[name="LocationToSelCode"]').val());
    });

    this.categoryCodes = await this.assetCategoryMasterService.getAssetCategoryMaster();
    this.subCategoryCodes = await this.assetSubCategoryMasterService.getAssetSubCategoryMaster();
    this.productCodes = await this.productMasterService.getProductMaster();
    this.subCategoryCodesSearchHolder = this.subCategoryCodes;
    //this.serialNumberCodes = await this.assetRegisterService.getAssetRegister();
    //this.serialNumberCodesSerachHolderCodes = this.serialNumberCodes;
    this.productCodesSearchHolder = this.productCodes;
    this.employeeCodes = await this.employeeMasterService.getEmployeeMaster();
    this.employeeCodesSearchHolder = this.employeeCodes;
    this.locationCodes = await this.locationMasterService.getLocationMaster();
    this.departmentCodes = await this.departmentMasterService.getDepartmentMaster();
    this.employeeToCodes = this.employeeCodesSearchHolder;
    //this.RebuildDualListBox();
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.transferNo = params['id'];
        this.editMode = true;
        this.assetTransferDirectService.getAssetTransferDirectByKey(this.transferNo).subscribe(res => {
          this.assetTransferDirectData = res;
          this.ShowEditViewAssetTransferDirect(this.assetTransferDirectData);
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

  private RebuildDualListBox() {
    $("#SerialNumberSelCode").bootstrapDualListbox().empty();
    $.each(this.serialNumberCodes, function (i: number, val: string[]) {
      $('#SerialNumberSelCode').append('<option>' + val + '</option>');
    });

    $("#SerialNumberSelCode").bootstrapDualListbox('refresh', true);
  }

  get assetTransferDirectFormControls() { return this.assetTransferDirectForm.controls; }

  ShowGrid() {
    this.router.navigateByUrl('/transfer');
  }

  disableControls() {
    this.assetTransferDirectFormControls.assetCategorySelCode.disable();
    this.assetTransferDirectFormControls.departmentSelCode.disable();
    this.assetTransferDirectFormControls.EmployeeSelCode.disable();
    this.assetTransferDirectFormControls.assetSubCategorySelCode.disable();
    this.assetTransferDirectFormControls.AssetSelCode.disable();
    this.assetTransferDirectFormControls.LocationSelCode.disable();
    this.assetTransferDirectFormControls.departmentToSelCode.disable();
    this.assetTransferDirectFormControls.EmployeeToSelCode.disable();
    this.assetTransferDirectFormControls.Remarks.disable();
    this.assetTransferDirectFormControls.LocationToSelCode.disable();
    this.isbtnSaveDisabled = this.viewMode;
    this.isbtnClearDisabled = this.viewMode;
  }

  ClearContents() {
this.rowFilterData=[];
this.rowAddedData=[];
    this.assetTransferDirectFormControls.assetCategorySelCode.setValue('');
    this.assetTransferDirectFormControls.departmentSelCode.setValue('');
    this.assetTransferDirectFormControls.EmployeeSelCode.setValue('');
    this.assetTransferDirectFormControls.assetSubCategorySelCode.setValue('');
    this.assetTransferDirectFormControls.AssetSelCode.setValue('');
    this.assetTransferDirectFormControls.LocationSelCode.setValue('');
    this.assetTransferDirectFormControls.departmentToSelCode.setValue('');
    this.assetTransferDirectFormControls.EmployeeToSelCode.setValue('');
    this.assetTransferDirectFormControls.Remarks.setValue('');
    this.assetTransferDirectFormControls.LocationToSelCode.setValue('');
    $('[name="assetCategorySelCode"]').select2().trigger('change');
    $('[name="departmentSelCode"]').select2().trigger('change');
    $('[name="EmployeeSelCode"]').select2().trigger('change');
    $('[name="assetSubCategorySelCode"]').select2().trigger('change');
    $('[name="AssetSelCode"]').select2().trigger('change');
    $('[name="LocationSelCode"]').select2().trigger('change');
    $('[name="departmentToSelCode"]').select2().trigger('change');
    $('[name="EmployeeToSelCode"]').select2().trigger('change');
    $('[name="LocationToSelCode"]').select2().trigger('change');

    //this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes;
    this.productCodes = this.productCodesSearchHolder;
    this.uploader.clearQueue();
    //this.RebuildDualListBox();

  }

  ShowEditViewAssetTransferDirect(data: AssetTransferDirectModel) {
    this.assetTransferDirectFormControls.departmentToSelCode.setValue(data.toDepartmentID);
    this.assetTransferDirectFormControls.EmployeeToSelCode.setValue(data.toEmployeeId);
    this.assetTransferDirectFormControls.Remarks.setValue(data.remarks);
    this.assetTransferDirectFormControls.LocationToSelCode.setValue(data.toLocationId);
    $('[name="assetCategorySelCode"]').select2().trigger('change');
    $('[name="departmentSelCode"]').select2().trigger('change');
    $('[name="EmployeeSelCode"]').select2().trigger('change');
    $('[name="assetSubCategorySelCode"]').select2().trigger('change');
    $('[name="AssetSelCode"]').select2().trigger('change');
    $('[name="LocationSelCode"]').select2().trigger('change');
    $('[name="departmentToSelCode"]').select2().trigger('change');
    $('[name="EmployeeToSelCode"]').select2().trigger('change');
    $('[name="LocationToSelCode"]').select2().trigger('change');
    this.rowAssetTransferData = data.lines;
    //$('select').select2().trigger('change');
  }

  fileChange(event: any) {
    this.fileList = event.target.files;
  }

  SearchSerialNos() {
    var assetSerialNosSearch = new AssetSerialNosSearch;
    var isFilterAvailable=false;
    if (this.assetTransferDirectFormControls.assetCategorySelCode.value > 0) {
      assetSerialNosSearch.assetCategoryId = this.assetTransferDirectFormControls.assetCategorySelCode.value;
      isFilterAvailable=true;
    }
    if (this.assetTransferDirectFormControls.departmentSelCode.value > 0) {
      assetSerialNosSearch.departmentId = this.assetTransferDirectFormControls.departmentSelCode.value;
      isFilterAvailable=true;
    }
    if (this.assetTransferDirectFormControls.EmployeeSelCode.value > 0) {
      assetSerialNosSearch.employeeId = this.assetTransferDirectFormControls.EmployeeSelCode.value;
      isFilterAvailable=true;
    }
    if (this.assetTransferDirectFormControls.assetSubCategorySelCode.value > 0) {
      assetSerialNosSearch.assetSubCategoryId = this.assetTransferDirectFormControls.assetSubCategorySelCode.value;
      isFilterAvailable=true;
    }
    if (this.assetTransferDirectFormControls.AssetSelCode.value > 0) {
      assetSerialNosSearch.productId = this.assetTransferDirectFormControls.AssetSelCode.value;
      isFilterAvailable=true;
    }
    if (this.assetTransferDirectFormControls.LocationSelCode.value > 0) {
      assetSerialNosSearch.locationId = this.assetTransferDirectFormControls.LocationSelCode.value;
      isFilterAvailable=true;
    }
if(isFilterAvailable==false)
{
  return;
}
    // this.assetRegisterService.getAssetRegisterSerialNos(assetSerialNosSearch).subscribe(res => {
    //   this.serialNumberCodes = res;
    //   this.RebuildDualListBox();
    // });
    this.rowFilterData = [];
    this.assetRegisterService.getAssetRegisterSerialNosData(assetSerialNosSearch).subscribe(res => {
      this.rowFilterData = res;
      this.agGridFilter.api.setRowData(this.rowAddedData);
    this.agGridFilter.api.redrawRows();
    });

  }
  onFilterGridSelectionChanged(event: any) {
    this.isFilterGridRowSelected = true;
  }
  onDataGridSelectionChanged(event: any) {
    this.isAddedGridRowSelected = true;
  }
  isAddedGridRowSelected: boolean = false;
  isFilterGridRowSelected: boolean = false;
  errorserialadd='';
  errorserialdelete='';
  AddTag() {
    this.isAddedGridRowSelected = false;
    let selectedNodes = this.agGridFilter.api.getSelectedNodes();
    let selectedData = selectedNodes.map<AssetRegisterModel>(node => node.data);
    this.errorserialadd='';
    if(selectedData.length<=0)
    {
      this.errorserialadd='Please select atleast one row';
      return;
    }
    selectedData.forEach(element => {
      var alreadyExist=this.rowAddedData.filter(p=>p.serialNo==element.serialNo);
      if(alreadyExist.length<=0)
      {
      this.rowAddedData.push(element);
      }
    });
    console.log(selectedData);
    selectedData.forEach(element => {
      this.rowFilterData.splice(this.rowFilterData.findIndex(p=>p.serialNo==element.serialNo),1);
    });
    this.agGridData.api.setRowData(this.rowAddedData);
    this.agGridData.api.redrawRows();
    this.agGridFilter.api.setRowData(this.rowFilterData);
    this.agGridFilter.api.redrawRows();
    this.isFilterGridRowSelected = false;
  }
  DeleteTag() {
    let selectedNodes = this.agGridData.api.getSelectedNodes();
    let selectedData = selectedNodes.map<AssetRegisterModel>(node => node.data);
    this.errorserialdelete='';
    if(selectedData.length<=0)
    {
      this.errorserialdelete='Please select atleast one row';
      return;
    }
   
    selectedData.forEach(element => {
      this.rowAddedData.splice(this.rowAddedData.findIndex(p=>p.serialNo==element.serialNo),1);
    });
    this.agGridData.api.setRowData(this.rowAddedData);
    this.agGridData.api.redrawRows();
    this.isAddedGridRowSelected = false;
  }
  SaveAssetTransferDirect() {
    // this.isSelectedtransferNo = $('#SerialNumberSelCode').val().length > 0;
    // if (this.isSelectedtransferNo || this.editMode) {
    //   this.assetTransferDirectFormControls.SerialNumberSelCode.setValidators(null);
    //   this.assetTransferDirectFormControls.SerialNumberSelCode.updateValueAndValidity();
    // }
    
    this.submitted = true;
    this.error = '';
    if(this.rowAddedData.length<=0)
    {
      this.error='No serial number added for transfer';
      return;
    }
    if(this.assetTransferDirectFormControls.EmployeeToSelCode.value==null && this.assetTransferDirectFormControls.LocationToSelCode.value==null )
    {
      console.log(this.assetTransferDirectFormControls.EmployeeToSelCode.value);
      this.error='Please select employee or location to be transfer the asset';
      return;
    }
    // stop here if form is invalid
    if (this.assetTransferDirectForm.invalid) {
      return;
    }
    this.loading = true;
    let saveResponse!: Observable<any>;
    var selectedValues: string[] = [];
    // selectedValues = $('#SerialNumberSelCode').val();
    this.rowAddedData.forEach(element => {
      selectedValues.push(element.serialNo);
    });
    console.log(selectedValues);
    const formData = new FormData();
    var date = new Date;
    formData.append('transferDate', this.datePipe.transform(date, "yyyy-MM-dd") as string);
    formData.append('toEmployeeId', this.assetTransferDirectFormControls.EmployeeToSelCode.value ==null ? 0 : this.assetTransferDirectFormControls.EmployeeToSelCode.value);
    formData.append('toLocationID', this.assetTransferDirectFormControls.LocationToSelCode.value==null ?0 : this.assetTransferDirectFormControls.LocationToSelCode.value);
    formData.append('remarks', this.assetTransferDirectFormControls.Remarks.value);
    var transferLine = new TransferLine();
    transferLine.serialNos = selectedValues;
    //From WEB Client Always we will sent only one Line Item, with one or more SerialNos
    console.log(JSON.stringify(transferLine));
    formData.append('lines', JSON.stringify(transferLine));



    this.assetTransferDirectModel = new AssetTransferDirectModel;
    this.assetTransferDirectModel.transferNo = this.transferNo;
    this.assetTransferDirectModel.serialNo = selectedValues.join(",");
    this.assetTransferDirectModel.toDepartmentID = this.assetTransferDirectFormControls.departmentToSelCode.value;
    this.assetTransferDirectModel.toEmployeeId = this.assetTransferDirectFormControls.EmployeeToSelCode.value;
    this.assetTransferDirectModel.toLocationId = this.assetTransferDirectFormControls.LocationToSelCode.value;
    this.assetTransferDirectModel.remarks = this.assetTransferDirectFormControls.Remarks.value;
console.log(this.assetTransferDirectModel);


    for (let j = 0; j < this.uploader.queue.length; j++) {
      let fileItem = this.uploader.queue[j]._file;
      formData.append('documents', fileItem, fileItem.name);
    }

    formData.forEach((value, key, parent) => {
      console.log(value + ', ' + key);
    });
console.log(formData);
    if (this.editMode) {
      saveResponse = this.assetTransferDirectService.editAssetTransferDirectmaster(formData, this.transferNo);
    } else {
      saveResponse = this.assetTransferDirectService.addAssetTransferDirect(formData);
    }

    saveResponse.subscribe(
      result => {

        if (!this.editMode) {
          this.assetTransferDirectModel.transferNo = result.transferNo;
          this.assetTransferDirectModel.transferDate = result.transferDate;
          this.assetTransferDirectModel.toDepartmentID = result.departmentID;
          this.assetTransferDirectModel.toEmployeeId = result.toEmployeeId;
          this.assetTransferDirectModel.toLocationId = result.toLocationId;
          this.assetTransferDirectModel.remarks = result.remarks;
          this.assetTransferDirectModel.transferType = result.transferType;
          this.assetTransferDirectModel.transferTypeDesc = result.transferTypeDesc;
          this.assetTransferDirectModel.status = result.status;
          this.assetTransferDirectModel.toDepartmentCode = result.toDepartmentCode;
          this.assetTransferDirectModel.toDepartmentName = result.toDepartmentName;
          this.assetTransferDirectModel.toEmpCode = result.toEmpCode;
          this.assetTransferDirectModel.toEmpFirstName = result.toEmpFirstName;
          this.assetTransferDirectModel.toEmpLastName = result.toEmpLastName;
          this.assetTransferDirectModel.toLocationCode = result.toLocationCode;
          this.assetTransferDirectModel.toLocationName = result.toLocationName;
          this.assetTransferDirectModel.requestNo = result.requestNo;
          this.assetTransferDirectModel.documentIds = result.documentIds;
          this.assetTransferDirectModel.lines = result.lines;
          this.assetTransferDirectModel.statusText='Waiting for Approval';
          this.rowAddedData=[];
          this.rowFilterData=[];
          this.ClearContents();
        }

        this.saveAlert.SuccessMessage();
        this.assetTransferDirectService.AddOrEditRecordToCache(this.assetTransferDirectModel, this.editMode);
        this.loading = false;
        this.submitted = false;
        this.assetRegisterService.onRefreshAssetRegister();
        if (this.editMode)
          this.ShowGrid();

      },
      err => {
        this.error = err.error ? err.error : err.message;
        this.loading = false;
      }
    );

    // this.assetTransferDirectFormControls.SerialNumberSelCode.setValidators([Validators.required]);
    // this.assetTransferDirectFormControls.SerialNumberSelCode.updateValueAndValidity();
  }

}


