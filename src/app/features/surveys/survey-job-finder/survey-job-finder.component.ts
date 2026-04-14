import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { HcclService, SurveyResponsePOSTData } from '@app/restsvc/hccl.service';
import { SimpleMessageList } from '@app/restsvc/common-request-service.model';
import { SurveysPublicHeaderComponent } from '../components/surveys-public-header.component';

interface SurveyField {
  id: string;
  label: string;
}

interface HelpOption {
  id: string;
  label: string;
}

@Component({
  selector: 'app-survey-job-finder',
  standalone: true,
  imports: [CommonModule, FormsModule, SimpleMessagesSectionComponent, SurveysPublicHeaderComponent],
  templateUrl: './survey-job-finder.component.html',
  styleUrl: './survey-job-finder.component.scss',
})
export class SurveyJobFinderComponent implements OnInit {
  private readonly hcclService = inject(HcclService);
  private readonly location = inject(Location);
  readonly pageTitle = 'Non-profit job search assistance.';
  readonly surveyTitle = 'Survey: Do you have a job for me?';
  submitting = false;
  submitted = false;
  messagesList: SimpleMessageList = { messages: [] };

  model: Record<string, string> = {
    name: '',
    email: '',
    organization: '',
    currentAnswer: '',
    findJobs: '',
    currentProcess: '',
    educationGiven: '',
    timeSink: '',
    helpElaborate: '',
    anythingElse: '',
  };

  readonly surveyFields: SurveyField[] = [
    { id: 'currentAnswer', label: 'How do you currently answer this question?' },
    { id: 'findJobs', label: 'How do you find the jobs you tell your clients about?' },
    {
      id: 'currentProcess',
      label:
        'What does your current process look like (introductions, work permits, and job search support across paper, online, or apps)?',
    },
    { id: 'educationGiven', label: 'What kind of education do you give your clients around the job search?' },
    { id: 'timeSink', label: 'What part of helping clients find jobs is the most time consuming?' },
  ];

  readonly helpOptions: HelpOption[] = [
    { id: 'jobListing', label: 'Job Listing' },
    { id: 'clientCollab', label: 'Client collaboration' },
    { id: 'parentCollab', label: 'Parent collaboration' },
    { id: 'teamCollab', label: 'Internal team collaboration' },
    { id: 'orgCollab', label: 'Non-Profit, School organization collaboration' },
    { id: 'providerCollab', label: 'Job Provider collaboration' },
  ];

  selectedHelp: Record<string, boolean> = {
    jobListing: false,
    clientCollab: false,
    parentCollab: false,
    teamCollab: false,
    orgCollab: false,
    providerCollab: false,
  };
  sendInviteToClbHub = false;

  ngOnInit(): void {
    // Ensure public survey pages always start at top instead of restoring old scroll.
    setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }), 0);
  }

  submit(): void {
    this.submitting = true;
    this.messagesList = { messages: [] };

    const surveyData: Record<string, string> = { ...this.model };
    this.helpOptions.forEach((option) => {
      surveyData[`help_${option.id}`] = this.selectedHelp[option.id] ? 'true' : 'false';
    });
    surveyData['sendInviteToClbHub'] = this.sendInviteToClbHub ? 'true' : 'false';
    surveyData['surveyCode'] = 'npo_job_finder';
    surveyData['pagePath'] = '/public/surveys/npo_job_finder';

    const payload: SurveyResponsePOSTData = {
      surveyCode: 'npo_job_finder',
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
          const fallback = { message: 'Unable to submit survey response.', severity: 1 };
          this.messagesList = error?.error?.messages || { messages: [fallback] };
          this.submitted = false;
        },
      });
  }

  private resetForm(): void {
    this.model = {
      name: '',
      email: '',
      organization: '',
      currentAnswer: '',
      findJobs: '',
      currentProcess: '',
      educationGiven: '',
      timeSink: '',
      helpElaborate: '',
      anythingElse: '',
    };
    this.helpOptions.forEach((option) => {
      this.selectedHelp[option.id] = false;
    });
    this.sendInviteToClbHub = false;
  }

  goBack(): void {
    this.location.back();
  }
}
