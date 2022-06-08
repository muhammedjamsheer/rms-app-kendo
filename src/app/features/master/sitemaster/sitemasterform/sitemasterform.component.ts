import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SitemasterService } from '../../../../core/service/sitemaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { SiteMasterModel } from '../../../../shared/model/sitemastermodel';

@Component({
  selector: 'org-fat-sitemasterform',
  templateUrl: './sitemasterform.component.html',
  styleUrls: ['./sitemasterform.component.scss']
})
export class SitemasterformComponent implements OnInit {
  sitemasterform: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  siteId!: number;
  error = '';
  editMode: boolean = false;
  siteData!: SiteMasterModel;
  //sitemastermodel: SiteMasterModel = new SiteMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private sitemasterservice: SitemasterService,
    private saveAlert: SaveAlert) {
    this.sitemasterform = this.formBuilder.group({
      SiteCode: [null, Validators.required],
      SiteName: [null, Validators.required],
      AddressLine1: [null, Validators.required],
      AddressLine2: [null],
      City: [null]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.siteId = +params['id'];
        this.editMode = true;
        this.siteData = this.sitemasterservice.getSiteMasterByKey(this.siteId) as SiteMasterModel;
        this.ShowEditViewSiteMaster(this.siteData);

        if (params['state'] === 'view') {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
    });
  }

  get sitemasterFormControls() { return this.sitemasterform.controls; }

  ShowGrid() {
    this.router.navigateByUrl('/sitemaster');
  }

  disableControls() {
    this.sitemasterFormControls.SiteCode.disable();
    this.sitemasterFormControls.SiteName.disable();
    this.sitemasterFormControls.AddressLine1.disable();
    this.sitemasterFormControls.AddressLine2.disable();
    this.sitemasterFormControls.City.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.siteId = 0;
    this.sitemasterFormControls.SiteCode.setValue('');
    this.sitemasterFormControls.SiteName.setValue('');
    this.sitemasterFormControls.AddressLine1.setValue('');
    this.sitemasterFormControls.AddressLine2.setValue('');
    this.sitemasterFormControls.City.setValue('');
  }

  ShowEditViewSiteMaster(data: SiteMasterModel) {
    this.sitemasterFormControls.SiteCode.setValue(data.siteCode);
    this.sitemasterFormControls.SiteName.setValue(data.siteName);
    this.sitemasterFormControls.AddressLine1.setValue(data.addressLine1);
    this.sitemasterFormControls.AddressLine2.setValue(data.addressLine2);
    this.sitemasterFormControls.City.setValue(data.city);
    this.sitemasterFormControls.SiteCode.disable();

  }

  SaveSiteMaster() {
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
    if (this.sitemasterform.invalid) {
      return;
    }
    const sitemastermodel = new SiteMasterModel;
    sitemastermodel.siteID = this.siteId;
    sitemastermodel.siteCode = this.sitemasterFormControls.SiteCode.value;
    sitemastermodel.siteName = this.sitemasterFormControls.SiteName.value;
    sitemastermodel.addressLine1 = this.sitemasterFormControls.AddressLine1.value;
    sitemastermodel.addressLine2 = this.sitemasterFormControls.AddressLine2.value;
    sitemastermodel.city = this.sitemasterFormControls.City.value;

    if (this.editMode) {
      saveResponse = this.sitemasterservice.editSitemaster(sitemastermodel);
    } else {
      saveResponse = this.sitemasterservice.addSitemaster(sitemastermodel);
    }


    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          sitemastermodel.siteID = result.siteID;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.sitemasterservice.AddOrEditRecordToCache(sitemastermodel, this.editMode);
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
