import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReceiptprintService {
  shortdateFormat = environment.shortdateformatpipe;
  details: any[] = []
  headerdetails: any;
  printtype!: string
  Receipttype!: string
  constructor(
    private datePipe: DatePipe,

  ) { }
  generateContent(exportdata) {
    this.details = exportdata.griddata;
    this.headerdetails = exportdata.headerdata;
    this.printtype = exportdata.printtype;
    this.Receipttype = exportdata.Receipttype
    let content = [
      {
        columns: [
          { width: 70, text: 'Receipt Id', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.receiptId, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },

          { width: 70, text: 'Ref Doc Type', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.refDocumentType, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },

          { width: 70, text: 'Ref Doc No.', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.refDocumentNo, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },

          { width: 70, text: 'Ref Doc Date', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.datePipe.transform(this.headerdetails.refDocumentDate, this.shortdateFormat), style: 'normalText' },
        ],
      }
      , {
        columns: [
          { width: 70, text: 'Receipt Date', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.datePipe.transform(this.headerdetails.receiptDate, this.shortdateFormat), style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },
          { width: 70, text: 'Receipt Status', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.receiptStatusText, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },
          { width: 70, text: 'Receipt Type', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: '', style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },
        ]
      },
      { text: '', margin: [30, 10, 30, 0] },
      this.getVoucherTable(),
    ]
    return content
  }
  getVoucherTable() {
    var tablewidth = [25, 125, 60, 60, "*", 60, 60, 60, 80]
    if (this.Receipttype == 'summary') {
      tablewidth = [25, 60, 60, "*", 50, 60, 50, 60, 60, 50, 65]
    }
    let body = []
    let header = [
      {
        text: 'Sl No.',
        alignment: 'left',
        style: 'tableHeader'
      },
      {
        text: 'Serial No.',
        alignment: 'left',
        style: 'tableHeader'
      },
      {
        text: 'Product Id',
        alignment: 'left',
        style: 'tableHeader'
      },
      {
        text: 'Product Code',
        style: 'tableHeader',
        alignment: 'left'
      },
      {
        text: 'Product Description',
        style: 'tableHeader',
        alignment: 'left'
      },
      {
        text: 'Order Qty',
        alignment: 'left',
        style: 'tableHeader'
      },
      {
        text: 'Received Qty',
        style: 'tableHeader',
        alignment: 'left'
      },
      {
        text: 'Pending Qty',
        style: 'tableHeader',
        alignment: 'left'
      },
      {
        text: 'Batch No.',
        style: 'tableHeader',
        alignment: 'left'
      },
      {
        text: 'UOM Code',
        style: 'tableHeader',
        alignment: 'left'
      },
      {
        text: 'UOM Qty',
        style: 'tableHeader',
        alignment: 'left'
      },
      {
        text: 'Purchase Price',
        style: 'tableHeader',
        alignment: 'left'
      },
    ];
    if (this.Receipttype == 'summary') {
      header.splice(1, 1)
    }else{
      header.splice(5, 3)
    }

    debugger;
    body.push(header);
    for (let index = 0; index < this.details.length; index++) {
      const item = this.details[index];
      var tabledata = [
        { text: index + 1, alignment: 'left', style: 'normalText' },
        { text: item.serialNo, alignment: 'left', style: 'normalText' },
        { text: item.productId, alignment: 'left', style: 'normalText' },
        { text: item.productCode, alignment: 'left', style: 'normalText' },
        { text: item.productDescription, alignment: 'left', style: 'normalText' },
        { text: item.orderQnty, alignment: 'left', style: 'normalText' },
        { text: item.receivedQnty, alignment: 'left', style: 'normalText' },
        { text: item.pendingQnty, alignment: 'left', style: 'normalText' },
        { text: item.batchNo, alignment: 'left', style: 'normalText' },
        { text: item.uomCode, alignment: 'left', style: 'normalText' },
        { text: item.uomQnty, alignment: 'left', style: 'normalText' },
        { text: item.purchasePrice, alignment: 'left', style: 'normalText' },
      ]
      if (this.Receipttype == 'summary') {
        tabledata.splice(1, 1)
      }else{
        tabledata.splice(5, 3)
      }
      body.push(tabledata);
    }


    return {
      layout: {
        hLineColor: function (i, node) {
          return (i === 0 || i === 1 || i === node.table.body.length) ? 'black' : '#ccc';
        },
        hLineStyle: function (i, node) {
          if (i === 0 || i === 1 || i === node.table.body.length) {
            return null;
          }
          return { dash: { length: 2, space: 2 } };
        },
        hLineWidth: function (i, node) {
          return 0.5;
        },
        vLineColor: function (i, node) {
          return '#fff';
        },
        vLineWidth: function (i, node) {
          return 0;
        }
      },
      style: 'table',
      table: {
        headerRows: 1,
        margin: [10, 100, 10, 20],
        widths: tablewidth,
        style: 'table',
        body: body
      }
    };
  }
}
