import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface MenuItem {
  level: number;
  label: string;
  route: string;
  componentPath: string;
  componentName: string;
  children?: MenuItem[];
  icon?: string;
}


@Injectable({
  providedIn: 'root'
})
export class MenuService {

  /**
   * We want to build the menu on the fly. 
   * - 
   * - addMenuItem(theMenu: MenuItem[], menuItem: MenuItem) - adds a menu item to the list
   * - addChildMenuItem(parentMenuItem: MenuItem, childMenuItem: MenuItem) - adds a child menu item to the parent menu item calcuates level based on parent level
   * - copyMenuItem(menuItem: MenuItem) - copies a menu item to a new menu item
   * - create a set of constants for each menu item in the menus below. 
   */

  /**
   * Adds a menu item to the specified menu array
   * @param theMenu - The menu array to add the item to
   * @param menuItem - The menu item to add
   */
  addMenuItem(theMenu: MenuItem[], menuItem: MenuItem): void {
    theMenu.push(menuItem);
  }

  /**
   * Adds a child menu item to a parent menu item and calculates the level based on parent level
   * @param parentMenuItem - The parent menu item
   * @param childMenuItem - The child menu item to add
   */
  addChildMenuItem(parentMenuItem: MenuItem, childMenuItem: MenuItem): void {
    // Calculate child level based on parent level
    childMenuItem.level = parentMenuItem.level + 1;
    
    // Initialize children array if it doesn't exist
    if (!parentMenuItem.children) {
      parentMenuItem.children = [];
    }
    
    // Add child to parent's children array
    parentMenuItem.children.push(childMenuItem);
  }

  /**
   * Creates a deep copy of a menu item
   * @param menuItem - The menu item to copy
   * @returns A new MenuItem object with the same properties
   */
  copyMenuItem(menuItem: MenuItem): MenuItem {
    const copiedItem: MenuItem = {
      level: menuItem.level,
      label: menuItem.label,
      route: menuItem.route,
      componentPath: menuItem.componentPath,
      componentName: menuItem.componentName,
      icon: menuItem.icon
    };

    // Deep copy children if they exist
    if (menuItem.children && menuItem.children.length > 0) {
      copiedItem.children = menuItem.children.map(child => this.copyMenuItem(child));
    }

    return copiedItem;
  }

  /**
   * Builds the advocate menu dynamically using the constants and helper methods
   * @returns Array of MenuItem objects for the advocate dashboard
   */
  buildAdvocateMenu(): MenuItem[] {
    const menu: MenuItem[] = [];
    
    // Add Dashboard with children
    const dashboard = this.copyMenuItem(MENU_CONSTANTS.ADVOCATE_DASHBOARD);
//    this.addChildMenuItem(dashboard, this.copyMenuItem(MENU_CONSTANTS.ADVOCATE_MESSAGES));
    this.addMenuItem(menu, dashboard);
    
    this.addMenuItem(menu, this.copyMenuItem(MENU_CONSTANTS.ADVOCATE_QUEUES));
    // Add Students with children
    const students = this.copyMenuItem(MENU_CONSTANTS.ADVOCATE_STUDENTS);
//    this.addChildMenuItem(students, this.copyMenuItem(MENU_CONSTANTS.ADVOCATE_STUDENT_DETAILS));
    this.addMenuItem(menu, students);
    
    // Add Tickets with children
    // const tickets = this.copyMenuItem(MENU_CONSTANTS.ADVOCATE_TICKETS);
    // this.addChildMenuItem(tickets, this.copyMenuItem(MENU_CONSTANTS.ADVOCATE_CREATE_TICKET));
    // this.addMenuItem(menu, tickets);
    
    // Add Integrations with children
    const integrations = this.copyMenuItem(MENU_CONSTANTS.ADVOCATE_INTEGRATIONS);
    this.addChildMenuItem(integrations, this.copyMenuItem(MENU_CONSTANTS.ADVOCATE_CLSCHOOLS));
    this.addChildMenuItem(integrations, this.copyMenuItem(MENU_CONSTANTS.ADVOCATE_CLSTUDENTS));
    this.addChildMenuItem(integrations, this.copyMenuItem(MENU_CONSTANTS.ADVOCATE_CLGUIDANCE));
    this.addMenuItem(menu, integrations);
    
    // Add Component Inventory
    this.addMenuItem(menu, this.copyMenuItem(MENU_CONSTANTS.ADVOCATE_COMPONENT_INVENTORY));
    
    return menu;
  }

  /**
   * Builds the broker menu dynamically using the constants and helper methods
   * @returns Array of MenuItem objects for the broker dashboard
   */
  buildBrokerMenu(): MenuItem[] {
    const menu: MenuItem[] = [];
    
    // Add Dashboard with children
    const dashboard = this.copyMenuItem(MENU_CONSTANTS.BROKER_DASHBOARD);
    this.addChildMenuItem(dashboard, this.copyMenuItem(MENU_CONSTANTS.BROKER_OVERVIEW));
    this.addMenuItem(menu, dashboard);
    
    // Add Clients with children
    const clients = this.copyMenuItem(MENU_CONSTANTS.BROKER_CLIENTS);
    this.addChildMenuItem(clients, this.copyMenuItem(MENU_CONSTANTS.BROKER_CLIENT_DETAILS));
    this.addMenuItem(menu, clients);
    
    // Add Agreements with children
    const agreements = this.copyMenuItem(MENU_CONSTANTS.BROKER_AGREEMENTS);
    this.addChildMenuItem(agreements, this.copyMenuItem(MENU_CONSTANTS.BROKER_AGREEMENT_DETAILS));
    this.addMenuItem(menu, agreements);
    
    return menu;
  }

