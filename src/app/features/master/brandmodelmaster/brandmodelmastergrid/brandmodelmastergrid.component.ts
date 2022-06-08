import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BrandmodelmasterService } from '../../../../core/service/brandmodelmaster.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-brandmodelmastergrid',
  templateUrl: './brandmodelmastergrid.component.html',
  styleUrls: ['./brandmodelmastergrid.component.scss']
})
export class BrandmodelmastergridComponent implements OnInit {
  @Input() name: string = 'modelmaster';

  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;

  constructor(private router: Router,
    private brandmodelmasterService: BrandmodelmasterService,
    private inactivateAlert: InactivateAlert) {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
  }

  async ngOnInit() {

    this.subscription = this.brandmodelmasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/modelmaster/add');
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.brandmodelmasterService.refreshClickevent.next();
  }

  OnEditClick() {
    this.router.navigateByUrl('/modelmaster/edit/' + this.selectedNodes.modelID);
  }

  OnViewClick() {
    this.router.navigateByUrl('/modelmaster/view/' + this.selectedNodes.modelID);
  }

  OnDeleteClick() {
    this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.modelID, this.name);
  }

}
