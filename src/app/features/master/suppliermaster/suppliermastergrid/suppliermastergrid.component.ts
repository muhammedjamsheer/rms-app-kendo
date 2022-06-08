import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierMasterService } from '../../../../core/service/suppliermaster.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-suppliermastergrid',
  templateUrl: './suppliermastergrid.component.html',
  styleUrls: ['./suppliermastergrid.component.scss']
})
export class SuppliermastergridComponent implements OnInit {
  @Input() name: string = 'suppliermaster';

  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;

  constructor(private router: Router,
    private supplierMasterService: SupplierMasterService,
    private inactivateAlert: InactivateAlert) {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
  }

  async ngOnInit() {

    this.subscription = this.supplierMasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/suppliermaster/add');
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.supplierMasterService.refreshClickevent.next();
  }

  OnEditClick() {
    this.router.navigateByUrl('/suppliermaster/edit/' + this.selectedNodes.supplierId);
  }

  OnViewClick() {
    this.router.navigateByUrl('/suppliermaster/view/' + this.selectedNodes.supplierId);
  }

  OnDeleteClick() {
    this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.supplierId, this.name);
  }

}
