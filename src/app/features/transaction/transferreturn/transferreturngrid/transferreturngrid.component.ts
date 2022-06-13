import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransferreturnService } from 'src/app/core/service/transferreturn.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-rms-transferreturngrid',
  templateUrl: './transferreturngrid.component.html',
  styleUrls: ['./transferreturngrid.component.css']
})
export class TransferreturngridComponent implements OnInit {

  @Input() name: string = 'transferreturn';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;
  isRowUnSelected: boolean = true;


  subscription!: Subscription;
  selectedNodes: any;
  totalGridCount: number = 0;
  constructor(
    private transferreturnService: TransferreturnService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
    this.subscription = this.transferreturnService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  OnViewClick() {
    localStorage.setItem('headerdata', JSON.stringify(this.selectedNodes));
    this.router.navigate(['/transferreturn/view', this.selectedNodes.toNumber]);
  }
  OnSummaryClick() {
    localStorage.setItem('headerdata', JSON.stringify(this.selectedNodes));
    this.router.navigate(['/transferreturn/summary', this.selectedNodes.toId]);
  }
  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.transferreturnService.refreshClickevent.next();
  }
  totalGridItems($event: number) {
    this.totalGridCount = $event;
  }

}
