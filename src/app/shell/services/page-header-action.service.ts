import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface PageHeaderAction {
  key: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * Lets an active page register action buttons in the shell page header (e.g. Refresh Feed).
 */
@Injectable({
  providedIn: 'root'
})
export class PageHeaderActionService {
  private actionsSubject = new BehaviorSubject<PageHeaderAction[]>([]);
  private actionClickSubject = new Subject<string>();

  readonly actions$ = this.actionsSubject.asObservable();
  readonly actionClick$ = this.actionClickSubject.asObservable();

  setActions(actions: PageHeaderAction[]): void {
    this.actionsSubject.next(actions);
  }

  clearActions(): void {
    this.actionsSubject.next([]);
  }

  emitAction(key: string): void {
    this.actionClickSubject.next(key);
  }
}
