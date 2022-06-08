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
  selector: 'org-fat-employeewisereport',
  templateUrl: './employeewisereport.component.html',
  styleUrls: ['./employeewisereport.component.css']
})
export class EmployeewisereportComponent implements OnInit {
  fileName = 'EmployeeWiseReportSummary.xlsx';
  EmployeeWiseReportForm: FormGroup;
  employeeWiseReportSummary: AssetRegisterModel[] = [];
  employeeWiseSummaryFilter: AssetRegisterFilterReport = new AssetRegisterFilterReport;
  showReport=false;
  constructor(private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private router: Router,
    public reportsService: ReportsService) {
    this.EmployeeWiseReportForm = this.formBuilder.group({
      employees : [null]
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
    //this.router.navigateByUrl('/employeewisereport');
  }

  get EmployeeWiseReportFormControls() { return this.EmployeeWiseReportForm.controls; }

  async ViewSummaryClicked() {
    this.employeeWiseSummaryFilter = this.reportsService.employeeWisesummaryFilter;
    this.employeeWiseReportSummary = await this.reportsService.getAssetRegisterReport(this.employeeWiseSummaryFilter);
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
    this.employeeWiseReportSummary = [];
  }



  exportexcelsummary(): void {
    /* table id is passed over here */
    let element = document.getElementById('excelsummary');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'EmployeeWiseReportSummary.xlsx');

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
