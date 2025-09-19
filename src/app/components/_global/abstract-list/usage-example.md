# Abstract List Component Usage Example

## External Button Control with CSV Selection

The updated `AbstractListComponent` now supports external button control and CSV-based selection management. Here's how to use it:

### Basic Usage with External Control

```html
<!-- Parent component template -->
<div>
  <!-- External buttons -->
  <div class="external-controls">
    <button (click)="onProcessSelected()" [disabled]="selectedIds.length === 0">
      Process Selected ({{ selectedIds.length }})
    </button>
    <button (click)="onClearSelection()">Clear Selection</button>
    <button (click)="onSelectAll()">Select All</button>
  </div>

  <!-- Abstract list component with external control -->
  <app-abstract-list
    [showingIdCheckbox]="true"
    [hideInternalButtons]="true"
    [selectedIdsCsv]="selectedIdsCsv"
    (selectedIdsChanged)="onSelectedIdsChanged($event)"
    [criteria]="searchCriteria"
    [showingSearch]="true"
    [showingGoButton]="false"
    [showingAddButton]="false">
  </app-abstract-list>
</div>
```

### Parent Component Implementation

```typescript
export class ParentComponent {
  selectedIds: string[] = [];
  selectedIdsCsv: string = '';
  searchCriteria: YourCriteria = new YourCriteria();

  onSelectedIdsChanged(ids: string[]): void {
    this.selectedIds = ids;
    this.selectedIdsCsv = ids.join(',');
    console.log('Selected IDs changed:', ids);
  }

  onProcessSelected(): void {
    if (this.selectedIds.length === 0) {
      alert('Please select at least one item');
      return;
    }
    
    console.log('Processing selected IDs:', this.selectedIds);
    // Your processing logic here
  }

  onClearSelection(): void {
    this.selectedIds = [];
    this.selectedIdsCsv = '';
    // The component will automatically update checkboxes
  }

  onSelectAll(): void {
    // Get all IDs from the grid (you'll need to implement this)
    const allIds = this.getAllEntityIds();
    this.selectedIds = allIds;
    this.selectedIdsCsv = allIds.join(',');
  }

  private getAllEntityIds(): string[] {
    // Implementation depends on your specific use case
    // This might involve calling the service or accessing grid data
    return [];
  }
}
```

### Key Features

1. **External CSV Control**: Use `selectedIdsCsv` input to control which checkboxes are selected
2. **Event Emission**: `selectedIdsChanged` event fires when checkboxes are clicked
3. **Hidden Internal Buttons**: Set `hideInternalButtons="true"` to hide Go and Add buttons
4. **Public Methods**: Access `getSelectedIdsAsCsv()` and `updateSelectedIdsFromCsv()` methods

### Available Input Properties

- `selectedIdsCsv: string` - CSV string of selected IDs
- `hideInternalButtons: boolean` - Hide internal Go/Add buttons for external control
- `showingIdCheckbox: boolean` - Show/hide checkbox column
- All existing properties remain the same

### Available Output Events

- `selectedIdsChanged: EventEmitter<string[]>` - Emitted when selection changes

### Public Methods

- `getSelectedIdsAsCsv(): string` - Get currently selected IDs as CSV
- `updateSelectedIdsFromCsv(csvString: string): void` - Update selection from CSV
- `getSelectedEntityIds(): string[]` - Get selected IDs as array
- `getCheckedRows(): any[]` - Get full row data for selected items
