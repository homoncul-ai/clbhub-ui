import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogGETData, HcclService, HcclUserContextGETData, WorkQueueGETData, PersonalStatementGETData, PersonalStatementCriteria } from '@app/restsvc/hccl.service';

export interface MenuItem {
  id?: string;
  level: number;
  label: string;
  route: string;
  componentPath: string;
  componentName: string;
  children?: MenuItem[];
  icon?: string;
  open?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private hcclService: HcclService) {
  }


  /**
   * 	String DASHBOARD_ECOADMIN = "EcoAdmin"; // 
	String DASHBOARD_STUDENT = "Student"; 
	String DASHBOARD_ADULT = "Adult"; 
	String DASHBOARD_GUIDANCE = "Guidance";
	String DASHBOARD_SCHOOL_PROVIDER= "Provider";
	String DASHBOARD_EMPLOYER = "Provider";
	String DASHBOARD_NONPROFIT = "NonProfit";

   * 
   */
  getRouteFromDashboardType(dashboardType: 'advocate' | 'nonprofit' | 'parent' | 'service-provider' | 'employee' | 'ecoadmin' | 'student' | 'swcat'): string {
    switch (dashboardType) {
      case 'advocate':
        return 'advocate-dashboard';

      case 'parent':
        return 'parent-dashboard';

      case 'nonprofit':
        return 'provider-dashboard';
          //return 'nonprofit-dashboard';
  
      case 'service-provider':
        return 'provider-dashboard';

      case 'employee':
        return 'provider-dashboard';
        //return 'employee-dashboard';

      case 'ecoadmin':
        return 'ecoadmin-dashboard';
      case 'student':
        return 'student-dashboard';
      case 'swcat':
        return 'swcat-dashboard';

      default:
        alert('Unknown dashboard type:' + dashboardType);
        return 'advocate-dashboard';
 
    }
    return '';
  }

  getDashboardTypeFromRoute(route: string): 'advocate' | 'nonprofit' | 'parent' | 'service-provider' | 'employee' | 'ecoadmin' | 'student' | 'swcat' | null {
    if (route.startsWith('/advocate-dashboard')) {
      return 'advocate';
    } else if (route.startsWith('/nonprofit-dashboard')) {
      return 'nonprofit';
    } else if (route.startsWith('/parent-dashboard')) {
      return 'parent';
    } else if (route.startsWith('/provider-dashboard')) {
      return 'service-provider';
    } else if (route.startsWith('/employee-dashboard')) {
      return 'employee';
    } else if (route.startsWith('/ecoadmin-dashboard')) {
      return 'ecoadmin';
    } else if (route.startsWith('/student-dashboard')) {
      return 'student';
    } else if (route.startsWith('/swcat-dashboard')) {
      return 'swcat';
    }
    return null;
  }

  public getDashboardTypeFromContext(context: any): 'advocate' | 'nonprofit' | 'parent' | 'service-provider' | 'employee' | 'ecoadmin' | 'student' | 'swcat' {
    if (!context || !context.currentUserProfile) {
      console.log('No user profile in context, defaulting to advocate');
      return 'advocate';
    }

    const profileTypeCode = context.currentUserProfile.profileTypeCode;
    console.log('User profile type code:', profileTypeCode);

    switch (profileTypeCode?.toUpperCase()) {

      case 'ECOADMIN':
      case 'EDU_ECOADMIN':
        return 'ecoadmin';


      case 'ADVOCATE':
      case 'EDU_ADVOCATE':
      case 'GUIDANCE':
        return 'advocate';

      case 'EMPLOYEE':
      case 'EDU_EMPLOYEE':
      case 'EMPLOYER':
      case 'EDU_EMPLOYER':
        //return 'employee';
     
      case 'NONPROFIT':
      case 'EDU_NONPROFIT':
        //return 'nonprofit';   
      case 'PROVIDER':
      case 'SERVICE_PROVIDER':
      case 'SCHOOLPROVIDER':
      case 'EDU_SERVICE_PROVIDER':
        return 'service-provider';



      case 'PARENT':
      case 'EDU_PARENT':
        return 'parent';

      case 'STUDENT':
        return 'student';

      case 'SWCAT':
        return 'swcat';

      default:
        console.log('Unknown profile type code, defaulting to advocate:', profileTypeCode);
        alert('Unknown profile type code, defaulting to advocate:' + profileTypeCode);
        return 'advocate';
    }
  }
  queues : WorkQueueGETData[] = [];
  catalogs : CatalogGETData[] = [];
  personalStatements: PersonalStatementGETData[] = [];
  
  async getMenuItemsAsyc(context: HcclUserContextGETData, dashboardType: 'advocate' | 'nonprofit' | 'parent' | 'service-provider' | 'employee' | 'ecoadmin' | 'student' | 'swcat'): Promise<MenuItem[]> { 
    switch (dashboardType) {
      case 'service-provider':
        const workQueueCriteria = {
          organizationId: context.currentUserProfile.organizationId,
          externalQueue: 1,
          includingStats: true,
          pageNumber: 1,
          pageSize: 50,
          isPaging: true
        }
        const queuRsp = await this.hcclService.findWorkQueues(workQueueCriteria).toPromise();
        this.queues  = queuRsp?.searchResults as WorkQueueGETData[] || [];


        const catalogCriteria = {
          organizationId: context.currentUserProfile.organizationId,
          pageNumber: 1,
          pageSize: 50,
          isPaging: true
        }
        const catalogRsp = await this.hcclService.findCatalogs(catalogCriteria).toPromise();
        const catalogs = catalogRsp?.searchResults as CatalogGETData[] || [];
        this.catalogs = catalogs;
        break;
      case 'student':
        // Fetch personal statements for the current user profile
        const personalStatementCriteria: PersonalStatementCriteria = {
          parentEntityId: context.currentUserProfileId,
          isPaging: false,
          maxResults: 100
        };
        const psRsp = await this.hcclService.findPersonalStatements(personalStatementCriteria).toPromise();
        this.personalStatements = psRsp?.searchResults as PersonalStatementGETData[] || [];
        break;
      case 'advocate':
      case 'employee':
      case 'nonprofit':
      case 'parent':
      case 'ecoadmin':
      case 'swcat':
      default:
        break;
    }
    return this.getMenuItems(dashboardType);
  }


  getMenuItems(dashboardType: 'advocate' | 'nonprofit' | 'parent' | 'service-provider' | 'employee' | 'ecoadmin' | 'student' | 'swcat'): MenuItem[] {
    switch (dashboardType) {
      case 'advocate':
          return this.buildAdvocateMenu();
      case 'nonprofit':
        return this.buildNonprofitMenu();
      case 'parent':
        return this.buildParentMenu();
      case 'service-provider':
        return this.buildServiceProviderMenu();
      case 'employee':
        return this.buildEmployeeMenu();
      case 'ecoadmin':
        return this.buildEcoAdminMenu();
      case 'student':
        return this.buildStudentMenu();
      case 'swcat':
        return this.buildSwcatMenu();
      default:
        return [];
    }
  }


  /**
   * Get the first navigable menu item based on user context and redirect to it
   * @param context - The HCCL context containing user profile information
   * @param router - The Angular router service for navigation
   * @returns The first navigable menu item or null if none found
   */
  async getFirstNavigableMenuItem(context: any, router: Router): Promise<MenuItem | null> {
    console.log('Starting menu navigation process');
    
    // Get the first menu item based on user context or default to advocate
    const dashboardType = this.getDashboardTypeFromContext(context);
    console.log('Determined dashboard type:', dashboardType);
    const menuItems = await this.getMenuItemsAsyc(context, dashboardType);
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
    
    const firstMenuItem = menuItems[0];
    return firstMenuItem;
  }

  /**
   * Determine dashboard type from HCCL context
   * @param context - The HCCL context containing user profile information
   * @returns The dashboard type based on user profile
   */
  
  /**
   * Find the first menu item that has a route (navigable)
   * @param menuItems - Array of menu items to search through
   * @returns The first navigable menu item or null if none found
   */
  public findFirstNavigableMenuItem(menuItems: MenuItem[]): MenuItem | null {
    console.log('Searching for first navigable menu item in:', menuItems);
    
    let item: MenuItem;
    for (item of menuItems) {
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
      parentMenuItem.open = false;
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

  newGroupMenuItem(label: string, icon: string): MenuItem {
    return {
      level: 1,
      label: label,
      route: '',
      componentPath: '',
      componentName: '',
      icon: icon
    };
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
    
    //    this.addMenuItem(menu, this.copyMenuItem(MENU_CONSTANTS.ADVOCATE_QUEUES));
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
   * Builds the nonprofit menu dynamically using the constants and helper methods
   * @returns Array of MenuItem objects for the nonprofit dashboard
   */
  buildNonprofitMenu(): MenuItem[] {
    const menu: MenuItem[] = [];
    
    // Add Dashboard
    const dashboard = this.copyMenuItem(MENU_CONSTANTS.NONPROFIT_DASHBOARD);
    this.addMenuItem(menu, dashboard);
    
    return menu;
  }

  /**
   * Builds the parent menu dynamically using the constants and helper methods
   * @returns Array of MenuItem objects for the parent dashboard
   */
  buildParentMenu(): MenuItem[] {
    const menu: MenuItem[] = [];
    
    // Add Dashboard
    const dashboard = this.copyMenuItem(MENU_CONSTANTS.PARENT_DASHBOARD);
    this.addMenuItem(menu, dashboard);
    
    return menu;
  }

  /**
   * Builds the service provider menu dynamically using the constants and helper methods
   * @returns Array of MenuItem objects for the service provider dashboard
   */
  buildServiceProviderMenu(): MenuItem[] {
    const menu: MenuItem[] = [];
    
    // Add Provider Dashboard with children
    const dashboard = this.copyMenuItem(MENU_CONSTANTS.PROVIDER_DASHBOARD);
    this.addChildMenuItem(dashboard, this.copyMenuItem(MENU_CONSTANTS.PROVIDER_DASHBOARD_TAB_MYDASH));
    this.addMenuItem(menu, dashboard);
    
    // Add Provider Details with children
    const details = this.copyMenuItem(MENU_CONSTANTS.PROVIDER_DETAILS);
    this.addChildMenuItem(details, this.copyMenuItem(MENU_CONSTANTS.PROVIDER_DETAILS_TAB_MYSCHOOL));
    this.addChildMenuItem(details, this.copyMenuItem(MENU_CONSTANTS.PROVIDER_DETAILS_TAB_COLLEAGUES));
    this.addMenuItem(menu, details);
    


    // Add Provider Catalog Dashboard with children
    const catalogMenu =  this.copyMenuItem(MENU_CONSTANTS.PROVIDER_CATALOG_TAB_DASH); //this.copyMenuItem(MENU_CONSTANTS.PROVIDER_CATALOG);
    for (const catalog of this.catalogs) {
      let menuItem =  {
        level: 2,
        label: '' + catalog.businessCode,
        route: '/provider-dashboard/catalogs/' + catalog.id,
        componentPath: 'src/app/features/dash-provider/catalog',
        componentName: 'provider-catalog-tab-dash',
        icon: 'fas fa-book'
      };
      this.addChildMenuItem(catalogMenu, menuItem);
    }
    //this.addChildMenuItem(catalogMenu, this.copyMenuItem(MENU_CONSTANTS.PROVIDER_CATALOG_TAB_DASH));
    this.addMenuItem(menu, catalogMenu);

    // Add Catalog Entry Signup Packets
    const signupPackets = this.copyMenuItem(MENU_CONSTANTS.PROVIDER_CATALOGENTRYSIGNUPPACKET_LIST);
    this.addMenuItem(menu, signupPackets);
    

    // Add Provider Work Request Dashboard with children
    //this.copyMenuItem(MENU_CONSTANTS.PROVIDER_WORKREQUEST);
    
    const workrequest = this.copyMenuItem(MENU_CONSTANTS.PROVIDER_WORKREQUEST_TAB_DASH);
    //alert('queues: ' + this.queues.length);
    for (const queue of this.queues) {
      let menuItem =  {
        level: 2,
        label: '' + queue.businessCode,
        route: '/provider-dashboard/workqueues/' + queue.id,
        componentPath: 'src/app/features/dash-provider/workrequest',
        componentName: 'provider-workrequest-tab-dash',
        icon: 'fas fa-ticket-alt'
      };
      this.addChildMenuItem(workrequest, menuItem);
    }
    
    //this.addChildMenuItem(workrequest, 
    this.addMenuItem(menu, workrequest);
    
    return menu;
  }

  /**
   * Builds the employee menu, mirroring nonprofit structure.
   */
  buildEmployeeMenu(): MenuItem[] {
    const menu: MenuItem[] = [];

    // Add Dashboard
    const dashboard = this.copyMenuItem(MENU_CONSTANTS.EMPLOYEE_DASHBOARD);
    this.addMenuItem(menu, dashboard);

    return menu;
  }

  /**
   * Builds the student menu dynamically using the constants and helper methods
   * @returns Array of MenuItem objects for the student dashboard
   */
  buildStudentMenu(): MenuItem[] {
    const menu: MenuItem[] = [];
    
    // Add Dashboard with children
    const dashboard = this.copyMenuItem(MENU_CONSTANTS.STUDENT_DASHBOARD);
    this.addMenuItem(menu, dashboard);

    const profile = this.copyMenuItem(MENU_CONSTANTS.STUDENT_PROFILE);
    this.addMenuItem(menu, profile);
    
    var m2 = this.copyMenuItem(MENU_CONSTANTS.STUDENT_MESSAGES);
    m2.level = 1
    m2.route = `/student-dashboard/messages`;
    this.addMenuItem(menu, m2);

    // Add My Calendar
    const calendar = this.copyMenuItem(MENU_CONSTANTS.STUDENT_CALENDAR);
    this.addMenuItem(menu, calendar);

    // Add My Feed
    const feed = this.copyMenuItem(MENU_CONSTANTS.STUDENT_FEED);
    this.addMenuItem(menu, feed);

    // Add Career Goals (Personal Statements list)
    var courses = this.copyMenuItem(MENU_CONSTANTS.STUDENT_PERSONALSTATEMENTS);
    this.addMenuItem(menu, courses);
    
    // Add dynamic menu items for each personal statement
    if (this.personalStatements && this.personalStatements.length > 0) {
      for (const ps of this.personalStatements) {
        const psMenuItem: MenuItem = {
          id: `${ps.id}`,
          level: 1,
          label: ps.name || 'Unnamed Career Goal',
          route: `/student-dashboard/personalstatements/${ps.id}`,
          componentPath: 'src/app/features/dash-student',
          componentName: 'student-personalstatement-group',
          icon: 'fas fa-bullseye'
        };
        this.addChildMenuItem(courses, psMenuItem);

        var catalogs = this.copyMenuItem(MENU_CONSTANTS.STUDENT_CATALOG);
        catalogs.id = `${ps.id}_CATALOG`;
        catalogs.level = 2
        catalogs.route = `/student-dashboard/personalstatements/${ps.id}/search`;
        this.addChildMenuItem(psMenuItem, catalogs);
        
        var engage = this.copyMenuItem(MENU_CONSTANTS.STUDENT_ENGAGE);
        engage.id = `${ps.id}_ENGAGE`;
        engage.level = 2
        engage.route = `/student-dashboard/personalstatements/${ps.id}/engage`;
        this.addChildMenuItem(psMenuItem, engage);

        // var messages = this.copyMenuItem(MENU_CONSTANTS.STUDENT_MESSAGES);
        // messages.level = 2
        // messages.route = `/student-dashboard/personalstatements/${ps.id}/messages`;
        // this.addChildMenuItem(psMenuItem, messages);
      }
    }
   
   
    // const messages = this.copyMenuItem(MENU_CONSTANTS.STUDENT_MESSAGES);
    // this.addMenuItem(menu, messages);

    // const interests = this.copyMenuItem(MENU_CONSTANTS.STUDENT_INTERESTS);
    // this.addMenuItem(menu, interests);

        // Add Progress with children
        // catalogs = this.copyMenuItem(MENU_CONSTANTS.STUDENT_CATALOG);
        // this.addMenuItem(menu, catalogs);
        
        //  engage = this.copyMenuItem(MENU_CONSTANTS.STUDENT_ENGAGE);
        // this.addMenuItem(menu, engage);
    
 
    // Add Research with child screens
    const research = this.copyMenuItem(MENU_CONSTANTS.STUDENT_RESEARCH);
    this.addChildMenuItem(research, this.copyMenuItem(MENU_CONSTANTS.STUDENT_RESEARCH_CAREERS));
    this.addChildMenuItem(research, this.copyMenuItem(MENU_CONSTANTS.STUDENT_RESEARCH_ORGS));
    this.addChildMenuItem(research, this.copyMenuItem(MENU_CONSTANTS.STUDENT_RESEARCH_ITEMS));
    this.addMenuItem(menu, research);
    
    // Add Resume Builder with Resume Entries as a child
    const resumeBuilder = this.copyMenuItem(MENU_CONSTANTS.STUDENT_RESUME_BUILDER);
    this.addMenuItem(menu, resumeBuilder);

    // Add Resume Entries as a child of Resume Builder
    const resumeEntriesForBuilder = this.copyMenuItem(MENU_CONSTANTS.STUDENT_RESUME_ENTRIES);
    this.addChildMenuItem(resumeBuilder, resumeEntriesForBuilder);

    // Add Progress with children
    const guidance = this.copyMenuItem(MENU_CONSTANTS.STUDENT_GUIDANCE);
    this.addMenuItem(menu, guidance);
    
    // const progress = this.copyMenuItem(MENU_CONSTANTS.STUDENT_PROGRESS);
    // this.addMenuItem(menu, progress);
    
    // Add Schedule with children
    //const schedule = this.copyMenuItem(MENU_CONSTANTS.STUDENT_SCHEDULE);
    //this.addMenuItem(menu, schedule);
    
    return menu;
  }

  /**
   * Builds the swcat menu dynamically using the constants and helper methods
   * @returns Array of MenuItem objects for the swcat dashboard
   */
  buildSwcatMenu(): MenuItem[] {
    const menu: MenuItem[] = [];
    
    // Add Home with children
    const home = this.copyMenuItem(MENU_CONSTANTS.SWCAT_HOME);
    this.addMenuItem(menu, home);
    
    // Add Assets
    const assets = this.copyMenuItem(MENU_CONSTANTS.SWCAT_ASSETS);
    this.addMenuItem(menu, assets);
    
    // Add Trutesta
    const trutesta = this.copyMenuItem(MENU_CONSTANTS.SWCAT_TRUTESTA);
    this.addMenuItem(menu, trutesta);
    
    // Add SemaTree
    const sematree = this.copyMenuItem(MENU_CONSTANTS.SWCAT_SEMATREE);
    this.addMenuItem(menu, sematree);
    
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

    const onboarding = this.newGroupMenuItem('Onboarding', 'fas fa-users');
    this.addChildMenuItem(onboarding, this.copyMenuItem(MENU_CONSTANTS.EA_ORGSCHOOLS_LIST));
    this.addChildMenuItem(onboarding, this.copyMenuItem(MENU_CONSTANTS.EA_ORGNONPROFITS_LIST));
    this.addChildMenuItem(onboarding, this.copyMenuItem(MENU_CONSTANTS.EA_ORG_BUSINESSES_LIST));
    this.addMenuItem(menu, onboarding);

    const providerGroup = this.newGroupMenuItem('Provider Setup', 'fas fa-users');
    const courseGroup = this.newGroupMenuItem('Catalog Setup', 'fas fa-book');
    const clschoolGroup = this.newGroupMenuItem('Users and Orgs Setup', 'fas fa-school');

    const workGroup = this.newGroupMenuItem('Work Setup', 'fas fa-tasks');


    const teamGroup = this.newGroupMenuItem('Team Setup', 'fas fa-users');
    this.addMenuItem(menu, workGroup);
    this.addMenuItem(menu, teamGroup);

    this.addMenuItem(menu, providerGroup);
    this.addMenuItem(menu, courseGroup);
    this.addMenuItem(menu, clschoolGroup);


    // Add Provider Type Ref
    const providerTypeRef = this.copyMenuItem(MENU_CONSTANTS.EA_PROVIDERTYPEREF_LIST);
    this.addChildMenuItem(providerGroup, providerTypeRef);

    // Add Provider
    const providerList = this.copyMenuItem(MENU_CONSTANTS.EA_PROVIDER_LIST);
    this.addChildMenuItem(providerGroup, providerList);

    // Add Provider Request
    const providerRequestList = this.copyMenuItem(MENU_CONSTANTS.EA_PROVIDERREQUEST_LIST);
    this.addChildMenuItem(providerGroup, providerRequestList);

    // Add Provider Request Type Ref
    const providerRequestTypeRefList = this.copyMenuItem(MENU_CONSTANTS.EA_PROVIDERREQUESTTYPEREF_LIST);
    this.addChildMenuItem(providerGroup, providerRequestTypeRefList);

    // Add CatalogEntrySignupPacket
    const catalogentrysignuppacketList = this.copyMenuItem(MENU_CONSTANTS.EA_CATALOGENTRYSIGNUPPACKET_LIST);
    this.addChildMenuItem(providerGroup, catalogentrysignuppacketList);
    

    // course list
    const courseList = this.copyMenuItem(MENU_CONSTANTS.EA_CLCOURSE_LIST);
    this.addChildMenuItem(courseGroup, courseList);

    // catalog list
    const catalogList = this.copyMenuItem(MENU_CONSTANTS.EA_CATALOG_LIST);
    this.addChildMenuItem(courseGroup, catalogList);

    // catalogentry list
    const catalogEntryList = this.copyMenuItem(MENU_CONSTANTS.EA_CATALOGENTRY_LIST);
    this.addChildMenuItem(courseGroup, catalogEntryList);

    // catalogtyperef list
    const catalogTypeRefList = this.copyMenuItem(MENU_CONSTANTS.EA_CATALOGTYPEREF_LIST);
    this.addChildMenuItem(courseGroup, catalogTypeRefList);

    // paipromptref list
    const paiPromptRefList = this.copyMenuItem(MENU_CONSTANTS.EA_PAIPROMPTREF_LIST);
    this.addChildMenuItem(courseGroup, paiPromptRefList);


    // clschool list
    const clschoolList = this.copyMenuItem(MENU_CONSTANTS.EA_CLSCHOOL_LIST);
    this.addChildMenuItem(clschoolGroup, clschoolList);

    // hcclorganization list
    const hcclorganizationList = this.copyMenuItem(MENU_CONSTANTS.EA_HCCLORGANIZATION_LIST);
    this.addChildMenuItem(clschoolGroup, hcclorganizationList);

    // hcclorganizationtyperef list
    const hcclorganizationtyperefList = this.copyMenuItem(MENU_CONSTANTS.EA_HCCLORGANIZATIONTYPEREF_LIST);
    this.addChildMenuItem(clschoolGroup, hcclorganizationtyperefList);

    // hccluser list
    const hccluserList = this.copyMenuItem(MENU_CONSTANTS.EA_HCCLUSER_LIST);
    this.addChildMenuItem(clschoolGroup, hccluserList);

    // hccluserprofile list
    const hccluserprofileList = this.copyMenuItem(MENU_CONSTANTS.EA_HCCLUSERPROFILE_LIST);
    this.addChildMenuItem(clschoolGroup, hccluserprofileList);
    // workqueuetyperef list
    const workqueuetyperefList = this.copyMenuItem(MENU_CONSTANTS.EA_WORKQUEUETYPEREF_LIST);
    this.addChildMenuItem(workGroup, workqueuetyperefList);

    // workrequesttyperef list
    const workrequesttyperefList = this.copyMenuItem(MENU_CONSTANTS.EA_WORKREQUESTTYPEREF_LIST);
    this.addChildMenuItem(workGroup, workrequesttyperefList);

    // workqueue list
    const workqueueList = this.copyMenuItem(MENU_CONSTANTS.EA_WORKQUEUE_LIST);
    this.addChildMenuItem(workGroup, workqueueList);

    // workrequest list
    const workrequestList = this.copyMenuItem(MENU_CONSTANTS.EA_WORKREQUEST_LIST);
    this.addChildMenuItem(workGroup, workrequestList);

    // workrequestitem list
    const workrequestitemList = this.copyMenuItem(MENU_CONSTANTS.EA_WORKREQUESTITEM_LIST);
    this.addChildMenuItem(workGroup, workrequestitemList);

    // workrequestlog list
    const workrequestlogList = this.copyMenuItem(MENU_CONSTANTS.EA_WORKREQUESTLOG_LIST);
    this.addChildMenuItem(workGroup, workrequestlogList);

    // catalogsearchresult list
    const catalogsearchresultList = this.copyMenuItem(MENU_CONSTANTS.EA_CATALOGSEARCHRESULT_LIST);
    this.addChildMenuItem(workGroup, catalogsearchresultList);

    // catalogsearchresultentry list
    const catalogsearchresultentryList = this.copyMenuItem(MENU_CONSTANTS.EA_CATALOGSEARCHRESULTENTRY_LIST);
    this.addChildMenuItem(workGroup, catalogsearchresultentryList);


    // teamMemberRoleRef list
    const teamMemberRoleRefList = this.copyMenuItem(MENU_CONSTANTS.EA_TEAMMEMBERROLEREF_LIST);
    this.addChildMenuItem(teamGroup, teamMemberRoleRefList);

    // teamTypeRef list
    const teamTypeRefList = this.copyMenuItem(MENU_CONSTANTS.EA_TEAMTYPEREF_LIST);
    this.addChildMenuItem(teamGroup, teamTypeRefList);

    // hcclTeam list
    const hcclTeamList = this.copyMenuItem(MENU_CONSTANTS.EA_HCCLTEAM_LIST);
    this.addChildMenuItem(teamGroup, hcclTeamList);

    // teamMember list
    const teamMemberList = this.copyMenuItem(MENU_CONSTANTS.EA_TEAMMEMBER_LIST);
    this.addChildMenuItem(teamGroup, teamMemberList);

    // hcclTeamLog list
    const hcclTeamLogList = this.copyMenuItem(MENU_CONSTANTS.EA_HCCLTEAMLOG_LIST);
    this.addChildMenuItem(teamGroup, hcclTeamLogList);

    // Add Vocode group
    const vocodeGroup = this.newGroupMenuItem('Vocode', 'fas fa-code');
    this.addMenuItem(menu, vocodeGroup);

    // Add PersonalStatement
    const personalStatementList = this.copyMenuItem(MENU_CONSTANTS.EA_PERSONALSTATEMENT_LIST);
    this.addChildMenuItem(vocodeGroup, personalStatementList);

    // Add PersonalStatementResume
    const personalStatementResumeList = this.copyMenuItem(MENU_CONSTANTS.EA_PERSONALSTATEMENTRESUME_LIST);
    this.addChildMenuItem(vocodeGroup, personalStatementResumeList);

    // Add CatalogEntryInterest
    const catalogentryinterestList = this.copyMenuItem(MENU_CONSTANTS.EA_CATALOGENTRYINTEREST_LIST);
    this.addChildMenuItem(vocodeGroup, catalogentryinterestList);

    // Add VocationEncodingRef
    const vocationEncodingRefList = this.copyMenuItem(MENU_CONSTANTS.EA_VOCATIONENCODINGREF_LIST);
    this.addChildMenuItem(vocodeGroup, vocationEncodingRefList);

    // Add UI Starter as the last top-level menu item
    const uiStarter = this.copyMenuItem(MENU_CONSTANTS.EA_UISTARTER);
    this.addMenuItem(menu, uiStarter);

    return menu;
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
  ADVOCATE_PROVIDERREQUESTTYPEREFS: {
    level: 2,
    label: 'Provider Request Type Refs',
    route: '/advocate-dashboard/integrations/providerrequesttyperefs',
    componentPath: 'src/app/components/_crud/providerrequesttyperef/providerrequesttyperef-list.component',
    componentName: 'ProviderRequestTypeRefListComponent',
    icon: 'fas fa-list'
  },
  ADVOCATE_PROVIDERREQUESTS: {
    level: 2,
    label: 'Provider Requests',
    route: '/advocate-dashboard/integrations/providerrequests',
    componentPath: 'src/app/components/_crud/providerrequest/providerrequest-list.component',
    componentName: 'ProviderRequestListComponent',
    icon: 'fas fa-clipboard-list'
  },
  ADVOCATE_COMPONENT_INVENTORY: {
    level: 1,
    label: 'Component Inventory',
    route: '/advocate-dashboard/uistarter',
    componentPath: 'src/app/views/uistarter',
    componentName: 'uistarter-home',
    icon: 'fas fa-ticket-alt'
  },
  ADVOCATE_BUBA_DEMO: {
    level: 2,
    label: 'Buba Demo',
    route: '/advocate-dashboard/component-inventory/buba-demo',
    componentPath: 'src/app/components/_global/std-buba',
    componentName: 'BubaDemoComponent',
    icon: 'fas fa-cube'
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

  // Provider Dashboard Menu Items
  PROVIDER_DASHBOARD: {
    level: 1,
    label: 'Provider Dashboard',
    route: '/provider-dashboard/dashboard',
    componentPath: 'src/app/features/dash-provider/dashboard',
    componentName: 'provider-dashboard-group',
    icon: 'fas fa-tachometer-alt'
  },
  PROVIDER_DASHBOARD_TAB_MYDASH: {
    level: 2,
    label: 'Dashboard',
    route: '/provider-dashboard/dashboard',
    componentPath: 'src/app/features/dash-provider/dashboard',
    componentName: 'provider-dashboard-tab-mydash',
    icon: 'fas fa-tachometer-alt'
  },
  PROVIDER_DETAILS: {
    level: 1,
    label: 'Provider Details',
    route: '/provider-dashboard/details',
    componentPath: 'src/app/features/dash-provider/details',
    componentName: 'provider-details-group',
    icon: 'fas fa-building'
  },
  PROVIDER_DETAILS_TAB_MYSCHOOL: {
    level: 2,
    label: 'My School',
    route: '/provider-dashboard/details',
    componentPath: 'src/app/features/dash-provider/details',
    componentName: 'provider-details-tab-myschool',
    icon: 'fas fa-school'
  },
  PROVIDER_DETAILS_TAB_COLLEAGUES: {
    level: 2,
    label: 'Colleagues',
    route: '/provider-dashboard/details',
    componentPath: 'src/app/features/dash-provider/details',
    componentName: 'provider-details-tab-colleagues',
    icon: 'fas fa-users'
  },
  PROVIDER_WORKREQUEST: {
    level: 1,
    label: 'Provider Work Request Dashboard',
    route: '/provider-dashboard/workrequest',
    componentPath: 'src/app/features/dash-provider/workrequest',
    componentName: 'provider-workqueue-group',
    icon: 'fas fa-tasks'
  },
  PROVIDER_WORKREQUEST_TAB_DASH: {
    level: 2,
    label: 'Work Requests',
    route: '/provider-dashboard/workrequest',
    componentPath: 'src/app/features/dash-provider/workrequest',
    componentName: 'provider-workrequest-tab-dash',
    icon: 'fas fa-tasks'
  },
  PROVIDER_CATALOG: {
    level: 1,
    label: 'Catalog Dashboard',
    route: '/provider-dashboard/catalog',
    componentPath: 'src/app/features/dash-provider/catalog',
    componentName: 'provider-catalog-group',
    icon: 'fas fa-book'
  },
  PROVIDER_CATALOG_TAB_DASH: {
    level: 2,
    label: 'Catalogs',
    route: '/provider-dashboard/catalogs',
    componentPath: 'src/app/features/dash-provider/catalogs',
    componentName: 'provider-catalog-tab-dash',
  },
  PROVIDER_CATALOGENTRYSIGNUPPACKET_LIST: {
    level: 1,
    label: 'Signup Packets',
    route: '/provider-dashboard/catalogentrysignuppackets',
    componentPath: 'src/app/components/_crud/catalogentrysignuppacket/catalogentrysignuppacket-list.component',
    componentName: 'CatalogEntrySignupPacketListComponent',
    icon: 'fas fa-clipboard-list' 
  },

  // Employee Dashboard Menu Items
  EMPLOYEE_DASHBOARD: {
    level: 1,
    label: 'Employee Dashboard',
    route: '/employee-dashboard/home',
    componentPath: 'src/app/features/dash-employee',
    componentName: 'dash-employee-home',
    icon: 'fas fa-briefcase'
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
  "label" : "CL Schools",
  "route" : "/ecoadmin-dashboard/clschools",
  "componentPath" : "/src/app/components/_crud/clschool/clschool-list.component",
  "componentName" : "CLSchoolListComponent",
  "icon" : "fas fa-school"
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


EA_TEAMTYPEMEMBERROLEREF_LIST: {
  "level" : 2,
  "label" : "Team Type Member Role Ref",
  "route" : "/ecoadmin-dashboard/teams/teamtypememberroleref-list",
  "componentPath" : "/src/app/components/_crud/teams/teamtypememberroleref-list",
  "componentName" : "teamtypememberroleref-list",
  "icon" : ""
},

EA_HCCLTEAM_LIST: {
  level: 1,
  label: 'Hccl Teams',
  route: '/ecoadmin-dashboard/hcclTeams',
  componentPath: 'src/app/components/_crud/hcclteam/hcclteam-list.component',
  componentName: 'HcclTeamListComponent',
  icon: 'fas fa-users'
},

EA_TEAMMEMBER_LIST: {
  level: 1,
  label: 'Team Members',
  route: '/ecoadmin-dashboard/teamMembers',
  componentPath: 'src/app/components/_crud/teammember/teammember-list.component',
  componentName: 'TeamMemberListComponent',
  icon: 'fas fa-users'
},

EA_HCCLTEAMLOG_LIST: {
  level: 1,
  label: 'Hccl Team Logs',
  route: '/ecoadmin-dashboard/hcclteamlogs',
  componentPath: 'src/app/components/_crud/hcclteamlog/hcclteamlog-list.component',
  componentName: 'HcclTeamLogListComponent',
  icon: 'fas fa-list'
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
  level: 1,
  label: 'Team Member Role Refs',
  route: '/ecoadmin-dashboard/teamMemberRoleRefs',
  componentPath: 'src/app/components/_crud/teammemberroleref/teammemberroleref-list.component',
  componentName: 'TeamMemberRoleRefListComponent',
  icon: 'fas fa-list'
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
  "label" : "HCCL User Profiles",
  "route" : "/ecoadmin-dashboard/hccluserprofiles",
  "componentPath" : "/src/app/components/_crud/hccluserprofile/hccluserprofile-list.component",
  "componentName" : "HcclUserProfileListComponent",
  "icon" : "fas fa-user-circle"
},

EA_HCCLORGANIZATION_LIST: {
  "level" : 2,
  "label" : "HCCL Organizations",
  "route" : "/ecoadmin-dashboard/hcclorganizations",
  "componentPath" : "/src/app/components/_crud/hcclorganization/hcclorganization-list.component",
  "componentName" : "HcclOrganizationListComponent",
  "icon" : "fas fa-building"
},


EA_TEAMTYPEREF_LIST: {
  level: 1,
  label: 'Team Type Refs',
  route: '/ecoadmin-dashboard/teamTypeRefs',
  componentPath: 'src/app/components/_crud/teamtyperef/teamtyperef-list.component',
  componentName: 'TeamTypeRefListComponent',
  icon: 'fas fa-list'
},

EA_HCCLORGANIZATIONTYPEREF_LIST: {
  "level" : 2,
  "label" : "HCCL Organization Type Refs",
  "route" : "/ecoadmin-dashboard/hcclorganizationtyperefs",
  "componentPath" : "/src/app/components/_crud/hcclorganizationtyperef/hcclorganizationtyperef-list.component",
  "componentName" : "HcclOrganizationTypeRefListComponent",
  "icon" : "fas fa-sitemap"
},

EA_HCCLUSER_LIST: {
  "level" : 2,
  "label" : "HCCL Users",
  "route" : "/ecoadmin-dashboard/hcclusers",
  "componentPath" : "/src/app/components/_crud/hccluser/hccluser-list.component",
  "componentName" : "HcclUserListComponent",
  "icon" : "fas fa-users"
},



//  /ecoadmin-dashboard/prov menu items 
EA_PROVIDER_LIST: {
  "level" : 2,
  "label" : "Provider",
  "route" : "/ecoadmin-dashboard/providers",
  "componentPath" : "src/app/components/_crud/provider/provider-list.component",
  "componentName" : "ProviderListComponent",
  "icon" : "fas fa-building"
},

EA_PROVIDERUSER_LIST: {
  "level" : 2,
  "label" : "Provider User",
  "route" : "/ecoadmin-dashboard/providers",
  "componentPath" : "src/app/components/_crud/provider/provider-list.component",
  "componentName" : "ProviderListComponent",
  "icon" : "fas fa-users"
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
  "label" : "Work Request Type Refs",
  "route" : "/ecoadmin-dashboard/workrequesttyperefs",
  "componentPath" : "/src/app/components/_crud/workrequesttyperef/workrequesttyperef-list.component",
  "componentName" : "WorkRequestTypeRefListComponent",
  "icon" : "fas fa-tasks"
},

EA_WORKQUEUE_LIST: {
  "level" : 2,
  "label" : "Work Queues",
  "route" : "/ecoadmin-dashboard/workqueues",
  "componentPath" : "/src/app/components/_crud/workqueue/workqueue-list.component",
  "componentName" : "WorkQueueListComponent",
  "icon" : "fas fa-list"
},

EA_WORKREQUESTITEM_LIST: {
  "level" : 2,
  "label" : "Work Request Items",
  "route" : "/ecoadmin-dashboard/workrequestitems",
  "componentPath" : "/src/app/components/_crud/workrequestitem/workrequestitem-list.component",
  "componentName" : "WorkRequestItemListComponent",
  "icon" : "fas fa-list"
},

EA_WORKQUEUETYPEREF_LIST: {
  "level" : 2,
  "label" : "Work Queue Type Ref",
  "route" : "/ecoadmin-dashboard/workqueuetyperefs",
  "componentPath" : "/src/app/components/_crud/workqueuetyperef/workqueuetyperef-list",
  "componentName" : "WorkQueueTypeRefListComponent",
  "icon" : ""
},

EA_WORKREQUESTLOG_LIST: {
  "level" : 2,
  "label" : "Work Request Logs",
  "route" : "/ecoadmin-dashboard/workrequestlogs",
  "componentPath" : "src/app/components/_crud/workrequestlog/workrequestlog-list.component",
  "componentName" : "WorkRequestLogListComponent",
  "icon" : "fas fa-list"
},



EA_WORKREQUEST_LIST: {
  "level" : 2,
  "label" : "Work Requests",
  "route" : "/ecoadmin-dashboard/workrequests",
  "componentPath" : "/src/app/components/_crud/workrequest/workrequest-list.component",
  "componentName" : "WorkRequestListComponent",
  "icon" : "fas fa-list"
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
  "componentPath" : "src/app/components/_crud/catalog/catalog-list.component",
  "componentName" : "CatalogListComponent",
  "icon" : "fas fa-list"
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
  "label" : "Catalog Search Results",
  "route" : "/ecoadmin-dashboard/catalogsearchresults",
  "componentPath" : "src/app/components/_crud/catalogsearchresult/catalogsearchresult-list.component",
  "componentName" : "CatalogSearchResultListComponent",
  "icon" : "fas fa-list"
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

EA_CATALOGTYPEREF_LIST: {
  "level" : 2,
  "label" : "Catalog Type Ref",
  "route" : "/ecoadmin-dashboard/catalogtyperefs",
  "componentPath" : "/src/app/components/_crud/catalogtyperef/catalogtyperef-list.component",
  "componentName" : "CatalogTypeRefListComponent",
  "icon" : "fas fa-tags"
},

EA_PAIPROMPTREF_LIST: {
  "level" : 2,
  "label" : "PAI Prompt Refs",
  "route" : "/ecoadmin-dashboard/paipromptrefs",
  "componentPath" : "/src/app/components/_crud/paiprompt/paipromptref-list.component",
  "componentName" : "PAIPromptRefListComponent",
  "icon" : "fas fa-robot"
},

EA_CATALOGSEARCHRESULTENTRY_LIST: {
  "level" : 2,
  "label" : "Catalog Search Result Entries",
  "route" : "/ecoadmin-dashboard/catalogsearchresultentries",
  "componentPath" : "src/app/components/_crud/catalogsearchresultentry/catalogsearchresultentry-list.component",
  "componentName" : "CatalogSearchResultEntryListComponent",
  "icon" : "fas fa-list"
},

//  /ecoadmin-dashboard/vocode menu items 
EA_PERSONALSTATEMENT_LIST: {
  "level" : 2,
  "label" : "Personal Statements",
  "route" : "/ecoadmin-dashboard/personalstatements",
  "componentPath" : "src/app/components/_crud/personalstatement/personalstatement-list.component",
  "componentName" : "PersonalStatementListComponent",
  "icon" : "fas fa-file-alt"
},

EA_PERSONALSTATEMENTRESUME_LIST: {
  level: 2,
  label: 'Personal Statement Resumes',
  route: '/ecoadmin-dashboard/personalstatementresumes',
  componentPath: 'src/app/components/_crud/personalstatementresume/personalstatementresume-list.component',
  componentName: 'PersonalStatementResumeListComponent',
  icon: 'fas fa-file-alt'
},

EA_CATALOGENTRYINTEREST_LIST: {
  "level" : 2,
  "label" : "Catalog Entry Interests",
  "route" : "/ecoadmin-dashboard/catalogentryinterests",
  "componentPath" : "src/app/components/_crud/catalogentryinterest/catalogentryinterest-list.component",
  "componentName" : "CatalogEntryInterestListComponent",
  "icon" : "fas fa-heart"
},

EA_CATALOGENTRYSIGNUPPACKET_LIST: {
  level: 2,
  label: 'Catalog Entry Signup Packets',
  route: '/ecoadmin-dashboard/catalogentrysignuppackets',
  componentPath: 'src/app/components/_crud/catalogentrysignuppacket/catalogentrysignuppacket-list.component',
  componentName: 'CatalogEntrySignupPacketListComponent',
  icon: 'fas fa-clipboard-list'
},

EA_VOCATIONENCODINGINSTANCE_LIST: {
  "level" : 2,
  "label" : "Vocation Encoding Instance",
  "route" : "/ecoadmin-dashboard/vocode/vocationencodinginstance-list",
  "componentPath" : "/src/app/components/_crud/vocode/vocationencodinginstance-list",
  "componentName" : "vocationencodinginstance-list",
  "icon" : ""
},

EA_VOCATIONENCODINGREF_LIST: {
  level: 1,
  label: 'Vocation Encoding Refs',
  route: '/ecoadmin-dashboard/vocationencodingrefs',
  componentPath: 'src/app/components/_crud/vocationencodingref/vocationencodingref-list.component',
  componentName: 'VocationEncodingRefListComponent',
  icon: 'fas fa-code'
},

EA_UISTARTER: {
  level: 1,
  label: 'UI Starter',
  route: '/ecoadmin-dashboard/uistarter',
  componentPath: 'src/app/views/uistarter',
  componentName: 'uistarter-home',
  icon: 'fas fa-palette'
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
  "route" : "/ecoadmin-dashboard/providerrequests",
  "componentPath" : "src/app/components/_crud/providerrequest/providerrequest-list.component",
  "componentName" : "ProviderRequestListComponent",
  "icon" : "fas fa-clipboard-list"
},

EA_PROVIDERREQUESTTYPEREF_LIST: {
  "level" : 2,
  "label" : "Provider Request Type Ref",
  "route" : "/ecoadmin-dashboard/providerrequesttyperefs",
  "componentPath" : "src/app/components/_crud/providerrequesttyperef/providerrequesttyperef-list.component",
  "componentName" : "ProviderRequestTypeRefListComponent",
  "icon" : "fas fa-list"
},

// Bespoke org types - for onboarding.
EA_ORGSCHOOLS_LIST: {
  "level" : 2,
  "label" : "Org Schools",
  "route" : "/ecoadmin-dashboard/orgs/schools",
  "componentPath" : "/src/app/features/dash-ecoadmin/orgs/org-schools-group.component",
  "componentName" : "OrgSchoolsGroupComponent",
  "icon" : "fas fa-building"
},
EA_ORGNONPROFITS_LIST: {
  "level" : 2,
  "label" : "Org Nonprofits",
  "route" : "/ecoadmin-dashboard/orgs/nonprofits",
  "componentPath" : "/src/app/features/dash-ecoadmin/orgs/org-nonprofit-group.component",
  "componentName" : "OrgNonprofitGroupComponent",
  "icon" : "fas fa-building"
},
  EA_ORG_BUSINESSES_LIST: {
    "level" : 2,
    "label" : "Org Businesses",
    "route" : "/ecoadmin-dashboard/orgs/businesses",
    "componentPath" : "/src/app/features/dash-ecoadmin/orgs/org-business-group.component",
    "componentName" : "OrgBusinessGroupComponent",
    "icon" : "fas fa-building"
  },

  // Student Dashboard Menu Items
  STUDENT_DASHBOARD: {
    level: 1,
    label: 'My Dashboard',
    route: '/student-dashboard/home',
    componentPath: 'src/app/features/dash-student',
    componentName: 'dash-student-home',
    icon: 'fas fa-tachometer-alt'
  },
  STUDENT_PROFILE: {
    level: 1,
    label: 'My Profile',
    route: '/student-dashboard/profile',
    componentPath: 'src/app/features/dash-student/student-profile-ui',
    componentName: 'student-profile-ui',
    icon: 'fas fa-user'
  },
  STUDENT_PERSONALSTATEMENTS: {
    level: 1,
    label: 'Personal Goals',
    route: '/student-dashboard/personalstatements',
    componentPath: 'src/app/features/dash-student',
    componentName: 'dash-student-personalstatements',
    icon: 'fas fa-book'
  },
  STUDENT_PROGRESS: {
    level: 1,
    label: 'Progress',
    route: '/student-dashboard/progress',
    componentPath: 'src/app/features/dash-student',
    componentName: 'dash-student-progress',
    icon: 'fas fa-chart-line'
  },
  STUDENT_GUIDANCE: {
    level: 1,
    label: 'Guidance & Support',
    route: '/student-dashboard/guidance',
    componentPath: 'src/app/features/dash-student',
    componentName: 'dash-student-guidance',
    icon: 'fas fa-life-ring'
  },
  STUDENT_RESEARCH: {
    level: 1,
    label: 'Research',
    route: '/student-dashboard/research',
    componentPath: 'src/app/features/dash-student',
    componentName: 'student-research',
    icon: 'fas fa-search'
  },
  STUDENT_RESEARCH_CAREERS: {
    level: 2,
    label: 'Research Careers',
    route: '/student-dashboard/research/careers',
    componentPath: 'src/app/features/dash-student/student-research-careers',
    componentName: 'student-research-careers',
    icon: 'fas fa-search'
  },
  STUDENT_RESEARCH_ORGS: {
    level: 2,
    label: 'Research Orgs',
    route: '/student-dashboard/research/orgs',
    componentPath: 'src/app/features/dash-student/student-research-orgs',
    componentName: 'student-research-orgs',
    icon: 'fas fa-building'
  },
  STUDENT_RESEARCH_ITEMS: {
    level: 2,
    label: 'Research Items',
    route: '/student-dashboard/research/items',
    componentPath: 'src/app/features/dash-student/student-research-items',
    componentName: 'student-research-items',
    icon: 'fas fa-search'
  },
  STUDENT_RESUME_BUILDER: {
    level: 1,
    label: 'Resume Builder',
    route: '/student-dashboard/resumebuilder',
    componentPath: 'src/app/features/dash-student/student-resumebuilder',
    componentName: 'student-resumebuilder',
    icon: 'fas fa-file-alt'
  },
  STUDENT_ENGAGE: {
    level: 1,
    label: 'Engage',
    route: '/student-dashboard/engage',
    componentPath: 'src/app/features/dash-student',
    componentName: 'dash-student-engage',
    icon: 'fas fa-envelope'
  },
  STUDENT_MESSAGES: {
    level: 1,
    label: 'My Communications',
    route: '/student-dashboard/messages',
    componentPath: 'src/app/features/dash-student',
    componentName: 'dash-student-messages',
    icon: 'fas fa-envelope'
  },
  STUDENT_CALENDAR: {
    level: 1,
    label: 'My Calendar',
    route: '/student-dashboard/calendar',
    componentPath: 'src/app/features/dash-student',
    componentName: 'dash-student-calendar',
    icon: 'fas fa-calendar-alt'
  },
  STUDENT_FEED: {
    level: 1,
    label: 'My Feed',
    route: '/student-dashboard/feed',
    componentPath: 'src/app/features/dash-student',
    componentName: 'dash-student-feed',
    icon: 'fas fa-stream'
  },
  STUDENT_INTERESTS: {
    level: 1,
    label: 'Interests',
    route: '/student-dashboard/interests',
    componentPath: 'src/app/features/dash-student',
    componentName: 'dash-student-interests',
    icon: ''
  },

//  /ecoadmin-dashboard/catalog menu items 
STUDENT_CATALOG: {
  "level" : 2,
  "label" : "Catalog Search",
  "route" : "/student-dashboard/catalogs",
  "componentPath" : "src/app/features/dash-studentt",
  "componentName" : "dash-student-catalog",
  "icon" : "fas fa-list"
},
  STUDENT_SCHEDULE: {
    level: 1,
    label: 'Schedule',
    route: '/student-dashboard/schedule',
    componentPath: 'src/app/features/dash-student',
    componentName: 'dash-student-schedule',
    icon: 'fas fa-calendar'
  },
  STUDENT_UISTARTER: {
    level: 1,
    label: 'UI Starter',
    route: '/student-dashboard/uistarter',
    componentPath: 'src/app/views/uistarter',
    componentName: 'uistarter-home',
    icon: 'fas fa-palette'
  },
  STUDENT_RESUMES: {
    level: 1,
    label: 'Resumes',
    route: '/student-dashboard/resumes',
    componentPath: 'src/app/features/dash-student',
    componentName: 'dash-student-resumes',
    icon: 'fas fa-file-alt'
  },
  STUDENT_RESUME_ENTRIES: {
    level: 2,
    label: 'Resume Entries',
    route: '/student-dashboard/resumeentries',
    componentPath: 'src/app/features/dash-student',
    componentName: 'student-resumeentry-group',
    icon: 'fas fa-list'
  },

  // SWCAT Dashboard Menu Items
  SWCAT_HOME: {
    level: 1,
    label: 'Home',
    route: '/swcat-dashboard/home',
    componentPath: 'src/app/features/dash-swcat',
    componentName: 'dash-swcat-home-group',
    icon: 'fas fa-home'
  },
  SWCAT_ASSETS: {
    level: 1,
    label: 'Assets',
    route: '/swcat-dashboard/assets',
    componentPath: 'src/app/features/dash-swcat',
    componentName: 'dash-swcat-assets-group',
    icon: 'fas fa-cube'
  },
  SWCAT_TRUTESTA: {
    level: 1,
    label: 'Trutesta',
    route: '/swcat-dashboard/trutesta',
    componentPath: 'src/app/features/dash-swcat',
    componentName: 'dash-swcat-trutesta-group',
    icon: 'fas fa-chart-line'
  },
  SWCAT_SEMATREE: {
    level: 1,
    label: 'SemaTree',
    route: '/swcat-dashboard/sematree',
    componentPath: 'src/app/features/dash-swcat',
    componentName: 'dash-swcat-sematree-group',
    icon: 'fas fa-tree'
  },

  // Nonprofit Dashboard Menu Items
  NONPROFIT_DASHBOARD: {
    level: 1,
    label: 'Dashboard',
    route: '/nonprofit-dashboard/home',
    componentPath: 'src/app/features/dash-nonprofit',
    componentName: 'dash-nonprofit-home',
    icon: 'fas fa-tachometer-alt'
  },

  // Parent Dashboard Menu Items
  PARENT_DASHBOARD: {
    level: 1,
    label: 'Dashboard',
    route: '/parent-dashboard/home',
    componentPath: 'src/app/features/dash-parent',
    componentName: 'dash-parent-home',
    icon: 'fas fa-tachometer-alt'
  }
};