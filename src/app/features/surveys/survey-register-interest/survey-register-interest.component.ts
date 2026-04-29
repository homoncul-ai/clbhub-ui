import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { HcclService, SurveyResponsePOSTData } from '@app/restsvc/hccl.service';
import { SimpleMessageList } from '@app/restsvc/common-request-service.model';
import { SurveysPublicHeaderComponent } from '../components/surveys-public-header.component';

@Component({
  selector: 'app-survey-register-interest',
  standalone: true,
  imports: [CommonModule, FormsModule, SimpleMessagesSectionComponent, SurveysPublicHeaderComponent],
  templateUrl: './survey-register-interest.component.html',
  styleUrl: './survey-register-interest.component.scss',
})
export class SurveyRegisterInterestComponent implements OnInit {
  private readonly hcclService = inject(HcclService);
  private readonly location = inject(Location);

  readonly pageTitle = 'Register your interest';
  readonly surveyTitle = 'Survey: Register Interest';

  submitting = false;
  submitted = false;
  messagesList: SimpleMessageList = { messages: [] };

  model: Record<string, string> = {
    email: '',
    comments: '',
  };

  interestedInProgress = false;

  ngOnInit(): void {
    setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }), 0);
  }

  submit(): void {
    if (!this.model['email']?.trim()) {
      this.messagesList = { messages: [{ message: 'Please enter your email address.', severity: 1 }] };
      return;
    }

    this.submitting = true;
    this.messagesList = { messages: [] };

    const surveyData: Record<string, string> = {
      ...this.model,
      interestedInProgress: this.interestedInProgress ? 'true' : 'false',
      surveyCode: 'register_interest',
      pagePath: '/public/surveys/register-interest',
    };

    const payload: SurveyResponsePOSTData = {
      surveyCode: 'register_interest',
      subject: this.surveyTitle,
      emailFrom: this.model['email'] || '',
      mapJsonData: surveyData,
    };

    this.hcclService
      .saveSurveyResponse(payload)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (response) => {
          this.messagesList = response?.messages || { messages: [] };
          this.submitted = true;
          this.resetForm();
        },
        error: (error) => {
          const fallback = { message: 'Unable to submit. Please try again later.', severity: 1 };
          this.messagesList = error?.error?.messages || { messages: [fallback] };
          this.submitted = false;
        },
      });
  }

  private resetForm(): void {
    this.model = { email: '', comments: '' };
    this.interestedInProgress = false;
  }

  goBack(): void {
    this.location.back();
  }
}
