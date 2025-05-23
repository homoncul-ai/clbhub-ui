declare module 'dhtmlx-suite' {
    export class List {
        constructor(container: HTMLElement, config: ListConfig);
        clearAll(): void;
        parse(data: any[]): void;
    }

    export interface ListConfig {
        template?: (item: any) => string;
        css?: string;
        height?: string | number;
        drag?: boolean;
        selection?: boolean;
        editable?: boolean;
        multiselection?: boolean;
        templateBack?: boolean;
    }
} 