  /**
   * Builds the service provider menu dynamically using the constants and helper methods
   * @returns Array of MenuItem objects for the service provider dashboard
   */
  buildServiceProviderMenu(): MenuItem[] {
    const menu: MenuItem[] = [];
    
    // Add Dashboard with children
    const dashboard = this.copyMenuItem(MENU_CONSTANTS.SERVICE_DASHBOARD);
    this.addChildMenuItem(dashboard, this.copyMenuItem(MENU_CONSTANTS.SERVICE_OVERVIEW));
    this.addMenuItem(menu, dashboard);
    
    // Add Services with children
    const services = this.copyMenuItem(MENU_CONSTANTS.SERVICE_SERVICES);
    this.addChildMenuItem(services, this.copyMenuItem(MENU_CONSTANTS.SERVICE_SERVICE_DETAILS));
    this.addMenuItem(menu, services);
    
    // Add Requests with children
    const requests = this.copyMenuItem(MENU_CONSTANTS.SERVICE_REQUESTS);
    this.addChildMenuItem(requests, this.copyMenuItem(MENU_CONSTANTS.SERVICE_REQUEST_DETAILS));
    this.addMenuItem(menu, requests);
    
    return menu;
  }

  /**
   * Builds the ecoadmin menu dynamically using the constants and helper methods
   * @returns Array of MenuItem objects for the ecoadmin dashboard
   */
  buildEcoAdminMenu(): MenuItem[] {
    const menu: MenuItem[] = [];
    
    // Add Dashboard
    const dashboard = this.copyMenuItem(MENU_CONSTANTS.EA_DASHBOARD);
    this.addMenuItem(menu, dashboard);

    // Add Provider Type Ref
    const providerTypeRef = this.copyMenuItem(MENU_CONSTANTS.EA_PROVIDERTYPEREF_LIST);
    this.addMenuItem(menu, providerTypeRef);
    
    // course list
    const courseList = this.copyMenuItem(MENU_CONSTANTS.EA_CLCOURSE_LIST);
    this.addMenuItem(menu, courseList);

    // catalog list
    const catalogList = this.copyMenuItem(MENU_CONSTANTS.EA_CATALOG_LIST);
    this.addMenuItem(menu, catalogList);

    // catalogentry list
    const catalogEntryList = this.copyMenuItem(MENU_CONSTANTS.EA_CATALOGENTRY_LIST);
    this.addMenuItem(menu, catalogEntryList);

    return menu;
  }

/*
  private advocateMenuItems: MenuItem[] = [
    {
      level: 1,
      label: 'Dashboard',
      route: '/advocate-dashboard',
      componentPath: 'src/app/features/dash-advo',
      componentName: 'advo-dashboard',
      icon: 'fas fa-tachometer-alt',
      children: [
        {
          level: 2,
          label: 'Queues',
          route: '/advocate-dashboard/org-queue-list',
          componentPath: 'src/app/components/org-queue-list',
          componentName: 'org-queue-list',
          icon: 'fas fa-envelope'
        },
        {
          level: 2,
          label: 'Messages',
          route: '/advocate-dashboard/messages',
          componentPath: 'src/app/features/dash-advo/messages',
          componentName: 'advo-messages',
          icon: 'fas fa-envelope'
        }
      ]
    },
    {
      level: 1,
      label: 'Students',
      route: '/advocate-dashboard/students',
      componentPath: 'src/app/features/dash-advo/students',
      componentName: 'advo-student-list',
      icon: 'fas fa-user-graduate',
      children: [
        {
          level: 2,
          label: 'Student Details',
          route: '/advocate-dashboard/students/:id',
          componentPath: 'src/app/features/dash-advo/students',
          componentName: 'advo-student-details',
          icon: 'fas fa-user'
        }
      ]
    },
    {
      level: 1,
      label: 'Tickets',
      route: '/advocate-dashboard/tickets',
      componentPath: 'src/app/features/dash-advo/tickets',
      componentName: 'advo-ticket-list',
      icon: 'fas fa-ticket-alt',
      children: [
        {
          level: 2,
          label: 'Create Ticket',
          route: '/advocate-dashboard/tickets/create',
          componentPath: 'src/app/features/dash-advo/tickets',
          componentName: 'create-ticket',
          icon: 'fas fa-plus-circle'
        }
      ]
    },
    {
      level: 1,
      label: 'Integrations',
      route: '/advocate-dashboard/integrations',
      componentPath: 'src/app/features/dash-advo/integrations',
      componentName: 'integrations-home',
      icon: 'fas fa-link',
      children: [
        {
          level: 2,
          label: 'CLSchools',
          route: '/advocate-dashboard/integrations/schools',
          componentPath: 'src/app/features/dash-advo/integrations/schools',
          componentName: 'clschools-list',
          icon: 'fas fa-school'
        },{
          level: 2,
          label: 'CLStudents',
          route: '/advocate-dashboard/integrations/students',
          componentPath: 'src/app/features/dash-advo/integrations/students',
          componentName: 'clstudents-list',
          icon: 'fas fa-user-graduate'
        },{
          level: 2,
          label: 'CLGuidance Counsellors',
          route: '/advocate-dashboard/integrations/guidance',
          componentPath: 'src/app/features/dash-advo/integrations/guidance',
          componentName: 'clguidance-list',
          icon: 'fas fa-user-tie'
        }
      ]
    },
    {
      level: 1,
      label: 'Component Inventory',
      route: '/advocate-dashboard/uistarter',
      componentPath: 'src/app/views/uistarter',
      componentName: 'uistarter-home',
      icon: 'fas fa-ticket-alt'
    }
  ];

  private brokerMenuItems: MenuItem[] = [
    {
      level: 1,
      label: 'Dashboard',
      route: '/broker-dashboard',
      componentPath: 'src/app/features/dash-broker',
      componentName: 'broker-dashboard',
      icon: 'fas fa-tachometer-alt',
      children: [
        {
          level: 2,
          label: 'Overview',
          route: '/broker-dashboard/overview',
          componentPath: 'src/app/features/dash-broker/overview',
          componentName: 'broker-overview',
          icon: 'fas fa-chart-line'
        }
      ]
    },
    {
      level: 1,
      label: 'Clients',
      route: '/broker-dashboard/clients',
      componentPath: 'src/app/features/dash-broker/clients',
      componentName: 'broker-client-list',
      icon: 'fas fa-users',
      children: [
        {
          level: 2,
          label: 'Client Details',
          route: '/broker-dashboard/clients/:id',
          componentPath: 'src/app/features/dash-broker/clients',
          componentName: 'broker-client-details',
          icon: 'fas fa-user'
        }
      ]
    },
    {
      level: 1,
      label: 'Agreements',
      route: '/broker-dashboard/agreements',
      componentPath: 'src/app/features/dash-broker/agreements',
      componentName: 'broker-agreement-list',
      icon: 'fas fa-file-contract',
      children: [
        {
          level: 2,
          label: 'Agreement Details',
          route: '/broker-dashboard/agreements/:id',
          componentPath: 'src/app/features/dash-broker/agreements',
          componentName: 'broker-agreement-details',
          icon: 'fas fa-file-alt'
        }
      ]
    }
  ];
  */

