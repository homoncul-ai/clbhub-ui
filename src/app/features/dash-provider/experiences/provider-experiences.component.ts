import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExperienceCriteria, ExperienceGETData, HcclService } from '@app/restsvc/hccl.service';
import { ExperienceUiComponent } from '@app/components/_crud/experience-ui/experience-ui.component';

@Component({
  selector: 'app-provider-experiences',
  standalone: true,
  imports: [CommonModule, FormsModule, ExperienceUiComponent],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title mb-0">
                <i class="fas fa-compass me-2"></i>
                Experiences
              </h3>
            </div>
            <div class="card-body">
              <!-- Search bar -->
              <form class="d-flex gap-2 mb-4" (ngSubmit)="search()">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search experiences..."
                  name="experienceSearch"
                  [(ngModel)]="searchText" />
                <button type="submit" class="btn btn-primary" [disabled]="loading">
                  <i class="fas fa-search me-1"></i>
                  Search
                </button>
              </form>

              <!-- Loading -->
              <div *ngIf="loading" class="text-center py-4">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <!-- Results -->
              <div *ngIf="!loading">
                <div *ngIf="experiences.length === 0" class="text-muted">
                  No experiences found.
                </div>

                <div class="list-group" *ngIf="experiences.length > 0">
                  <button
                    type="button"
                    class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    *ngFor="let exp of experiences"
                    [class.active]="exp.id === selectedExperienceId"
                    (click)="selectExperience(exp)">
                    <span>
                      <i class="fas fa-compass me-2"></i>
                      {{ exp.name }}
                    </span>
                    <small class="text-muted">{{ exp.businessCode }}</small>
                  </button>
                </div>
              </div>

              <!-- Selected experience -->
              <div #selectedArea class="mt-4" *ngIf="selectedExperienceId">
                <hr />
                <app-experience-ui [experienceId]="selectedExperienceId"></app-experience-ui>
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
  `],
})
export class ProviderExperiencesComponent implements OnInit {
  private hcclService = inject(HcclService);

  @ViewChild('selectedArea') selectedAreaRef?: ElementRef<HTMLElement>;

  searchText = '';
  experiences: ExperienceGETData[] = [];
  loading = false;
  selectedExperienceId = '';

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.loading = true;
    this.selectedExperienceId = '';

    const criteria: ExperienceCriteria = {
      searchByText: this.searchText || undefined,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
    };

    this.hcclService.findExperiences(criteria).subscribe({
      next: (response) => {
        this.experiences = response?.searchResults || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to search experiences:', err);
        this.experiences = [];
        this.loading = false;
      },
    });
  }

  selectExperience(exp: ExperienceGETData): void {
    this.selectedExperienceId = exp.id || '';
    setTimeout(() => {
      this.selectedAreaRef?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}
