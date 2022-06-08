import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DownloadService } from 'src/app/core/service/download.service';
import { ReceiptMasterService } from 'src/app/core/service/receiptmaster.service';
import { SaveAlert } from 'src/app/shared/commonalerts/savealert';

@Component({
  selector: 'org-fat-receipt-upload',
  templateUrl: './receipt-upload.component.html',
  styleUrls: ['./receipt-upload.component.css']
})
export class ReceiptUploadComponent implements OnInit {
  ReceiptUploadForm: FormGroup;
  submitted: boolean = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  companyName!: string;
  error = '';
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private saveAlert: SaveAlert,private receiptmasterservice:ReceiptMasterService,private downloadservice:DownloadService) { 
      this.ReceiptUploadForm = this.formBuilder.group({
        fileTemplate:[null]
      });
    }

    get ReceiptUploadFormControls() { return this.ReceiptUploadForm.controls; }

  ngOnInit(): void {
  }

  async ClearContents() {
    this.companyName = '';
    this.ReceiptUploadFormControls.fileTemplate.setValue(null);
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

  ShowGrid()
  {
    this.router.navigateByUrl('/receipt');
  }

  info='';
  SaveFile(){
    this.error='';
    this.info='';
    let saveResponse: Observable<any>;
    this.submitted = true;
    if(this.ReceiptUploadFormControls.fileTemplate.value==null || this.ReceiptUploadFormControls.fileTemplate.value=='')
    {
      this.error='Please upload file';
      return;
    }
    // stop here if form is invalid
  if (this.ReceiptUploadFormControls.invalid) {
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
      saveResponse = this.receiptmasterservice.UploadReceipt(formData);
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
      this.ReceiptUploadFormControls.fileTemplate.setValue(null);
      // if(text)
      // {
      //  if(text.includes("Total"))
      //  {
      //    this.info=text;
      //    this.saveAlert.SuccessMessage();
      //    this.info='';
      //  }
      //  else
      //  {
      //   this.error=err.error;
      //  }
      // }
      // else
      // {
      //   this.error=err.error.text;
      // }
     // this.error = err.error ? err.error : err.message;
  
    }
  );

}

  DownloadFile()
  {
    this.downloadservice.DownloadTemplateFile().subscribe((data: any) => {
      const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; 
      let blob = new Blob([data], { type: contentType });  
      let objectURL = window.URL.createObjectURL(blob); 
      var linkToFile = document.createElement('a');
linkToFile.download = "BOQ_Template.xlsx";
linkToFile.href = objectURL;
linkToFile.click();     
    //  window.open(objectURL);
    });
  }

}
