import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginComponent } from 'src/app/core/login/login.component';
import { EmployeeMasterService } from 'src/app/core/service/employeemaster.service';
import { UserMasterService } from 'src/app/core/service/usermaster.service';
import { userrolemasterservice } from 'src/app/core/service/userrolemaster.service';
import { SaveAlert } from 'src/app/shared/commonalerts/savealert';
import { EmployeeMasterModel } from 'src/app/shared/model/EmployeeMasterModel';
import { UserMasterModel } from 'src/app/shared/model/UserMasterModel';
import { UserRoleMasterModel } from 'src/app/shared/model/UserRoleMasterModel';
declare var $: any;

@Component({
  selector: 'app-usermasterform',
  templateUrl: './usermasterform.component.html',
  styleUrls: ['./usermasterform.component.css']
})
export class UsermasterformComponent implements OnInit {
  UserMasterForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  UserName!: string;
  error = '';
  editMode: boolean = false;
  UserData!: UserMasterModel;
  userMasterModel: UserMasterModel = new UserMasterModel;
  employees:EmployeeMasterModel[]=[];
  userroles:UserRoleMasterModel[]=[];
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private saveAlert: SaveAlert,
    private userMasterService: UserMasterService, 
    private employeemasterservice:EmployeeMasterService,
    private userrolemasterservice:userrolemasterservice) {
      this.UserMasterForm = this.formBuilder.group({
        UserRoleSelCode: ['', Validators.required],
        EmployeeSelCode: ['', Validators.required],
        UserName: ['', Validators.required],
        Password: ['', Validators.required],
      });
     }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id'] != undefined) {
        this.UserName = params['id'];
        this.editMode = true;
        this.UserData = this.userMasterService.getUserMasterByKey(this.UserName) as UserMasterModel;
        this.ShowEditViewUserMaster(this.UserData);
        
        if (params['state'] === 'view')
        {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
  });
  $('.select2bs4').select2();
  $('[name="UserRoleSelCode"]').on("change", () => {
    this.UserMasterFormControls.UserRoleSelCode.setValue($('[name="UserRoleSelCode"]').val());
  });
  $('[name="EmployeeSelCode"]').on("change", () => {
    this.UserMasterFormControls.EmployeeSelCode.setValue($('[name="EmployeeSelCode"]').val());
  });
  this.employees=await this.employeemasterservice.getEmployeeMaster();
  this.userroles=await this.userrolemasterservice.getUserRoleMaster();
  }
  get UserMasterFormControls() { return this.UserMasterForm.controls; }
  ShowGrid(){
    this.router.navigateByUrl('/usermaster');
  }
  disableControls() {
    this.UserMasterFormControls.UserRoleSelCode.disable();
    this.UserMasterFormControls.EmployeeSelCode.disable();
    this.UserMasterFormControls.UserName.disable();
    this.UserMasterFormControls.Password.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }
  
  ClearContents() {
    this.UserName = '';
    this.UserMasterFormControls.UserRoleSelCode.setValue(null);
    this.UserMasterFormControls.EmployeeSelCode.setValue(null);
    this.UserMasterFormControls.UserName.setValue(null);
    this.UserMasterFormControls.Password.setValue(null);
    $('[name="UserRoleSelCode"]').select2().trigger('change');
    $('[name="EmployeeSelCode"]').select2().trigger('change');
  }
  ShowEditViewUserMaster(data: UserMasterModel) {
    this.UserMasterFormControls.UserRoleSelCode.setValue(data.userRoleID);
    this.UserMasterFormControls.EmployeeSelCode.setValue(data.employeeId);
    this.UserMasterFormControls.UserName.setValue(data.userName);
    this.UserMasterFormControls.Password.setValue(null);
  }
  SaveUserMaster(){
    this.error='';
    let saveResponse: Observable<any>;
    this.submitted = true;

    // stop here if form is invalid
  if (this.UserMasterForm.invalid) {
    return;
}
this.submitted = false;
    this.loading = true;
    this.userMasterModel=new UserMasterModel;
    this.userMasterModel.userName = this.UserMasterFormControls.UserName.value;
    this.userMasterModel.userRoleID = this.UserMasterFormControls.UserRoleSelCode.value;
    this.userMasterModel.employeeId = this.UserMasterFormControls.EmployeeSelCode.value;
    this.userMasterModel.password = this.UserMasterFormControls.Password.value;
    this.userMasterModel.employeeName = this.employees.filter(p=>p.employeeId==this.UserMasterFormControls.EmployeeSelCode.value)[0].firstName;
    this.userMasterModel.employeeCode = this.employees.filter(p=>p.employeeId==this.UserMasterFormControls.EmployeeSelCode.value)[0].employeeCode;
    this.userMasterModel.roleName = this.userroles.filter(p=>p.id==this.UserMasterFormControls.UserRoleSelCode.value)[0].roleName;
    console.log(this.userMasterModel);
    if(this.editMode){
     saveResponse = this.userMasterService.editUserMaster(this.userMasterModel);
    } else {
      saveResponse = this.userMasterService.addUsermaster(this.userMasterModel);
  }

  
  saveResponse.subscribe(
    result => {
      if (!this.editMode) {
       // this.userMasterModel.userName = result.id;
        this.ClearContents();
      }
      this.saveAlert.SuccessMessage();
      this.userMasterService.AddOrEditRecordToCache(this.userMasterModel, this.editMode);
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
