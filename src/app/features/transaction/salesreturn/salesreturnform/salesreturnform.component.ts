import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesreturnService } from '../../../../core/service/salesreturn.service';
import { ColDef, ValueParserParams } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { Subscription } from 'rxjs';
import { PicklistService } from '../../../../core/service/picklist.service';
import { ExportService } from '../../../../core/exports/export.service';
import { CustomerMasterService } from '../../../../core/service/customermaster.service';
import { CommonService } from 'src/app/core/service/common.service';

@Component({
  selector: 'org-rms-salesreturnform',
  templateUrl: './salesreturnform.component.html',
  styleUrls: ['./salesreturnform.component.css']
})
export class SalesreturnformComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  screenName!: string;
  State!: string;
  Soid!: number;
  salesorderreturndata: any[] = []
  columnDefs: ColDef[] = [
    {
      headerName: 'ProductId', field: 'productId', sortable: true, filter: true, resizable: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true
    },
    { field: 'soLineNumber', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'productCode', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'soLineDescription', sortable: true, resizable: true, filter: true, width: 250 },
    { field: 'availableQnty', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'openQty', sortable: true, resizable: true, filter: true, width: 150 },
    {
      field: 'qntyToPick', headerName: "No. of Qty to pick", sortable: true, resizable: true, filter: true, width: 150, editable: true,
      singleClickEdit: true,
      valueParser: params => this.commonService.formatIntoNumericvalues(params.newValue),
      cellStyle: params => {
        return { backgroundColor: '#bed3d7' };
      },
    },
    { field: 'uomCode', sortable: true, resizable: true, filter: true },
    { field: 'uomQty', sortable: true, resizable: true, filter: true },
    {
      field: 'uomQntyToPick', headerName: "No. of UOM Qty to pick", sortable: true, resizable: true, filter: true, width: 150, editable: true,
      singleClickEdit: true,
      valueParser: params => this.commonService.formatIntoNumericvalues(params.newValue),
      cellStyle: params => {
        return { backgroundColor: '#bed3d7' };
      },
    },
    { field: 'price', sortable: true, resizable: true, filter: true },
    { field: 'warehouseCode', sortable: true, resizable: true, filter: true }


  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private salesreturnService: SalesreturnService,
    private formBuilder: FormBuilder,
    private saveAlert: SaveAlert,
    private exportService: ExportService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.State = params['state'];
      this.Soid = Number(params['id']);
    });

    this.getSalesReturnDetails();
  }


  getSalesReturnDetails() {
    this.salesorderreturndata = []
    this.salesreturnService.getSalesOrderReturndetails(this.Soid).subscribe({
      next: (data: any[]) => {
        if (data != null && data.length > 0) {
          this.salesorderreturndata = data;
        }
      },
      error: (err => { }),
      complete: () => { }
    });
  }

  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
  }

}
