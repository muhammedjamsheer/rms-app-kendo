import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PicklistprintService {
  shortdateFormat = environment.shortdateformatpipe;
  detailsarray: any[] = []
  headerdetails: any;
  Picklisttype !: string;
  constructor(
    private datePipe: DatePipe,

  ) { }

  generateContent(exportdata) {
    this.detailsarray = exportdata.griddata;
    this.headerdetails = JSON.parse(localStorage.getItem('headerdata'));
    this.Picklisttype = exportdata.picklisttype
    let content = [
      {
        columns: [
          { width: 70, text: 'Doc Number', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.docNumber, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },

          { width: 70, text: 'Doc Entry', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.docEntry, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },

          { width: 70, text: 'Doc Type', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.docType, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },

          { width: 70, text: 'Doc Status', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.docStatus, style: 'normalText' },
        ],
      }
      , {
        columns: [
          { width: 70, text: 'PickList Number', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.pickListNumber, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },

          { width: 70, text: 'Picked By', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.pickedBy, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },


          { width: 70, text: 'Picked Date', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.pickedDate, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },

          { width: 70, text: 'Document Lines', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.documentLines, style: 'normalText' },
        ]
      }
      , {
        columns: [
          { width: 70, text: 'Fromware House', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.fromWarehouse, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },

          { width: 70, text: 'Toware House', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.toWarehouse, style: 'normalText' },
          { width: 20, text: '', style: 'boldText' },

          { width: 70, text: 'Customer Location', style: 'boldText' },
          { width: 10, text: ':', style: 'normalText' },
          { width: 100, text: this.headerdetails.customerLocation, style: 'normalText' },
        ]
      },
      { text: '', margin: [30, 10, 30, 0] },
      this.getVoucherTable(),
    ]
    return content
  }
  getVoucherTable() {
    if (this.Picklisttype == "picklistsummary") {
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
          widths: [25, 50, 60, "*", 70, 60, 60, 60, 70, 70, 60],
          style: 'table',
          body: [
            [
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
                alignment: 'left',
                style: 'tableHeader'
              },
              {
                text: 'Product Description',
                alignment: 'left',
                style: 'tableHeader'
              },
              {
                text: 'UOM Code',
                style: 'tableHeader',
                alignment: 'left'
              },
              {
                text: 'UOM Qty to Pick',
                style: 'tableHeader',
                alignment: 'left'
              },
              {
                text: 'Picked UOM Qty ',
                style: 'tableHeader',
                alignment: 'left'
              },
              {
                text: 'Available UOM Qty ',
                style: 'tableHeader',
                alignment: 'left'
              },
              {
                text: 'Batch No. ',
                style: 'tableHeader',
                alignment: 'left'
              },
              {
                text: 'Line Status',
                style: 'tableHeader',
                alignment: 'left'
              },
              {
                text: 'From Warehouse',
                style: 'tableHeader',
                alignment: 'left'
              },
            ],
            ...this.detailsarray.map((item, index) => {
              return [
                { text: index + 1, alignment: 'left' },
                { text: item.productId, alignment: 'left' },
                { text: item.productCode, alignment: 'left' },
                { text: item.lineDescription, alignment: 'left' },
                { text: item.uomCode, alignment: 'left' },
                { text: item.uomQtytoPick, alignment: 'left' },
                { text: item.pickedUomQnty, alignment: 'left' },
                { text: item.availableUomQnty, alignment: 'left' },
                { text: item.batchNo, alignment: 'left' },
                { text: item.lineStatus, alignment: 'left' },
                { text: item.fromWarehouse, alignment: 'left' },
              ];
            }),
          ],
        }
      };
    } else {
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
          widths: [25, 80, 125, 50, 70, '*', 60, 60, 70],
          style: 'table',
          body: [
            [
              {
                text: 'Sl No.',
                alignment: 'left',
                style: 'tableHeader'
              },
              {
                text: 'Pick List Number',
                style: 'tableHeader',
                alignment: 'left'
              },
              {
                text: 'Serial Number',
                style: 'tableHeader',
                alignment: 'left'
              },
              {
                text: 'Product Id',
                alignment: 'left',
                style: 'tableHeader'
              },
              {
                text: 'Product Code',
                alignment: 'left',
                style: 'tableHeader'
              },
              {
                text: 'Product Description',
                alignment: 'left',
                style: 'tableHeader'
              },
              {
                text: 'UOM Code',
                style: 'tableHeader',
                alignment: 'left'
              },
              {
                text: 'Batch No. ',
                style: 'tableHeader',
                alignment: 'left'
              },
              {
                text: 'From Warehouse',
                style: 'tableHeader',
                alignment: 'left'
              },
            ],
            ...this.detailsarray.map((item, index) => {
              return [
                { text: index + 1, alignment: 'left' },
                { text: item.pickListNumber, alignment: 'left' },
                { text: item.serialNumber, alignment: 'left' },
                { text: item.productId, alignment: 'left' },
                { text: item.productCode, alignment: 'left' },
                { text: item.lineDescription, alignment: 'left' },
                { text: item.uomCode, alignment: 'left' },
                { text: item.batchNo, alignment: 'left' },
                { text: item.fromWarehouse, alignment: 'left' },
              ];
            }),
          ],
        }
      };
    }
  }
}
