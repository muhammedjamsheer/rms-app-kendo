import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportsService } from 'src/app/core/service/reports.service';
import { AssetRegisterModel } from 'src/app/shared/model/AssetRegisterModel';
import { AssetRegisterFilterReport } from 'src/app/shared/model/AssetRegisterReport';
import { CategoryWiseFilterReport } from 'src/app/shared/model/CategoryWiseReport';
import * as XLSX from 'xlsx';
declare var $: any;

@Component({
  selector: 'org-fat-assethistoryreport',
  templateUrl: './assethistoryreport.component.html',
  styleUrls: ['./assethistoryreport.component.css']
})
export class AssethistoryreportComponent implements OnInit {
  fileName = 'AssetHistoryReportSummary.xlsx';
  AssetHistoryReportForm: FormGroup;
  assetHistoryReportSummary: AssetRegisterModel[] = [];
  assetHistoryReportDetail: AssetRegisterModel[] = [];
  assetHistoryReportCache: AssetRegisterModel[] = [];
  categwiseAssetFilter: CategoryWiseFilterReport = new CategoryWiseFilterReport;
  showReport=false;
  constructor(private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private router: Router,
    public reportsService: ReportsService) { 
      this.AssetHistoryReportForm = this.formBuilder.group({
        SearchInputSummary: "",
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

  get AssetHistoryReportFormControls() { return this.AssetHistoryReportForm.controls; }

  ShowGrid() {
    this.reportsService.setViewFlag(false);
    //this.router.navigateByUrl('/assethistoryreport');
  }
isDetailHidden=false;
  SearchValue(event:any)
  {
    this.assetHistoryReportSummary=[];
    if(event.target.value!='')
    {
      this.assetHistoryReportSummary=this.assetHistoryReportCache.filter(p=>p.serialNo.includes(event.target.value));
    }
    else
    {
      this.assetHistoryReportSummary=this.assetHistoryReportCache;
    }
  }

 async ShowItemDetail(x1:any,indexofsummary:any)
  {
    this.assetHistoryReportDetail = await this.reportsService.getAssetHistoryDetailReport(x1.serialNo);
    this.isDetailHidden=true;
  }

  exportexcelDetail()
  {
  /* table id is passed over here */
  let element = document.getElementById('exceldetail');
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  /* save to file */
  XLSX.writeFile(wb, 'AssetHistoryReportDetail.xlsx');
  }
  ShowSummary()
  {
    this.assetHistoryReportDetail=[];
    this.isDetailHidden=false;
  }
  exportexcelsummary(): void {
    /* table id is passed over here */
    let element = document.getElementById('excelsummary');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'AssetHistoryReportSummary.xlsx');

  }

  async ViewSummaryClicked() {
    this.categwiseAssetFilter = this.reportsService.categoryWiseReportSummaryFilter;
    console.log( this.categwiseAssetFilter)
    this.assetHistoryReportCache = await this.reportsService.getAssetHistoryReport(this.categwiseAssetFilter);
    this.assetHistoryReportSummary=this.assetHistoryReportCache;
  }

  ClearSummary() {
    this.assetHistoryReportSummary = [];
  }

}
