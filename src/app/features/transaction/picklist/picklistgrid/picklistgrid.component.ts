import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { PicklistService } from '../../../../core/service/picklist.service';
import { Subscription } from 'rxjs';
import { ColDef } from 'ag-grid-community';
import { SaveAlert } from '../../../../shared/commonalerts/savealert';
import { PickListModel, CancelPicklist } from '../../../../shared/model/sales-order';
import Swal from "sweetalert2";
@Component({
  selector: 'org-rms-picklistgrid',
  templateUrl: './picklistgrid.component.html',
  styleUrls: ['./picklistgrid.component.css']
})
export class PicklistgridComponent implements OnInit {
  @ViewChild('ViewButton') ViewButton!: ElementRef;
  @Input() name: string = 'picklist';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;
  isSummaryAllowed: boolean = false;
  isDetailsAllowed: boolean = false;
  isRowUnSelected: boolean = true;
  error!: string;
  subscription!: Subscription;
  selectedNodes: any;
  loading: boolean = false;
  totalGridCount: number = 0;
  picklistdetails: any[] = []
  columnDefs: ColDef[] = [
    {
      field: 'lineDescription', sortable: true, filter: true, resizable: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true
    },
    { field: 'pickQuantity', sortable: true, resizable: true, filter: true, },
    { field: 'uomQtytoPick', sortable: true, resizable: true, filter: true },
    { field: 'pickedUomQnty', sortable: true, resizable: true, filter: true, },
    { field: 'uomCode', sortable: true, resizable: true, filter: true },
    { field: 'lineStatus', sortable: true, resizable: true, filter: true, },
    { field: 'fromWarehouse', sortable: true, resizable: true, filter: true, },
  ];

  constructor(
    private picklistService: PicklistService,
    private router: Router,
    private saveAlert: SaveAlert,
  ) { }

  ngOnInit(): void {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
    this.isSummaryAllowed = localStorage.getItem("isSummaryAllowed") == "true";
    this.isDetailsAllowed = localStorage.getItem("isDetailsAllowed") == "true";

    this.subscription = this.picklistService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }
  totalGridItems($event: number) {
    this.totalGridCount = $event;
  }


  OnSummaryClick() {
    localStorage.setItem('headerdata', JSON.stringify(this.selectedNodes));
    this.router.navigate(['/picklist/summary/', this.selectedNodes.pickListNumber]);
  }
  OnDetailClick() {
    localStorage.setItem('headerdata', JSON.stringify(this.selectedNodes));
    this.router.navigate(['/picklist/details/', this.selectedNodes.pickListNumber]);
  }

  OnCancelClick() {
    Swal.fire({
      title: 'Do you  want to cancel?',
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      input: 'text',
      customClass: {
        validationMessage: 'my-validation-message'
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            'Remarks is required'
          )
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        let canceldata: CancelPicklist = {
          createdBy: "000000000",
          pickListNumber: this.selectedNodes.pickListNumber,
          remarks: result.value
        }
        this.picklistService.CancelPicklist(canceldata).subscribe(result => {
          this.saveAlert.showMessage('success', 'Cancelled successfully !');
        },
          err => {
            this.error = err.error ? err.error : err.message;
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
        )
      }
    })
  }



  OnRefreshCick() {
    this.isRowUnSelected = true;
    this.error = undefined;
    this.picklistService.refreshClickevent.next();
  }
  triggerClick() {
    let el: HTMLElement = this.ViewButton.nativeElement as HTMLElement;
    el.click();
  }

}