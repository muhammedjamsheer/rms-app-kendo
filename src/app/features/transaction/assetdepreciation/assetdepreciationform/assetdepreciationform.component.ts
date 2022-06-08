import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { AssetCategoryMasterService } from '../../../../core/service/assetcategorymaster.service';
import { AssetSubCategoryMasterService } from '../../../../core/service/assetsubcategorymaster.service';
import { ProductMasterService } from '../../../../core/service/productmaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { AssetCategoryMasterModel } from '../../../../shared/model/AssetCategoryMasterModel';
import { AssetSubCategoryMasterModel } from '../../../../shared/model/AssetSubCategoryMasterModel';
import { ProductMasterModel } from '../../../../shared/model/ProductMasterModel';
declare var $: any;

@Component({
  selector: 'org-fat-assetdepreciationform',
  templateUrl: './assetdepreciationform.component.html',
  styleUrls: ['./assetdepreciationform.component.scss']
})
export class AssetdepreciationformComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  assetDepreciationForm: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  columnDefs: any;
  rowData: any;
  categoryCodes!: AssetCategoryMasterModel[];
  subCategoryCodes!: AssetSubCategoryMasterModel[];
  subCategoryCodesSearchHolder!: AssetSubCategoryMasterModel[];
  productCodes!: ProductMasterModel[];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private assetCategoryMasterService: AssetCategoryMasterService,
    private assetSubCategoryMasterService: AssetSubCategoryMasterService,
    private saveAlert: SaveAlert,
    private productMasterService: ProductMasterService) {

    this.assetDepreciationForm = this.formBuilder.group({
      assetCategorySelCode: [null],
      assetSubCategorySelCode: [null]
    });
  }

  async ngOnInit() {
    this.rowData = [];

    this.columnDefs = [
      { field: 'serialNumber', sortable: true, filter: true },
      { field: 'assetCode', sortable: true, filter: true },
      { field: 'assetName', sortable: true, filter: true },
      { field: 'assetStatus', sortable: true, filter: true },
      { field: 'openingAssetValue', sortable: true, filter: true },
      { field: 'currentDepreciationValue', sortable: true, filter: true },
      { field: 'accumulatedDepreciation', sortable: true, filter: true, hide: true },
      { field: 'currentBookValue', sortable: true, filter: true, hide: true },
      { field: 'dateOfPurchase ', sortable: true, filter: true },
      { field: 'depreciationStartDate', sortable: true, filter: true },
      { field: 'costOftheAsset', sortable: true, filter: true, hide: true },
      { field: 'salvageValue', sortable: true, filter: true, hide: true }

    ];


    $('.select2bs4').select2();

    $('[name="assetCategorySelCode"]').on("change", () => {
      this.assetDepreciationFormControls.assetCategorySelCode.setValue($('[name="assetCategorySelCode"]').val());
      this.subCategoryCodes = this.subCategoryCodesSearchHolder.filter(item => item.assetCategoryId == $('[name="assetCategorySelCode"]').val());
    });

    $('[name="assetSubCategorySelCode"]').on("change", () => {
      this.assetDepreciationFormControls.assetSubCategorySelCode.setValue($('[name="assetSubCategorySelCode"]').val());
    });

    $('[name="AssetSelCode"]').on("change", () => {
      this.assetDepreciationFormControls.AssetSelCode.setValue($('[name="AssetSelCode"]').val());
    });

    this.categoryCodes = await this.assetCategoryMasterService.getAssetCategoryMaster();
    this.subCategoryCodes = await this.assetSubCategoryMasterService.getAssetSubCategoryMaster();
    this.productCodes = await this.productMasterService.getProductMaster();

  }

  get assetDepreciationFormControls() { return this.assetDepreciationForm.controls; }

  SearchDepreciation() {

  }

}

