import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { VocationEncodingRefCrudWrapper, VocationEncodingRefCrudComponent } from '@app/components/_crud/vocationencodingref/vocationencodingref-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-vocationencodingref-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, VocationEncodingRefCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './vocationencodingref-group.component.html',
})
export class VocationEncodingRefGroupComponent extends AbstractEntityGroupComponent<VocationEncodingRefCrudWrapper> implements OnInit {

  constructor() {
    super();
  }

  protected newCrudWrapperForCreate(): VocationEncodingRefCrudWrapper {
    return VocationEncodingRefCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<VocationEncodingRefCrudWrapper> {
    return VocationEncodingRefCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }
}

