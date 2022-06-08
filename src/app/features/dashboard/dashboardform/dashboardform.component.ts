import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AssetCategoryMasterService } from 'src/app/core/service/assetcategorymaster.service';
import { BuildingmasterService } from 'src/app/core/service/buildingmaster.service';
import { DashboardService } from 'src/app/core/service/dashboard.service';
import { DepartmentmasterService } from 'src/app/core/service/departmentmaster.service';
import { LocationmasterService } from 'src/app/core/service/locationmaster.service';
import { assetValueForYears } from 'src/app/shared/dashboarddata/data';
import { AssetCategoryMasterModel } from 'src/app/shared/model/AssetCategoryMasterModel';
import { BuildingMasterModel } from 'src/app/shared/model/BuildingMasterModel';
import { DashboardCardsGroupModel } from 'src/app/shared/model/DashboardCardsGroupModel';
import { DepartmentMasterModel } from 'src/app/shared/model/DepartmentMasterModel';
import { LocationMasterModel } from 'src/app/shared/model/LocationMasterModel';
declare var $: any;

@Component({
  selector: 'org-fat-dashboardform',
  templateUrl: './dashboardform.component.html',
  styleUrls: ['./dashboardform.component.css']
})
export class DashboardformComponent implements OnInit {
  dashboardForm: FormGroup;
  dashboardCardsGroupModel!: DashboardCardsGroupModel;
  assetCount!: number;
  assignedAssets!: number;
  unAssignedAssets!: number;
  totalAssetsValue!: number;
  single!: any[];
  singledepartment!:any[];
  singlecategory!:any[];
  singlecategorycost!:any[];
  asset!: any[];
  multi!: any[];
  pieStatus!: any[];
  assetValueForYears!: any[];
  assetCountByDepartment!: any[];
  AssetNameAndCount!: NgxChartsModule;
  browserAnimationsModule!: BrowserAnimationsModule;
  rowMaintenanceAlert!: any[];
  columnMaintenanceDefs: any;
  rowLast10Transactions!: any[];
  columnLast10Transactions: any;
  view: any = [850, 400];
  departmentCodes!: DepartmentMasterModel[];
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Location';
  showYAxisLabel = true;
  yAxisLabel = 'Asset Count';

  colorScheme:any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  showLabels: boolean = true;
  isDoughnut: boolean = true;
  legendPosition: string = 'below';

  locationCodes!: LocationMasterModel[];
  buildingCodes!:BuildingMasterModel[];
  categoryCodes!:AssetCategoryMasterModel[];

  constructor(private formBuilder: FormBuilder,
    private dashboardService: DashboardService,
    private locationMasterService: LocationmasterService,
    private departmentMasterService: DepartmentmasterService,private buildingmasterservice:BuildingmasterService,
    private categorymasterservice:AssetCategoryMasterService) {
    this.dashboardForm = this.formBuilder.group({
      LocationSelCode: [null],
      LocationSelCode1:[null],
      YearSelCode:[null],
      DepartmentSelCode: [null],
      BuildingSelCode:[null],
      CategorySelCode:[null],
      CategoryCostSelCode:[null]
    });

    //Object.assign(this, { single });
    //Object.assign(this, { asset });
    //Object.assign(this, { pieStatus });
    Object.assign(this, { assetValueForYears });
    //Object.assign(this, { assetCountByDepartment });
   }

   get dashboardFormControls() { return this.dashboardForm.controls; }

