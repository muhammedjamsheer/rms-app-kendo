import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { BrandmasterService } from '../../../../core/service/brandmaster.service';
import { BrandmodelmasterService } from '../../../../core/service/brandmodelmaster.service';
import { CommonValueListService } from '../../../../core/service/commonlistvalue.service';
import { ProductMasterService } from '../../../../core/service/productmaster.service';
import { ReceiptMasterService } from '../../../../core/service/receiptmaster.service';
import { SupplierMasterService } from '../../../../core/service/suppliermaster.service';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { BrandMasterModel } from '../../../../shared/model/BrandMasterModel';
import { BrandModelMasterModel } from '../../../../shared/model/BrandModelMasterModel';
import { CommonValueListModel } from '../../../../shared/model/CommonValueListModel';
import { ProductMasterModel } from '../../../../shared/model/ProductMasterModel';
import { ReceiptItemsLine } from '../../../../shared/model/ReceiptItemsLine';
import { ReceiptMasterModel } from '../../../../shared/model/ReceiptMasterModel';
import { SupplierMasterModel } from '../../../../shared/model/SupplierMasterModel';
import { Observable } from 'rxjs';
import { DepartmentmasterService } from 'src/app/core/service/departmentmaster.service';
import { EmployeeMasterService } from 'src/app/core/service/employeemaster.service';
import { LocationmasterService } from 'src/app/core/service/locationmaster.service';
import { DepartmentMasterModel } from 'src/app/shared/model/DepartmentMasterModel';
import { EmployeeMasterModel } from 'src/app/shared/model/EmployeeMasterModel';
import { LocationMasterModel } from 'src/app/shared/model/LocationMasterModel';
import { ModalService } from 'src/app/core/_modal';
import { FileUploader } from 'ng2-file-upload';
import { DownloadService } from 'src/app/core/service/download.service';
declare var $: any;

