import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Blocking shell modal shown when the active HCCLUserProfile has unsigned consents.
 * Content is intentionally blank for now; contract-section / accept wiring comes later.
 */
@Component({
  selector: 'app-consent-required-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consent-required-modal.component.html',
  styleUrl: './consent-required-modal.component.scss',
})
export class ConsentRequiredModalComponent {
  @Input() open = false;

  /** TEMP: remove when real accept flow is wired. */
  @Output() dismiss = new EventEmitter<void>();

  onTempDismiss(): void {
    this.dismiss.emit();
  }
}
