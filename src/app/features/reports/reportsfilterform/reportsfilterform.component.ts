import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeviewComponent, TreeviewHelper, TreeviewItem } from 'ngx-treeview';
import { AssetCategoryMasterService } from 'src/app/core/service/assetcategorymaster.service';
import { AssetSubCategoryMasterService } from 'src/app/core/service/assetsubcategorymaster.service';
import { BrandmasterService } from 'src/app/core/service/brandmaster.service';
import { BrandmodelmasterService } from 'src/app/core/service/brandmodelmaster.service';
import { BuildingmasterService } from 'src/app/core/service/buildingmaster.service';
import { CommonValueListService } from 'src/app/core/service/commonlistvalue.service';
import { DepartmentmasterService } from 'src/app/core/service/departmentmaster.service';
import { EmployeeMasterService } from 'src/app/core/service/employeemaster.service';
import { FloormasterService } from 'src/app/core/service/floormaster.service';
import { LocationmasterService } from 'src/app/core/service/locationmaster.service';
import { ProductMasterService } from 'src/app/core/service/productmaster.service';
import { ReportsService } from 'src/app/core/service/reports.service';
import { RoommasterService } from 'src/app/core/service/roommaster.service';
import { SitemasterService } from 'src/app/core/service/sitemaster.service';
import { AssetRegisterFilterReport } from 'src/app/shared/model/AssetRegisterReport';
import { AssetStatusWiseFilterReport } from 'src/app/shared/model/AssetStatusWiseFilterReport';
import { AssetSubCategoryMasterModel } from 'src/app/shared/model/AssetSubCategoryMasterModel';
import { CategoryWiseFilterReport } from 'src/app/shared/model/CategoryWiseReport';
import { LocationMasterModel } from 'src/app/shared/model/LocationMasterModel';
import { LocationWiseFilterReport } from 'src/app/shared/model/LocationWiseReport';
import { ReportAndFilters } from 'src/app/shared/Reports/ReportAndFilters';
import { ReportFilterTypes } from 'src/app/shared/Reports/ReportFilterTypes';
import { ReportNumbers } from 'src/app/shared/Reports/ReportNumbers';
import { ReportTitle } from 'src/app/shared/Reports/ReportTitles';
import { TreeViewBuilder } from 'src/app/shared/TreeViewBuilder/TreeviewBuilder';
declare var $: any;