  async ngOnInit() {
   
    this.rowMaintenanceAlert = [];
    this.columnMaintenanceDefs = [
      { field: 'serialNo', sortable: true, filter: true, resizable: true },
      { field: 'productCode', sortable: true, filter: true, resizable: true },
      { field: 'productName', sortable: true, filter: true, resizable: true },
      { field: 'employeeName', sortable: true, filter: true, resizable: true },
      { field: 'departmentName', sortable: true, filter: true, resizable: true },
      { field: 'locationName', sortable: true, filter: true, resizable: true },
      { field: 'maintenanceDate', sortable: true, filter: true, resizable: true }
    ];

    this.rowLast10Transactions = [];
    this.columnLast10Transactions = [
      { field: 'type', sortable: true, filter: true, resizable: true },
      { field: 'number', sortable: true, filter: true, resizable: true },
      { field: 'date', sortable: true, filter: true, resizable: true },
      { field: 'userName', sortable: true, filter: true, resizable: true }
    ];

    $('.select2bs4').select2();

    $('[name="BuildingSelCode"]').on("change", () => {
      this.dashboardFormControls.BuildingSelCode.setValue($('[name="BuildingSelCode"]').val());
      this.dashboardService.getAssetcountbyBuilding($('[name="BuildingSelCode"]').val()==null || $('[name="BuildingSelCode"]').val()=='All' ? 0 :$('[name="BuildingSelCode"]').val()).then(res => {
        this.single =  res.values as any;
      });
    });

    $('[name="DepartmentSelCode"]').on("change", () => {
      this.dashboardFormControls.DepartmentSelCode.setValue($('[name="DepartmentSelCode"]').val());
      this.dashboardService.getAssetcountbyDepartment($('[name="DepartmentSelCode"]').val()==null || $('[name="DepartmentSelCode"]').val()=='All' ? 0 : $('[name="DepartmentSelCode"]').val()).then(res => {
        this.singledepartment =  res.values as any;
      });
    });

    $('[name="CategorySelCode"]').on("change", () => {
      this.dashboardFormControls.CategorySelCode.setValue($('[name="CategorySelCode"]').val());
      this.dashboardService.getAssetcountbyCategory($('[name="CategorySelCode"]').val()==null || $('[name="CategorySelCode"]').val()=='All' ? 0 :$('[name="CategorySelCode"]').val()).then(res => {
        this.singlecategory =  res.values as any;
      });
    });

    $('[name="CategoryCostSelCode"]').on("change", () => {
      this.dashboardFormControls.CategoryCostSelCode.setValue($('[name="CategoryCostSelCode"]').val());
      this.dashboardService.getAssetcostbyCategory($('[name="CategoryCostSelCode"]').val()==null || $('[name="CategoryCostSelCode"]').val()=='All' ?0 :$('[name="CategoryCostSelCode"]').val()).then(res => {
        this.singlecategorycost =  res.values as any;
      });
    });

    this.locationCodes = await this.locationMasterService.getLocationMaster();
    this.departmentCodes = await this.departmentMasterService.getDepartmentMaster();
    this.buildingCodes = await this.buildingmasterservice.getBuildingMaster();
    this.categoryCodes = await this.categorymasterservice.getAssetCategoryMaster();
    this.dashboardService.getDashboardCardsGroup().then( res => { 
      this.dashboardCardsGroupModel = res;
      this.assetCount = this.dashboardCardsGroupModel.assetCount;
      this.assignedAssets = this.dashboardCardsGroupModel.assignedAssets;
      this.unAssignedAssets = this.dashboardCardsGroupModel.unAssignedAssets;
      this.totalAssetsValue = this.dashboardCardsGroupModel.totalAssetsValue;

      // this.assetCount=125;
      // this.assignedAssets=75;
      // this.unAssignedAssets=50;
      // this.totalAssetsValue=12500;

    });
    
    this.dashboardService.getAssetcountbyBuilding(0).then(res => {
      this.single =  res.values as any;
    });

    this.dashboardService.getAssetcountbyDepartment(0).then(res => {
      this.singledepartment =  res.values as any;
    });

    this.dashboardService.getAssetcountbyCategory(0).then(res => {
      this.singlecategory =  res.values as any;
    });

    this.dashboardService.getAssetcostbyCategory(0).then(res => {
      this.singlecategorycost =  res.values as any;
    });

    // this.dashboardService.getAssetsInlocation(0).then(res => {
    //   this.asset =  res.values as any;
    // });

    this.dashboardService.getAssetscountbystatus().then(res => {
      this.pieStatus =  res.values as any;
    });

    // this.dashboardService.getValuebycategoryfordepartment(0).then(res => {
    //   this.assetCountByDepartment =  res.values as any;
    // });

    // this.dashboardService.getMaintenanceScheduleAlert().then(res => {
    //   this.rowMaintenanceAlert =  res;
    // });
    
    // this.dashboardService.getTransactionhistory().then(res => {
    //   this.rowLast10Transactions =  res;
    // });
  }

  onSelect(event:any) {
    console.log(event);
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
