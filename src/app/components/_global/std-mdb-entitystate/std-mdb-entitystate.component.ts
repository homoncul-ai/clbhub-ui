import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { HcclService, StateChangeFormResponse, StateChangeFormRequest, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import {  } from '../menu-control-data-list/menu-control-data-list.component';
import { SimpleButtonBar, SimpleButtonbarComponent } from "../simple-buttonbar/simple-buttonbar.component";
import { state } from '@angular/animations';

@Component({
  selector: 'app-std-mdb-entitystate',
  standalone: true,
  imports: [CommonModule, FormsModule, SimpleButtonbarComponent],
  templateUrl: './std-mdb-entitystate.component.html',
  styleUrl: './std-mdb-entitystate.component.scss'
})
export class StdMdbEntitystateComponent implements OnInit, OnDestroy {
  @Input() entityName: string = '';
  @Input() entityId?: string = '';
  @Input() callChangeSetupUI: boolean = true;
  @Input() currentStateCode: string = '';
  
  @Output() stateChangeResponse = new EventEmitter<StateChangeFormResponse>();
  @Output() menuItemSelected = new EventEmitter<MenuControlData>();
  
  private destroy$ = new Subject<void>();
  
  // Component state
  showingDebug: boolean = false;
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
      context: this.currentStateChangeResponse?.context || undefined,
      nextState: this.currentStateChangeResponse?.mapStateTransitions?.[menuItem.id || ''] || undefined
    };
    if (stateChangeRequest.nextState == undefined) {
      alert(JSON.stringify(stateChangeRequest));
      this.error = 'No next state found for menu item';
      return;
    }
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
          // force the parent page to refresh
          window.location.reload();
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

  getSimpleButtonBar(): SimpleButtonBar {
    // Convert the menuControlDataList to a SimpleButtonBar
    var b : SimpleButtonBar = new SimpleButtonBar();
    this.menuItems.forEach(item => {
      b.addButton(item.id || '', item.name || '', () => {this.onMenuItemSelected(item);});
    });
    return b;
  }
}