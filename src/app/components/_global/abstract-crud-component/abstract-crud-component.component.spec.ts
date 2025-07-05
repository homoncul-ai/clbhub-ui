import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { HcclContextService } from '../../../shell/services/hccl-context.service';
import { EntityWrapper } from '../../../models/crud-entity-wrapper';
import { CRUD_MODES } from '../../../@core/constants';

import { AbstractCrudComponentComponent } from './abstract-crud-component.component';

// Concrete implementation for testing
@Component({
  template: '<div>Test Component</div>'
})
class TestCrudComponent extends AbstractCrudComponentComponent<EntityWrapper<any>, EntityWrapper<any>> {
  protected async loadEntityById(id: string): Promise<EntityWrapper<any>> {
    return new EntityWrapper<any>({ id });
  }

  protected async createEntityData(entity: EntityWrapper<any>): Promise<EntityWrapper<any>> {
    return entity;
  }

  protected async updateEntityData(entity: EntityWrapper<any>): Promise<EntityWrapper<any>> {
    return entity;
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    return true;
  }
}

describe('AbstractCrudComponentComponent', () => {
  let component: TestCrudComponent;
  let fixture: ComponentFixture<TestCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestCrudComponent],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: HcclService, useValue: {} },
        { provide: HcclContextService, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getModeFromName', () => {
    it('should return true for active modes', () => {
      // Test each mode
      component.switchToEditMode();
      expect(component.getModeFromName(CRUD_MODES.EDIT)).toBe(true);
      expect(component.getModeFromName('edit')).toBe(true);

      component.switchToCreateMode();
      expect(component.getModeFromName(CRUD_MODES.CREATE)).toBe(true);
      expect(component.getModeFromName('create')).toBe(true);

      component.switchToViewMode();
      expect(component.getModeFromName(CRUD_MODES.VIEW)).toBe(true);
      expect(component.getModeFromName('view')).toBe(true);

      component.switchToDetailMode();
      expect(component.getModeFromName(CRUD_MODES.DETAIL)).toBe(true);
      expect(component.getModeFromName('detail')).toBe(true);

      component.switchToDeleteMode();
      expect(component.getModeFromName(CRUD_MODES.DELETE)).toBe(true);
      expect(component.getModeFromName('delete')).toBe(true);

      component.switchToSectionMode();
      expect(component.getModeFromName(CRUD_MODES.SECTION)).toBe(true);
      expect(component.getModeFromName('section')).toBe(true);

      component.switchToHeadingMode();
      expect(component.getModeFromName(CRUD_MODES.HEADING)).toBe(true);
      expect(component.getModeFromName('heading')).toBe(true);
    });

    it('should return false for inactive modes', () => {
      component.switchToEditMode();
      expect(component.getModeFromName(CRUD_MODES.CREATE)).toBe(false);
      expect(component.getModeFromName(CRUD_MODES.VIEW)).toBe(false);
      expect(component.getModeFromName(CRUD_MODES.DETAIL)).toBe(false);
      expect(component.getModeFromName(CRUD_MODES.DELETE)).toBe(false);
      expect(component.getModeFromName(CRUD_MODES.SECTION)).toBe(false);
      expect(component.getModeFromName(CRUD_MODES.HEADING)).toBe(false);
      expect(component.getModeFromName(CRUD_MODES.FK)).toBe(false);
    });

    it('should throw error for invalid mode names', () => {
      expect(() => component.getModeFromName('invalid')).toThrowError('Invalid mode name: invalid. Valid modes are: edit, create, view, detail, delete, section, heading, fk');
      expect(() => component.getModeFromName('')).toThrowError('Invalid mode name: . Valid modes are: edit, create, view, detail, delete, section, heading, fk');
    });

    it('should work with type-safe constants', () => {
      component.switchToEditMode();
      expect(component.getModeFromName(CRUD_MODES.EDIT)).toBe(true);
      
      component.switchToCreateMode();
      expect(component.getModeFromName(CRUD_MODES.CREATE)).toBe(true);
    });
  });
});
