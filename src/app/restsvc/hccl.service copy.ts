import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { CommonRequestServiceCaller, CommonServiceRequest } from './common-request-service.model';

// ============================================================================
// INTERFACES - HEALTH CHECKS
// ============================================================================

export interface ServiceManifest {
  buildId?: string;
  buildNumber?: string;
  buildTime?: string;
  buildJdk?: string;
  buildUrl?: string;
  gitUrl?: string;
  gitBranch?: string;
  gitCommit?: string;
  builtBy?: string;
  implementationVersion?: string;
  implementationTitle?: string;
  implementationVendorId?: string;
  specificationVersion?: string;
  specificationTitle?: string;
  dockerImageName?: string;
  dockerImageVersion?: string;
  clusterName?: string;
  clusterType?: string;
}

// ============================================================================
// INTERFACES - DEBUG LOGGERS
// ============================================================================

export interface LoggerConfigurationData {
  loggerName: string;
  loggerLevel: 'OFF' | 'FATAL' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE' | 'ALL';
}

export interface LoggerConfigurationPUTData {
  loggerConfigurationData: LoggerConfigurationData[];
}

// ============================================================================
// INTERFACES - JOB DEFINITIONS
// ============================================================================

export interface JobDefinitionPOSTData {
  name: string;
  description?: string;
  status?: boolean;
  cronSchedule: string;
  reserveBatchSize?: number;
  purgeEventLogDays: number;
  purgeProcessLogDays: number;
}

export interface JobDefinitionPUTData {
  name: string;
  description?: string;
  status?: boolean;
  cronSchedule: string;
  reserveBatchSize?: number;
  purgeEventLogDays: number;
  purgeProcessLogDays: number;
}

export interface JobDefinitionCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  status?: boolean;
  omitJobDefinitionId?: string;
}

// ============================================================================
// INTERFACES - JOB PROCESS LOGS
// ============================================================================

export interface JobProcessLogPOSTData {
  name: string;
  totalEntriesReserved: number;
  totalEntries?: number;
}

export interface JobProcessLogPUTData {
  name: string;
  totalEntriesReserved: number;
  totalEntries?: number;
}

// ============================================================================
// INTERFACES - SERVICE EVENT LOGS
// ============================================================================

export interface ServiceEventLogPOSTData {
  nameText: string;
  description: string;
  transactionReferenceId?: string;
  workRequestId?: string;
  workRequestItemId?: string;
  workRequestReasonId?: string;
  stateTransitionLogId?: string;
  createdByUserId?: string;
  roleCode?: string;
  eventCode?: string;
  actionSubCode?: string;
  statusCode?: string;
  commentText?: string;
}

export interface ServiceEventLogPUTData {
  nameText: string;
  description: string;
  transactionReferenceId?: string;
  workRequestId?: string;
  workRequestItemId?: string;
  workRequestReasonId?: string;
  stateTransitionLogId?: string;
  createdByUserId?: string;
  roleCode?: string;
  eventCode?: string;
  actionSubCode?: string;
  statusCode?: string;
  commentText?: string;
}

export interface ServiceEventLogCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  nameText?: string;
  description?: string;
  transactionReferenceId?: string;
  workRequestId?: string;
  workRequestItemId?: string;
  workRequestReasonId?: string;
  stateTransitionLogId?: string;
  createdByUserId?: string;
  roleCode?: string;
  eventCode?: string;
  actionSubCode?: string;
  statusCode?: string;
  commentText?: string;
  maxResults?: number;
}

// ============================================================================
// INTERFACES - CATALOG
// ============================================================================

export interface CatalogEntryPOSTData {
  name: string;
  description?: string;
  catalogId: string;
  status?: boolean;
}

export interface CatalogEntryPUTData {
  name: string;
  description?: string;
  catalogId: string;
  status?: boolean;
}

export interface CatalogEntryCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  description?: string;
  catalogId?: string;
  status?: boolean;
  maxResults?: number;
}

