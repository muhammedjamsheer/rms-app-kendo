import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetCategoryMasterService } from '../../../../core/service/assetcategorymaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { AssetCategoryMasterModel } from '../../../../shared/model/AssetCategoryMasterModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'org-fat-assetcategorymasterform',
  templateUrl: './assetcategorymasterform.component.html',
  styleUrls: ['./assetcategorymasterform.component.scss']
})
export class AssetcategorymasterformComponent implements OnInit {  
  submitted: boolean = false;
  loading = false;
  editMode: boolean = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  error = '';
  assetCategoryMasterForm: FormGroup;
  assetCategoryId!: number;
  assetCategoryData!: AssetCategoryMasterModel;  

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private assetCategoryMasterService: AssetCategoryMasterService,
    private saveAlert: SaveAlert) {

    this.assetCategoryMasterForm = this.formBuilder.group({
      assetCategoryCode: [null, Validators.required],
      assetCategoryName: [null, Validators.required],
      assetCategoryShortCode: [null],
      categoryDepreciationPeriod: [null, Validators.required],
      categoryDepreciationPercent: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.assetCategoryId = +params['id'];
        this.editMode = true;
        this.assetCategoryData = this.assetCategoryMasterService.getAssetCategoryMasterByKey(this.assetCategoryId) as AssetCategoryMasterModel;

        this.setValuesToControls(this.assetCategoryData);

        if (params['state'] === 'view') {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
    });
  }

  get assetCategoryMasterFormControls() { return this.assetCategoryMasterForm.controls; }

  ShowGrid() {
    this.router.navigateByUrl('/assetcategory');
  }

  disableControls() {
    this.assetCategoryMasterForm.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.assetCategoryId = 0;
    this.assetCategoryMasterForm.reset();    
  }

  setValuesToControls(data: AssetCategoryMasterModel) {    
    this.assetCategoryMasterForm.setValue({
      assetCategoryCode: data.assetCategoryCode, 
      assetCategoryShortCode: data.assetCategoryShortCode, 
      assetCategoryName: data.assetCategoryName, 
      categoryDepreciationPeriod: data.categoryDepreciationPeriod,
      categoryDepreciationPercent: data.categoryDepreciationPercent,
    });

    this.assetCategoryMasterFormControls.assetCategoryCode.disable();
  }

  SaveAassetCategoryMaster() {
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
    if (this.assetCategoryMasterForm.invalid) {
      return;
    }

    this.loading = true;
    
    let dataModel = new AssetCategoryMasterModel;    
    dataModel = this.assetCategoryMasterForm.value;
    dataModel.assetCategoryId = this.assetCategoryId;
    dataModel.assetCategoryCode = this.assetCategoryMasterFormControls.assetCategoryCode.value;

    if (this.editMode) {
      saveResponse = this.assetCategoryMasterService.editAssetCategorymaster(dataModel);
    } else {
      saveResponse = this.assetCategoryMasterService.addAssetCategorymaster(dataModel);
    }

    saveResponse.subscribe(
      result => {
        this.submitted = false;
        this.loading = false;
        this.saveAlert.SuccessMessage();
        if (!this.editMode) {          
          this.ClearContents();
        }
        else{
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