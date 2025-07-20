import { Component, HostListener, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { SharedService } from '@app/@shared/shared.service';
import { AppConstants } from '@app/config.service';
import { ExceptionHandlingService } from '@app/@shared/exception-handling.service';
import { ToastService } from '@app/@shared/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
declare var dhtmlx : any;

@Component({
  selector: 'add-variance-priority-modal',
  templateUrl: './add-variance-priority.component.html',
  styleUrls: ['./add-variance-priority.component.scss'],
})

export class AddVariancePriorityModal implements OnInit {

  constructor(
    public modalRef: MdbModalRef<AddVariancePriorityModal>,
    private formBuilder: FormBuilder,
    private appConstants: AppConstants,
    private service: SharedService,
    private errorService: ExceptionHandlingService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {
    this.addVariancePriorityForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.maxLength(1024)]],
      businessCode: ['', [Validators.required, Validators.maxLength(255)]],
      status: [false],
    });
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.key === 'Escape')
    this.checkIsModalDirty();
  }

  addVariancePriorityForm: FormGroup;
  get getFormControl() {
    return this.addVariancePriorityForm.controls;
  }

  ngOnInit(): void {
    this.addVariancePriorityForm.reset();
    this.addVariancePriorityForm.patchValue({
      status: true,
    });
  }

  closeModal(isRefresh: boolean) {
    this.modalRef.close(isRefresh);
  }

  error: any = {};
  addVariancePriorityLoader: boolean = false;
  SubmitVariancePriority(formData: any): void {
    this.error = {};
    let obj = { ...{}, ...formData }
    obj.fontName = this.selectedIcon;
    this.addVariancePriorityLoader = true;
    this.service.post(this.appConstants.endPoints.inspectionsEndPoint + "admin/priorities", {}, obj, true)
      .pipe(finalize(() => {
        this.addVariancePriorityLoader = false;
      }))
      .subscribe({
        next:() => {
        this.closeModal(true)
        this.toastService.success(`${obj.name} ${this.translate.instant('administration_isAdded_label')}`);
        this.clearError();
      }, error:(res) => {
        this.errorService.errorHandling(res).then(res => {
          this.error = res;
        });
      }})
  }

  clearError() {
    this.error = {};
  };

  selectedIcon: any = "";
  selectIcon(icon:any) {
    this.selectedIcon = icon
  }
  initIconPicker: string = ""

  checkIsModalDirty(){
    if (this.addVariancePriorityForm.dirty) {
      dhtmlx.confirm({
        type:"myCss",
        text: this.translate.instant('administration_youHaveUnsavedChanges_label'),
        ok: this.translate.instant('admin_yes_label'),
        cancel: this.translate.instant('admin_no_label'),
        callback: (res:any) => {
          if (res)
            this.closeModal(false);
        }
      });
    }
    else {
      this.closeModal(false);
    }
  }

}
