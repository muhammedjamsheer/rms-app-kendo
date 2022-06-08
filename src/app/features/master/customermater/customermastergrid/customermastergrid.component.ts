import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomerMasterService } from '../../../../core/service/customermaster.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';

@Component({
  selector: 'org-fat-customermastergrid',
  templateUrl: './customermastergrid.component.html',
  styleUrls: ['./customermastergrid.component.css']
})
export class CustomermastergridComponent implements OnInit {
  @Input() name: string = 'customermaster';

  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;

  constructor(private router: Router,
    private customerMasterService: CustomerMasterService,
    private inactivateAlert: InactivateAlert) {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
  }

  async ngOnInit() {

    this.subscription = this.customerMasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/customermaster/add');
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.customerMasterService.refreshClickevent.next();
  }

  OnEditClick() {
    this.router.navigateByUrl('/customermaster/edit/' + this.selectedNodes.customerId);
  }

  OnViewClick() {
    this.router.navigateByUrl('/customermaster/view/' + this.selectedNodes.customerId);
  }

  OnDeleteClick() {
    this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.customerId, this.name);
  }

}
