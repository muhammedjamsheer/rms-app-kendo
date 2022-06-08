import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WarehousemasterService } from 'src/app/core/service/warehousemaster.service';
import { InactivateAlert } from 'src/app/shared/commonalerts/inactivatealert';

@Component({
  selector: 'org-rms-warehousemastergrid',
  templateUrl: './warehousemastergrid.component.html',
  styleUrls: ['./warehousemastergrid.component.css']
})
export class WarehousemastergridComponent implements OnInit {

  @Input() name: string = 'warehousemaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;
  constructor(private router: Router,
    private warehousemasterService: WarehousemasterService,
    private inactivateAlert: InactivateAlert) {

  }

  ngOnInit(): void {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
    this.subscription = this.warehousemasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
    console.log(this.isEditAllowed);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/warehouse/add');
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.warehousemasterService.refreshClickevent.next();
  }

  OnEditClick() {
    this.router.navigateByUrl('/warehouse/edit/' + this.selectedNodes.userName);
  }

  OnViewClick() {
    this.router.navigateByUrl('/warehouse/view/' + this.selectedNodes.userName);
  }

  OnDeleteClick() {
    this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.userName, "warehouse");
  }

}
