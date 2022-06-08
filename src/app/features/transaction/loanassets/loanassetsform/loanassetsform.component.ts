import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { Observable } from 'rxjs';
import { CommonValueListService } from 'src/app/core/service/commonlistvalue.service';
import { CustomerMasterService } from 'src/app/core/service/customermaster.service';
import { LoanService } from 'src/app/core/service/loan.service';
import { AssetSerialNosSearch } from 'src/app/shared/model/AssetSerialNosSearch';
import { CommonValueListModel } from 'src/app/shared/model/CommonValueListModel';
import { CustomerMasterModel } from 'src/app/shared/model/CustomerMasterModel';
import { LoanLine } from 'src/app/shared/model/LoanLine';
import { LoanModel } from 'src/app/shared/model/LoanModel';
import { AssetCategoryMasterService } from '../../../../core/service/assetcategorymaster.service';
import { AssetRegisterService } from '../../../../core/service/assetregister.service';
import { AssetSubCategoryMasterService } from '../../../../core/service/assetsubcategorymaster.service';
import { DepartmentmasterService } from '../../../../core/service/departmentmaster.service';
import { EmployeeMasterService } from '../../../../core/service/employeemaster.service';
import { LocationmasterService } from '../../../../core/service/locationmaster.service';
import { ProductMasterService } from '../../../../core/service/productmaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { AssetCategoryMasterModel } from '../../../../shared/model/AssetCategoryMasterModel';
import { AssetRegisterModel } from '../../../../shared/model/AssetRegisterModel';
import { AssetSubCategoryMasterModel } from '../../../../shared/model/AssetSubCategoryMasterModel';
import { DepartmentMasterModel } from '../../../../shared/model/DepartmentMasterModel';
import { EmployeeMasterModel } from '../../../../shared/model/EmployeeMasterModel';
import { LocationMasterModel } from '../../../../shared/model/LocationMasterModel';
import { ProductMasterModel } from '../../../../shared/model/ProductMasterModel';
declare var $: any;

