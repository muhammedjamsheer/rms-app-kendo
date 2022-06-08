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
import { BuildingMasterModel } from 'src/app/shared/model/BuildingMasterModel';
import { CategoryWiseFilterReport } from 'src/app/shared/model/CategoryWiseReport';
import { FloorMasterModel } from 'src/app/shared/model/FloorMasterModel';
import { LocationMasterModel } from 'src/app/shared/model/LocationMasterModel';
import { RoomMasterModel } from 'src/app/shared/model/RoomMasterModel';
import { SiteMasterModel } from 'src/app/shared/model/sitemastermodel';
import * as XLSX from 'xlsx';
declare var $: any;

@Component({
  selector: 'org-fat-categorywisevaluereport',
  templateUrl: './categorywisevaluereport.component.html',
  styleUrls: ['./categorywisevaluereport.component.css']
})
export class CategorywisevaluereportComponent implements OnInit {

  fileName = 'CategoryWiseValueReport.xlsx';
  CategoryWiseValueReportForm: FormGroup;
  categoryCodes: AssetCategoryMasterModel[] = [];
  subCategoryCodes: AssetSubCategoryMasterModel[] = [];
  categoryWiseReportSummary: AssetCountCategoryWiseModel[] = [];
  submitted = false;
  sitecodes: SiteMasterModel[] = [];
  floorcodes: FloorMasterModel[] = [];
  locationCodes!: LocationMasterModel[];
  modelCodes!: BrandModelMasterModel[];
  brandCodes!: BrandMasterModel[];
  buildingcodes: BuildingMasterModel[] = [];
  roomcodes: RoomMasterModel[] = [];
  categoryWiseReportSummaryFilter!: CategoryWiseFilterReport;
  showReport=false;
  constructor(private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private router: Router,
    public reportsService: ReportsService) {
    this.CategoryWiseValueReportForm = this.formBuilder.group({
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

  get CategoryWiseValueReportFormControls() { return this.CategoryWiseValueReportForm.controls; }

  async ViewSummaryClicked() {
    this.categoryWiseReportSummaryFilter = this.reportsService.categoryWiseReportSummaryFilter;
    this.categoryWiseReportSummary = await this.reportsService.getCategoryWiseValueReport(this.categoryWiseReportSummaryFilter);
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


  ShowGrid() {
    this.reportsService.setViewFlag(false);
   // this.router.navigateByUrl('/categorywisevaluereport');
  }


  exportexcelsummary(): void {
    /* table id is passed over here */
    let element = document.getElementById('excelsummary');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'CategoryWiseValueReport.xlsx');

  }

}
