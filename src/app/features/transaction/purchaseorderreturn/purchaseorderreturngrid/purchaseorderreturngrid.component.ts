import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { InboundService } from '../../../../core/service/inbound.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-rms-purchaseorderreturngrid',
  templateUrl: './purchaseorderreturngrid.component.html',
  styleUrls: ['./purchaseorderreturngrid.component.css']
})
export class PurchaseorderreturngridComponent implements OnInit {

  @ViewChild('ViewButton') ViewButton!: ElementRef;
  name: string = 'purchasereturn';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;
  isRowUnSelected: boolean = true;
  totalGridCount: number = 0;
  loading: boolean = false;
  selectedNodes: any;
  picklistdetails: any[] = []
  subscription!: Subscription;
  mastertype!: string;
  screenName!: string;
  constructor(
    private inboundService: InboundService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
    this.subscription = this.inboundService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }
  totalGridItems($event: number) {
    this.totalGridCount = $event;
  }
  OnViewClick() {
    localStorage.setItem('headerdata', JSON.stringify(this.selectedNodes));
    this.router.navigate(['/purchasereturn/view', this.selectedNodes.poId]);
  }
  triggerClick() {
    let el: HTMLElement = this.ViewButton.nativeElement as HTMLElement;
    el.click();
  }
  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.inboundService.refreshClickevent.next();
  }
}
