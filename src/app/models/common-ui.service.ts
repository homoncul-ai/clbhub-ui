import { inject, Injectable } from '@angular/core';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
//import { ToastService } from '@app/@shared/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
//import { ExceptionHandlingService } from '@app/@shared/exception-handling.service';
//import { AppConstants } from '@app/config.service';
//import { SharedService } from '@app/@shared/shared.service';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ParamMap } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonUiService {
  constructor(
    //private toast: ToastService,
    private translate: TranslateService,
    //private errorHandler: ExceptionHandlingService,
    //private appConstants: AppConstants,
    //private sharedService: SharedService,
    private formBuilder: FormBuilder
  ) {}
  protected modalService: MdbModalService = inject(MdbModalService);

  /**
   * Gets the current route parameters
   * @returns Observable of route parameters
   * @deprecated Use ActivatedRoute directly in components instead
   */
  getRouteParams(): Observable<ParamMap> {
    console.warn('getRouteParams is deprecated. Use ActivatedRoute directly in components instead.');
    return of({
      has: () => false,
      get: () => null,
      getAll: () => [],
      keys: []
    });
  }

  /**
   * Gets the current route query parameters
   * @returns Observable of query parameters
   * @deprecated Use ActivatedRoute directly in components instead
   */
  getQueryParams(): Observable<ParamMap> {
    console.warn('getQueryParams is deprecated. Use ActivatedRoute directly in components instead.');
    return of({
      has: () => false,
      get: () => null,
      getAll: () => [],
      keys: []
    });
  }

  // /**
  //  * Gets the application constants
  //  * @returns AppConstants instance
  //  */
  // getAppConstants() {
  //   return this.appConstants;
  // }

  // /**
  //  * Gets the shared service instance
  //  * @returns SharedService instance
  //  */
  // getSharedService() {
  //   return this.sharedService;
  // }

  /**
   * Gets the form builder instance
   * @returns FormBuilder instance
   */
  getFormBuilder() {
    return this.formBuilder;
  }

  // /**
  //  * Shows an error message using both toast and error handler
  //  * @param msg Translation key for the error message
  //  */
  // showError(msg: string): void {
  //   const text = this.translate.instant(msg);
  //   this.errorHandler.errorHandling({ error: { errorMessage: text } });
  //   this.toast.error(text);
  // }

  // /**
  //  * Shows a success message using toast
  //  * @param msg Translation key for the success message
  //  */
  // showSuccess(msg: string): void {
  //   const text = this.translate.instant(msg);
  //   this.toast.success(text);
  // }

  // /**
  //  * Shows a warning message using toast
  //  * @param msg Translation key for the warning message
  //  */
  // showWarning(msg: string): void {
  //   const text = this.translate.instant(msg);
  //   this.toast.warning(text);
  // }

  // /**
  //  * Shows an info message using toast
  //  * @param msg Translation key for the info message
  //  */
  // showInfo(msg: string): void {
  //   const text = this.translate.instant(msg);
  //   this.toast.info(text);
  // }

  /**
   * Opens a modal with the specified component
   * @param component Component to be displayed in the modal
   * @param config Optional modal configuration
   * @returns Modal reference
   */
  openModal(component: any, config?: any) {
    return this.modalService.open(component, config);
  }

  /**
   * Shows a confirmation dialog
   * @param title Translation key for the dialog title
   * @param message Translation key for the dialog message
   * @returns Promise that resolves to true if confirmed, false if cancelled
   */
  async showConfirmation(title: string, message: string): Promise<boolean> {
    // TODO: Implement confirmation dialog using modal service
    // This is a placeholder for the actual implementation
    return new Promise((resolve) => {
      // Implementation would go here
      resolve(false);
    });
  }

  /**
   * Translates a key using the translation service
   * @param key Translation key
   * @returns Translated string
   */
  translateKey(key: string): string {
    return this.translate.instant(key);
  }
} 