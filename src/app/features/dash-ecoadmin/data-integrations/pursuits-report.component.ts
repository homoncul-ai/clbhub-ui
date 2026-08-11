import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  HcclService,
  PersonalStatementCriteria,
  PersonalStatementGETData,
} from '@app/restsvc/hccl.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { firstValueFrom } from 'rxjs';

export interface PursuitCountRow {
  name: string;
  count: number;
}

@Component({
  selector: 'app-pursuits-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pursuits-report.component.html',
  styleUrl: './pursuits-report.component.scss',
})
export class PursuitsReportComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly hcclService = inject(HcclService);

  @ViewChild('pursuitsChart') chartCanvas?: ElementRef<HTMLCanvasElement>;

  loading = false;
  error: string | null = null;
  rows: PursuitCountRow[] = [];
  totalSelections = 0;

  /** Active-only filter (status === 1). */
  activeOnly = false;
  dateStart = '';
  dateEnd = '';

  private chart: Chart | null = null;
  private viewReady = false;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    void this.loadReport();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderChart();
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  async applyFilters(): Promise<void> {
    await this.loadReport();
  }

  async clearFilters(): Promise<void> {
    this.activeOnly = false;
    this.dateStart = '';
    this.dateEnd = '';
    await this.loadReport();
  }

  async loadReport(): Promise<void> {
    this.loading = true;
    this.error = null;
    this.destroyChart();

    try {
      // Note: PersonalStatement query accepts searchByDateRange but does NOT apply it
      // (addCustomPredicates is empty). Date filtering is done client-side on dateCreated.
      const criteria: PersonalStatementCriteria = {
        statementTypeCode: 'student_vocation',
        isPaging: false,
        maxResults: 2000,
      };

      if (this.activeOnly) {
        criteria.status = 1;
      }

      const response = await firstValueFrom(this.hcclService.findPersonalStatements(criteria));
      const statements = this.filterByDateCreated(response?.searchResults || []);

      this.rows = this.aggregateByName(statements);
      this.totalSelections = statements.length;
      // Wait for *ngIf canvas to exist before drawing
      setTimeout(() => this.renderChart(), 0);
    } catch (err: unknown) {
      console.error('Failed to load pursuits report', err);
      this.error = err instanceof Error ? err.message : 'Failed to load pursuits.';
      this.rows = [];
      this.totalSelections = 0;
      this.destroyChart();
    } finally {
      this.loading = false;
    }
  }

  /** Filter by pursuit join/create time using dateCreated from each row. */
  private filterByDateCreated(statements: PersonalStatementGETData[]): PersonalStatementGETData[] {
    const startMs = this.dateBoundToMs(this.dateStart, 'start');
    const endMs = this.dateBoundToMs(this.dateEnd, 'end');
    if (startMs == null && endMs == null) {
      return statements;
    }

    return statements.filter((statement) => {
      const createdMs = this.getCreatedMs(statement);
      if (createdMs == null) {
        return false;
      }
      if (startMs != null && createdMs < startMs) {
        return false;
      }
      if (endMs != null && createdMs > endMs) {
        return false;
      }
      return true;
    });
  }

  private dateBoundToMs(value: string, bound: 'start' | 'end'): number | null {
    if (!value) {
      return null;
    }
    // Interpret HTML date as UTC day bounds to match dateCreated.date (...Z).
    const iso = bound === 'end' ? `${value}T23:59:59.999Z` : `${value}T00:00:00.000Z`;
    const ms = Date.parse(iso);
    return Number.isFinite(ms) ? ms : null;
  }

  private getCreatedMs(statement: PersonalStatementGETData): number | null {
    const created = statement.dateCreated;
    if (!created) {
      return null;
    }
    if (typeof created.dateMilliseconds === 'number') {
      return created.dateMilliseconds;
    }
    if (created.date) {
      const raw = created.date as string | Date;
      const ms = typeof raw === 'string' ? Date.parse(raw) : raw.getTime();
      return Number.isFinite(ms) ? ms : null;
    }
    return null;
  }

  private aggregateByName(statements: PersonalStatementGETData[]): PursuitCountRow[] {
    const counts = new Map<string, number>();

    for (const statement of statements) {
      const name = (statement.name || '').trim() || '(unnamed)';
      counts.set(name, (counts.get(name) || 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }

  private renderChart(): void {
    if (!this.viewReady || !this.chartCanvas) {
      return;
    }

    this.destroyChart();

    if (!this.rows.length) {
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.rows.map((row) => row.name),
        datasets: [
          {
            label: 'Selections',
            data: this.rows.map((row) => row.count),
            backgroundColor: 'rgba(54, 162, 235, 0.65)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Pursuit selections by name',
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 0,
              autoSkip: true,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
            title: {
              display: true,
              text: 'Selections',
            },
          },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}
