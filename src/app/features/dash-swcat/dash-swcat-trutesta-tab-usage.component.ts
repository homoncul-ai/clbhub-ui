import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { AbstractMultimodeComponent } from '@app/components/_global';
import { UtilmonStatGraphCriteria, UtilmonStatGraphPOJO } from '@app/restsvc/hccl.service';

interface SoftwareEntry {
  id: string;
  name: string;
  description: string;
  currentUsers: number;
  growthRate: number;
  lastQuarterLogins: number;
  quarterlyData: number[];
}

@Component({
  selector: 'app-swcat-trutesta-tab-usage',
  templateUrl: './dash-swcat-trutesta-tab-usage.component.html',
  imports: [CommonModule],
  standalone: true
})
export class DashSwcatTrutestaTabUsageComponent extends AbstractMultimodeComponent<HcclUserProfileCrudWrapper> implements OnInit, AfterViewInit {
  @ViewChild('usageChart', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  softwareEntries: SoftwareEntry[] = [];
  totalUsers: number = 0;
  averageGrowth: number = 0;
  totalLogins: number = 0;
  chart: any = null;

  constructor() {
    super();
    console.log('DashSwcatTrutestaTabUsageComponent');
  }

  protected graphData: UtilmonStatGraphPOJO | null = null;
  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
   
  }

    async ngAfterViewInit(): Promise<void> {
        this.loading = true;
        var criteria = {
            topCount: 10,
          yearmoCrit: {}
        } as UtilmonStatGraphCriteria ;
        this.graphData = await this.hcclService.createTrutestaUsageGraph(criteria).toPromise() || null;
    setTimeout(() => {
        debugger;
        this.processGraphData();
        this.calculateSummaryStats();
        this.loading = false;
      this.createChart();
    }, 100);
  }

  private processGraphData(): void {
    console.log('Processing graph data:', this.graphData);
    
    if (!this.graphData || !this.graphData.data || this.graphData.data.length === 0) {
      console.log('No graph data available, using fake data');
      // Fallback to fake data if no real data available
      this.generateFakeData();
      return;
    }

    // Update quarters from service data
    if (this.graphData.quarters && this.graphData.quarters.length > 0) {
      this.quarters = this.graphData.quarters;
      console.log('Updated quarters from service:', this.quarters);
    }

    this.softwareEntries = this.graphData.data.map((item, index) => {
      const quarterlyData = item.dataPoints || [];
      console.log(`Processing item ${index}:`, item.name, 'dataPoints:', quarterlyData);
      
      const currentUsers = quarterlyData.length > 0 ? quarterlyData[quarterlyData.length - 1] : 0;
      const firstUsers = quarterlyData.length > 0 ? quarterlyData[0] : 0;
      const growthRate = firstUsers > 0 ? Math.round(((currentUsers - firstUsers) / firstUsers) * 100) : 0;
      const lastQuarterLogins = Math.floor(currentUsers * 0.8); // 80% of users login quarterly

      return {
        id: item.id || `sw-${index + 1}`,
        name: item.name || `Software ${index + 1}`,
        description: item.swWorkProduct?.description || item.catalogEntry?.description || 'Software application',
        currentUsers,
        growthRate,
        lastQuarterLogins,
        quarterlyData
      };
    });
    
  //  alert('Processed software entries:' + this.softwareEntries.length);
    console.log('Processed software entries:', this.softwareEntries);
  }

  private generateFakeData(): void {
    const softwareNames = [
      'Trutesta Analytics Platform',
      'DataFlow Management System',
      'CloudSync Enterprise',
      'SecureAuth Pro',
      'Workflow Automation Suite',
      'Business Intelligence Dashboard',
      'Customer Relationship Manager',
      'Project Management Hub',
      'Financial Reporting Tool',
      'Document Management System'
    ];

    const descriptions = [
      'Advanced analytics and reporting platform',
      'Streamlined data processing and management',
      'Enterprise cloud synchronization solution',
      'Multi-factor authentication system',
      'Automated workflow and task management',
      'Real-time business intelligence insights',
      'Comprehensive customer relationship management',
      'Collaborative project planning and tracking',
      'Financial data analysis and reporting',
      'Secure document storage and collaboration'
    ];

    this.softwareEntries = softwareNames.map((name, index) => {
      const baseUsers = Math.floor(Math.random() * 2000) + 500; // 500-2500 users
      const growthRate = Math.floor(Math.random() * 30) + 10; // 10-40% growth
      const quarterlyData = this.generateQuarterlyData(baseUsers, growthRate);
      const currentUsers = quarterlyData[quarterlyData.length - 1];
      const lastQuarterLogins = Math.floor(currentUsers * 0.8); // 80% of users login quarterly

      return {
        id: `sw-${index + 1}`,
        name,
        description: descriptions[index],
        currentUsers,
        growthRate,
        lastQuarterLogins,
        quarterlyData
      };
    });
  }

  private generateQuarterlyData(baseUsers: number, growthRate: number): number[] {
    const data: number[] = [];
    let currentUsers = baseUsers;

    for (let i = 0; i < this.quarters.length; i++) {
      data.push(Math.floor(currentUsers));
      // Add some seasonal variation and growth
      const seasonalFactor = 1 + (Math.sin(i * 0.5) * 0.1); // ±10% seasonal variation
      const growthFactor = 1 + (growthRate / 100 / 4); // Quarterly growth
      currentUsers = currentUsers * growthFactor * seasonalFactor;
    }

    return data;
  }

