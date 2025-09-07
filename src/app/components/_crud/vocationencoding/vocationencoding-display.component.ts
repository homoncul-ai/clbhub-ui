import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { VocationEncodingGETData, VocationEncodingInstanceGETData, VocationEncodingRefGETData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-vocationencoding-display',
  standalone: true,
  imports: [CommonModule],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  template: `
      <div *ngIf="loading" class="loading-overlay">
        <div class="loading-spinner">Loading  ...</div>
      </div>
      
      <div *ngIf="!loading && entity" class="detail-mode">
        
          <!--
        <div class="details-section">
          <div class="detail-group">
            <label>ID:</label>
            <span>{{ entity.id }}</span>
          </div>
          
          <div class="detail-group">
            <label>Encoding Type Code:</label>
            <span>{{ entity.encodingTypeCode }}</span>
          </div>    
          <div class="detail-group">
            <label>Parent Entity ID:</label>
            <span>{{ entity.parentEntityId }}</span>
          </div>
          
          <div class="detail-group">
            <label>Parent Entity Type:</label>
            <span>{{ entity.parentEntityType }}</span>
          </div>
          
          <div class="detail-group">
            <label>Parent Entity Name:</label>
            <span>{{ entity.parentEntityName }}</span>
          </div>
          
          <div class="detail-group">
            <label>Encoding Text:</label>
            <span>{{ entity.encodingText }}</span>
          </div>
          
          <div class="detail-group">
            <label>Status:</label>
            <span>{{ entity.status }}</span>
          </div>
          
          <div class="detail-group">
            <label>Duration (ms):</label>
            <span>{{ entity.durationMs }}</span>
          </div>
          
          <div class="detail-group">
            <label>Available:</label>
            <span>{{ entity.available }}</span>
          </div>
           
          <div *ngIf="entity.errorMessage" class="detail-group">
            <label>Error Message:</label>
            <span style="color: #dc3545;">{{ entity.errorMessage }}</span>
          </div> 
          <div *ngIf="entity.encodingResponseJson" class="detail-group">
            <label>Encoding Response JSON:</label>
            <pre style="background-color: #f8f9fa; padding: 1rem; border-radius: 4px; overflow-x: auto; font-size: 0.9rem;">{{ entity.encodingResponseJson | json }}</pre>
          </div> 
          <div *ngIf="entity.pipelineLogJson" class="detail-group">
            <label>Pipeline Log JSON:</label>
            <pre style="background-color: #f8f9fa; padding: 1rem; border-radius: 4px; overflow-x: auto; font-size: 0.9rem;">{{ entity.pipelineLogJson | json }}</pre>
          </div>
        </div>
        -->
        <!-- Vocation Encoding Instances Tree -->
        <div *ngIf="entity.vocationEncodingInstances && entity.vocationEncodingInstances.length > 0" class="details-section">
          <div class="tree-container">
            <div *ngFor="let instance of entity.vocationEncodingInstances; let i = index" class="tree-node">
              <div class="tree-node-header" (click)="toggleInstance(i)">
                <i class="fas fa-chevron-right" [class.rotated]="expandedInstances[i]"></i>
                <span class="instance-name">{{ instance.encodingName || 'Instance ' + (i + 1) }}</span>
                <span class="instance-codes" *ngIf="instance.primaryCode || instance.secondaryCode">
                  ({{ instance.primaryCode }}{{ instance.secondaryCode ? '.' + instance.secondaryCode : '' }})
                </span>
              </div>
              
              <div *ngIf="expandedInstances[i]" class="tree-node-content">
                <!--
                <div class="detail-group">
                  <label>Instance ID:</label>
                  <span>{{ instance.id }}</span>
                </div>
                
                <div class="detail-group">
                  <label>Vocation Encoding ID:</label>
                  <span>{{ instance.vocationEncodingId }}</span>
                </div>
-->
                <div class="detail-group" [hidden]="true" >
                  <label>Encoding Name:</label>
                  <span> {{ instance.encodingName }}</span>
                </div>
                <!--
                <div class="detail-group">
                  <label>Vocation Encoding Ref ID:</label>
                  <span>{{ instance.vocationEncodingRefId }}</span>
                </div>
                 
                <div class="detail-group">
                  <label>Sequence Order:</label>
                  <span>{{ instance.sequenceOrder }}</span>
                </div>
                 -->
                <div class="detail-group" [hidden]="true" >
                  <label>Encoding Distance:</label>
                  <span>{{ instance.encodingDistance }}</span>
                </div>
                
                 <div class="detail-group" *ngIf="instance.vocationEncodingRefId">
                   <label>Description:</label>
                   <span>{{ getVocationEncodingRefDescription(instance.vocationEncodingRefId) }}</span>
                 </div>
               
              </div>
            </div>
          </div>
        </div>
        
         
      
      <div *ngIf="!loading && !entity" class="error-message">
        <p>No vocation encoding data found.</p>
      </div>
    </div>
  `,
  styles: [`
    .tree-container {
      margin-top: 1rem;
    }
    
    .tree-node {
      margin-bottom: 0.5rem;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      background-color: #fff;
    }
    
    .tree-node-header {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      cursor: pointer;
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
      transition: background-color 0.2s;
    }
    
    .tree-node-header:hover {
      background-color: #e9ecef;
    }
    
    .tree-node-header i {
      margin-right: 0.5rem;
      transition: transform 0.2s;
      color: #6c757d;
    }
    
    .tree-node-header i.rotated {
      transform: rotate(90deg);
    }
    
    .instance-name {
      font-weight: 600;
      color: #333;
      margin-right: 0.5rem;
    }
    
    .instance-codes {
      color: #6c757d;
      font-size: 0.9rem;
    }
    
    .tree-node-content {
      padding: 1rem;
      background-color: #fff;
    }
    
    .tree-node-content .detail-group {
      display: flex;
      align-items: flex-start;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #dee2e6;
    }
    
    .tree-node-content .detail-group:last-child {
      border-bottom: none;
    }
    
    .tree-node-content .detail-group label {
      flex: 0 0 180px;
      font-weight: 600;
      color: #333;
      margin-right: 1rem;
      margin-top: 0;
    }
    
    .tree-node-content .detail-group span {
      flex: 1;
      color: #555;
    }
    
    .error-message {
      text-align: center;
      padding: 2rem;
      color: #6c757d;
    }
    
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      max-height: 300px;
      overflow-y: auto;
    }
  `]
})
export class VocationEncodingDisplayComponent  implements OnInit {
  @Input() id!: string;
  
