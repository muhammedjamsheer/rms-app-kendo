import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProductionorderService } from '../../../../core/service/productionorder.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-rms-productionordergrid',
  templateUrl: './productionordergrid.component.html',
  styleUrls: ['./productionordergrid.component.css']
})
export class ProductionordergridComponent implements OnInit {

  @Input() name: string = 'productionorder';
  isViewAllowed: boolean = false;
  totalGridCount!: number;
  subscription!: Subscription;
  isRowUnSelected: boolean = true;
  isEditDisabled: boolean = false;
  isApproveEnabled: boolean = false;
  isCloseEnabled: boolean = false;
  selectedNodes: any;
  constructor(
    private router: Router,
    private productionorderService: ProductionorderService,
  ) {
    this.subscription = this.productionorderService.selectedrowevent.subscribe((e) => {
      if (e.data != null) {
        this.isRowUnSelected = false;
        this.selectedNodes = e.data;
      }
    });
  }

  ngOnInit(): void {
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
  }
  btnNewClick() {
    this.router.navigateByUrl('/productionorder/add');
  }
  OnViewClick() {
    this.router.navigate(['/productionorder/view', this.selectedNodes.productionId]);
  }
  totalGridItems($event: number) {
    this.totalGridCount = $event;
  }
  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.productionorderService.refreshClickevent.next();
  }

}
