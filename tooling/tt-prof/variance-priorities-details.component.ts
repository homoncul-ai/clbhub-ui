import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { FormGroup, Validators } from '@angular/forms';
import { DeleteItemModalComponent } from '@app/@shared/modals/delete-item/delete-item.component';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { VariancePrioritiesService } from './variance-priorities.module-service';
import { LocalToUTcPipe } from '@app/@shared/pipes/local-to-utc.pipe';
import { CommonUiService } from '@app/common/common-ui.service';

@Component({
  templateUrl: './variance-priorities-details.component.html',
  styleUrls: ['./variance-priorities-details.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('true', style({ opacity: 1 })),
      state('false', style({ opacity: 0 })),
      transition('true => false', animate('0s')),
      transition('false => true', [animate('700ms')]),
    ]),
  ],
  providers: [
    LocalToUTcPipe
  ]
})
export class VariancePrioritiesDetailsComponent implements OnInit {
  variancePrioritiesForm: FormGroup;
  variancePrioritiesId: string = '';

  constructor(
    private route: ActivatedRoute,
    private ui: CommonUiService,
    private variancePrioritiesService: VariancePrioritiesService
  ) { }

  ngOnInit() { 
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.variancePriority = {};
      this.variancePrioritiesId = params.get('id');
      this.getVariancePrioritiesById();
    });

    this.variancePrioritiesForm = this.ui.getFormBuilder().group({
      id: [''],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.maxLength(1024)]],
      businessCode: ['', [Validators.required, Validators.maxLength(255)]],
      fontName: [''],
      status: [false],
    });

    this.setListUI();
    this.setTabUI();
    window.onresize = () => {
      setTimeout(() => {
        this.setListUI();
        this.setTabUI();
      }, 200);
    };
  }

  get getFormControl() {
    return this.variancePrioritiesForm.controls;
  }

  isLoading: boolean = false;
  variancePriority: any = {};
  error: any = {};
  getVariancePrioritiesById() {
    this.variancePriority = {};
    const url =
      this.ui.getAppConstants().endPoints.inspectionsEndPoint + 'admin/priorities/' + this.variancePrioritiesId;
    this.isLoading = true;
    return this.ui.getSharedService()
      .get(url, {})
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next:(data) => {
          this.error = {};
          this.variancePriority = data;
          this.originalObj = Object.assign({}, this.variancePriority);
          this.setFormValue(this.variancePriority);
        },
        error:(err) => {
          this.ui.showError(err.error?.errorMessage || 'administration_error_label');
        }
      });
  }

  UIbuilt: boolean = false;
  setListUI() {
    var uiInterval = setInterval(() => {
      if (document.getElementById('list-table')) {
        var windowHeight = window.innerHeight;
        var navHeight = document.querySelector('nav.navbar');
        var headerHeight = document.querySelector('.module-header');
        var finalHeight =
          windowHeight - navHeight.clientHeight - headerHeight.clientHeight;
        document.getElementById('list-table').style.height = finalHeight + 'px';
        document.getElementById('list-table-left-column').style.height =
          finalHeight + 'px';
        document.getElementById('list-table-left-column-middle').style.height =
          finalHeight - 82 + 'px';
        document.getElementById('mid-list').style.height =
          finalHeight - 82 + 'px';
        document.getElementById('mid-list').style.overflow = 'auto';
        this.UIbuilt = true;
        clearInterval(uiInterval);
      }
    }, 100);
  }

  setTabUI() {
    var uiInterval = setInterval(() => {
      if (
        document.getElementById('mainTabset') &&
        document.getElementById('page-title')
      ) {
        var windowHeight = window.innerHeight;
        var navHeight = document.querySelector('nav.navbar');
        var headerHeight = document.querySelector('.module-header');
        var finalHeight =
          windowHeight - navHeight.clientHeight - headerHeight.clientHeight;
        document.getElementById('detailsColumn').style.height =
          finalHeight - 41 + 'px';
        //
        var pageTitle = document.getElementById('page-title');
        //debugger
        var tabs = document.querySelector('#mainTabset ul');
        var tabHeight =
          windowHeight -
          pageTitle.clientHeight -
          navHeight.clientHeight -
          headerHeight.clientHeight -
          tabs.clientHeight;
        var mainTabset = document.getElementById('mainTabset');
        let tab: any = mainTabset.querySelectorAll('.tab-pane');
        tab.forEach((element: any) => {
          element.style.height = tabHeight - 27 + 'px';
        });
        clearInterval(uiInterval);
      }
    }, 100);
  }

  editMode: boolean = false;
  originalObj: any = {};
  modify() {
    this.editMode = true;
    this.visiblityState = 'true';
  }

  cancel() {
    this.editMode = false;
    this.visiblityState = 'false';
    this.variancePriority = Object.assign({}, this.originalObj);
    this.setFormValue(this.variancePriority);
  }

  visiblityState: string = 'true';
  setEditMode() {
    this.editMode = false;
  }

  setFormValue(data: any) {
    this.variancePrioritiesForm.reset()
    this.variancePrioritiesForm.patchValue({
      id: data.id,
      name: data.name,
      description: data.description,
      businessCode: data.businessCode,
      fontName: data.fontName,
      status: data.status
    })
    this.initIconPicker = data.fontName
  }

  selectedIcon: any = "";
  initIconPicker: string = ""
  selectIcon(icon: any) {
    this.selectedIcon = icon;
  }

  submitVariancePrioritiesForm(formData: any) {
    this.error = {};
    let obj = { ...{}, ...formData };
    delete obj.id;
    obj.name = formData.name;
    obj.description = formData.description;
    obj.businessCode = formData.businessCode;
    obj.fontName = this.selectedIcon;
   
    this.isLoading = true;
    this.ui.getSharedService()
      .put(this.ui.getAppConstants().endPoints.inspectionsEndPoint + 'admin/priorities/' + formData.id, {}, obj, true)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next:() => {
          this.error = {};
          this.ui.showSuccess(obj.name + this.ui.translateKey('administration_isUpdated_label'));
          this.variancePrioritiesService.sendData.next(formData);
          this.variancePriority = Object.assign(this.variancePriority, formData);
          this.variancePriority.fontName = obj.fontName;
          this.setEditMode();
        },
        error:(res) => {
          this.ui.showError(res.error?.errorMessage || 'administration_error_label');
        }
      });
  }

  deleteItemModalRef: MdbModalRef<DeleteItemModalComponent>;
  openDeleteItemModal() {
    this.deleteItemModalRef = this.ui.openModal(DeleteItemModalComponent, {
      containerClass: 'top',
      keyboard: false,
      ignoreBackdropClick: true,
      modalClass: 'modal-top modal-top-center',
      data: {
        data: {
          url:
            this.ui.getAppConstants().endPoints.inspectionsEndPoint +
            'admin/priorities/' +
            this.variancePriority.id,
          heading: this.ui.translateKey(
            'administration_deleteConfirmation_label'
          ),
          message: this.ui.translateKey(
            'administration_deleteConfirmation_message_label'
          ),
          name: this.variancePriority.name,
        },
      },
    });
    this.deleteItemModalRef.onClose.subscribe((res) => {
      if (res)
        this.variancePrioritiesService.refreshList.next(true)
    });
  }
}
