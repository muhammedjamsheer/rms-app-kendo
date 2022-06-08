import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AssetTransferRequestService } from '../../../../core/service/assettransferrequest.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'org-rms-transferrquestgrid',
  templateUrl: './transferrquestgrid.component.html',
  styleUrls: ['./transferrquestgrid.component.css']
})
export class TransferrquestgridComponent implements OnInit {
  @Input() name: string = 'transferrequest';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;
  totalGridCount!: number;
  subscription!: Subscription;
  isRowUnSelected: boolean = true;
  isEditDisabled: boolean = false;
  isApproveEnabled: boolean = false;
  isCloseEnabled: boolean = false;
  selectedNodes: any;
  constructor(
    private router: Router,
    private assetTransferRequestService: AssetTransferRequestService,

  ) {
    this.subscription = this.assetTransferRequestService.selectedrowevent.subscribe((e) => {
      if (e.data != null) {
        this.isRowUnSelected = false;
        this.selectedNodes = e.data;
        this.isApproveEnabled = this.selectedNodes.status == 30;  
        this.isEditDisabled = this.selectedNodes.status == 50 || this.selectedNodes.status == 60 || this.selectedNodes.status == 40;
        this.isCloseEnabled = this.selectedNodes.status == 50;
      }
    });
  }

  ngOnInit(): void {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
  }
  btnNewClick() {
    this.router.navigateByUrl('/transferrequest/add');
  }
  OnViewClick() {
    this.router.navigate(['/transferrequest/view', this.selectedNodes.requestNo]);
  }
  OnEditClick() {
    this.router.navigate(['transferrequest/edit', this.selectedNodes.requestNo]);
  }
  OnApproveClick() {
    this.router.navigate(['transferrequestverification/edit', this.selectedNodes.requestNo]);
  }
  totalGridItems($event: number) {
    this.totalGridCount = $event;
  }
  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.assetTransferRequestService.refreshClickevent.next();
  }
}
