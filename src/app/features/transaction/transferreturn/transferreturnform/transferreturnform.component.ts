import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferreturnService } from 'src/app/core/service/transferreturn.service';
import { ColDef, ValueParserParams } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SaveAlert } from 'src/app/shared/commonalerts/savealert';
import { Subscription } from 'rxjs';
import { PicklistService } from 'src/app/core/service/picklist.service';
import { ExportService } from 'src/app/core/exports/export.service';
import { CustomerMasterService } from 'src/app/core/service/customermaster.service';
import { CommonService } from 'src/app/core/service/common.service';

@Component({
  selector: 'org-rms-transferreturnform',
  templateUrl: './transferreturnform.component.html',
  styleUrls: ['./transferreturnform.component.css']
})
export class TransferreturnformComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  screenName!: string;
  State!: string;
  Sonumber !: number;
  Soid!: number;
  transferreturndata:any[]=[]

  columnDefs: ColDef[] = [
    {
      headerName: 'ProductId', field: 'productId', sortable: true, filter: true, resizable: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true
    },
    { field: 'toLineNumber', sortable: true, resizable: true, filter: true },
    { field: 'productCode', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'toLineDescription', sortable: true, resizable: true, filter: true, width: 250  },
    { field: 'availableQnty', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'orderQty', sortable: true, resizable: true, filter: true },
    {
      field: 'qntyToPick', headerName: "No. of Qty to pick", sortable: true, resizable: true, filter: true, width: 150, editable: true,
      singleClickEdit: true,
      cellStyle: params => {
        return { backgroundColor: '#bed3d7' };
      }
    },
    { field: 'uomCode', sortable: true, resizable: true, filter: true, width: 150 },
    { field: 'uomQty', sortable: true, resizable: true, filter: true },
    {
      field: 'uomQntyToPick', headerName: "No. of UOM Qty to pick", sortable: true, resizable: true, filter: true, width: 150, editable: true, singleClickEdit: true,
      cellStyle: params => {
        return { backgroundColor: '#bed3d7' };
      }
    },
    { field: 'warehouseCode', sortable: true, resizable: true, filter: true },
    { field: 'docStatus', sortable: true, resizable: true, filter: true },
    { field: 'journalMemo', sortable: true, resizable: true, filter: true },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private transferreturnService: TransferreturnService,
    private formBuilder: FormBuilder,
    private saveAlert: SaveAlert,
    private exportService: ExportService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.State = params['state'];
      if (params['state'] === 'view' && params['id'] != undefined) {
        this.Sonumber = Number(params['id']);
      }
      if (params['state'] === 'summary' && params['id'] != undefined) {
        this.Soid = Number(params['id']);
      }
    });
    if (this.State === 'view') {
      this.screenName = "Transfer Return Details"
      this.getTransferReturnDetails();
    }
  }


  getTransferReturnDetails() {
    this.transferreturndata = []
    this.transferreturnService.getTransferReturndetails(this.Sonumber).subscribe({
      next: (data: any[]) => {
        if (data != null && data.length > 0) {
          this.transferreturndata = data;
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
