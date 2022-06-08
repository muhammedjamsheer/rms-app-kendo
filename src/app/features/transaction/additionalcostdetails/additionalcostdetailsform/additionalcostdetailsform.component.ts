import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdditionalCostDetailsService } from '../../../../core/service/additionalcostdetails.service';
import { AssetCategoryMasterService } from '../../../../core/service/assetcategorymaster.service';
import { AssetRegisterService } from '../../../../core/service/assetregister.service';
import { AssetSubCategoryMasterService } from '../../../../core/service/assetsubcategorymaster.service';
import { ProductMasterService } from '../../../../core/service/productmaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { AdditionalCostDetailsModel } from '../../../../shared/model/AdditionalCostDetailsModel';
import { AssetCategoryMasterModel } from '../../../../shared/model/AssetCategoryMasterModel';
import { AssetRegisterModel } from '../../../../shared/model/AssetRegisterModel';
import { AssetSubCategoryMasterModel } from '../../../../shared/model/AssetSubCategoryMasterModel';
import { ProductMasterModel } from '../../../../shared/model/ProductMasterModel';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'org-fat-additionalcostdetailsform',
  templateUrl: './additionalcostdetailsform.component.html',
  styleUrls: ['./additionalcostdetailsform.component.scss']
})
export class AdditionalcostdetailsformComponent implements OnInit {
  additionalCostDetailsForm: FormGroup;
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
  additionalCostDetailsModel: AdditionalCostDetailsModel = new AdditionalCostDetailsModel;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  serialNumberCodes!: AssetRegisterModel[];
  serialNumberCodesSerachHolderCodes!: AssetRegisterModel[];
  additionalCostDetailsData!: AdditionalCostDetailsModel;
  SerialNumber!: string;
  additionalCostId!: number;
  productCodesSearchHolder!: ProductMasterModel[];


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private assetCategoryMasterService: AssetCategoryMasterService,
    private assetSubCategoryMasterService: AssetSubCategoryMasterService,
    private saveAlert: SaveAlert,
    private productMasterService: ProductMasterService,
    private additionalCostDetailsService: AdditionalCostDetailsService,
    private assetRegisterService: AssetRegisterService) {

    this.additionalCostDetailsForm = this.formBuilder.group({
      assetCategorySelCode: [null],
      assetSubCategorySelCode: [null],
      AssetSelCode: [null],
      ItemDescription: [null, Validators.required],
      Quantity: [null, Validators.required],
      DateBought: [null],
      Price: [null, Validators.required],
      serialNumberSelCode: [null, Validators.required]
    });
  }

  async ngOnInit() {
    const today = new Date();
    const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();

    $('.select2bs4').select2();

    $('#DateBought').datetimepicker({
      format: 'L'
    });
    $('[name="assetCategorySelCode"]').on("change", () => {
      this.additionalCostDetailsFormControls.assetCategorySelCode.setValue($('[name="assetCategorySelCode"]').val());
      this.subCategoryCodes = this.subCategoryCodesSearchHolder.filter(item => item.assetCategoryId == $('[name="assetCategorySelCode"]').val());
      this.productCodes = this.productCodesSearchHolder.filter(item => item.assetCategoryId == $('[name="assetCategorySelCode"]').val());
      this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.categoryId == $('[name="assetCategorySelCode"]').val());

    });

    $('[name="assetSubCategorySelCode"]').on("change", () => {
      this.additionalCostDetailsFormControls.assetSubCategorySelCode.setValue($('[name="assetSubCategorySelCode"]').val());
      this.productCodes = this.productCodesSearchHolder.filter(item => item.assetSubCategoryId == $('[name="assetCategorySelCode"]').val());
      this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.subCategoryId == $('[name="assetSubCategorySelCode"]').val());

    });


    $('[name="AssetSelCode"]').on("change", () => {
      this.additionalCostDetailsFormControls.AssetSelCode.setValue($('[name="AssetSelCode"]').val());
      this.serialNumberCodes = this.serialNumberCodesSerachHolderCodes.filter(item => item.productId == $('[name="AssetSelCode"]').val());
    });

    $('[name="serialNumberSelCode"]').on("change", () => {
      this.additionalCostDetailsFormControls.serialNumberSelCode.setValue($('[name="serialNumberSelCode"]').val());
    });

    $("#DateBought .datetimepicker-input").val(datepart); // Assign the value
    $("#DateBought .datetimepicker-input").trigger("click"); // Trigger click
    $("#DateBought .datetimepicker-input").val('');

    this.categoryCodes = await this.assetCategoryMasterService.getAssetCategoryMaster();
    this.subCategoryCodes = await this.assetSubCategoryMasterService.getAssetSubCategoryMaster();
    this.productCodes = await this.productMasterService.getProductMaster();
    this.subCategoryCodesSearchHolder = this.subCategoryCodes;
    this.serialNumberCodes = await this.assetRegisterService.getAssetRegister();
    this.serialNumberCodesSerachHolderCodes = this.serialNumberCodes;
    this.productCodesSearchHolder = this.productCodes;

    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.additionalCostId = +params['id'];
        this.editMode = true;
        this.additionalCostDetailsData = this.additionalCostDetailsService.getAdditionalCostDetailsByKey(this.additionalCostId) as AdditionalCostDetailsModel;
        this.ShowEditViewAdditionalCostDetails(this.additionalCostDetailsData);

        if (params['state'] === 'view') {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
    });
  }

  get additionalCostDetailsFormControls() { return this.additionalCostDetailsForm.controls; }

  ShowGrid() {
    this.router.navigateByUrl('/additionalcostdetails');
  }

  disableControls() {
    this.additionalCostDetailsFormControls.ItemDescription.disable();
    this.additionalCostDetailsFormControls.Quantity.disable();
    $('#DateBought .datetimepicker-input').attr('disabled', true);
    this.additionalCostDetailsFormControls.Price.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.additionalCostDetailsFormControls.ItemDescription.setValue('');
    this.additionalCostDetailsFormControls.Quantity.setValue('');
    $('#DateBought .datetimepicker-input').val('');
    this.additionalCostDetailsFormControls.Price.setValue('');
    this.additionalCostDetailsFormControls.assetCategorySelCode.setValue('');
    this.additionalCostDetailsFormControls.AssetSelCode.setValue('');
    this.additionalCostDetailsFormControls.assetSubCategorySelCode.setValue('');
    this.additionalCostDetailsFormControls.serialNumberSelCode.setValue('');
    this.productCodes = this.productCodesSearchHolder;
    $('select').select2().trigger('change');
  }

  ShowEditViewAdditionalCostDetails(data: AdditionalCostDetailsModel) {
    this.SerialNumber = data.serialNo;
    $('#DateBought .datetimepicker-input').val(data.dateBought ? formatDate(data.dateBought, 'MM/dd/yyyy', 'en-US') : '');
    this.additionalCostDetailsFormControls.ItemDescription.setValue(data.description);
    this.additionalCostDetailsFormControls.Quantity.setValue(data.quantity);
    this.additionalCostDetailsFormControls.Price.setValue(data.amount);

    this.additionalCostDetailsFormControls.serialNumberSelCode.setValidators(null);
    this.additionalCostDetailsFormControls.serialNumberSelCode.updateValueAndValidity();
  }

  SaveAdditionalCostDetails() {
    this.submitted = true;
    this.error = '';
    // stop here if form is invalid
    if (this.additionalCostDetailsForm.invalid) {
      return;
    }
    this.loading = true;
    let saveResponse: Observable<any>;
    this.additionalCostDetailsModel = new AdditionalCostDetailsModel;
    this.additionalCostDetailsModel.assetAdditionId = this.additionalCostId;
    this.additionalCostDetailsModel.serialNo = this.editMode ? this.SerialNumber : this.additionalCostDetailsFormControls.serialNumberSelCode.value;
    this.additionalCostDetailsModel.description = this.additionalCostDetailsFormControls.ItemDescription.value;
    this.additionalCostDetailsModel.dateBought = $('#DateBought .datetimepicker-input').val();
    this.additionalCostDetailsModel.quantity = this.additionalCostDetailsFormControls.Quantity.value;
    this.additionalCostDetailsModel.amount = this.additionalCostDetailsFormControls.Price.value;
    if (this.editMode) {
      saveResponse = this.additionalCostDetailsService.editAdditionalCostDetailsmaster(this.additionalCostDetailsModel);
    } else {
      saveResponse = this.additionalCostDetailsService.addAdditionalCostDetails(this.additionalCostDetailsModel);
    }


    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          this.additionalCostDetailsModel.assetAdditionId = result.assetAdditionId;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.additionalCostDetailsService.AddOrEditRecordToCache(this.additionalCostDetailsModel, this.editMode);
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

