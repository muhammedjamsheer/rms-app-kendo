import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { DownloadService } from 'src/app/core/service/download.service';
import { SaveAlert } from 'src/app/shared/commonalerts/savealert';

@Component({
  selector: 'org-fat-macrofileupdate',
  templateUrl: './macrofileupdate.component.html',
  styleUrls: ['./macrofileupdate.component.css']
})
export class MacrofileupdateComponent implements OnInit {
  MacroTemplateUploadForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  companyName!: string;
  error = '';
  constructor(private formBuilder: FormBuilder,
    private saveAlert: SaveAlert,private downloadservice:DownloadService) {
      this.MacroTemplateUploadForm = this.formBuilder.group({
        fileTemplate:[null]
      });
     }
     get MacroTemplateUploadFormControls() { return this.MacroTemplateUploadForm.controls; }
  ngOnInit(): void {
  }

  async ClearContents() {
    this.companyName = '';
    this.MacroTemplateUploadFormControls.fileTemplate.setValue(null);
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
    if(this.MacroTemplateUploadFormControls.fileTemplate.value==null || this.MacroTemplateUploadFormControls.fileTemplate.value=='')
    {
      this.error='Please upload file';
      return;
    }
    // stop here if form is invalid
  if (this.MacroTemplateUploadFormControls.invalid) {
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
      saveResponse = this.downloadservice.UploadMacroFile(formData);
  this.info='Please wait, it will take some time';
  saveResponse.subscribe(
    result => {
      this.ClearContents();
      console.log(result);
      this.submitted = false;
      this.loading = false;
      this.saveAlert.SuccessMessage();
      this.info='';
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
      this.MacroTemplateUploadFormControls.fileTemplate.setValue(null);
      
  
    }
  );

}

}
