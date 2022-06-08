import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TransferorderService } from '../../../../core/service/transferorder.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-rms-transferordergrid',
  templateUrl: './transferordergrid.component.html',
  styleUrls: ['./transferordergrid.component.css']
})
export class TransferordergridComponent implements OnInit {
  @ViewChild('ViewButton') ViewButton!: ElementRef;
  @Input() name: string = 'transferorder';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;
  isRowUnSelected: boolean = true;
  totalGridCount: number = 0;
  loading:boolean=false;
  selectedNodes: any;
  picklistdetails: any[] = []
  subscription!: Subscription;
  mastertype!: string;
  screenName!: string;
  constructor(
    private transferorderService: TransferorderService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
    this.subscription = this.transferorderService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
    this.mastertype = this.router.url;
    this.mastertype = this.mastertype.split("/").slice(-1)[0];
    this.GetScreenDetails(this.mastertype);
  }
  async GetScreenDetails(type) {
    switch (type) {
      case 'transferreturn':
        this.screenName = "Transfer Return List";
        break;
      case 'transferorder':
        this.screenName = "Transfer Order List";
        break;
    }
  }
  totalGridItems($event: number) {
    this.totalGridCount = $event;
  }
  OnViewClick() {
    localStorage.setItem('headerdata', JSON.stringify(this.selectedNodes));
    this.router.navigate(['/transferorder/view', this.selectedNodes.toNumber]);
  }
  triggerClick() {
    let el: HTMLElement = this.ViewButton.nativeElement as HTMLElement;
    el.click();
  }
  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.transferorderService.refreshClickevent.next();
  }

}
