import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportsService } from 'src/app/core/service/reports.service';
import { AssetRegisterModel } from 'src/app/shared/model/AssetRegisterModel';
import { AssetRegisterFilterReport } from 'src/app/shared/model/AssetRegisterReport';
import * as XLSX from 'xlsx';
declare var $: any;

@Component({
  selector: 'org-fat-departmentwisereport',
  templateUrl: './departmentwisereport.component.html',
  styleUrls: ['./departmentwisereport.component.css']
})
export class DepartmentwisereportComponent implements OnInit {
  fileName = 'DepartmentWiseReportSummary.xlsx';
  DepartmentWiseReportForm: FormGroup;
  departmentWiseReportSummary: AssetRegisterModel[] = [];
  departmentWiseSummaryFilter: AssetRegisterFilterReport = new AssetRegisterFilterReport;
  showReport=false;
  constructor(private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private router: Router,
    public reportsService: ReportsService) {
    this.DepartmentWiseReportForm = this.formBuilder.group({
      departments : [null]
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

  ShowGrid() {
    this.reportsService.setViewFlag(false);
    //this.router.navigateByUrl('/departmentwisereport');
  }

  get DepartmentWiseReportFormControls() { return this.DepartmentWiseReportForm.controls; }

  async ViewSummaryClicked() {
    this.departmentWiseSummaryFilter = this.reportsService.departmentWiseSummaryFilter;
    this.departmentWiseReportSummary = await this.reportsService.getAssetRegisterReport(this.departmentWiseSummaryFilter);
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
    this.departmentWiseReportSummary = [];
  }



  exportexcelsummary(): void {
    /* table id is passed over here */
    let element = document.getElementById('excelsummary');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'DepartmentWiseReportSummary.xlsx');

  }

  exportexcelDetail(): void {
    /* table id is passed over here */
    let element = document.getElementById('exceldetail');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'AuditReportDetail.xlsx');

  }
}
