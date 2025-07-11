import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { ShellComponent } from './shell.component';

import { FormsModule } from '@angular/forms';
import { PagesModule } from '@pages/pages.module';
import { LanguageSelectorComponent } from '@app/i18n';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdbSidenavModule } from 'mdb-angular-ui-kit/sidenav';
import { MdbSmoothScrollModule } from 'mdb-angular-ui-kit/smooth-scroll';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollbarModule } from 'mdb-angular-ui-kit/scrollbar';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbSelectModule } from 'mdb-angular-ui-kit/select';
import { MdbLoadingModule } from 'mdb-angular-ui-kit/loading';
import { MdbLightboxModule } from 'mdb-angular-ui-kit/lightbox';
import { MdbLazyLoadingModule } from 'mdb-angular-ui-kit/lazy-loading';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbInfiniteScrollModule } from 'mdb-angular-ui-kit/infinite-scroll';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbTreeviewModule } from 'mdb-angular-treeview';
import { GravatarModule } from 'ngx-gravatar';
import { MenuControlDataListComponent } from '../components/menu-control-data-list/menu-control-data-list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FormsModule,
    BrowserAnimationsModule,
    MdbSmoothScrollModule,
    MdbRippleModule,
    MdbScrollbarModule,
    MdbScrollspyModule,
    MdbSelectModule,
    MdbLoadingModule,
    MdbLightboxModule,
    MdbSidenavModule,
    MdbLazyLoadingModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbInfiniteScrollModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbAccordionModule,
    MdbTreeviewModule,
    GravatarModule,
    MenuControlDataListComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ShellComponent],
  exports: [ShellComponent]
})
export class ShellModule {}
