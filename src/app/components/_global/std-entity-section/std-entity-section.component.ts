import { Component, Input, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PMessageUiComponent } from '../../_crud/pmessage-ui/pmessage-ui.component';
import { PmfilegroupUiComponent } from '../../_crud/pmfilegroup-ui/pmfilegroup-ui.component';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { StdBubfileComponent } from '../std-bubfile/std-bubfile.component';
import { WorkItemDeliverableGroupComponent } from '@app/components/_crud/workitemdeliverable/workitemdeliverable-group.component';
import { WorkRequestGroupUIComponent } from '@app/components/_crud/workrequest/workrequest-group-ui.component';
import { CatalogEntryInterestCrudComponent } from '@app/components/_crud/catalogentryinterest/catalogentryinterest-crud.component';
import { ProviderRequestCrudComponent } from '@app/components/_crud/providerrequest/providerrequest-crud.component';
import { CatalogSearchResultCrudComponent } from '@app/components/_crud/catalogsearchresult/catalogsearchresult-crud.component';
import { CatalogEntrySignupPacketUiComponent } from '@app/components/_crud/catalogentrysignuppacket/catalogentrysignuppacket-ui.component';
import { CatalogEntryUiComponent } from '@app/components/_crud/catalogentry/catalogentry-ui.component';

/**
 * A polymorphic entity section component that renders the appropriate
 * entity-ui component based on the entityType provided.
 * 
 * Usage:
 * <app-std-entity-section 
 *   entityType="PMessage" 
 *   entityId="some-uuid" 
 *   modeName="view"
 *   [readonly]="true">
 * </app-std-entity-section>
 */
@Component({
  selector: 'app-std-entity-section',
  standalone: true,
  imports: [
    CommonModule,
    CatalogEntryUiComponent,
    CatalogSearchResultCrudComponent,
    CatalogEntrySignupPacketUiComponent,
    PMessageUiComponent,
    PmfilegroupUiComponent,
    StdBubfileComponent,
    WorkItemDeliverableGroupComponent,
    WorkRequestGroupUIComponent,
    CatalogEntryInterestCrudComponent,
    ProviderRequestCrudComponent 
],
  templateUrl: './std-entity-section.component.html',
  styleUrl: './std-entity-section.component.scss'
})
export class StdEntitySectionComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private entityData: any = null;

  protected route = inject(ActivatedRoute);
  protected router = inject(Router);
  protected cdr = inject(ChangeDetectorRef);
  
  ngOnInit(): void {
    this.entityType = (this.entityType || '').toLowerCase();
    console.log("StdEntitySectionComponent ngOnInit called for entityType: " + this.entityType + " and entityId: " + this.entityId);
  }

  /** The entity type to display (e.g., 'PMessage', 'PMFileGroup') */
  @Input() entityType: string = '';
  
  /** The ID of the entity to display */
  @Input() entityId: string = '';

  @Input() tabId?: string = undefined;
  @Input() childId?: string = undefined;
  @Input() childTabId?: string = undefined;
  
  /** Whether the entity display should be readonly */
  @Input() readonly: boolean = false;

  /** The mode name for the section display */
  @Input() modeName: string = 'section';

  /** List of supported entity types */
  private readonly supportedEntityTypes = [
    'catalogentryinterest', 'catalogsearchresult', 'catalogentry', 'catalogentrysignuppacket',
    'pmessage', 'pmfile', 'pmfilegroup',
    'providerrequest',
    'workrequest', 'workrequestdeliverable', 

  ];

  /** Check if the current entityType is supported */
  isSupportedEntity(): boolean {
    return this.supportedEntityTypes.includes(this.entityType);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

