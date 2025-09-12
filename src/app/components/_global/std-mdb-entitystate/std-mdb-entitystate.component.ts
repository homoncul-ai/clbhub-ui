import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { HcclService, StateChangeFormResponse, StateChangeFormRequest, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-std-mdb-entitystate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './std-mdb-entitystate.component.html',
  styleUrl: './std-mdb-entitystate.component.scss'
})
export class StdMdbEntitystateComponent implements OnInit, OnDestroy {
  @Input() entityName: string = '';
  @Input() entityId?: string = '';
  @Input() callChangeSetupUI: boolean = true;
  
  @Output() stateChangeResponse = new EventEmitter<StateChangeFormResponse>();
  @Output() menuItemSelected = new EventEmitter<MenuControlData>();
  
  private destroy$ = new Subject<void>();
  
  // Component state
  isLoading: boolean = false;
  error: string | null = null;
  currentStateChangeResponse: StateChangeFormResponse | null = null;
  menuControlDataList: MenuControlDataList | null = null;
  
  constructor(private hcclService: HcclService) {}
  
  ngOnInit(): void {
    if (this.callChangeSetupUI && this.entityName && this.entityId) {
      this.loadStateChangeSetup();
    }
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  /**
   * Load state change setup UI data
   */
  loadStateChangeSetup(): void {
    if (!this.entityName || !this.entityId) {
      this.error = 'Entity name and ID are required';
      return;
    }
    
    this.isLoading = true;
    this.error = null;
    
    this.hcclService.callStateChangeUISetup(this.entityName, this.entityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: StateChangeFormResponse) => {
          this.currentStateChangeResponse = response;
          this.menuControlDataList = response.nextStatesMenu || null;
          this.isLoading = false;
          this.stateChangeResponse.emit(response);
        },
        error: (error: any) => {
          this.error = error?.message || 'Failed to load state change setup';
          this.isLoading = false;
          console.error('Error loading state change setup:', error);
        }
      });
  }
  
  /**
   * Handle menu item selection
   */
  onMenuItemSelected(menuItem: MenuControlData): void {
    if (!menuItem || !this.currentStateChangeResponse) {
      return;
    }
    
    this.menuItemSelected.emit(menuItem);
    
    // Create state change request
    const stateChangeRequest: StateChangeFormRequest = {
      op: 'changeState',
      context: {
        entityType: this.entityName,
        entityId: this.entityId || ''
      },
      nextState: {
        stateTransitionId: menuItem.id,
        stateTo: {
          name: menuItem.name
        }
      }
    };
    
    // Call state change go
    this.callStateChangeGo(stateChangeRequest);
  }
  
  /**
   * Call state change go with the provided request
   */
  private callStateChangeGo(request: StateChangeFormRequest): void {
    this.isLoading = true;
    this.error = null;
    
    this.hcclService.callStateChangeGo(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: StateChangeFormResponse) => {
          this.currentStateChangeResponse = response;
          this.menuControlDataList = response.nextStatesMenu || null;
          this.isLoading = false;
          this.stateChangeResponse.emit(response);
        },
        error: (error: any) => {
          this.error = error?.message || 'Failed to change state';
          this.isLoading = false;
          console.error('Error changing state:', error);
        }
      });
  }
  
  /**
   * Get menu items for display
   */
  get menuItems(): MenuControlData[] {
    return this.menuControlDataList?.menuItems || [];
  }
  
  /**
   * Check if component has menu items
   */
  get hasMenuItems(): boolean {
    return this.menuItems.length > 0;
  }
  
  /**
   * Refresh the state change setup
   */
  refresh(): void {
    this.loadStateChangeSetup();
  }
}