  /*
  private serviceProviderMenuItems: MenuItem[] = [
    {
      level: 1,
      label: 'Dashboard',
      route: '/service-provider-dashboard',
      componentPath: 'src/app/features/dash-service',
      componentName: 'service-dashboard',
      icon: 'fas fa-tachometer-alt',
      children: [
        {
          level: 2,
          label: 'Overview',
          route: '/service-provider-dashboard/overview',
          componentPath: 'src/app/features/dash-service/overview',
          componentName: 'service-overview',
          icon: 'fas fa-chart-line'
        }
      ]
    },
    {
      level: 1,
      label: 'Services',
      route: '/service-provider-dashboard/services',
      componentPath: 'src/app/features/dash-service/services',
      componentName: 'service-list',
      icon: 'fas fa-cogs',
      children: [
        {
          level: 2,
          label: 'Service Details',
          route: '/service-provider-dashboard/services/:id',
          componentPath: 'src/app/features/dash-service/services',
          componentName: 'service-details',
          icon: 'fas fa-info-circle'
        }
      ]
    },
    {
      level: 1,
      label: 'Requests',
      route: '/service-provider-dashboard/requests',
      componentPath: 'src/app/features/dash-service/requests',
      componentName: 'service-request-list',
      icon: 'fas fa-clipboard-list',
      children: [
        {
          level: 2,
          label: 'Request Details',
          route: '/service-provider-dashboard/requests/:id',
          componentPath: 'src/app/features/dash-service/requests',
          componentName: 'service-request-details',
          icon: 'fas fa-clipboard-check'
        }
      ]
    }
  ];
*/
  getMenuItems(dashboardType: 'advocate' | 'broker' | 'service-provider' | 'ecoadmin'): MenuItem[] {
    switch (dashboardType) {
      case 'advocate':
          return this.buildAdvocateMenu();
      case 'broker':
        return this.buildBrokerMenu();
      case 'service-provider':
        return this.buildServiceProviderMenu();
      case 'ecoadmin':
        return this.buildEcoAdminMenu();
      default:
        return [];
    }
  }

  getDashboardTypeFromRoute(route: string): 'advocate' | 'broker' | 'service-provider' | 'ecoadmin' | null {
    if (route.startsWith('/advocate-dashboard')) {
      return 'advocate';
    } else if (route.startsWith('/broker-dashboard')) {
      return 'broker';
    } else if (route.startsWith('/service-provider-dashboard')) {
      return 'service-provider';
    } else if (route.startsWith('/ecoadmin-dashboard')) {
      return 'ecoadmin';
    }
    return null;
  }

  /**
   * Get the first navigable menu item based on user context and redirect to it
   * @param context - The HCCL context containing user profile information
   * @param router - The Angular router service for navigation
   * @returns The first navigable menu item or null if none found
   */
  getFirstNavigableMenuItem(context: any, router: Router): MenuItem | null {
    console.log('Starting menu navigation process');
    
    // Get the first menu item based on user context or default to advocate
    const dashboardType = this.getDashboardTypeFromContext(context);
    console.log('Determined dashboard type:', dashboardType);
    const menuItems = this.getMenuItems(dashboardType);
    console.log('Retrieved menu items for dashboard type:', dashboardType, 'count:', menuItems.length);
    
    if (menuItems.length > 0) {
      const firstMenuItem = this.findFirstNavigableMenuItem(menuItems);
      if (firstMenuItem) {
        console.log('Found first navigable menu item:', firstMenuItem.label, 'route:', firstMenuItem.route);
        return firstMenuItem;
      } else {
        console.log('No navigable menu items found, staying on current route');
      }
    } else {
      console.log('No menu items found for dashboard type:', dashboardType);
    }
    
    return null;
  }

