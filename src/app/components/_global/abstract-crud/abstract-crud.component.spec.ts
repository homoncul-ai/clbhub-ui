import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { HcclContextService } from '../../../shell/services/hccl-context.service';
import { EntityWrapper } from '../../../models/crud-entity-wrapper';
import { CRUD_MODES } from '../../../@core/constants';

import { AbstractCrudComponent } from './abstract-crud.component';

// Concrete EntityWrapper for testing
class TestEntityWrapper extends EntityWrapper<any> {
  getDisplayText(): string {
    return this.data.id || 'Test Entity';
  }
}

// Concrete implementation for testing
@Component({
  template: '<div>Test Component</div>'
})
class TestCrudComponent extends AbstractCrudComponent<EntityWrapper<any>, EntityWrapper<any>> {
  protected async loadEntityById(id: string): Promise<EntityWrapper<any>> {
    return new TestEntityWrapper({ id });
  }

  protected async createEntityData(entity: EntityWrapper<any>): Promise<EntityWrapper<any>> {
    return new TestEntityWrapper(entity.getData());
  }

  protected async updateEntityData(entity: EntityWrapper<any>): Promise<EntityWrapper<any>> {
    return new TestEntityWrapper(entity.getData());
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    return true;
  }
}

describe('AbstractCrudComponent', () => {
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

  describe('Mode Management', () => {
    it('should get supported modes', () => {
      const supportedModes = component.getSupportedModes();
      expect(supportedModes).toContain(CRUD_MODES.EDIT);
      expect(supportedModes).toContain(CRUD_MODES.CREATE);
      expect(supportedModes).toContain(CRUD_MODES.VIEW);
      expect(supportedModes).toContain(CRUD_MODES.DETAIL);
      expect(supportedModes).toContain(CRUD_MODES.DELETE);
      expect(supportedModes).toContain(CRUD_MODES.SECTION);
      expect(supportedModes).toContain(CRUD_MODES.HEADING);
      expect(supportedModes).toContain(CRUD_MODES.FK);
    });

    it('should check if mode is supported', () => {
      expect(component.isModeSupported(CRUD_MODES.EDIT)).toBe(true);
      expect(component.isModeSupported(CRUD_MODES.CREATE)).toBe(true);
      expect(component.isModeSupported(CRUD_MODES.VIEW)).toBe(true);
      expect(component.isModeSupported(CRUD_MODES.DETAIL)).toBe(true);
      expect(component.isModeSupported(CRUD_MODES.DELETE)).toBe(true);
      expect(component.isModeSupported(CRUD_MODES.SECTION)).toBe(true);
      expect(component.isModeSupported(CRUD_MODES.HEADING)).toBe(true);
      expect(component.isModeSupported(CRUD_MODES.FK)).toBe(true);
      expect(component.isModeSupported('invalid')).toBe(false);
    });

    it('should get and set current mode', () => {
      expect(component.getMode()).toBeNull();
      
      component.setMode(CRUD_MODES.EDIT);
      expect(component.getMode()).toBe(CRUD_MODES.EDIT);
      
      component.setMode(CRUD_MODES.CREATE);
      expect(component.getMode()).toBe(CRUD_MODES.CREATE);
    });

    it('should set mode from name', () => {
      component.setModeFromName(CRUD_MODES.EDIT);
      expect(component.getMode()).toBe(CRUD_MODES.EDIT);
      
      component.setModeFromName('create');
      expect(component.getMode()).toBe(CRUD_MODES.CREATE);
    });

    it('should throw error for unsupported modes', () => {
      expect(() => component.setModeFromName('invalid')).toThrowError('Mode \'invalid\' is not supported. Supported modes are: edit, create, view, detail, delete, section, heading, fk');
      expect(() => component.setMode('invalid' as any)).toThrowError('Mode \'invalid\' is not supported. Supported modes are: edit, create, view, detail, delete, section, heading, fk');
    });

    it('should get mode from name (backward compatibility)', () => {
      component.setMode(CRUD_MODES.EDIT);
      expect(component.getModeFromName(CRUD_MODES.EDIT)).toBe(true);
      expect(component.getModeFromName('edit')).toBe(true);
      expect(component.getModeFromName(CRUD_MODES.CREATE)).toBe(false);
      
      component.setMode(CRUD_MODES.CREATE);
      expect(component.getModeFromName(CRUD_MODES.CREATE)).toBe(true);
      expect(component.getModeFromName('create')).toBe(true);
      expect(component.getModeFromName(CRUD_MODES.EDIT)).toBe(false);
    });
  });

});
