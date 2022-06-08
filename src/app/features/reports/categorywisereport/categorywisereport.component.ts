import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportsService } from 'src/app/core/service/reports.service';
import { AssetCategoryMasterModel } from 'src/app/shared/model/AssetCategoryMasterModel';
import { AssetCountCategoryWiseModel } from 'src/app/shared/model/assetCountCategoryWiseModel';
import { AssetSubCategoryMasterModel } from 'src/app/shared/model/AssetSubCategoryMasterModel';
import { BrandMasterModel } from 'src/app/shared/model/BrandMasterModel';
import { BrandModelMasterModel } from 'src/app/shared/model/BrandModelMasterModel';
import { CategoryWiseFilterReport } from 'src/app/shared/model/CategoryWiseReport';
import { LocationMasterModel } from 'src/app/shared/model/LocationMasterModel';
import * as XLSX from 'xlsx';
declare var $: any;

@Component({
  selector: 'org-fat-categorywisereport',
  templateUrl: './categorywisereport.component.html',
  styleUrls: ['./categorywisereport.component.css']
})
export class CategorywisereportComponent implements OnInit {
  showReport=false;
  fileName = 'CategoryWiseReport.xlsx';
  CategoryWiseReportForm: FormGroup;
  categoryCodes: AssetCategoryMasterModel[] = [];
  subCategoryCodes: AssetSubCategoryMasterModel[] = [];
  categoryWiseReportSummary: AssetCountCategoryWiseModel[] = [];
  submitted = false;
  modelCodes!: BrandModelMasterModel[];
  brandCodes!: BrandMasterModel[];
  locationCodes!: LocationMasterModel[];
  categoryWiseReportSummaryFilter: CategoryWiseFilterReport = new CategoryWiseFilterReport;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    public datepipe: DatePipe,
    public reportsService: ReportsService) {
    this.CategoryWiseReportForm = this.formBuilder.group({
      brandSelCode: "",
      siteSelCode: "",
      floorSelCode: "",
      LocationSelCode: "",
      buildingSelCode: "",
      roomSelCode: ""
    });
  }

  async ngOnInit() {

    this.reportsService.viewFlag.subscribe(dir=>{
      this.showReport=dir;
      if(dir==true)
      {
      this.ViewSummaryClicked();
      }
    });

  }

  get CategoryWiseReportFormControls() { return this.CategoryWiseReportForm.controls; }

  async ViewSummaryClicked() {
    this.categoryWiseReportSummaryFilter = this.reportsService.categoryWiseReportSummaryFilter;
    this.categoryWiseReportSummary = await this.reportsService.getCategoryWiseReport(this.categoryWiseReportSummaryFilter);
  }

  ShowGrid() {
    this.reportsService.setViewFlag(false);
    //this.router.navigateByUrl('/categorywisereport');
  }

  getSelectedValuesInNumbers(selectedValues: any[]): number[] {
    let output: number[] = [];
    selectedValues.forEach((item, i) => {
      var value = item.split(":")[1];
      value = value.replace("'", '');
      value = parseFloat(value);
      output.push(value);
    });
    return output;
  }

  ClearSummary() {
    this.categoryWiseReportSummary = [];

  }

  exportexcelsummary(): void {
    /* table id is passed over here */
    let element = document.getElementById('excelsummary');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'CategoryWiseReport.xlsx');

  }

}

