import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from '../../../../core/service/inventory.service';
import { ExportService } from '../../../../core/exports/export.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-rms-inventorysummarygrid',
  templateUrl: './inventorysummarygrid.component.html',
  styleUrls: ['./inventorysummarygrid.component.css']
})
export class InventorysummarygridComponent implements OnInit {
  @ViewChild('ViewButton') ViewButton!: ElementRef;
  @Input() name: string = 'inventorysummary';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;
  isRowUnSelected: boolean = true;
  totalGridCount: number = 0;
  totalquantity: number = 0;
  loading: boolean = false;
  selectedNodes: any;
  subscription!: Subscription;
  summarydata: any[] = []
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
    this.summarydata = $event;
    this.totalquantity = this.summarydata.reduce((accumulator, current) => accumulator + current.quantity, 0);
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
      griddata: this.summarydata,
      printtype: 'inventorysummary',
      title: "Inventory Summary",
    }
    this.exportService.generateExcel(data)
  }

}
