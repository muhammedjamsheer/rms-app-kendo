import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalesorderService } from '../../../../core/service/salesorder.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-rms-salesordergrid',
  templateUrl: './salesordergrid.component.html',
  styleUrls: ['./salesordergrid.component.css']
})
export class SalesordergridComponent implements OnInit {
  @Input() name: string = 'salesorder';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;
  isSummaryAllowed: boolean = false;
  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;
  totalGridCount: number = 0;
  mastertype!: string;
  constructor(
    private salesorderService: SalesorderService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
    this.isSummaryAllowed = localStorage.getItem("isSummaryAllowed") == "true";

    
    this.subscription = this.salesorderService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  OnViewClick() {
    localStorage.setItem('headerdata', JSON.stringify(this.selectedNodes));
    this.router.navigate(['/salesorder/view', this.selectedNodes.soId]);
  }
  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.salesorderService.refreshClickevent.next();
  }
  totalGridItems($event: number) {
    this.totalGridCount = $event;
  }
}
