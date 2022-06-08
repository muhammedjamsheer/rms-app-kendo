import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetTransferDirectService } from '../../../../core/service/assettransferdirect.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'org-fat-assettransferdirectgrid',
  templateUrl: './assettransferdirectgrid.component.html',
  styleUrls: ['./assettransferdirectgrid.component.scss']
})
export class AssettransferdirectgridComponent implements OnInit {
  @Input() name: string = 'transfer';

  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;
  isApproved:boolean=false;

  constructor(private router: Router,
    private assetTransferDirectService: AssetTransferDirectService) {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
  }

  async ngOnInit() {
    this.assetTransferDirectService.refreshClickevent.next();
    this.subscription = this.assetTransferDirectService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
      if(this.selectedNodes.status>30)
      {
        this.isApproved=true;
      }
      else
      {
        this.isApproved=false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/transfer/add');
  }

  OnVerifyClick()
  {
    this.router.navigate(['transferrequest/verify', this.selectedNodes.transferNo]); 
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.isRowUnSelected = true;
    this.assetTransferDirectService.refreshClickevent.next();
  }

  OnEditClick() {
    this.router.navigate(['transfer/edit', this.selectedNodes.transferNo]);    
  }

  OnViewClick() {
    this.router.navigate(['transfer/view', this.selectedNodes.transferNo]);    
  }


}

