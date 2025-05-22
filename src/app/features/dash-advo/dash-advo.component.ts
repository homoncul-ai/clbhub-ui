import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dash-advo',
  template: `
    <div class="container-fluid">
      <router-outlet></router-outlet>
    </div>
  `,
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class DashAdvoComponent implements OnInit {
  constructor(private router: Router) {
    console.log('DashAdvoComponent initialized');
  }

  ngOnInit() {
    // Debug router events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      console.log('Navigation Event in DashAdvo:', event);
    });
  }
}
