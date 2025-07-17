import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { ProviderTypeRefCrudWrapper, ProvidertyperefCrudComponent } from '@app/components/_crud/providertyperef/providertyperef-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-providertyperef-group',
  imports: [CommonModule, SimpleTabsetComponent, ProvidertyperefCrudComponent],
  templateUrl: './providertyperef-group.component.html',
  styleUrl: './providertyperef-group.component.scss'
})
export class ProviderTypeRefGroupComponent extends AbstractEntityGroupComponent<ProviderTypeRefCrudWrapper> implements OnInit {  
  @Input() id!: string;

  constructor(
    private route: ActivatedRoute
  ) {
    super();    
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      const tabId = params['tabId'] || 'details';
      if (tabId === 'create') {
        this.entity = ProviderTypeRefCrudWrapper.newInstanceForCreate(this.hcclService);
      } else {
      if (id) {
        this.id = id;
        this.tabs = this.setupTabs();
        this.currentTabId = tabId;
        this.loadEntityById(id).then(entity => {
          this.entity = entity;
        }).catch(error => {
          console.error('Error loading ProviderTypeRef:', error);
        });
      }
      }
    });
  }

  protected async loadEntityById(id: string): Promise<ProviderTypeRefCrudWrapper> {
    const ref = await this.hcclService.getProviderTypeRefById(id).toPromise();
    if (!ref) {
      throw new Error('ProviderTypeRef not found');
    }
    this.entity = new ProviderTypeRefCrudWrapper(ref, this.hcclService);
    return this.entity;
  }

  protected setupTabs(): SimpleTab[] {
    return [
      new SimpleTab('list', 'List', '', 
        () => {
          this.router.navigate(['/advocate-dashboard/integrations/providertyperefs']);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('details', 'Details', '', 
        () => {
          this.currentTabId = 'details';
          this.router.navigate(['/advocate-dashboard/integrations/providertyperefs', this.id, 'details']);
        },
        () => {
          return this.entity !== null;
        }
      )
    ];
  }

  public onListTabClick(): void {
    this.currentTabId = 'list';
    this.router.navigate(['/advocate-dashboard/integrations/providertyperefs']);
  }

  public override activateTab(tabId: string): void {
    this.currentTabId = tabId;
  }
} 