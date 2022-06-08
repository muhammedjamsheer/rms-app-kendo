import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { integrationService } from 'src/app/core/service/integration.service';
import { SaveAlert } from 'src/app/shared/commonalerts/savealert';

@Component({
  selector: 'org-fat-assetfileupload',
  templateUrl: './assetfileupload.component.html',
  styleUrls: ['./assetfileupload.component.css']
})
export class AssetfileuploadComponent implements OnInit {
  AssetUploadForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  companyName!: string;
  error = '';
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private saveAlert: SaveAlert,private integrationservice:integrationService) {
      this.AssetUploadForm = this.formBuilder.group({
        fileTemplate:[null]
      });
     }

     get AssetUploadFormControls() { return this.AssetUploadForm.controls; }

  ngOnInit(): void {
  }

  async ClearContents() {
    this.companyName = '';
    this.AssetUploadFormControls.fileTemplate.setValue(null);
  }

  fileImageList!: File;
  fileChangeEvent(fileInput:any) {
    const max_size = 20971520;
        const allowed_types = ['image/png', 'image/jpeg'];
        const max_height = 15200;
        const max_width = 25600;
    if (fileInput.target.files) {
        this.fileImageList=fileInput.target.files[0];
      }
        
        return false;
  }

  info='';
  SaveFile(){
    this.error='';
    this.info='';
    let saveResponse: Observable<any>;
    this.submitted = true;
    if(this.AssetUploadFormControls.fileTemplate.value==null || this.AssetUploadFormControls.fileTemplate.value=='')
    {
      this.error='Please upload file';
      return;
    }
    // stop here if form is invalid
  if (this.AssetUploadFormControls.invalid) {
    return;
}
    const formData = new FormData();
    this.loading = true;
    if(this.fileImageList != null) 
      {
        let imageFile: File = this.fileImageList;
        console.log(imageFile);
        console.log(imageFile.name);
        formData.append('uploadFile',imageFile,imageFile.name);
      }
console.log(formData);
      saveResponse = this.integrationservice.UploadAssetFile(formData);
  this.info='Please wait, it will take some time';
  saveResponse.subscribe(
    result => {
      this.ClearContents();
      console.log(result.message);
      this.submitted = false;
      this.loading = false;
      if(result.message.includes("Total"))
      {
      this.saveAlert.SuccessMessage();
      this.info=result.message;
      }
      else
      {
        this.error=result.message;
      }
    },
    err => {
      this.ClearContents();
      console.log(err.error);
      console.log(err.error);
      var text=err.error;
      this.error=err.error;
      this.info='';
      this.loading = false;
      this.submitted = false;
      this.AssetUploadFormControls.fileTemplate.setValue(null);
  
    }
  );

}

}
