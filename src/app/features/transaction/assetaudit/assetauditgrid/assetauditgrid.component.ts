import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetAuditService } from '../../../../core/service/assetaudit.service';
import { Subscription } from 'rxjs';
import { InactivateAlert } from 'src/app/shared/commonalerts/inactivatealert';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'org-fat-assetauditgrid',
  templateUrl: './assetauditgrid.component.html',
  styleUrls: ['./assetauditgrid.component.scss']
})
export class AssetauditgridComponent implements OnInit {
  @Input() name: string = 'assetaudit';

  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;
  isAuditApproved=false;
  isAuditClosed=false;
  totalGridCount: number = 0;
  constructor(private router: Router,
    private assetAuditServe: AssetAuditService, private inactivateAlert: InactivateAlert,private datepipe:DatePipe) {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
  }

  async ngOnInit() {

    this.subscription = this.assetAuditServe.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
      this.isAuditApproved = e.data.auditStatus !=30;
      this.isAuditClosed=e.data.auditStatus >40;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/physicalcount/add');
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.isRowUnSelected = true;
    this.assetAuditServe.refreshClickevent.next();
  }

  OnCloseClick()
  {
    this.inactivateAlert.CloseConfirmBox(
      this.selectedNodes.auditId,
      this.name
    );
  }

  OnEditClick() {
    this.router.navigate(['physicalcount/edit', this.selectedNodes.auditId]);
    //this.router.navigateByUrl('' + );
  }

  OnAssetSummaryClickClick()
  {
    this.router.navigate(['physicalcount/assetsummary', this.selectedNodes.auditId]);
  }

  OnViewClick() {
    this.router.navigate(['physicalcount/view', this.selectedNodes.auditId]);
  }

  OnVerifyClick() {
    this.router.navigate(['auditverify'], { queryParams: { auditNo: this.selectedNodes.auditId, auditDate: this.datepipe.transform(this.selectedNodes.toBeAuditedOn,'dd-MM-yyyy')  } });
  }
  totalGridItems($event: number) {
    this.totalGridCount = $event;
  }

}
