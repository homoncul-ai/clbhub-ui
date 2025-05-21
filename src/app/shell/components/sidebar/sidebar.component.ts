import { Component, OnInit } from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';



import { NavMenuItem } from '@core/interfaces';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false,
})
export class SidebarComponent implements OnInit {

  year: number = new Date().getFullYear();
  sidebarItems: NavMenuItem[] = [];
  sidebarExtendedItem = -1;
  navExpanded = true;

  constructor(
   
  ) {
  }

  ngOnInit(): void {
   
  }

}
