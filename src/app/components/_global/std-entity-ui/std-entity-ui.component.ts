import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PMessageUiComponent } from '../../_crud/pmessage-ui/pmessage-ui.component';
import { PmfilegroupUiComponent } from '../../_crud/pmfilegroup-ui/pmfilegroup-ui.component';

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
    PmfilegroupUiComponent
  ],
  templateUrl: './std-entity-ui.component.html',
  styleUrl: './std-entity-ui.component.scss'
})
export class StdEntityUiComponent {
  /** The entity type to display (e.g., 'PMessage', 'PMFileGroup') */
  @Input() entityType: string = '';
  
  /** The ID of the entity to display */
  @Input() entityId: string = '';
  
  /** Whether the entity display should be readonly */
  @Input() readonly: boolean = false;

  /** List of supported entity types */
  private readonly supportedEntityTypes = ['PMessage', 'PMFileGroup'];

  /** Check if the current entityType is supported */
  isSupportedEntity(): boolean {
    return this.supportedEntityTypes.includes(this.entityType);
  }
}

