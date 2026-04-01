import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StdMarkdownDisplayComponent } from '@app/components/_global/std-markdown-display/std-markdown-display.component';

@Component({
  selector: 'app-contract-viewer-modal',
  standalone: true,
  imports: [CommonModule, StdMarkdownDisplayComponent],
  templateUrl: './contract-viewer-modal.component.html',
  styleUrl: './contract-viewer-modal.component.scss',
})
export class ContractViewerModalComponent {
  @Input() title = 'Contract';
  @Input() markdown = '';
  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }
}
