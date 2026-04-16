import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { StudentUiComponent } from '@app/components/_crud/hccluserprofile/student-ui.component';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { WhatsNewModalComponent } from './whats-new-modal.component';

@Component({
  selector: 'app-dash-student-home',
  standalone: true,
  imports: [CommonModule, StudentUiComponent, MdbAccordionModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">

          <!-- What's New Accordion -->
          <mdb-accordion class="whats-new-accordion mb-4">
            <mdb-accordion-item [collapsed]="whatsNewCollapsed" (itemShow)="whatsNewCollapsed = false" (itemHide)="whatsNewCollapsed = true">
              <ng-template mdbAccordionItemHeader>
                <i class="fas fa-sparkles me-2"></i>
                <span class="fw-bold">What's New</span>
              </ng-template>
              <ng-template mdbAccordionItemBody>
                <div class="whats-new-grid">
                  <div class="whats-new-card" (click)="openWhatsNewModal('new-listings')">
                    <div class="whats-new-icon-wrap bg-gradient-primary">
                      <i class="fas fa-clipboard-list"></i>
                    </div>
                    <span class="whats-new-label">New Listings</span>
                  </div>

                  <div class="whats-new-card" (click)="openWhatsNewModal('tutorials')">
                    <div class="whats-new-icon-wrap bg-gradient-success">
                      <i class="fas fa-graduation-cap"></i>
                    </div>
                    <span class="whats-new-label">Tutorials</span>
                  </div>

                  <div class="whats-new-card" (click)="openWhatsNewModal('career-news')">
                    <div class="whats-new-icon-wrap bg-gradient-info">
                      <i class="fas fa-newspaper"></i>
                    </div>
                    <span class="whats-new-label">Career News</span>
                  </div>

                  <div class="whats-new-card" (click)="openWhatsNewModal('state-of-ma')">
                    <div class="whats-new-icon-wrap bg-gradient-warning">
                      <i class="fas fa-landmark"></i>
                    </div>
                    <span class="whats-new-label">State of MA</span>
                  </div>
                </div>
              </ng-template>
            </mdb-accordion-item>
          </mdb-accordion>

          <!-- Loading State (context) -->
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading student information...</p>
          </div>

          <!-- Error State -->
          <div *ngIf="error && !loading" class="alert alert-danger" role="alert">
            <i class="fas fa-exclamation-triangle me-2"></i>
            {{ error }}
          </div>

          <!-- Student UI Content -->
          <app-student-ui *ngIf="!loading && !error && userProfileId" [userProfileId]="userProfileId"></app-student-ui>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .whats-new-accordion {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }

    .whats-new-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
      padding: 0.75rem 0;
    }

    @media (max-width: 768px) {
      .whats-new-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .whats-new-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem 0.75rem;
      border-radius: 12px;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      background: #fff;
      border: 1px solid #e9ecef;
    }

    .whats-new-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    }

    .whats-new-icon-wrap {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: #fff;
      transition: transform 0.2s ease;
    }

    .whats-new-card:hover .whats-new-icon-wrap {
      transform: scale(1.1);
    }

    .bg-gradient-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .bg-gradient-success {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    }
    .bg-gradient-info {
      background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
    }
    .bg-gradient-warning {
      background: linear-gradient(135deg, #f2994a 0%, #f2c94c 100%);
    }

    .whats-new-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #495057;
      text-align: center;
    }
  `],
})
export class DashStudentHomeComponent implements OnInit {
  private hcclContextService = inject(HcclContextService);
  private modalService = inject(MdbModalService);

  loading = true;
  error: string | null = null;
  userProfileId: string | null = null;
  whatsNewCollapsed = false;

  private whatsNewModalRef: MdbModalRef<WhatsNewModalComponent> | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  openWhatsNewModal(section: string): void {
    const titles: Record<string, string> = {
      'new-listings': 'New Listings',
      'tutorials': 'Tutorials',
      'career-news': 'Career News',
      'state-of-ma': 'State of MA',
    };

    const icons: Record<string, string> = {
      'new-listings': 'fas fa-clipboard-list',
      'tutorials': 'fas fa-graduation-cap',
      'career-news': 'fas fa-newspaper',
      'state-of-ma': 'fas fa-landmark',
    };

    this.whatsNewModalRef = this.modalService.open(WhatsNewModalComponent, {
      modalClass: 'modal-lg modal-dialog-centered',
      data: {
        title: titles[section] || section,
        icon: icons[section] || 'fas fa-info-circle',
        section,
      },
    }) as MdbModalRef<WhatsNewModalComponent>;
  }

  private loadData(): void {
    this.loading = true;
    this.error = null;

    this.hcclContextService.waitForReady$().subscribe({
      next: (context) => {
        if (!context || !context.currentUserProfileId) {
          this.error = 'User context not available';
          this.loading = false;
          return;
        }
        this.userProfileId = context.currentUserProfileId;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load user context';
        this.loading = false;
      },
    });
  }
}
