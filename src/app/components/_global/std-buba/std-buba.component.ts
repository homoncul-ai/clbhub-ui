import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BubaService, BubaData, BubaResult } from '@app/shell/services/buba.service';

@Component({
  selector: 'app-std-buba',
  imports: [CommonModule],
  templateUrl: './std-buba.component.html',
  styleUrl: './std-buba.component.scss'
})
export class StdBubaComponent implements OnInit, OnDestroy {
  @Input() entityName: string = '';
  @Input() entityId: string = '';
  @Input() profileTypeCode?: string;
  @Input() aspect?: string;
  @Input() showIcon: boolean = true;
  @Input() showTooltip: boolean = true;
  @Input() cssClass: string = '';

  private bubaService = inject(BubaService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  
  bubaResult: BubaResult | null = null;
  loading: boolean = false;
  error: string | null = null;
  showPopup: boolean = false;

  ngOnInit(): void {
    if (this.entityName && this.entityId) {
      this.loadBuba();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load the buba data and generate the result
   */
  private loadBuba(): void {
    this.loading = true;
    this.error = null;

    const bubaData: BubaData = {
      entityName: this.entityName,
      entityId: this.entityId,
      profileTypeCode: this.profileTypeCode,
      aspect: this.aspect
    };

    this.bubaService.generateBuba(bubaData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.bubaResult = result;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load buba data';
          this.loading = false;
          console.error('Error loading buba:', error);
        }
      });
  }

  /**
   * Handle click on the buba link
   */
  onBubaClick(event: Event): void {
    if (this.bubaResult?.routePath && this.bubaResult.routePath !== '#') {
      event.preventDefault();
      this.router.navigateByUrl(this.bubaResult.routePath);
    }
  }

  /**
   * Show popup on icon mouse enter
   */
  onIconMouseEnter(): void {
    if (this.bubaResult?.entityData) {
      this.showPopup = true;
    }
  }

  /**
   * Hide popup on mouse leave
   */
  onIconMouseLeave(): void {
    this.showPopup = false;
  }

  /**
   * Get entity properties for popup display
   */
  getEntityProperties(): { [key: string]: any } {
    if (!this.bubaResult?.entityData) {
      return {};
    }
    
    const props: { [key: string]: any } = {};
    const entityData = this.bubaResult.entityData;
    
    // Add all properties from entityData
    Object.keys(entityData).forEach(key => {
      if (entityData[key] !== null && entityData[key] !== undefined) {
        props[key] = entityData[key];
      }
    });
    
    return props;
  }

  /**
   * Get the CSS classes for the buba container
   */
  getBubaClasses(): string {
    const classes = ['buba-container'];
    
    if (this.cssClass) {
      classes.push(this.cssClass);
    }
    
    if (this.loading) {
      classes.push('buba-loading');
    }
    
    if (this.error) {
      classes.push('buba-error');
    }
    
    return classes.join(' ');
  }
}

