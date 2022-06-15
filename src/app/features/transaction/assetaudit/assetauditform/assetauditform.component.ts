import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeviewHelper, TreeviewItem } from 'ngx-treeview';
import { Observable } from 'rxjs';
import { AssetAuditService } from '../../../../core/service/assetaudit.service';
import { AssetSubCategoryMasterService } from '../../../../core/service/assetsubcategorymaster.service';
import { LocationmasterService } from '../../../../core/service/locationmaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { AssetAuditModel } from '../../../../shared/model/AssetAuditModel';
import { AssetSubCategoryMasterModel } from '../../../../shared/model/AssetSubCategoryMasterModel';
import { LocationMasterModel } from '../../../../shared/model/LocationMasterModel';
declare var $: any;

@Component({
  selector: 'org-fat-assetauditform',
  templateUrl: './assetauditform.component.html',
  styleUrls: ['./assetauditform.component.scss']
})
export class AssetauditformComponent implements OnInit {
  assetAuditForm: FormGroup;
  categoryItems!: AssetSubCategoryMasterModel[];
  locationItems!: LocationMasterModel[];
  wareHouseList!: any[];
  itemsList!: TreeviewItem[];
  itemsLocationList!: TreeviewItem[];
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
  CategorySelectedNodes: string[] = [];
  LocationSelectedNodes: string[] = [];
  WarehouseSelectedNodes: string[] = [];
  render: boolean = false;
  Warehouses: any;
 subcategory= [
    {
      "assetSubCategoryId": 3,
      "assetSubCategoryName": "M8229   Heavy Duty Wire Pulling Spring Electric or Communication for Electrical Work Use. (5mm x 25 Meter)",
      "assetCategory": {
        "assetCategoryName": "TOOLS & EQUIPMENTS",
        "assetCategoryId": 1
      }
    },
    {
      "assetSubCategoryId": 4,
      "assetSubCategoryName": "2101   RHINO PVC BAG SMALL",
      "assetCategory": {
        "assetCategoryName": "RHINO PACKAGING",
        "assetCategoryId": 2
      }
    },
    {
      "assetSubCategoryId": 5,
      "assetSubCategoryName": "M8240   10 Piece Screwdriver Set",
      "assetCategory": {
        "assetCategoryName": "TOOLS & EQUIPMENTS",
        "assetCategoryId": 1
      }
    }
  ]
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private assetSubCategoryService: AssetSubCategoryMasterService,
    private locationMasterService: LocationmasterService,
    private assetAuditService: AssetAuditService,
    private saveAlert: SaveAlert,
    private router: Router,
    private cdRef: ChangeDetectorRef) {

    this.assetAuditForm = this.formBuilder.group({
      remarks: [null, Validators.required]
    });
  }
  getWarehouseItems(parentChildObj: any[]) {
    let itemsArray: any = [];
    parentChildObj.forEach(set => {
      itemsArray.push(new TreeviewItem(set))
    });
    return itemsArray;
  }
  prepareWarehousechilds(menulst: any[]) {
    let nmenulst = [];
    if (menulst != undefined) {
      for (let m = 0; m < menulst.length; m++) {
        nmenulst.push({ text: menulst[m].warehouseName, value: menulst[m].warehouseID, checked: false });
      }
    }
    return nmenulst;
  }

  async ngOnInit() {
    const today = new Date();
    const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    $('#AuditOn').datetimepicker({
      format: 'L'
    });

    $("#AuditOn .datetimepicker-input").val(datepart); // Assign the value
    $("#AuditOn .datetimepicker-input").trigger("click"); // Trigger click

    this.treeviewConfig = {
      hasAllCheckBox: true,
      hasFilter: true,
      hasCollapseExpand: true,
      decoupleChildFromParent: false,
      maxHeight: 370
    }

    // warehouse
    this.wareHouseList = await this.locationMasterService.getWarehouseMaster();
    var goupedData = this.wareHouseList.reduce(function (r, a) {
      r[a.companyId] = r[a.companyId] || [];
      r[a.companyId].push(a);
      return r;
    }, Object.create(null));
    let warehousedata: any[] = [];
    var count = 0;
    let menu: any;
    for (var key in goupedData) {
      let items = goupedData[key];
      var i = count++
      menu = { text: items[0].companyName, value: items[0].companyId, children: [] };
      menu.children = (this.prepareWarehousechilds(items));
      warehousedata[i] = menu;
    }
    this.Warehouses = this.getWarehouseItems(warehousedata);

    // category
    var subcategories = await this.assetSubCategoryService.getAssetSubCategoryMaster();
    const generateChild = (arr: any) => {
      return arr.reduce((acc: any, val: any, ind: any, array: any) => {
        const children: TreeviewItem[] = [];
        array.forEach((el: any, i: any) => {
          if (el.assetCategoryId === val.assetCategoryId) {
            children.push(new TreeviewItem({ text: el.assetSubCategoryName, value: el.assetSubCategoryId, checked: false }));
          };
        });
        return acc.concat({ ...val, children });
      }, []);
    };
    let categoryTree = generateChild(subcategories);
    categoryTree = categoryTree.filter((v: any, i: any, a: any) => a.findIndex((t: any) => (t.assetCategoryId === v.assetCategoryId)) === i);
    this.itemsList = categoryTree.map((item: any) => {
      return new TreeviewItem({ text: item.assetCategory.assetCategoryName, value: item.assetCategoryId, collapsed: false, children: item.children });
    });




    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.auditId = params['id'];
        this.editMode = true;
        this.assetAuditService.getAssetAuditByKey(this.auditId).subscribe(res => {
          this.ShowEditViewAssetAudit(res);
        });
        if (params['state'] === 'view') {
          this.disableControls();
          this.viewMode = true;
        }
      } else {
        this.editMode = false;
      }
    });
  }

  get assetAuditFormControls() { return this.assetAuditForm.controls; }

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

  renderer(itemsToBeSelected: TreeviewItem[]) {
    itemsToBeSelected.forEach(element => {
      element.correctChecked();
    });
    this.render = true;
    this.cdRef.detectChanges();
    this.render = false;
  }

  findIdsByLocationCodes(itemsToBeSelected: LocationMasterModel[], valuesSelected: string[]) {
    console.log(valuesSelected);
    const selectClocationId = (valuesSelected: any) => {
      let output: string[] = [];
      valuesSelected.forEach((element: any) => {
        const locationIdSelected = itemsToBeSelected.find(a => a.locationName === element)?.locationID;
        output.push(locationIdSelected!.toString());
      });
      return output;
    }

    return selectClocationId(valuesSelected);
  }

  findCodesByLocationIds(itemsToBeSelected: LocationMasterModel[], valuesSelected: string[]) {
    const selectClocationCode = (valuesSelected: any) => {
      let output: string[] = [];
      valuesSelected.forEach((element: any) => {
        const locationIdSelected = itemsToBeSelected.find(a => a.locationID === element)?.locationName;
        output.push(locationIdSelected!);
      });
      return output;
    }

    return selectClocationCode(valuesSelected);
  }

  ShowGrid() {
    this.router.navigateByUrl('/physicalcount');
  }

  disableControls() {
    $('#AuditOn .datetimepicker-input').attr('disabled', 'true');
    this.assetAuditFormControls.remarks.disable();
    this.isbtnClearDisabled = true;
    this.isbtnSaveDisabled = true;
  }

  ClearContents() {
    $('#AuditOn .datetimepicker-input').val('');
    this.auditStatus = 0;
    this.auditId = 0;
    this.assetAuditFormControls.remarks.setValue('');
    this.setItemsUnSelectedInTreeView(this.Warehouses, this.WarehouseSelectedNodes);
    this.setItemsSelectedInTreeView(this.itemsList, this.CategorySelectedNodes);
  }
  auditData: AssetAuditModel = new AssetAuditModel;
  ShowEditViewAssetAudit(data: AssetAuditModel) {
    this.auditData = data;
    this.auditId = data.auditId;
    $('#AuditOn .datetimepicker-input').val(formatDate(data.toBeAuditedOn, 'MM/dd/yyyy', 'en-US'));
    this.assetAuditFormControls.remarks.setValue(data.remark);
    this.auditStatus = data.auditStatus;
    // this.CategorySelectedNodes = data.subcategories;
    // this.LocationSelectedNodes = this.findCodesByLocationIds(this.locationItems, data.locations);
    // this.setItemsSelectedInTreeView(this.itemsList, this.CategorySelectedNodes);

    this.setItemsSelectedInTreeView(this.Warehouses, data.locations);
    this.setItemsSelectedInTreeView(this.itemsList, data.subcategories);
    this.isbtnClearDisabled = true;
    if (this.viewMode) {
      // this.setItemsDisabledInTreeView(this.itemsList);
      // this.setItemsDisabledInTreeView(this.itemsLocationList);
    }
  }

  onSubCategorySelectionChange(selectedValues: string[]) {
    console.log('selected values:', selectedValues);
    this.CategorySelectedNodes = selectedValues;
  }

  onLocationSelectionChange(selectedValues: string[]) {
    console.log('selected values:', selectedValues);
    this.LocationSelectedNodes = selectedValues;
  }
  onWarehouseSelectionChange(selectedValues: string[]) {
    console.log('selected warehouses:', selectedValues);
    this.WarehouseSelectedNodes = selectedValues;
  }

  SaveAssetAudit() {
    this.submitted = true;
    this.error = '';
    // stop here if form is invalid
    if (this.assetAuditForm.invalid) {
      return;
    }
    this.loading = true;
    let saveResponse!: Observable<any>;
    const locale = 'en-US';
    var assetAuditModel = new AssetAuditModel;
    assetAuditModel.auditId = this.auditId;
    assetAuditModel.auditStatus = this.editMode ? this.auditStatus : 30;
    assetAuditModel.auditStatusText = assetAuditModel.auditStatus == 30 ? 'Audit Created' : assetAuditModel.auditStatus == 40 ? 'Audit Downloaded' : 'Audit Closed';
    assetAuditModel.toBeAuditedOn = $('#AuditOn .datetimepicker-input').val();
    assetAuditModel.subCategories = this.CategorySelectedNodes;
    assetAuditModel.locations = this.WarehouseSelectedNodes;
    assetAuditModel.remark = this.assetAuditFormControls.remarks.value;

    debugger;
    
    if (this.editMode) {
      saveResponse = this.assetAuditService.editAssetAuditmaster(assetAuditModel);
    } else {
      saveResponse = this.assetAuditService.addAssetAudit(assetAuditModel);
    }
    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          assetAuditModel.auditId = result.auditId;
          assetAuditModel.createdDate = result.createdDate;
          assetAuditModel.createdBy = result.createdBy;
          this.ClearContents();
        }
        else {
          assetAuditModel.createdDate = this.auditData.createdDate;
          assetAuditModel.createdBy = this.auditData.createdBy;
        }
        this.saveAlert.SuccessMessage();
        this.assetAuditService.AddOrEditRecordToCache(assetAuditModel, this.editMode);
        this.loading = false;
        this.submitted = false;
        if (this.editMode)
          this.ShowGrid();

      },
      err => {
        this.error = err.error ? err.error : err.message;
        this.loading = false;
      }
    );
  }

}
