import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { CatalogEntrySignupPacketCrudWrapper, CatalogEntrySignupPacketCrudComponent } from '@app/components/_crud/catalogentrysignuppacket/catalogentrysignuppacket-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-catalogentrysignuppacket-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, CatalogEntrySignupPacketCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './catalogentrysignuppacket-group.component.html',
})
export class CatalogEntrySignupPacketGroupComponent extends AbstractEntityGroupComponent<CatalogEntrySignupPacketCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): CatalogEntrySignupPacketCrudWrapper {
    return CatalogEntrySignupPacketCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<CatalogEntrySignupPacketCrudWrapper> {
    return CatalogEntrySignupPacketCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

}