  protected entity: VocationEncodingGETData | null = null;
  protected expandedInstances: boolean[] = [];
  protected loading: boolean = false;
  protected error: string = '';
  protected hcclService = inject(HcclService);
  protected vocationEncodingRefs: Map<string, VocationEncodingRefGETData> = new Map();
  constructor() {
    
  }

  ngOnInit(): void {
    this.loadEntity();
  }

  protected async loadEntityById(id: string): Promise<VocationEncodingGETData> {
    const result = await this.hcclService.getVocationEncodingById(id).toPromise();
    if (!result) {
      throw new Error('Failed to load vocation encoding data');
    }
    return result;
  }

  private async loadEntity(): Promise<void> {
    if (!this.id) return;
    
    this.loading = true;
    try {
      this.entity = await this.loadEntityById(this.id);
      // Initialize expanded state for all instances
      this.expandedInstances = new Array(this.entity?.vocationEncodingInstances?.length || 0).fill(false);
      
      // Load VocationEncodingRef data for all instances
      await this.loadVocationEncodingRefs();
    } catch (error) {
      console.error('Error loading vocation encoding:', error);
      this.error = 'Failed to load vocation encoding data';
    } finally {
      this.loading = false;
    }
  }

  private async loadVocationEncodingRefs(): Promise<void> {
    if (!this.entity?.vocationEncodingInstances) return;
    
    const refIds = this.entity.vocationEncodingInstances
      .map(instance => instance.vocationEncodingRefId)
      .filter((id): id is string => !!id);
    
    // Load each VocationEncodingRef
    for (const refId of refIds) {
      if (!this.vocationEncodingRefs.has(refId)) {
        try {
          const refData = await this.hcclService.getVocationEncodingRefById(refId).toPromise();
          if (refData) {
            this.vocationEncodingRefs.set(refId, refData);
          }
        } catch (error) {
          console.warn(`Failed to load VocationEncodingRef ${refId}:`, error);
        }
      }
    }
  }

  protected getVocationEncodingRefDescription(refId: string | undefined): string {
    if (!refId) return '';
    const refData = this.vocationEncodingRefs.get(refId);
    return refData?.description || '';
  }

  protected setupTabs(): SimpleTab[] {
    return [];
  }

  toggleInstance(index: number): void {
    this.expandedInstances[index] = !this.expandedInstances[index];
  }
}
