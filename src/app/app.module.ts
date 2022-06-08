import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { ReportsModule } from './features/reports/reports.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    DashboardModule,
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    ReportsModule
  ],
  exports: [NgxChartsModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
