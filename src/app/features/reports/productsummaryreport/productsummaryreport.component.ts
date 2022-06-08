import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
declare var $: any;
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AssetRegisterModel } from 'src/app/shared/model/AssetRegisterModel';
import { AssetRegisterFilterReport } from 'src/app/shared/model/AssetRegisterReport';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ReportsService } from 'src/app/core/service/reports.service';
(pdfmake as any).vfs = pdfFonts.pdfMake.vfs;
var htmlToPdfmake = require("html-to-pdfmake");
@Component({
  selector: 'org-fat-productsummaryreport',
  templateUrl: './productsummaryreport.component.html',
  styleUrls: ['./productsummaryreport.component.css']
})
export class ProductsummaryreportComponent implements OnInit {
  fileName = 'ProductSummaryReport.xlsx';
  ProductSummaryReportForm: FormGroup;
  productSummaryReport: AssetRegisterModel[] = [];
  assetreportsummaryFilter: AssetRegisterFilterReport = new AssetRegisterFilterReport;
  imageUrl=environment.imageUrl + localStorage.getItem("companyID");
showReport=false;
  constructor(private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private router: Router,
    public reportsService: ReportsService) {
      this.ProductSummaryReportForm = this.formBuilder.group({
        assetCategorySelCode: "",
        assetSubCategorySelCode: "",
        productSelCode: ""
      });
     }

  ngOnInit(): void {
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
    //this.router.navigateByUrl('/assetregisterreport');
  }

  async ViewSummaryClicked() {
    this.assetreportsummaryFilter = this.reportsService.assetreportsummaryFilter;
    this.productSummaryReport = await this.reportsService.getProductSummaryReport(this.assetreportsummaryFilter);
  }

  get ProductSummaryReportFormControls() { return this.ProductSummaryReportForm.controls; }

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
    this.productSummaryReport = [];
  }

  exportexcelsummary(): void {
    /* table id is passed over here */
    let element = document.getElementById('excelsummary');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'ProductSummaryReport.xlsx');

  }

  async exportpdfsummary()
  {
    
    let printContents, popupWin;
    printContents = document.getElementById('excelsummary')!.innerHTML;
    console.log(printContents);
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin?.document.open();
    popupWin?.document.write(`
      <html>
        <head>
          <title>Asset Register</title>
          <style>
          table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
          }
          </style>
        </head>
    <body onload="window.print();">${'<table>' + printContents + '</table>'}</body>
      </html>`
    );
    popupWin?.document.close();

    
    // const documentDefinition = { content: content.innerHTML };
    // pdfmake.createPdf(documentDefinition).download();
  //   let doc=new jsPDF('l','pt','a4');
   
  //  // let content=this.excelsummary.nativeElement;
  //   const content:any =document.getElementById('excelsummary');
  //   console.log(content.innerHTML);
  //  await doc.html(content.innerHTML);
  // await doc.save('AssetRegisterReportSummary.pdf');
    // const options={filename:'AssetRegisterReportSummary.pdf',image:{type:'jpeg'}, html2canvas:{},jsPDF:{orientation:'landscape'}};
    // const content =document.getElementById('excelsummary');
    // html2pdf().from(content).set(options).save();

  }

}
