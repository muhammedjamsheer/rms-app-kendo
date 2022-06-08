import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildingmasterService } from '../../../../../core/service/buildingmaster.service';
import { SitemasterService } from '../../../../../core/service/sitemaster.service';
import { SaveAlert } from '../../../../../shared/commonalerts/savealert';
import { BuildingMasterModel } from '../../../../../shared/model/BuildingMasterModel';
import { SiteMasterModel } from '../../../../../shared/model/sitemastermodel';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'org-fat-buildingmasterform',
  templateUrl: './buildingmasterform.component.html',
  styleUrls: ['./buildingmasterform.component.scss']
})
export class BuildingmasterformComponent implements OnInit {
  buildingmasterform: FormGroup;
  submitted = false;
  sitecodes: SiteMasterModel[] = [];
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  buildingId!: number;
  error = '';
  editMode: boolean = false;
  buildingData!: BuildingMasterModel;
  buildingmastermodel: BuildingMasterModel = new BuildingMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private buildingmasterservice: BuildingmasterService,
    private sitemasterService: SitemasterService,
    private saveAlert: SaveAlert) {
    this.buildingmasterform = this.formBuilder.group({
      siteSelCode: [null, Validators.required],
      BuildingCode: [null, Validators.required],
      BuildingName: [null, Validators.required]
    });
  }

  async ngOnInit() {

    //Initialize Select2 Elements
    //$('.select2').select2();

    //  //Initialize Select2 Elements
    $('.select2bs4').select2();//{
    //  theme: 'bootstrap4'
    //}
    $('[name="siteSelCode"]').on("change", () => {
      this.buildingmasterFormControls.siteSelCode.setValue($('[name="siteSelCode"]').val());
    });

    this.sitecodes = await this.sitemasterService.getSiteMaster();
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.buildingId = +params['id'];
        this.editMode = true;
        this.buildingData = this.buildingmasterservice.getBuildingMasterByKey(this.buildingId) as BuildingMasterModel;
        this.ShowEditViewBuildingMaster(this.buildingData);

        if (params['state'] === 'view') {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
    });
  }

  get buildingmasterFormControls() { return this.buildingmasterform.controls; }

  ShowGrid() {
    this.router.navigateByUrl('/buildingmaster');
  }

  disableControls() {
    this.buildingmasterFormControls.siteSelCode.disable();
    this.buildingmasterFormControls.BuildingCode.disable();
    this.buildingmasterFormControls.BuildingName.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.buildingId = 0;
    this.buildingmasterFormControls.siteSelCode.setValue('');
    this.buildingmasterFormControls.BuildingCode.setValue('');
    this.buildingmasterFormControls.BuildingName.setValue('');
    $('select').select2().trigger('change');
  }

  ShowEditViewBuildingMaster(data: BuildingMasterModel) {
    this.buildingmasterFormControls.siteSelCode.setValue(data.siteID);
    this.buildingmasterFormControls.BuildingCode.setValue(data.buildingCode);
    this.buildingmasterFormControls.BuildingName.setValue(data.buildingName);
    this.buildingmasterFormControls.BuildingCode.disable();
  }

  SaveBuildingMaster() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.buildingmasterform.invalid) {
      return;
    }
    this.loading = true;
    let saveResponse: Observable<any>;
    this.buildingmastermodel = new BuildingMasterModel;
    this.buildingmastermodel.siteID = this.buildingmasterFormControls.siteSelCode.value;
    this.buildingmastermodel.buildingID = this.buildingId;
    this.buildingmastermodel.buildingCode = this.buildingmasterFormControls.BuildingCode.value;
    this.buildingmastermodel.buildingName = this.buildingmasterFormControls.BuildingName.value;
    const currentSite = this.sitecodes.filter(item => item.siteID == this.buildingmastermodel.siteID)[0];
    this.buildingmastermodel.siteCode = currentSite.siteCode;
    this.buildingmastermodel.siteName = currentSite.siteName;

    if (this.editMode) {
      saveResponse = this.buildingmasterservice.editBuildingmaster(this.buildingmastermodel);
    } else {
      saveResponse = this.buildingmasterservice.addBuildingmaster(this.buildingmastermodel);
    }


    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          this.buildingmastermodel.buildingID = result.buildingID;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.buildingmasterservice.AddOrEditRecordToCache(this.buildingmastermodel, this.editMode);
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
