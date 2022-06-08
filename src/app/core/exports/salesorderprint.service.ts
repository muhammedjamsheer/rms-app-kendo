import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesorderprintService {
  shortdateFormat = environment.shortdateformatpipe;
  sodetails: any[] = []
  headerdetails: any;
  constructor(
    private datePipe: DatePipe,
  ) { }

  generateContent(exportdata) {
    this.sodetails = exportdata.griddata;
    this.headerdetails = JSON.parse(localStorage.getItem('headerdata'));
    let content = [
      {
        columns: [
          { width: 70, text: 'So Number', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.soNumber, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },

          { width: 70, text: 'So Entry', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.soEntry, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },

          { width: 70, text: 'So Date', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.datePipe.transform(this.headerdetails.soDate, this.shortdateFormat), style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },

          { width: 70, text: 'So Duedate', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.datePipe.transform(this.headerdetails.soDueDate, this.shortdateFormat), style: 'normalText' },
        ],
      }
      , {
        columns: [
          { width: 70, text: 'Card Code', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.cardCode, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },

          { width: 70, text: 'Card Name', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.cardName, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },


          { width: 70, text: 'Vendor Name', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.vendorName, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },

          { width: 70, text: 'Warehouse', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.warehouse, style: 'normalText' },
        ]
      }
      , {
        columns: [
          { width: 70, text: 'Doc Status', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.docStatus, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },

          { width: 70, text: 'Customer Location', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.customerLocation, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },
        ]
      },
      { text: '', margin: [30, 10, 30, 0] },
      this.getVoucherTable(),
    ]
    return content
  }

  getVoucherTable() {
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
        widths: [25, 60, 60, "*", 60, 60, 60, 60, 60],
        style: 'table',
        body: [
          [
            {
              text: 'Sl No.',
              alignment: 'left',
              style: 'tableHeader'
            },
            {
              text: 'SO Line No',
              alignment: 'left',
              style: 'tableHeader'
            },
            {
              text: 'Product Code',
              alignment: 'left',
              style: 'tableHeader'
            },
            {
              text: 'SO Line Description',
              alignment: 'left',
              style: 'tableHeader'
            },
            {
              text: 'Available Qty',
              style: 'tableHeader',
              alignment: 'left'
            },
            {
              text: 'Open Qty',
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
              text: 'Price',
              style: 'tableHeader',
              alignment: 'left'
            },
          ],
          ...this.sodetails.map((item, index) => {
            return [
              { text: index + 1, alignment: 'left' },
              { text: item.soLineNumber, alignment: 'left' },
              { text: item.productCode, alignment: 'left' },
              { text: item.soLineDescription, alignment: 'left' },
              { text: item.availableQnty, alignment: 'left' },
              { text: item.openQty, alignment: 'left' },
              { text: item.uomCode, alignment: 'left' },
              { text: item.uomQty, alignment: 'left' },
              { text: item.price, alignment: 'left' },
            ];
          }),
        ],
      }
    };
  }
}
