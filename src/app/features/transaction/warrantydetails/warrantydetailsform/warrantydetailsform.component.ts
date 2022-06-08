import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetCategoryMasterService } from '../../../../core/service/assetcategorymaster.service';
import { AssetRegisterService } from '../../../../core/service/assetregister.service';
import { AssetSubCategoryMasterService } from '../../../../core/service/assetsubcategorymaster.service';
import { DownloadService } from '../../../../core/service/download.service';
import { ProductMasterService } from '../../../../core/service/productmaster.service';
import { WarrantyDetailsService } from '../../../../core/service/warrantydetails.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { AssetCategoryMasterModel } from '../../../../shared/model/AssetCategoryMasterModel';
import { AssetRegisterModel } from '../../../../shared/model/AssetRegisterModel';
import { AssetSubCategoryMasterModel } from '../../../../shared/model/AssetSubCategoryMasterModel';
import { ProductMasterModel } from '../../../../shared/model/ProductMasterModel';
import { WarrantyDetailsModel } from '../../../../shared/model/WarrantyDetailsModel';
import { Observable } from 'rxjs';
import { TransferLine } from 'src/app/shared/model/TransferLine';
declare var $: any;

@Component({
  selector: 'org-fat-warrantydetailsform',
  templateUrl: './warrantydetailsform.component.html',
  styleUrls: ['./warrantydetailsform.component.scss']
})
export class WarrantydetailsformComponent implements OnInit {
  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef;
  warrantyDetailsForm: FormGroup;
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
  warrantyDetailsModel: WarrantyDetailsModel = new WarrantyDetailsModel;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  serialNumberCodes!: AssetRegisterModel[];
  serialNumberCodesSerachHolderCodes!: AssetRegisterModel[];
  warrantyDetailsId: number = 0;
  fileList!: FileList;
  SerialNumber!: string;
  warrantyDetailsData!: WarrantyDetailsModel;
  isSelectedSerialNumber!: boolean;
  warrantyFileName!: string;
  productCodesSearchHolder!: ProductMasterModel[];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private assetCategoryMasterService: AssetCategoryMasterService,
    private assetSubCategoryMasterService: AssetSubCategoryMasterService,
    private saveAlert: SaveAlert,
    private productMasterService: ProductMasterService,
    private warrantyDetailsService: WarrantyDetailsService,
    private assetRegisterService: AssetRegisterService,
    private downloadService: DownloadService) {

    this.warrantyDetailsForm = this.formBuilder.group({
      assetCategorySelCode: [null],
      assetSubCategorySelCode: [null],
      AssetSelCode: [null],
      WarrantyStartDate: [null],
      WarrantyValue: [null, Validators.required],
      WarrantyEndDate: [null],
      SerialNumberSelCode: [null],
      fileInput: [null]
    });
  }

  async ngOnInit() {
    const today = new Date();
    const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    $('.select2bs4').select2();

    $('#WarrantyStartDate').datetimepicker({
      format: 'L'
    });

    $('#WarrantyEndDate').datetimepicker({
      format: 'L'
    });

    //Bootstrap Duallistbox
    $('.duallistbox').bootstrapDualListbox();


    $('[name="assetCategorySelCode"]').on("change", () => {
      this.warrantyDetailsFormControls.assetCategorySelCode.setValue($('[name="assetCategorySelCode"]').val());
      this.subCategoryCodes = this.subCategoryCodesSearchHolder.filter(item => item.assetCategoryId == $('[name="assetCategorySelCode"]').val());
      this.productCodes = this.productCodesSearchHolder.filter(item => item.assetCategoryId == $('[name="assetCategorySelCode"]').val());
      this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.categoryId == $('[name="assetCategorySelCode"]').val());
      if ($('[name="assetCategorySelCode"]').val() > 0)
        this.RebuildDualListBox();
    });

    $('[name="assetSubCategorySelCode"]').on("change", () => {
      this.warrantyDetailsFormControls.assetSubCategorySelCode.setValue($('[name="assetSubCategorySelCode"]').val());
      this.productCodes = this.productCodesSearchHolder.filter(item => item.assetSubCategoryId == $('[name="assetSubCategorySelCode"]').val());
      this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.subCategoryId == $('[name="assetSubCategorySelCode"]').val());
      if ($('[name="assetSubCategorySelCode"]').val() > 0)
        this.RebuildDualListBox();
    });

    $('[name="AssetSelCode"]').on("change", () => {
      this.warrantyDetailsFormControls.AssetSelCode.setValue($('[name="AssetSelCode"]').val());
      this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.productId == $('[name="AssetSelCode"]').val());
      if ($('[name="AssetSelCode"]').val() > 0)
        this.RebuildDualListBox();
    });

    $("#WarrantyEndDate .datetimepicker-input").val(datepart); // Assign the value
    $("#WarrantyEndDate .datetimepicker-input").trigger("click"); // Trigger click
    $("#WarrantyEndDate .datetimepicker-input").val('');

    $("#WarrantyStartDate .datetimepicker-input").val(datepart); // Assign the value
    $("#WarrantyStartDate .datetimepicker-input").trigger("click"); // Trigger click
    $("#WarrantyStartDate .datetimepicker-input").val('');

    this.categoryCodes = await this.assetCategoryMasterService.getAssetCategoryMaster();
    this.subCategoryCodes = await this.assetSubCategoryMasterService.getAssetSubCategoryMaster();
    this.productCodes = await this.productMasterService.getProductMaster();
    this.subCategoryCodesSearchHolder = this.subCategoryCodes;
    this.serialNumberCodes = await this.assetRegisterService.getAssetRegister();
    this.serialNumberCodesSerachHolderCodes = this.serialNumberCodes;
    this.productCodesSearchHolder = this.productCodes;

    this.RebuildDualListBox();

    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.warrantyDetailsId = +params['id'];
        this.editMode = true;
        this.warrantyDetailsService.getWarrantyDetailsByKey(this.warrantyDetailsId).subscribe(res => {
          this.ShowEditViewWarrantyDetails(res);
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

  get warrantyDetailsFormControls() { return this.warrantyDetailsForm.controls; }

  ShowGrid() {
    this.router.navigateByUrl('/warrantydetails');
  }

  disableControls() {
    $('#WarrantyStartDate .datetimepicker-input').attr('disabled', true);
    $('#WarrantyEndDate .datetimepicker-input').attr('disabled', true);
    this.warrantyDetailsFormControls.WarrantyValue.disable();
    this.fileInput.nativeElement.disabled = true
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {

    this.fileInput.nativeElement.value = '';
    $('#WarrantyStartDate .datetimepicker-input').val('');
    $('#WarrantyEndDate .datetimepicker-input').val('');
    this.warrantyDetailsFormControls.WarrantyValue.setValue('');
    this.warrantyDetailsFormControls.assetCategorySelCode.setValue('');
    this.warrantyDetailsFormControls.AssetSelCode.setValue('');
    this.warrantyDetailsFormControls.assetSubCategorySelCode.setValue('');
    $('[name="assetCategorySelCode"]').select2().trigger('change');
    $('[name="AssetSelCode"]').select2().trigger('change');
    $('[name="assetSubCategorySelCode"]').select2().trigger('change');
    //this.warrantyDetailsForm.reset();
    this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes;
    this.productCodes = this.productCodesSearchHolder;
    this.RebuildDualListBox();

  }

  ShowEditViewWarrantyDetails(data: WarrantyDetailsModel) {
    this.SerialNumber = data.serialNo;
    $('#WarrantyStartDate .datetimepicker-input').val(formatDate(data.warrantyStartDate, 'MM/dd/yyyy', 'en-US'));
    $('#WarrantyEndDate .datetimepicker-input').val(formatDate(data.warrantyEndDate, 'MM/dd/yyyy', 'en-US'));
    this.warrantyDetailsFormControls.WarrantyValue.setValue(data.warrantyCost);
    this.warrantyFileName = data.documentId;
  }

  fileChange(event: any) {
    this.fileList = event.target.files;
  }

  WarrantyFileDownLoad() {
    //this.downloadService.DownloadFile(this.warrantyFileName);
    var docExtension = this.warrantyFileName.substr(this.warrantyFileName.lastIndexOf('.') + 1);
    this.downloadService.DownloadFile(this.warrantyFileName).subscribe((data: any) => {

      var blob = new Blob([data], { type: 'application/' + docExtension });

      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = this.warrantyFileName;
      link.click();

    });
  }

  SaveWarrantyDetails() {
   
    this.isSelectedSerialNumber = $('#SerialNumberSelCode').val().length > 0;
    if (this.isSelectedSerialNumber || this.editMode) {
      this.warrantyDetailsFormControls.SerialNumberSelCode.setValidators(null);
      this.warrantyDetailsFormControls.SerialNumberSelCode.updateValueAndValidity();
    }
    this.submitted = true;
    this.error = '';

    // stop here if form is invalid
    if (this.warrantyDetailsForm.invalid) {
      return;
    }
    this.loading = true;
    let saveResponse!: Observable<any>;
    var selectedValues: string[] = [];
    const locale = 'en-US';
    selectedValues = $('#SerialNumberSelCode').val();
    const formData = new FormData();
    formData.append('warrantyId', this.warrantyDetailsId.toString());
    formData.append('serialNo', this.editMode ? this.SerialNumber : selectedValues.join(","));
    formData.append('warrantyStartDate', formatDate($('#WarrantyStartDate .datetimepicker-input').val(), 'yyyy-MM-dd', locale));
    formData.append('warrantyEndDate', formatDate($('#WarrantyEndDate .datetimepicker-input').val(), 'yyyy-MM-dd', locale));
    formData.append('warrantyCost', this.warrantyDetailsFormControls.WarrantyValue.value);

    this.warrantyDetailsModel = new WarrantyDetailsModel;
    this.warrantyDetailsModel.warrantyId = this.warrantyDetailsId;
    this.warrantyDetailsModel.serialNo = this.editMode ? this.SerialNumber : selectedValues.join(",");
    this.warrantyDetailsModel.warrantyStartDate = $('#WarrantyStartDate .datetimepicker-input').val();
    this.warrantyDetailsModel.warrantyEndDate = $('#WarrantyEndDate .datetimepicker-input').val();
    this.warrantyDetailsModel.warrantyCost = this.warrantyDetailsFormControls.WarrantyValue.value;



    if (this.fileList != null && this.fileList.length > 0) {
      let file: File = this.fileList[0];
      formData.append('Document', file, file.name);
    }

    if (this.editMode) {
      saveResponse = this.warrantyDetailsService.editWarrantyDetailsmaster(formData, this.warrantyDetailsId);
    } else {
      saveResponse = this.warrantyDetailsService.addWarrantyDetails(formData);
    }

    saveResponse.subscribe(
      result => {

        if (!this.editMode) {
          this.warrantyDetailsModel.warrantyId = result.warrantyId;
          this.ClearContents();
        }

        this.saveAlert.SuccessMessage();
        this.warrantyDetailsService.AddOrEditRecordToCache(this.warrantyDetailsModel, this.editMode);
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

    this.warrantyDetailsFormControls.SerialNumberSelCode.setValidators([Validators.required]);
    this.warrantyDetailsFormControls.SerialNumberSelCode.updateValueAndValidity();
  }

}

