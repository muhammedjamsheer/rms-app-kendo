import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InactivateAlert } from 'src/app/shared/commonalerts/inactivatealert';
import { AssetTransferRequestService } from '../../../../core/service/assettransferrequest.service';

@Component({
  selector: 'org-fat-assettransferrequestgrid',
  templateUrl: './assettransferrequestgrid.component.html',
  styleUrls: ['./assettransferrequestgrid.component.scss']
})
export class AssettransferrequestgridComponent implements OnInit {
  @Input() name: string = 'transferrequest';

  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;
  isApproveEnabled: boolean = false;
  isCloseEnabled: boolean = false;
  isEditDisabled: boolean = false;

  constructor(private router: Router,
    private assetTransferRequestService: AssetTransferRequestService,private inactivateAlert: InactivateAlert) {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
  }

  async ngOnInit() {
    // this.isRowUnSelected = true;
    // this.isRowUnSelected = true;
    // this.assetTransferRequestService.refreshClickevent.next();
    this.subscription = this.assetTransferRequestService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      if(e.data!=null)
      {
      this.selectedNodes = e.data;
      this.isApproveEnabled = this.selectedNodes.status == 30;
      this.isEditDisabled = this.selectedNodes.status == 50 || this.selectedNodes.status ==60 || this.selectedNodes.status ==40;
      this.isCloseEnabled = this.selectedNodes.status == 50;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/transferrequest/add');
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.isRowUnSelected = true;
    this.assetTransferRequestService.refreshClickevent.next();
  }

  OnApproveClick() {
    this.router.navigate(['transferrequestverification/edit', this.selectedNodes.requestNo]);
  }

  OnCloseClick() {
    this.inactivateAlert.CloseConfirmBox(
      this.selectedNodes.requestNo,
      this.name
    );
    this.isRowUnSelected = true;
  }

  OnEditClick() {
    this.router.navigate(['transferrequest/edit', this.selectedNodes.requestNo]);
    //this.router.navigateByUrl('' + );
  }

  OnViewClick() {
    this.router.navigate(['transferrequest/view', this.selectedNodes.requestNo]);
    //this.router.navigateByUrl('/transferrequest/view/' + this.selectedNodes.assetregisterId);
  }

  OnViewRequestClick() {
    this.router.navigate(['transferrequest/viewrequest', this.selectedNodes.requestNo]);
  }
}

