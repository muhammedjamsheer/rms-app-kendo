import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetCategoryMasterService } from '../../../../core/service/assetcategorymaster.service';
import { AssetRegisterService } from '../../../../core/service/assetregister.service';
import { AssetSubCategoryMasterService } from '../../../../core/service/assetsubcategorymaster.service';
import { DownloadService } from '../../../../core/service/download.service';
import { InsuranceDetailsService } from '../../../../core/service/insurancedetails.service';
import { ProductMasterService } from '../../../../core/service/productmaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { AssetCategoryMasterModel } from '../../../../shared/model/AssetCategoryMasterModel';
import { AssetRegisterModel } from '../../../../shared/model/AssetRegisterModel';
import { AssetSubCategoryMasterModel } from '../../../../shared/model/AssetSubCategoryMasterModel';
import { InsuranceDetailsModel } from '../../../../shared/model/InsuranceDetailsModel';
import { ProductMasterModel } from '../../../../shared/model/ProductMasterModel';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'org-fat-insurancedetailsform',
  templateUrl: './insurancedetailsform.component.html',
  styleUrls: ['./insurancedetailsform.component.scss']
})
export class InsurancedetailsformComponent implements OnInit {
  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef;
  insuranceDetailsForm: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  columnDefs: any;
  rowData: any;
  categoryCodes!: AssetCategoryMasterModel[];
  subCategoryCodes!: AssetSubCategoryMasterModel[];
  subCategoryCodesSearchHolder!: AssetSubCategoryMasterModel[];
  productCodes!: ProductMasterModel[];
  serialNumber!: number;
  editMode!: boolean;
  insuranceDetailsModel: InsuranceDetailsModel = new InsuranceDetailsModel;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  serialNumberCodes!: AssetRegisterModel[];
  serialNumberCodesSerachHolderCodes!: AssetRegisterModel[];
  insuranceDetailsId: number = 0;
  fileList!: FileList;
  SerialNumber!: string;
  insuranceDetailsData!: InsuranceDetailsModel;
  isSelectedSerialNumber!: boolean;
  insuranceFileName!: string;
  productCodesSearchHolder!: ProductMasterModel[];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private assetCategoryMasterService: AssetCategoryMasterService,
    private assetSubCategoryMasterService: AssetSubCategoryMasterService,
    private saveAlert: SaveAlert,
    private productMasterService: ProductMasterService,
    private insuranceDetailsService: InsuranceDetailsService,
    private assetRegisterService: AssetRegisterService,
    private downloadService: DownloadService) {

    this.insuranceDetailsForm = this.formBuilder.group({
      assetCategorySelCode: [null],
      assetSubCategorySelCode: [null],
      AssetSelCode: [null],
      InsuranceStartDate: [null],
      InsuranceValue: [null, Validators.required],
      InsuranceName: [null, Validators.required],
      InsuranceEndDate: [null],
      SerialNumberSelCode: [null],
      fileInput: [null]
    });
  }

  async ngOnInit() {
    const today = new Date();
    const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    $('.select2bs4').select2();

    $('#InsuranceStartDate').datetimepicker({
      format: 'L'
    });

    $('#InsuranceEndDate').datetimepicker({
      format: 'L'
    });

    //Bootstrap Duallistbox
    $('.duallistbox').bootstrapDualListbox();


    $('[name="assetCategorySelCode"]').on("change", () => {
      this.insuranceDetailsFormControls.assetCategorySelCode.setValue($('[name="assetCategorySelCode"]').val());
      this.subCategoryCodes = this.subCategoryCodesSearchHolder.filter(item => item.assetCategoryId == $('[name="assetCategorySelCode"]').val());
      this.productCodes = this.productCodesSearchHolder.filter(item => item.assetCategoryId == this.insuranceDetailsFormControls.assetCategorySelCode.value);
      this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.categoryId == this.insuranceDetailsFormControls.assetCategorySelCode.value);
      if ($('[name="assetCategorySelCode"]').val() > 0)
        this.RebuildDualListBox();
    });

    $('[name="assetSubCategorySelCode"]').on("change", () => {
      this.insuranceDetailsFormControls.assetSubCategorySelCode.setValue($('[name="assetSubCategorySelCode"]').val());
      this.productCodes = this.productCodesSearchHolder.filter(item => item.assetSubCategoryId == this.insuranceDetailsFormControls.assetSubCategorySelCode.value);
      this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.subCategoryId == this.insuranceDetailsFormControls.assetSubCategorySelCode.value);
      if ($('[name="assetSubCategorySelCode"]').val() > 0)
        this.RebuildDualListBox();
    });

    $('[name="AssetSelCode"]').on("change", () => {
      this.insuranceDetailsFormControls.AssetSelCode.setValue($('[name="AssetSelCode"]').val());
      this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.productId == $('[name="AssetSelCode"]').val());
      if ($('[name="AssetSelCode"]').val() > 0)
        this.RebuildDualListBox();
    });

    $("#InsuranceEndDate .datetimepicker-input").val(datepart); // Assign the value
    $("#InsuranceEndDate .datetimepicker-input").trigger("click"); // Trigger click
    $("#InsuranceEndDate .datetimepicker-input").val('');

    $("#InsuranceStartDate .datetimepicker-input").val(datepart); // Assign the value
    $("#InsuranceStartDate .datetimepicker-input").trigger("click"); // Trigger click
    $("#InsuranceStartDate .datetimepicker-input").val('');

    this.categoryCodes = await this.assetCategoryMasterService.getAssetCategoryMaster();
    this.subCategoryCodes = await this.assetSubCategoryMasterService.getAssetSubCategoryMaster();
    this.productCodes = await this.productMasterService.getProductMaster();
    this.subCategoryCodesSearchHolder = this.subCategoryCodes;
    this.serialNumberCodes = await this.assetRegisterService.getAssetRegister();
    this.serialNumberCodesSerachHolderCodes = this.serialNumberCodes;
    this.productCodesSearchHolder = this.productCodes;
    //$('#SerialNumberSelCode').ClearContents();

    this.RebuildDualListBox();

    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.insuranceDetailsId = +params['id'];
        this.editMode = true;
        this.insuranceDetailsService.getInsuranceDetailsByKey(this.insuranceDetailsId).subscribe(res => {
          this.ShowEditViewInsuranceDetails(res);
        });


        if (params['state'] === 'view') {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
    });
  }

  private RebuildDualListBox() {
    $("#SerialNumberSelCode").bootstrapDualListbox().empty();
    $.each(this.serialNumberCodes, function (i: number, val: AssetRegisterModel) {
      $('#SerialNumberSelCode').append('<option>' + val.serialNo + '</option>');
    });

    $("#SerialNumberSelCode").bootstrapDualListbox('refresh', true);
  }

  get insuranceDetailsFormControls() { return this.insuranceDetailsForm.controls; }

  ShowGrid() {
    this.router.navigateByUrl('/insurancedetails');
  }

  disableControls() {
    $('#InsuranceStartDate .datetimepicker-input').attr('disabled', true);
    $('#InsuranceEndDate .datetimepicker-input').attr('disabled', true);
    this.insuranceDetailsFormControls.InsuranceValue.disable();
    this.insuranceDetailsFormControls.InsuranceName.disable();
    this.fileInput.nativeElement.disabled = true
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.fileInput.nativeElement.value = '';
    $('#InsuranceStartDate .datetimepicker-input').val('');
    $('#InsuranceEndDate .datetimepicker-input').val('');
    this.insuranceDetailsFormControls.InsuranceValue.setValue('');
    this.insuranceDetailsFormControls.InsuranceName.setValue('');
    this.insuranceDetailsFormControls.assetCategorySelCode.setValue('');
    this.insuranceDetailsFormControls.AssetSelCode.setValue('');
    this.insuranceDetailsFormControls.assetSubCategorySelCode.setValue('');
    $('[name="assetCategorySelCode"]').select2().trigger('change');
    $('[name="AssetSelCode"]').select2().trigger('change');
    $('[name="assetSubCategorySelCode"]').select2().trigger('change');
    //$('select').select2().trigger('change');
    this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes;
    this.productCodes = this.productCodesSearchHolder;
    this.RebuildDualListBox();

  }

  ShowEditViewInsuranceDetails(data: InsuranceDetailsModel) {
    this.SerialNumber = data.serialNo;
    $('#InsuranceStartDate .datetimepicker-input').val(formatDate(data.insuranceStartDate, 'MM/dd/yyyy', 'en-US'));
    $('#InsuranceEndDate .datetimepicker-input').val(formatDate(data.insuranceEndDate, 'MM/dd/yyyy', 'en-US'));
    this.insuranceDetailsFormControls.InsuranceValue.setValue(data.insuranceValue);
    this.insuranceDetailsFormControls.InsuranceName.setValue(data.insuranceName);
    this.insuranceFileName = data.documentId;
  }

  fileChange(event: any) {
    this.fileList = event.target.files;
  }

  InsuranceFileDownLoad() {
    //this.downloadService.DownloadFile(this.insuranceFileName);
    var docExtension = this.insuranceFileName.substr(this.insuranceFileName.lastIndexOf('.') + 1);
    this.downloadService.DownloadFile(this.insuranceFileName).subscribe((data: any) => {

      var blob = new Blob([data], { type: 'application/' + docExtension });

      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = this.insuranceFileName;
      link.click();

    });
  }

  SaveInsuranceDetails() {
    this.isSelectedSerialNumber = $('#SerialNumberSelCode').val().length > 0;
    if (this.isSelectedSerialNumber || this.editMode) {
      this.insuranceDetailsFormControls.SerialNumberSelCode.setValidators(null);
      this.insuranceDetailsFormControls.SerialNumberSelCode.updateValueAndValidity();
    }
    this.submitted = true;
    this.error = '';

    // stop here if form is invalid
    if (this.insuranceDetailsForm.invalid) {
      return;
    }
    this.loading = true;
    let saveResponse!: Observable<any>;
    var selectedValues: string[] = [];
    const locale = 'en-US';
    selectedValues = $('#SerialNumberSelCode').val();
    const formData = new FormData();
    formData.append('insuranceId', this.insuranceDetailsId.toString());
    formData.append('serialNo', this.editMode ? this.SerialNumber : selectedValues.join(","));
    formData.append('insuranceStartDate', formatDate($('#InsuranceStartDate .datetimepicker-input').val(), 'yyyy-MM-dd', locale));
    formData.append('insuranceEndDate', formatDate($('#InsuranceEndDate .datetimepicker-input').val(), 'yyyy-MM-dd', locale));
    formData.append('insuranceValue', this.insuranceDetailsFormControls.InsuranceValue.value);
    formData.append('insuranceName', this.insuranceDetailsFormControls.InsuranceName.value);

    this.insuranceDetailsModel = new InsuranceDetailsModel;
    this.insuranceDetailsModel.insuranceId = this.insuranceDetailsId;
    this.insuranceDetailsModel.serialNo = this.editMode ? this.SerialNumber : selectedValues.join(",");
    this.insuranceDetailsModel.insuranceStartDate = $('#InsuranceStartDate .datetimepicker-input').val();
    this.insuranceDetailsModel.insuranceEndDate = $('#InsuranceEndDate .datetimepicker-input').val();
    this.insuranceDetailsModel.insuranceValue = this.insuranceDetailsFormControls.InsuranceValue.value;
    this.insuranceDetailsModel.insuranceName = this.insuranceDetailsFormControls.InsuranceName.value;



    if (this.fileList != null && this.fileList.length > 0) {
      let file: File = this.fileList[0];
      formData.append('Document', file, file.name);
    }

    if (this.editMode) {
      saveResponse = this.insuranceDetailsService.editInsuranceDetailsmaster(formData, this.insuranceDetailsId);
    } else {
      saveResponse = this.insuranceDetailsService.addInsuranceDetails(formData);
    }

    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          this.insuranceDetailsModel.insuranceId = result.insuranceId;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.insuranceDetailsService.AddOrEditRecordToCache(this.insuranceDetailsModel, this.editMode);
        this.loading = false;
        this.submitted = false;
        if (this.editMode)
          this.ShowGrid();

      },
      err => {
        this.error = err.error ? err.error : err.message;
        this.loading = false;
      }
    );

    this.insuranceDetailsFormControls.SerialNumberSelCode.setValidators([Validators.required]);
    this.insuranceDetailsFormControls.SerialNumberSelCode.updateValueAndValidity();
  }

}

