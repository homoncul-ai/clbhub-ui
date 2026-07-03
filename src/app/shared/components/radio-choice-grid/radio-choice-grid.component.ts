import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface RadioChoiceGridRow {
  key: string;
  label: string;
}

export interface RadioChoiceGridOption {
  id: string;
  label: string;
}

@Component({
  selector: 'app-radio-choice-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radio-choice-grid.component.html',
  styleUrl: './radio-choice-grid.component.scss',
})
export class RadioChoiceGridComponent {
  @Input() rows: readonly RadioChoiceGridRow[] = [];
  @Input() options: readonly RadioChoiceGridOption[] = [];
  @Input() selectedValues: Record<string, string> = {};
  @Input() disabled = false;

  @Output() selectionChange = new EventEmitter<{ rowKey: string; value: string }>();

  handleSelection(rowKey: string, value: string): void {
    this.selectionChange.emit({ rowKey, value });
  }
}