@Component({
  selector: 'org-fat-receiptmasterform',
  templateUrl: './receiptmasterform.component.html',
  styleUrls: ['./receiptmasterform.component.scss']
})
export class ReceiptmasterformComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  receiptMasterForm: FormGroup;
  submitted = false;
  loading = false;
  isbtnSaveDisabled: boolean = false;
  isbtnClearDisabled: boolean = false;
  receiptId!: string;
  error = '';
  errorReceipt = '';
  editMode: boolean = false;
  receiptData!: ReceiptMasterModel;
  receiptmastermodel: ReceiptMasterModel = new ReceiptMasterModel;
  rowReceiptData!: ReceiptItemsLine[];
  columnReceiptDefs: any;
  suppCodes!: SupplierMasterModel[];
  brandCodes!: BrandMasterModel[];
  modelCodes!: BrandModelMasterModel[];
  assetStatusCodes!: CommonValueListModel[];
  assetConditionCodes!: CommonValueListModel[];
  departmentCodes!: DepartmentMasterModel[];
  employeeCodes!: EmployeeMasterModel[];
  locationCodes!: LocationMasterModel[];
  receiptItemsLine!: ReceiptItemsLine;
  productCodes!: ProductMasterModel[];
  isReceiptAddHidden: boolean = false;
  isReceiptEditHidden: boolean = true;
  isReceiptDeleteHidden: boolean = true;
  isReceiptUpdateHidden: boolean = true;
  isReceiptCancelHidden: boolean = true;
  isRowDetailClickedHidden:boolean=true;
  productDescription!: string;
  modelCodesSearchHolder!: BrandModelMasterModel[];
  viewMode: boolean = false;
  uploader: FileUploader = new FileUploader({
    isHTML5: true,
    maxFileSize: 2 * 1024 * 1024,
    queueLimit: 3
  });
  downloadDocumentsList: string[] = [];

  constructor(private formBuilder: FormBuilder,
    private downloadService: DownloadService,
    private router: Router,
    private route: ActivatedRoute,
    private receiptMasterService: ReceiptMasterService,
    private supplierMasterService: SupplierMasterService,
    private brandMasterService: BrandmasterService,
    private brandModelMasterService: BrandmodelmasterService,
    private commonValueListMasterService: CommonValueListService,
    private productMasterService: ProductMasterService,
    private departmentMasterService:DepartmentmasterService,
    private employeeMasterService:EmployeeMasterService,
    private locationMasterService:LocationmasterService,
    private saveAlert: SaveAlert,private modalService:ModalService) {

    this.receiptMasterForm = this.formBuilder.group({
      supplierSelCode: [null, Validators.required],
      ReceiptAgainst: [null, Validators.required],
      ReceiptDate: [null],
      DocumentDate: [null],
      DocumentNo: [null, Validators.required],
      AssetSelCode: [null],
      EnterQty: [null],
      SupPartNumber: [null],
      PurchasePrice: [null],
      BrandSelCode: [null],
      ModelSelCode: [null],
      assetStatusSelCode: [null],
      assetConditionSelCode: [null],
      DepartmentSelCode: [null],
      EmployeeSelCode: [null],
      LocationSelCode: [null],
      ExtrlTagNumber:[null],
      ManufactureSerialNo:[null],
      ReceiptDocDetailsDiv: [null],
      fileInputDoc: []
    });
  }

  async ngOnInit() {
    this.rowReceiptData = [];
    this.columnReceiptDefs = [
      { field: 'productId', sortable: true, filter: true, hide: true, width: 150 },
      { field: 'productCode', sortable: true, filter: true, width: 150 },
      { field: 'productName', sortable: true, filter: true, width: 160 },
      { field: 'productDescription', sortable: true, filter: true, width: 150 },
      { field: 'quantity', sortable: true, filter: true, width: 120 },
      { field: 'purchasePrice', sortable: true, filter: true, width: 160 },
      { headerName: 'Supp Part No', field: 'manufacturePartNo', sortable: true, filter: true, width: 150 },
      { field: 'brandId', sortable: true, filter: true, hide: true, width: 150 },
      { field: 'brandName', sortable: true, filter: true, width: 150 },
      { field: 'modelId', sortable: true, filter: true, hide: true, width: 150 },
      { field: 'modelName', sortable: true, filter: true, width: 150 },
      { headerName: 'Asset Status', field: 'assetStatusDisplayText', sortable: true, filter: true, width: 150 },
      { headerName: 'Asset Condition', field: 'assetConditionDisplayText', sortable: true, filter: true, width: 160 },
      { field: 'serialNo', sortable: true, filter: true, width: 150 },
      { field: 'employeeName', sortable: true, filter: true, width: 150 },
      { field: 'ownerName', sortable: true, filter: true, width: 150 },
      { field: 'locationName', sortable: true, filter: true, width: 150 },
      { field: 'extrlTagNumber', sortable: true, filter: true, width: 150 },
      { field: 'manufactureSerialNo', sortable: true, filter: true, width: 150 },
      { field: 'departmentId', sortable: true, filter: true, hide: true, width: 150 },
      { field: 'employeeId', sortable: true, filter: true, hide: true, width: 150 },
      { field: 'locationId', sortable: true, filter: true, hide: true, width: 150 },
      { field: 'imageId', sortable: true, filter: true, hide: true, width: 150 },
    ];
this.receiptMasterFormControls.EnterQty.setValue('1');
    this.SetDropDownValueOnChange();

    this.SetDatePickerInitValue();

    //Get Drop Down Items
    await this.GetDropDownInitValues();

    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.receiptId = params['id'];
        this.editMode = true;

        this.receiptMasterService.getReceiptMasterByKey(this.receiptId)
          .then((value) => {
            this.receiptData = value as ReceiptMasterModel;
            console.log(this.receiptData);
            this.ShowEditViewReceiptMaster(this.receiptData);
            this.isReceiptAddHidden = false;
          });

        if (params['state'] === 'view') {
          this.viewMode = true;
          this.disableControls();
        }
      } else {
        this.editMode = false;
      }
    });
  }

  private async GetDropDownInitValues() {
    this.productCodes = await this.productMasterService.getProductMaster();
    this.suppCodes = await this.supplierMasterService.getSupplierMaster();
    this.brandCodes = await this.brandMasterService.getBrandMaster();
    this.modelCodes = await this.brandModelMasterService.getBrandmodelMaster();
    this.assetStatusCodes = await this.commonValueListMasterService.getAssetStatusItems();
    this.assetConditionCodes = await this.commonValueListMasterService.getAssetConditionItems();
    this.departmentCodes = await this.departmentMasterService.getDepartmentMaster();
    this.employeeCodes = await this.employeeMasterService.getEmployeeMaster();
    this.locationCodes = await this.locationMasterService.getLocationMaster();
    this.modelCodesSearchHolder = this.modelCodes;
  }

  private SetDatePickerInitValue() {
    const today = new Date();
    const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    $('#ReceiptDate').datetimepicker({
      format: 'L'
    });

    $('#DocumentDate').datetimepicker({
      format: 'L'
    });

    $('[name="#RecpDate"]').on("change", () => {
      this.receiptMasterFormControls.RecpDate.setValue($('[name="RecpDate"]').val());
    });

    $('[name="DocDate"]').on("change", () => {
      this.receiptMasterFormControls.DocDate.setValue($('[name="DocDate"]').val());
    });

    $("#ReceiptDate .datetimepicker-input").val(datepart); // Assign the value
    $("#ReceiptDate .datetimepicker-input").trigger("click"); // Trigger click

    $("#DocumentDate .datetimepicker-input").val(datepart); // Assign the value
    $("#DocumentDate .datetimepicker-input").trigger("click");
  }

  RegisterFileDownLoad(fileName: string) {    
    var docExtension = fileName.substr(fileName.lastIndexOf('.') + 1);
    this.downloadService.DownloadFile(fileName).subscribe((data: any) => {

      var blob = new Blob([data], { type: 'application/' + docExtension });

      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = fileName;
      link.click();

    });
  }

  private SetDropDownValueOnChange() {
    /* $('.select2bs4').select2(); */

    $('.select2bs4').select2();



    $('[name="supplierSelCode"]').on("change", () => {
      this.receiptMasterFormControls.supplierSelCode.setValue($('[name="supplierSelCode"]').val());
    });

    $('[name="supplierSelCode"]').on("change", () => {
      this.receiptMasterFormControls.supplierSelCode.setValue($('[name="supplierSelCode"]').val());
    });

    // $('[name="ProductSelDesc"]').on("change", () => {
    //   this.receiptMasterFormControls.ProductSelDesc.setValue($('[name="ProductSelDesc"]').val());
    // });

    $('[name="AssetSelCode"]').on("change", () => {
      this.receiptMasterFormControls.AssetSelCode.setValue($('[name="AssetSelCode"]').val());
      if ($('[name="AssetSelCode"]').val() > 0) {
        this.productDescription = this.productCodes.find(item => item.productId == this.receiptMasterFormControls.AssetSelCode.value)?.productDescription as string;
      }
    });

    $('[name="BrandSelCode"]').on("change", () => {
      this.receiptMasterFormControls.BrandSelCode.setValue($('[name="BrandSelCode"]').val());
      this.modelCodes = this.modelCodesSearchHolder.filter(item => item.brandID == $('[name="BrandSelCode"]').val());
    });

    $('[name="ModelSelCode"]').on("change", () => {
      this.receiptMasterFormControls.ModelSelCode.setValue($('[name="ModelSelCode"]').val());
    });

    $('[name="assetStatusSelCode"]').on("change", () => {
      this.receiptMasterFormControls.assetStatusSelCode.setValue($('[name="assetStatusSelCode"]').val());
    });

    $('[name="assetStatusSelCode"]').on("change", () => {
      this.receiptMasterFormControls.assetStatusSelCode.setValue($('[name="assetStatusSelCode"]').val());
    });

    $('[name="assetConditionSelCode"]').on("change", () => {
      this.receiptMasterFormControls.assetConditionSelCode.setValue($('[name="assetConditionSelCode"]').val());
    });
    $('[name="EmployeeSelCode"]').on("change", () => {
      this.receiptMasterFormControls.EmployeeSelCode.setValue($('[name="EmployeeSelCode"]').val());
    });
    $('[name="DepartmentSelCode"]').on("change", () => {
      this.receiptMasterFormControls.DepartmentSelCode.setValue($('[name="DepartmentSelCode"]').val());
    });
    $('[name="LocationSelCode"]').on("change", () => {
      this.receiptMasterFormControls.LocationSelCode.setValue($('[name="LocationSelCode"]').val());
    });
  }

  get receiptMasterFormControls() { return this.receiptMasterForm.controls; }

  AddToReceiptGrid() {
    this.SetValidatorsForGridAddControls();

    this.submitted = true;

    this.errorReceipt = '';
    if (this.receiptMasterForm.invalid)
      return;

    this.error = '';
    //Need to validate this based on ProductID
    const hasSameProduct = this.rowReceiptData.some(x => x.productCode == this.productCodes.filter(x => x.productId == this.receiptMasterFormControls.AssetSelCode.value)[0].productCode);

    if (hasSameProduct) {
      this.errorReceipt = 'Same record with Product code already exists!';
      return;
    }

    this.UpdateReceiptItemLine();
    this.rowReceiptData.push(this.receiptItemsLine);
    this.UpdateReceiptSubGridRows();
    this.ClearAssetLineItemsControlsOnAdd();
    this.DisableValidatorsForGridAddControls();
    this.submitted = false;
  }

  private SetValidatorsForGridAddControls() {
    this.receiptMasterFormControls.AssetSelCode.setValidators([Validators.required]);
    this.receiptMasterFormControls.EnterQty.setValidators([Validators.required]);
    this.receiptMasterFormControls.PurchasePrice.setValidators([Validators.required]);
    this.UpdateValiditityForGridAddControls();
  }

  private UpdateValiditityForGridAddControls() {
    this.receiptMasterFormControls.AssetSelCode.updateValueAndValidity();
    this.receiptMasterFormControls.EnterQty.updateValueAndValidity();
    this.receiptMasterFormControls.PurchasePrice.updateValueAndValidity();
  }

  private DisableValidatorsForGridAddControls() {
    this.receiptMasterFormControls.AssetSelCode.setValidators(null);
    this.receiptMasterFormControls.EnterQty.setValidators(null);
    this.receiptMasterFormControls.PurchasePrice.setValidators(null);
    this.UpdateValiditityForGridAddControls();
  }

  private UpdateReceiptSubGridRows() {
    this.agGrid.api.setRowData(this.rowReceiptData);
    this.agGrid.api.redrawRows();
  }

  private UpdateReceiptItemLine() {
    this.receiptItemsLine = new ReceiptItemsLine();

    this.receiptItemsLine.productId = this.receiptMasterFormControls.AssetSelCode.value;
    this.receiptItemsLine.quantity = this.receiptMasterFormControls.EnterQty.value;
    this.receiptItemsLine.purchasePrice = this.receiptMasterFormControls.PurchasePrice.value;
    this.receiptItemsLine.manufacturePartNo = this.receiptMasterFormControls.SupPartNumber.value;
    this.receiptItemsLine.brandId = this.receiptMasterFormControls.BrandSelCode.value;
    this.receiptItemsLine.modelId = this.receiptMasterFormControls.ModelSelCode.value;
    this.receiptItemsLine.assetStatusId = this.receiptMasterFormControls.assetStatusSelCode.value;
    this.receiptItemsLine.assetConditionId = this.receiptMasterFormControls.assetConditionSelCode.value;
    this.receiptItemsLine.locationId = this.receiptMasterFormControls.LocationSelCode.value;
    this.receiptItemsLine.ownerId = this.receiptMasterFormControls.DepartmentSelCode.value;
    this.receiptItemsLine.employeeId = this.receiptMasterFormControls.EmployeeSelCode.value;
    this.receiptItemsLine.extrlTagNumber = this.receiptMasterFormControls.ExtrlTagNumber.value;
    this.receiptItemsLine.manufactureSerialNo = this.receiptMasterFormControls.ManufactureSerialNo.value;
    this.receiptItemsLine.serialNo=this.SerialNo;
    this.receiptItemsLine.imageId=this.ImageId;
    
    this.setDisplayTexts(this.receiptItemsLine);

    this.ClearAssetLineItemsControlsOnAdd();
    this.submitted = false;
  }

  private setDisplayTexts(itemLine: ReceiptItemsLine) {
    let selProd = this.productCodes.find(x => x.productId == itemLine.productId);
    let selBrand = this.brandCodes.find(x => x.brandID == itemLine.brandId);
    let selModel = this.modelCodes.find(x => x.modelID == itemLine.modelId);
    let selStatus = this.assetStatusCodes.find(x => x.value == itemLine.assetStatusId);
    let selCondition = this.assetConditionCodes.find(x => x.value == itemLine.assetConditionId);
    let selDepartment = this.departmentCodes.find(x => x.departmentID == itemLine.ownerId);
    let selEmployee = this.employeeCodes.find(x => x.employeeId == itemLine.employeeId);
    let selLocation = this.locationCodes.find(x => x.locationID == itemLine.locationId);

    itemLine.productCode = selProd ? selProd.productCode : '';
    itemLine.productName = selProd ? selProd.productName : '';
    itemLine.productDescription = selProd ? selProd.productDescription : '';
    itemLine.brandCode = selBrand ? selBrand.brandCode : '';
    itemLine.brandName = selBrand ? selBrand.brandName : '';
    itemLine.modelCode = selModel ? selModel.modelCode : '';
    itemLine.modelName = selModel ? selModel.modelName : '';
    itemLine.ownerName = selDepartment ? selDepartment.departmentName : '';
    itemLine.employeeName = selEmployee ? selEmployee.firstName + ' ' + selEmployee.lastName : '';
    itemLine.locationName = selLocation ? selLocation.locationName  : '';
    itemLine.assetStatusValue = selStatus ? selStatus.value : '';
    itemLine.assetStatusDisplayText = selStatus ? selStatus.displayText : '';
    itemLine.assetConditionValue = selCondition ? selCondition.value : '';
    itemLine.assetConditionDisplayText = selCondition ? selCondition.displayText : '';
  }
