import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildingmasterService } from '../../../../../core/service/buildingmaster.service';
import { FloormasterService } from '../../../../../core/service/floormaster.service';
import { SitemasterService } from '../../../../../core/service/sitemaster.service';
import { SaveAlert } from '../../../../../shared/commonalerts/savealert';
import { BuildingMasterModel } from '../../../../../shared/model/BuildingMasterModel';
import { FloorMasterModel } from '../../../../../shared/model/FloorMasterModel';
import { SiteMasterModel } from '../../../../../shared/model/sitemastermodel';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'org-fat-floormasterform',
  templateUrl: './floormasterform.component.html',
  styleUrls: ['./floormasterform.component.scss']
})
export class FloormasterformComponent implements OnInit {
  floormasterform: FormGroup;
  submitted = false;
  buildingcodes: BuildingMasterModel[] = [];
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  floorId!: number;
  error = '';
  editMode: boolean = false;
  floorData!: FloorMasterModel;
  floormastermodel: FloorMasterModel = new FloorMasterModel;
  sitecodes: SiteMasterModel[] = [];
  buildingCodesSearchHolder: BuildingMasterModel[] = [];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private floormasterservice: FloormasterService,
    private buildingmasterService: BuildingmasterService,
    private sitemasterService: SitemasterService,
    private saveAlert: SaveAlert) {
    this.floormasterform = this.formBuilder.group({
      siteSelCode: [null],
      buildingSelCode: [null, Validators.required],
      FloorCode: [null, Validators.required],
      FloorName: [null, Validators.required]
    });
  }

  async ngOnInit() {

    $('.select2bs4').select2();

    $('[name="buildingSelCode"]').on("change", () => {
      this.floormasterFormControls.buildingSelCode.setValue($('[name="buildingSelCode"]').val());
    });

    $('[name="siteSelCode"]').on("change", () => {
      this.buildingcodes = this.buildingCodesSearchHolder.filter(x => x.siteID == $('[name="siteSelCode"]').val());
    });


    this.sitecodes = await this.sitemasterService.getSiteMaster();
    this.buildingcodes = await this.buildingmasterService.getBuildingMaster();
    this.buildingCodesSearchHolder = this.buildingcodes;
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.floorId = +params['id'];
        this.editMode = true;
        this.floorData = this.floormasterservice.getFloorMasterByKey(this.floorId) as FloorMasterModel;
        this.ShowEditViewFloorMaster(this.floorData);

        if (params['state'] === 'view') {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
    });
  }

  get floormasterFormControls() { return this.floormasterform.controls; }

  ShowGrid() {
    this.router.navigateByUrl('/floormaster');
  }

  disableControls() {
    this.floormasterFormControls.siteSelCode.disable();
    this.floormasterFormControls.buildingSelCode.disable();
    this.floormasterFormControls.FloorCode.disable();
    this.floormasterFormControls.FloorName.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.floorId = 0;
    this.floormasterFormControls.siteSelCode.setValue('');
    this.floormasterFormControls.buildingSelCode.setValue('');
    this.floormasterFormControls.FloorCode.setValue('');
    this.floormasterFormControls.FloorName.setValue('');
    $('select').select2().trigger('change');
  }

  ShowEditViewFloorMaster(data: FloorMasterModel) {
    this.floormasterFormControls.siteSelCode.setValue(data.siteID);
    this.floormasterFormControls.buildingSelCode.setValue(data.buildingID);
    this.floormasterFormControls.FloorCode.setValue(data.floorCode);
    this.floormasterFormControls.FloorName.setValue(data.floorName);
    this.floormasterFormControls.FloorCode.disable();
  }

  SaveFloorMaster() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.floormasterform.invalid) {
      return;
    }
    this.loading = true;
    let saveResponse: Observable<any>;
    this.floormastermodel = new FloorMasterModel;
    this.floormastermodel.buildingID = this.floormasterFormControls.buildingSelCode.value;
    this.floormastermodel.floorID = this.floorId;
    this.floormastermodel.floorCode = this.floormasterFormControls.FloorCode.value;
    this.floormastermodel.floorName = this.floormasterFormControls.FloorName.value;
    const currentBuilding = this.buildingcodes.filter(item => item.buildingID == this.floormastermodel.buildingID)[0];
    this.floormastermodel.siteCode = currentBuilding.siteCode;
    this.floormastermodel.siteName = currentBuilding.siteName;
    this.floormastermodel.buildingCode = currentBuilding.buildingCode;
    this.floormastermodel.buildingName = currentBuilding.buildingName;

    if (this.editMode) {
      saveResponse = this.floormasterservice.editFloormaster(this.floormastermodel);
    } else {
      saveResponse = this.floormasterservice.addFloormaster(this.floormastermodel);
    }


    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          this.floormastermodel.floorID = result.floorID;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.floormasterservice.AddOrEditRecordToCache(this.floormastermodel, this.editMode);
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