import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { HasRolesDirective } from 'keycloak-angular';

@Directive({
  selector: '[appHasRoles]',
  standalone: true
})
export class AppHasRolesDirective extends HasRolesDirective {
  @Input() set appHasRoles(roles: string[]) {
    this.roles = roles;
  }
} 