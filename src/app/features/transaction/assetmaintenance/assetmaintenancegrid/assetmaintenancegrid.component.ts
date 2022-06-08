import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AssetMaintenanceService } from '../../../../core/service/assetmaintenance.service';

@Component({
  selector: 'org-fat-assetmaintenancegrid',
  templateUrl: './assetmaintenancegrid.component.html',
  styleUrls: ['./assetmaintenancegrid.component.scss']
})
export class AssetmaintenancegridComponent implements OnInit {
  @Input() name: string = 'assetmaintenance';

  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;

  constructor(private router: Router,
    private assetMaintenanceService: AssetMaintenanceService) {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
  }

  async ngOnInit() {

    this.subscription = this.assetMaintenanceService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/maintenance/add');
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.isRowUnSelected = true;
    this.assetMaintenanceService.refreshClickevent.next();
  }

  OnEditClick() {
    this.router.navigate(['maintenance/edit', this.selectedNodes.maintenanceId]);
    //this.router.navigateByUrl('' + );
  }

  OnViewClick() {
    this.router.navigate(['maintenance/view', this.selectedNodes.maintenanceId]);
    //this.router.navigateByUrl('/assetmaintenance/view/' + this.selectedNodes.assetmaintenanceId);
  }


}