export interface CatalogPOSTData {
  name: string;
  description?: string;
  status?: boolean;
}

export interface CatalogPUTData {
  name: string;
  description?: string;
  status?: boolean;
}

export interface CatalogCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  description?: string;
  status?: boolean;
  maxResults?: number;
}

// ============================================================================
// INTERFACES - EXPERIENCE
// ============================================================================

export interface ExperiencePOSTData {
  name: string;
  description?: string;
  experienceTypeId: string;
  status?: boolean;
}

export interface ExperiencePUTData {
  name: string;
  description?: string;
  experienceTypeId: string;
  status?: boolean;
}

export interface ExperienceCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  description?: string;
  experienceTypeId?: string;
  status?: boolean;
  maxResults?: number;
}

export interface ExperienceTypePOSTData {
  name: string;
  description?: string;
  status?: boolean;
}

export interface ExperienceTypePUTData {
  name: string;
  description?: string;
  status?: boolean;
}

export interface ExperienceTypeCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  description?: string;
  status?: boolean;
  maxResults?: number;
}

// ============================================================================
// INTERFACES - PROVIDER
// ============================================================================

export interface ProviderPOSTData {
  name: string;
  description?: string;
  providerTypeId: string;
  status?: boolean;
}

export interface ProviderPUTData {
  name: string;
  description?: string;
  providerTypeId: string;
  status?: boolean;
}

export interface ProviderCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  description?: string;
  providerTypeId?: string;
  status?: boolean;
  maxResults?: number;
}

// ============================================================================
// INTERFACES - PROVIDER REQUEST
// ============================================================================

export interface ProviderRequestPOSTData {
  name: string;
  description?: string;
  providerRequestTypeId: string;
  status?: boolean;
}

export interface ProviderRequestPUTData {
  name: string;
  description?: string;
  providerRequestTypeId: string;
  status?: boolean;
}

export interface ProviderRequestCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  description?: string;
  providerRequestTypeId?: string;
  status?: boolean;
  maxResults?: number;
}

// ============================================================================
// INTERFACES - STATE TRANSITION LOG
// ============================================================================

export interface StateTransitionLogPOSTData {
  nameText: string;
  description: string;
  transactionReferenceId?: string;
  workRequestId?: string;
  workRequestItemId?: string;
  workRequestReasonId?: string;
  stateTransitionLogId?: string;
  createdByUserId?: string;
  roleCode?: string;
  eventCode?: string;
  actionSubCode?: string;
  statusCode?: string;
  commentText?: string;
}

export interface StateTransitionLogPUTData {
  nameText: string;
  description: string;
  transactionReferenceId?: string;
  workRequestId?: string;
  workRequestItemId?: string;
  workRequestReasonId?: string;
  stateTransitionLogId?: string;
  createdByUserId?: string;
  roleCode?: string;
  eventCode?: string;
  actionSubCode?: string;
  statusCode?: string;
  commentText?: string;
}

export interface StateTransitionLogCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  nameText?: string;
  description?: string;
  transactionReferenceId?: string;
  workRequestId?: string;
  workRequestItemId?: string;
  workRequestReasonId?: string;
  stateTransitionLogId?: string;
  createdByUserId?: string;
  roleCode?: string;
  eventCode?: string;
  actionSubCode?: string;
  statusCode?: string;
  commentText?: string;
  maxResults?: number;
}

// ============================================================================
// INTERFACES - TAXONOMY
// ============================================================================

export interface TaxonomyEntryPOSTData {
  name: string;
  description?: string;
  taxonomyId: string;
  status?: boolean;
}

export interface TaxonomyEntryPUTData {
  name: string;
  description?: string;
  taxonomyId: string;
  status?: boolean;
}

export interface TaxonomyEntryCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  description?: string;
  taxonomyId?: string;
  status?: boolean;
  maxResults?: number;
}

export interface TaxonomyPOSTData {
  name: string;
  description?: string;
  status?: boolean;
}

