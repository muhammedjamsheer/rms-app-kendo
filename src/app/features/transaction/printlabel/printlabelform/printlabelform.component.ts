import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PrintLabelService } from 'src/app/core/service/printlabel.service';
import { PrintLabelModel } from 'src/app/shared/model/PrintLabelModel';
import { AssetCategoryMasterService } from '../../../../core/service/assetcategorymaster.service';
import { AssetSubCategoryMasterService } from '../../../../core/service/assetsubcategorymaster.service';
import { AssetCategoryMasterModel } from '../../../../shared/model/AssetCategoryMasterModel';
import { AssetSubCategoryMasterModel } from '../../../../shared/model/AssetSubCategoryMasterModel';
declare var $: any;

@Component({
  selector: 'org-fat-printlabelform',
  templateUrl: './printlabelform.component.html',
  styleUrls: ['./printlabelform.component.css']
})
export class PrintlabelformComponent implements OnInit {
  printLabelForm: FormGroup;
  categoryCodes!: AssetCategoryMasterModel[];
  subCategoryCodes!: AssetSubCategoryMasterModel[];
  subCategoryCodesSearchHolder!: AssetSubCategoryMasterModel[];
  printLabelDesignCodes!: string[];
  submitted!: boolean;
  error!: string;
  printLabelModel!: PrintLabelModel;

  constructor(private formBuilder: FormBuilder,
    private assetCategoryMasterService: AssetCategoryMasterService,
    private assetSubCategoryMasterService: AssetSubCategoryMasterService,
    private printLabelService: PrintLabelService) {

    this.printLabelForm = this.formBuilder.group({
      assetCategorySelCode: [null],
      assetSubCategorySelCode: [null],
      LabelDesignSelCode: [null],
      NoOfLabels: [null, Validators.required]
    });
  }

  async ngOnInit() {

    $('.select2bs4').select2();

    $('[name="assetCategorySelCode"]').on("change", () => {
      this.printLabelFormControls.assetCategorySelCode.setValue($('[name="assetCategorySelCode"]').val());
      this.subCategoryCodes = this.subCategoryCodesSearchHolder.filter(item => item.assetCategoryId == $('[name="assetCategorySelCode"]').val());
    });

    $('[name="assetSubCategorySelCode"]').on("change", () => {
      this.printLabelFormControls.assetSubCategorySelCode.setValue($('[name="assetSubCategorySelCode"]').val());
    });

    $('[name="LabelDesignSelCode"]').on("change", () => {
      this.printLabelFormControls.LabelDesignSelCode.setValue($('[name="LabelDesignSelCode"]').val());
    });

    this.categoryCodes = await this.assetCategoryMasterService.getAssetCategoryMaster();
    this.subCategoryCodes = await this.assetSubCategoryMasterService.getAssetSubCategoryMaster();
    this.subCategoryCodesSearchHolder = this.subCategoryCodes;
    this.printLabelDesignCodes = await this.printLabelService.getPrintLabelDesign();
  }

  get printLabelFormControls() { return this.printLabelForm.controls; }

  GetPrintLabels() {

    this.submitted = true;
    this.error = '';

    // stop here if form is invalid
    if (this.printLabelForm.invalid) {
      return;
    }
    let saveResponse!: Observable<any>;
    this.printLabelModel = new PrintLabelModel;
    this.printLabelModel.subCategoryId = this.printLabelFormControls.assetSubCategorySelCode.value;
    this.printLabelModel.nbOfLabels = this.printLabelFormControls.NoOfLabels.value;
    this.printLabelModel.labelDesignFileName = this.printLabelFormControls.LabelDesignSelCode.value;
    saveResponse = this.printLabelService.getPrintLabel(this.printLabelModel);
    saveResponse.subscribe(
      result => {
        console.log(result);
        let popupWin;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin?.document.open();
        popupWin?.document.write(
          `<html>
          <head>
          <style>  
          @page { size: auto;  margin: 0mm; }        
          </style>
          </head>
          <body onload="window.print();setTimeout(function(){window.close();}, 10000);">${result}</body>
          </html>`
        );
        popupWin?.document.close();
      },
      err => {
        console.log(err);
        this.error = err.error ? err.error : err.message;
      }
    );
  }
}