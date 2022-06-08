import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdditionalCostDetailsService } from '../../../../core/service/additionalcostdetails.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-additionalcostdetailsgrid',
  templateUrl: './additionalcostdetailsgrid.component.html',
  styleUrls: ['./additionalcostdetailsgrid.component.scss']
})
export class AdditionalcostdetailsgridComponent implements OnInit {
  @Input() name: string = 'additionalcostdetails';

  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;

  constructor(private router: Router,
    private additionalCostDetailsService: AdditionalCostDetailsService) {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
  }

  async ngOnInit() {

    this.subscription = this.additionalCostDetailsService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/additionalcostdetails/add');
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.isRowUnSelected = true;
    this.additionalCostDetailsService.refreshClickevent.next();
  }

  OnEditClick() {
    this.router.navigate(['additionalcostdetails/edit', this.selectedNodes.assetAdditionId]);
    //this.router.navigateByUrl('' + );
  }

  OnViewClick() {
    this.router.navigate(['additionalcostdetails/view', this.selectedNodes.assetAdditionId]);
    //this.router.navigateByUrl('/additionalcostdetails/view/' + this.selectedNodes.additionalcostdetailsId);
  }


}
