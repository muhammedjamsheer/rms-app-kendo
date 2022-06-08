import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidebarnavService } from '../../../../core/service/sidebarnav.service';
import { SitemasterService } from '../../../../core/service/sitemaster.service';
import { InactivateAlert } from '../../../../shared/commonalerts/inactivatealert';
declare var $: any;

@Component({
  selector: 'org-fat-sitemastergrid',
  templateUrl: './sitemastergrid.component.html',
  styleUrls: ['./sitemastergrid.component.scss']
})
export class SitemastergridComponent implements OnInit {
  //@ViewChild('agGrid') agGrid!: AgGridAngular;
  @Input() name: string = 'sitemaster';
  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;
  subscription!: Subscription;
  selectedNodes: any;

  isRowUnSelected: boolean = true;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private sitemasterService: SitemasterService,
    private sidebarnavservice: SidebarnavService,
    private inactivateAlert: InactivateAlert) {
    this.isCreateAllowed = localStorage.getItem("isCreateAllowed") == "true";
    this.isEditAllowed = localStorage.getItem("isEditAllowed") == "true";
    this.isViewAllowed = localStorage.getItem("isViewAllowed") == "true";
    this.isDeleteAllowed = localStorage.getItem("isDeleteAllowed") == "true";
    this.subscription = new Subscription;
  }

  async ngOnInit() {

    this.subscription = this.sitemasterService.selectedrowevent.subscribe((e) => {
      this.isRowUnSelected = false;
      this.selectedNodes = e.data;
    });
  }

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  btnNewClick() {
    this.router.navigateByUrl('/sitemaster/add');
  }

  async OnRefreshCick() {
    this.isRowUnSelected = true;
    this.sitemasterService.refreshClickevent.next();

  }

  OnEditClick() {
    this.router.navigateByUrl('/sitemaster/edit/' + this.selectedNodes.siteID);
  }

  OnViewClick() {
    this.router.navigateByUrl('/sitemaster/view/' + this.selectedNodes.siteID);
  }

  OnDeleteClick() {
    this.inactivateAlert.InactivateConfirmBox(this.selectedNodes.siteID, this.name);
  }
}
