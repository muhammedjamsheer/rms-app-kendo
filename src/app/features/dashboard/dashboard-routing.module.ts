import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/_helpers';
import { DashboardformComponent } from './dashboardform/dashboardform.component';

const routes: Routes = [
{ path: 'dashboardlink', component: DashboardformComponent, canActivate: [AuthGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
