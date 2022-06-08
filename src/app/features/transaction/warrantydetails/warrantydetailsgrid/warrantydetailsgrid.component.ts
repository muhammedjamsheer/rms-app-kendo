import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WarrantyDetailsService } from '../../../../core/service/warrantydetails.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-warrantydetailsgrid',
  templateUrl: './warrantydetailsgrid.component.html',
  styleUrls: ['./warrantydetailsgrid.component.scss']
})
export class WarrantydetailsgridComponent implements OnInit {
  @Input() name: string = 'warrantydetails';

  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;

  constructor(private router: Router,
    private warrantyDetailsService: WarrantyDetailsService) {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
  }

  async ngOnInit() {

    this.subscription = this.warrantyDetailsService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/warrantydetails/add');
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.warrantyDetailsService.refreshClickevent.next();
  }

  OnEditClick() {
    this.router.navigate(['warrantydetails/edit', this.selectedNodes.warrantyId]);
    //this.router.navigateByUrl('' + );
  }

  OnViewClick() {
    this.router.navigate(['warrantydetails/view', this.selectedNodes.warrantyId]);
    //this.router.navigateByUrl('/receipt/view/' + this.selectedNodes.receiptId);
  }


}

