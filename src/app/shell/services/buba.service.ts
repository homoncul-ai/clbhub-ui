import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { HcclService } from '@app/restsvc/hccl.service';
import { HcclContextService } from './hccl-context.service';
import { Logger } from '@core/services';

export interface BubaData {
  entityName: string;
  entityId: string;
  profileTypeCode?: string;
  aspect?: string;
}

export interface BubaResult {
  html: string;
  name: string;
  icon: string;
  routePath: string;
  tooltip?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BubaService {
  private http = inject(HttpClient);
  private hcclService = inject(HcclService);
  private hcclContextService = inject(HcclContextService);
  private logger = new Logger('BubaService');

  constructor() { }

  /**
   * Generate a buba object for the given entity data
   * @param bubaData - The entity data to generate buba for
   * @returns Observable of BubaResult
   */
  generateBuba(bubaData: BubaData): Observable<BubaResult> {
    this.logger.info('Generating buba for entity', bubaData);

    return forkJoin({
      entityData: this.fetchEntityData(bubaData),
      template: this.loadTemplate(bubaData.entityName),
      context: this.hcclContextService.waitForReady$()
    }).pipe(
      map(({ entityData, template, context }) => {
        const routePath = this.calculateRoutePath(bubaData, context);
        const name = this.calculateName(entityData, bubaData);
        const icon = this.calculateIcon(entityData, bubaData);
        const html = this.mergeTemplateWithData(template, entityData, bubaData);
        const tooltip = this.generateTooltip(entityData, bubaData);

        return {
          html,
          name,
          icon,
          routePath,
          tooltip
        };
      }),
      catchError((error) => {
        this.logger.error('Error generating buba', error);
        // Return a default buba result on error
        return of({
          html: `<span>${bubaData.entityName} (${bubaData.entityId})</span>`,
          name: `${bubaData.entityName} ${bubaData.entityId}`,
          icon: 'fas fa-question-circle',
          routePath: '#',
          tooltip: `Entity: ${bubaData.entityName}, ID: ${bubaData.entityId}`
        });
      })
    );
  }

  /**
   * Fetch entity data from HCCL service
   * @param bubaData - The entity data to fetch
   * @returns Observable of entity data
   */
  private fetchEntityData(bubaData: BubaData): Observable<any> {
    // For now, we'll create a mock entity data structure
    // In a real implementation, this would call the appropriate HCCL service method
    const mockEntityData = {
      id: bubaData.entityId,
      name: `${bubaData.entityName} ${bubaData.entityId}`,
      displayName: `${bubaData.entityName} ${bubaData.entityId}`,
      entityType: bubaData.entityName,
      description: `Description for ${bubaData.entityName} ${bubaData.entityId}`,
      status: 'active',
      createdDate: new Date().toISOString(),
      profileTypeCode: bubaData.profileTypeCode,
      aspect: bubaData.aspect
    };

    return of(mockEntityData);
  }

  /**
   * Load template from assets/templates/buba folder
   * @param entityName - The entity name to load template for
   * @returns Observable of template string
   */
  private loadTemplate(entityName: string): Observable<string> {
    const templatePath = `/assets/templates/buba/${entityName.toLowerCase()}.html`;
    
    return this.http.get(templatePath, { responseType: 'text' }).pipe(
      catchError((error) => {
        this.logger.warn(`Template not found for ${entityName}, using default template`);
        // Return a default template
        return of(`
          <div class="buba-container">
            <i class="{{icon}}"></i>
            <span class="buba-name">{{name}}</span>
            <span class="buba-id">({{entityId}})</span>
          </div>
        `);
      })
    );
  }

  /**
   * Calculate the route path for the entity
   * @param bubaData - The entity data
   * @param context - The HCCL context
   * @returns The calculated route path
   */
  private calculateRoutePath(bubaData: BubaData, context: any): string {
    // Get the current dashboard type from context or default
    const dashboardType = context?.dashboardType || 'ecoadmin-dashboard';
    
    // Build the route path based on entity type and ID
    let routePath = `/${dashboardType}/${bubaData.entityName.toLowerCase()}`;
    
    if (bubaData.entityId) {
      routePath += `/${bubaData.entityId}`;
    }
    
    if (bubaData.profileTypeCode) {
      routePath += `?profileTypeCode=${bubaData.profileTypeCode}`;
    }
    
    if (bubaData.aspect) {
      const separator = bubaData.profileTypeCode ? '&' : '?';
      routePath += `${separator}aspect=${bubaData.aspect}`;
    }
    
    return routePath;
  }

  /**
   * Calculate the display name for the buba
   * @param entityData - The fetched entity data
   * @param bubaData - The original buba data
   * @returns The calculated name
   */
  private calculateName(entityData: any, bubaData: BubaData): string {
    // Use displayName if available, otherwise construct from entity data
    if (entityData.displayName) {
      return entityData.displayName;
    }
    
    if (entityData.name) {
      return entityData.name;
    }
    
    // Fallback to constructed name
    return `${bubaData.entityName} ${bubaData.entityId}`;
  }

  /**
   * Calculate the icon for the buba
   * @param entityData - The fetched entity data
   * @param bubaData - The original buba data
   * @returns The icon class name
   */
  private calculateIcon(entityData: any, bubaData: BubaData): string {
    // Map entity types to appropriate icons
    const iconMap: { [key: string]: string } = {
      'student': 'fas fa-user-graduate',
      'school': 'fas fa-school',
      'provider': 'fas fa-hospital',
      'broker': 'fas fa-handshake',
      'advocate': 'fas fa-user-tie',
      'workrequest': 'fas fa-tasks',
      'catalog': 'fas fa-book',
      'user': 'fas fa-user',
      'profile': 'fas fa-id-card'
    };
    
    const entityType = bubaData.entityName.toLowerCase();
    return iconMap[entityType] || 'fas fa-cube';
  }

  /**
   * Merge template with entity data
   * @param template - The HTML template
   * @param entityData - The entity data
   * @param bubaData - The original buba data
   * @returns The merged HTML
   */
  private mergeTemplateWithData(template: string, entityData: any, bubaData: BubaData): string {
    let html = template;
    
    // Replace template variables with actual data
    const replacements: { [key: string]: string } = {
      '{{name}}': this.calculateName(entityData, bubaData),
      '{{entityId}}': bubaData.entityId,
      '{{entityName}}': bubaData.entityName,
      '{{icon}}': this.calculateIcon(entityData, bubaData),
      '{{description}}': entityData.description || '',
      '{{status}}': entityData.status || 'unknown',
      '{{displayName}}': entityData.displayName || entityData.name || `${bubaData.entityName} ${bubaData.entityId}`
    };
    
    // Apply all replacements
    Object.keys(replacements).forEach(key => {
      html = html.replace(new RegExp(key, 'g'), replacements[key]);
    });
    
    return html;
  }

  /**
   * Generate tooltip text for the buba
   * @param entityData - The entity data
   * @param bubaData - The original buba data
   * @returns The tooltip text
   */
  private generateTooltip(entityData: any, bubaData: BubaData): string {
    const parts = [
      `Entity: ${bubaData.entityName}`,
      `ID: ${bubaData.entityId}`
    ];
    
    if (entityData.description) {
      parts.push(`Description: ${entityData.description}`);
    }
    
    if (bubaData.profileTypeCode) {
      parts.push(`Profile: ${bubaData.profileTypeCode}`);
    }
    
    if (bubaData.aspect) {
      parts.push(`Aspect: ${bubaData.aspect}`);
    }
    
    return parts.join('\n');
  }
}
