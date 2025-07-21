import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService, CLCourseCriteria, CLCourseGETData } from '@app/restsvc/hccl.service';
declare const dhx: any;

@Component({
  selector: 'app-clcourse-list',
  templateUrl: './clcourse-list.component.html',
  styleUrls: ['./clcourse-list.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class CLCourseListComponent implements OnInit {
  @ViewChild('gridContainer', { static: true }) gridContainer!: ElementRef;
  private grid: any;

  constructor(
    private hcclService: HcclService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initGrid();
    this.loadData();
  }

  private initGrid(): void {
    this.grid = new dhx.Grid(this.gridContainer.nativeElement, {
      columns: [
        { id: 'name', header: [{ text: 'Name' }], width: 150 },
        { id: 'businessCode', header: [{ text: 'Business Code' }], width: 150 },
        { id: 'catalogCode', header: [{ text: 'Catalog Code' }], width: 150 },
        { id: 'title', header: [{ text: 'Title' }], width: 150 },
        { id: 'shortDescription', header: [{ text: 'Short Description' }], width: 200 },
        { id: 'description', header: [{ text: 'Description' }], width: 200 },
        { id: 'available', header: [{ text: 'Available' }], width: 100 },
        { id: 'schoolId', header: [{ text: 'School' }], width: 150 }
      ],
      autoWidth: true,
      resizable: true,
      selection: 'row',
      height: 600
    });
    this.grid.events.on('cellClick', (row: any) => {
      this.router.navigate(['../clcourse', row.id, 'details'], { relativeTo: this.route });
    });
  }

  private async loadData(): Promise<void> {
    try {
      const criteria: CLCourseCriteria = {};
      const results = await this.hcclService.findCLCourses(criteria).toPromise();
      this.grid.data.parse(results?.searchResults || []);
    } catch (error) {
      console.error('Error loading CLCourses:', error);
    }
  }
} 