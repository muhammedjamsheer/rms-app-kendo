import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CustomerMasterService } from '../../../../core/service/customermaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { CustomerMasterModel } from '../../../../shared/model/CustomerMasterModel';

@Component({
  selector: 'org-fat-customermasterform',
  templateUrl: './customermasterform.component.html',
  styleUrls: ['./customermasterform.component.css']
})
export class CustomermasterformComponent implements OnInit {
  customerMasterForm: FormGroup;
  submitted = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  customerId!: number;
  error = '';
  editMode: boolean = false;
  customerData!: CustomerMasterModel;
  customermastermodel: CustomerMasterModel = new CustomerMasterModel;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private customerMasterService: CustomerMasterService,
    private saveAlert: SaveAlert) {
    //const reg = /^(http?|https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    this.customerMasterForm = this.formBuilder.group({
      CustomerCode: [null, Validators.required],
      CustomerName: [null, Validators.required],
      AddressLine1: [null, Validators.required],
      AddressLine2: [null],
      ContactPerson: [null],
      ContactPersonDesignation: [null],
      ContactNumber: [null],
      Contactemail: [null],
      CustomerWebsite: [null],
      CustomerLocationLatitude: [null],
      CustomerLocationLongitude: [null]

    });
  }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.customerId = +params['id'];
        this.editMode = true;
        this.customerData = this.customerMasterService.getCustomerMasterByKey(this.customerId) as CustomerMasterModel;
        this.ShowEditViewCustomerMaster(this.customerData);

        if (params['state'] === 'view') {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
    });
  }

  get customerMasterFormControls() { return this.customerMasterForm.controls; }

  ShowGrid() {
    this.router.navigateByUrl('/customermaster');
  }

  disableControls() {
    this.customerMasterFormControls.CustomerCode.disable();
    this.customerMasterFormControls.CustomerName.disable();
    this.customerMasterFormControls.AddressLine1.disable();
    this.customerMasterFormControls.AddressLine2.disable();
    this.customerMasterFormControls.ContactNumber.disable();
    this.customerMasterFormControls.Contactemail.disable();
    this.customerMasterFormControls.ContactPerson.disable();
    this.customerMasterFormControls.ContactPersonDesignation.disable();
    this.customerMasterFormControls.CustomerWebsite.disable();
    this.customerMasterFormControls.CustomerLocationLongitude.disable();
    this.customerMasterFormControls.CustomerLocationLatitude.disable();
    //this.customerMasterFormControls.CustomerImage.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.customerId = 0;
    this.customerMasterFormControls.CustomerCode.setValue('');
    this.customerMasterFormControls.CustomerName.setValue('');
    this.customerMasterFormControls.AddressLine1.setValue('');
    this.customerMasterFormControls.AddressLine2.setValue('');
    this.customerMasterFormControls.ContactNumber.setValue('');
    this.customerMasterFormControls.Contactemail.setValue('');
    this.customerMasterFormControls.ContactPerson.setValue('');
    this.customerMasterFormControls.ContactPersonDesignation.setValue('');
    this.customerMasterFormControls.CustomerWebsite.setValue('');
    this.customerMasterFormControls.CustomerLocationLatitude.setValue('');
    this.customerMasterFormControls.CustomerLocationLongitude.setValue('');


  }

  ShowEditViewCustomerMaster(data: CustomerMasterModel) {
    this.customerMasterFormControls.CustomerCode.setValue(data.customerCode);
    this.customerMasterFormControls.CustomerName.setValue(data.customerName);
    this.customerMasterFormControls.AddressLine1.setValue(data.addressLine1);
    this.customerMasterFormControls.AddressLine2.setValue(data.addressLine2);
    this.customerMasterFormControls.ContactNumber.setValue(data.contactNumber);
    this.customerMasterFormControls.Contactemail.setValue(data.contactemail);
    this.customerMasterFormControls.ContactPerson.setValue(data.contactPerson);
    this.customerMasterFormControls.ContactPersonDesignation.setValue(data.contactPersonDesignation);
    this.customerMasterFormControls.CustomerWebsite.setValue(data.customerWebsite);
    this.customerMasterFormControls.CustomerLocationLatitude.setValue(data.customerLocationLatitude);
    this.customerMasterFormControls.CustomerLocationLongitude.setValue(data.customerLocationLongitude);
    this.customerMasterFormControls.CustomerCode.disable();
  }

  SaveCustomerMaster() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.customerMasterForm.invalid) {
      return;
    }
    this.loading = true;
    let saveResponse: Observable<any>;
    this.customermastermodel = new CustomerMasterModel;
    this.customermastermodel.customerId = this.customerId;
    this.customermastermodel.customerCode = this.customerMasterFormControls.CustomerCode.value;
    this.customermastermodel.customerName = this.customerMasterFormControls.CustomerName.value;
    this.customermastermodel.addressLine1 = this.customerMasterFormControls.AddressLine1.value;
    this.customermastermodel.addressLine2 = this.customerMasterFormControls.AddressLine2.value;
    this.customermastermodel.contactNumber = this.customerMasterFormControls.ContactNumber.value;
    this.customermastermodel.contactemail = this.customerMasterFormControls.Contactemail.value;
    this.customermastermodel.contactPerson = this.customerMasterFormControls.ContactPerson.value;
    this.customermastermodel.contactPersonDesignation = this.customerMasterFormControls.ContactPersonDesignation.value;
    this.customermastermodel.customerWebsite = this.customerMasterFormControls.CustomerWebsite.value;
    this.customermastermodel.customerLocationLatitude = this.customerMasterFormControls.CustomerLocationLatitude.value;
    this.customermastermodel.customerLocationLongitude = this.customerMasterFormControls.CustomerLocationLongitude.value;


    if (this.editMode) {
      saveResponse = this.customerMasterService.editCustomermaster(this.customermastermodel);
    } else {
      saveResponse = this.customerMasterService.addCustomermaster(this.customermastermodel);
    }


    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          this.customermastermodel.customerId = result.customerId;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.customerMasterService.AddOrEditRecordToCache(this.customermastermodel, this.editMode);
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

