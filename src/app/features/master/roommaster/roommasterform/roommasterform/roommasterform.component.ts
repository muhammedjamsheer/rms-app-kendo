import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildingmasterService } from '../../../../../core/service/buildingmaster.service';
import { FloormasterService } from '../../../../../core/service/floormaster.service';
import { RoommasterService } from '../../../../../core/service/roommaster.service';
import { SitemasterService } from '../../../../../core/service/sitemaster.service';
import { SaveAlert } from '../../../../../shared/commonalerts/savealert';
import { BuildingMasterModel } from '../../../../../shared/model/BuildingMasterModel';
import { FloorMasterModel } from '../../../../../shared/model/FloorMasterModel';
import { RoomMasterModel } from '../../../../../shared/model/RoomMasterModel';
import { SiteMasterModel } from '../../../../../shared/model/sitemastermodel';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'org-fat-roommasterform',
  templateUrl: './roommasterform.component.html',
  styleUrls: ['./roommasterform.component.scss']
})
export class RoommasterformComponent implements OnInit {
  roommasterform: FormGroup;
  submitted = false;
  floorcodes: FloorMasterModel[] = [];
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  roomId!: number;
  error = '';
  editMode: boolean = false;
  roomData!: RoomMasterModel;
  roommastermodel: RoomMasterModel = new RoomMasterModel;
  sitecodes: SiteMasterModel[] = [];
  buildingCodesSearchHolder: BuildingMasterModel[] = [];
  floorcodesSearchHolder: FloorMasterModel[] = [];
  buildingcodes: BuildingMasterModel[] = [];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private roommasterservice: RoommasterService,
    private floormasterService: FloormasterService,
    private buildingmasterService: BuildingmasterService,
    private sitemasterService: SitemasterService,
    private saveAlert: SaveAlert) {
    this.roommasterform = this.formBuilder.group({
      siteSelCode: [null],
      buildingSelCode: [null],
      floorSelCode: [null, Validators.required],
      RoomCode: [null, Validators.required],
      RoomName: [null, Validators.required]
    });
  }

  async ngOnInit() {
    $('.select2bs4').select2();

    $('[name="floorSelCode"]').on("change", () => {
      this.roommasterFormControls.floorSelCode.setValue($('[name="floorSelCode"]').val());
    });

    $('[name="siteSelCode"]').on("change", () => {
      this.buildingcodes = this.buildingCodesSearchHolder.filter(x => x.siteID == $('[name="siteSelCode"]').val());
    });

    $('[name="buildingSelCode"]').on("change", () => {
      this.floorcodes = this.floorcodesSearchHolder.filter(x => x.buildingID == $('[name="buildingSelCode"]').val());
    });

    this.sitecodes = await this.sitemasterService.getSiteMaster();
    this.buildingcodes = await this.buildingmasterService.getBuildingMaster();
    this.buildingCodesSearchHolder = this.buildingcodes;

    this.floorcodes = await this.floormasterService.getFloorMaster();
    this.floorcodesSearchHolder = this.floorcodes;
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.roomId = +params['id'];
        this.editMode = true;
        this.roomData = this.roommasterservice.getRoomMasterByKey(this.roomId) as RoomMasterModel;
        this.ShowEditViewRoomMaster(this.roomData);

        if (params['state'] === 'view') {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
    });
  }

  get roommasterFormControls() { return this.roommasterform.controls; }

  ShowGrid() {
    this.router.navigateByUrl('/roommaster');
  }

  disableControls() {
    this.roommasterFormControls.siteSelCode.disable();
    this.roommasterFormControls.buildingSelCode.disable();
    this.roommasterFormControls.floorSelCode.disable();
    this.roommasterFormControls.RoomCode.disable();
    this.roommasterFormControls.RoomName.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.roomId = 0;
    this.roommasterFormControls.siteSelCode.setValue('');
    this.roommasterFormControls.buildingSelCode.setValue('');
    this.roommasterFormControls.floorSelCode.setValue('');
    this.roommasterFormControls.RoomCode.setValue('');
    this.roommasterFormControls.RoomName.setValue('');
    $('select').select2().trigger('change');
  }

  ShowEditViewRoomMaster(data: RoomMasterModel) {
    this.roommasterFormControls.siteSelCode.setValue(data.siteID);
    this.roommasterFormControls.buildingSelCode.setValue(data.buildingID);
    this.roommasterFormControls.floorSelCode.setValue(data.floorID);
    this.roommasterFormControls.RoomCode.setValue(data.roomCode);
    this.roommasterFormControls.RoomName.setValue(data.roomName);
    this.roommasterFormControls.RoomCode.disable();
  }

  SaveRoomMaster() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.roommasterform.invalid) {
      return;
    }
    this.loading = true;
    let saveResponse: Observable<any>;
    this.roommastermodel = new RoomMasterModel;
    this.roommastermodel.floorID = this.roommasterFormControls.floorSelCode.value;
    this.roommastermodel.roomID = this.roomId;
    this.roommastermodel.roomCode = this.roommasterFormControls.RoomCode.value;
    this.roommastermodel.roomName = this.roommasterFormControls.RoomName.value;
    const currentFloor = this.floorcodes.filter(item => item.floorID == this.roommastermodel.floorID)[0];
    this.roommastermodel.floorCode = currentFloor.floorCode;
    this.roommastermodel.floorName = currentFloor.floorName;
    this.roommastermodel.buildingCode = currentFloor.buildingCode;
    this.roommastermodel.buildingName = currentFloor.buildingName;
    this.roommastermodel.siteCode = currentFloor.siteCode;
    this.roommastermodel.siteName = currentFloor.siteName;

    if (this.editMode) {
      saveResponse = this.roommasterservice.editRoommaster(this.roommastermodel);
    } else {
      saveResponse = this.roommasterservice.addRoommaster(this.roommastermodel);
    }


    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          this.roommastermodel.roomID = result.roomID;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();

        this.roommasterservice.AddOrEditRecordToCache(this.roommastermodel, this.editMode);
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