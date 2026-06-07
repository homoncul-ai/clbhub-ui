import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { WhatsNewModalComponent } from '../whats-new-modal.component';

@Component({
  selector: 'app-student-research',
  standalone: true,
  imports: [CommonModule, MdbAccordionModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">

          <h1 class="mb-4">Research</h1>

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

          <!-- Section Accordions -->
          <mdb-accordion class="whats-new-accordion mb-4">
            <mdb-accordion-item>
              <ng-template mdbAccordionItemHeader>
                <i class="fas fa-landmark me-2"></i>
                <span class="fw-bold">State of MA</span>
              </ng-template>
              <ng-template mdbAccordionItemBody>
                <h5>State of MA</h5>
              </ng-template>
            </mdb-accordion-item>

            <mdb-accordion-item>
              <ng-template mdbAccordionItemHeader>
                <i class="fas fa-briefcase me-2"></i>
                <span class="fw-bold">Careers</span>
              </ng-template>
              <ng-template mdbAccordionItemBody>
                <h5>Careers</h5>
              </ng-template>
            </mdb-accordion-item>

            <mdb-accordion-item>
              <ng-template mdbAccordionItemHeader>
                <i class="fas fa-globe me-2"></i>
                <span class="fw-bold">Ecosystem</span>
              </ng-template>
              <ng-template mdbAccordionItemBody>
                <h5>Ecosystem</h5>
              </ng-template>
            </mdb-accordion-item>

            <mdb-accordion-item>
              <ng-template mdbAccordionItemHeader>
                <i class="fas fa-search me-2"></i>
                <span class="fw-bold">Catalog Search</span>
              </ng-template>
              <ng-template mdbAccordionItemBody>
                <h5>Catalog Search</h5>
              </ng-template>
            </mdb-accordion-item>

            <mdb-accordion-item>
              <ng-template mdbAccordionItemHeader>
                <i class="fas fa-clipboard-list me-2"></i>
                <span class="fw-bold">New Listings</span>
              </ng-template>
              <ng-template mdbAccordionItemBody>
                <h5>New Listings</h5>
              </ng-template>
            </mdb-accordion-item>
          </mdb-accordion>
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
export class StudentResearchComponent {
  private modalService = inject(MdbModalService);

  whatsNewCollapsed = false;

  private whatsNewModalRef: MdbModalRef<WhatsNewModalComponent> | null = null;

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
}
