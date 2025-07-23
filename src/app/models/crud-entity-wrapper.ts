import { DateGETData } from '@app/restsvc/common-request-service.model';
import {  HcclService, MenuControlData, MenuControlDataList } from '@app/restsvc/hccl.service';
import { MenuItem } from '@app/shell/services/menu.service';

/**
 * Take an interface and wrap it, so we have 2 properties, 
 * getId() - gets the id from the interface (which is the id property)
 * and getDisplayText() - gets the display text from the interface (which may need to be calculated)
 * for exmpale, if we initialize this with ExperienceLocationGETData
 * we would have a wrapper that looks like this:
 * {
 *  getId() : function, // returns the id from the interface
 *  getDisplayText() : function, abstract method that needs to be implemented by the subclass
 *  data : ExperienceLocationGETData
 * }
*/
export abstract class EntityWrapper<T extends { id?: string }> {
  
    protected data: T;
    protected hcclService?: HcclService;

    constructor(data: T, hcclService?: HcclService) {
        this.data = data;
        this.hcclService = hcclService;
    }

    /**
     * Get the HcclService instance
     * @returns HcclService instance or null if not available
     */
    protected getHcclService(): HcclService | null {
        return this.hcclService || null;
    }

    /**
     * Gets the id from the wrapped entity
     * @returns The id of the entity
     */
    getId(): string | undefined {
        return this.data.id;
    }

    /**
     * Abstract method that needs to be implemented by subclasses
     * to provide display text for the entity
     * @returns The display text for the entity
     */
    abstract getDisplayText(entity?: T): string;

    /**
     * Gets the wrapped data
     * @returns The original entity data
     */
    getData(): T {
        return this.data;
    }

    getMenuControlData(entity?: T, idSelected?: string): MenuControlData {
        return {
            id: this.getId(),
            name: this.getDisplayText(entity),
            active: true,
            selected: this.getId() === idSelected,
            allowedByRole: true,
            allowedByRule: true,
        };
    }

    getMenuControlDataList(menuId: string, menuName: string, entity: T[], idSelected?: string): MenuControlDataList {
        const menuItems: MenuControlData[] = entity.map(e => this.getMenuControlData(e, idSelected));
        return {
            menuId: menuId,
            menuName: menuName,
            menuItems: menuItems,
        };
    }

    public dump(): string {
        return JSON.stringify(this.data, null, 2);
    }


    public async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
      return new Promise<MenuControlDataList>((resolve, reject) => {
        resolve({
          menuId: this.getEntityType(),
          menuName: this.getEntityType(),
          menuItems: [],
        });
      });
    }

   
  protected entityType: string = '';
  public  getEntityType(): string {
    return this.entityType;
  }

  public setSelectedOption(menu: MenuControlDataList, id: string): void {
    if (menu.menuItems) {
      menu.menuItems.forEach(item => {
        if (item.id === id) {
          item.selected = true;
        }
      });
    }
  }


  public static newDateGETData(): DateGETData {
    return { date: new Date(), formattedDate: new Date().toLocaleDateString(), formattedDateTime: new Date().toLocaleString() };
  }
}
