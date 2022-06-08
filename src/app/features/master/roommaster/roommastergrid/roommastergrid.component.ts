import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoommasterService } from '../../../../core/service/roommaster.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-roommastergrid',
  templateUrl: './roommastergrid.component.html',
  styleUrls: ['./roommastergrid.component.scss']
})
export class RoommastergridComponent implements OnInit {
  @Input() name: string = 'roommaster';

  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;

  subscription!: Subscription;
  selectedNodes: any;

  constructor(private router: Router,
    private roommasterService: RoommasterService,
    private inactivateAlert: InactivateAlert) {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
  }

  async ngOnInit() {
    this.subscription = this.roommasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/roommaster/add');
  }

  async OnRefreshCick() {
    this.isRowUnSelected = true;
    this.roommasterService.refreshClickevent.next();
  }

  OnEditClick() {
    this.router.navigateByUrl('/roommaster/edit/' + this.selectedNodes.roomID);
  }

  OnViewClick() {
    this.router.navigateByUrl('/roommaster/view/' + this.selectedNodes.roomID);
  }

  OnDeleteClick() {
    this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.roomID, this.name);
  }
}