  /**
   * Determine dashboard type from HCCL context
   * @param context - The HCCL context containing user profile information
   * @returns The dashboard type based on user profile
   */
  private getDashboardTypeFromContext(context: any): 'advocate' | 'broker' | 'service-provider' | 'ecoadmin' {
    if (!context || !context.currentUserProfile) {
      console.log('No user profile in context, defaulting to advocate');
      return 'advocate';
    }

    const profileTypeCode = context.currentUserProfile.profileTypeCode;
    console.log('User profile type code:', profileTypeCode);

    // Map profile type codes to dashboard types
    switch (profileTypeCode?.toUpperCase()) {
      case 'ADVOCATE':
      case 'EDU_ADVOCATE':
        return 'advocate';
      case 'BROKER':
      case 'EDU_BROKER':
        return 'broker';
    
      case 'PROVIDER':
      case 'SERVICE_PROVIDER':
      case 'EDU_SERVICE_PROVIDER':
        return 'service-provider';
      case 'ECOADMIN':
      case 'EDU_ECOADMIN':
        return 'ecoadmin';
      default:
        console.log('Unknown profile type code, defaulting to advocate:', profileTypeCode);
        return 'advocate';
    }
  }

  /**
   * Find the first menu item that has a route (navigable)
   * @param menuItems - Array of menu items to search through
   * @returns The first navigable menu item or null if none found
   */
  private findFirstNavigableMenuItem(menuItems: MenuItem[]): MenuItem | null {
    console.log('Searching for first navigable menu item in:', menuItems);
    
    for (const item of menuItems) {
      console.log('Checking menu item:', item.label, 'route:', item.route);
      
      // If this item has a route, return it
      if (item.route) {
        console.log('Found navigable menu item:', item.label, 'route:', item.route);
        return item;
      }
      
      // If this item has children, search them
      if (item.children && item.children.length > 0) {
        console.log('Checking children of:', item.label);
        const childItem = this.findFirstNavigableMenuItem(item.children);
        if (childItem) {
          return childItem;
        }
      }
    }
    
    console.log('No navigable menu items found');
    return null;
  }

} 


