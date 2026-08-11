import { CommonModule, KeyValuePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  DiagnosticQueryResponse,
  DiagnosticResultsPOJO,
  HcclService,
} from '@app/restsvc/hccl.service';
import { SimpleMessage } from '@app/restsvc/common-request-service.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-diagnostics',
  standalone: true,
  imports: [CommonModule, KeyValuePipe],
  templateUrl: './diagnostics.component.html',
  styleUrl: './diagnostics.component.scss',
})
export class DiagnosticsComponent implements OnInit {
  private readonly hcclService = inject(HcclService);

  loading = false;
  errorMessage: string | null = null;
  response: DiagnosticQueryResponse | null = null;
  expandedConfig: Record<string, boolean> = {};

  async ngOnInit(): Promise<void> {
    await this.runAllDiagnostics();
  }

  async runAllDiagnostics(): Promise<void> {
    this.loading = true;
    this.errorMessage = null;
    try {
      this.response = await firstValueFrom(
        this.hcclService.runDiagnostics({ diagnosticName: 'all' })
      );
      this.expandedConfig = {};
    } catch (err: unknown) {
      this.errorMessage = err instanceof Error ? err.message : 'Failed to run diagnostics.';
      this.response = null;
    } finally {
      this.loading = false;
    }
  }

  results(): DiagnosticResultsPOJO[] {
    return this.response?.results ?? [];
  }

  topLevelMessages(): SimpleMessage[] {
    return this.response?.messages?.messages ?? [];
  }

  toggleConfig(name: string): void {
    this.expandedConfig[name] = !this.expandedConfig[name];
  }

  isConfigExpanded(name: string): boolean {
    return !!this.expandedConfig[name];
  }

  statusBadgeClass(status?: number): string {
    if (status === 200) {
      return 'text-bg-success';
    }
    if (status === 412) {
      return 'text-bg-warning';
    }
    return 'text-bg-danger';
  }

  formatConfigValue(value: unknown): string {
    if (value == null) {
      return '—';
    }
    if (Array.isArray(value)) {
      return value.map((item) => String(item)).join(', ');
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  }

  errorMessages(result: DiagnosticResultsPOJO): SimpleMessage[] {
    return result.errors?.messages ?? [];
  }
}
