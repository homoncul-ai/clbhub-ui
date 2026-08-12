import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HcclService, ResumePOJO, ResumeSectionPOJO, ResumeEntryPOJO, ResumeAddEntriesPOSTData, ResumeReorderEntriesPOSTData, PersonalStatementResumeGETData, ResumeEntryGETData } from '@app/restsvc/hccl.service';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { FindResumeEntriesModalComponent } from './find-resume-entries-modal.component';
import { ViewResumeModalComponent } from './view-resume-modal.component';

@Component({
  selector: 'app-dash-citizen-resume',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MdbAccordionModule,
    DragDropModule,
    StdMdbFormTextareaComponent
  ],
  templateUrl: './dash-citizen-resume.component.html',
  styleUrls: ['./dash-citizen-resume.component.scss']
})
export class DashCitizenResumeComponent implements OnInit {
  @Input() resumeId!: string;

  protected hcclService = inject(HcclService);
  protected modalService = inject(MdbModalService);

  resume: PersonalStatementResumeGETData | null = null;
  resumePOJO: ResumePOJO | null = null;
  sections: ResumeSectionPOJO[] = [];
  isLoading = false;
  isSaving = false;
  error: any = null;

  // Track which accordion items are open
  openSections: Set<string> = new Set();

  ngOnInit(): void {
    if (this.resumeId) {
      this.loadResume();
    }
  }

  protected loadResume(): void {
    this.isLoading = true;
    this.error = null;

    this.hcclService.getResume(this.resumeId).subscribe({
      next: (resume) => {
        this.resume = resume;
        this.loadResumePOJO(resume);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading resume:', error);
        this.error = error;
        this.isLoading = false;
      }
    });
  }

  protected loadResumePOJO(resume: PersonalStatementResumeGETData): void {
    // Use theResumePojo if available, otherwise fall back to parsing resumeJson
    if (resume.theResumePojo) {
      this.resumePOJO = resume.theResumePojo;
    } else if (resume.resumeJson) {
      try {
        this.resumePOJO = JSON.parse(resume.resumeJson);
      } catch (error) {
        console.error('Error parsing resume JSON:', error);
        this.resumePOJO = { sections: [] };
      }
    } else {
      this.resumePOJO = { sections: [] };
    }

    this.sections = this.resumePOJO?.sections || [];
    // Ensure included has a default value and sort sections by sequenceOrder
    this.sections.forEach(section => {
      if (section.included === undefined) {
        section.included = true; // Default to included
      }
    });
    this.sections.sort((a, b) => (a.sequenceOrder || 0) - (b.sequenceOrder || 0));
  }

  protected isEntriesSection(section: ResumeSectionPOJO): boolean {
    return section.sectionCode === 'Entries' || section.sectionCode === 'entries';
  }

  protected getSectionTag(section: ResumeSectionPOJO): string {
    return section.sectionCode || 'Unknown';
  }

  protected toggleSection(sectionCode: string): void {
    if (this.openSections.has(sectionCode)) {
      this.openSections.delete(sectionCode);
    } else {
      this.openSections.add(sectionCode);
    }
  }

  protected isSectionOpen(sectionCode: string): boolean {
    return this.openSections.has(sectionCode);
  }

  protected onSectionDrop(event: CdkDragDrop<ResumeSectionPOJO[]>): void {
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
    // Update sequenceOrder for all sections
    this.sections.forEach((section, index) => {
      section.sequenceOrder = index + 1;
    });
  }

  protected onEntryDrop(section: ResumeSectionPOJO, event: CdkDragDrop<ResumeEntryPOJO[]>): void {
    if (!section.resumeEntries) {
      section.resumeEntries = [];
    }
    moveItemInArray(section.resumeEntries, event.previousIndex, event.currentIndex);
    // Update sequenceOrder for all entries in this section
    section.resumeEntries.forEach((entry, index) => {
      entry.sequenceOrder = index + 1;
    });
  }

  protected saveAllSections(): void {
    if (!this.resumePOJO || !this.resumeId) {
      return;
    }

    this.isSaving = true;
    this.error = null;

    // Update the resumePOJO with current sections
    this.resumePOJO.sections = this.sections;

    this.hcclService.updateResume(this.resumeId, this.resumePOJO).subscribe({
      next: (updatedResume) => {
        this.resume = updatedResume;
        this.loadResumePOJO(updatedResume);
        this.isSaving = false;
        // Show success message or notification
        console.log('Resume sections saved successfully');
      },
      error: (error) => {
        console.error('Error saving resume sections:', error);
        this.error = error;
        this.isSaving = false;
      }
    });
  }

  protected saveEntriesSection(section: ResumeSectionPOJO): void {
    if (!this.resumeId || !section.resumeEntries) {
      return;
    }

    this.isSaving = true;
    this.error = null;

    const entryIds = section.resumeEntries
      .filter(entry => entry.entityId)
      .map(entry => entry.entityId!);

    const reorderData: ResumeReorderEntriesPOSTData = {
      entryIds: entryIds
    };

    this.hcclService.reorderEntries(this.resumeId, reorderData).subscribe({
      next: (updatedResume) => {
        this.resume = updatedResume;
        this.loadResumePOJO(updatedResume);
        this.isSaving = false;
        console.log('Entries section saved successfully');
      },
      error: (error) => {
        console.error('Error saving entries section:', error);
        this.error = error;
        this.isSaving = false;
      }
    });
  }

  protected removeEntry(section: ResumeSectionPOJO, entryIndex: number): void {
    if (!section.resumeEntries) {
      return;
    }

    if (confirm('Are you sure you want to remove this entry?')) {
      section.resumeEntries.splice(entryIndex, 1);
      // Update sequenceOrder
      section.resumeEntries.forEach((entry, index) => {
        entry.sequenceOrder = index + 1;
      });
      // Save the changes
      this.saveEntriesSection(section);
    }
  }

  protected openFindEntriesModal(section: ResumeSectionPOJO): void {
    if (!this.resumeId) {
      return;
    }

    const modalRef = this.modalService.open(FindResumeEntriesModalComponent, {
      modalClass: 'modal-lg',
      backdrop: true,
      keyboard: true,
      ignoreBackdropClick: false
    });

    modalRef.component.resumeId = this.resumeId;
    
    // Get existing entry IDs from the section
    const existingEntryIds = (section.resumeEntries || [])
      .map(entry => entry.entityId)
      .filter((id): id is string => !!id);
    modalRef.component.existingEntryIds = existingEntryIds;

    modalRef.onClose.subscribe((result) => {
      if (result && result.success) {
        // Reload the resume to get updated data
        this.loadResume();
      }
    });
  }

  protected getIncludedSections(): ResumeSectionPOJO[] {
    return this.sections.filter(section => section.included !== false);
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

  protected getResumePOJOJson(): string {
    if (!this.resumePOJO) {
      return '{}';
    }
    // Update the resumePOJO with current sections before displaying
    const currentResumePOJO: ResumePOJO = {
      sections: this.sections
    };
    return JSON.stringify(currentResumePOJO, null, 2);
  }

  protected openViewResumeModal(): void {
    if (!this.resumeId) {
      return;
    }

    const modalRef = this.modalService.open(ViewResumeModalComponent, {
      modalClass: 'modal-xl',
      backdrop: true,
      keyboard: true,
      ignoreBackdropClick: false
    });

    modalRef.component.resumeId = this.resumeId;
  }
}

