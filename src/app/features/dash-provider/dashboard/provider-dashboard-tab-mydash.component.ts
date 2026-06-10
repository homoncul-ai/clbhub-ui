import { Component, inject, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { CatalogCriteria, CatalogGETData, EntityStateStatGETData, HcclService, WorkRequestDashboardUIGETData, WorkRequestGETData } from '@app/restsvc/hccl.service';

import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { HcclUserProfileCrudWrapper } from '@app/features/dash-ecoadmin/orgs/org-school-staff-crud.component';
import { Chart, registerables } from 'chart.js';
import { HcclOrganizationCrudWrapper } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';

@Component({
  selector: 'app-provider-dashboard-tab-mydash',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <!-- Provider Request Stats -->
              <div class="row mb-4">                 
                <div class="col-md-3">
                  <div class="text-center">
                    <div class="display-4 text-primary">{{ getProviderRequestStats('New')?.itemCount }}</div>
                    <div class="text-muted">{{ getProviderRequestStats('New')?.stateLabel }}</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center">
                    <div class="display-4 text-warning">{{ getProviderRequestStats('InProgress')?.itemCount }}</div>
                    <div class="text-muted">{{ getProviderRequestStats('InProgress')?.stateLabel }}</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center">
                    <div class="display-4 text-success">{{ getProviderRequestStats('Closed')?.itemCount }}</div>
                    <div class="text-muted">{{ getProviderRequestStats('Closed')?.stateLabel }}</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center">
                    <div class="display-4 text-info">{{ getCatalogCount() }}</div>
                    <div class="text-muted">Total Catalogs</div>
                  </div>
                </div>
              </div>

              <div class="row">
                <!-- Course Catalog Interests Chart -->
                <div class="col-md-6">
                  <h5>Catalog Interests</h5>
                  <div class="card">
                    <div class="card-body">
                      <!-- Bar chart showing catalog interest counts with statsdaterange and business codes -->
                      <div class="chart-container" style="position: relative; height: 300px;">
                        <canvas #catalogInterestsChart></canvas>
                      </div>
                      <p class="text-muted mt-2">
                        <i class="fas fa-info-circle me-1"></i>
                        Hover over bars to see business codes and date ranges
                      </p>
                    </div>
                  </div>
                </div>
                
                <!-- Catalog List -->
                <div class="col-md-6">
                  <h5>Available Catalogs {{ getCatalogs().length }}</h5>
                  <div class="list-group">
                    <div class="list-group-item" *ngFor="let catalog of getCatalogs()">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">{{ catalog.name }}</h6>
                        <span class="badge bg-primary">{{ catalog.stats?.entryCount }}</span>
                      </div>
                      <p class="mb-1">{{ catalog.description }}</p>
                      <small class="text-muted">Last updated:  </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      border: 1px solid rgba(0, 0, 0, 0.125);
    }
    
    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }
    
    .list-group-item {
      border-left: none;
      border-right: none;
    }
    
    .badge {
      font-size: 0.75em;
    }
    
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }
    
    .chart-container {
      background-color: #f8f9fa;
      border-radius: 0.375rem;
      padding: 1rem;
    }
  `]
})
export class ProviderDashboardTabMydashComponent extends AbstractMultimodeComponent<HcclOrganizationCrudWrapper> implements AfterViewInit {
  @ViewChild('catalogInterestsChart', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chartInstance: Chart | null = null;

  constructor() {
      super();
      console.log('ProviderDashboardTabMydashComponent');
      Chart.register(...registerables);
  }


  ngAfterViewInit(): void {
    // Chart will be created after data loads
  }

  
  protected newCrudWrapperForCreate(): HcclOrganizationCrudWrapper {
      return HcclOrganizationCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected catalogList: CatalogGETData[] = [];
  protected async loadEntityByIdCall(id: string): Promise<HcclOrganizationCrudWrapper> {
    const catalogcriteria : CatalogCriteria = {
      organizationId: id,
      includingCatalogStats: true,
      available: 1,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    }
    
    const catalogs  = await this.hcclService.findCatalogs(catalogcriteria).toPromise();

    
    this.catalogList = catalogs?.searchResults || [];

    // Create chart after data loads
    setTimeout(() => {
      this.createCatalogInterestsChart();
    }, 100);

      return HcclOrganizationCrudWrapper.newInstance(id, this.hcclService);
  }  

  protected getProviderRequestStats(stateCode: string): EntityStateStatGETData | null {
    return  {itemCount: 0, stateCode: stateCode, stateLabel: stateCode};
  }

  protected getCatalogCount(): number {
    // Mock data for now - replace with actual service call    
    return 5;
  }

  protected getCatalogs(): CatalogGETData[] {
    return this.catalogList;

    // // Mock data for now - replace with actual service call
    // return [
    //   { name: 'Computer Science', description: 'Programming and software development courses', entryCount: 25, lastUpdated: '2024-01-15' },
    //   { name: 'Business Administration', description: 'Management and business courses', entryCount: 18, lastUpdated: '2024-01-10' },
    //   { name: 'Healthcare', description: 'Medical and healthcare related courses', entryCount: 32, lastUpdated: '2024-01-20' },
    //   { name: 'Engineering', description: 'Engineering and technical courses', entryCount: 28, lastUpdated: '2024-01-18' },
    //   { name: 'Arts & Design', description: 'Creative and design courses', entryCount: 15, lastUpdated: '2024-01-12' }
    // ];
  }

  protected loadInfo() {
    // TODO: Implement actual service call for provider dashboard data
    // this.hcclService.resolveProviderUIData().subscribe((data) => {
    //   console.log('Provider UI data loaded:', data);
    //   this.providerUIData = data;
    // });
    console.log('Loading provider dashboard data...');
  }

  private createCatalogInterestsChart(): void {
    if (!this.chartCanvas || this.catalogList.length === 0) {
      return;
    }

    // Destroy existing chart if it exists
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    // Prepare chart data
    const labels = this.catalogList.map(catalog => catalog.name || 'Unknown');
    const interestCounts = this.catalogList.map(catalog => catalog.stats?.interestCount || 0);
    const entryCounts = this.catalogList.map(catalog => catalog.stats?.entryCount || 0);
    
    // Get date range info
    const dateRanges = this.catalogList.map(catalog => {
      const dateRange = catalog.stats?.dateRange;
      if (dateRange?.theStart && dateRange?.theEnd) {
        return `${dateRange.theStart.formattedDate || 'N/A'} - ${dateRange.theEnd.formattedDate || 'N/A'}`;
      }
      return 'No date range';
    });

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Interest Count',
            data: interestCounts,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Entry Count',
            data: entryCounts,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Catalog Interest and Entry Counts',
            font: {
              size: 16
            }
          },
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              afterLabel: (context: any) => {
                const index = context.dataIndex;
                const catalog = this.catalogList[index];
                const businessCode = catalog?.businessCode || 'N/A';
                const dateRange = dateRanges[index];
                return [
                  `Business Code: ${businessCode}`,
                  `Date Range: ${dateRange}`
                ];
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Count'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Catalogs'
            }
          }
        }
      }
    });
  }
}