  private calculateSummaryStats(): void {
    this.totalUsers = this.softwareEntries.reduce((sum, entry) => sum + entry.currentUsers, 0);
    this.averageGrowth = this.softwareEntries.reduce((sum, entry) => sum + entry.growthRate, 0) / this.softwareEntries.length;
    this.totalLogins = this.softwareEntries.reduce((sum, entry) => sum + entry.lastQuarterLogins, 0);
  }
// Generate quarters
    protected quarters = [ '2023-Q3', '2023-Q4', '2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4', '2025-Q1', '2025-Q2'];
    protected quarters2 = ['2023-Q1', '2023-Q2', '2023-Q3', '2023-Q4', '2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4', '2025-Q1', '2025-Q2'];
    
  private createChart(): void {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const canvas = this.chartCanvas.nativeElement;
    
    // Set canvas size to match container
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Chart dimensions with better margins
    const margin = { top: 50, right: 250, bottom: 80, left: 100 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    
    // Find max value for scaling with some padding
    const allDataPoints = this.softwareEntries.flatMap(entry => entry.quarterlyData);
    console.log('All data points for scaling:', allDataPoints);
    
    let maxValue: number;
    if (allDataPoints.length === 0 || allDataPoints.every(val => val === 0)) {
      console.log('No valid data points found, using default max value');
      maxValue = 1000; // Default max value
    } else {
      maxValue = Math.max(...allDataPoints) * 1.1;
      console.log('Calculated max value:', maxValue);
    }

    // Colors for different software
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
    ];

    // Draw background
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, width, height);

    // Draw chart area background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(margin.left, margin.top, chartWidth, chartHeight);

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, height - margin.bottom);
    ctx.stroke();

    // X-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, height - margin.bottom);
    ctx.lineTo(width - margin.right, height - margin.bottom);
    ctx.stroke();

    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 8; i++) {
      const y = margin.top + (chartHeight / 8) * i;
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(width - margin.right, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= this.quarters.length - 1; i++) {
      const x = margin.left + (chartWidth / (this.quarters.length - 1)) * i;
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, height - margin.bottom);
      ctx.stroke();
    }

    // Draw data lines for each software
    console.log('Drawing chart for', this.softwareEntries.length, 'entries');
    this.softwareEntries.forEach((entry, entryIndex) => {
      const color = colors[entryIndex % colors.length];
      console.log(`Drawing entry ${entryIndex}: ${entry.name}, data:`, entry.quarterlyData);
      
      // Draw line
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();

      let firstPoint = true;
      entry.quarterlyData.forEach((value, quarterIndex) => {
        const x = margin.left + (chartWidth / (this.quarters.length - 1)) * quarterIndex;
        const y = height - margin.bottom - (value / maxValue) * chartHeight;
        
        console.log(`  Point ${quarterIndex}: value=${value}, x=${x}, y=${y}`);

        if (firstPoint) {
          ctx.moveTo(x, y);
          firstPoint = false;
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Draw points
      ctx.fillStyle = color;
      entry.quarterlyData.forEach((value, quarterIndex) => {
        const x = margin.left + (chartWidth / (this.quarters.length - 1)) * quarterIndex;
        const y = height - margin.bottom - (value / maxValue) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add white border to points
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    });

    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';

    // X-axis labels (rotated for better readability)
    this.quarters.forEach((quarter, index) => {
      const x = margin.left + (chartWidth / (this.quarters.length - 1)) * index;
      ctx.save();
      ctx.translate(x, height - margin.bottom + 30);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(quarter, 0, 0);
      ctx.restore();
    });

    // Y-axis labels
    ctx.textAlign = 'right';
    ctx.font = '12px Arial';
    for (let i = 0; i <= 8; i++) {
      const value = Math.floor((maxValue / 8) * (8 - i));
      const y = margin.top + (chartHeight / 8) * i + 4;
      ctx.fillText(value.toLocaleString(), margin.left - 15, y);
    }

    // Title
    ctx.textAlign = 'center';
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText('Quarterly User Growth Trends', width / 2, 30);

    // Legend
    ctx.font = '11px Arial';
    const legendX = width - margin.right + 20;
    let legendY = margin.top + 30;

    this.softwareEntries.forEach((entry, index) => {
      const color = colors[index % colors.length];
      
      // Draw legend line
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(legendX, legendY);
      ctx.lineTo(legendX + 20, legendY);
      ctx.stroke();
      
      // Draw legend point
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(legendX + 10, legendY, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // Legend text
      ctx.fillStyle = '#333';
      ctx.textAlign = 'left';
      ctx.fillText(entry.name, legendX + 30, legendY + 4);
      legendY += 20;
    });

    // Axis labels
    ctx.textAlign = 'center';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Quarters', width / 2, height - 20);
    
    ctx.save();
    ctx.translate(30, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Number of Users', 0, 0);
    ctx.restore();
  }

  protected newCrudWrapperForCreate(): HcclUserProfileCrudWrapper {
    return HcclUserProfileCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityByIdCall(id: string): Promise<HcclUserProfileCrudWrapper> {
    return HcclUserProfileCrudWrapper.newInstance(id, this.hcclService);
  }

  getDebugJson(): string {
    const debugData = {
      graphData: this.graphData,
      softwareEntries: this.softwareEntries,
      quarters: this.quarters,
      totalUsers: this.totalUsers,
      averageGrowth: this.averageGrowth,
      totalLogins: this.totalLogins
    };
    return JSON.stringify(debugData, null, 2);
  }
}