// Menu item constants for building menus on the fly
export const MENU_CONSTANTS = {
  // Advocate Dashboard Menu Items
  ADVOCATE_DASHBOARD: {
    level: 1,
    label: 'Dashboard',
    route: '/advocate-dashboard',
    componentPath: 'src/app/features/dash-advo',
    componentName: 'advo-dashboard',
    icon: 'fas fa-tachometer-alt'
  },
  ADVOCATE_QUEUES: {
    level: 1,
    label: 'Queues',
    route: '/advocate-dashboard/org-queue-list',
    componentPath: 'src/app/components/org-queue-list',
    componentName: 'org-queue-list',
    icon: 'fas fa-envelope'
  },
  ADVOCATE_MESSAGES: {
    level: 2,
    label: 'Messages',
    route: '/advocate-dashboard/messages',
    componentPath: 'src/app/features/dash-advo/messages',
    componentName: 'advo-messages',
    icon: 'fas fa-envelope'
  },
  ADVOCATE_STUDENTS: {
    level: 1,
    label: 'Students',
    route: '/advocate-dashboard/students',
    componentPath: 'src/app/features/dash-advo/students',
    componentName: 'advo-student-list',
    icon: 'fas fa-user-graduate'
  },
  ADVOCATE_STUDENT_DETAILS: {
    level: 2,
    label: 'Student Details',
    route: '/advocate-dashboard/students/:id',
    componentPath: 'src/app/features/dash-advo/students',
    componentName: 'advo-student-details',
    icon: 'fas fa-user'
  },
  ADVOCATE_TICKETS: {
    level: 1,
    label: 'Tickets',
    route: '/advocate-dashboard/tickets',
    componentPath: 'src/app/features/dash-advo/tickets',
    componentName: 'advo-ticket-list',
    icon: 'fas fa-ticket-alt'
  },
  ADVOCATE_CREATE_TICKET: {
    level: 2,
    label: 'Create Ticket',
    route: '/advocate-dashboard/tickets/create',
    componentPath: 'src/app/features/dash-advo/tickets',
    componentName: 'create-ticket',
    icon: 'fas fa-plus-circle'
  },
  ADVOCATE_INTEGRATIONS: {
    level: 1,
    label: 'Integrations',
    route: '/advocate-dashboard/integrations',
    componentPath: 'src/app/features/dash-advo/integrations',
    componentName: 'integrations-home',
    icon: 'fas fa-link'
  },
  ADVOCATE_CLSCHOOLS: {
    level: 2,
    label: 'CLSchools',
    route: '/advocate-dashboard/integrations/schools',
    componentPath: 'src/app/features/dash-advo/integrations/schools',
    componentName: 'clschools-list',
    icon: 'fas fa-school'
  },
  ADVOCATE_CLSTUDENTS: {
    level: 2,
    label: 'CLStudents',
    route: '/advocate-dashboard/integrations/students',
    componentPath: 'src/app/features/dash-advo/integrations/students',
    componentName: 'clstudent-list',
    icon: 'fas fa-user-graduate'
  },
  ADVOCATE_CLGUIDANCE: {
    level: 2,
    label: 'CLGuidance Counsellors',
    route: '/advocate-dashboard/integrations/guidance',
    componentPath: 'src/app/features/dash-advo/integrations/guidance',
    componentName: 'clguidance-list',
    icon: 'fas fa-user-tie'
  },
  ADVOCATE_COMPONENT_INVENTORY: {
    level: 1,
    label: 'Component Inventory',
    route: '/advocate-dashboard/uistarter',
    componentPath: 'src/app/views/uistarter',
    componentName: 'uistarter-home',
    icon: 'fas fa-ticket-alt'
  },

  // Broker Dashboard Menu Items
  BROKER_DASHBOARD: {
    level: 1,
    label: 'Dashboard',
    route: '/broker-dashboard',
    componentPath: 'src/app/features/dash-broker',
    componentName: 'broker-dashboard',
    icon: 'fas fa-tachometer-alt'
  },
  BROKER_OVERVIEW: {
    level: 2,
    label: 'Overview',
    route: '/broker-dashboard/overview',
    componentPath: 'src/app/features/dash-broker/overview',
    componentName: 'broker-overview',
    icon: 'fas fa-chart-line'
  },
  BROKER_CLIENTS: {
    level: 1,
    label: 'Clients',
    route: '/broker-dashboard/clients',
    componentPath: 'src/app/features/dash-broker/clients',
    componentName: 'broker-client-list',
    icon: 'fas fa-users'
  },
  BROKER_CLIENT_DETAILS: {
    level: 2,
    label: 'Client Details',
    route: '/broker-dashboard/clients/:id',
    componentPath: 'src/app/features/dash-broker/clients',
    componentName: 'broker-client-details',
    icon: 'fas fa-user'
  },
  BROKER_AGREEMENTS: {
    level: 1,
    label: 'Agreements',
    route: '/broker-dashboard/agreements',
    componentPath: 'src/app/features/dash-broker/agreements',
    componentName: 'broker-agreement-list',
    icon: 'fas fa-file-contract'
  },
  BROKER_AGREEMENT_DETAILS: {
    level: 2,
    label: 'Agreement Details',
    route: '/broker-dashboard/agreements/:id',
    componentPath: 'src/app/features/dash-broker/agreements',
    componentName: 'broker-agreement-details',
    icon: 'fas fa-file-alt'
  },

  // Service Provider Dashboard Menu Items
  SERVICE_DASHBOARD: {
    level: 1,
    label: 'Dashboard',
    route: '/service-provider-dashboard',
    componentPath: 'src/app/features/dash-service',
    componentName: 'service-dashboard',
    icon: 'fas fa-tachometer-alt'
  },
  SERVICE_OVERVIEW: {
    level: 2,
    label: 'Overview',
    route: '/service-provider-dashboard/overview',
    componentPath: 'src/app/features/dash-service/overview',
    componentName: 'service-overview',
    icon: 'fas fa-chart-line'
  },
  SERVICE_SERVICES: {
    level: 1,
    label: 'Services',
    route: '/service-provider-dashboard/services',
    componentPath: 'src/app/features/dash-service/services',
    componentName: 'service-list',
    icon: 'fas fa-cogs'
  },
  SERVICE_SERVICE_DETAILS: {
    level: 2,
    label: 'Service Details',
    route: '/service-provider-dashboard/services/:id',
    componentPath: 'src/app/features/dash-service/services',
    componentName: 'service-details',
    icon: 'fas fa-info-circle'
  },
  SERVICE_REQUESTS: {
    level: 1,
    label: 'Requests',
    route: '/service-provider-dashboard/requests',
    componentPath: 'src/app/features/dash-service/requests',
    componentName: 'service-request-list',
    icon: 'fas fa-clipboard-list'
  },
  SERVICE_REQUEST_DETAILS: {
    level: 2,
    label: 'Request Details',
    route: '/service-provider-dashboard/requests/:id',
    componentPath: 'src/app/features/dash-service/requests',
    componentName: 'service-request-details',
    icon: 'fas fa-clipboard-check'
  },

  // EcoAdmin Dashboard Menu Items
  EA_DASHBOARD: {
    level: 1,
    label: 'Dashboard',
    route: '/ecoadmin-dashboard',
    componentPath: 'src/app/features/dash-ecoadmin',
    componentName: 'ecoadmin-dashboard',
    icon: 'fas fa-tachometer-alt'
  },

 //  /ecoadmin-dashboard/experience menu items 
EA_EXPERIENCETYPE_LIST: {
  "level" : 2,
  "label" : "Experience Type",
  "route" : "/ecoadmin-dashboard/experience/experiencetype-list",
  "componentPath" : "/src/app/components/_crud/experience/experiencetype-list",
  "componentName" : "experiencetype-list",
  "icon" : ""
},

EA_EXPERIENCELOCATION_LIST: {
  "level" : 2,
  "label" : "Experience Location",
  "route" : "/ecoadmin-dashboard/experience/experiencelocation-list",
  "componentPath" : "/src/app/components/_crud/experience/experiencelocation-list",
  "componentName" : "experiencelocation-list",
  "icon" : ""
},

EA_EXPERIENCE_LIST: {
  "level" : 2,
  "label" : "Experience",
  "route" : "/ecoadmin-dashboard/experience/experience-list",
  "componentPath" : "/src/app/components/_crud/experience/experience-list",
  "componentName" : "experience-list",
  "icon" : ""
},

EA_EXPERIENCEREGRULE_LIST: {
  "level" : 2,
  "label" : "Experience Reg Rule",
  "route" : "/ecoadmin-dashboard/experience/experienceregrule-list",
  "componentPath" : "/src/app/components/_crud/experience/experienceregrule-list",
  "componentName" : "experienceregrule-list",
  "icon" : ""
},

//  /ecoadmin-dashboard/integration_edu menu items 
EA_CLGUIDANCE_LIST: {
  "level" : 2,
  "label" : "C L Guidance",
  "route" : "/ecoadmin-dashboard/integration_edu/clguidance-list",
  "componentPath" : "/src/app/components/_crud/integration_edu/clguidance-list",
  "componentName" : "clguidance-list",
  "icon" : ""
},

EA_CLSCHOOL_LIST: {
  "level" : 2,
  "label" : "C L School",
  "route" : "/ecoadmin-dashboard/integration_edu/clschool-list",
  "componentPath" : "/src/app/components/_crud/integration_edu/clschool-list",
  "componentName" : "clschool-list",
  "icon" : ""
},

EA_CLSTUDENT_LIST: {
  "level" : 2,
  "label" : "C L Student",
  "route" : "/ecoadmin-dashboard/integration_edu/clstudent-list",
  "componentPath" : "/src/app/components/_crud/integration_edu/clstudent-list",
  "componentName" : "clstudent-list",
  "icon" : ""
},

EA_CLCOURSE_LIST: {
  "level" : 2,
  "label" : "C L Course",
  "route" : "/ecoadmin-dashboard/clcourses",
  "componentPath" : "/src/app/components/_crud/integration_edu/clcourse-list",
  "componentName" : "clcourse-list",
  "icon" : ""
},

//  /ecoadmin-dashboard/teams menu items 
EA_HCCLUSER_LIST: {
  "level" : 2,
  "label" : "Hccl User",
  "route" : "/ecoadmin-dashboard/teams/hccluser-list",
  "componentPath" : "/src/app/components/_crud/teams/hccluser-list",
  "componentName" : "hccluser-list",
  "icon" : ""
},

EA_TEAMTYPEMEMBERROLEREF_LIST: {
  "level" : 2,
  "label" : "Team Type Member Role Ref",
  "route" : "/ecoadmin-dashboard/teams/teamtypememberroleref-list",
  "componentPath" : "/src/app/components/_crud/teams/teamtypememberroleref-list",
  "componentName" : "teamtypememberroleref-list",
  "icon" : ""
},

EA_HCCLTEAM_LIST: {
  "level" : 2,
  "label" : "Hccl Team",
  "route" : "/ecoadmin-dashboard/teams/hcclteam-list",
  "componentPath" : "/src/app/components/_crud/teams/hcclteam-list",
  "componentName" : "hcclteam-list",
  "icon" : ""
},

EA_HCCLTEAMLOG_LIST: {
  "level" : 2,
  "label" : "Hccl Team Log",
  "route" : "/ecoadmin-dashboard/teams/hcclteamlog-list",
  "componentPath" : "/src/app/components/_crud/teams/hcclteamlog-list",
  "componentName" : "hcclteamlog-list",
  "icon" : ""
},

EA_HCCLTEAMMEMBER_LIST: {
  "level" : 2,
  "label" : "Hccl Team Member",
  "route" : "/ecoadmin-dashboard/teams/hcclteammember-list",
  "componentPath" : "/src/app/components/_crud/teams/hcclteammember-list",
  "componentName" : "hcclteammember-list",
  "icon" : ""
},

EA_TEAMMEMBERROLEREF_LIST: {
  "level" : 2,
  "label" : "Team Member Role Ref",
  "route" : "/ecoadmin-dashboard/teams/teammemberroleref-list",
  "componentPath" : "/src/app/components/_crud/teams/teammemberroleref-list",
  "componentName" : "teammemberroleref-list",
  "icon" : ""
},

EA_HCCLTEAMMEMBERROLE_LIST: {
  "level" : 2,
  "label" : "Hccl Team Member Role",
  "route" : "/ecoadmin-dashboard/teams/hcclteammemberrole-list",
  "componentPath" : "/src/app/components/_crud/teams/hcclteammemberrole-list",
  "componentName" : "hcclteammemberrole-list",
  "icon" : ""
},

EA_HCCLUSERPROFILE_LIST: {
  "level" : 2,
  "label" : "Hccl User Profile",
  "route" : "/ecoadmin-dashboard/teams/hccluserprofile-list",
  "componentPath" : "/src/app/components/_crud/teams/hccluserprofile-list",
  "componentName" : "hccluserprofile-list",
  "icon" : ""
},

EA_HCCLORGANIZATION_LIST: {
  "level" : 2,
  "label" : "Hccl Organization",
  "route" : "/ecoadmin-dashboard/teams/hcclorganization-list",
  "componentPath" : "/src/app/components/_crud/teams/hcclorganization-list",
  "componentName" : "hcclorganization-list",
  "icon" : ""
},

EA_TEAMTYPEREF_LIST: {
  "level" : 2,
  "label" : "Team Type Ref",
  "route" : "/ecoadmin-dashboard/teams/teamtyperef-list",
  "componentPath" : "/src/app/components/_crud/teams/teamtyperef-list",
  "componentName" : "teamtyperef-list",
  "icon" : ""
},

EA_HCCLORGANIZATIONTYPEREF_LIST: {
  "level" : 2,
  "label" : "Hccl Organization Type Ref",
  "route" : "/ecoadmin-dashboard/teams/hcclorganizationtyperef-list",
  "componentPath" : "/src/app/components/_crud/teams/hcclorganizationtyperef-list",
  "componentName" : "hcclorganizationtyperef-list",
  "icon" : ""
},

//  /ecoadmin-dashboard/prov menu items 
EA_PROVIDER_LIST: {
  "level" : 2,
  "label" : "Provider",
  "route" : "/ecoadmin-dashboard/prov/provider-list",
  "componentPath" : "/src/app/components/_crud/prov/provider-list",
  "componentName" : "provider-list",
  "icon" : ""
},

EA_PROVIDERUSER_LIST: {
  "level" : 2,
  "label" : "Provider User",
  "route" : "/ecoadmin-dashboard/prov/provideruser-list",
  "componentPath" : "/src/app/components/_crud/prov/provideruser-list",
  "componentName" : "provideruser-list",
  "icon" : ""
},

EA_PROVIDERTYPEREF_LIST: {
  level: 1,
  label: 'Provider Type Refs',
  route: '/ecoadmin-dashboard/providertyperefs',
  componentPath: 'src/app/components/_crud/providertyperef/providertyperef-list.component',
  componentName: 'ProviderTypeRefListComponent',
  icon: 'fas fa-list'
},

//  /ecoadmin-dashboard/integration_emp menu items 
EA_CLJOB_LIST: {
  "level" : 2,
  "label" : "C L Job",
  "route" : "/ecoadmin-dashboard/integration_emp/cljob-list",
  "componentPath" : "/src/app/components/_crud/integration_emp/cljob-list",
  "componentName" : "cljob-list",
  "icon" : ""
},

EA_CLEMPLOYEE_LIST: {
  "level" : 2,
  "label" : "C L Employee",
  "route" : "/ecoadmin-dashboard/integration_emp/clemployee-list",
  "componentPath" : "/src/app/components/_crud/integration_emp/clemployee-list",
  "componentName" : "clemployee-list",
  "icon" : ""
},

EA_CLCOMPANY_LIST: {
  "level" : 2,
  "label" : "C L Company",
  "route" : "/ecoadmin-dashboard/integration_emp/clcompany-list",
  "componentPath" : "/src/app/components/_crud/integration_emp/clcompany-list",
  "componentName" : "clcompany-list",
  "icon" : ""
},

//  /ecoadmin-dashboard/statemachine menu items 
EA_STATETRANSITIONLOG_LIST: {
  "level" : 2,
  "label" : "State Transition Log",
  "route" : "/ecoadmin-dashboard/statemachine/statetransitionlog-list",
  "componentPath" : "/src/app/components/_crud/statemachine/statetransitionlog-list",
  "componentName" : "statetransitionlog-list",
  "icon" : ""
},

//  /ecoadmin-dashboard/tix menu items 
EA_WORKREQUESTTYPEREF_LIST: {
  "level" : 2,
  "label" : "Work Request Type Ref",
  "route" : "/ecoadmin-dashboard/tix/workrequesttyperef-list",
  "componentPath" : "/src/app/components/_crud/tix/workrequesttyperef-list",
  "componentName" : "workrequesttyperef-list",
  "icon" : ""
},

EA_WORKREQUESTITEM_LIST: {
  "level" : 2,
  "label" : "Work Request Item",
  "route" : "/ecoadmin-dashboard/tix/workrequestitem-list",
  "componentPath" : "/src/app/components/_crud/tix/workrequestitem-list",
  "componentName" : "workrequestitem-list",
  "icon" : ""
},

EA_WORKQUEUETYPEREF_LIST: {
  "level" : 2,
  "label" : "Work Queue Type Ref",
  "route" : "/ecoadmin-dashboard/tix/workqueuetyperef-list",
  "componentPath" : "/src/app/components/_crud/tix/workqueuetyperef-list",
  "componentName" : "workqueuetyperef-list",
  "icon" : ""
},

EA_WORKREQUESTLOG_LIST: {
  "level" : 2,
  "label" : "Work Request Log",
  "route" : "/ecoadmin-dashboard/tix/workrequestlog-list",
  "componentPath" : "/src/app/components/_crud/tix/workrequestlog-list",
  "componentName" : "workrequestlog-list",
  "icon" : ""
},

EA_WORKQUEUE_LIST: {
  "level" : 2,
  "label" : "Work Queue",
  "route" : "/ecoadmin-dashboard/tix/workqueue-list",
  "componentPath" : "/src/app/components/_crud/tix/workqueue-list",
  "componentName" : "workqueue-list",
  "icon" : ""
},

EA_WORKREQUEST_LIST: {
  "level" : 2,
  "label" : "Work Request",
  "route" : "/ecoadmin-dashboard/tix/workrequest-list",
  "componentPath" : "/src/app/components/_crud/tix/workrequest-list",
  "componentName" : "workrequest-list",
  "icon" : ""
},

EA_WORKREQUESTTEAM_LIST: {
  "level" : 2,
  "label" : "Work Request Team",
  "route" : "/ecoadmin-dashboard/tix/workrequestteam-list",
  "componentPath" : "/src/app/components/_crud/tix/workrequestteam-list",
  "componentName" : "workrequestteam-list",
  "icon" : ""
},

EA_WORKREQUESTROUTINGREASON_LIST: {
  "level" : 2,
  "label" : "Work Request Routing Reason",
  "route" : "/ecoadmin-dashboard/tix/workrequestroutingreason-list",
  "componentPath" : "/src/app/components/_crud/tix/workrequestroutingreason-list",
  "componentName" : "workrequestroutingreason-list",
  "icon" : ""
},

//  /ecoadmin-dashboard/taxonomy menu items 
EA_TAXONOMY_LIST: {
  "level" : 2,
  "label" : "Taxonomy",
  "route" : "/ecoadmin-dashboard/taxonomy/taxonomy-list",
  "componentPath" : "/src/app/components/_crud/taxonomy/taxonomy-list",
  "componentName" : "taxonomy-list",
  "icon" : ""
},

EA_TAXONOMYLEVEL_LIST: {
  "level" : 2,
  "label" : "Taxonomy Level",
  "route" : "/ecoadmin-dashboard/taxonomy/taxonomylevel-list",
  "componentPath" : "/src/app/components/_crud/taxonomy/taxonomylevel-list",
  "componentName" : "taxonomylevel-list",
  "icon" : ""
},

EA_TAXONOMYENTRY_LIST: {
  "level" : 2,
  "label" : "Taxonomy Entry",
  "route" : "/ecoadmin-dashboard/taxonomy/taxonomyentry-list",
  "componentPath" : "/src/app/components/_crud/taxonomy/taxonomyentry-list",
  "componentName" : "taxonomyentry-list",
  "icon" : ""
},

//  /ecoadmin-dashboard/catalog menu items 
EA_CATALOG_LIST: {
  "level" : 2,
  "label" : "Catalog",
  "route" : "/ecoadmin-dashboard/catalogs",
  "componentPath" : "/src/app/components/_crud/catalogs/catalog-list",
  "componentName" : "catalog-list",
  "icon" : ""
},

EA_CATALOGENTRYTAG_LIST: {
  "level" : 2,
  "label" : "Catalog Entry Tag",
  "route" : "/ecoadmin-dashboard/catalog/catalogentrytag-list",
  "componentPath" : "/src/app/components/_crud/catalog/catalogentrytag-list",
  "componentName" : "catalogentrytag-list",
  "icon" : ""
},

EA_CATALOGTAGREF_LIST: {
  "level" : 2,
  "label" : "Catalog Tag Ref",
  "route" : "/ecoadmin-dashboard/catalog/catalogtagref-list",
  "componentPath" : "/src/app/components/_crud/catalog/catalogtagref-list",
  "componentName" : "catalogtagref-list",
  "icon" : ""
},

EA_CATALOGSEARCHRESULT_LIST: {
  "level" : 2,
  "label" : "Catalog Search Result",
  "route" : "/ecoadmin-dashboard/catalog/catalogsearchresult-list",
  "componentPath" : "/src/app/components/_crud/catalog/catalogsearchresult-list",
  "componentName" : "catalogsearchresult-list",
  "icon" : ""
},

EA_CATALOGSEARCH_LIST: {
  "level" : 2,
  "label" : "Catalog Search",
  "route" : "/ecoadmin-dashboard/catalog/catalogsearch-list",
  "componentPath" : "/src/app/components/_crud/catalog/catalogsearch-list",
  "componentName" : "catalogsearch-list",
  "icon" : ""
},

EA_CATALOGENTRY_LIST: {
  "level" : 2,
  "label" : "Catalog Entry",
  "route" : "/ecoadmin-dashboard/catalogentries",
  "componentPath" : "/src/app/components/_crud/catalogentry/catalogentry-list.component",
  "componentName" : "CatalogEntryListComponent",
  "icon" : ""
},

EA_CATALOGSEARCHRESULTENTRY_LIST: {
  "level" : 2,
  "label" : "Catalog Search Result Entry",
  "route" : "/ecoadmin-dashboard/catalog/catalogsearchresultentry-list",
  "componentPath" : "/src/app/components/_crud/catalog/catalogsearchresultentry-list",
  "componentName" : "catalogsearchresultentry-list",
  "icon" : ""
},

//  /ecoadmin-dashboard/vocode menu items 
EA_VOCATIONENCODINGINSTANCE_LIST: {
  "level" : 2,
  "label" : "Vocation Encoding Instance",
  "route" : "/ecoadmin-dashboard/vocode/vocationencodinginstance-list",
  "componentPath" : "/src/app/components/_crud/vocode/vocationencodinginstance-list",
  "componentName" : "vocationencodinginstance-list",
  "icon" : ""
},

EA_VOCATIONENCODINGREF_LIST: {
  "level" : 2,
  "label" : "Vocation Encoding Ref",
  "route" : "/ecoadmin-dashboard/vocode/vocationencodingref-list",
  "componentPath" : "/src/app/components/_crud/vocode/vocationencodingref-list",
  "componentName" : "vocationencodingref-list",
  "icon" : ""
},

EA_VOCATIONENCODING_LIST: {
  "level" : 2,
  "label" : "Vocation Encoding",
  "route" : "/ecoadmin-dashboard/vocode/vocationencoding-list",
  "componentPath" : "/src/app/components/_crud/vocode/vocationencoding-list",
  "componentName" : "vocationencoding-list",
  "icon" : ""
},

//  /ecoadmin-dashboard/provreq menu items 
EA_PROVIDERREQUEST_LIST: {
  "level" : 2,
  "label" : "Provider Request",
  "route" : "/ecoadmin-dashboard/provreq/providerrequest-list",
  "componentPath" : "/src/app/components/_crud/provreq/providerrequest-list",
  "componentName" : "providerrequest-list",
  "icon" : ""
},

EA_PROVIDERREQUESTTYPEREF_LIST: {
  "level" : 2,
  "label" : "Provider Request Type Ref",
  "route" : "/ecoadmin-dashboard/provreq/providerrequesttyperef-list",
  "componentPath" : "/src/app/components/_crud/provreq/providerrequesttyperef-list",
  "componentName" : "providerrequesttyperef-list",
  "icon" : ""
}

  
    

};