@Component({
  selector: 'org-fat-loanassetsform',
  templateUrl: './loanassetsform.component.html',
  styleUrls: ['./loanassetsform.component.css']
})
export class LoanassetsformComponent implements OnInit {
  loanAssetsForm: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  columnDefs: any;
  rowData: any;
  locale = 'en-US';
  categoryCodes!: AssetCategoryMasterModel[];
  subCategoryCodes!: AssetSubCategoryMasterModel[];
  subCategoryCodesSearchHolder!: AssetSubCategoryMasterModel[];
  productCodes!: ProductMasterModel[];
  serialNumber!: number;
  editMode!: boolean;
  loanAssetsModel: LoanModel = new LoanModel;
  suppCodes!: CustomerMasterModel[];
  isbtnSaveDisabled: boolean = false;
  isIssueToEmployee: boolean = true;
  isIssueToCustomer: boolean = true;
  isbtnClearDisabled: boolean = false;
  serialNumberCodes: string[] = [];
  serialNumberCodesSerachHolderCodes!: AssetRegisterModel[];
  releaseNo: string = '';
  fileList!: FileList;
  loanAssetsData!: LoanModel;
  isSelectedreleaseNo!: boolean;
  warrantyFileName!: string;
  productCodesSearchHolder!: ProductMasterModel[];
  employeeCodes!: EmployeeMasterModel[];
  employeeToCodes!: EmployeeMasterModel[];
  employeeCodesSearchHolder!: EmployeeMasterModel[];
  loanTypeCodes!: CommonValueListModel[];
  locationCodes!: LocationMasterModel[];
  departmentCodes!: DepartmentMasterModel[];
  uploader: FileUploader = new FileUploader({
    isHTML5: true,
    maxFileSize: 2 * 1024 * 1024,
    queueLimit: 3
  });
  downloadDocumentsList: string[] = [];
  viewMode: boolean = false;
  rowLoanData!: LoanLine[];
  columnLoanDefs: any;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private assetCategoryMasterService: AssetCategoryMasterService,
    private assetSubCategoryMasterService: AssetSubCategoryMasterService,
    private saveAlert: SaveAlert,
    private productMasterService: ProductMasterService,
    private loanAssetsService: LoanService,
    private assetRegisterService: AssetRegisterService,
    private employeeMasterService: EmployeeMasterService,
    private departmentMasterService: DepartmentmasterService,
    private locationMasterService: LocationmasterService,
    private customerMasterService: CustomerMasterService,
    private commonValueListMasterService: CommonValueListService,
    private datePipe: DatePipe) {

    this.loanAssetsForm = this.formBuilder.group({
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
      fileInputDoc: [null],
      IssueToType: [null],
      customerSelCode: [null],
      loanTypeSelCode: [null],
      LoanUntill: [null],
      ReleaseDate: [null]
    });
  }

  async ngOnInit() {
    $('.select2bs4').select2();
    
    //Bootstrap Duallistbox
    $('.duallistbox').bootstrapDualListbox();

    const today = new Date();
    const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    $('#LoanUntill').datetimepicker({
      format: 'L'
    });

    $('#ReleaseDate').datetimepicker({
      format: 'L'
    });

    $("#LoanUntill .datetimepicker-input").val(datepart); // Assign the value
    $("#LoanUntill .datetimepicker-input").trigger("click"); // Trigger click

    $("#ReleaseDate .datetimepicker-input").val(datepart); // Assign the value
    $("#ReleaseDate .datetimepicker-input").trigger("click");

   this.columnLoanDefs = [
      { field: 'productId', sortable: true, filter: true, hide: true },
      { field: 'releaseNo', sortable: true, filter: true, hide: true },
      { field: 'productDescription', sortable: true, filter: true, width: 150 },
      { headerName: 'Product Code', field: 'productCode', sortable: true, filter: true, width: 150 },
      { headerName: 'Product Name', field: 'productName', sortable: true, filter: true, width: 160 },
      { field: 'lineStatusText', sortable: true, filter: true },
      {  field: 'serialNo', sortable: true, filter: true },
      { field: 'loanLineStatus', sortable: true, filter: true, hide: true },
      { field: 'remarks', sortable: true, filter: true }
     ];
    
    $('[name="assetCategorySelCode"]').on("change", () => {
      this.loanAssetsFormControls.assetCategorySelCode.setValue($('[name="assetCategorySelCode"]').val());
      this.subCategoryCodes = this.subCategoryCodesSearchHolder.filter(item => item.assetCategoryId == $('[name="assetCategorySelCode"]').val());
      this.productCodes = this.productCodesSearchHolder.filter(item => item.assetCategoryId == $('[name="assetCategorySelCode"]').val());
      //this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.categoryId == $('[name="assetCategorySelCode"]').val());
      //if ($('[name="assetCategorySelCode"]').val() > 0)
      this.loanAssetsFormControls.assetSubCategorySelCode.setValue(0);
      $('[name="assetSubCategorySelCode"]').select2().trigger('change');
        //this.SearchSerialNos();
    });

    $('[name="assetSubCategorySelCode"]').on("change", () => {
      this.loanAssetsFormControls.assetSubCategorySelCode.setValue($('[name="assetSubCategorySelCode"]').val());
      this.productCodes = this.productCodesSearchHolder.filter(item => item.assetSubCategoryId == $('[name="assetSubCategorySelCode"]').val());
      //this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.subCategoryId == $('[name="assetSubCategorySelCode"]').val());
      //if ($('[name="assetSubCategorySelCode"]').val() > 0)
        this.SearchSerialNos();
    });

    $('[name="AssetSelCode"]').on("change", () => {
      this.loanAssetsFormControls.AssetSelCode.setValue($('[name="AssetSelCode"]').val());
      //this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.productId == $('[name="AssetSelCode"]').val());
      //if ($('[name="AssetSelCode"]').val() > 0)
        this.SearchSerialNos();
    });

    $('[name="departmentSelCode"]').on("change", () => {
      this.loanAssetsFormControls.departmentSelCode.setValue($('[name="departmentSelCode"]').val());
      this.employeeCodes = this.employeeCodesSearchHolder.filter(x => x.departmentId == $('[name="departmentSelCode"]').val());
      //this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.departmentID == $('[name="departmentSelCode"]').val());
      this.loanAssetsFormControls.EmployeeSelCode.setValue(0);
      //this.SearchSerialNos();
    });

    $('[name="EmployeeSelCode"]').on("change", () => {
      this.loanAssetsFormControls.EmployeeSelCode.setValue($('[name="EmployeeSelCode"]').val());
     // this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.employeeId == $('[name="EmployeeSelCode"]').val());
      this.SearchSerialNos();
    });

    $('[name="departmentToSelCode"]').on("change", () => {
      this.loanAssetsFormControls.departmentToSelCode.setValue($('[name="departmentToSelCode"]').val());
      this.employeeToCodes = this.employeeCodesSearchHolder.filter(x => x.departmentId == $('[name="departmentToSelCode"]').val());
    });

    $('[name="EmployeeToSelCode"]').on("change", () => {
      this.loanAssetsFormControls.EmployeeToSelCode.setValue($('[name="EmployeeToSelCode"]').val());
    });

    $('[name="LocationSelCode"]').on("change", () => {
      this.loanAssetsFormControls.LocationSelCode.setValue($('[name="LocationSelCode"]').val());
      this.SearchSerialNos();
    });

    $('[name="LocationToSelCode"]').on("change", () => {
      this.loanAssetsFormControls.LocationToSelCode.setValue($('[name="LocationToSelCode"]').val());
    });

    $('[name="customerSelCode"]').on("change", () => {
      this.loanAssetsFormControls.customerSelCode.setValue($('[name="customerSelCode"]').val());
    });

    $('[name="loanTypeSelCode"]').on("change", () => {
      this.loanAssetsFormControls.loanTypeSelCode.setValue($('[name="loanTypeSelCode"]').val());
    });

    $('[name="IssueToType"]').on("change", () => {
      this.loanAssetsFormControls.IssueToType.setValue($('[name="IssueToType"]').val());
      if($('[name="IssueToType"]').val() == 1) {
        this.isIssueToEmployee = true;
        this.isIssueToCustomer = false;
      } else if ($('[name="IssueToType"]').val() == 2) {
        this.isIssueToCustomer = true;
        this.isIssueToEmployee = false;
      }
    });
    
    this.categoryCodes = await this.assetCategoryMasterService.getAssetCategoryMaster();
    this.subCategoryCodes = await this.assetSubCategoryMasterService.getAssetSubCategoryMaster();
    this.suppCodes = await this.customerMasterService.getCustomerMaster();
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
    this.loanTypeCodes = await this.commonValueListMasterService.getLoanTypeItems();
    //this.RebuildDualListBox();
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.releaseNo = params['id'];
        this.editMode = true;
        this.loanAssetsService.getLoanByKey(this.releaseNo).subscribe( res => {
          this.loanAssetsData = res;
          this.ShowEditViewLoan(this.loanAssetsData);
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
    var selectedOpts = $('#SerialNumberSelCode').val();
    $("#SerialNumberSelCode").bootstrapDualListbox().empty();
    $.each(this.serialNumberCodes, function (i: number, val: string[]) {
      $('#SerialNumberSelCode').append('<option>' + val + '</option>');
      
    });
    $.each(selectedOpts, function (i: number, val: string[]) {
      $('#SerialNumberSelCode').append("<option ' selected >" + val + "</option>");
    });
    
    $("#SerialNumberSelCode").bootstrapDualListbox('refresh');
  }

  get loanAssetsFormControls() { return this.loanAssetsForm.controls; }

  ShowGrid() {
    this.router.navigateByUrl('/assetloan');
  }

  disableControls() {
    this.loanAssetsFormControls.loanTypeSelCode.disable();
    this.loanAssetsFormControls.Remarks.disable();
    this.loanAssetsFormControls.IssueToType.disable();
    this.loanAssetsFormControls.EmployeeSelCode.disable();
    this.loanAssetsFormControls.EmployeeToSelCode.disable();
    this.loanAssetsFormControls.customerSelCode.disable();
    $("#LoanUntill .datetimepicker-input").attr('disabled', true);
    $("#ReleaseDate .datetimepicker-input").attr('disabled', true);
    this.isbtnSaveDisabled = this.viewMode;
    this.isbtnClearDisabled = this.viewMode;
  }

  ClearContents() {
    this.loanAssetsFormControls.customerSelCode.setValue('');
    this.loanAssetsFormControls.assetCategorySelCode.setValue('');
    this.loanAssetsFormControls.EmployeeSelCode.setValue('');
    this.loanAssetsFormControls.EmployeeToSelCode.setValue('');
    this.loanAssetsFormControls.assetSubCategorySelCode.setValue('');
    this.loanAssetsFormControls.AssetSelCode.setValue('');
    this.loanAssetsFormControls.LocationSelCode.setValue('');
    this.loanAssetsFormControls.loanTypeSelCode.setValue('');
    this.loanAssetsFormControls.Remarks.setValue('');
    this.loanAssetsFormControls.IssueToType.setValue('');
    $('#LoanUntill .datetimepicker-input').val('');
    $('#ReleaseDate .datetimepicker-input').val('');
    $('[name="loanTypeSelCode"]').select2().trigger('change');
    $('[name="IssueToType"]').select2().trigger('change');
    $('[name="customerSelCode"]').select2().trigger('change');
    $('[name="EmployeeSelCode"]').select2().trigger('change');
    $('[name="EmployeeToSelCode"]').select2().trigger('change');
    $('[name="assetCategorySelCode"]').select2().trigger('change');
    $('[name="assetSubCategorySelCode"]').select2().trigger('change');
    $('[name="AssetSelCode"]').select2().trigger('change');
    $('[name="LocationSelCode"]').select2().trigger('change');
    //$('select').select2().trigger('change');
    //this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes;
    this.productCodes = this.productCodesSearchHolder;
    this.uploader.clearQueue();
    this.RebuildDualListBox();

  }

  ShowEditViewLoan(data: LoanModel) {
    this.loanAssetsFormControls.loanTypeSelCode.setValue(data.releaseTypeId);
    this.loanAssetsFormControls.IssueToType.setValue(data.issueToTypeId);
    this.loanAssetsFormControls.Remarks.setValue(data.remarks);
    if(data.issueToTypeId == 1)
      this.loanAssetsFormControls.customerSelCode.setValue(data.issueToId);
    else
      this.loanAssetsFormControls.EmployeeToSelCode.setValue(data.issueToId);
    $('#LoanUntill .datetimepicker-input').val(data.toBeReturnedDate ? formatDate(data.toBeReturnedDate, 'MM/dd/yyyy', this.locale) : '');
    $('#ReleaseDate .datetimepicker-input').val(data.releaseDate ? formatDate(data.releaseDate, 'MM/dd/yyyy', this.locale) : '');
    this.rowLoanData = data.loanLines;
    var selectedOpts = data.loanLines.map(function(a) {return a.serialNo;});
    $('[name="loanTypeSelCode"]').select2().trigger('change');
    $('[name="IssueToType"]').select2().trigger('change');
    $('[name="customerSelCode"]').select2().trigger('change');
    $('[name="EmployeeSelCode"]').select2().trigger('change');
    $('[name="EmployeeToSelCode"]').select2().trigger('change');
    $.each(selectedOpts, function (i: number, val: string[]) {
      $('#SerialNumberSelCode').append("<option ' selected >" + val + "</option>");
    });
    //$('select').select2().trigger('change');
  }

  fileChange(event: any) {
    this.fileList = event.target.files;
  }

  SearchSerialNos() {
    var assetSerialNosSearch = new AssetSerialNosSearch;
    if(this.loanAssetsFormControls.assetCategorySelCode.value > 0){
      assetSerialNosSearch.assetCategoryId = this.loanAssetsFormControls.assetCategorySelCode.value;
    }
    if(this.loanAssetsFormControls.departmentSelCode.value > 0){
      assetSerialNosSearch.departmentId = this.loanAssetsFormControls.departmentSelCode.value;
    }
    if(this.loanAssetsFormControls.EmployeeSelCode.value > 0){
      assetSerialNosSearch.employeeId = this.loanAssetsFormControls.EmployeeSelCode.value;
    }
    if(this.loanAssetsFormControls.assetSubCategorySelCode.value > 0){
      assetSerialNosSearch.assetSubCategoryId = this.loanAssetsFormControls.assetSubCategorySelCode.value;
    }
    if(this.loanAssetsFormControls.AssetSelCode.value > 0){
      assetSerialNosSearch.productId = this.loanAssetsFormControls.AssetSelCode.value;
    }
    if(this.loanAssetsFormControls.LocationSelCode.value > 0){
      assetSerialNosSearch.locationId = this.loanAssetsFormControls.LocationSelCode.value;
    }

    this.assetRegisterService.getAssetRegisterSerialNos(assetSerialNosSearch).subscribe( res => {
       this.serialNumberCodes = res;
      this.RebuildDualListBox();
    });
    
  }
  SaveLoan() {
    this.isSelectedreleaseNo = $('#SerialNumberSelCode').val().length > 0;
    if (this.isSelectedreleaseNo || this.editMode) {
      this.loanAssetsFormControls.SerialNumberSelCode.setValidators(null);
      this.loanAssetsFormControls.SerialNumberSelCode.updateValueAndValidity();
    }
    this.submitted = true;
    this.error = '';

    // stop here if form is invalid
    if (this.loanAssetsForm.invalid) {
      return;
    }
    this.loading = true;
    let saveResponse!: Observable<any>;
    var selectedValues: string[] = [];
    selectedValues = $('#SerialNumberSelCode').val();
    const formData = new FormData();
    var date = new Date;
    formData.append('releaseDate', this.datePipe.transform($('#ReleaseDate .datetimepicker-input').val(),"yyyy-MM-dd") as string);
    //formData.append('releaseNo', this.releaseNo.toString());
    $.each(selectedValues, function (i: number, val: string) {
      formData.append('serialNos', val);
    });
    
    formData.append('releaseTypeId', this.loanAssetsFormControls.loanTypeSelCode.value);
    formData.append('toBeReturnedDate', this.datePipe.transform($('#LoanUntill .datetimepicker-input').val(),"yyyy-MM-dd") as string);
    formData.append('issueToTypeId', this.loanAssetsFormControls.IssueToType.value);
    formData.append('issueToId', this.loanAssetsFormControls.IssueToType.value == 1 ? this.loanAssetsFormControls.customerSelCode.value : this.loanAssetsFormControls.EmployeeToSelCode.value);
    formData.append('remarks', this.loanAssetsFormControls.Remarks.value);
        
    this.loanAssetsModel = new LoanModel;
    this.loanAssetsModel.releaseDate = $('#ReleaseDate .datetimepicker-input').val();
    this.loanAssetsModel.serialNos = selectedValues.join(",");
    this.loanAssetsModel.releaseTypeId = this.loanAssetsFormControls.loanTypeSelCode.value;
    this.loanAssetsModel.toBeReturnedDate = $('#LoanUntill .datetimepicker-input').val();
    this.loanAssetsModel.issueToTypeId = this.loanAssetsFormControls.IssueToType.value;
    this.loanAssetsModel.issueToId = this.loanAssetsFormControls.IssueToType.value == 1 ? this.loanAssetsFormControls.customerSelCode.value : this.loanAssetsFormControls.EmployeeToSelCode.value;
    this.loanAssetsModel.remarks = this.loanAssetsFormControls.Remarks.value;



    for (let j = 0; j < this.uploader.queue.length; j++) {
      let fileItem = this.uploader.queue[j]._file;
      formData.append('Documents', fileItem, fileItem.name);
    }

    if (this.editMode) {
      saveResponse = this.loanAssetsService.editLoanmaster(formData, this.releaseNo);
    } else {
      saveResponse = this.loanAssetsService.addLoan(formData);
    }

    saveResponse.subscribe(
      result => {

        if (!this.editMode) {
          this.loanAssetsModel.releaseNo = result.releaseNo;
          this.loanAssetsModel.transactionTypeName = result.transactionTypeName;
          this.loanAssetsModel.releaseTypeText = result.releaseTypeText;
          this.loanAssetsModel.issueToTypeName = result.issueToTypeName;
          this.loanAssetsModel.issueToName = result.issueToName;
          this.loanAssetsModel.loanStatusText = result.loanStatusText;
          this.loanAssetsModel.loanStatus = result.loanStatus;
          this.ClearContents();
        }

        this.saveAlert.SuccessMessage();
        this.loanAssetsService.AddOrEditRecordToCache(this.loanAssetsModel, this.editMode);
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

    this.loanAssetsFormControls.SerialNumberSelCode.setValidators([Validators.required]);
    this.loanAssetsFormControls.SerialNumberSelCode.updateValueAndValidity();
  }

}


