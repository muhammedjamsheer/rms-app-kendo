import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InsuranceDetailsService } from '../../../../core/service/insurancedetails.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-insurancedetailsgrid',
  templateUrl: './insurancedetailsgrid.component.html',
  styleUrls: ['./insurancedetailsgrid.component.scss']
})
export class InsurancedetailsgridComponent implements OnInit {
  @Input() name: string = 'insurancedetails';

  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;

  constructor(private router: Router,
    private insuranceDetailsService: InsuranceDetailsService) {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
  }

  async ngOnInit() {

    this.subscription = this.insuranceDetailsService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/insurancedetails/add');
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.insuranceDetailsService.refreshClickevent.next();
  }

  OnEditClick() {
    this.router.navigate(['insurancedetails/edit', this.selectedNodes.insuranceId]);
    //this.router.navigateByUrl('' + );
  }

  OnViewClick() {
    this.router.navigate(['insurancedetails/view', this.selectedNodes.insuranceId]);
    //this.router.navigateByUrl('/receipt/view/' + this.selectedNodes.receiptId);
  }


}


