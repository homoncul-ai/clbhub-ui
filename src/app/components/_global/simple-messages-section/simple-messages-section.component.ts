import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleMessageList } from '../../../restsvc/hccl.service';

@Component({
  selector: 'app-simple-messages-section',
  imports: [CommonModule],
  templateUrl: './simple-messages-section.component.html',
  styleUrl: './simple-messages-section.component.scss'
})
export class SimpleMessagesSectionComponent {
  @Input() messagesList!: SimpleMessageList;

  // Severity mapping: 1=error, 2=warning, 3=info, 4=success
  get severityGroups(): { [key: number]: any[] } {
    if (!this.messagesList?.messages) return {};
    
    return this.messagesList.messages.reduce((groups, message) => {
      const severity = message.severity || 3; // Default to info if not specified
      if (!groups[severity]) {
        groups[severity] = [];
      }
      groups[severity].push(message);
      return groups;
    }, {} as { [key: number]: any[] });
  }

  get title(): string {
    if (!this.messagesList?.messages || this.messagesList.messages.length === 0) {
      return '';
    }

    const totalMessages = this.messagesList.messages.length;
    const errorCount = this.severityGroups[1]?.length || 0;
    const warningCount = this.severityGroups[2]?.length || 0;
    const infoCount = this.severityGroups[3]?.length || 0;
    const successCount = this.severityGroups[4]?.length || 0;

    if (errorCount > 0) {
      return `Errors (${errorCount})`;
    } else if (warningCount > 0) {
      return `Warnings (${warningCount})`;
    } else if (infoCount > 0) {
      return `Information (${infoCount})`;
    } else if (successCount > 0) {
      return `Success Messages (${successCount})`;
    }

    return `Messages (${totalMessages})`;
  }

  getSeverityLabel(severity: number): string {
    switch (severity) {
      case 1: return 'Error';
      case 2: return 'Warning';
      case 3: return 'Info';
      case 4: return 'Success';
      default: return 'Info';
    }
  }

  getSeverityClass(severity: number): string {
    switch (severity) {
      case 1: return 'error';
      case 2: return 'warning';
      case 3: return 'info';
      case 4: return 'success';
      default: return 'info';
    }
  }

  isEmpty(): boolean {
    return !this.messagesList?.messages || this.messagesList.messages.length === 0;
  }

  hasMessageWithSeverity(severity: number): boolean {
    return this.messagesList?.messages?.some(msg => msg.severity === severity) || false;
  }
}
