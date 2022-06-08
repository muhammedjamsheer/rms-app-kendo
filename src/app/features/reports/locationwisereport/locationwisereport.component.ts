import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportsService } from 'src/app/core/service/reports.service';
import { AssetCategoryMasterModel } from 'src/app/shared/model/AssetCategoryMasterModel';
import { AssetSubCategoryMasterModel } from 'src/app/shared/model/AssetSubCategoryMasterModel';
import { BrandMasterModel } from 'src/app/shared/model/BrandMasterModel';
import { BrandModelMasterModel } from 'src/app/shared/model/BrandModelMasterModel';
import { BuildingMasterModel } from 'src/app/shared/model/BuildingMasterModel';
import { FloorMasterModel } from 'src/app/shared/model/FloorMasterModel';
import { LocationMasterModel } from 'src/app/shared/model/LocationMasterModel';
import { LocationWiseFilterReport } from 'src/app/shared/model/LocationWiseReport';
import { RoomMasterModel } from 'src/app/shared/model/RoomMasterModel';
import { SiteMasterModel } from 'src/app/shared/model/sitemastermodel';
import * as XLSX from 'xlsx';
declare var $: any;

@Component({
  selector: 'org-fat-locationwisereport',
  templateUrl: './locationwisereport.component.html',
  styleUrls: ['./locationwisereport.component.css']
})
export class LocationwisereportComponent implements OnInit {
  showReport=false;
  fileName = 'LocationWiseReport.xlsx';
  LocationWiseReportForm: FormGroup;
  categoryCodes: AssetCategoryMasterModel[] = [];
  subCategoryCodes: AssetSubCategoryMasterModel[] = [];
  locationWiseReportSummary: LocationMasterModel[] = [];
  submitted = false;
  sitecodes: SiteMasterModel[] = [];
  floorcodes: FloorMasterModel[] = [];
  locationCodes!: LocationMasterModel[];
  modelCodes!: BrandModelMasterModel[];
  brandCodes!: BrandMasterModel[];
  buildingcodes: BuildingMasterModel[] = [];
  roomcodes: RoomMasterModel[] = [];
  locationWiseReportSummaryFilter!: LocationWiseFilterReport;

  constructor(private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private router: Router,
    public reportsService: ReportsService) {
    this.LocationWiseReportForm = this.formBuilder.group({
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

  get LocationWiseReportFormControls() { return this.LocationWiseReportForm.controls; }

  async ViewSummaryClicked() {
    this.locationWiseReportSummaryFilter = this.reportsService.locationWiseReportSummaryFilter;
    this.locationWiseReportSummary = await this.reportsService.getLocationWiseReport(this.locationWiseReportSummaryFilter);
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
    this.locationWiseReportSummary = [];

  }


  ShowGrid() {
    this.reportsService.setViewFlag(false);
    //this.router.navigateByUrl('/locationwisereport');
  }


  exportexcelsummary(): void {
    /* table id is passed over here */
    let element = document.getElementById('excelsummary');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'LocationWiseReport.xlsx');

  }

}