SerialNo='';
ImageId='';
  EditAssetReceipt() {
    this.receiptItemsLine = this.agGrid.api.getSelectedRows()[0];
    this.SerialNo=this.receiptItemsLine.serialNo;
    this.ImageId=this.receiptItemsLine.imageId;
    this.productDescription = this.sureFind(this.productCodes.find(item => item.productId == this.receiptItemsLine.productId)).productDescription;
    this.receiptMasterFormControls.AssetSelCode.setValue(this.receiptItemsLine.productId);
    this.receiptMasterFormControls.EnterQty.setValue(this.receiptItemsLine.quantity);
    this.receiptMasterFormControls.SupPartNumber.setValue(this.receiptItemsLine.manufacturePartNo);
    this.receiptMasterFormControls.PurchasePrice.setValue(this.receiptItemsLine.purchasePrice);
    this.receiptMasterFormControls.BrandSelCode.setValue(this.receiptItemsLine.brandId);
    this.receiptMasterFormControls.assetStatusSelCode.setValue(this.receiptItemsLine.assetStatusId);
    this.receiptMasterFormControls.assetConditionSelCode.setValue(this.receiptItemsLine.assetConditionId);
    this.receiptMasterFormControls.DepartmentSelCode.setValue(this.receiptItemsLine.ownerId);
    this.receiptMasterFormControls.EmployeeSelCode.setValue(this.receiptItemsLine.employeeId);
    this.receiptMasterFormControls.LocationSelCode.setValue(this.receiptItemsLine.locationId);
    this.receiptMasterFormControls.ExtrlTagNumber.setValue(this.receiptItemsLine.extrlTagNumber);
    this.receiptMasterFormControls.ManufactureSerialNo.setValue(this.receiptItemsLine.manufactureSerialNo);
    $('select').select2().trigger('change');
    this.receiptMasterFormControls.ModelSelCode.setValue(this.receiptItemsLine.modelId);
    $('select').select2().trigger('change');
    this.isReceiptAddHidden = true;
    this.isReceiptDeleteHidden = true;
    this.isReceiptEditHidden = true;
    this.isReceiptUpdateHidden = false;
    this.isReceiptCancelHidden = false;
    this.isRowDetailClickedHidden=false;
  }

  DeleteAssetReceipt() {
    this.receiptItemsLine = this.agGrid.api.getSelectedRows()[0];
    const index = this.rowReceiptData.findIndex(x => x.productId == this.receiptItemsLine.productId);
    if (index > -1) {
      this.rowReceiptData.splice(index, 1);
      this.agGrid.api.setRowData(this.rowReceiptData);
      this.agGrid.api.redrawRows();
    }
  }

  onReceiptRowClick(event: any) {
    this.isReceiptEditHidden = !this.isReceiptUpdateHidden || this.viewMode;
    this.isReceiptDeleteHidden = !this.isReceiptUpdateHidden || this.viewMode;
    this.isRowDetailClickedHidden=false;
    this.imageUrlAct="";
  }
  imageUrlAct="";
  ClearAssetLineItemsControlsOnAdd() {
    this.productDescription = '';
    this.receiptMasterFormControls.AssetSelCode.setValue('');
    this.receiptMasterFormControls.EnterQty.setValue('1');
    this.receiptMasterFormControls.SupPartNumber.setValue('');
    this.receiptMasterFormControls.PurchasePrice.setValue('');
    this.receiptMasterFormControls.BrandSelCode.setValue('');
    this.receiptMasterFormControls.ModelSelCode.setValue('');
    this.receiptMasterFormControls.assetStatusSelCode.setValue('');
    this.receiptMasterFormControls.assetConditionSelCode.setValue('');
    this.receiptMasterFormControls.DepartmentSelCode.setValue('');
    this.receiptMasterFormControls.EmployeeSelCode.setValue('');
    this.receiptMasterFormControls.LocationSelCode.setValue('');
    this.receiptMasterFormControls.ExtrlTagNumber.setValue('');
    this.receiptMasterFormControls.ManufactureSerialNo.setValue('');
    this.SerialNo='';
    $('select').select2().trigger('change');
  }

  UpdateAssetReceipt() {
    this.SetValidatorsForGridAddControls();
    this.submitted = true;
    this.errorReceipt = '';
    if (this.receiptMasterForm.invalid)
      return;

    this.UpdateReceiptItemLine();

    //If product is changed to another product that is already exists in the GRID ?
    // const hasSameProduct = this.rowReceiptData.some(x => x.productId == this.receiptMasterFormControls.ProductSelDesc.value &&
    //   x.assetCode ==  this.receiptItemsLine.assetCode);

    // if (hasSameProduct) {
    //   this.errorReceipt = 'Same record with Product and Asset Code already exists!';
    //   return;
    // }
    const index = this.rowReceiptData.findIndex(x => x.productId == this.receiptItemsLine.productId && x.serialNo== this.receiptItemsLine.serialNo);
console.log(this.receiptItemsLine);
console.log(index);
    if (index > -1) {
      this.rowReceiptData[index] = this.receiptItemsLine;
    }
    this.UpdateReceiptSubGridRows();
    this.isReceiptAddHidden = false;
    this.isReceiptDeleteHidden = true;
    this.isReceiptEditHidden = true;
    this.isReceiptUpdateHidden = true;
    this.isReceiptCancelHidden = true;
    this.isRowDetailClickedHidden=true;
    this.DisableValidatorsForGridAddControls();
  }

  CancelAssetReceipt() {
    this.isReceiptAddHidden = false;
    this.isReceiptDeleteHidden = true;
    this.isReceiptEditHidden = true;
    this.isReceiptUpdateHidden = true;
    this.isReceiptCancelHidden = true;
    this.isRowDetailClickedHidden=true;
    this.ClearAssetLineItemsControlsOnAdd();
    this.DisableValidatorsForGridAddControls();
  }

  ShowGrid() {
    this.router.navigateByUrl('/receipt');
  }

  disableControls() {
    this.receiptMasterFormControls.ReceiptAgainst.disable();
    this.receiptMasterFormControls.DocumentNo.disable();
    this.receiptMasterFormControls.DocumentDate.disable();
    this.receiptMasterFormControls.ReceiptDate.disable();
    this.receiptMasterFormControls.supplierSelCode.disable();
    this.receiptMasterFormControls.EnterQty.disable();
    this.receiptMasterFormControls.fileInputDoc.disable();
    $("#ReceiptDate .datetimepicker-input").attr('disabled', true);
    $("#DocumentDate .datetimepicker-input").attr('disabled', true);
    this.isbtnSaveDisabled = this.viewMode;
    this.isbtnClearDisabled = this.viewMode;
    this.isReceiptDeleteHidden = true;
    this.isReceiptAddHidden = true;
    this.isReceiptEditHidden = true;
    this.isReceiptUpdateHidden = true;
    this.isReceiptCancelHidden = true;
    this.isRowDetailClickedHidden=true;
  }

  ClearContents() {
    this.receiptId = '';
    const today = new Date();
    const datepart = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();

    this.receiptMasterFormControls.ReceiptAgainst.setValue('');
    this.receiptMasterFormControls.DocumentNo.setValue('');
    $("#ReceiptDate .datetimepicker-input").val(datepart);
    $("#DocumentDate .datetimepicker-input").val(datepart);
    this.receiptMasterFormControls.supplierSelCode.setValue('');
    this.rowReceiptData = [];
    this.UpdateReceiptSubGridRows();
    $('select').select2().trigger('change');

  }

  ShowImage(id:string)
  {
    this.receiptItemsLine = this.agGrid.api.getSelectedRows()[0];
    this.imageUrlAct=this.receiptItemsLine.imageUrl;
    console.log(this.imageUrlAct);
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
}

  ShowEditViewReceiptMaster(data: ReceiptMasterModel) {
    this.receiptMasterFormControls.ReceiptAgainst.setValue(data.refDocumentType);
    this.receiptMasterFormControls.DocumentNo.setValue(data.refDocumentNo);
    $("#ReceiptDate .datetimepicker-input").val(formatDate(data.receiptDate, 'MM/dd/yyyy', 'en-US'));
    $("#DocumentDate .datetimepicker-input").val(formatDate(data.refDocumentDate, 'MM/dd/yyyy', 'en-US'));
    this.receiptMasterFormControls.supplierSelCode.setValue(data.supplierId);
    this.downloadDocumentsList = data.documentIds ? data.documentIds.split(';') : [];
    if (this.downloadDocumentsList.length > 1)
      this.downloadDocumentsList.pop();
    //From Server Only Ids are sent to client, So need to set the Text/Desc Values in the ItemLines
    //Server logic changed to sent the details
    //data.itemLines.map((itemLine, indx, allElements) => {
    //  this.setDisplayTexts(itemLine);
    //});

    this.rowReceiptData = data.itemLines;
    this.UpdateReceiptSubGridRows();
    this.disableControls();
  }
  locale = 'en-US';
  SaveReceiptMaster() {
    this.DisableValidatorsForGridAddControls();
    this.submitted = true;
    this.error = '';
    // stop here if form is invalid
    if (this.receiptMasterForm.invalid) {
      return;
    }
    if (!(this.rowReceiptData.length > 0)) {
      this.error = 'Please add receipt line items';
      return;
    }
    const formData = new FormData();
    let saveResponse: Observable<ReceiptMasterModel>;
    this.loading = true;
    this.receiptmastermodel = new ReceiptMasterModel;
    this.receiptmastermodel.receiptId = this.receiptId;
    this.receiptmastermodel.refDocumentType = this.receiptMasterFormControls.ReceiptAgainst.value;
    this.receiptmastermodel.refDocumentNo = this.receiptMasterFormControls.DocumentNo.value;
    this.receiptmastermodel.refDocumentDate = new Date($('#DocumentDate .datetimepicker-input').val());
    this.receiptmastermodel.receiptDate = new Date($('#ReceiptDate .datetimepicker-input').val());
    var supplier = this.sureFind<SupplierMasterModel>(this.suppCodes.find((x) => x.supplierId == this.receiptMasterFormControls.supplierSelCode.value));
    this.receiptmastermodel.supplierId = supplier.supplierId;
    this.receiptmastermodel.supplierCode = supplier.supplierCode;
    this.receiptmastermodel.supplierName = supplier.supplierName;
  this.receiptMasterService.getReceiptMasterByKey(this.receiptId).then((p)=>{
      this.receiptmastermodel.receiptStatus=p?.receiptStatus;
    });
    formData.append('receiptId', this.receiptId);
    formData.append('refDocumentType', this.receiptMasterFormControls.ReceiptAgainst.value);
    formData.append('refDocumentNo', this.receiptMasterFormControls.DocumentNo.value);
    formData.append('refDocumentDate', $('#DocumentDate .datetimepicker-input').val() ?  formatDate($('#DocumentDate .datetimepicker-input').val(), 'yyyy-MM-dd', this.locale) :'');
    formData.append('receiptDate', $('#ReceiptDate .datetimepicker-input').val() ?  formatDate($('#ReceiptDate .datetimepicker-input').val(), 'yyyy-MM-dd', this.locale) :'');
    formData.append('supplierId', supplier.supplierId.toString());
    formData.append('receiptStatus', this.receiptmastermodel.receiptStatus);
    for (let j = 0; j < this.uploader.queue.length; j++) {
      let fileItem = this.uploader.queue[j]._file;
      formData.append('Documents', fileItem, fileItem.name);
    }
    this.receiptmastermodel.itemLines = this.rowReceiptData;
    formData.append('ItemLinesString',JSON.stringify(this.rowReceiptData));
    // this.rowReceiptData.forEach(element => {
    //   formData.append('itemLines', element.assetConditionId==null? '':element.assetConditionId);
    //   formData.append('itemLines', element.brandId==null?'':element.brandId.toString());
    //   formData.append('itemLines', element.assetStatusId==null? '': element.assetStatusId);
    //   formData.append('itemLines', element.employeeId==null?'': element.employeeId.toString());
    //   formData.append('itemLines', element.extrlTagNumber==null? '': element.extrlTagNumber);
    //   formData.append('itemLines', element.imageId==null? '' : element.imageId);
    //   formData.append('itemLines', element.locationId==null ?'': element.locationId.toString());
    //   formData.append('itemLines', element.manufacturePartNo==null?'' : element.manufacturePartNo);
    //   formData.append('itemLines', element.manufactureSerialNo);
    //   formData.append('itemLines', element.modelId==null? '': element.modelId.toString());
    //   formData.append('itemLines', element.ownerId==null?'': element.ownerId.toString());
    //   formData.append('itemLines', element.productId==null?'':  element.productId.toString());
    //   formData.append('itemLines', element.purchasePrice==null?'': element.purchasePrice.toString());
    //   formData.append('itemLines', element.quantity==null?'': element.quantity.toString());
    //   formData.append('itemLines', element.serialNo);
    // });
    
console.log(this.receiptmastermodel);
    if (this.editMode) {
      saveResponse = this.receiptMasterService.editReceiptmaster(formData,this.receiptId);
    } else {
      saveResponse = this.receiptMasterService.addReceiptmaster(formData);
    }


    saveResponse.subscribe(
      result => {
        if (!this.editMode) {
          this.receiptmastermodel.receiptId = result.receiptId;
          this.ClearContents();
        }
        this.saveAlert.SuccessMessage();
        this.receiptMasterService.AddOrEditRecordToCache(this.receiptmastermodel, this.editMode);
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

  sureFind<T>(argument: T | undefined | null, message: string = 'This value was promised to be there.'): T {
    if (argument === undefined || argument === null) {
      throw new TypeError(message);
    }
    return argument;
  }
}

