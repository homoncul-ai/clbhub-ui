import {Component, EventEmitter,Input,OnChanges,OnInit,Output,SimpleChanges,} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import {MdbModalRef} from 'mdb-angular-ui-kit/modal';
import { AddVariancePriorityModal } from './modals/add-item/add-variance-priority.component';
import { Subscription } from 'rxjs';
import { VariancePrioritiesService } from './variance-priorities.module-service';
import { CommonUiService } from '@app/common/common-ui.service';

@Component({
  selector: 'app-variance-priorities-list',
  templateUrl: './variance-priorities-list.component.html',
  styleUrls: ['./variance-priorities-list.component.scss'],
})
export class VariancePrioritiesListComponent implements OnInit, OnChanges {
  @Output() selectedListItem = new EventEmitter<any>();
  @Output() outputPageInfo = new EventEmitter<any>();
  variancePrioritiesLoading: boolean = false;
  @Input() quickSearch: any = {};
  @Input() advancedSearch: any = {};
  @Input() navSelectedItem: any = {};

  pageInfo: any = {
    id: 'custom-variance-priorities-pagination',
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
    disablePagination: false,
    startingOffset: 0,
    endingOffset: 0,
    totalPages: 0,
  };

  searchObj: any = {};
  refreshSubscription: Subscription;
  updateSubscription: Subscription;

  constructor(
    private ui: CommonUiService,
    private route: ActivatedRoute,
    private router: Router,
    private variancePriorityService: VariancePrioritiesService
  ) {
    this.refreshSubscription = this.variancePriorityService.refreshList.subscribe((obj: any) => {
      this.clearPage();
      this.variancePriorities = [];
      this.getVariancePriorities();
    });

    this.updateSubscription = this.variancePriorityService.sendData.subscribe((obj: any) => {
      this.updateList(obj);
    });
  }

  ngOnDestroy() {
    if(this.refreshSubscription)
    this.refreshSubscription.unsubscribe();
    if(this.updateSubscription)
    this.updateSubscription.unsubscribe();
  }

  async ngOnInit() {
    if (
      this.route.firstChild &&
      this.route.firstChild.snapshot &&
      this.route.firstChild.snapshot.params
    ) {
      let id = this.route.firstChild.snapshot.params['id'];
      this.getVariancePriorities(id);
    }
    this.setListUI();
    window.onresize = () => {
      setTimeout(() => { this.setListUI() }, 200);
    }
    let listInterval = setInterval(() => {
      if (this.UIbuilt == true) {
        this.variancePriorities = [];
        this.getVariancePriorities();
        clearInterval(listInterval);
      }
    }, 100)
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes.quickSearch && changes.quickSearch.currentValue) {
      if (changes.quickSearch.currentValue.hasOwnProperty('name')) {
        this.searchObj = { name: changes.quickSearch.currentValue.name }
        this.advancedSearch = {}
        this.clearPage();
        this.getVariancePriorities();
      }
    }
    if (changes.navSelectedItem && changes.navSelectedItem.currentValue) {
      const navSelectedItem = {
        ...{},
        ...changes.navSelectedItem.currentValue,
      };
      if (navSelectedItem && navSelectedItem.id) this.onSelect(navSelectedItem);
    }
  }

  UIbuilt: boolean = false;
  selectedItem: any = {};
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

  variancePriorities: any[];
  getVariancePriorities(ids?: any) {
    this.variancePrioritiesLoading = true;
    let url = this.ui.getAppConstants().endPoints.inspectionsEndPoint + 'admin/query-priorities'
    let params = {};

    params['pageNumber'] = this.pageInfo.currentPage;
    params['pageSize'] = this.pageInfo.itemsPerPage;
    params['isPaging'] = true;

    if (this.searchObj && this.searchObj.name)
      params['name'] = this.searchObj.name;

    if (ids && ids.length)
      params['ids'] = [ids];

    this.variancePriorities = [];

    this.ui.getSharedService()
      .post(url, {}, params)
      .pipe(
        finalize(() => {
          this.variancePrioritiesLoading = false;
        })
      )
      .subscribe({
        next:(resResult) => {
          this.variancePriorities = resResult && resResult.searchResults ? resResult.searchResults : [];
          if (resResult && resResult.pagingInfo && typeof resResult.pagingInfo == "object") {
            this.pageInfo.totalItems = resResult.pagingInfo.totalRows;
            this.pageInfo.startingOffset = resResult.pagingInfo.startingOffset;
            this.pageInfo.endingOffset = resResult.pagingInfo.endingOffset;
            this.pageInfo.totalPages = resResult.pagingInfo.totalPages;
            this.pageInfo.disablePagination = false;
            this.outputPageInfo.emit({
              variancePriorities: this.variancePriorities,
              pagingInfo: this.pageInfo,
            });
          } else {
            this.clearPaging();
            this.pageInfo.totalItems = this.variancePriorities.length;
            this.outputPageInfo.emit({
              pagingInfo: this.pageInfo,
              variancePriorities: this.variancePriorities,
            });
          }
          if (this.variancePriorities.length) {
            const firstItem = this.variancePriorities[0];
            this.selectedItem = firstItem;
            this.selectedListItem.emit(firstItem);
            this.router.navigate([firstItem.id], { relativeTo: this.route });
          } else {
            this.selectedListItem.emit(null);
            this.clearPage();
            this.variancePriorities = [];
            this.router.navigate(['/variance-priorities']);
          }
        },
        error:(res) => {
          this.ui.showError(res.error?.errorMessage || 'administration_error_label');
        }
      });
  }

  clearPaging() {
    this.pageInfo.totalItems = 0;
    this.pageInfo.startingOffset = 0;
    this.pageInfo.endingOffset = 0;
    this.pageInfo.totalPages = 0;
    this.pageInfo.disablePagination = true;
  }

  updateList(obj: any) {
    this.variancePriorities.some((element) => {
      if (element.id == obj.id) {
        element.name = obj.name;
        element.description = obj.description;
        element.status = obj.status;
      }
      return element.id == obj.id;
    });
  }

  paginationChange(event: any) {
    this.pageInfo.currentPage = event;
    this.pageInfo.disablePagination = true;
    this.pageInfo.totalItems = 0;
    this.variancePriorities = [];
    this.getVariancePriorities();
  }

  selectPageSize(page: number) {
    this.clearPage();
    this.pageInfo.itemsPerPage = page;
    this.pageInfo.disablePagination = true;
    this.pageInfo.totalItems = 0;
    this.variancePriorities = [];
    this.getVariancePriorities();
  }

  clearPage() {
    this.variancePriorities = [];
    this.pageInfo.disablePagination = true;
    this.pageInfo.currentPage = 1;
  }

  onSelect(obj: any) {
    this.selectedItem = obj;
    this.selectedListItem.emit(obj);
    this.router.navigate([obj.id], { relativeTo: this.route });
  }

  error: any = {};
  searchValue: any = { name: '' };
  addItemModalRef: MdbModalRef<AddVariancePriorityModal>;
  openAddItemModal() {
    this.addItemModalRef = this.ui.openModal(AddVariancePriorityModal, {
      containerClass: 'left',
      keyboard: false,
      ignoreBackdropClick:true,
      modalClass: 'modal-top modal-top-center',
      data: {
        data: {
          url:
            this.ui.getAppConstants().endPoints.inspectionsEndPoint +
            'admin/order-categories',
        },
      },
    });
    this.addItemModalRef.onClose.subscribe((res) => {
      if (res) this.getVariancePriorities();
    });
  }
}
