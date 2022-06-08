import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardformComponent } from './dashboardform/dashboardform.component';

@NgModule({
  declarations: [DashboardformComponent],
  imports: [
    BrowserAnimationsModule,
    NgxChartsModule,
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([]),
     
  ],
  providers:[]
})
export class DashboardModule { }
