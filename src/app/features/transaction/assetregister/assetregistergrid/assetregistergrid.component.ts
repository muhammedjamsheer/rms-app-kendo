import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetRegisterService } from '../../../../core/service/assetregister.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-assetregistergrid',
  templateUrl: './assetregistergrid.component.html',
  styleUrls: ['./assetregistergrid.component.scss']
})
export class AssetregistergridComponent implements OnInit {
  @Input() name: string = 'assetregister';

  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;
totalCount:any;
  constructor(private router: Router,
    private assetRegisterService: AssetRegisterService) {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
  }

  async ngOnInit() {

    this.subscription = this.assetRegisterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
    this.totalCount=(await this.assetRegisterService.getAssetRegister()).length;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/assetregister/add');
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.isRowUnSelected = true;
    this.assetRegisterService.refreshClickevent.next();
    this.totalCount=this.assetRegisterService.assetRegisterDataCache.length;
  }

  OnEditClick() {
    this.router.navigate(['assetregister/edit', this.selectedNodes.serialNo]);
    //this.router.navigateByUrl('' + );
  }

  OnViewClick() {
    this.router.navigate(['assetregister/view', this.selectedNodes.serialNo]);
    //this.router.navigateByUrl('/assetregister/view/' + this.selectedNodes.assetregisterId);
  }


}

