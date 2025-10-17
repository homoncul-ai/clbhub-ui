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
  entityData?: any;
}

export interface EntityMetadata {
  iconTemplate: string | null;
  routePathTemplate: string | null;
  nameTemplate: string | null;
  htmlTemplate: string | null;
  htmlTemplateFilename: string | null;
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
        const metadata = this.loadEntityMetadata(entityData);
        const routePath = this.calculateRoutePath(bubaData, context, metadata);
        const name = this.calculateName(entityData, bubaData, metadata);
        const icon = this.calculateIcon(entityData, bubaData, metadata);
        const html = this.mergeTemplateWithData(template, entityData, bubaData);

        return {
          html,
          name,
          icon,
          routePath,
          entityData
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
          entityData: { entityName: bubaData.entityName, entityId: bubaData.entityId }
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
   * Load entity metadata for the given entity data
   * @param entityData - The entity data
   * @returns EntityMetadata object
   */
  private loadEntityMetadata(entityData: any): EntityMetadata {
    const entityName = entityData.entityType || entityData.entityName || 'unknown';
    
    // Define metadata for each entity type
    const metadataMap: { [key: string]: EntityMetadata } = {
      'advocate': {
        iconTemplate: 'fas fa-user-tie',
        routePathTemplate: '/{dashboardType}/advocate/{entityId}',
        nameTemplate: '{displayName}',
        htmlTemplate: null,
        htmlTemplateFilename: 'advocate.html'
      },
      'broker': {
        iconTemplate: 'fas fa-handshake',
        routePathTemplate: '/{dashboardType}/broker/{entityId}',
        nameTemplate: '{displayName}',
        htmlTemplate: null,
        htmlTemplateFilename: 'broker.html'
      },
      'catalog': {
        iconTemplate: 'fas fa-book',
        routePathTemplate: '/{dashboardType}/catalog/{entityId}',
        nameTemplate: '{displayName}',
        htmlTemplate: null,
        htmlTemplateFilename: 'catalog.html'
      },
      'catalogentry': {
        iconTemplate: 'fas fa-book-open',
        routePathTemplate: '/{dashboardType}/catalogentry/{entityId}',
        nameTemplate: '{displayName}',
        htmlTemplate: null,
        htmlTemplateFilename: 'catalogentry.html'
      },
      'profile': {
        iconTemplate: 'fas fa-id-card',
        routePathTemplate: '/{dashboardType}/profile/{entityId}',
        nameTemplate: '{displayName}',
        htmlTemplate: null,
        htmlTemplateFilename: 'profile.html'
      },
      'provider': {
        iconTemplate: 'fas fa-hospital',
        routePathTemplate: '/{dashboardType}/provider/{entityId}',
        nameTemplate: '{displayName}',
        htmlTemplate: null,
        htmlTemplateFilename: 'provider.html'
      },
      'school': {
        iconTemplate: 'fas fa-school',
        routePathTemplate: '/{dashboardType}/school/{entityId}',
        nameTemplate: '{displayName}',
        htmlTemplate: null,
        htmlTemplateFilename: 'school.html'
      },
      'student': {
        iconTemplate: 'fas fa-user-graduate',
        routePathTemplate: '/{dashboardType}/student/{entityId}',
        nameTemplate: '{displayName}',
        htmlTemplate: null,
        htmlTemplateFilename: 'student.html'
      },
      'user': {
        iconTemplate: 'fas fa-user',
        routePathTemplate: '/{dashboardType}/user/{entityId}',
        nameTemplate: '{displayName}',
        htmlTemplate: null,
        htmlTemplateFilename: 'user.html'
      },
      'workrequest': {
        iconTemplate: 'fas fa-tasks',
        routePathTemplate: '/{dashboardType}/workrequest/{entityId}',
        nameTemplate: '{displayName}',
        htmlTemplate: null,
        htmlTemplateFilename: 'workrequest.html'
      }
    };

    return metadataMap[entityName.toLowerCase()] || {
      iconTemplate: 'fas fa-cube',
      routePathTemplate: '/{dashboardType}/{entityName}/{entityId}',
      nameTemplate: '{entityName} {entityId}',
      htmlTemplate: null,
      htmlTemplateFilename: 'default.html'
    };
  }

  /**
   * Calculate the route path for the entity
   * @param bubaData - The entity data
   * @param context - The HCCL context
   * @param metadata - The entity metadata
   * @returns The calculated route path
   */
  private calculateRoutePath(bubaData: BubaData, context: any, metadata: EntityMetadata): string {
    // Get the current dashboard type from context or default
    const dashboardType = context?.dashboardType || 'ecoadmin-dashboard';
    
    // Use metadata template to build route path
    let routePath = (metadata.routePathTemplate || '/{dashboardType}/{entityName}/{entityId}')
      .replace('{dashboardType}', dashboardType)
      .replace('{entityName}', bubaData.entityName.toLowerCase())
      .replace('{entityId}', bubaData.entityId);
    
    // Add query parameters if present
    const queryParams: string[] = [];
    if (bubaData.profileTypeCode) {
      queryParams.push(`profileTypeCode=${bubaData.profileTypeCode}`);
    }
    if (bubaData.aspect) {
      queryParams.push(`aspect=${bubaData.aspect}`);
    }
    
    if (queryParams.length > 0) {
      routePath += `?${queryParams.join('&')}`;
    }
    
    return routePath;
  }

  /**
   * Calculate the display name for the buba
   * @param entityData - The fetched entity data
   * @param bubaData - The original buba data
   * @param metadata - The entity metadata
   * @returns The calculated name
   */
  private calculateName(entityData: any, bubaData: BubaData, metadata: EntityMetadata): string {
    // Use metadata template to build name
    let name = (metadata.nameTemplate || '{displayName}')
      .replace('{displayName}', entityData.displayName || entityData.name || `${bubaData.entityName} ${bubaData.entityId}`)
      .replace('{name}', entityData.name || `${bubaData.entityName} ${bubaData.entityId}`)
      .replace('{entityName}', bubaData.entityName)
      .replace('{entityId}', bubaData.entityId);
    
    return name;
  }

  /**
   * Calculate the icon for the buba
   * @param entityData - The fetched entity data
   * @param bubaData - The original buba data
   * @param metadata - The entity metadata
   * @returns The icon class name
   */
  private calculateIcon(entityData: any, bubaData: BubaData, metadata: EntityMetadata): string {
    return metadata.iconTemplate || 'fas fa-cube';
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
    const metadata = this.loadEntityMetadata(entityData);
    const replacements: { [key: string]: string } = {
      '{{name}}': this.calculateName(entityData, bubaData, metadata),
      '{{entityId}}': bubaData.entityId,
      '{{entityName}}': bubaData.entityName,
      '{{icon}}': this.calculateIcon(entityData, bubaData, metadata),
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

}
