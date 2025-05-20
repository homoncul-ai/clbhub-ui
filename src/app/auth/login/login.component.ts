import { Component } from '@angular/core';

import { environment } from '@env/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ActivatedRoute, Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class LoginComponent {


  constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute
  ) {}

  login() {


  }
}
