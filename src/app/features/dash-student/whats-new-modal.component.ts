import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-whats-new-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header whats-new-modal-header">
      <div class="d-flex align-items-center gap-2">
        <i [class]="icon + ' me-1'" style="font-size:1.25rem"></i>
        <h5 class="modal-title mb-0 fw-bold">{{ title }}</h5>
      </div>
      <span class="fas fa-times close-btn" (click)="onClose()"></span>
    </div>

    <div class="modal-body whats-new-modal-body">
      <div class="empty-state">
        <div class="empty-state-icon">
          <i [class]="icon"></i>
        </div>
        <h5 class="mt-3 fw-bold">{{ title }}</h5>
        <p class="text-muted">Content coming soon. Check back for updates!</p>
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-sm btn-dark" (click)="onClose()">Close</button>
    </div>
  `,
  styles: [`
    .whats-new-modal-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      border-bottom: none;
    }

    .close-btn {
      cursor: pointer;
      font-size: 1rem;
      opacity: 0.8;
      transition: opacity 0.15s;
    }
    .close-btn:hover {
      opacity: 1;
    }

    .whats-new-modal-body {
      min-height: 250px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
    }

    .empty-state-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea22, #764ba222);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: #667eea;
    }
  `],
})
export class WhatsNewModalComponent {
  title = '';
  icon = 'fas fa-info-circle';
  section = '';

  constructor(public modalRef: MdbModalRef<WhatsNewModalComponent>) {}

  onClose(): void {
    this.modalRef.close();
  }
}
