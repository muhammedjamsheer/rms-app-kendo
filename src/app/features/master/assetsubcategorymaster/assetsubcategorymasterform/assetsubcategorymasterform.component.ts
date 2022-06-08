import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetCategoryMasterService } from '../../../../core/service/assetcategorymaster.service';
import { AssetSubCategoryMasterService } from '../../../../core/service/assetsubcategorymaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { AssetCategoryMasterModel } from '../../../../shared/model/AssetCategoryMasterModel';
import { AssetSubCategoryMasterModel } from '../../../../shared/model/AssetSubCategoryMasterModel';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'org-fat-assetsubcategorymasterform',
  templateUrl: './assetsubcategorymasterform.component.html',
  styleUrls: ['./assetsubcategorymasterform.component.scss']
})
export class AssetsubcategorymasterformComponent implements OnInit {
  assetSubCategoryMasterForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  assetCategorycodes: AssetCategoryMasterModel[] = [];
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  assetSubCategoryId!: number;
  error = '';
  editMode: boolean = false;
  assetSubCategoryData!: AssetSubCategoryMasterModel;
  assetSubCategoryMasterModel: AssetSubCategoryMasterModel = new AssetSubCategoryMasterModel;
  isChecked=true;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private assetSubCategoryMasterService: AssetSubCategoryMasterService,
    private assetCategoryMasterService: AssetCategoryMasterService,
    private saveAlert: SaveAlert) {
    this.assetSubCategoryMasterForm = this.formBuilder.group({
      assetCategorySelCode: [null, Validators.required],
      AssetSubCategoryCode: [null, Validators.required],
      AssetSubCategoryName: [null, Validators.required],
      AssetSubCategoryShortCode: [null],
      DepreciationPeriod: [null, Validators.required],
      DepreciationPercentage: [null, Validators.required],
      NonTag:[null]
    });
  }

  async ngOnInit() {

    $('.select2bs4').select2();
    $('[name="assetCategorySelCode"]').on("change", () => {
      this.assetSubCategoryMasterFormControls.assetCategorySelCode.setValue($('[name="assetCategorySelCode"]').val());
    });

    $('[name="DepreciationPeriod"]').on("change", () => {
      this.assetSubCategoryMasterFormControls.DepreciationPeriod.setValue($('[name="DepreciationPeriod"]').val());
    });

    this.assetCategorycodes = await this.assetCategoryMasterService.getAssetCategoryMaster();
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.assetSubCategoryId = +params['id'];
        this.editMode = true;
        this.assetSubCategoryData = this.assetSubCategoryMasterService.getAssetSubCategoryMasterByKey(this.assetSubCategoryId) as AssetSubCategoryMasterModel;
        this.ShowEditViewAassetSubCategoryMaster(this.assetSubCategoryData);

        if (params['state'] === 'view') {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
    });
  }

  get assetSubCategoryMasterFormControls() { return this.assetSubCategoryMasterForm.controls; }

  ShowGrid() {
    this.router.navigateByUrl('/assetsubcategory');
  }

  disableControls() {
    this.assetSubCategoryMasterFormControls.assetCategorySelCode.disable();
    this.assetSubCategoryMasterFormControls.AssetSubCategoryCode.disable();
    this.assetSubCategoryMasterFormControls.AssetSubCategoryName.disable();
    this.assetSubCategoryMasterFormControls.AssetSubCategoryShortCode.disable();
    this.assetSubCategoryMasterFormControls.DepreciationPeriod.disable();
    this.assetSubCategoryMasterFormControls.DepreciationPercentage.disable();
    this.assetSubCategoryMasterFormControls.NonTag.disable();

    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.assetSubCategoryId = 0;
    this.assetSubCategoryMasterFormControls.assetCategorySelCode.setValue('');
    this.assetSubCategoryMasterFormControls.AssetSubCategoryCode.setValue('');
    this.assetSubCategoryMasterFormControls.AssetSubCategoryName.setValue('');
    this.assetSubCategoryMasterFormControls.AssetSubCategoryShortCode.setValue('');
    this.assetSubCategoryMasterFormControls.DepreciationPeriod.setValue('');
    this.assetSubCategoryMasterFormControls.DepreciationPercentage.setValue('');
    $('select').select2().trigger('change');
  }

  ShowEditViewAassetSubCategoryMaster(data: AssetSubCategoryMasterModel) {
    this.assetSubCategoryMasterFormControls.assetCategorySelCode.setValue(data.assetCategoryId);
    this.assetSubCategoryMasterFormControls.AssetSubCategoryCode.setValue(data.assetSubCategoryCode);
    this.assetSubCategoryMasterFormControls.AssetSubCategoryName.setValue(data.assetSubCategoryName);
    this.assetSubCategoryMasterFormControls.AssetSubCategoryShortCode.setValue(data.assetSubCategoryShortCode);
    this.assetSubCategoryMasterFormControls.DepreciationPeriod.setValue(data.subCategoryDepreciationPeriod);
    this.assetSubCategoryMasterFormControls.DepreciationPercentage.setValue(data.subCategoryDepreciationPercent);
    this.assetSubCategoryMasterFormControls.NonTag.setValue(data.nonTag);
    this.assetSubCategoryMasterFormControls.AssetSubCategoryCode.disable();
  }

  SaveAssetSubCategoryMaster() {
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
    if (this.assetSubCategoryMasterForm.invalid) {
      return;
    }
    this.loading = true;
    this.assetSubCategoryMasterModel = new AssetSubCategoryMasterModel;
    this.assetSubCategoryMasterModel.assetSubCategoryId = this.assetSubCategoryId;
    this.assetSubCategoryMasterModel.assetCategoryId = this.assetSubCategoryMasterFormControls.assetCategorySelCode.value;
    this.assetSubCategoryMasterModel.assetSubCategoryCode = this.assetSubCategoryMasterFormControls.AssetSubCategoryCode.value;
    this.assetSubCategoryMasterModel.assetSubCategoryName = this.assetSubCategoryMasterFormControls.AssetSubCategoryName.value;
    this.assetSubCategoryMasterModel.assetSubCategoryShortCode = this.assetSubCategoryMasterFormControls.AssetSubCategoryShortCode.value;
    this.assetSubCategoryMasterModel.subCategoryDepreciationPeriod = this.assetSubCategoryMasterFormControls.DepreciationPeriod.value;
    this.assetSubCategoryMasterModel.subCategoryDepreciationPercent = this.assetSubCategoryMasterFormControls.DepreciationPercentage.value;
    this.assetSubCategoryMasterModel.nonTag = this.assetSubCategoryMasterFormControls.NonTag.value==null ? false : this.assetSubCategoryMasterFormControls.NonTag.value;
    const currentCategory = this.assetCategorycodes.filter(item => item.assetCategoryId == this.assetSubCategoryMasterFormControls.assetCategorySelCode.value)[0];
    this.assetSubCategoryMasterModel.assetCategory.assetCategoryCode = currentCategory.assetCategoryCode;
    this.assetSubCategoryMasterModel.assetCategory.assetCategoryName = currentCategory.assetCategoryName;
    this.assetSubCategoryMasterModel.assetCategory.assetCategoryShortCode = currentCategory.assetCategoryShortCode;

    if (this.editMode) {
      saveResponse = this.assetSubCategoryMasterService.editAssetSubCategorymaster(this.assetSubCategoryMasterModel);
    } else {
      saveResponse = this.assetSubCategoryMasterService.addAssetSubCategorymaster(this.assetSubCategoryMasterModel);
    }


    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          this.assetSubCategoryMasterModel.assetSubCategoryId = result.assetSubCategoryId;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.assetSubCategoryMasterService.AddOrEditRecordToCache(this.assetSubCategoryMasterModel, this.editMode);
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

