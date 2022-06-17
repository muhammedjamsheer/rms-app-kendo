import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetAuditService } from 'src/app/core/service/assetaudit.service';
import { AssetSubCategoryMasterService } from 'src/app/core/service/assetsubcategorymaster.service';
import { LocationmasterService } from 'src/app/core/service/locationmaster.service';
import { AuditSummary } from 'src/app/shared/model/AssetAuditModel';
import { CommonService } from 'src/app/core/service/common.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
declare var $: any;

@Component({
  selector: 'org-fat-assetsummary',
  templateUrl: './assetsummary.component.html',
  styleUrls: ['./assetsummary.component.css']
})
export class AssetsummaryComponent implements OnInit {
  auditId!: any;
  auditSummaryData: AuditSummary[] = [];

  constructor(private route: ActivatedRoute,
    private assetSubCategoryService: AssetSubCategoryMasterService,
    private locationMasterService: LocationmasterService,
    private assetAuditService: AssetAuditService,
    private router: Router,
    private commonService: CommonService,) { }

  async ngOnInit() {
    this.route.params.subscribe(async params => {
      if (params['id'] != undefined) {
        this.auditId = +params['id'];
        this.auditSummaryData = await this.assetAuditService.getAuditAssetSummary(this.auditId);
      }
    });
  }

  BacktoGrid() {
    this.router.navigateByUrl('/physicalcount');
  }

  DownloadExcel_xslx() {
    let element = document.getElementById('excelsummary');
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.auditSummaryData);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'AuditSummary.xlsx');
  }


  DownloadExcel() {
    //Title, Header & Data
    const title = 'Audit Summary';
    const header = ['Location Name', 'Category', 'Product', 'Quantity']

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Sales Data');
    //Add  titleRow
    const arraylength = header.length;
    const titleRow = worksheet.addRow([title]);
    titleRow.font = { size: 15, bold: true };
    worksheet.mergeCells(1, 1, 2, arraylength);
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
    //Blank Row 
    worksheet.addRow([]);

    //Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' }
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12
      }
    })
    //Adding Grid data
    this.auditSummaryData.forEach(element => {
      let rowdata = [element.locationName, element.category, element.productCode + "-" + element.productDescription, element.quantity]
      const row = worksheet.addRow(rowdata);
    });
    for (let i = 0; i < worksheet.columns.length; i += 1) {
      const column = worksheet.columns[i];
      column.width = i == 2 ? 40 : 30;
    }
    worksheet.addRow([]);
    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    })

  }

  posttoErp() {
    Swal.fire({
      title: 'Do you  want to post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.assetAuditService.auditPostingtoErp(this.auditId).subscribe(res => {
          this.commonService.showMessage('success', 'Posted successfully !');
        });
      } else {
        Swal.fire(
          'Cancelled',
        )
      }
    })
  }

}
