import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { AssetTransferDirectService } from 'src/app/core/service/assettransferdirect.service';
import { SaveAlert } from 'src/app/shared/commonalerts/savealert';
import { AssetTransferDirectModel, AssetTransferVerifyModel } from 'src/app/shared/model/AssetTransferDirectModel';
import { AssetTransferLineItemModel } from 'src/app/shared/model/AssetTransferLineItemModel';
import { AssetTransferRequestModel } from 'src/app/shared/model/AssetTransferRequestModel';

@Component({
  selector: 'org-fat-assettransferverification',
  templateUrl: './assettransferverification.component.html',
  styleUrls: ['./assettransferverification.component.css']
})
export class AssettransferverificationComponent implements OnInit {

  @ViewChild('agGrid') agGrid!: AgGridAngular;
  transferRequestVerificationForm: FormGroup;
  submitted = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;  
  error = '';
  errorRequest = '';
  editMode: boolean = false;
  requestData!: AssetTransferDirectModel;
  assetTransferRequestModel: AssetTransferRequestModel = new AssetTransferRequestModel;
  rowRequestData!: AssetTransferLineItemModel[];
  columnRequestDefs: any;
  gridApi: any;
  gridColumnApi: any;
  requestNo: string ='';
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private assetTransferRequestService: AssetTransferDirectService,
    private saveAlert: SaveAlert) { 
      this.transferRequestVerificationForm = this.formBuilder.group({
        
      });
    }

  ngOnInit(): void {
    this.rowRequestData = [];
    this.columnRequestDefs = [
      { headerName: 'Serial No',  field: 'serialNo', sortable: true, filter: true , width: 150,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true},
      { field: 'assetCategoryId', sortable: true, filter: true, hide: true },
      { headerName: 'Category Code',  field: 'assetCategoryCode', sortable: true, filter: true , width: 150},
      { headerName: 'Category Name', field: 'assetCategoryName', sortable: true, filter: true , width: 150},
      { field: 'assetSubCategoryId', sortable: true, filter: true, hide: true },
      { headerName: 'Sub Category Code', field: 'assetSubCategoryCode', sortable: true, filter: true , width: 150},
      { headerName: 'Sub Category Name', field: 'assetSubCategoryName', sortable: true, filter: true , width: 150},
      { field: 'productId', sortable: true, filter: true, hide: true },
      { headerName: 'Product Code', field: 'productCode', sortable: true, filter: true, width: 150 },
      { headerName: 'Product Name', field: 'productName', sortable: true, filter: true, width: 150 },
      { field: 'productDescription', sortable: true, filter: true, width: 200 }     
    ];

    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {        
        this.requestNo = params['id'];
        this.editMode = true;
        this.assetTransferRequestService.getAssetTransferDirectByKey(this.requestNo).subscribe( res => {
          this.requestData = res;
          this.ShowEditViewAssetVerification(this.requestData);
        });
      } else {
        this.editMode = false;
      }
    });

  }
  isAddedGridRowSelected=false;
  onDataGridSelectionChanged(event: any) {
    this.isAddedGridRowSelected = true;
    let selectedNodes = this.agGrid.api.getSelectedNodes();
    let selectedData = selectedNodes.map<AssetTransferLineItemModel>(node => node.data);
    if(selectedData.length<=0)
    {
      this.isAddedGridRowSelected = false;
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  ShowEditViewAssetVerification(data: AssetTransferDirectModel) {      
    this.rowRequestData = data.lines;    
    this.UpdateRequestSubGridRows();
  }

  private UpdateRequestSubGridRows() {
    this.gridApi.setRowData(this.rowRequestData);
    this.gridApi.redrawRows();
  }

  ShowGrid()
  {
    this.router.navigateByUrl('/transfer');
  }

  ApproveTransferRequest(status: number) {
    this.submitted = true;
    this.error = '';
    // stop here if form is invalid
    if (this.transferRequestVerificationForm.invalid) {
      return;
    }
    if (!(this.rowRequestData.length > 0)) {
      this.error = 'No line items found to transfer';
      return;
    }

    let selectedNodes = this.agGrid.api.getSelectedNodes();
    let selectedData = selectedNodes.map<AssetTransferLineItemModel>(node => node.data);
    if(selectedData.length<=0)
    {
      this.error='Please select atleast one row';
      return;
    }

    let saveResponse: Observable<any>;
    var assetverifyModel:AssetTransferVerifyModel=new AssetTransferVerifyModel;
    assetverifyModel.transferNo=this.requestNo;
    assetverifyModel.status=50;
    assetverifyModel.verificationRemark='';
    selectedData.forEach(element => {
      assetverifyModel.serialNos.push(element.serialNo);
    });
    saveResponse = this.assetTransferRequestService.ApproveRequest(assetverifyModel);
    saveResponse.subscribe(
      async result => {
        this.saveAlert.SuccessMessage();
        this.submitted = false;
        var cacheData=this.assetTransferRequestService.getAssetTransferDirect();
        var transferData=(await cacheData).filter(p=>p.transferNo==this.requestNo)[0];
        if(transferData!=null)
        {
          transferData.status=50;
          transferData.statusText='Transfer Approved'
        }
        this.assetTransferRequestService.AddOrEditRecordToCache(transferData,true);
        this.ShowGrid();
      },
      err => {
        this.error = err.error ? err.error : err.message;
        this.loading = false;
      }
    );
  }

}
