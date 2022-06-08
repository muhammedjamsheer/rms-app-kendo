import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from '../../shared/shared.module';
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
import { DepartmentmasterformComponent } from './departmentmaster/departmentmasterform/departmentmasterform.component';
import { DepartmentmastergridComponent } from './departmentmaster/departmentmastergrid/departmentmastergrid.component';
import { EmployeemasterformComponent } from './employeemaster/employeemasterform/employeemasterform.component';
import { EmployeemastergridComponent } from './employeemaster/employeemastergrid/employeemastergrid.component';
import { FloormasterformComponent } from './floormaster/floormasterform/floormasterform/floormasterform.component';
import { FloormastergridComponent } from './floormaster/floormastergrid/floormastergrid.component';
import { LocationmasterformComponent } from './locationmaster/locationmasterform/locationmasterform/locationmasterform.component';
import { LocationmastergridComponent } from './locationmaster/locationmastergrid/locationmastergrid.component';
import { MasterRoutingModule } from './master-routing.module';
import { MasterComponent } from './master.component';
import { ProductmasterformComponent } from './productmaster/productmasterform/productmasterform.component';
import { ProductmastergridComponent } from './productmaster/productmastergrid/productmastergrid.component';
import { RoommasterformComponent } from './roommaster/roommasterform/roommasterform/roommasterform.component';
import { RoommastergridComponent } from './roommaster/roommastergrid/roommastergrid.component';
import { SitemasterformComponent } from './sitemaster/sitemasterform/sitemasterform.component';
import { SitemastergridComponent } from './sitemaster/sitemastergrid/sitemastergrid.component';
import { SuppliermasterformComponent } from './suppliermaster/suppliermasterform/suppliermasterform.component';
import { SuppliermastergridComponent } from './suppliermaster/suppliermastergrid/suppliermastergrid.component';
import { CustomermasterformComponent } from './customermater/customermasterform/customermasterform.component';
import { CustomermastergridComponent } from './customermater/customermastergrid/customermastergrid.component';
import { UsermasterformComponent } from './usermaster/usermasterform/usermasterform.component';
import { UsermastergridComponent } from './usermaster/usermastergrid/usermastergrid.component';
import { UserrolemastergridComponent } from './userrolemaster/userrolemastergrid/userrolemastergrid.component';
import { UserrolemasterformComponent } from './userrolemaster/userrolemasterform/userrolemasterform.component';
import { TreeviewModule } from 'ngx-treeview';
import { UserrolepermissionformComponent } from './userrolepermission/userrolepermissionform/userrolepermissionform.component';
import { WarehousemastergridComponent } from './warehousemaster/warehousemastergrid/warehousemastergrid.component';
import { WarehousemasterformComponent } from './warehousemaster/warehousemasterform/warehousemasterform.component';

@NgModule({
  declarations: [MasterComponent, SitemasterformComponent, 
    SitemastergridComponent, CompanyComponent, 
    BuildingmasterformComponent, FloormasterformComponent, 
    RoommasterformComponent, LocationmasterformComponent, 
    BuildingmastergridComponent, FloormastergridComponent, 
    RoommastergridComponent, LocationmastergridComponent, 
    DepartmentmasterformComponent, DepartmentmastergridComponent, 
    BrandmasterformComponent, BrandmastergridComponent, 
    BrandmodelmasterformComponent, BrandmodelmastergridComponent, 
    AssetcategorymasterformComponent, AssetcategorymastergridComponent, 
    AssetsubcategorymasterformComponent, AssetsubcategorymastergridComponent, 
    EmployeemasterformComponent, EmployeemastergridComponent, 
    CommonvaluelistgridComponent, CommonvaluelistformComponent, 
    SuppliermasterformComponent, SuppliermastergridComponent, 
    ProductmasterformComponent, ProductmastergridComponent, 
    CustomermasterformComponent, CustomermastergridComponent,
    UsermasterformComponent, UsermastergridComponent,UserrolemastergridComponent,
    UserrolemasterformComponent,UserrolepermissionformComponent, WarehousemastergridComponent, WarehousemasterformComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    MasterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TreeviewModule.forRoot(),
    AgGridModule.withComponents([])
  ],
  providers:[]
})
export class MasterModule { }
