import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { SalesorderprintService } from './salesorderprint.service';
import { TransferorderprintService } from './transferorderprint.service';
import { PicklistprintService } from './picklistprint.service';
import { ReceiptprintService } from './receiptprint.service';
import { ShipmemtprintService } from './shipmemtprint.service';
import { PurchaseorderService } from './purchaseorder.service';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  longdateFormat = environment.longdateformatpipe;
  shortdateFormat = environment.shortdateformatpipe;
  docDefinition: any;
  constructor(
    private datePipe: DatePipe,
    private salesorderprintService: SalesorderprintService,
    private transferorderprintService: TransferorderprintService,
    private picklistprintService: PicklistprintService,
    private receiptprintService: ReceiptprintService,
    private shipmemtprintService: ShipmemtprintService,
    private purchaseorderService: PurchaseorderService,

  ) { }

  generatePdf(exportdata) {
    var date = this.datePipe.transform(new Date(), this.longdateFormat);
    let title;
    let bodycontent;
    switch (exportdata.printtype) {
      case 'salesorder': {
        title = 'Sales Order';
        bodycontent = this.salesorderprintService.generateContent(exportdata)
        break;
      }
      case 'transferorder': {
        title = 'Transfer Order';
        bodycontent = this.transferorderprintService.generateContent(exportdata)
        break;
      }
      case 'picklist': {
        title = exportdata.title;
        bodycontent = this.picklistprintService.generateContent(exportdata)
        break;
      }
      case 'receipt': {
        title = exportdata.title;
        bodycontent = this.receiptprintService.generateContent(exportdata)
        break;
      }
      case 'shipment': {
        title = exportdata.title;
        bodycontent = this.shipmemtprintService.generateContent(exportdata)
        break;
      }
      case 'purchaseorder': {
        title = exportdata.title;
        bodycontent = this.purchaseorderService.generateContent(exportdata)
        break;
      }


    }
    this.docDefinition = {
      pageMargins: [30, 60, 30, 50],
      pageOrientation: "landscape",
      header: function () {
        return [
          { text: title, alignment: 'center', fontSize: 12, bold: true, margin: [0, 30, 0, 5], },
        ]
      },
      content: bodycontent,
      footer: function (currentPage: any, pageCount: number, pageSize: any) {
        return [
          { canvas: [{ type: 'line', x1: 20, y1: 0, x2: 820, y2: 0, lineWidth: 0.5 },] },

          {
            margin: [30, 10, 30, 0],
            columns: [
              { text: "Page " + currentPage.toString() + ' of ' + pageCount, alignment: 'left', style: 'boldText', },
              { text: date, alignment: 'right', style: 'boldText', },
            ],
          },
        ]
      },
      styles:
      {
        boldText: {
          fontSize: 8,
          bold: true
        },
        normalText: {
          fontSize: 8,
        },
        tableHeader: {
          color: '#000',
          fontSize: 9,
          bold: true,
          margin: [0, 0, 0, 0],
        },
        table: {
          fontSize: 8,
          lineHeight: 1,
        },
      },
      info: {
        title: title,
      },
    }
    pdfMake.createPdf(this.docDefinition).open();
  }


  generateExcel(exportdata) {
    const title = exportdata.title;
    const griddata: any[] = exportdata.griddata
    const printtype = exportdata.printtype;
    const reporttype = exportdata.reporttype;
    var gridheader = []
    if (printtype == "receiptsummary") {
      gridheader = ['Sl No.', 'Product Id', 'Product Code', 'Product Description', 'Batch No. ', 'UOM Code', 'UOM Qty', 'Purchase Price']
    }
    if (printtype == "receiptdetail") {
      gridheader = ['Sl No.', 'Serial No.', 'Product Id', 'Product Code', 'Product Description', 'Batch No. ', 'UOM Code', 'UOM Qty', 'Purchase Price']
    }
    if (printtype == "shipmentsummary") {
      gridheader = ['Sl No.', 'Product Id', 'Product Code', 'Product Description', 'Quantity', 'UOM Code', 'UOM Qty', 'Purchase Price']
    }
    if (printtype == "shipmentdetail") {
      gridheader = ['Sl No.', 'Serial No.', 'Product Id', 'Product Code', 'Product Description', 'Quantity', 'UOM Code', 'UOM Qty', 'Purchase Price']
    }
    if (printtype == "inventorysummary") {
      gridheader = ['Sl No.', 'Product Id', 'Item Description', 'UOM Code', 'Item Group', 'Manufacturer Name', 'Category', 'Warehouse Name', 'Quantity', 'Inventory Item']
    }
    if (printtype == "inventorydetails") {
      gridheader = ['Sl No.', 'Product Id', 'Product Code', 'Product Description', 'UOM Code', 'Serial No', 'Batch No', 'Received Date', 'Item Group', 'Manufacturer Name', 'Category', 'Warehouse Code', 'Warehouse Name', 'Quantity', 'Inventory Items']
    }
    if (printtype == "productmaster") {
      gridheader = ['Sl No.', 'Product Id', 'Product Code', 'Product Description', 'Inventory Uom', 'Category']
    }
    if (printtype == "purchaseorder" && reporttype == "purchaseorder") {
      gridheader = ['Sl No.', 'Product Id', 'Product Code', 'Product Description', 'UOM Code', 'UOM Qty', 'Order Qty', 'Received Qty', 'Pending Qty', 'Price', 'Price after Vat']
    }
    if (printtype == "purchaseorder" && reporttype == "purchaseorderreturn") {
      gridheader = ['Sl No.', 'Product Id', 'Product Code', 'Product Description', 'UOM Code', 'UOM Qty', 'Qty to be Return', 'Returned Qty', 'Pending Qty', 'Price', 'Price after Vat']
    }


    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);
    //Add  titleRow
    const arraylength = gridheader.length;
    const titleRow = worksheet.addRow([title]);
    titleRow.font = { size: 15, bold: true };
    worksheet.mergeCells(1, 1, 2, arraylength);
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      // underline: 'single',
      bold: true,
      color: { argb: '000' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
    //Adding Header Row
    let headerRow = worksheet.addRow(gridheader);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffc71f' },
        bgColor: { argb: '' }
      }
      cell.font = {
        bold: true,
        color: { argb: '000' },
        size: 12
      }
    })
    //Adding Grid data
    if (printtype == "receiptsummary") {
      griddata.forEach((element, index) => {
        let rowdata = [index + 1, element.productId, element.productCode, element.productDescription, element.batchNo, element.uomCode, element.uomQnty, element.purchasePrice]
        const row = worksheet.addRow(rowdata);
        row.eachCell(function (cell, number) {
          cell.alignment = { horizontal: 'left' }
        })
      });
      for (let i = 0; i < worksheet.columns.length; i += 1) {
        const column = worksheet.columns[i];
        if (i == 0) { column.width = 15; }
        else if (i == 3) { column.width = 50; } else { column.width = 30; }
      }
    }
    if (printtype == "receiptdetail") {
      griddata.forEach((element, index) => {
        let rowdata = [index + 1, element.serialNo, element.productId, element.productCode, element.productDescription, element.batchNo, element.uomCode, element.uomQnty, element.purchasePrice]
        const row = worksheet.addRow(rowdata);
        row.eachCell(function (cell, number) {
          cell.alignment = { horizontal: 'left' }
        })
      });
      for (let i = 0; i < worksheet.columns.length; i += 1) {
        const column = worksheet.columns[i];
        if (i == 0) { column.width = 15; }
        else if (i == 4) { column.width = 50; } else { column.width = 30; }
      }
    }

    if (printtype == "shipmentsummary") {
      griddata.forEach((element, index) => {
        let rowdata = [index + 1, element.productId, element.productCode, element.productDescription, element.quantity, element.uomCode, element.uomQnty, element.purchasePrice]
        const row = worksheet.addRow(rowdata);
        row.eachCell(function (cell, number) {
          cell.alignment = { horizontal: 'left' }
        })
      });
      for (let i = 0; i < worksheet.columns.length; i += 1) {
        const column = worksheet.columns[i];
        if (i == 0) { column.width = 15; }
        else if (i == 3) { column.width = 50; } else { column.width = 30; }
      }
    }

    if (printtype == "shipmentdetail") {
      griddata.forEach((element, index) => {
        let rowdata = [index + 1, element.serialNo, element.productId, element.productCode, element.productDescription, element.quantity, element.uomCode, element.uomQnty, element.purchasePrice]
        const row = worksheet.addRow(rowdata);
        row.eachCell(function (cell, number) {
          cell.alignment = { horizontal: 'left' }
        })
      });
      for (let i = 0; i < worksheet.columns.length; i += 1) {
        const column = worksheet.columns[i];
        if (i == 0) { column.width = 15; }
        else if (i == 4) { column.width = 50; } else { column.width = 30; }
      }
    }

    if (printtype == "inventorysummary") {
      griddata.forEach((element, index) => {
        let rowdata = [index + 1, element.productId, element.productDescription, element.uomCode, element.itemGroup, element.manufacturerName, element.category, element.warehouseName, element.quantity, element.inventoryItem]
        const row = worksheet.addRow(rowdata);
        row.eachCell(function (cell, number) {
          cell.alignment = {
            horizontal: 'left'
          }
        })
      });
      for (let i = 0; i < worksheet.columns.length; i += 1) {
        const column = worksheet.columns[i];
        if (i == 0 || i == 6) {
          column.width = 15;
        } else if (i == 2) {
          column.width = 50;
        } else { column.width = 30; }
      }
    }
    if (printtype == "inventorydetails") {
      griddata.forEach((element, index) => {
        let rowdata = [index + 1, element.productId, element.productCode, element.productDescription, element.uomCode, element.serialNo, element.batchNo, element.receivedDate, element.itemGroup, element.manufacturerName, element.category, element.warehouseCode, element.warehouseName, element.quantity, element.inventoryItem]
        const row = worksheet.addRow(rowdata);
        row.eachCell(function (cell, number) {
          cell.alignment = {
            horizontal: 'left'
          }
        })
      });

      for (let i = 0; i < worksheet.columns.length; i += 1) {
        const column = worksheet.columns[i];
        if (i == 0) { column.width = 15; }
        else if (i == 3) { column.width = 50; }
        else { column.width = 30; }
      }
    }
    if (printtype == "productmaster") {
      griddata.forEach((element, index) => {
        let rowdata = [index + 1, element.productId, element.productCode, element.productDescription, element.inventoryUOM, element.category]
        const row = worksheet.addRow(rowdata);
        row.eachCell(function (cell, number) {
          cell.alignment = {
            horizontal: 'left'
          }
        })
      });
      for (let i = 0; i < worksheet.columns.length; i += 1) {
        const column = worksheet.columns[i];
        if (i == 0) {
          column.width = 15;
        } else if (i == 3) { column.width = 50; } else { column.width = 30; }
      }
    }


    if (printtype == "purchaseorder") {
      let rowdata = []
      griddata.forEach((element, index) => {
        if (reporttype == "purchaseorder") {
          rowdata = [index + 1, element.productId, element.productCode, element.poLineDescription, element.uomCode, element.uomQty, element.orderQty, element.receivedQnty, element.pendingQnty, element.price, element.priceAfterVAT]
        }
        if (reporttype == "purchaseorderreturn") {
          rowdata = [index + 1, element.productId, element.productCode, element.poLineDescription, element.uomCode, element.uomQty, element.qntytobeReturn, element.returnedQnty, element.pendingQnty, element.price, element.priceAfterVAT]
        }
        const row = worksheet.addRow(rowdata);
        row.eachCell(function (cell, number) {
          cell.alignment = {
            horizontal: 'left'
          }
        })
      });

      for (let i = 0; i < worksheet.columns.length; i += 1) {
        const column = worksheet.columns[i];
        if (i == 0) {
          column.width = 15;
        } else if (i == 3) { column.width = 50; } else { column.width = 30; }
      }
    }


    worksheet.addRow([]);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    })

  }
}
