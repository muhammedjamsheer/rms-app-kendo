import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetCategoryMasterService } from '../../../../core/service/assetcategorymaster.service';
import { AssetSubCategoryMasterService } from '../../../../core/service/assetsubcategorymaster.service';
import { CommonValueListService } from '../../../../core/service/commonlistvalue.service';
import { ProductMasterService } from '../../../../core/service/productmaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { AssetCategoryMasterModel } from '../../../../shared/model/AssetCategoryMasterModel';
import { AssetSubCategoryMasterModel } from '../../../../shared/model/AssetSubCategoryMasterModel';
import { CommonValueListModel } from '../../../../shared/model/CommonValueListModel';
import { ProductMasterModel } from '../../../../shared/model/ProductMasterModel';
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'org-fat-productmasterform',
  templateUrl: './productmasterform.component.html',
  styleUrls: ['./productmasterform.component.scss']
})
export class ProductmasterformComponent implements OnInit {
  productmasterform: FormGroup;
  submitted = false;
  assetSubCategoryCodes: AssetSubCategoryMasterModel[] = [];
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  productId!: number;
  error = '';
  editMode: boolean = false;
  productData!: ProductMasterModel;
  productmastermodel: ProductMasterModel = new ProductMasterModel;
  assetCategoryCodes: AssetCategoryMasterModel[] = [];
  uomcodes: CommonValueListModel[] = [];
  SubCategoryCodesSearchHolder: AssetSubCategoryMasterModel[] = [];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private productmasterservice: ProductMasterService,
    private assetCategoryMasterService: AssetCategoryMasterService,
    private assetSubCategoryMasterService: AssetSubCategoryMasterService,
    private commonValueListService: CommonValueListService,
    private saveAlert: SaveAlert) {
    this.productmasterform = this.formBuilder.group({
      assetCategorySelCode: [null],
      UOMSelCode: [null],
      assetSubCategorySelCode: [null, Validators.required],
      ProductCode: [null, Validators.required],
      ProductName: [null, Validators.required],
      ProductDescription: [null]
    });
  }

  async ngOnInit() {
    this.assetCategoryCodes = await this.assetCategoryMasterService.getAssetCategoryMaster();
    this.uomcodes = await this.commonValueListService.getUOMItems();
    this.assetSubCategoryCodes = await this.assetSubCategoryMasterService.getAssetSubCategoryMaster();
    this.SubCategoryCodesSearchHolder = this.assetSubCategoryCodes;

    $('.select2bs4').select2();

    $('[name="UOMSelCode"]').on("change", () => {
      this.productmasterFormControls.UOMSelCode.setValue($('[name="UOMSelCode"]').val());
    });


    $('[name="assetSubCategorySelCode"]').on("change", () => {
      this.productmasterFormControls.assetSubCategorySelCode.setValue($('[name="assetSubCategorySelCode"]').val());
    });

    $('[name="assetCategorySelCode"]').on("change", () => {
      this.productmasterFormControls.assetCategorySelCode.setValue($('[name="assetCategorySelCode"]').val());
      this.assetSubCategoryCodes = this.SubCategoryCodesSearchHolder.filter(x => x.assetCategoryId == $('[name="assetCategorySelCode"]').val());
    });

    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.productId = +params['id'];
        this.editMode = true;
        this.productData = this.productmasterservice.getProductMasterByKey(this.productId) as ProductMasterModel;
        this.ShowEditViewProductMaster(this.productData);

        if (params['state'] === 'view') {
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
    });
  }

  get productmasterFormControls() { return this.productmasterform.controls; }

  ShowGrid() {
    this.router.navigateByUrl('/productmaster');
  }

  disableControls() {
    this.productmasterFormControls.UOMSelCode.disable();
    this.productmasterFormControls.assetSubCategorySelCode.disable();
    this.productmasterFormControls.ProductCode.disable();
    this.productmasterFormControls.ProductName.disable();
    this.productmasterFormControls.ProductDescription.disable();
    this.productmasterFormControls.assetCategorySelCode.disable();
    this.isbtnSaveDisabled = true;
    this.isbtnClearDisabled = true;
  }

  ClearContents() {
    this.productId = 0;
    this.productmasterFormControls.UOMSelCode.setValue('');
    this.productmasterFormControls.assetSubCategorySelCode.setValue('');
    this.productmasterFormControls.ProductCode.setValue('');
    this.productmasterFormControls.ProductName.setValue('');
    this.productmasterFormControls.ProductDescription.setValue('');
    this.productmasterFormControls.assetCategorySelCode.setValue('');
    $('select').select2().trigger('change');
  }

  ShowEditViewProductMaster(data: ProductMasterModel) {
    if (data) {
      this.productmasterFormControls.assetCategorySelCode.setValue(this.SubCategoryCodesSearchHolder.find(item => item.assetSubCategoryId == data.assetSubCategoryId)?.assetCategoryId);
      this.productmasterFormControls.UOMSelCode.setValue(data.uomId);
      this.productmasterFormControls.ProductCode.setValue(data.productCode);
      this.productmasterFormControls.ProductName.setValue(data.productName);
      this.productmasterFormControls.ProductDescription.setValue(data.productDescription);
      //$('select').select2().trigger('change');
      this.assetSubCategoryCodes = this.SubCategoryCodesSearchHolder.filter(x => x.assetCategoryId == this.productmasterFormControls.assetCategorySelCode.value);
      this.productmasterFormControls.assetSubCategorySelCode.setValue(data.assetSubCategoryId);
      //$('select').select2().trigger('change');
      this.productmasterFormControls.ProductCode.disable();
    }

  }

  SaveProductMaster() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.productmasterform.invalid) {
      return;
    }
    this.loading = true;
    let saveResponse: Observable<any>;
    this.productmastermodel = new ProductMasterModel;
    this.productmastermodel.assetSubCategoryId = this.productmasterFormControls.assetSubCategorySelCode.value;
    this.productmastermodel.productId = this.productId;
    this.productmastermodel.productCode = this.productmasterFormControls.ProductCode.value;
    this.productmastermodel.productName = this.productmasterFormControls.ProductName.value;
    this.productmastermodel.productDescription = this.productmasterFormControls.ProductDescription.value;
    this.productmastermodel.uomId = this.productmasterFormControls.UOMSelCode.value;
    const currentCategory = this.assetSubCategoryCodes.filter(item => item.assetSubCategoryId == this.productmastermodel.assetSubCategoryId)[0];
    this.productmastermodel.assetCategoryCode = currentCategory.assetCategory.assetCategoryCode;
    this.productmastermodel.assetCategoryName = currentCategory.assetCategory.assetCategoryName;
    this.productmastermodel.assetSubCategoryCode = currentCategory.assetSubCategoryCode;
    this.productmastermodel.assetSubCategoryName = currentCategory.assetSubCategoryName;

    if (this.editMode) {
      saveResponse = this.productmasterservice.editProductmaster(this.productmastermodel);
    } else {
      saveResponse = this.productmasterservice.addProductmaster(this.productmastermodel);
    }


    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          this.productmastermodel.productId = result.productId;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.productmasterservice.AddOrEditRecordToCache(this.productmastermodel, this.editMode);
        this.submitted = false;
        if (this.editMode) {
          this.ShowGrid();
        }
        this.loading = false;
      },
      err => {
        this.error = err.error ? err.error : err.message;
        this.loading = false;
      }
    );

  }
}