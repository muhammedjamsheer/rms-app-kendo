import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PicklistService } from '../../../../core/service/picklist.service';
import { DatePipe } from '@angular/common';
import { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { Subscription, Observable } from 'rxjs';
import { ExportService } from '../../../../core/exports/export.service';

@Component({
  selector: 'org-rms-picklistform',
  templateUrl: './picklistform.component.html',
  styleUrls: ['./picklistform.component.css']
})
export class PicklistformComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  selectedHeader: any;
  subscription!: Subscription;
  pickListNumber!: number;
  picklistType!: string;
  loading: boolean = false;
  details: any;
  itemLines: any[] = [];
  detailsForm!: FormGroup;
  totalGridCount: number = 0
  screenname!: string;
  isPicklistsummary: boolean = false;
  isPicklistdetails: boolean = false;
  columnDefs: ColDef[] = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private picklistService: PicklistService,
    private formBuilder: FormBuilder,
    private saveAlert: SaveAlert,
    private datePipe: DatePipe,
    private exportService: ExportService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.pickListNumber = Number(params['id']);
        this.picklistType = params['state'];
      }
    });
    this.getscreendetails()
    this.getPicklistdetails();
  }
  getscreendetails() {
    switch (this.picklistType) {
      case 'summary': {
        this.screenname = 'Picklist Summary';
        this.isPicklistsummary = true;
        this.columnDefs = [
          {
            field: 'productId', sortable: true, filter: true, resizable: true,
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
            checkboxSelection: true,
            width: 250
          },
          { field: 'productCode', sortable: true, resizable: true, filter: true, },
          { field: 'lineDescription', headerName: "Product Description", sortable: true, resizable: true, filter: true, },
          { field: 'uomCode', sortable: true, resizable: true, filter: true },
          { field: 'uomQtytoPick', sortable: true, resizable: true, filter: true },
          { field: 'pickedUomQnty', sortable: true, resizable: true, filter: true, },
          { field: 'availableUomQnty', sortable: true, resizable: true, filter: true, },
          { field: 'batchNo', sortable: true, resizable: true, filter: true, },
          { field: 'lineStatus', sortable: true, resizable: true, filter: true, },
          { field: 'fromWarehouse', sortable: true, resizable: true, filter: true, },
        ];
        break;
      }

      // seraialno, pdtid,pdtcode,linedesc,fromwr,uomcode,batchno,picklistno
      case 'details': {
        this.screenname = 'Picklist Details';
        this.isPicklistdetails = true;
        this.columnDefs = [
          {
            field: 'pickListNumber', sortable: true, filter: true, resizable: true,
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
            checkboxSelection: true,
            width: 250
          },
          { field: 'serialNumber', sortable: true, resizable: true, filter: true },
          { field: 'productId', sortable: true, resizable: true, filter: true, },
          { field: 'productCode', sortable: true, resizable: true, filter: true, },
          { field: 'lineDescription', headerName: "Product Description", sortable: true, resizable: true, filter: true, },
          { field: 'uomCode', sortable: true, resizable: true, filter: true },
          { field: 'batchNo', sortable: true, resizable: true, filter: true, },
          { field: 'fromWarehouse', sortable: true, resizable: true, filter: true, },
        ];
        break;
      }
    }
  }
  getPicklistdetails() {
    this.loading = true
    let saveResponse: Observable<any>;
    if (this.isPicklistsummary) {
      saveResponse = this.picklistService.getPicklistsummary(this.pickListNumber);
    } else {
      saveResponse = this.picklistService.getPicklistdetails(this.pickListNumber);
    }
    saveResponse.subscribe({
      next: (data: any[]) => {
        this.itemLines = data;
        this.totalGridCount = this.itemLines.length;
      },
      error: (err => { console.error(err) }),
      complete: () => { this.loading = false; }
    });
  }
  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
  }
  getPDF() {
    var data = {
      headerdata: null,
      griddata: this.itemLines,
      printtype: 'picklist',
      title: this.screenname,
      picklisttype: this.isPicklistsummary ? 'picklistsummary' : 'picklistdetail',
    }
    this.exportService.generatePdf(data);
  }
}
