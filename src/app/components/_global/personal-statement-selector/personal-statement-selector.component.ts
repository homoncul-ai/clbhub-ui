import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclService, PersonalStatementGETData, PersonalStatementCriteria } from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';

@Component({
  selector: 'app-personal-statement-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personal-statement-selector.component.html',
  styleUrls: ['./personal-statement-selector.component.scss']
})
export class PersonalStatementSelectorComponent implements OnInit {
  @Input() label: string = 'Select Personal Statement:';
  @Input() autoSelectFirst: boolean = true;
  
  @Output() selectionChange = new EventEmitter<PersonalStatementGETData | null>();

  personalStatements: PersonalStatementGETData[] = [];
  selectedPersonalStatement: PersonalStatementGETData | null = null;
  isLoading: boolean = false;

  constructor(
    private hcclService: HcclService,
    private hcclContextService: HcclContextService
  ) {}

  ngOnInit(): void {
    this.loadPersonalStatements();
  }

  loadPersonalStatements(): void {
    const userProfileId = this.hcclContextService.getCurrentUserProfileId();
    if (!userProfileId) {
      console.warn('User profile ID not available - waiting for context');
      this.hcclContextService.waitForReady().then(() => {
        this.loadPersonalStatements();
      });
      return;
    }

    this.isLoading = true;
    const criteria: PersonalStatementCriteria = {
      parentEntityId: userProfileId,
      isPaging: false
    };

    this.hcclService.findPersonalStatements(criteria).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.searchResults) {
          this.personalStatements = response.searchResults;
          // Auto-select first personal statement if enabled and available
          if (this.autoSelectFirst && this.personalStatements.length > 0) {
            this.selectPersonalStatement(this.personalStatements[0]);
          }
        }
      },
      error: (error) => {
        console.error('Error loading personal statements:', error);
        this.isLoading = false;
      }
    });
  }

  selectPersonalStatement(ps: PersonalStatementGETData): void {
    this.selectedPersonalStatement = ps;
    this.selectionChange.emit(ps);
  }

  getSelectedPersonalStatement(): PersonalStatementGETData | null {
    return this.selectedPersonalStatement;
  }

  hasSelection(): boolean {
    return this.selectedPersonalStatement !== null;
  }
}
