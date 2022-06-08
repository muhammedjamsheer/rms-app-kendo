import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BuildingmasterService } from '../../../../../core/service/buildingmaster.service';
import { InactivateAlert } from '../../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-buildingmastergrid',
  templateUrl: './buildingmastergrid.component.html',
  styleUrls: ['./buildingmastergrid.component.scss']
})
export class BuildingmastergridComponent implements OnInit {
  @Input() name: string = 'buildingmaster';

  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;

  constructor(private router: Router,
    private buildingmasterService: BuildingmasterService,
    private inactivateAlert: InactivateAlert) {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
  }

  async ngOnInit() {

    this.subscription = this.buildingmasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/buildingmaster/add');
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.buildingmasterService.refreshClickevent.next();
  }

  OnEditClick() {
    this.router.navigateByUrl('/buildingmaster/edit/' + this.selectedNodes.buildingID);
  }

  OnViewClick() {
    this.router.navigateByUrl('/buildingmaster/view/' + this.selectedNodes.buildingID);
  }

  OnDeleteClick() {
    this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.buildingID, this.name);
  }

}
