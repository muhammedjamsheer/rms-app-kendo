import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierMasterService } from '../../../../core/service/suppliermaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { SupplierMasterModel } from '../../../../shared/model/SupplierMasterModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'org-fat-suppliermasterform',
  templateUrl: './suppliermasterform.component.html',
  styleUrls: ['./suppliermasterform.component.scss']
})
export class SuppliermasterformComponent implements OnInit {
  supplierMasterForm: FormGroup;
  submitted = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  supplierId!: number;
  error = '';
  editMode: boolean = false;
  supplierData!: SupplierMasterModel;
  suppliermastermodel: SupplierMasterModel = new SupplierMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private supplierMasterService: SupplierMasterService,
    private saveAlert: SaveAlert) {
    //const reg = /^(http?|https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    this.supplierMasterForm = this.formBuilder.group({
      SupplierCode: [null, Validators.required],
      SupplierName: [null, Validators.required],
      AddressLine1: [null, Validators.required],
      AddressLine2: [null],
      ContactPerson: [null],
      ContactPersonDesignation: [null],
      ContactNumber: [null],
      Contactemail: [null],
      SupplierWebsite: [null],
      SupplierLocationLatitude: [null],
      SupplierLocationLongitude: [null]

    });
  }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.supplierId = +params['id'];
        this.editMode = true;
        this.supplierData = this.supplierMasterService.getSupplierMasterByKey(this.supplierId) as SupplierMasterModel;
        this.ShowEditViewSupplierMaster(this.supplierData);

        if (params['state'] === 'view') {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
    });
  }

  get supplierMasterFormControls() { return this.supplierMasterForm.controls; }

  ShowGrid() {
    this.router.navigateByUrl('/suppliermaster');
  }

  disableControls() {
    this.supplierMasterFormControls.SupplierCode.disable();
    this.supplierMasterFormControls.SupplierName.disable();
    this.supplierMasterFormControls.AddressLine1.disable();
    this.supplierMasterFormControls.AddressLine2.disable();
    this.supplierMasterFormControls.ContactNumber.disable();
    this.supplierMasterFormControls.Contactemail.disable();
    this.supplierMasterFormControls.ContactPerson.disable();
    this.supplierMasterFormControls.ContactPersonDesignation.disable();
    this.supplierMasterFormControls.SupplierWebsite.disable();
    this.supplierMasterFormControls.SupplierLocationLongitude.disable();
    this.supplierMasterFormControls.SupplierLocationLatitude.disable();
    //this.supplierMasterFormControls.SupplierImage.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.supplierId = 0;
    this.supplierMasterFormControls.SupplierCode.setValue('');
    this.supplierMasterFormControls.SupplierName.setValue('');
    this.supplierMasterFormControls.AddressLine1.setValue('');
    this.supplierMasterFormControls.AddressLine2.setValue('');
    this.supplierMasterFormControls.ContactNumber.setValue('');
    this.supplierMasterFormControls.Contactemail.setValue('');
    this.supplierMasterFormControls.ContactPerson.setValue('');
    this.supplierMasterFormControls.ContactPersonDesignation.setValue('');
    this.supplierMasterFormControls.SupplierWebsite.setValue('');
    this.supplierMasterFormControls.SupplierLocationLatitude.setValue('');
    this.supplierMasterFormControls.SupplierLocationLongitude.setValue('');


  }

  ShowEditViewSupplierMaster(data: SupplierMasterModel) {
    this.supplierMasterFormControls.SupplierCode.setValue(data.supplierCode);
    this.supplierMasterFormControls.SupplierName.setValue(data.supplierName);
    this.supplierMasterFormControls.AddressLine1.setValue(data.addressLine1);
    this.supplierMasterFormControls.AddressLine2.setValue(data.addressLine2);
    this.supplierMasterFormControls.ContactNumber.setValue(data.contactNumber);
    this.supplierMasterFormControls.Contactemail.setValue(data.contactemail);
    this.supplierMasterFormControls.ContactPerson.setValue(data.contactPerson);
    this.supplierMasterFormControls.ContactPersonDesignation.setValue(data.contactPersonDesignation);
    this.supplierMasterFormControls.SupplierWebsite.setValue(data.supplierWebsite);
    this.supplierMasterFormControls.SupplierLocationLatitude.setValue(data.supplierLocationLatitude);
    this.supplierMasterFormControls.SupplierLocationLongitude.setValue(data.supplierLocationLongitude);
    this.supplierMasterFormControls.SupplierCode.disable();
  }

  SaveSupplierMaster() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.supplierMasterForm.invalid) {
      return;
    }
    this.loading = true;
    let saveResponse: Observable<any>;
    this.suppliermastermodel = new SupplierMasterModel;
    this.suppliermastermodel.supplierId = this.supplierId;
    this.suppliermastermodel.supplierCode = this.supplierMasterFormControls.SupplierCode.value;
    this.suppliermastermodel.supplierName = this.supplierMasterFormControls.SupplierName.value;
    this.suppliermastermodel.addressLine1 = this.supplierMasterFormControls.AddressLine1.value;
    this.suppliermastermodel.addressLine2 = this.supplierMasterFormControls.AddressLine2.value;
    this.suppliermastermodel.contactNumber = this.supplierMasterFormControls.ContactNumber.value;
    this.suppliermastermodel.contactemail = this.supplierMasterFormControls.Contactemail.value;
    this.suppliermastermodel.contactPerson = this.supplierMasterFormControls.ContactPerson.value;
    this.suppliermastermodel.contactPersonDesignation = this.supplierMasterFormControls.ContactPersonDesignation.value;
    this.suppliermastermodel.supplierWebsite = this.supplierMasterFormControls.SupplierWebsite.value;
    this.suppliermastermodel.supplierLocationLatitude = this.supplierMasterFormControls.SupplierLocationLatitude.value;
    this.suppliermastermodel.supplierLocationLongitude = this.supplierMasterFormControls.SupplierLocationLongitude.value;


    if (this.editMode) {
      saveResponse = this.supplierMasterService.editSuppliermaster(this.suppliermastermodel);
    } else {
      saveResponse = this.supplierMasterService.addSuppliermaster(this.suppliermastermodel);
    }


    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          this.suppliermastermodel.supplierId = result.supplierId;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.supplierMasterService.AddOrEditRecordToCache(this.suppliermastermodel, this.editMode);
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

