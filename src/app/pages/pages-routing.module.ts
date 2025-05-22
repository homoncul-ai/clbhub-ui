import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/services/shell.service';

const routes: Routes = [
  Shell.childRoutes([    
    {
      path: 'users',
      loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
    }
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