export interface TaxonomyPUTData {
  name: string;
  description?: string;
  status?: boolean;
}

export interface TaxonomyCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  description?: string;
  status?: boolean;
  maxResults?: number;
}

// ============================================================================
// INTERFACES - TEAMS
// ============================================================================

export interface TeamPOSTData {
  name: string;
  description?: string;
  status?: boolean;
}

export interface TeamPUTData {
  name: string;
  description?: string;
  status?: boolean;
}

export interface TeamCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  description?: string;
  status?: boolean;
  maxResults?: number;
}

// ============================================================================
// INTERFACES - TICKETS
// ============================================================================

export interface TicketPOSTData {
  name: string;
  description?: string;
  ticketTypeId: string;
  status?: boolean;
}

export interface TicketPUTData {
  name: string;
  description?: string;
  ticketTypeId: string;
  status?: boolean;
}

export interface TicketCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  description?: string;
  ticketTypeId?: string;
  status?: boolean;
  maxResults?: number;
}

// ============================================================================
// INTERFACES - VOCODE
// ============================================================================

export interface VocodePOSTData {
  name: string;
  description?: string;
  status?: boolean;
}

export interface VocodePUTData {
  name: string;
  description?: string;
  status?: boolean;
}

export interface VocodeCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  description?: string;
  status?: boolean;
  maxResults?: number;
}

// ============================================================================
// SERVICE CLASS
// ============================================================================

@Injectable({
  providedIn: 'root'
})
export class HcclService {
  private readonly baseUrl = 'http://localhost:8099/trutesta-hccl-services';

  constructor(private commonRequestService: CommonRequestServiceCaller) {}

  // ============================================================================
  // HEALTH CHECKS
  // ============================================================================

  checkApplicationHealth(): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/healthchecks/application`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  getCurrentManifest(): Observable<ServiceManifest> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/healthchecks/servicemanifest`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  getInternals(): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/healthchecks/internals.json`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  getSwagger(): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/healthchecks/swagger.json`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  ping(): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/healthchecks/ping`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  runHealthCheckOnDatabase(): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/healthchecks/database`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  // ============================================================================
  // DEBUG LOGGERS
  // ============================================================================

