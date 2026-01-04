import { Component, Input, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PMessageUiComponent } from '../../_crud/pmessage-ui/pmessage-ui.component';
import { PmfilegroupUiComponent } from '../../_crud/pmfilegroup-ui/pmfilegroup-ui.component';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { StdBubfileComponent } from '../std-bubfile/std-bubfile.component';
import { WorkItemDeliverableGroupComponent } from '@app/components/_crud/workitemdeliverable/workitemdeliverable-group.component';
import { WorkRequestUiComponent } from '@app/components/_crud/workrequest-ui/workrequest-ui.component';

/**
 * A polymorphic entity display component that renders the appropriate
 * entity-ui component based on the entityType provided.
 * 
 * Usage:
 * <app-std-entity-ui 
 *   entityType="PMessage" 
 *   entityId="some-uuid" 
 *   [readonly]="true">
 * </app-std-entity-ui>
 */
@Component({
  selector: 'app-std-entity-ui',
  standalone: true,
  imports: [
    CommonModule,
    PMessageUiComponent,
    PmfilegroupUiComponent,
    StdBubfileComponent,
    WorkRequestUiComponent,
    WorkItemDeliverableGroupComponent
  ],
  templateUrl: './std-entity-ui.component.html',
  styleUrl: './std-entity-ui.component.scss'
})
export class StdEntityUiComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private entityData: any = null;

  protected route = inject(ActivatedRoute);
  protected router = inject(Router);
  protected cdr = inject(ChangeDetectorRef);
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.entityType = params['entityType'];
      this.entityId = params['entityId'];
    });

    alert("StdEntityUiComponent ngOnInit called for entityType: " + this.entityType + " and entityId: " + this.entityId);
  }

  /** The entity type to display (e.g., 'PMessage', 'PMFileGroup') */
  @Input() entityType: string = '';
  
  /** The ID of the entity to display */
  @Input() entityId: string = '';
  
  /** Whether the entity display should be readonly */
  @Input() readonly: boolean = false;

  /** List of supported entity types */
  private readonly supportedEntityTypes = [
    'pmessage', 'pmfile', 'pmfilegroup',
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

