
import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { Subscription } from 'rxjs';
import { AssetMaintenanceService } from 'src/app/core/service/assetmaintenance.service';
import { AdditionalCostDetailsService } from '../../../core/service/additionalcostdetails.service';
import { AssetAuditService } from '../../../core/service/assetaudit.service';
import { AssetCategoryMasterService } from '../../../core/service/assetcategorymaster.service';
import { AssetRegisterService } from '../../../core/service/assetregister.service';
import { AssetSubCategoryMasterService } from '../../../core/service/assetsubcategorymaster.service';
import { AssetTransferDirectService } from '../../../core/service/assettransferdirect.service';
import { AssetTransferRequestService } from '../../../core/service/assettransferrequest.service';
import { AssetVerificationService } from '../../../core/service/assetverification.service';
import { BrandmasterService } from '../../../core/service/brandmaster.service';
import { BrandmodelmasterService } from '../../../core/service/brandmodelmaster.service';
import { BuildingmasterService } from '../../../core/service/buildingmaster.service';
import { CommonValueListService } from '../../../core/service/commonlistvalue.service';
import { DepartmentmasterService } from '../../../core/service/departmentmaster.service';
import { EmployeeMasterService } from '../../../core/service/employeemaster.service';
import { FloormasterService } from '../../../core/service/floormaster.service';
import { InsuranceDetailsService } from '../../../core/service/insurancedetails.service';
import { LocationmasterService } from '../../../core/service/locationmaster.service';
import { ProductMasterService } from '../../../core/service/productmaster.service';
import { ReceiptMasterService } from '../../../core/service/receiptmaster.service';
import { RoommasterService } from '../../../core/service/roommaster.service';
import { SitemasterService } from '../../../core/service/sitemaster.service';
import { SupplierMasterService } from '../../../core/service/suppliermaster.service';
import { WarrantyDetailsService } from '../../../core/service/warrantydetails.service';
import { LoanService } from '../../../core/service/loan.service';
import { CustomerMasterService } from '../../../core/service/customermaster.service';
import { UserMasterService } from '../../../core/service/usermaster.service';
import { DatePipe } from '@angular/common';
import { userrolemasterservice } from 'src/app/core/service/userrolemaster.service';
import { SalesorderService } from '../../../core/service/salesorder.service';
import { SalesreturnService } from 'src/app/core/service/salesreturn.service';
import { PrintLabelService } from 'src/app/core/service/printlabel.service';
import { PicklistService } from 'src/app/core/service/picklist.service';
import { ShipmentService } from 'src/app/core/service/shipment.service';
import { TransferorderService } from 'src/app/core/service/transferorder.service';
import { InventoryService } from 'src/app/core/service/inventory.service';
import { WarehousemasterService } from 'src/app/core/service/warehousemaster.service';
import { ProductionorderService } from 'src/app/core/service/productionorder.service';
import { InboundService } from 'src/app/core/service/inbound.service';
import { TransferreturnService } from 'src/app/core/service/transferreturn.service';
@Component({
  selector: 'org-fat-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  @Input() entity: string = '';
  @Output() totalGriditems = new EventEmitter<number>();
  @Output() gridData = new EventEmitter<any[]>();
  isRowUnSelected: boolean = true;
  rowData: any[] = [];
  columnDefs: any;
  subscription!: Subscription;
  datepipe: DatePipe = new DatePipe('en-US');
  constructor(private router: Router,
    private siteMasterService: SitemasterService,
    private buildingMasterService: BuildingmasterService,
    private floorMasterService: FloormasterService,
    private roomMasterService: RoommasterService,
    private locationMasterService: LocationmasterService,
    private departmentMasterService: DepartmentmasterService,
    private brandMasterService: BrandmasterService,
    private brandmodelMasterService: BrandmodelmasterService,
    private assetCategoryMasterService: AssetCategoryMasterService,
    private assetSubCategoryMasterService: AssetSubCategoryMasterService,
    private employeeMasterService: EmployeeMasterService,
    private commonValueListService: CommonValueListService,
    private supplierMasterService: SupplierMasterService,
    private receiptMasterService: ReceiptMasterService,
    private productMasterService: ProductMasterService,
    private assetRegisterService: AssetRegisterService,
    private assetVerificationService: AssetVerificationService,
    private warrantyDetailsService: WarrantyDetailsService,
    private insuranceDetailsService: InsuranceDetailsService,
    private additionalCostDetailsService: AdditionalCostDetailsService,
    private assetAuditService: AssetAuditService,
    private assetTransferDirectService: AssetTransferDirectService,
    private assetTransferRequestService: AssetTransferRequestService,
    private assetMaintenanceService: AssetMaintenanceService,
    private loanService: LoanService,
    private customerMasterService: CustomerMasterService,
    private userMasterService: UserMasterService,
    private userroleMasterService: userrolemasterservice,
    private salesorderService: SalesorderService,
    private salesreturnService: SalesreturnService,


    private printLabelService: PrintLabelService,
    private picklistService: PicklistService,
    private shipmentService: ShipmentService,
    private transferorderService: TransferorderService,
    private transferreturnService: TransferreturnService,
    

    private inventoryService: InventoryService,
    private warehousemasterService: WarehousemasterService,
    private productionorderService: ProductionorderService,
    private inboundService: InboundService,
  ) {
    this.subscription = new Subscription;


  }
  dateAsString!: Date;



  // HELPER FOR DATE COMPARISON


  function(filterLocalDateAtMidnight: any, cellValue: any) {
    if (cellValue == null || cellValue == undefined) {
      return 0;
    }
    var dateVal = new Date(cellValue);
    if (dateVal)
      cellValue = `${dateVal.getDate().toString().padStart(2, '0')}/${(dateVal.getMonth() + 1).toString().padStart(2, '0')}/${dateVal.getFullYear()}`;
    var dateParts = cellValue.split('/');
    var year = Number(dateParts[2]);
    var month = Number(dateParts[1]) - 1;
    var day = Number(dateParts[0]) + 1;
    var cellDate = new Date(year, month, day);
    var cellDateTo = new Date(filterLocalDateAtMidnight);
    if (cellDateTo) {
      var dateto = new Date(filterLocalDateAtMidnight);
      if (dateto)
        filterLocalDateAtMidnight = `${dateto.getDate().toString().padStart(2, '0')}/${(dateto.getMonth() + 1).toString().padStart(2, '0')}/${dateto.getFullYear()}`;
      var dateParts = filterLocalDateAtMidnight.split('/');
      var year = Number(dateParts[2]);
      var month = Number(dateParts[1]) - 1;
      var day = Number(dateParts[0]);
      cellDateTo = new Date(year, month, day);
      // filterLocalDateAtMidnight=cellDateTo;
    }

    console.log(cellValue);
    console.log(filterLocalDateAtMidnight);
    if (cellValue < filterLocalDateAtMidnight) {
      return -1;
    } else if (cellValue > filterLocalDateAtMidnight) {
      return 1;
    } else {
      return 0;
    }
  }


  async ngOnInit() {

    //this.agGrid.api.sizeColumnsToFit();

    switch (this.entity) {
      case 'sitemaster': {
        this.columnDefs = [
          { field: 'siteID', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 100 },
          { field: 'siteCode', sortable: true, resizable: true, filter: true },
          { field: 'siteName', sortable: true, resizable: true, filter: true },
          { field: 'addressLine1', sortable: true, resizable: true, filter: true },
          { field: 'addressLine2', sortable: true, resizable: true, filter: true },
          { field: 'city', sortable: true, resizable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }

        ]

        this.rowData = await this.siteMasterService.getSiteMaster();
        this.subscription = this.siteMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'buildingmaster': {
        this.columnDefs = [
          { field: 'buildingID', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 100 },
          { field: 'buildingCode', sortable: true, resizable: true, filter: true },
          { field: 'buildingName', sortable: true, resizable: true, filter: true },
          { field: 'siteCode', sortable: true, resizable: true, filter: true },
          { field: 'siteName', sortable: true, resizable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.buildingMasterService.getBuildingMaster();

        this.subscription = this.buildingMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'floormaster': {
        this.columnDefs = [
          { field: 'floorID', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 100 },
          { field: 'floorCode', sortable: true, resizable: true, filter: true },
          { field: 'floorName', sortable: true, resizable: true, filter: true },
          { field: 'siteCode', sortable: true, resizable: true, filter: true },
          { field: 'siteName', sortable: true, resizable: true, filter: true },
          { field: 'buildingCode', sortable: true, resizable: true, filter: true },
          { field: 'buildingName', sortable: true, resizable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.floorMasterService.getFloorMaster();

        this.subscription = this.floorMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'roommaster': {
        this.columnDefs = [
          { field: 'roomID', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 100 },
          { field: 'roomCode', sortable: true, resizable: true, filter: true },
          { field: 'roomName', sortable: true, resizable: true, filter: true },
          { field: 'siteCode', sortable: true, resizable: true, filter: true },
          { field: 'siteName', sortable: true, resizable: true, filter: true },
          { field: 'buildingCode', sortable: true, resizable: true, filter: true },
          { field: 'buildingName', sortable: true, resizable: true, filter: true },
          { field: 'floorCode', sortable: true, resizable: true, filter: true },
          { field: 'floorName', sortable: true, resizable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.roomMasterService.getRoomMaster();

        this.subscription = this.roomMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'locationmaster': {
        this.columnDefs = [
          { field: 'locationID', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 100 },
          { field: 'locationCode', sortable: true, resizable: true, filter: true },
          { field: 'locationName', sortable: true, resizable: true, filter: true },
          { field: 'siteCode', sortable: true, resizable: true, filter: true },
          { field: 'siteName', sortable: true, resizable: true, filter: true },
          { field: 'buildingCode', sortable: true, resizable: true, filter: true },
          { field: 'buildingName', sortable: true, resizable: true, filter: true },
          { field: 'floorCode', sortable: true, resizable: true, filter: true },
          { field: 'floorName', sortable: true, resizable: true, filter: true },
          { field: 'roomCode', sortable: true, resizable: true, filter: true },
          { field: 'roomName', sortable: true, resizable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.locationMasterService.getLocationMaster();

        this.subscription = this.locationMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'warehousemaster': {
        this.columnDefs = [
          { field: 'warehouseID', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 100 },
          { field: 'warehouseCode', sortable: true, resizable: true, filter: true },
          { field: 'warehouseName', sortable: true, resizable: true, filter: true },
          { field: 'companyName', sortable: true, resizable: true, filter: true },
        ];
        this.rowData = await this.warehousemasterService.getWarehouseMaster();
        this.subscription = this.locationMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'departmentmaster': {
        this.columnDefs = [
          { field: 'departmentID', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 100 },
          { field: 'departmentCode', sortable: true, resizable: true, filter: true },
          { field: 'departmentName', sortable: true, resizable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.departmentMasterService.getDepartmentMaster();

        this.subscription = this.departmentMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'brandmaster': {
        this.columnDefs = [
          { field: 'brandID', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 100 },
          { field: 'brandCode', sortable: true, resizable: true, filter: true },
          { field: 'brandName', sortable: true, resizable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.brandMasterService.getBrandMaster();

        this.subscription = this.brandMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'modelmaster': {
        this.columnDefs = [
          { field: 'modelID', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 100 },
          { field: 'modelCode', sortable: true, resizable: true, filter: true },
          { field: 'modelName', sortable: true, resizable: true, filter: true },
          { field: 'brandCode', sortable: true, resizable: true, filter: true },
          { field: 'brandName', sortable: true, resizable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.brandmodelMasterService.getBrandmodelMaster();

        this.subscription = this.brandmodelMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'assetcategorymaster': {
        this.columnDefs = [
          { headerName: 'Category ID', field: 'assetCategoryId', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 100 },
          { headerName: 'Category Code', field: 'assetCategoryCode', sortable: true, resizable: true, filter: true },
          { headerName: 'Category Name', field: 'assetCategoryName', sortable: true, resizable: true, filter: true },
          { headerName: 'Category Short Code', field: 'assetCategoryShortCode', sortable: true, resizable: true, filter: true },
          { headerName: 'Depreciation Period', field: 'categoryDepreciationPeriod', sortable: true, resizable: true, filter: true },
          { headerName: 'Depreciation Percent', field: 'categoryDepreciationPercent', sortable: true, resizable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.assetCategoryMasterService.getAssetCategoryMaster();

        this.subscription = this.assetCategoryMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'assetsubcategorymaster': {
        this.columnDefs = [
          { headerName: 'Sub Category ID', field: 'assetSubCategoryId', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 100 },
          { headerName: 'Sub Category Code', field: 'assetSubCategoryCode', sortable: true, resizable: true, filter: true },
          { headerName: 'Sub Category Name', field: 'assetSubCategoryName', sortable: true, resizable: true, filter: true },
          { headerName: 'Sub Category Short Code', field: 'assetSubCategoryShortCode', sortable: true, resizable: true, filter: true },
          { headerName: 'Category Code', field: 'assetCategory.assetCategoryCode', sortable: true, resizable: true, filter: true },
          { headerName: 'Category Name', field: 'assetCategory.assetCategoryName', sortable: true, resizable: true, filter: true },
          { headerName: 'Category Short Code', field: 'assetCategory.assetCategoryShortCode', sortable: true, resizable: true, filter: true },
          { headerName: 'Depreciation Period', field: 'subCategoryDepreciationPeriod', sortable: true, resizable: true, filter: true },
          { headerName: 'Depreciation Percent', field: 'subCategoryDepreciationPercent', sortable: true, resizable: true, filter: true },
          {
            headerName: 'Taggable', field: 'nonTag', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanNonTagCellRenderer
          },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.assetSubCategoryMasterService.getAssetSubCategoryMaster();

        this.subscription = this.assetSubCategoryMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'employeemaster': {
        this.columnDefs = [
          { field: 'employeeId', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 100 },
          { field: 'employeeCode', sortable: true, resizable: true, filter: true },
          { field: 'firstName', sortable: true, resizable: true, filter: true },
          { field: 'lastName', sortable: true, resizable: true, filter: true },
          { field: 'designation', sortable: true, resizable: true, filter: true },
          { field: 'contactNumber', sortable: true, resizable: true, filter: true },
          { field: 'emailAddress', sortable: true, resizable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.employeeMasterService.getEmployeeMaster();

        this.subscription = this.employeeMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'commonvaluelistmaster': {
        this.columnDefs = [
          { field: 'listName', sortable: true, resizable: true, filter: true, checkboxSelection: false },
          { field: 'value', sortable: true, resizable: true, filter: true },
          { field: 'displayText', sortable: true, resizable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.commonValueListService.getCommonValueListMaster();

        this.subscription = this.commonValueListService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'suppliermaster': {
        this.columnDefs = [
          { field: 'supplierId', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 150 },
          { field: 'supplierCode', sortable: true, resizable: true, filter: true },
          { field: 'supplierName', sortable: true, resizable: true, filter: true },
          { field: 'supplierGroup', sortable: true, resizable: true, filter: true },
          { field: 'trnNo', headerName: "TRN NO", sortable: true, resizable: true, filter: true },
          { field: 'contactPerson', sortable: true, resizable: true, filter: true },
          { field: 'addressLine1', sortable: true, resizable: true, filter: true },
          // { field: 'addressLine2', sortable: true, resizable: true, filter: true },
          // { field: 'contactPersonDesignation', sortable: true, resizable: true, filter: true },
          // { field: 'contactNumber', sortable: true, resizable: true, filter: true },
          // { headerName: 'Contact Email', field: 'contactemail', sortable: true, resizable: true, filter: true },
          // { field: 'supplierWebsite', sortable: true, resizable: true, filter: true },
          // { field: 'supplierLocationLatitude', sortable: true, resizable: true, filter: true },
          // { field: 'supplierLocationLongitude', sortable: true, resizable: true, filter: true },
          // {
          //   headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
          //   cellRenderer: this.booleanCellRenderer
          // }
        ];

        this.rowData = await this.supplierMasterService.getSupplierMaster();

        this.subscription = this.supplierMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'receiptmaster': {
        this.columnDefs = [
          { field: 'receiptId', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 150 },
          { field: 'refDocumentType', sortable: true, resizable: true, filter: true },
          { field: 'refDocumentNo', sortable: true, resizable: true, filter: true },
          { field: 'grn', headerName: "GRN", sortable: true, resizable: true, filter: true },
          { field: 'refDocumentDate', sortable: true, resizable: true, filter: 'agDateColumnFilter', valueFormatter: this.dateFormatter },
          { field: 'receiptDate', sortable: true, resizable: true, filter: 'agDateColumnFilter', valueFormatter: this.dateFormatter },
          { field: 'receiptStatusText', headerName: 'Receipt Status', sortable: true, resizable: true, filter: true },
          { field: 'supplierCode', sortable: true, resizable: true, filter: true },
          { field: 'supplierName', sortable: true, resizable: true, filter: true },
          { field: 'exportMessage', sortable: true, resizable: true, filter: true },
          { field: 'exportStatus', sortable: true, resizable: true, filter: true },
          { field: 'replicationMessage', sortable: true, resizable: true, filter: true },
          { field: 'replicationStatus', sortable: true, resizable: true, filter: true },
          {
            field: 'receiptType', sortable: true, resizable: true, filter: true,
            cellRenderer: (params: any) => {
              if (params.value == 1)
                return 'From Web';
              else
                return 'From Mobile'
            }
          },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          },
          { field: 'warehouse', sortable: true, resizable: true, filter: true },
          { field: 'approverComment', sortable: true, resizable: true, filter: true },
          { field: 'scannedBy', sortable: true, resizable: true, filter: true },
          { field: 'scannedDate', sortable: true, resizable: true, filter: true, valueFormatter: this.dateFormatter },
          { field: 'createdBy', sortable: true, resizable: true, filter: true },
          { field: 'createdDate', sortable: true, resizable: true, filter: true, valueFormatter: this.dateFormatter },
          { field: 'modifiedBy', sortable: true, resizable: true, filter: true },
          { field: 'modifiedDate', sortable: true, resizable: true, filter: true, valueFormatter: this.dateFormatter },
        ];
        this.rowData = await this.receiptMasterService.getReceiptMaster();
        this.subscription = this.receiptMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'productmaster': {
        this.columnDefs = [
          { field: 'productId', sortable: true, resizable: true, filter: true },
          { field: 'productCode', headerName: 'Item Code', sortable: true, resizable: true, filter: true },
          { field: 'productDescription', headerName: 'Item Description', sortable: true, resizable: true, filter: true },
          { field: 'inventoryUOM', sortable: true, resizable: true, filter: true },
          { field: 'itemGroup', sortable: true, resizable: true, filter: true },
          { field: 'manufacturer', headerName: 'Manufacturer Name', sortable: true, resizable: true, filter: true },
          { field: 'category', sortable: true, resizable: true, filter: true },
          { field: 'quantity', headerName: 'QTY (Overall Warehouse)', sortable: true, resizable: true, filter: true },
          { field: 'inventoryitem', sortable: true, resizable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];
        this.rowData = await this.productMasterService.getExistingProduct();
        this.subscription = this.productMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      case 'assetregister': {
        this.columnDefs = [
          { field: 'productCode', sortable: true, resizable: true, filter: true },
          { field: 'productName', sortable: true, resizable: true, filter: true },
          { field: 'productDescription', sortable: true, resizable: true, filter: true },
          { field: 'serialNo', sortable: true, resizable: true, filter: true },
          { field: 'receiptId', sortable: true, resizable: true, filter: true },
          {
            field: 'createdDate', sortable: true, resizable: true,
            valueFormatter: this.dateFormatter,
            filter: 'agDateColumnFilter',
            filterParams: {
              debounceMs: 500,
              suppressAndOrCondition: true,
              comparator: this.function,
            },
          },
          { field: 'productId', sortable: true, resizable: true, filter: true, hide: true },
          {
            field: 'purchasePrice', sortable: true, resizable: true, filter: 'agNumberColumnFilter',
            valueFormatter: this.moneyFormatter, type: 'numericColumn'
          },
          {
            field: 'purchaseDate', sortable: true, resizable: true, filter: 'agDateColumnFilter',
            valueFormatter: this.dateFormatter,
            filterParams: {
              debounceMs: 500,
              suppressAndOrCondition: true,
              comparator: this.function,
            },
          },
          { field: 'supplierName', sortable: true, resizable: true, filter: true },
          { field: 'brandId', sortable: true, resizable: true, filter: true, hide: true },
          { field: 'modelId', sortable: true, resizable: true, filter: true, hide: true },
          { field: 'supplierId', sortable: true, resizable: true, filter: true, hide: true },
          { field: 'manufacturePartNo', sortable: true, resizable: true, filter: true },
          { field: 'assetStatusName', sortable: true, resizable: true, filter: true },
          { field: 'assetConditionName', sortable: true, resizable: true, filter: true },
          { field: 'assetOwner', sortable: true, resizable: true, filter: true },
          { headerName: 'Tag Number', field: 'extrlTagNumber', sortable: true, resizable: true, filter: true },
          { field: 'manufactureSerialNo', sortable: true, resizable: true, filter: true },
          { field: 'ownerID', sortable: true, resizable: true, filter: true, hide: true },
          { field: 'departmentID', sortable: true, resizable: true, filter: true, hide: true },
          { field: 'departmentName', sortable: true, resizable: true, filter: true },
          { field: 'employeeName', sortable: true, resizable: true, filter: true },
          { field: 'assetCategoryId', sortable: true, resizable: true, filter: true, hide: true },
          { field: 'assetCategoryCode', sortable: true, resizable: true, filter: true },
          { field: 'assetCategoryName', sortable: true, resizable: true, filter: true },
          { field: 'assetSubCategoryId', sortable: true, resizable: true, filter: true, hide: true },
          { field: 'assetSubCategoryCode', sortable: true, resizable: true, filter: true },
          { field: 'assetSubCategoryName', sortable: true, resizable: true, filter: true },
          { field: 'locationName', sortable: true, resizable: true, filter: true },
          { field: 'brandName', sortable: true, resizable: true, filter: true },
          { field: 'modelName', sortable: true, resizable: true, filter: true },
          {
            field: 'bookValue', sortable: true, resizable: true, filter: 'agNumberColumnFilter',
            valueFormatter: this.moneyFormatter, type: 'numericColumn'
          },
          {
            field: 'depreciationStartDate', sortable: true, filter: 'agDateColumnFilter', resizable: true,
            valueFormatter: this.dateFormatter
          },
          { field: 'insuranceName', sortable: true, resizable: true, filter: true },
          {
            field: 'insuranceStartDate', sortable: true, filter: 'agDateColumnFilter', resizable: true,
            valueFormatter: this.dateFormatter
          },
          {
            field: 'insuranceEndDate', sortable: true, filter: 'agDateColumnFilter', resizable: true,
            valueFormatter: this.dateFormatter
          },
          {
            field: 'insuranceValue', sortable: true, resizable: true, filter: 'agNumberColumnFilter',
            valueFormatter: this.moneyFormatter, type: 'numericColumn'
          },
          {
            field: 'warrantyAmount', sortable: true, resizable: true, filter: 'agNumberColumnFilter',
            valueFormatter: this.moneyFormatter, type: 'numericColumn'
          },
          {
            field: 'warrantyStartDate', sortable: true, filter: 'agDateColumnFilter', resizable: true,
            valueFormatter: this.dateFormatter,
          },
          {
            field: 'warrantyEndDate', sortable: true, filter: 'agDateColumnFilter', resizable: true,
            valueFormatter: this.dateFormatter
          },
          { field: 'employeeId', sortable: true, resizable: true, filter: true, hide: true },
          { field: 'locationId', sortable: true, resizable: true, filter: true, hide: true },
          {
            field: 'salvageValue', sortable: true, resizable: true, filter: 'agNumberColumnFilter',
            valueFormatter: this.moneyFormatter, type: 'numericColumn'
          },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.assetRegisterService.getAssetRegister();

        this.subscription = this.assetRegisterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'assetverification': {
        this.columnDefs = [
          { field: 'receiptId', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 150 },
          { field: 'refDocumentType', sortable: true, resizable: true, filter: true },
          { field: 'refDocumentNo', sortable: true, resizable: true, filter: true },
          {
            field: 'refDocumentDate', sortable: true, resizable: true, filter: 'agDateColumnFilter',
            valueFormatter: this.dateFormatter
          },
          {
            field: 'receiptDate', sortable: true, resizable: true, filter: 'agDateColumnFilter',
            valueFormatter: this.dateFormatter
          },
          { field: 'supplierCode', sortable: true, resizable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.assetVerificationService.getAssetVerification();

        this.subscription = this.assetVerificationService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'warrantydetails': {
        this.columnDefs = [
          { field: 'serialNo', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 150 },
          //{ field: 'assetCode', sortable: true, resizable: true, filter: true },
          //{ field: 'assetName', sortable: true, resizable: true, filter: true },
          {
            field: 'warrantyStartDate', sortable: true, resizable: true, filter: 'agDateColumnFilter',
            valueFormatter: this.dateFormatter
          },
          {
            field: 'warrantyEndDate', sortable: true, resizable: true, filter: 'agDateColumnFilter',
            valueFormatter: this.dateFormatter
          },
          { field: 'warrantyCost', sortable: true, resizable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.warrantyDetailsService.getWarrantyDetails();

        this.subscription = this.warrantyDetailsService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'insurancedetails': {
        this.columnDefs = [
          { field: 'serialNo', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 150 },
          //{ field: 'assetCode', sortable: true, resizable: true, filter: true },
          //{ field: 'assetName', sortable: true, resizable: true, filter: true },
          {
            field: 'insuranceStartDate', sortable: true, resizable: true, filter: 'agDateColumnFilter',
            valueFormatter: this.dateFormatter
          },
          {
            field: 'insuranceEndDate', sortable: true, resizable: true, filter: 'agDateColumnFilter',
            valueFormatter: this.dateFormatter
          },
          { field: 'insuranceName', sortable: true, resizable: true, filter: true },
          { field: 'insuranceValue', sortable: true, resizable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.insuranceDetailsService.getInsuranceDetails();

        this.subscription = this.insuranceDetailsService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'additionalcostdetails': {
        this.columnDefs = [
          { field: 'serialNo', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 150 },
          //{ field: 'assetCode', sortable: true, resizable: true, filter: true },
          //{ field: 'assetName', sortable: true, resizable: true, filter: true },
          { field: 'description', sortable: true, resizable: true, filter: true },
          {
            field: 'dateBought', sortable: true, resizable: true, filter: 'agDateColumnFilter',
            valueFormatter: this.dateFormatter
          },
          { field: 'quantity', sortable: true, resizable: true, filter: true },
          { field: 'amount', sortable: true, resizable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.additionalCostDetailsService.getAdditionalCostDetails();

        this.subscription = this.additionalCostDetailsService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'assetaudit': {
        this.columnDefs = [
          { field: 'auditId', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 150 },
         
          {
            headerName: 'Audit On', field: 'toBeAuditedOn', sortable: true, resizable: true, filter: 'agDateColumnFilter',
            valueFormatter: this.dateFormatter
          },
          { field: 'auditStatusText', sortable: true, resizable: true, filter: true, width: 250 },
          { field: 'exportStatus', sortable: true, resizable: true, filter: true, width: 150 },
          { field: 'exportMessage', sortable: true, resizable: true, filter: true, width: 150 },
          { field: 'auditStatus', sortable: true, resizable: true, filter: true, hide: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          },
          { field: 'createdBy', sortable: true, resizable: true, filter: true, width: 250 },
          {
            field: 'createdDate', sortable: true, resizable: true, filter: 'agDateColumnFilter',
            valueFormatter: this.dateFormatter
          },
        ];

        this.rowData = await this.assetAuditService.getAssetAudit();

        this.subscription = this.assetAuditService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'transfer': {
        this.columnDefs = [
          { field: 'transferNo', sortable: true, resizable: true, filter: true },
          {
            field: 'transferDate', sortable: true, resizable: true, filter: 'agDateColumnFilter',
            valueFormatter: this.dateFormatter
          },
          { field: 'requestNo', sortable: true, resizable: true, filter: true },
          {
            headerName: 'To Department', sortable: true, resizable: true, filter: true,
            valueGetter: (params: any) => params.data.toDepartmentCode + ' - ' + params.data.toDepartmentName
          },
          {
            headerName: 'To Employee', sortable: true, resizable: true, filter: true,
            valueGetter: (params: any) => params.data.toEmpFirstName + ' ' + params.data.toEmpLastName
          },
          {
            headerName: 'To Location', sortable: true, resizable: true, filter: true,
            valueGetter: (params: any) => params.data.toLocationCode + ' - ' + params.data.toLocationName
          },
          { field: 'remarks', sortable: true, resizable: true, filter: true },
          { field: 'statusText', sortable: true, resizable: true, filter: true },
          { field: 'status', sortable: true, resizable: true, filter: true, hide: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.assetTransferDirectService.getAssetTransferDirect();

        this.subscription = this.assetTransferDirectService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'transferrequest': {
        this.columnDefs = [
          { field: 'requestNo', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 150 },
          {
            field: 'requestDate', sortable: true, resizable: true, filter: 'agDateColumnFilter',
            valueFormatter: this.dateFormatter
          },
          {
            headerName: 'From Warehouse Name', sortable: true, resizable: true, filter: true,
            valueGetter: (params: any) => params.data.fromWarehouseCode + ' - ' + params.data.fromWarehouseName
          },
          {
            headerName: 'To Warehouse Name', sortable: true, resizable: true, filter: true,
            valueGetter: (params: any) => params.data.toWarehouseCode + ' - ' + params.data.toWarehouseName
          },
          {
            field: 'status', sortable: true, resizable: true, filter: true,
            cellRenderer: (params: any) => {
              if (params.value == 30)
                return 'Pending For Approval';
              else if (params.value == 40)
                return 'Rejected';
              else if (params.value == 50)
                return 'Approved';
              else if (params.value == 60)
                return 'Closed';
              else
                return 'Unknown';
            }
          },
          { field: 'remarks', sortable: true, resizable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];

        this.rowData = await this.assetTransferRequestService.getAssetTransferRequest();
        this.subscription = this.assetTransferRequestService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'assetmaintenance': {
        this.columnDefs = [
          { field: 'maintenanceId', sortable: true, resizable: true, filter: true, checkboxSelection: false, width: 150 },
          { field: 'maintenanceType', sortable: true, resizable: true, filter: true },
          { field: 'workOrderNo', sortable: true, resizable: true, filter: true },
          {
            field: 'workOrderDate', sortable: true, resizable: true, filter: 'agDateColumnFilter',
            valueFormatter: this.dateFormatter
          },
          { field: 'remarks', sortable: true, resizable: true, filter: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, resizable: true, filter: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];
        this.rowData = await this.assetMaintenanceService.getAssetMaintenance();
        this.subscription = this.assetMaintenanceService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'loan': {
        this.columnDefs = [
          { field: 'releaseNo', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 150 },
          { field: 'transactionTypeName', sortable: true, filter: true, resizable: true },
          { field: 'releaseTypeText', sortable: true, filter: true, resizable: true },
          { field: 'returnDate', sortable: true, filter: true, resizable: true },
          { field: 'issueToTypeName', sortable: true, filter: true, resizable: true },
          { field: 'issueToName', sortable: true, filter: true, resizable: true },
          { field: 'loanStatusText', sortable: true, filter: true, resizable: true },
          { field: 'releaseDate', sortable: true, filter: true, resizable: true },
          { field: 'releaseTypeId', sortable: true, filter: true, resizable: true, hide: true },
          { field: 'issueToTypeId', sortable: true, filter: true, resizable: true, hide: true },
          { field: 'issueToId', sortable: true, filter: true, resizable: true, hide: true },
          { field: 'loanStatus', sortable: true, filter: true, resizable: true, hide: true },
          { field: 'remarks', sortable: true, filter: true, resizable: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];
        this.rowData = await this.loanService.getLoan();
        this.subscription = this.loanService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'customermaster': {
        this.columnDefs = [
          { field: 'customerId', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 150 },
          { field: 'customerCode', sortable: true, filter: true, resizable: true },
          { field: 'customerName', sortable: true, filter: true, resizable: true },
          { field: 'customerGroup', sortable: true, filter: true, resizable: true },
          { field: 'contactPerson', sortable: true, filter: true, resizable: true },
          { field: 'trnNo', headerName: "TRN NO", sortable: true, filter: true, resizable: true },
          { field: 'addressLine1', sortable: true, filter: true, resizable: true },
          // { field: 'addressLine2', sortable: true, filter: true, resizable: true },
          // { field: 'contactPersonDesignation', sortable: true, filter: true, resizable: true },
          // { field: 'contactNumber', sortable: true, filter: true, resizable: true },
          // { headerName: 'Contact Email', field: 'contactemail', sortable: true, filter: true, resizable: true },
          // { field: 'customerWebsite', sortable: true, filter: true, resizable: true },
          // { field: 'customerLocationLatitude', sortable: true, filter: true, resizable: true },
          // { field: 'customerLocationLongitude', sortable: true, filter: true, resizable: true },
          // {
          //   headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
          //   cellRenderer: this.booleanCellRenderer
          // }
        ];
        this.rowData = await this.customerMasterService.getCustomerMaster();
        this.subscription = this.customerMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'usermaster': {
        this.columnDefs = [
          { field: 'userName', sortable: true, filter: true, resizable: true, checkboxSelection: false },
          // { field: 'firstName', sortable: true, filter: true, resizable: true },
          // { field: 'lastName', sortable: true, filter: true, resizable: true },
          { field: 'userRoleID', sortable: true, filter: true, resizable: true, hide: true },
          { field: 'roleName', sortable: true, filter: true, resizable: true },
          { field: 'employeeName', sortable: true, filter: true, resizable: true },
          { field: 'employeeId', sortable: true, filter: true, resizable: true, hide: true },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];
        this.rowData = await this.userMasterService.getUserMaster();
        this.subscription = this.userMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'userrolemaster': {
        this.columnDefs = [
          { field: 'id', sortable: true, filter: true, resizable: true, checkboxSelection: false, width: 100, hide: true },
          { field: 'roleName', sortable: true, filter: true, resizable: true, checkboxSelection: false },
          {
            headerName: 'Is Active', field: 'isDeleted', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];
        this.rowData = await this.userroleMasterService.getUserRoleMaster();
        this.subscription = this.userroleMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'salesorder': {
        this.columnDefs = [
          { field: 'soNumber', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'soEntry', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'soDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.dateFormatter },
          { field: 'soDueDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.dateFormatter },
          { field: 'cardCode', sortable: true, resizable: true, filter: true },
          { field: 'cardName', sortable: true, resizable: true, filter: true },
          { field: 'customerLocation', sortable: true, resizable: true, filter: true },
          { field: 'docObjectCode', sortable: true, resizable: true, filter: true },
          { field: 'docStatus', sortable: true, resizable: true, filter: true },
          { field: 'externalDocType', sortable: true, resizable: true, filter: true },
          { field: 'journalMemo', sortable: true, resizable: true, filter: true },
          { field: 'numAtCard', sortable: true, resizable: true, filter: true },
          { field: 'vendorName', sortable: true, resizable: true, filter: true },
          { field: 'notes', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'warehouse', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'createdBy', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'createdDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.dateFormatter },
          { field: 'modifiedBy', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'modifiedDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.dateFormatter },
        ];
        this.rowData = await this.salesorderService.getSalesOrder();
        this.subscription = this.salesorderService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'salesreturn': {
        this.columnDefs = [
          { field: 'soNumber', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'soEntry', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'soDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.dateFormatter },
          { field: 'soDueDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.dateFormatter },
          { field: 'cardCode', sortable: true, resizable: true, filter: true },
          { field: 'cardName', sortable: true, resizable: true, filter: true },
          { field: 'customerLocation', sortable: true, resizable: true, filter: true },
          { field: 'docObjectCode', sortable: true, resizable: true, filter: true },
          { field: 'docStatus', sortable: true, resizable: true, filter: true },
          { field: 'externalDocType', sortable: true, resizable: true, filter: true },
          { field: 'journalMemo', sortable: true, resizable: true, filter: true },
          { field: 'numAtCard', sortable: true, resizable: true, filter: true },
          { field: 'vendorName', sortable: true, resizable: true, filter: true },
          { field: 'notes', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'warehouse', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'createdBy', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'createdDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.dateFormatter },
          { field: 'modifiedBy', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'modifiedDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.dateFormatter },
        ];
        this.rowData = await this.salesreturnService.getSalesReturn();
        this.subscription = this.salesreturnService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }


      case 'printexistingstock': {
        this.columnDefs = [
          { field: 'productCode', sortable: true, resizable: true, filter: true },
          { field: 'productDescription', sortable: true, resizable: true, filter: true, width: 400 },
          { field: 'category', sortable: true, resizable: true, filter: true, width: 250 },
          { field: 'price', sortable: true, resizable: true, filter: true, width: 250 },
          { field: 'inventoryUOM', sortable: true, resizable: true, filter: true },
          { field: 'assetStatus', sortable: true, resizable: true, filter: true },
          { field: 'purchaseItemsPerUnit', sortable: true, resizable: true, filter: true },
          { field: 'purchaseUnit', sortable: true, resizable: true, filter: true },
          { field: 'quantity', sortable: true, resizable: true, filter: true },
          { field: 'salesUnit', sortable: true, resizable: true, filter: true },
          { field: 'salesItemsPerUnit', sortable: true, resizable: true, filter: true },
          { field: 'manufacturer', sortable: true, resizable: true, filter: true },
          { field: 'warehouse', sortable: true, resizable: true, filter: true },
          { field: 'createdBy', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'createdDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.dateFormatter },
          { field: 'modifiedBy', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'modifiedDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.dateFormatter },
        ];
        this.rowData = await this.productMasterService.getExistingProduct();
        this.subscription = this.userroleMasterService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'picklist': {
        this.columnDefs = [
          { field: 'pickListNumber', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'docNumber', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'docEntry', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'docType', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'docStatus', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'fromWarehouse', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'toWarehouse', headerName: "To Location", sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'remarks', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'createdBy', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'createdDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.dateFormatter },
          { field: 'modifiedBy', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'modifiedDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.dateFormatter },
        ];
        this.rowData = await this.picklistService.getPicklist();
        this.subscription = this.picklistService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'shipment': {
        this.columnDefs = [
          { field: 'shipmentId', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'shippedQuantity', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'shipmentDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.dateFormatter },
          { field: 'shipmentStatusText', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'refDocumentNo', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'refDocumentType', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'refDocumentDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.dateFormatter },
          { field: 'supplierName', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'exportMessage', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'exportStatus', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'replicationMessage', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'replicationStatus', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'pendingQuantityToReceive', sortable: true, resizable: true, filter: true },
          { field: 'pickListNo', sortable: true, resizable: true, filter: true },
          { field: 'receivedQuantity', sortable: true, resizable: true, filter: true },
          { field: 'supplierName', sortable: true, resizable: true, filter: true },
          { field: 'warehouse', sortable: true, resizable: true, filter: true },
          { field: 'scannedBy', sortable: true, resizable: true, filter: true },
          { field: 'scannedDate', sortable: true, resizable: true, filter: true, valueFormatter: this.dateFormatter },
          { field: 'createdBy', sortable: true, resizable: true, filter: true },
          { field: 'createdDate', sortable: true, resizable: true, filter: true, valueFormatter: this.dateFormatter },
          { field: 'modifiedBy', sortable: true, resizable: true, filter: true },
          { field: 'modifiedDate', sortable: true, resizable: true, filter: true, valueFormatter: this.dateFormatter },
        ];
        this.rowData = await this.shipmentService.getshipment();
        this.subscription = this.shipmentService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'transferorder': {
        this.columnDefs = [
          { field: 'toNumber', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'toEntry', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'toDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.dateFormatter },
          { field: 'toDueDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.dateFormatter },
          { field: 'fromWarehouse', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'toWarehouse', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'journalMemo', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'externalDocType', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'vendorName', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'warehouse', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'notes', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'docObjectCode', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'docStatus', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'createdBy', sortable: true, resizable: true, filter: true },
          { field: 'createdDate', sortable: true, resizable: true, filter: true, valueFormatter: this.dateFormatter },
          { field: 'modifiedBy', sortable: true, resizable: true, filter: true },
          { field: 'modifiedDate', sortable: true, resizable: true, filter: true, valueFormatter: this.dateFormatter },
        ];
        this.rowData = await this.transferorderService.gettransferorders();
        this.subscription = this.transferorderService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'transferreturn': {
        this.columnDefs = [
          { field: 'toNumber', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'toEntry', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'toDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.dateFormatter },
          { field: 'toDueDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.dateFormatter },
          { field: 'fromWarehouse', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'toWarehouse', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'journalMemo', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'externalDocType', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'vendorName', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'warehouse', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'notes', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'docObjectCode', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'docStatus', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'createdBy', sortable: true, resizable: true, filter: true },
          { field: 'createdDate', sortable: true, resizable: true, filter: true, valueFormatter: this.dateFormatter },
          { field: 'modifiedBy', sortable: true, resizable: true, filter: true },
          { field: 'modifiedDate', sortable: true, resizable: true, filter: true, valueFormatter: this.dateFormatter },
        ];
        this.rowData = await this.transferreturnService.getTransferReturn();
        this.subscription = this.transferreturnService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }

      
      case 'inventorysummary': {
        this.columnDefs = [
          { field: 'productId', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'productCode', sortable: true, resizable: true, filter: true, width: 200, },
          { field: 'productDescription', sortable: true, resizable: true, filter: true, width: 200, },
          { field: 'uomCode', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'itemGroup', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'manufacturerName', sortable: true, resizable: true, filter: true, width: 150, },
          { field: 'category', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'warehouseName', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'quantity', sortable: true, resizable: true, filter: true, width: 150 },
          { field: 'inventoryItem', sortable: true, resizable: true, filter: true, width: 150 },
          {
            headerName: 'Is Active', field: 'isActive', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }


        ];
        this.rowData = await this.inventoryService.getInventorySummary();
        this.subscription = this.inventoryService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'inventorydetails': {
        this.columnDefs = [
          { field: 'productId', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'productCode', sortable: true, resizable: true, filter: true, width: 150, },
          { field: 'productDescription', sortable: true, resizable: true, filter: true, width: 200, },
          { field: 'uomCode', sortable: true, resizable: true, filter: true, width: 150, },
          { field: 'serialNo', sortable: true, resizable: true, filter: true, width: 250 },
          { field: 'batchNo', sortable: true, resizable: true, filter: true, width: 150 },
          { field: 'receivedDate', sortable: true, resizable: true, filter: true, width: 150 },
          { field: 'itemGroup', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'manufacturerName', sortable: true, resizable: true, filter: true, width: 150, },
          { field: 'category', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'warehouseCode', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'warehouseName', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'quantity', sortable: true, resizable: true, filter: true, width: 200, },
          { field: 'inventoryItem', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'inventoryStatus', sortable: true, resizable: true, filter: true, width: 200 },
          {
            headerName: 'Is Active', field: 'isActive', sortable: true, filter: true, resizable: true, cellEditor: 'booleanEditor',
            cellRenderer: this.booleanCellRenderer
          }
        ];
        this.rowData = await this.inventoryService.getInventoryDetails();
        this.subscription = this.inventoryService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'productionorder': {
        this.columnDefs = [
          { field: 'productionNumber', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'productionEntry', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'productCode', sortable: true, resizable: true, filter: true, width: 250 },
          { field: 'productDescription', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'uomCode', sortable: true, resizable: true, filter: true, width: 150, },
          { field: 'uomQnty', sortable: true, resizable: true, filter: true, width: 200, },
          { field: 'plannedQuantity', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'completedQuantity', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'warehouseCode', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'noOfLabels', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'dueDate', sortable: true, resizable: true, filter: true, valueFormatter: this.dateFormatter },
          { field: 'postingDate', sortable: true, resizable: true, filter: true, valueFormatter: this.dateFormatter },
          { field: 'createdBy', sortable: true, resizable: true, filter: true },
          { field: 'createdDate', sortable: true, resizable: true, filter: true, valueFormatter: this.dateFormatter },
          { field: 'modifiedBy', sortable: true, resizable: true, filter: true },
          { field: 'modifiedDate', sortable: true, resizable: true, filter: true, valueFormatter: this.dateFormatter },

        ];
        this.rowData = await this.productionorderService.getproductionorders();
        this.subscription = this.productionorderService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }
      case 'purchasereturn': {
        this.columnDefs = [
          { field: 'poNumber', sortable: true, resizable: true, filter: true, width: 150 },
          { field: 'poEntry', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'warehouse', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'poDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.dateFormatter },
          { field: 'poDueDate', sortable: true, resizable: true, filter: true, width: 200, valueFormatter: this.dateFormatter },
          { field: 'notes', sortable: true, resizable: true, filter: true, width: 200 },
          { field: 'createdBy', sortable: true, resizable: true, filter: true },
          { field: 'createdDate', sortable: true, resizable: true, filter: true, valueFormatter: this.dateFormatter },
          { field: 'modifiedBy', sortable: true, resizable: true, filter: true },
          { field: 'modifiedDate', sortable: true, resizable: true, filter: true, valueFormatter: this.dateFormatter },
        ];
        this.rowData = await this.inboundService.getPurchaseReturn();
        this.subscription = this.inboundService.refreshClickevent.subscribe((e) => {
          this.OnRefreshCick();
        });
        break;
      }



      default: {
        break;
      }
    }
    this.gridData.emit(this.rowData)
    this.totalGriditems.emit(this.rowData.length)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async OnRefreshCick() {
    switch (this.entity) {
      case 'sitemaster': {
        this.rowData = await this.siteMasterService.onRefreshSitemaster();
        break;
      }
      case 'buildingmaster': {
        this.rowData = await this.buildingMasterService.onRefreshBuildingmaster();
        break;
      }
      case 'floormaster': {
        this.rowData = await this.floorMasterService.onRefreshFloormaster();
        break;
      }
      case 'roommaster': {
        this.rowData = await this.roomMasterService.onRefreshRoommaster();
        break;
      }
      case 'locationmaster': {
        this.rowData = await this.locationMasterService.onRefreshLocationmaster();
        break;
      }
      case 'departmentmaster': {
        this.rowData = await this.departmentMasterService.onRefreshDepartmentmaster();
        break;
      }
      case 'brandmaster': {
        this.rowData = await this.brandMasterService.onRefreshBrandmaster();
        break;
      }
      case 'modelmaster': {
        this.rowData = await this.brandmodelMasterService.onRefreshBrandmodelmaster();
        break;
      }
      case 'assetcategorymaster': {
        this.rowData = await this.assetCategoryMasterService.onRefreshAssetCategoryMaster();
        break;
      }
      case 'assetsubcategorymaster': {
        this.rowData = await this.assetSubCategoryMasterService.onRefreshAssetSubCategoryMaster();
        break;
      }
      case 'employeemaster': {
        this.rowData = await this.employeeMasterService.onRefreshEmployeeMaster();
        break;
      }
      case 'commonvaluelistmaster': {
        this.rowData = await this.commonValueListService.onRefreshCommonValueListmaster();
        break;
      }
      case 'suppliermaster': {
        this.rowData = await this.supplierMasterService.onRefreshSupplierMaster();
        break;
      }
      case 'receiptmaster': {
        this.rowData = await this.receiptMasterService.onRefreshReceiptMaster();
        break;
      }
      case 'productmaster': {
        this.rowData = await this.productMasterService.onRefreshProductmaster();
        break;
      }
      case 'assetregister': {
        this.rowData = await this.assetRegisterService.onRefreshAssetRegister();
        break;
      }
      case 'assetverification': {
        this.rowData = await this.assetVerificationService.onRefreshAssetVerification();
        break;
      }
      case 'warrantydetails': {
        this.rowData = await this.warrantyDetailsService.onRefreshWarrantyDetails();
        break;
      }
      case 'insurancedetails': {
        this.rowData = await this.insuranceDetailsService.onRefreshInsuranceDetails();
        break;
      }
      case 'additionalcostdetails': {
        this.rowData = await this.additionalCostDetailsService.onRefreshAdditionalCostDetails();
        break;
      }
      case 'assetaudit': {
        this.rowData = await this.assetAuditService.onRefreshAssetAudit();
        break;
      }
      case 'transfer': {
        this.rowData = await this.assetTransferDirectService.onRefreshAssetTransferDirect();
        break;
      }
      case 'transferrequest': {
        this.rowData = await this.assetTransferRequestService.onRefreshAssetTransferRequest();
        break;
      }
      case 'assetmaintenance': {
        this.rowData = await this.assetMaintenanceService.onRefreshAssetMaintenance();
        break;
      }
      case 'loan': {
        this.rowData = await this.loanService.onRefreshLoan();
        break;
      }
      case 'customermaster': {
        this.rowData = await this.customerMasterService.onRefreshCustomerMaster();
        break;
      }
      case 'usermaster': {
        this.rowData = await this.userMasterService.onRefreshUserMaster();
        break;
      }
      case 'userrolemaster': {
        this.rowData = await this.userroleMasterService.onRefreshUserRoleMaster();
        break;
      }
      case 'salesorder': {
        this.rowData = await this.salesorderService.onRefreshsalesorder();
        break;
      }
      case 'salesreturn': {
        this.rowData = await this.salesreturnService.onRefreshSalesOrderReturn();
        break;
      }
      case 'transferorder': {
        this.rowData = await this.transferorderService.onRefreshtransferorder();
        break;
      }
      case 'transferreturn': {
        this.rowData = await this.transferreturnService.onRefreshTransferReturn();
        break;
      }
      case 'picklist': {
        this.rowData = await this.picklistService.onRefreshpicklist();
        break;
      }
      case 'shipment': {
        this.rowData = await this.shipmentService.onRefreshshipment();
        break;
      }
      case 'inventorysummary': {
        this.rowData = await this.inventoryService.onRefreshinventorysummary();
        break;
      }
      case 'inventorydetails': {
        this.rowData = await this.inventoryService.onRefreshinventoryDetails();
        break;
      }
      case 'productionorder': {
        this.rowData = await this.productionorderService.onRefreshproductionorder();
        break;
      }
      case 'purchasereturn': {
        this.rowData = await this.inboundService.onRefreshpurchaseReturn();
        break;
      }
      default: {
        break;
      }
    }
  }

  onRowClick(event: any) {
    switch (this.entity) {
      case 'sitemaster': {
        this.siteMasterService.selectedrowevent.next(event);
        break;
      }
      case 'buildingmaster': {
        this.buildingMasterService.selectedrowevent.next(event);
        break;
      }
      case 'floormaster': {
        this.floorMasterService.selectedrowevent.next(event);
        break;
      }
      case 'roommaster': {
        this.roomMasterService.selectedrowevent.next(event);
        break;
      }
      case 'locationmaster': {
        this.locationMasterService.selectedrowevent.next(event);
        break;
      }
      case 'departmentmaster': {
        this.departmentMasterService.selectedrowevent.next(event);
        break;
      }
      case 'brandmaster': {
        this.brandMasterService.selectedrowevent.next(event);
        break;
      }
      case 'modelmaster': {
        this.brandmodelMasterService.selectedrowevent.next(event);
        break;
      }
      case 'assetcategorymaster': {
        this.assetCategoryMasterService.selectedrowevent.next(event);
        break;
      }
      case 'assetsubcategorymaster': {
        this.assetSubCategoryMasterService.selectedrowevent.next(event);
        break;
      }
      case 'employeemaster': {
        this.employeeMasterService.selectedrowevent.next(event);
        break;
      }
      case 'commonvaluelistmaster': {
        this.commonValueListService.selectedrowevent.next(event);
        break;
      }
      case 'suppliermaster': {
        this.supplierMasterService.selectedrowevent.next(event);
        break;
      }
      case 'receiptmaster': {
        this.receiptMasterService.selectedrowevent.next(event);
        break;
      }
      case 'productmaster': {
        this.productMasterService.selectedrowevent.next(event);
        break;
      }
      case 'assetregister': {
        this.assetRegisterService.selectedrowevent.next(event);
        break;
      }
      case 'assetregister': {
        this.assetVerificationService.selectedrowevent.next(event);
        break;
      }
      case 'warrantydetails': {
        this.warrantyDetailsService.selectedrowevent.next(event);
        break;
      }
      case 'insurancedetails': {
        this.insuranceDetailsService.selectedrowevent.next(event);
        break;
      }
      case 'additionalcostdetails': {
        this.additionalCostDetailsService.selectedrowevent.next(event);
        break;
      }
      case 'assetaudit': {
        this.assetAuditService.selectedrowevent.next(event);
        break;
      }
      case 'transfer': {
        this.assetTransferDirectService.selectedrowevent.next(event);
        break;
      }
      case 'transferrequest': {
        this.assetTransferRequestService.selectedrowevent.next(event);
        break;
      }
      case 'assetmaintenance': {
        this.assetMaintenanceService.selectedrowevent.next(event);
        break;
      }
      case 'loan': {
        this.loanService.selectedrowevent.next(event);
        break;
      }
      case 'customermaster': {
        this.customerMasterService.selectedrowevent.next(event);
        break;
      }
      case 'usermaster': {
        this.userMasterService.selectedrowevent.next(event);
        break;
      }
      case 'userrolemaster': {
        this.userroleMasterService.selectedrowevent.next(event);
        break;
      }
      case 'salesorder': {
        this.salesorderService.selectedrowevent.next(event);
        break;
      }
      case 'salesreturn': {
        this.salesreturnService.selectedrowevent.next(event);
        break;
      }
      case 'printexistingstock': {
        this.printLabelService.selectedrowevent.next(event);
        break;
      }
      case 'picklist': {
        this.picklistService.selectedrowevent.next(event);
        break;
      }
      case 'shipment': {
        this.shipmentService.selectedrowevent.next(event);
        break;
      }
      case 'transferorder': {
        this.transferorderService.selectedrowevent.next(event);
        break;
      }
      case 'transferreturn': {
        this.transferreturnService.selectedrowevent.next(event);
        break;
      }
      case 'productionorder': {
        this.productionorderService.selectedrowevent.next(event);
        break;
      }
      case 'purchasereturn': {
        this.inboundService.selectedrowevent.next(event);
        break;
      }
      default: {
        break;
      }
    }
  }

  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
  }

  getBooleanEditor() {
    // function to act as a class
    function BooleanEditor() { }

    // gets called once before the renderer is used
    BooleanEditor.prototype.init = function (params: any) {
      // create the cell
      var value = params.value;

      this.eInput = document.createElement('input');
      this.eInput.type = 'checkbox';
      this.eInput.checked = value;
      this.eInput.value = value;
    };

    // gets called once when grid ready to insert the element
    BooleanEditor.prototype.getGui = function () {
      return this.eInput;
    };

    // focus and select can be done after the gui is attached
    BooleanEditor.prototype.afterGuiAttached = function () {
      this.eInput.focus();
      this.eInput.select();
    };

    // returns the new value after editing
    BooleanEditor.prototype.getValue = function () {
      return this.eInput.checked;
    };

    // any cleanup we need to be done here
    BooleanEditor.prototype.destroy = function () {
      // but this example is simple, no cleanup, we could
      // even leave this method out as it's optional
    };

    // if true, then this editor will appear in a popup
    BooleanEditor.prototype.isPopup = function () {
      // and we could leave this method out also, false is the default
      return false;
    };

    return BooleanEditor;
  }

  booleanCellRenderer(params: any) {
    var value = !params.value ? 'checked' : 'unchecked';

    return '<input disabled type="checkbox" ' + value + '/>';
  }

  booleanNonTagCellRenderer(params: any) {
    var value = params.value ? 'checked' : 'unchecked';

    return '<input disabled type="checkbox" ' + value + '/>';
  }

  booleanActualCellRenderer(params: any) {
    var value = params.value ? 'checked' : 'unchecked';

    return '<input disabled type="checkbox" ' + value + '/>';
  }

  dateFormatter(params: any) {
    if (params.value) {
      var dateVal = new Date(params.value);
      if (dateVal)
        return `${dateVal.getDate().toString().padStart(2, '0')}-${(dateVal.getMonth() + 1).toString().padStart(2, '0')}-${dateVal.getFullYear()}`;
      else
        return '';
    }
    else
      return '';
    //(params: any) => { console.log(params.value);  return params.value;}
  }
  dateFormatterwithvalue(params: any) {
    if (params) {
      var dateVal = new Date(params);
      if (dateVal)
        return `${dateVal.getDate().toString().padStart(2, '0')}/${(dateVal.getMonth() + 1).toString().padStart(2, '0')}/${dateVal.getFullYear()}`;
      else
        return '';
    }
    else
      return '';
    //(params: any) => { console.log(params.value);  return params.value;}
  }
  moneyFormatter(params: any) {
    if (params.value)
      return (Math.round(params.value * 100) / 100).toFixed(2);
    else
      return '';
  }
}
