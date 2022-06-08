import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandmasterService } from '../../../../core/service/brandmaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { BrandMasterModel } from '../../../../shared/model/BrandMasterModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'org-fat-brandmasterform',
  templateUrl: './brandmasterform.component.html',
  styleUrls: ['./brandmasterform.component.scss']
})
export class BrandmasterformComponent implements OnInit {
  brandmasterform: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  brandId!: number;
  error = '';
  editMode: boolean = false;
  brandData!: BrandMasterModel;
  brandmastermodel: BrandMasterModel = new BrandMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private brandmasterservice: BrandmasterService,
    private saveAlert: SaveAlert) {
    this.brandmasterform = this.formBuilder.group({
      BrandCode: [null, Validators.required],
      BrandName: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.brandId = +params['id'];
        this.editMode = true;
        this.brandData = this.brandmasterservice.getBrandMasterByKey(this.brandId) as BrandMasterModel;
        this.ShowEditViewBrandMaster(this.brandData);

        if (params['state'] === 'view') {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
    });
  }

  get brandmasterFormControls() { return this.brandmasterform.controls; }

  ShowGrid() {
    this.router.navigateByUrl('/brandmaster');
  }

  disableControls() {
    this.brandmasterFormControls.BrandCode.disable();
    this.brandmasterFormControls.BrandName.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.brandId = 0;
    this.brandmasterFormControls.BrandCode.setValue('');
    this.brandmasterFormControls.BrandName.setValue('');
  }

  ShowEditViewBrandMaster(data: BrandMasterModel) {
    this.brandmasterFormControls.BrandCode.setValue(data.brandCode);
    this.brandmasterFormControls.BrandName.setValue(data.brandName);
    this.brandmasterFormControls.BrandCode.disable();
  }

  SaveBrandMaster() {
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
    if (this.brandmasterform.invalid) {
      return;
    }
    this.loading = true;
    this.brandmastermodel = new BrandMasterModel;
    this.brandmastermodel.brandID = this.brandId;
    this.brandmastermodel.brandCode = this.brandmasterFormControls.BrandCode.value;
    this.brandmastermodel.brandName = this.brandmasterFormControls.BrandName.value;

    if (this.editMode) {
      saveResponse = this.brandmasterservice.editBrandmaster(this.brandmastermodel);
    } else {
      saveResponse = this.brandmasterservice.addBrandmaster(this.brandmastermodel);
    }


    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          this.brandmastermodel.brandID = result.brandID;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.brandmasterservice.AddOrEditRecordToCache(this.brandmastermodel, this.editMode);
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

