import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetSubCategoryMasterService } from '../../../../core/service/assetsubcategorymaster.service';
import { SidebarnavService } from '../../../../core/service/sidebarnav.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-assetsubcategorymastergrid',
  templateUrl: './assetsubcategorymastergrid.component.html',
  styleUrls: ['./assetsubcategorymastergrid.component.scss']
})
export class AssetsubcategorymastergridComponent implements OnInit {
  @Input() name: string = 'assetsubcategorymaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;
  constructor(private router: Router,
    private AssetSubCategoryMasterService: AssetSubCategoryMasterService,
    private sidebarnavservice: SidebarnavService,
    private inactivateAlert: InactivateAlert) {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";

  }

  async ngOnInit() {
    this.subscription = this.AssetSubCategoryMasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/assetsubcategory/add');
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.AssetSubCategoryMasterService.refreshClickevent.next();
  }

  OnEditClick() {
    this.router.navigateByUrl('/assetsubcategory/edit/' + this.selectedNodes.assetSubCategoryId);
  }

  OnViewClick() {
    this.router.navigateByUrl('/assetsubcategory/view/' + this.selectedNodes.assetSubCategoryId);
  }

  OnDeleteClick() {
    this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.assetSubCategoryId, "assetsubcategory");
  }
}