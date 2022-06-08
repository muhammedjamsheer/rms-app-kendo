import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/internal/Observable";
import { AssetAuditService } from "src/app/core/service/assetaudit.service";
import { AssetTransferRequestService } from "src/app/core/service/assettransferrequest.service";
import { UserMasterService } from "src/app/core/service/usermaster.service";
import { userrolemasterservice } from "src/app/core/service/userrolemaster.service";
import Swal from "sweetalert2";
import { AssetCategoryMasterService } from '../../core/service/assetcategorymaster.service';
import { AssetRegisterService } from '../../core/service/assetregister.service';
import { AssetSubCategoryMasterService } from '../../core/service/assetsubcategorymaster.service';
import { AssetVerificationService } from '../../core/service/assetverification.service';
import { BrandmasterService } from '../../core/service/brandmaster.service';
import { BrandmodelmasterService } from '../../core/service/brandmodelmaster.service';
import { BuildingmasterService } from '../../core/service/buildingmaster.service';
import { CommonValueListService } from '../../core/service/commonlistvalue.service';
import { DepartmentmasterService } from '../../core/service/departmentmaster.service';
import { EmployeeMasterService } from '../../core/service/employeemaster.service';
import { FloormasterService } from '../../core/service/floormaster.service';
import { LocationmasterService } from '../../core/service/locationmaster.service';
import { ProductMasterService } from '../../core/service/productmaster.service';
import { ReceiptMasterService } from '../../core/service/receiptmaster.service';
import { RoommasterService } from '../../core/service/roommaster.service';
import { SitemasterService } from '../../core/service/sitemaster.service';
import { SupplierMasterService } from '../../core/service/suppliermaster.service';
import { AssetAuditModel } from "../model/AssetAuditModel";
import { AssetTransferDirectModel } from "../model/AssetTransferDirectModel";
import { AssetTransferRequestModel } from "../model/AssetTransferRequestModel";

@Injectable({
    providedIn: 'root'
  })
  
export class InactivateAlert{

    constructor(private router: Router,
        private route: ActivatedRoute,
        private sitemasterService: SitemasterService,
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
        private usermasterservice:UserMasterService,
        private userrolemasterservice:userrolemasterservice,
        private auditmasterService:AssetAuditService,private transferrequestService:AssetTransferRequestService) { }
    
