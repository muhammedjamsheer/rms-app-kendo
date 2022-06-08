import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { SideMenuItems } from '../../shared/model/SideMenuItems';
import { AuthenticationService } from '../service/authentication.service';
import { SidebarnavService } from '../service/sidebarnav.service';

@Component({
  selector: 'org-fat-sidebarnav',
  templateUrl: './sidebarnav.component.html',
  styleUrls: ['./sidebarnav.component.scss']
})
export class SidebarnavComponent implements OnInit {
  sidemenuItems: SideMenuItems[] = [];
  uniqueParentName: string[] = [];
  parentMenuItems: SideMenuItems[] = [];
  rla!: string | string[];

  isCreateAllowed: boolean = false;
  isEditAllowed: boolean = false;
  isViewAllowed: boolean = false;
  isDeleteAllowed: boolean = false;
  isSummaryAllowed: boolean = false;
  isRepostAllowed: boolean = false;
  isDetailsAllowed: boolean = false;
  userName = localStorage.getItem('userName');
  companyName = localStorage.getItem('companyID');
  constructor(
    private sidebarnavservice: SidebarnavService,
    private router: Router,
    private authenticationService: AuthenticationService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.sidemenuItems.length > 0) {
          this.isCreateAllowed = this.sidemenuItems.some(
            item => item.menuType === "CONTEXTMENU" && item.menuName === "CreateNew" && item.parentMenuName.toLowerCase().indexOf(event.url.replace('/', '').toLowerCase()) > -1);
          this.isEditAllowed = this.sidemenuItems.some(
            item => item.menuType === "CONTEXTMENU" && item.menuName === "Edit" && item.parentMenuName.toLowerCase().indexOf(event.url.replace('/', '').toLowerCase()) > -1);
          this.isViewAllowed = this.sidemenuItems.some(
            item => item.menuType === "CONTEXTMENU" && item.menuName === "View" && item.parentMenuName.toLowerCase().indexOf(event.url.replace('/', '').toLowerCase()) > -1);
          this.isDeleteAllowed = this.sidemenuItems.some(
            item => item.menuType === "CONTEXTMENU" && item.menuName === "Delete" && item.parentMenuName.toLowerCase().indexOf(event.url.replace('/', '').toLowerCase()) > -1);
          this.isSummaryAllowed = this.sidemenuItems.some(
            item => item.menuType === "CONTEXTMENU" && item.menuName === "Summary" && item.parentMenuName.toLowerCase().indexOf(event.url.replace('/', '').toLowerCase()) > -1);
          this.isRepostAllowed = this.sidemenuItems.some(
            item => item.menuType === "CONTEXTMENU" && item.menuName === "Repost" && item.parentMenuName.toLowerCase().indexOf(event.url.replace('/', '').toLowerCase()) > -1);
          this.isDetailsAllowed = this.sidemenuItems.some(
            item => item.menuType === "CONTEXTMENU" && item.menuName === "Details" && item.parentMenuName.toLowerCase().indexOf(event.url.replace('/', '').toLowerCase()) > -1);
          localStorage.setItem('currentPage', event.url.replace('/', '').toLowerCase());
          localStorage.setItem("isCreateAllowed", this.isCreateAllowed.toString());
          localStorage.setItem("isEditAllowed", this.isEditAllowed.toString());
          localStorage.setItem("isViewAllowed", this.isViewAllowed.toString());
          localStorage.setItem("isDeleteAllowed", this.isDeleteAllowed.toString());
          localStorage.setItem("isSummaryAllowed", this.isSummaryAllowed.toString());
          localStorage.setItem("isRepostAllowed", this.isRepostAllowed.toString());
          localStorage.setItem("isDetailsAllowed", this.isDetailsAllowed.toString());
        }
      }
    });
  }


  ngOnInit(): void {
    this.getNavItems();
  }

  getNavItems() {
    this.sidebarnavservice.getSideNavItems().subscribe(data => {
      this.sidemenuItems = data;
      this.parentMenuItems = this.sidemenuItems.filter(i => i.parentMenuName == null).
        sort((a, b) => (a.sortOrder > b.sortOrder) ? 1 : -1);
    });
  }

  getChildMenuItems(parentMenuName: string) {
    return this.sidemenuItems.filter(i => i.parentMenuName === parentMenuName)
      .sort((a, b) => (a.sortOrder > b.sortOrder) ? 1 : -1);
  }

  onSearchChange(searchValue: string) {
    //TODO: Search box is not proper, deleting the typed character is not working as expected
    if (!searchValue) {
      this.getNavItems();
    } // when nothing has typed
    this.sidemenuItems = this.sidemenuItems.filter(
      item => item.menuText.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
    )
  }

  onLogout() {
    this.authenticationService.logout();
  }
}
