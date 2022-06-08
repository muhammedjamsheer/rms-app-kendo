import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReceiptMasterService } from '../../../../core/service/receiptmaster.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-receiptmastergrid',
  templateUrl: './receiptmastergrid.component.html',
  styleUrls: ['./receiptmastergrid.component.scss']
})
export class ReceiptmastergridComponent implements OnInit {
  @Input() name: string = 'receiptmaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;
  isSummaryAllowed: boolean = false;
  isRepostAllowed: boolean = false;
  isDetailsAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;
  isReceiptApproved: boolean = false;
  totalGridCount: number = 0;

  constructor(private router: Router,
    private receiptMasterService: ReceiptMasterService) {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
    this.isSummaryAllowed = localStorage.getItem("isSummaryAllowed") == "true";
    this.isRepostAllowed = localStorage.getItem("isRepostAllowed") == "true";
    this.isDetailsAllowed = localStorage.getItem("isDetailsAllowed") == "true";
  }

  async ngOnInit() {
    this.subscription = this.receiptMasterService.selectedrowevent.subscribe((e) => {
      this.selectedNodes = e.data;
      this.isRowUnSelected = false;
      this.isReceiptApproved = e.data.receiptStatus >= 50;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/receipt/add');
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.receiptMasterService.refreshClickevent.next();
  }

  OnViewClick() {
    this.router.navigate(['receipt/details/', this.selectedNodes.receiptId]);
  }

  OnSummaryClick() {
    this.router.navigate(['receipt/summary', this.selectedNodes.receiptId]);
  }

  OnRepostClick() {
    this.router.navigate(['receipt/details', this.selectedNodes.receiptId]);
  }

  totalGridItems($event: number) {
    this.totalGridCount = $event;
  }
}