@Component({
  selector: 'org-fat-reportsfilterform',
  templateUrl: './reportsfilterform.component.html',
  styleUrls: ['./reportsfilterform.component.css']
})
export class ReportsfilterformComponent implements OnInit {
  @ViewChild('treeView') treeView!: TreeviewComponent;
  reportType!: ReportNumbers;
  ReportFilterTypes: typeof
    ReportFilterTypes = ReportFilterTypes;
  reportFilters: ReportFilterTypes[] = [];
  reportFilterForm: FormGroup;
  subCategoryItems!: AssetSubCategoryMasterModel[];
  locationItems!: LocationMasterModel[];
  itemsList!: TreeviewItem[];
  productList!: TreeviewItem[];
  itemscategoryList!: TreeviewItem[];
  itemsBrandList!: TreeviewItem[];
  itemsRoomList!: TreeviewItem[];
  itemsBuildingList!: TreeviewItem[];
  itemsSiteList!: TreeviewItem[];
  itemsModelList!: TreeviewItem[];
  itemsLocationList!: TreeviewItem[];
  itemsFloorList!: TreeviewItem[];
  itemsAssetStatusList!: TreeviewItem[];
  itemsDepartmentList!: TreeviewItem[];
  itemsEmployeeList!: TreeviewItem[];
  error!: string;
  submitted = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  treeviewConfig: any;
  auditId!: number;
  editMode!: boolean;
  viewMode!: boolean;
  auditStatus!: number;
  SubCategorySelectedNodes: string[] = [];
  ProductSelectedNodes: string[] = [];
  CategorySelectedNodes: string[] = [];
  brandSelectedNodes: string[] = [];
  modelSelectedNodes: string[] = [];
  siteSelectedNodes: string[] = [];
  buildingSelectedNodes: string[] = [];
  floorSelectedNodes: string[] = [];
  roomSelectedNodes: string[] = [];
  LocationSelectedNodes: string[] = [];
  assetStatusSelectedNodes: string[] = [];
  departmentSelectedNodes: string[] = [];
  employeeSelectedNodes: string[] = [];
  render: boolean = false;
  isSubCategoryHidden: boolean = true;
  isLocationHidden: boolean = true;
  selectedFilterValues: number[] = [];
  reportTitle: string = '';

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private assetCategoryMasterService: AssetCategoryMasterService,
    private assetSubCategoryService: AssetSubCategoryMasterService,
    private productmasterservice: ProductMasterService,
    private locationMasterService: LocationmasterService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private reportService: ReportsService,
    private brandMasterService: BrandmasterService,
    private brandmodelmasterService: BrandmodelmasterService,
    private sitemasterService: SitemasterService,
    private buildingmasterService: BuildingmasterService,
    private floormasterservice: FloormasterService,
    private roommasterservice: RoommasterService,
    private commonValueListService: CommonValueListService,
    private departmentmasterService: DepartmentmasterService,
    private employeeMasterService: EmployeeMasterService) {

    this.reportFilterForm = this.formBuilder.group({
      SelectFilters: '',
      LocationTreeView: [null]
    });
  }

  async ngOnInit() {

    this.route.data.subscribe((v: any) => {
      this.reportType = v.reportType;
      let reportAndFilters = new ReportAndFilters;
      this.reportFilters = reportAndFilters.GetReportFilters(this.reportType);
      let reportTitleName = new ReportTitle;
      this.reportTitle = reportTitleName.GetReportTitle(this.reportType);
    });

    this.locationItems=await this.locationMasterService.getLocationMaster();
    this.subCategoryItems=await this.assetSubCategoryService.getAssetSubCategoryMaster();
    //Initialize Select2 Elements
    $('.select2').select2();
    $('.select2bs4').select2();
    //Initialize Select2 Elements
    $('.select2bs4').select2({
      theme: 'bootstrap4'
    });
    $('[name="SelectFilters"]').select2({
      placeholder: "Select a filter",
      allowClear: true
    });

    $('[name="SelectFilters"]').on("change", () => {
      this.selectedFilterValues = this.getSelectedValuesInNumbers($('[name="SelectFilters"]').val());
    });
    let selectedValue = this.reportFilters[0].toString();
    this.selectedFilterValues.push(this.reportFilters[0])
    this.reportFilterFormControls.SelectFilters.setValue([selectedValue]);
    $('select2bs4').select2().trigger('change');

    this.treeviewConfig = {
      hasAllCheckBox: true,
      hasFilter: true,
      hasCollapseExpand: true,
      decoupleChildFromParent: false,
      maxHeight: 370
    }

    let treeviewBuilder = new TreeViewBuilder();
    this.reportFilters.forEach((item, i) => {
      switch(item) {
        case ReportFilterTypes.Category: {
         
          break;
        }
        case ReportFilterTypes.Category: {
          treeviewBuilder.GetCategoryTreeviewItems(this.assetCategoryMasterService).then((res: TreeviewItem[]) => {
            this.itemscategoryList = res;
          });
          break;
        }
        case ReportFilterTypes.Subcategory: {
          treeviewBuilder.GetSubCategoryTreeviewItems(this.assetSubCategoryService).then((res: TreeviewItem[]) => {
            this.itemsList = res;
          });
          break;
        }
        case ReportFilterTypes.Product: {
          treeviewBuilder.GetProductTreeviewItems(this.productmasterservice).then((res: TreeviewItem[]) => {
            this.productList = res;
          });
          break;
        }
        case ReportFilterTypes.Brand: {
          treeviewBuilder.GetBrandTreeviewItems(this.brandMasterService).then((res: TreeviewItem[]) => {
            this.itemsBrandList = res;
          });
          break;
        }
        case ReportFilterTypes.Model: {
          treeviewBuilder.GetModelTreeviewItems(this.brandmodelmasterService).then((res: TreeviewItem[]) => {
            this.itemsModelList = res;
          });
      
          break;
        }
        case ReportFilterTypes.Site: {
          treeviewBuilder.GetSiteTreeviewItems(this.sitemasterService).then((res: TreeviewItem[]) => {
            this.itemsSiteList = res;
          });
          break;
        }
        case ReportFilterTypes.Building: {
          treeviewBuilder.GetBuildingTreeviewItems(this.buildingmasterService).then((res: TreeviewItem[]) => {
            this.itemsBuildingList = res;
          });
          break;
        }
        case ReportFilterTypes.Floor: {
          treeviewBuilder.GetFloorTreeviewItems(this.floormasterservice).then((res: TreeviewItem[]) => {
            this.itemsFloorList = res;
          });
          
          break;
        }
        case ReportFilterTypes.Room: {
          treeviewBuilder.GetRoomTreeviewItems(this.roommasterservice).then((res: TreeviewItem[]) => {
            this.itemsRoomList = res;
          });
          
      
          break;
        }
        case ReportFilterTypes.Location: {
          treeviewBuilder.GetLocationTreeviewItems(this.locationMasterService).then((res: TreeviewItem[]) => {
            this.itemsLocationList = res;
          });
          break;
        }
        case ReportFilterTypes.AssetStatus: {
          treeviewBuilder.GetAssetStatusTreeviewItems(this.commonValueListService).then((res: TreeviewItem[]) => {
            this.itemsAssetStatusList = res;
          });
          break;
        }
        case ReportFilterTypes.Department: {
          treeviewBuilder.GetDepartmentTreeviewItems(this.departmentmasterService).then((res: TreeviewItem[]) => {
            this.itemsDepartmentList = res;
          });
          break;
        }
        case ReportFilterTypes.Employee: {
          treeviewBuilder.GetEmployeeTreeviewItems(this.employeeMasterService).then((res: TreeviewItem[]) => {
            this.itemsEmployeeList = res;
          });
          break;
        }
        default:
          break;
      }
    });

  }


  get reportFilterFormControls() { return this.reportFilterForm.controls; }



  getSelectedValuesInNumbers(selectedValues: any[]): number[] {
    let output: number[] = [];
    selectedValues.forEach((item, i) => {
      var value = item.split(":")[1];
      value = value.replace("'", '');
      value = parseFloat(value);
      output.push(value);
    });
    return output;
  }

  setItemsSelectedInTreeView(itemsToBeSelected: TreeviewItem[], valuesSelected: string[]) {
    const changeSelection = (valuesSelected: any) => {
      valuesSelected.forEach((element: any) => {
        const foundItem = TreeviewHelper.findItemInList(itemsToBeSelected, element);
        foundItem.checked = true;
      });
      this.renderer(itemsToBeSelected);
    }
    changeSelection(valuesSelected);
  }

  setItemsDisabledInTreeView(itemsToBeSelected: TreeviewItem[]) {
    const changeSelection = (valuesSelected: any) => {
      valuesSelected.forEach((element: any) => {
        element.disabled = true;
      });
      this.renderer(itemsToBeSelected);
    }
    changeSelection(itemsToBeSelected);
  }

  setItemsUnSelectedInTreeView(itemsToBeSelected: TreeviewItem[], valuesSelected: string[]) {
    const changeSelection = (valuesSelected: any) => {
      valuesSelected.forEach((element: any) => {
        const foundItem = TreeviewHelper.findItemInList(itemsToBeSelected, element);
        console.log(foundItem);
        foundItem.checked = false;
      });
      this.renderer(itemsToBeSelected);
    }

    changeSelection(valuesSelected);
  }

  setInitItemsUnSelectedInTreeView(itemsToBeSelected: TreeviewItem[], valuesSelected: TreeviewItem[]) {
    const changeSelection = (valuesSelected: any) => {
      valuesSelected.forEach((element: any) => {
        const foundItem = TreeviewHelper.findItemInList(itemsToBeSelected, element);
        console.log(foundItem);
        foundItem.checked = false;
      });
      this.renderer(itemsToBeSelected);
    }

    changeSelection(valuesSelected);
  }
  renderer(itemsToBeSelected: TreeviewItem[]) {
    itemsToBeSelected.forEach(element => {
      element.correctChecked();
    });
    this.render = true;
    this.cdRef.detectChanges();
    this.render = false;
  }

  findIdsByLocationCodes(itemsToBeSelected: LocationMasterModel[], valuesSelected: string[]) {
    const selectClocationId = (itemsToBeSelected: LocationMasterModel[], valuesSelected: any) => {
      let output: string[] = [];
      valuesSelected.forEach((element: any) => {
        const locationIdSelected = itemsToBeSelected.find(a => a.locationCode === element)?.locationID;
        if (locationIdSelected)
          output.push(locationIdSelected!.toString());
      });
      return output;
    }

    return selectClocationId(itemsToBeSelected, valuesSelected);
  }

  findCodesByLocationIds(itemsToBeSelected: LocationMasterModel[], valuesSelected: string[]) {
    const selectClocationCode = (valuesSelected: any) => {
      let output: string[] = [];
      valuesSelected.forEach((element: any) => {
        const locationIdSelected = itemsToBeSelected.find(a => a.locationID === element)?.locationCode;
        output.push(locationIdSelected!);
      });
      return output;
    }

    return selectClocationCode(valuesSelected);
  }


  ClearContents() {
    this.reportFilterFormControls.SelectFilters.setValue([null]);
    $('select2bs4').select2().trigger('change');
  }

  onSubCategorySelectionChange(selectedValues: string[]) {
    this.SubCategorySelectedNodes = selectedValues;
  }

  onProductSelectionChange(selectedValues: string[]) {
    this.ProductSelectedNodes = selectedValues;
  }

  onCategorySelectionChange(selectedValues: string[]) {
    this.CategorySelectedNodes = selectedValues;
  }

  onBrandSelectionChange(selectedValues: string[]) {
    this.brandSelectedNodes = selectedValues;
  }

  onModelSelectionChange(selectedValues: string[]) {
    this.modelSelectedNodes = selectedValues;
  }
  onSiteSelectionChange(selectedValues: string[]) {
    this.siteSelectedNodes = selectedValues;
  }
  onBuildingSelectionChange(selectedValues: string[]) {
    this.buildingSelectedNodes = selectedValues;
  }
  onFloorSelectionChange(selectedValues: string[]) {
    this.floorSelectedNodes = selectedValues;
  }
  onRoomSelectionChange(selectedValues: string[]) {
    this.roomSelectedNodes = selectedValues;
  }


  onLocationSelectionChange(selectedValues: string[]) {
    this.LocationSelectedNodes = selectedValues;
  }

  onAssetStatusSelectionChange(selectedValues: string[]) {
    this.assetStatusSelectedNodes = selectedValues;
  }

  onDepartmentSelectionChange(selectedValues: string[]) {
    this.departmentSelectedNodes = selectedValues;
  }

  onEmployeeSelectionChange(selectedValues: string[]) {
    this.employeeSelectedNodes = selectedValues;
  }

  ViewReport() {
    this.submitted = true;
    this.error = '';
    switch (this.reportType) {
      case ReportNumbers.assetregisterreport: {
        var assetreportsummaryFilter: AssetRegisterFilterReport = new AssetRegisterFilterReport;
        assetreportsummaryFilter.locations = this.findIdsByLocationCodes(this.locationItems, this.LocationSelectedNodes).map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        assetreportsummaryFilter.subCategories = this.SubCategorySelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        assetreportsummaryFilter.categories = this.CategorySelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        assetreportsummaryFilter.brands = this.brandSelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        assetreportsummaryFilter.models = this.modelSelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        assetreportsummaryFilter.sites = this.siteSelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        assetreportsummaryFilter.buildings = this.buildingSelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        assetreportsummaryFilter.floors = this.floorSelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        assetreportsummaryFilter.rooms = this.roomSelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        assetreportsummaryFilter.products = this.ProductSelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        this.reportService.assetreportsummaryFilter = assetreportsummaryFilter;
        this.reportService.setViewFlag(true);
        //this.router.navigateByUrl('/assetregisterreportview');
        break;
      }
      case ReportNumbers.productsummaryreport: {
        var assetreportsummaryFilter: AssetRegisterFilterReport = new AssetRegisterFilterReport;
        assetreportsummaryFilter.subCategories = this.SubCategorySelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        assetreportsummaryFilter.categories = this.CategorySelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        assetreportsummaryFilter.products = this.ProductSelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        this.reportService.assetreportsummaryFilter = assetreportsummaryFilter;
        this.reportService.setViewFlag(true);
        //this.router.navigateByUrl('/assetregisterreportview');
        break;
      }
      case ReportNumbers.locationwisereport: {
        var locationWiseReportSummaryFilter: LocationWiseFilterReport = new LocationWiseFilterReport;
        locationWiseReportSummaryFilter.sites = this.siteSelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        locationWiseReportSummaryFilter.buildings = this.buildingSelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        locationWiseReportSummaryFilter.floors = this.floorSelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        locationWiseReportSummaryFilter.rooms = this.roomSelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        this.reportService.locationWiseReportSummaryFilter = locationWiseReportSummaryFilter;
        this.reportService.setViewFlag(true);
        //this.router.navigateByUrl('/locationwisereportview');
        break;
      }
      case ReportNumbers.categorywisereport: {
        var categoryWiseReportSummaryFilter: CategoryWiseFilterReport = new CategoryWiseFilterReport;
        categoryWiseReportSummaryFilter.locations = this.findIdsByLocationCodes(this.locationItems, this.LocationSelectedNodes).map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        categoryWiseReportSummaryFilter.subCategories = this.SubCategorySelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        categoryWiseReportSummaryFilter.categories = this.CategorySelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        categoryWiseReportSummaryFilter.brands = this.brandSelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        categoryWiseReportSummaryFilter.models = this.modelSelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        this.reportService.categoryWiseReportSummaryFilter = categoryWiseReportSummaryFilter;
        this.reportService.setViewFlag(true);
       // this.router.navigateByUrl('/categorywisereportview');
        break;
      }
      case ReportNumbers.assethistoryreport: {
        var categoryWiseReportSummaryFilter: CategoryWiseFilterReport = new CategoryWiseFilterReport;
        categoryWiseReportSummaryFilter.locations = this.findIdsByLocationCodes(this.locationItems, this.LocationSelectedNodes).map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        categoryWiseReportSummaryFilter.products = this.ProductSelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        this.reportService.categoryWiseReportSummaryFilter = categoryWiseReportSummaryFilter;
        this.reportService.setViewFlag(true);
        //this.router.navigateByUrl('/assethistoryreportview');
        break;
      }
      case ReportNumbers.categorywisevaluereport: {
        var categoryWiseReportSummaryFilter: CategoryWiseFilterReport = new CategoryWiseFilterReport;
        categoryWiseReportSummaryFilter.locations = this.findIdsByLocationCodes(this.locationItems, this.LocationSelectedNodes).map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        categoryWiseReportSummaryFilter.subCategories = this.SubCategorySelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        categoryWiseReportSummaryFilter.categories = this.CategorySelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        categoryWiseReportSummaryFilter.brands = this.brandSelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        categoryWiseReportSummaryFilter.models = this.modelSelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        this.reportService.categoryWiseReportSummaryFilter = categoryWiseReportSummaryFilter;
        this.reportService.setViewFlag(true);
       // this.router.navigateByUrl('/categorywisevaluereportview');
        break;
      }
      case ReportNumbers.assetcountstatuswisereport: {
        var assetStatusWiseFilterReport: AssetStatusWiseFilterReport = new AssetStatusWiseFilterReport;
        assetStatusWiseFilterReport.ids = this.assetStatusSelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        this.reportService.assetStatusWiseFilterReport = assetStatusWiseFilterReport;
        this.reportService.setViewFlag(true);
       // this.router.navigateByUrl('/assetcountstatuswisereportview');
        break;
      }
      case ReportNumbers.departmentwisereport: {
        var departmentsummaryFilter: AssetRegisterFilterReport = new AssetRegisterFilterReport;
        departmentsummaryFilter.departments = this.departmentSelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        this.reportService.departmentWiseSummaryFilter = departmentsummaryFilter;
        this.reportService.setViewFlag(true);
        //this.router.navigateByUrl('/departmentwisereportview');
        break;
      }
      case ReportNumbers.employeewisereport: {
        var employeesummaryFilter: AssetRegisterFilterReport = new AssetRegisterFilterReport;
        employeesummaryFilter.employees = this.employeeSelectedNodes.map(function (i) {
          return parseInt(i, 10);
        }).filter(Number);
        this.reportService.employeeWisesummaryFilter = employeesummaryFilter;
        this.reportService.setViewFlag(true);
       // this.router.navigateByUrl('/employeewisereportview');
        break;
      }
      default:
        break;
    }
  }

}

