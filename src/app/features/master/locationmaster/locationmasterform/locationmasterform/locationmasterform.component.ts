import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BuildingmasterService } from '../../../../../core/service/buildingmaster.service';
import { FloormasterService } from '../../../../../core/service/floormaster.service';
import { LocationmasterService } from '../../../../../core/service/locationmaster.service';
import { RoommasterService } from '../../../../../core/service/roommaster.service';
import { SitemasterService } from '../../../../../core/service/sitemaster.service';
import { SaveAlert } from '../../../../../shared/commonalerts/savealert';
import { BuildingMasterModel } from '../../../../../shared/model/BuildingMasterModel';
import { FloorMasterModel } from '../../../../../shared/model/FloorMasterModel';
import { LocationMasterModel } from '../../../../../shared/model/LocationMasterModel';
import { RoomMasterModel } from '../../../../../shared/model/RoomMasterModel';
import { SiteMasterModel } from '../../../../../shared/model/sitemastermodel';
declare var $: any;

@Component({
  selector: 'org-fat-locationmasterform',
  templateUrl: './locationmasterform.component.html',
  styleUrls: ['./locationmasterform.component.scss']
})
export class LocationmasterformComponent implements OnInit {
  locationmasterform: FormGroup;
  submitted = false;
  roomcodes: RoomMasterModel[] = [];
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  locationId!: number;
  error = '';
  editMode: boolean = false;
  locationData!: LocationMasterModel;
  locationmastermodel: LocationMasterModel = new LocationMasterModel;
  sitecodes: SiteMasterModel[] = [];
  buildingCodesSearchHolder: BuildingMasterModel[] = [];
  floorcodesSearchHolder: FloorMasterModel[] = [];
  buildingcodes: BuildingMasterModel[] = [];
  floorcodes: FloorMasterModel[] = [];
  roomcodesSearchHolder: RoomMasterModel[] = [];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private locationmasterservice: LocationmasterService,
    private roommasterService: RoommasterService,
    private floormasterService: FloormasterService,
    private buildingmasterService: BuildingmasterService,
    private sitemasterService: SitemasterService,
    private saveAlert: SaveAlert) {
    this.locationmasterform = this.formBuilder.group({
      siteSelCode: [null],
      buildingSelCode: [null],
      floorSelCode: [null],
      roomSelCode: [null, Validators.required],
      LocationCode: [null, Validators.required],
      LocationName: [null, Validators.required]
    });
  }

  async ngOnInit() {

    $('.select2bs4').select2();

    $('[name="roomSelCode"]').on("change", () => {
      this.locationmasterFormControls.roomSelCode.setValue($('[name="roomSelCode"]').val());
    });

    $('[name="siteSelCode"]').on("change", () => {
      this.buildingcodes = this.buildingCodesSearchHolder.filter(x => x.siteID == $('[name="siteSelCode"]').val());
    });

    $('[name="buildingSelCode"]').on("change", () => {
      this.floorcodes = this.floorcodesSearchHolder.filter(x => x.buildingID == $('[name="buildingSelCode"]').val());
    });

    $('[name="floorSelCode"]').on("change", () => {
      this.roomcodes = this.roomcodesSearchHolder.filter(x => x.floorID == $('[name="floorSelCode"]').val());
    });

    this.sitecodes = await this.sitemasterService.getSiteMaster();
    this.buildingcodes = await this.buildingmasterService.getBuildingMaster();
    this.buildingCodesSearchHolder = this.buildingcodes;

    this.floorcodes = await this.floormasterService.getFloorMaster();
    this.floorcodesSearchHolder = this.floorcodes;

    this.roomcodes = await this.roommasterService.getRoomMaster();
    this.roomcodesSearchHolder = this.roomcodes;
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.locationId = +params['id'];
        this.editMode = true;
        this.locationData = this.locationmasterservice.getLocationMasterByKey(this.locationId) as LocationMasterModel;
        this.ShowEditViewLocationMaster(this.locationData);

        if (params['state'] === 'view') {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
    });
  }

  get locationmasterFormControls() { return this.locationmasterform.controls; }

  ShowGrid() {
    this.router.navigateByUrl('/location');
  }

  disableControls() {
    this.locationmasterFormControls.siteSelCode.disable();
    this.locationmasterFormControls.buildingSelCode.disable();
    this.locationmasterFormControls.floorSelCode.disable();
    this.locationmasterFormControls.roomSelCode.disable();
    this.locationmasterFormControls.LocationCode.disable();
    this.locationmasterFormControls.LocationName.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.locationId = 0;
    this.locationmasterFormControls.siteSelCode.setValue('');
    this.locationmasterFormControls.buildingSelCode.setValue('');
    this.locationmasterFormControls.floorSelCode.setValue('');
    this.locationmasterFormControls.roomSelCode.setValue('');
    this.locationmasterFormControls.LocationCode.setValue('');
    this.locationmasterFormControls.LocationName.setValue('');
    $('select').select2().trigger('change');
  }

  ShowEditViewLocationMaster(data: LocationMasterModel) {
    this.locationmasterFormControls.siteSelCode.setValue(data.siteID);
    this.locationmasterFormControls.buildingSelCode.setValue(data.buildingID);
    this.locationmasterFormControls.floorSelCode.setValue(data.floorID);
    this.locationmasterFormControls.roomSelCode.setValue(data.roomID);
    this.locationmasterFormControls.LocationCode.setValue(data.locationCode);
    this.locationmasterFormControls.LocationName.setValue(data.locationName);
    this.locationmasterFormControls.LocationCode.disable();
  }

  SaveLocationMaster() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.locationmasterform.invalid) {
      return;
    }
    this.loading = true;
    let saveResponse: Observable<any>;
    this.locationmastermodel = new LocationMasterModel;
    this.locationmastermodel.roomID = this.locationmasterFormControls.roomSelCode.value;
    this.locationmastermodel.locationID = this.locationId;
    this.locationmastermodel.locationCode = this.locationmasterFormControls.LocationCode.value;
    this.locationmastermodel.locationName = this.locationmasterFormControls.LocationName.value;
    const currentFloor = this.roomcodes.filter(item => item.roomID == this.locationmastermodel.roomID)[0];
    this.locationmastermodel.floorCode = currentFloor.floorCode;
    this.locationmastermodel.floorName = currentFloor.floorName;
    this.locationmastermodel.buildingCode = currentFloor.buildingCode;
    this.locationmastermodel.buildingName = currentFloor.buildingName;
    this.locationmastermodel.siteCode = currentFloor.siteCode;
    this.locationmastermodel.siteName = currentFloor.siteName;
    this.locationmastermodel.roomCode = currentFloor.roomCode;
    this.locationmastermodel.roomName = currentFloor.roomName;

    if (this.editMode) {
      saveResponse = this.locationmasterservice.editLocationmaster(this.locationmastermodel);
    } else {
      saveResponse = this.locationmasterservice.addLocationmaster(this.locationmastermodel);
    }


    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          this.locationmastermodel.locationID = result.locationID;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();

        this.locationmasterservice.AddOrEditRecordToCache(this.locationmastermodel, this.editMode);
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