import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../_helpers/auth.guard';
import { AssetcategorymasterformComponent } from './assetcategorymaster/assetcategorymasterform/assetcategorymasterform.component';
import { AssetcategorymastergridComponent } from './assetcategorymaster/assetcategorymastergrid/assetcategorymastergrid.component';
import { AssetsubcategorymasterformComponent } from './assetsubcategorymaster/assetsubcategorymasterform/assetsubcategorymasterform.component';
import { AssetsubcategorymastergridComponent } from './assetsubcategorymaster/assetsubcategorymastergrid/assetsubcategorymastergrid.component';
import { BrandmasterformComponent } from './brandmaster/brandmasterform/brandmasterform.component';
import { BrandmastergridComponent } from './brandmaster/brandmastergrid/brandmastergrid.component';
import { BrandmodelmasterformComponent } from './brandmodelmaster/brandmodelmasterform/brandmodelmasterform.component';
import { BrandmodelmastergridComponent } from './brandmodelmaster/brandmodelmastergrid/brandmodelmastergrid.component';
import { BuildingmasterformComponent } from './buildingmaster/buildingmasterform/buildingmasterform/buildingmasterform.component';
import { BuildingmastergridComponent } from './buildingmaster/buildingmastergrid/buildingmastergrid/buildingmastergrid.component';
import { CommonvaluelistformComponent } from './commonvaluelist/commonvaluelistform/commonvaluelistform.component';
import { CommonvaluelistgridComponent } from './commonvaluelist/commonvaluelistgrid/commonvaluelistgrid.component';
import { CompanyComponent } from './company/company.component';
import { CustomermasterformComponent } from './customermater/customermasterform/customermasterform.component';
import { CustomermastergridComponent } from './customermater/customermastergrid/customermastergrid.component';
import { DepartmentmasterformComponent } from './departmentmaster/departmentmasterform/departmentmasterform.component';
import { DepartmentmastergridComponent } from './departmentmaster/departmentmastergrid/departmentmastergrid.component';
import { EmployeemasterformComponent } from './employeemaster/employeemasterform/employeemasterform.component';
import { EmployeemastergridComponent } from './employeemaster/employeemastergrid/employeemastergrid.component';
import { FloormasterformComponent } from './floormaster/floormasterform/floormasterform/floormasterform.component';
import { FloormastergridComponent } from './floormaster/floormastergrid/floormastergrid.component';
import { LocationmasterformComponent } from './locationmaster/locationmasterform/locationmasterform/locationmasterform.component';
import { LocationmastergridComponent } from './locationmaster/locationmastergrid/locationmastergrid.component';
import { MasterComponent } from './master.component';
import { ProductmasterformComponent } from './productmaster/productmasterform/productmasterform.component';
import { ProductmastergridComponent } from './productmaster/productmastergrid/productmastergrid.component';
import { RoommasterformComponent } from './roommaster/roommasterform/roommasterform/roommasterform.component';
import { RoommastergridComponent } from './roommaster/roommastergrid/roommastergrid.component';
import { SitemasterformComponent } from './sitemaster/sitemasterform/sitemasterform.component';
import { SitemastergridComponent } from './sitemaster/sitemastergrid/sitemastergrid.component';
import { SuppliermasterformComponent } from './suppliermaster/suppliermasterform/suppliermasterform.component';
import { SuppliermastergridComponent } from './suppliermaster/suppliermastergrid/suppliermastergrid.component';
import { UsermasterformComponent } from './usermaster/usermasterform/usermasterform.component';
import { UsermastergridComponent } from './usermaster/usermastergrid/usermastergrid.component';
import { UserrolemasterformComponent } from './userrolemaster/userrolemasterform/userrolemasterform.component';
import { UserrolemastergridComponent } from './userrolemaster/userrolemastergrid/userrolemastergrid.component';
import { UserrolepermissionformComponent } from './userrolepermission/userrolepermissionform/userrolepermissionform.component';
import { WarehousemastergridComponent } from './warehousemaster/warehousemastergrid/warehousemastergrid.component';
import { WarehousemasterformComponent } from './warehousemaster/warehousemasterform/warehousemasterform.component';

