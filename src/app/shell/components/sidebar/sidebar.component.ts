import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '@env/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs/operators';
import { NavMode, ShellService } from '@app/shell/services/shell.service';
import { webSidebarMenuItems } from '@core/constants';

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
