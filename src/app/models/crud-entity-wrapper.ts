import { HcclService } from '@app/restsvc/hccl.service';

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
    abstract getDisplayText(): string;

    /**
     * Gets the wrapped data
     * @returns The original entity data
     */
    getData(): T {
        return this.data;
    }
}
