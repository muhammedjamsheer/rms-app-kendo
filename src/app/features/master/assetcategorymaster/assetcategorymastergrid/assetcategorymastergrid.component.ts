import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetCategoryMasterService } from '../../../../core/service/assetcategorymaster.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-assetcategorymastergrid',
  templateUrl: './assetcategorymastergrid.component.html',
  styleUrls: ['./assetcategorymastergrid.component.scss']
})
export class AssetcategorymastergridComponent implements OnInit {
  @Input() name: string = 'assetcategorymaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;
  constructor(private router: Router,
    private AssetCategoryMasterService: AssetCategoryMasterService,
    private inactivateAlert: InactivateAlert) {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";

  }

  async ngOnInit() {
    this.subscription = this.AssetCategoryMasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/assetcategory/add');
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.AssetCategoryMasterService.refreshClickevent.next();
  }

  OnEditClick() {
    this.router.navigateByUrl('/assetcategory/edit/' + this.selectedNodes.assetCategoryId);
  }

  OnViewClick() {
    this.router.navigateByUrl('/assetcategory/view/' + this.selectedNodes.assetCategoryId);
  }

  OnDeleteClick() {
    this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.assetCategoryId, "assetcategory");
  }
}