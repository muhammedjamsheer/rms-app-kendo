import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BrandmasterService } from '../../../../core/service/brandmaster.service';
import { BrandmodelmasterService } from '../../../../core/service/brandmodelmaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { BrandMasterModel } from '../../../../shared/model/BrandMasterModel';
import { BrandModelMasterModel } from '../../../../shared/model/BrandModelMasterModel';
declare var $: any;

@Component({
  selector: 'org-fat-brandmodelmasterform',
  templateUrl: './brandmodelmasterform.component.html',
  styleUrls: ['./brandmodelmasterform.component.scss']
})
export class BrandmodelmasterformComponent implements OnInit {
  brandmodelmasterform: FormGroup;
  submitted = false;
  brandcodes: BrandMasterModel[] = [];
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  modelId!: number;
  error = '';
  editMode: boolean = false;
  brandmodelData!: BrandModelMasterModel;
  brandmodelmastermodel: BrandModelMasterModel = new BrandModelMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private brandmodelmasterService: BrandmodelmasterService,
    private brandmasterService: BrandmasterService,
    private saveAlert: SaveAlert) {
    this.brandmodelmasterform = this.formBuilder.group({
      brandSelCode: [null, Validators.required],
      ModelCode: [null, Validators.required],
      ModelName: [null, Validators.required]
    });
  }

  async ngOnInit() {

    $('.select2bs4').select2();
    $('[name="brandSelCode"]').on("change", () => {
      this.brandmodelmasterFormControls.brandSelCode.setValue($('[name="brandSelCode"]').val());
    });

    this.brandcodes = await this.brandmasterService.getBrandMaster();
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.modelId = +params['id'];
        this.editMode = true;
        this.brandmodelData = this.brandmodelmasterService.getBrandmodelMasterByKey(this.modelId) as BrandModelMasterModel;
        this.ShowEditViewBuildingMaster(this.brandmodelData);

        if (params['state'] === 'view') {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
    });
  }

  get brandmodelmasterFormControls() { return this.brandmodelmasterform.controls; }

  ShowGrid() {
    this.router.navigateByUrl('/modelmaster');
  }

  disableControls() {
    this.brandmodelmasterFormControls.brandSelCode.disable();
    this.brandmodelmasterFormControls.ModelCode.disable();
    this.brandmodelmasterFormControls.ModelName.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.modelId = 0;
    this.brandmodelmasterFormControls.brandSelCode.setValue('');
    this.brandmodelmasterFormControls.ModelCode.setValue('');
    this.brandmodelmasterFormControls.ModelName.setValue('');
    $('select').select2().trigger('change');
  }

  ShowEditViewBuildingMaster(data: BrandModelMasterModel) {
    this.brandmodelmasterFormControls.brandSelCode.setValue(data.brandID);
    this.brandmodelmasterFormControls.ModelCode.setValue(data.modelCode);
    this.brandmodelmasterFormControls.ModelName.setValue(data.modelName);
    this.brandmodelmasterFormControls.ModelCode.disable();
  }

  SaveBuildingMaster() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.brandmodelmasterform.invalid) {
      return;
    }
    this.loading = true;
    let saveResponse: Observable<any>;
    this.brandmodelmastermodel = new BrandModelMasterModel;
    this.brandmodelmastermodel.brandID = this.brandmodelmasterFormControls.brandSelCode.value;
    this.brandmodelmastermodel.modelID = this.modelId;
    this.brandmodelmastermodel.modelCode = this.brandmodelmasterFormControls.ModelCode.value;
    this.brandmodelmastermodel.modelName = this.brandmodelmasterFormControls.ModelName.value;
    const currentCategory = this.brandcodes.filter(item => item.brandID == this.brandmodelmastermodel.brandID)[0];
    this.brandmodelmastermodel.brandCode = currentCategory.brandCode;
    this.brandmodelmastermodel.brandName = currentCategory.brandName;

    if (this.editMode) {
      saveResponse = this.brandmodelmasterService.editBrandmodelmaster(this.brandmodelmastermodel);
    } else {
      saveResponse = this.brandmodelmasterService.addBrandmodelmaster(this.brandmodelmastermodel);
    }


    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          this.brandmodelmastermodel.modelID = result.modelID;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.brandmodelmasterService.AddOrEditRecordToCache(this.brandmodelmastermodel, this.editMode);
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
