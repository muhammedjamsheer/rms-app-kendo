import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ShipmentService } from '../../../../core/service/shipment.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-rms-shipmentgrid',
  templateUrl: './shipmentgrid.component.html',
  styleUrls: ['./shipmentgrid.component.css']
})
export class ShipmentgridComponent implements OnInit {
  @ViewChild('ViewButton') ViewButton!: ElementRef;
  @Input() name: string = 'shipment';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;
  isSummaryAllowed: boolean = false;
  isRepostAllowed: boolean = false;
  isDetailsAllowed: boolean = false;
  isRowUnSelected: boolean = true;
  totalGridCount: number = 0;
  loading: boolean = false;
  selectedNodes: any;
  picklistdetails: any[] = []
  subscription!: Subscription;
  constructor(
    private shipmentService: ShipmentService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
    this.isSummaryAllowed = localStorage.getItem("isSummaryAllowed") == "true";
    this.isRepostAllowed = localStorage.getItem("isRepostAllowed") == "true";
    this.isDetailsAllowed = localStorage.getItem("isDetailsAllowed") == "true";

    this.subscription = this.shipmentService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }
  totalGridItems($event: number) {
    this.totalGridCount = $event;
  }
  OnViewClick() {
    this.router.navigate(['/shipment/details', this.selectedNodes.shipmentId]);
  }
  OnSummaryClick() {
    this.router.navigate(['/shipment/summary', this.selectedNodes.shipmentId]);
  }

  OnRepostClick() {
    this.router.navigate(['/shipment/details', this.selectedNodes.shipmentId]);
  }
  triggerClick() {
    let el: HTMLElement = this.ViewButton.nativeElement as HTMLElement;
    el.click();
  }
  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.shipmentService.refreshClickevent.next();
  }
}