  getAllLoggers(pageNumber?: number, pageSize?: number): Observable<any> {
    const params = new URLSearchParams();
    if (pageNumber !== undefined) params.append('pageNumber', pageNumber.toString());
    if (pageSize !== undefined) params.append('pageSize', pageSize.toString());
    
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/debug/loggers${params.toString() ? '?' + params.toString() : ''}`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  updateLoggerLevel(data: LoggerConfigurationPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/debug/loggers/changeloggerlevel`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  // ============================================================================
  // JOB DEFINITIONS
  // ============================================================================

  getJobDefinitions(status?: boolean, name?: string): Observable<any> {
    const params = new URLSearchParams();
    if (status !== undefined) params.append('status', status.toString());
    if (name) params.append('name', name);
    
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/job-definitions${params.toString() ? '?' + params.toString() : ''}`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  createJobDefinition(data: JobDefinitionPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/job-definitions`,
      method: 'POST',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  getJobDefinitionById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/job-definitions/${id}`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  updateJobDefinition(id: string, data: JobDefinitionPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/job-definitions/${id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  deleteJobDefinition(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/job-definitions/${id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.callService(request);
  }

  findJobDefinitions(criteria: JobDefinitionCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/job-definitions/find`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  initializeJobDefinitions(): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/job-definitions/initialize`,
      method: 'POST'
    };
    return this.commonRequestService.callService(request);
  }

  // ============================================================================
  // JOB PROCESS LOGS
  // ============================================================================

  getJobProcessLogs(criteria: any): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/job-process-logs/find`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  createJobProcessLog(data: JobProcessLogPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/job-process-logs`,
      method: 'POST',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  getJobProcessLogById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/job-process-logs/${id}`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  updateJobProcessLog(id: string, data: JobProcessLogPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/job-process-logs/${id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  deleteJobProcessLog(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/job-process-logs/${id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.callService(request);
  }

  setJobProcessLogCompleted(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/job-process-logs/${id}/completed`,
      method: 'PUT'
    };
    return this.commonRequestService.callService(request);
  }

  // ============================================================================
  // SERVICE EVENT LOGS
  // ============================================================================

  cancelServiceEventLog(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/service-event-logs/${id}/cancel`,
      method: 'PUT'
    };
    return this.commonRequestService.callService(request);
  }

  createServiceEventLog(data: ServiceEventLogPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/service-event-logs`,
      method: 'POST',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  createServiceEventLogs(data: ServiceEventLogPOSTData[]): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/service-event-logs/batch`,
      method: 'POST',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  getServiceEventLogById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/service-event-logs/${id}`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  updateServiceEventLog(id: string, data: ServiceEventLogPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/service-event-logs/${id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  deleteServiceEventLog(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/service-event-logs/${id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.callService(request);
  }

  downloadFile(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/service-event-logs/${id}/download`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  getServiceEventLogs(criteria: ServiceEventLogCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/service-event-logs/find`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  queryEventSummaryByDisplayNameAndEventName(displayName: string, eventName: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/service-event-logs/summary/display-name/${displayName}/event-name/${eventName}`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  queryEventSummaryByEventName(eventName: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/service-event-logs/summary/event-name/${eventName}`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  queryEventSummaryByReferenceIdAndEventName(referenceId: string, eventName: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/service-event-logs/summary/reference-id/${referenceId}/event-name/${eventName}`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  // ============================================================================
  // CATALOG
  // ============================================================================

  createCatalogEntry(data: CatalogEntryPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/catalog-entries`,
      method: 'POST',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  getCatalogEntryById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/catalog-entries/${id}`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  updateCatalogEntryById(id: string, data: CatalogEntryPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/catalog-entries/${id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  deleteCatalogEntryById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/catalog-entries/${id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.callService(request);
  }

  findCatalogEntryOptions(criteria: CatalogEntryCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/catalog-entries/options`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  findCatalogEntries(criteria: CatalogEntryCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/catalog-entries/find`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  createCatalog(data: CatalogPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/catalogs`,
      method: 'POST',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  getCatalogById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/catalogs/${id}`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  updateCatalogById(id: string, data: CatalogPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/catalogs/${id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  deleteCatalogById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/catalogs/${id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.callService(request);
  }

  findCatalogOptions(criteria: CatalogCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/catalogs/options`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  findCatalogs(criteria: CatalogCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/catalogs/find`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  // ============================================================================
  // EXPERIENCE
  // ============================================================================

  createExperience(data: ExperiencePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/experiences`,
      method: 'POST',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  getExperienceById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/experiences/${id}`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  updateExperienceById(id: string, data: ExperiencePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/experiences/${id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  deleteExperienceById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/experiences/${id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.callService(request);
  }

  findExperienceOptions(criteria: ExperienceCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/experiences/options`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  findExperiences(criteria: ExperienceCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/experiences/find`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  createExperienceType(data: ExperienceTypePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/experience-types`,
      method: 'POST',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  getExperienceTypeById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/experience-types/${id}`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  updateExperienceTypeById(id: string, data: ExperienceTypePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/experience-types/${id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  deleteExperienceTypeById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/experience-types/${id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.callService(request);
  }

  findExperienceTypeOptions(criteria: ExperienceTypeCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/experience-types/options`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  findExperienceTypes(criteria: ExperienceTypeCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/experience-types/find`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  // ============================================================================
  // PROVIDER
  // ============================================================================

  createProvider(data: ProviderPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/providers`,
      method: 'POST',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  getProviderById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/providers/${id}`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  updateProviderById(id: string, data: ProviderPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/providers/${id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  deleteProviderById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/providers/${id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.callService(request);
  }

  findProviderOptions(criteria: ProviderCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/providers/options`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  findProviders(criteria: ProviderCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/providers/find`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  // ============================================================================
  // PROVIDER REQUEST
  // ============================================================================

  createProviderRequest(data: ProviderRequestPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/provider-requests`,
      method: 'POST',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  getProviderRequestById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/provider-requests/${id}`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  updateProviderRequestById(id: string, data: ProviderRequestPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/provider-requests/${id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  deleteProviderRequestById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/provider-requests/${id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.callService(request);
  }

  findProviderRequestOptions(criteria: ProviderRequestCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/provider-requests/options`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  findProviderRequests(criteria: ProviderRequestCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/provider-requests/find`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  // ============================================================================
  // STATE TRANSITION LOG
  // ============================================================================

  createStateTransitionLog(data: StateTransitionLogPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/state-transition-logs`,
      method: 'POST',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  getStateTransitionLogById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/state-transition-logs/${id}`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  updateStateTransitionLogById(id: string, data: StateTransitionLogPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/state-transition-logs/${id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  deleteStateTransitionLogById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/state-transition-logs/${id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.callService(request);
  }

  findStateTransitionLogOptions(criteria: StateTransitionLogCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/state-transition-logs/options`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  findStateTransitionLogs(criteria: StateTransitionLogCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/state-transition-logs/find`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  // ============================================================================
  // TAXONOMY
  // ============================================================================

  createTaxonomyEntry(data: TaxonomyEntryPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/taxonomy-entries`,
      method: 'POST',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  getTaxonomyEntryById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/taxonomy-entries/${id}`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  updateTaxonomyEntryById(id: string, data: TaxonomyEntryPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/taxonomy-entries/${id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  deleteTaxonomyEntryById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/taxonomy-entries/${id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.callService(request);
  }

  findTaxonomyEntryOptions(criteria: TaxonomyEntryCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/taxonomy-entries/options`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  findTaxonomyEntries(criteria: TaxonomyEntryCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/taxonomy-entries/find`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  createTaxonomy(data: TaxonomyPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/taxonomies`,
      method: 'POST',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  getTaxonomyById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/taxonomies/${id}`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  updateTaxonomyById(id: string, data: TaxonomyPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/taxonomies/${id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  deleteTaxonomyById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/taxonomies/${id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.callService(request);
  }

  findTaxonomyOptions(criteria: TaxonomyCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/taxonomies/options`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  findTaxonomies(criteria: TaxonomyCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/taxonomies/find`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  // ============================================================================
  // TEAMS
  // ============================================================================

  createTeam(data: TeamPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/teams`,
      method: 'POST',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  getTeamById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/teams/${id}`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  updateTeamById(id: string, data: TeamPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/teams/${id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  deleteTeamById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/teams/${id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.callService(request);
  }

  findTeamOptions(criteria: TeamCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/teams/options`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  findTeams(criteria: TeamCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/teams/find`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  // ============================================================================
  // TICKETS
  // ============================================================================

  createTicket(data: TicketPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/tickets`,
      method: 'POST',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  getTicketById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/tickets/${id}`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  updateTicketById(id: string, data: TicketPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/tickets/${id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  deleteTicketById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/tickets/${id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.callService(request);
  }

  findTicketOptions(criteria: TicketCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/tickets/options`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  findTickets(criteria: TicketCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/tickets/find`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  // ============================================================================
  // VOCODE
  // ============================================================================

  createVocode(data: VocodePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/vocodes`,
      method: 'POST',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  getVocodeById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/vocodes/${id}`,
      method: 'GET'
    };
    return this.commonRequestService.callService(request);
  }

  updateVocodeById(id: string, data: VocodePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/vocodes/${id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.callService(request);
  }

  deleteVocodeById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/vocodes/${id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.callService(request);
  }

  findVocodeOptions(criteria: VocodeCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/vocodes/options`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }

  findVocodes(criteria: VocodeCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: `${this.baseUrl}/hccl/vocodes/find`,
      method: 'POST',
      body: criteria
    };
    return this.commonRequestService.callService(request);
  }
}
