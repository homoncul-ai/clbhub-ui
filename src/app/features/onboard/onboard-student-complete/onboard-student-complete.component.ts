import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { OnboardPublicHeaderComponent } from '../components/onboard-public-header.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleMessageList } from '@app/restsvc/common-request-service.model';

@Component({
  selector: 'app-onboard-student-complete',
  standalone: true,
  imports: [CommonModule, RouterLink, OnboardPublicHeaderComponent, SimpleMessagesSectionComponent],
  templateUrl: './onboard-student-complete.component.html',
  styleUrl: './onboard-student-complete.component.scss',
})
export class OnboardStudentCompleteComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly hcclService = inject(HcclService);

  loading = false;
  requestCompleted = false;
  inviteId = '';
  messagesList: SimpleMessageList = { messages: [] };

  get hasErrorMessages(): boolean {
    return (this.messagesList.messages || []).some((msg) => Number(msg?.severity ?? 1) === 1);
  }

  get canOpenApplication(): boolean {
    return this.requestCompleted && !this.loading && !this.hasErrorMessages;
  }

  ngOnInit(): void {
    this.inviteId = String(this.route.snapshot.queryParamMap.get('inviteId') || '').trim();
    if (!this.inviteId) {
      this.messagesList = {
        messages: [{ message: 'Missing inviteId query parameter.', severity: 1 }],
      };
      this.requestCompleted = true;
      return;
    }

    this.loading = true;
    this.hcclService
      .onboardStudentFinish(this.inviteId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          const apiMessages = res?.messages?.messages || [];
          if (apiMessages.length) {
            this.messagesList = { messages: apiMessages };
            this.requestCompleted = true;
            return;
          }
          this.messagesList = {
            messages: [{ message: 'Student onboarding complete request processed.', severity: 4 }],
          };
          this.requestCompleted = true;
        },
        error: (err) => {
          const apiMessages = err?.error?.messages?.messages || [];
          this.messagesList = {
            messages: apiMessages.length
              ? apiMessages
              : [{ message: 'Unable to complete student onboarding.', severity: 1 }],
          };
          this.requestCompleted = true;
        },
      });
  }
}
