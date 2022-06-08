import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from '../../../../core/service/inventory.service';
import { ExportService } from '../../../../core/exports/export.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-rms-inventorydetailsgrid',
  templateUrl: './inventorydetailsgrid.component.html',
  styleUrls: ['./inventorydetailsgrid.component.css']
})
export class InventorydetailsgridComponent implements OnInit {
  @ViewChild('ViewButton') ViewButton!: ElementRef;
  @Input() name: string = 'inventorydetails';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;
  isRowUnSelected: boolean = true;
  totalGridCount: number = 0;
  loading: boolean = false;
  selectedNodes: any;
  subscription!: Subscription;
  detailsdata: any[] = []
  constructor(
    private inventoryService: InventoryService,
    private router: Router,
    private exportService: ExportService,
  ) { }

  ngOnInit(): void {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
    this.subscription = this.inventoryService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }
  totalGridItems($event: number) {
    this.totalGridCount = $event;

  }
  allGriddataevent($event: any) {
    this.detailsdata = $event;
  }
  OnViewClick() {
    this.router.navigate(['/shipment/view', this.selectedNodes.shipmentId]);
  }
  triggerClick() {
    let el: HTMLElement = this.ViewButton.nativeElement as HTMLElement;
    el.click();
  }
  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.inventoryService.refreshClickevent.next();
  }
  DownloadExcel() {
    var data = {
      griddata: this.detailsdata,
      printtype: 'inventorydetails',
      title: "Inventory Details",
    }
    this.exportService.generateExcel(data)
  }

}