    InactivateConfirmBox(Id: number, entityName: string) {
        let deleteResponse: Observable<any>;
    
       
          Swal.fire({
            title: 'Are you sure you want to Inactivate?',
            text: 'You will not be able to recover this record!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.value) {
              deleteResponse = this.CallApiMethodToInactivate(Id, entityName) as Observable<any>;
              deleteResponse.subscribe(
                result => {
                  this.CallServiceToInactivateFromCache(Id, entityName);
                  this.SuccessMessage();
                  this.reload(entityName);
                },
                err => {
                  Swal.fire(
                    'Error',
                    err.error,
                    'error'
                  )
        
                }
              );
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire(
                'Cancelled'
              )
            }
          })
      }

      reload(entityName: string) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['./' + entityName], { relativeTo: this.route });
      }
    
      SuccessMessage() {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          icon: 'success',
          title: 'Successfully Inactivated!!!'
        });
      }

      CallApiMethodToInactivate(Id: number, entityName: string) {
        switch (entityName) {
            case 'sitemaster' : {
            return this.sitemasterService.DeleteSiteMaster(Id);
            }
            case 'buildingmaster' : {
                return this.buildingMasterService.DeleteBuildingMaster(Id);
            }
            case 'floormaster' : {
              return this.floorMasterService.DeleteFloorMaster(Id);
              break;
            }
            case 'roommaster' : {
              return this.roomMasterService.DeleteRoomMaster(Id);
              break;
            }
            case 'locationmaster' : {
              return this.locationMasterService.DeleteLocationMaster(Id);
              break;
            }
            case 'departmentmaster' : {
              return this.departmentMasterService.DeleteDepartmentMaster(Id);
              break;
            }
            case 'brandmaster' : {
              return this.brandMasterService.DeleteBrandMaster(Id);
              break;
            }
            case 'modelmaster' : {
              return this.brandmodelMasterService.DeleteBrandmodelMaster(Id);
              break;
            }
            case 'assetcategory' : {
              return this.assetCategoryMasterService.DeleteAssetCategoryMaster(Id);
              break;
            }
            case 'assetsubcategory' : {
              return this.assetSubCategoryMasterService.DeleteAssetSubCategoryMaster(Id);
              break;
            }
            case 'employeemaster' : {
              return this.employeeMasterService.DeleteEmployeeMaster(Id);
              break;
            }
            // case 'commonvaluelistmaster' : {
            //   return this.commonValueListService.de();
            //   break;
            // }
            case 'suppliermaster' : {
              return this.supplierMasterService.DeleteSupplierMaster(Id);
              break;
            }
            // case 'receiptmaster' : {
            //   return this.receiptMasterService.onRefreshReceiptMaster();
            //   break;
            // }
            case 'productmaster' : {
              return this.productMasterService.DeleteProductMaster(Id);
              break;
            }
            case 'usermaster' : {
              return this.usermasterservice.DeleteMaster(Id.toString());
              break;
            }
            case 'userrolemaster' : {
              return this.userrolemasterservice.DeleteMaster(Id);
              break;
            }
            // case 'assetregister' : {
            //   return this.assetRegisterService.onRefreshAssetRegister();
            //   break;
            // }
            // case 'assetverification' : {
            //   return this.assetVerificationService.onRefreshAssetVerification();
            //   break;
            // }
            default : {
                return null;
              break;
            }
          }
      }

      CallServiceToInactivateFromCache(Id: number, entityName: string) {
        switch (entityName) {
            case 'sitemaster' : {
            this.sitemasterService.DeleteFromCache(Id);
            break;
            }
            case 'buildingmaster' : {
              return this.buildingMasterService.DeleteFromCache(Id);
              break;
            }
            case 'floormaster' : {
              return this.floorMasterService.DeleteFromCache(Id);
              break;
            }
            case 'roommaster' : {
              return this.roomMasterService.DeleteFromCache(Id);
              break;
            }
            case 'locationmaster' : {
              return this.locationMasterService.DeleteFromCache(Id);
              break;
            }
            case 'departmentmaster' : {
              return this.departmentMasterService.DeleteFromCache(Id);
              break;
            }
            case 'brandmaster' : {
              return this.brandMasterService.DeleteFromCache(Id);
              break;
            }
            case 'modelmaster' : {
              return this.brandmodelMasterService.DeleteFromCache(Id);
              break;
            }
            case 'assetcategory' : {
              return this.assetCategoryMasterService.DeleteFromCache(Id);
              break;
            }
            case 'assetsubcategory' : {
              return this.assetSubCategoryMasterService.DeleteFromCache(Id);
              break;
            }
            case 'employeemaster' : {
              return this.employeeMasterService.DeleteFromCache(Id);
              break;
            }
            // case 'commonvaluelistmaster' : {
            //   return this.commonValueListService.DeleteFromCache(Id);
            //   break;
            // }
            case 'suppliermaster' : {
              return this.supplierMasterService.DeleteFromCache(Id);
              break;
            }
            // case 'receiptmaster' : {
            //   return this.receiptMasterService.DeleteFromCache(Id);
            //   break;
            // }
            case 'productmaster' : {
              return this.productMasterService.DeleteFromCache(Id);
              break;
            }
            case 'usermaster' : {
              return this.usermasterservice.DeleteFromCache(Id.toString());
              break;
            }
            case 'userrolemaster' : {
              return this.userrolemasterservice.DeleteFromCache(Id);
              break;
            }
            // case 'assetregister' : {
            //   return this.assetRegisterService.DeleteFromCache(Id);
            //   break;
            // }
            // case 'assetverification' : {
            //   return this.assetVerificationService.DeleteFromCache(Id);
            //   break;
            // }
            default : {
                return null;
              break;
            }
          }
      }

      SuccessMessageClose() {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          icon: 'success',
          title: 'Successfully Closed!!!'
        });
      }

      CallApiMethodToClose(Id: any, entityName: string) {
        switch (entityName) {
          
          case 'assetaudit': {
            return this.auditmasterService.CloseAuditMaster(Id);
            break;
          }
          case 'transferrequest': {
            return this.transferrequestService.CloseTransferRequest(Id);
            break;
          }
          default: {
            return null;
            break;
          }
        }
      }

      CallApiMethodToUpdateStatus(Id: any, entityName: string) {
        switch (entityName) {
          
          case 'assetaudit': {
            var data:AssetAuditModel=new AssetAuditModel;
            this.auditmasterService.getAssetAuditByKey(Id).subscribe(res=>{
              data=res;
              if(data!=null)
              {
                data.auditStatus=50;
                data.auditStatusText="Audit Closed";
                this.auditmasterService.AddOrEditRecordToCache(data,true);
              }
            });
           
           return 0;
            break;
          }
          case 'transferrequest': {
            var dataRequest:AssetTransferRequestModel=new AssetTransferRequestModel;
            this.transferrequestService.getAssetTransferRequestByKey(Id).subscribe(res=>{
              dataRequest=res;
              if(dataRequest!=null)
              {
                console.log(dataRequest.status);
                dataRequest.status=60;
                this.transferrequestService.AddOrEditRecordToCache(dataRequest,true);
                this.transferrequestService.AddOrEditRecordToCache(dataRequest,true);
              }
              this.transferrequestService.refreshClickevent.next();
            });
            return 0;
            break;
          }
          default: {
            return null;
            break;
          }
        }
      }
    

      CloseConfirmBox(Id: any, entityName: string) {
        let deleteResponse: Observable<any>;
        Swal.fire({
          title: 'Are you sure you want to Close?',
          //text: 'You will not be able to recover this record!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) {
            deleteResponse = this.CallApiMethodToClose(Id, entityName) as Observable<any>;
            deleteResponse.subscribe(
              result => {
                this.CallApiMethodToUpdateStatus(Id,entityName);
                this.CallServiceToInactivateFromCache(Id, entityName);
                this.SuccessMessageClose();
               // this.reload("physicalcount");
              },
              err => {
                Swal.fire(
                  'Error',
                  err.error,
                  'error'
                )
    
              }
            );
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
              'Cancelled'
            )
          }
        })
      }

}