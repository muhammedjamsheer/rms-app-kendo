import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductMasterService } from '../../../../core/service/productmaster.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { ExportService } from '../../../../core/exports/export.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-productmastergrid',
  templateUrl: './productmastergrid.component.html',
  styleUrls: ['./productmastergrid.component.scss']
})
export class ProductmastergridComponent implements OnInit {
  @Input() name: string = 'productmaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;
  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;
  productdata: any[] = []
  rowData: any;

  constructor(private router: Router,
    private productMasterService: ProductMasterService,
    private exportService: ExportService,
    private inactivateAlert: InactivateAlert) {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
  }

  ngOnInit() {
    this.subscription = this.productMasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {

  }

  btnNewClick() {
    this.router.navigateByUrl('/productmaster/add');
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.productMasterService.refreshClickevent.next();
  }

  OnEditClick() {
    this.router.navigateByUrl('/productmaster/edit/' + this.selectedNodes.productId);
  }

  OnViewClick() {
    this.router.navigateByUrl('/productmaster/view/' + this.selectedNodes.productId);
  }

  OnDeleteClick() {
    this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.productId, this.name);
  }
  allGriddataevent($event: any) {
    this.productdata = $event;
  }
  DownloadExcel() {
    var data = {
      griddata: this.productdata,
      printtype: 'productmaster',
      title: "Product Master",
    }
    this.exportService.generateExcel(data)
  }
}
