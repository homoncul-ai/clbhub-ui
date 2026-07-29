import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { CatalogEntryCriteria, HcclUserContextGETData, WorkQueueGETData, WorkRequestCriteria } from '@app/restsvc/hccl.service';
import { ProviderCatalogTabDashComponent } from './provider-catalog-tab-dash.component';
import { CatalogCrudWrapper } from '@app/components/_crud/catalog/catalog-crud.component';
import { CatalogCrudComponent } from '@app/components/_crud/catalog/catalog-crud.component';
import { CatalogEntryListComponent } from "@app/components/_crud/catalogentry/catalogentry-list.component";
import { OnAddActionBehavior, OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { CatalogEntryCrudComponent } from '@app/components/_crud/catalogentry/catalogentry-crud.component';
import { Router } from '@angular/router';
import { CatalogEntryUiComponent } from '@app/components/_crud/catalogentry/catalogentry-ui.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { OnboardCatalogEntryUiComponent } from '@app/components/_crud/onboard-catalogentry-ui/onboard-catalogentry-ui.component';

@Component({
  selector: 'app-provider-catalog-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, ProviderCatalogTabDashComponent, 
    CatalogCrudComponent, CatalogEntryListComponent, CatalogEntryCrudComponent, CatalogEntryUiComponent],
  templateUrl: './provider-catalog-group.component.html',
  styleUrl: './provider-catalog-group.component.scss'
})
export class ProviderCatalogGroupComponent extends AbstractEntityGroupComponent<CatalogCrudWrapper> implements OnInit {

  private modalService = inject(MdbModalService);
  modalRef: MdbModalRef<OnboardCatalogEntryUiComponent> | null = null;

  @ViewChild(CatalogEntryListComponent) catalogEntryList!: CatalogEntryListComponent;

  override ngOnInit(): void {
   
    super.ngOnInit();
    // For singleton behavior, always use current user profile ID
    this.hcclContextService.refreshContext().subscribe(context => {
       this.organizationId = context.currentUserProfile.organizationId || '';
      // Call parent ngOnInit after setting the ID
    });
  }

  /**
   * Always take catalog id/tab from the route. The base class only sets id when empty,
   * so navigating Catalog A → Catalog B reused the old id and showed A's entries.
   */
  protected override populateFromParams(params: any): void {
    if (params['id']) {
      if (this.id && this.id !== params['id']) {
        this.catalogEntryId = '';
      }
      this.id = params['id'];
    }
    if (params['tabId']) {
      this.tabId = params['tabId'];
    } else if (!this.tabId) {
      this.tabId = this.getDefaultTabId();
    }
  }
 
  protected organizationId : string = '';
  protected getOrganizationId(): string {
    return this.organizationId;  
  }

  protected defaultId: string = '';
  protected override getDefaultId(): string {
    return this.defaultId;
  }

  protected newCrudWrapperForCreate(): CatalogCrudWrapper {
    return CatalogCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<CatalogCrudWrapper> {
    return CatalogCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    const baseRoute = this.getBaseRoute();
    let label = 'Catalogs';
    if (this.getCurrentEntity())  {
      label +=  " - " + this.getCurrentEntity().getDisplayText();
    }
    return [
      new SimpleTab('dash', label, '', 
        () => {
          this.router.navigate([baseRoute]);
        },
        () => {
          return true;
        }
      )
    ];
  }

  protected getCatalogEntryCriteria(): CatalogEntryCriteria {
    return {
      catalogId: this.id,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected getCatalogEntryOnClickBehavior(): OnRowClickBehavior {
    var x: OnRowClickBehavior =  new OnRowClickBehavior();
    x.parentId = this.id;
    x.tabId = 'catalogEntry';
    //x.alertMessage = 'Catalog Entry';
    x.usingNavigateUrl = false;
    x.onRowClick = (entityId: string, baseRoute: string, router: Router) => {
     // alert('Catalog Entry clicked: ' + entityId);
     var usingE = true;
     if (!usingE) {
      this.catalogEntryId = entityId;
      this.cdr.detectChanges();
     } else {
      this.router.navigate(['/provider-dashboard/e/catalogentry', entityId]);
     }
      
    };
    return x;
  }

  protected override getDefaultTabId(): string {
    return 'dash';
  }
  protected catalogEntryId: string = '';

  protected onAddButtonClick(): OnAddActionBehavior {
    var x: OnAddActionBehavior = new OnAddActionBehavior();
    x.onAdd = (baseRoute: string, router: Router) => {
      // Open onboarding wizard for creating a catalog entry.
      this.modalRef = this.modalService.open(OnboardCatalogEntryUiComponent, {
        modalClass: 'modal-xl',
        keyboard: false,
        ignoreBackdropClick: true,
        data: {
          catalogId: this.id
        }
      }); 

      this.modalRef.onClose.subscribe((result: any) => {
        if (result?.refresh && this.catalogEntryList) {
          this.catalogEntryList.refresh();
        }
        this.modalRef = null;
      });
    }
    return x;
  }
}
