import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalesreturnService } from '../../../../core/service/salesreturn.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-rms-salesreturngrid',
  templateUrl: './salesreturngrid.component.html',
  styleUrls: ['./salesreturngrid.component.css']
})
export class SalesreturngridComponent implements OnInit {
  @Input() name: string = 'salesreturn';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;
  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;
  totalGridCount: number = 0;
  constructor(
    private salesreturnService: SalesreturnService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
    this.subscription = this.salesreturnService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  OnViewClick() {
    localStorage.setItem('headerdata', JSON.stringify(this.selectedNodes));
    this.router.navigate(['/salesreturn/view', this.selectedNodes.soId]);
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.salesreturnService.refreshClickevent.next();
  }
  totalGridItems($event: number) {
    this.totalGridCount = $event;
  }

}
