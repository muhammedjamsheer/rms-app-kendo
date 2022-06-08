import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseorderService {

  shortdateFormat = environment.shortdateformatpipe;
  details: any[] = []
  headerdetails: any;
  printtype!: string
  constructor(
    private datePipe: DatePipe,

  ) { }
  generateContent(exportdata) {
    this.details = exportdata.griddata;
    this.headerdetails = exportdata.headerdata;
    this.printtype = exportdata.printtype;
    let content = [
      {
        columns: [
          { width: 70, text: 'PO Number', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.poNumber, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },

          { width: 70, text: 'PO Entry', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.poEntry, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },

          { width: 70, text: 'PO Date', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.datePipe.transform(this.headerdetails.poDate, this.shortdateFormat), style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },

          { width: 70, text: 'PO Due Date', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.datePipe.transform(this.headerdetails.poDueDate, this.shortdateFormat), style: 'normalText' },
        ],
      }
      ,
      { text: '', margin: [30, 10, 30, 0] },
      this.getVoucherTable(),
    ]
    return content
  }
  getVoucherTable() {
    var tablewidth = [25, 60, 60, '*', 60, 60, 60, 60,60,60,60];
    let body = []
    let header = [
      {
        text: 'Sl No.',
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
        text: 'Order Qty',
        style: 'tableHeader',
        alignment: 'left'
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
        text: 'Price',
        style: 'tableHeader',
        alignment: 'left'
      },
      {
        text: 'Price after Vat',
        style: 'tableHeader',
        alignment: 'left'
      },
    ];
    body.push(header);
    for (let index = 0; index < this.details.length; index++) {
      const item = this.details[index];
      var tabledata = [
        { text: index + 1, alignment: 'left', style: 'normalText' },
        { text: item.productId, alignment: 'left', style: 'normalText' },
        { text: item.productCode, alignment: 'left', style: 'normalText' },
        { text: item.poLineDescription, alignment: 'left', style: 'normalText' },
        { text: item.uomCode, alignment: 'left', style: 'normalText' },
        { text: item.uomQnty, alignment: 'left', style: 'normalText' },
        { text: item.orderQty, alignment: 'left', style: 'normalText' },
        { text: item.receivedQnty, alignment: 'left', style: 'normalText' },
        { text: item.pendingQnty, alignment: 'left', style: 'normalText' },
        { text: item.price, alignment: 'left', style: 'normalText' },
        { text: item.priceAfterVAT, alignment: 'left', style: 'normalText' },
      ]
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
