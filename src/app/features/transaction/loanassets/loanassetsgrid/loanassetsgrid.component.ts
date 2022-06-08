import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SaveAlert } from 'src/app/shared/commonalerts/savealert';
import { LoanService } from '../../../../core/service/loan.service';

@Component({
  selector: 'org-fat-loanassetsgrid',
  templateUrl: './loanassetsgrid.component.html',
  styleUrls: ['./loanassetsgrid.component.css']
})
export class LoanassetsgridComponent implements OnInit {
  @Input() name: string = 'loan';
  error = '';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;

  isRowUnSelected: boolean = true;
  subscription!: Subscription;
  selectedNodes: any;
  isApproveEnabled: boolean = false;
  isEditDisabled: boolean = false;
  constructor(private router: Router,
    private loanService: LoanService,
    private saveAlert: SaveAlert) {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
  }

  async ngOnInit() {

    this.subscription = this.loanService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
      this.isApproveEnabled = this.selectedNodes.loanStatus == 30;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/assetloan/add');
  }

  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.isRowUnSelected = true;
    this.loanService.refreshClickevent.next();
  }

  OnEditClick() {
    this.router.navigate(['assetloan/edit', this.selectedNodes.releaseNo]);
    //this.router.navigateByUrl('' + );
  }

  OnViewClick() {
    this.router.navigate(['assetloan/view', this.selectedNodes.releaseNo]);
    //this.router.navigateByUrl('/loan/direct/view/' + this.selectedNodes.assetloandirectId);
  }

  OnApproveClick() {
    let saveResponse: Observable<any>;
    saveResponse = this.loanService.ApproveRequest(this.selectedNodes.releaseNo);


    saveResponse.subscribe(
      result => {
        this.saveAlert.SuccessMessage();
        this.OnRefreshCick();
      },
      err => {
        this.error = err.error ? err.error : err.message;
        
      }
    );
  }

  OnProcessInMobileClick() {
    let saveResponse: Observable<any>;
    saveResponse = this.loanService.ProcessInMobileRequest(this.selectedNodes.releaseNo);


    saveResponse.subscribe(
      result => {
        this.saveAlert.SuccessMessage();
        this.OnRefreshCick();
      },
      err => {
        this.error = err.error ? err.error : err.message;
        
      }
    );
  }
}


