import { Injectable } from '@angular/core';

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

  getMenuItems(dashboardType: 'advocate' | 'broker' | 'service-provider'): MenuItem[] {
    switch (dashboardType) {
      case 'advocate':
        return this.advocateMenuItems;
      case 'broker':
        return this.brokerMenuItems;
      case 'service-provider':
        return this.serviceProviderMenuItems;
      default:
        return [];
    }
  }

  getDashboardTypeFromRoute(route: string): 'advocate' | 'broker' | 'service-provider' | null {
    if (route.startsWith('/advocate-dashboard')) {
      return 'advocate';
    } else if (route.startsWith('/broker-dashboard')) {
      return 'broker';
    } else if (route.startsWith('/service-provider-dashboard')) {
      return 'service-provider';
    }
    return null;
  }
} 