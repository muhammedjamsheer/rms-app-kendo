import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BrandmasterService } from '../../../../core/service/brandmaster.service';
import { SidebarnavService } from '../../../../core/service/sidebarnav.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-brandmastergrid',
  templateUrl: './brandmastergrid.component.html',
  styleUrls: ['./brandmastergrid.component.scss']
})
export class BrandmastergridComponent implements OnInit {
  @Input() name: string = 'brandmaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;
  constructor(private router: Router,
    private BrandmasterService: BrandmasterService,
    private sidebarnavservice: SidebarnavService,
    private inactivateAlert: InactivateAlert) {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";

  }

  async ngOnInit() {
    this.subscription = this.BrandmasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/brandmaster/add');
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.BrandmasterService.refreshClickevent.next();
  }

  OnEditClick() {
    this.router.navigateByUrl('/brandmaster/edit/' + this.selectedNodes.brandID);
  }

  OnViewClick() {
    this.router.navigateByUrl('/brandmaster/view/' + this.selectedNodes.brandID);
  }

  OnDeleteClick() {
    this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.brandID, this.name);
  }
}