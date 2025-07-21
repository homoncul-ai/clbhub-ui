import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { CatalogCrudComponent, CatalogCrudWrapper } from './catalog-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-catalog-group',
  templateUrl: './catalog-group.component.html',
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  imports: [CommonModule, SimpleTabsetComponent, CatalogCrudComponent],
  standalone: true
})
export class CatalogGroupComponent extends AbstractEntityGroupComponent<CatalogCrudWrapper> implements OnInit {
  @Input() id!: string;
  private route = inject(ActivatedRoute);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      const tabId = params['tabId'] || 'details';
      if (!id) {
        this.currentTabId = tabId;
        this.showingTabset = false;
        this.entity = CatalogCrudWrapper.newInstanceForCreate(this.hcclService);
      } else {
        if (id) {
          this.id = id;
          this.tabs = this.setupTabs();
          this.currentTabId = tabId;
          this.loadEntityById(id).then(entity => {
            this.entity = entity;
          }).catch(error => {
            console.error('Error loading Catalog:', error);
          });
        }
      }
    });
  }

  protected async loadEntityById(id: string): Promise<CatalogCrudWrapper> {
    const data = await this.hcclService.getCatalogById(id).toPromise();
    if (!data) {
      throw new Error('Catalog not found');
    }
    return new CatalogCrudWrapper(data, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return [
      new SimpleTab('details', 'Details', '', 
        () => {
          this.currentTabId = 'details';
          this.router.navigate(['/ecoadmin-dashboard/catalog/catalog', this.id, 'details']);
        },
        () => {
          return this.entity !== null;
        }
      ),
      new SimpleTab('list', 'List', '', 
        () => {
          this.router.navigate(['/ecoadmin-dashboard/catalog/catalog']);
        },
        () => {
          return true;
        }
      )
    ];
  }

  public override activateTab(tabId: string): void {
    this.currentTabId = tabId;
  }
} 