import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HcclService, ResumeEntryGETData, ResumeEntryPOJO } from '@app/restsvc/hccl.service';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';

@Component({
  selector: 'app-student-personalstatement-resumeentry-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StdMdbFormTextComponent,
    StdMdbFormTextareaComponent,
    DategetdataDisplayComponent
  ],
  templateUrl: './student-personalstatement-resumeentry-details.component.html',
  styleUrls: ['./student-personalstatement-resumeentry-details.component.scss']
})
export class StudentPersonalStatementResumeEntryDetailsComponent implements OnInit {
  @Input() resumeEntryId!: string;

  protected hcclService = inject(HcclService);

  resumeEntry: ResumeEntryGETData | null = null;
  resumeEntryPOJO: ResumeEntryPOJO | null = null;
  isLoading = false;
  error: any = null;

  ngOnInit(): void {
    if (this.resumeEntryId) {
      this.loadResumeEntry();
    }
  }

  protected loadResumeEntry(): void {
    this.isLoading = true;
    this.error = null;

    this.hcclService.getResumeEntryById(this.resumeEntryId).subscribe({
      next: (resumeEntry) => {
        this.resumeEntry = resumeEntry;
        this.loadResumeEntryPOJO(resumeEntry);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading resume entry:', error);
        this.error = error;
        this.isLoading = false;
      }
    });
  }

  protected loadResumeEntryPOJO(resumeEntry: ResumeEntryGETData): void {
    // Use theResumeEntryPojo if available, otherwise fall back to parsing entryJson
    if (resumeEntry.theResumeEntryPojo) {
      this.resumeEntryPOJO = resumeEntry.theResumeEntryPojo;
    } else if (resumeEntry.entryJson) {
      try {
        this.resumeEntryPOJO = JSON.parse(resumeEntry.entryJson);
      } catch (error) {
        console.error('Error parsing entry JSON:', error);
        this.resumeEntryPOJO = null;
      }
    } else {
      this.resumeEntryPOJO = null;
    }
  }

  protected formatDate(dateString?: string): string {
    if (!dateString) {
      return '';
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original string if invalid date
      }
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
      return dateString; // Return original string if parsing fails
    }
  }

  protected getOrganizationName(): string {
    return this.resumeEntryPOJO?.organizationName || '';
  }

  protected getPosition(): string {
    return this.resumeEntryPOJO?.position || '';
  }

  protected getDateStart(): string {
    return this.formatDate(this.resumeEntryPOJO?.dateStart);
  }

  protected getDateEnd(): string {
    return this.formatDate(this.resumeEntryPOJO?.dateEnd);
  }

  protected getDescription(): string {
    return this.resumeEntryPOJO?.description || '';
  }

  protected getResumeText(): string {
    return this.resumeEntryPOJO?.resumeText || '';
  }
}

