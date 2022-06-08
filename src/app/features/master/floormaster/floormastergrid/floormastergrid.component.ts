import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FloormasterService } from '../../../../core/service/floormaster.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-floormastergrid',
  templateUrl: './floormastergrid.component.html',
  styleUrls: ['./floormastergrid.component.scss']
})
export class FloormastergridComponent implements OnInit {
  @Input() name:string='floormaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes:  any;
  

  rowData: any;

  constructor(private router: Router,
    private floormasterService: FloormasterService,
    private inactivateAlert: InactivateAlert) {
      this.isCreateAllowed = localStorage.getItem("isCreateAllowed") =="true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") =="true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") =="true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") =="true";
     }

  ngOnInit() {
    this.subscription=this.floormasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngOnDestroy():void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    
  }

  btnNewClick() {
    this.router.navigateByUrl('/floormaster/add');
  }

  OnRefreshCick(){
    this.isRowUnSelected = true;
    this.floormasterService.refreshClickevent.next();
  }

  OnEditClick(){
      this.router.navigateByUrl('/floormaster/edit/' + this.selectedNodes.floorID);
  }

  OnViewClick(){
    this.router.navigateByUrl('/floormaster/view/' + this.selectedNodes.floorID);
  }

  OnDeleteClick() {
    this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.floorID, this.name);
  }
}