const routes: Routes = [{ path: 'company', component: CompanyComponent },
{ path: '', component: MasterComponent },
{ path: 'sitemaster', component: SitemastergridComponent, canActivate: [AuthGuard] },
{ path: 'buildingmaster', component: BuildingmastergridComponent, canActivate: [AuthGuard] },
{ path: 'floormaster', component: FloormastergridComponent, canActivate: [AuthGuard] },
{ path: 'roommaster', component: RoommastergridComponent, canActivate: [AuthGuard] },
{ path: 'location', component: LocationmastergridComponent, canActivate: [AuthGuard] },
{ path: 'departmentmaster', component: DepartmentmastergridComponent, canActivate: [AuthGuard] },
{ path: 'sitemaster/add', component: SitemasterformComponent, canActivate: [AuthGuard] },
{ path: 'sitemaster/:state/:id', component: SitemasterformComponent, canActivate: [AuthGuard] },
{ path: 'buildingmaster/add', component: BuildingmasterformComponent, canActivate: [AuthGuard] },
{ path: 'buildingmaster/:state/:id', component: BuildingmasterformComponent, canActivate: [AuthGuard] },
{ path: 'floormaster/add', component: FloormasterformComponent, canActivate: [AuthGuard] },
{ path: 'floormaster/:state/:id', component: FloormasterformComponent, canActivate: [AuthGuard] },
{ path: 'roommaster/add', component: RoommasterformComponent, canActivate: [AuthGuard] },
{ path: 'roommaster/:state/:id', component: RoommasterformComponent, canActivate: [AuthGuard] },
{ path: 'locationmaster/add', component: LocationmasterformComponent, canActivate: [AuthGuard] },
{ path: 'locationmaster/:state/:id', component: LocationmasterformComponent, canActivate: [AuthGuard] },
{ path: 'departmentmaster/add', component: DepartmentmasterformComponent, canActivate: [AuthGuard] },
{ path: 'departmentmaster/:state/:id', component: DepartmentmasterformComponent, canActivate: [AuthGuard] },
{ path: 'brandmaster', component: BrandmastergridComponent, canActivate: [AuthGuard] },
{ path: 'brandmaster/add', component: BrandmasterformComponent, canActivate: [AuthGuard] },
{ path: 'brandmaster/:state/:id', component: BrandmasterformComponent, canActivate: [AuthGuard] },
{ path: 'modelmaster', component: BrandmodelmastergridComponent, canActivate: [AuthGuard] },
{ path: 'modelmaster/add', component: BrandmodelmasterformComponent, canActivate: [AuthGuard] },
{ path: 'modelmaster/:state/:id', component: BrandmodelmasterformComponent, canActivate: [AuthGuard] },
{ path: 'assetcategory', component: AssetcategorymastergridComponent, canActivate: [AuthGuard] },
{ path: 'assetcategory/add', component: AssetcategorymasterformComponent, canActivate: [AuthGuard] },
{ path: 'assetcategory/:state/:id', component: AssetcategorymasterformComponent, canActivate: [AuthGuard] },
{ path: 'assetsubcategory', component: AssetsubcategorymastergridComponent, canActivate: [AuthGuard] },
{ path: 'assetsubcategory/add', component: AssetsubcategorymasterformComponent, canActivate: [AuthGuard] },
{ path: 'assetsubcategory/:state/:id', component: AssetsubcategorymasterformComponent, canActivate: [AuthGuard] },
{ path: 'employeemaster', component: EmployeemastergridComponent, canActivate: [AuthGuard] },
{ path: 'employeemaster/add', component: EmployeemasterformComponent, canActivate: [AuthGuard] },
{ path: 'employeemaster/:state/:id', component: EmployeemasterformComponent, canActivate: [AuthGuard] },
{ path: 'suppliermaster', component: SuppliermastergridComponent, canActivate: [AuthGuard] },
{ path: 'suppliermaster/add', component: SuppliermasterformComponent, canActivate: [AuthGuard] },
{ path: 'suppliermaster/:state/:id', component: SuppliermasterformComponent, canActivate: [AuthGuard] },
{ path: 'valuelist', component: CommonvaluelistgridComponent, canActivate: [AuthGuard] },
{ path: 'valuelist/add', component: CommonvaluelistformComponent, canActivate: [AuthGuard] },
{ path: 'valuelist/:state/:id', component: CommonvaluelistformComponent, canActivate: [AuthGuard] },
{ path: 'productmaster', component: ProductmastergridComponent, canActivate: [AuthGuard] },
{ path: 'productmaster/add', component: ProductmasterformComponent, canActivate: [AuthGuard] },
{ path: 'productmaster/:state/:id', component: ProductmasterformComponent, canActivate: [AuthGuard] },
{ path: 'customermaster', component: CustomermastergridComponent, canActivate: [AuthGuard] },
{ path: 'customermaster/add', component: CustomermasterformComponent, canActivate: [AuthGuard] },
{ path: 'customermaster/:state/:id', component: CustomermasterformComponent, canActivate: [AuthGuard] },
{ path: 'usermaster', component: UsermastergridComponent, canActivate: [AuthGuard] },
{ path: 'usermaster/add', component: UsermasterformComponent, canActivate: [AuthGuard] },
{ path: 'usermaster/:state/:id', component: UsermasterformComponent, canActivate: [AuthGuard] },
{ path: 'rolepermission', component: UserrolepermissionformComponent, canActivate: [AuthGuard] },
{ path: 'userrolemaster', component: UserrolemastergridComponent, canActivate: [AuthGuard] },
{ path: 'userrolemaster/add', component: UserrolemasterformComponent, canActivate: [AuthGuard] },
{ path: 'userrolemaster/:state/:id', component: UserrolemasterformComponent, canActivate: [AuthGuard] },
{ path: 'warehouse', component: WarehousemastergridComponent, canActivate: [AuthGuard] },
{ path: 'warehouse/add', component: WarehousemasterformComponent, canActivate: [AuthGuard] },
{ path: 'warehouse/:state/:id', component: WarehousemasterformComponent, canActivate: [AuthGuard] },

];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
