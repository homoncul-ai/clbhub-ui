import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { AuthModule } from '@app/auth';
import { ShellComponent } from './shell.component';

import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '@app/shell/components/sidebar/sidebar.component';
import { HeaderComponent } from '@app/shell/components/header/header.component';
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

@NgModule({
  imports: [CommonModule, TranslateModule, AuthModule, RouterModule, FormsModule, PagesModule, LanguageSelectorComponent,
    BrowserAnimationsModule,MdbSmoothScrollModule,MdbRippleModule,MdbScrollbarModule,MdbScrollspyModule,MdbSelectModule,MdbLoadingModule,MdbLightboxModule,
     MdbSidenavModule,MdbLazyLoadingModule,MdbDropdownModule,MdbFormsModule,MdbInfiniteScrollModule,MdbCheckboxModule,MdbCollapseModule,MdbAccordionModule
    ],
  declarations: [ShellComponent, HeaderComponent, SidebarComponent],
})
export class ShellModule {}
