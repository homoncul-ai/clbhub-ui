import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { CommonRequestServiceCaller, CommonServiceRequest } from './common-request-service.model';
import { HttpClient } from '@angular/common/http';
import {
  ServiceManifest,
  LoggerConfigurationData,
  LoggerConfigurationPUTData,
  JobDefinitionPOSTData,
  JobDefinitionPUTData,
  JobDefinitionCriteria,
  JobDefinitionGETData,
  JobProcessLogPOSTData,
  JobProcessLogPUTData,
  JobProcessLogGETData,
  ServiceEventLogPOSTData,
  ServiceEventLogPUTData,
  ServiceEventLogCriteria,
  ServiceEventLogGETData,
  CatalogPOSTData,
  CatalogPUTData,
  CatalogGETData,
  CatalogCriteria,
  CatalogEntryPOSTData,
  CatalogEntryPUTData,
  CatalogEntryGETData,
  CatalogEntryCriteria,
  CatalogEntryTagPOSTData,
  CatalogEntryTagPUTData,
  CatalogEntryTagGETData,
  CatalogEntryTagCriteria,
  CatalogSearchPOSTData,
  CatalogSearchPUTData,
  CatalogSearchGETData,
  CatalogSearchCriteria,
  CatalogSearchResultPOSTData,
  CatalogSearchResultPUTData,
  CatalogSearchResultGETData,
  CatalogSearchResultCriteria,
  CatalogSearchResultEntryPOSTData,
  CatalogSearchResultEntryPUTData,
  CatalogSearchResultEntryGETData,
  CatalogSearchResultEntryCriteria,
  CatalogTagRefPOSTData,
  CatalogTagRefPUTData,
  CatalogTagRefGETData,
  CatalogTagRefCriteria,
  ExperiencePOSTData,
  ExperiencePUTData,
  ExperienceGETData,
  ExperienceCriteria,
  ExperienceTypePOSTData,
  ExperienceTypePUTData,
  ExperienceTypeGETData,
  ExperienceTypeCriteria,
  ExperienceLocationPOSTData,
  ExperienceLocationPUTData,
  ExperienceLocationGETData,
  ExperienceLocationCriteria,
  ExperienceRegRulePOSTData,
  ExperienceRegRulePUTData,
  ExperienceRegRuleGETData,
  ExperienceRegRuleCriteria,
  CLSchoolPOSTData,
  CLSchoolPUTData,
  CLSchoolGETData,
  CLSchoolCriteria,
  CLSchoolGETDataSearchResults,
  CLStudentPOSTData,
  CLStudentPUTData,
  CLStudentGETData,
  CLStudentCriteria,
  CLStudentGETDataSearchResults,
  CLGuidancePOSTData,
  CLGuidancePUTData,
  CLGuidanceGETData,
  CLGuidanceCriteria,
  CLGuidanceGETDataSearchResults,
  CLCoursePOSTData,
  CLCoursePUTData,
  CLCourseGETData,
  CLCourseCriteria,
  CLCourseGETDataSearchResults,
  ProviderPOSTData,
  ProviderPUTData,
  ProviderGETData,
  ProviderCriteria,
  ProviderTypeRefPOSTData,
  ProviderTypeRefPUTData,
  ProviderTypeRefGETData,
  ProviderTypeRefCriteria,
  ProviderUserPOSTData,
  ProviderUserPUTData,
  ProviderUserGETData,
  ProviderUserCriteria,
  ProviderRequestPOSTData,
  ProviderRequestPUTData,
  ProviderRequestGETData,
  ProviderRequestCriteria,
  ProviderRequestTypeRefPOSTData,
  ProviderRequestTypeRefPUTData,
  ProviderRequestTypeRefGETData,
  ProviderRequestTypeRefCriteria,
  StateTransitionLogPOSTData,
  StateTransitionLogPUTData,
  StateTransitionLogGETData,
  StateTransitionLogCriteria,
  TaxonomyPOSTData,
  TaxonomyPUTData,
  TaxonomyGETData,
  TaxonomyCriteria,
  TaxonomyLevelPOSTData,
  TaxonomyLevelPUTData,
  TaxonomyLevelGETData,
  TaxonomyLevelCriteria,
  TaxonomyEntryPOSTData,
  TaxonomyEntryPUTData,
  TaxonomyEntryGETData,
  TaxonomyEntryCriteria,
  HcclOrganizationPOSTData,
  HcclOrganizationPUTData,
  HcclOrganizationGETData,
  HcclOrganizationCriteria,
  HcclOrganizationTypeRefPOSTData,
  HcclOrganizationTypeRefPUTData,
  HcclOrganizationTypeRefGETData,
  HcclOrganizationTypeRefCriteria,
  HcclTeamPOSTData,
  HcclTeamPUTData,
  HcclTeamGETData,
  HcclTeamCriteria,
  HcclTeamMemberPOSTData,
  HcclTeamMemberPUTData,
  HcclTeamMemberGETData,
  HcclTeamMemberCriteria,
  HcclTeamMemberRolePOSTData,
  HcclTeamMemberRolePUTData,
  HcclTeamMemberRoleGETData,
  HcclTeamMemberRoleCriteria,
  HcclTeamLogPOSTData,
  HcclTeamLogPUTData,
  HcclTeamLogGETData,
  HcclTeamLogCriteria,
  PagedResponse,
  QueryResponse,
  HcclUserProfileGETData,
  HcclUserProfileGETDataSearchResults,
  HcclUserProfileCriteria,
  HcclUserProfilePOSTData,
  HcclUserProfilePUTData,
  HcclUserGETData,
  HcclUserPUTData,
  HcclUserCriteria,
  HcclUserGETDataSearchResults,
  HcclUserPOSTData,
  SimpleMessage,
  SimpleMessageList,
  SimpleRestActionContext,
  SimpleRestActionResponse,
  HcclTeamGETDataSearchResults,
  HcclTeamMemberGETDataSearchResults,
  HcclTeamMemberRoleGETDataSearchResults,
  HcclTeamLogGETDataSearchResults,
  HcclOrganizationTypeRefGETDataSearchResults,
  TeamMemberRoleRefPOSTData,
  TeamMemberRoleRefPUTData,
  TeamMemberRoleRefGETData,
  TeamMemberRoleRefCriteria,
  TeamMemberRoleRefGETDataSearchResults,
  TeamTypeMemberRoleRefPOSTData,
  TeamTypeMemberRoleRefPUTData,
  TeamTypeMemberRoleRefGETData,
  TeamTypeMemberRoleRefCriteria,
  TeamTypeMemberRoleRefGETDataSearchResults,
  TeamTypeRefPOSTData,
  TeamTypeRefPUTData,
  TeamTypeRefGETData,
  TeamTypeRefCriteria,
  TeamTypeRefGETDataSearchResults,
  WorkQueuePOSTData,
  WorkQueuePUTData,
  WorkQueueGETData,
  WorkQueueCriteria,
  WorkQueueGETDataSearchResults,
  WorkQueueTypeRefPOSTData,
  WorkQueueTypeRefPUTData,
  WorkQueueTypeRefGETData,
  WorkQueueTypeRefCriteria,
  WorkQueueTypeRefGETDataSearchResults,
  MenuControlData,
  MenuControlDataList,
  CreateTicketSetupUIData,
  CreateTicketPOSTData,
  WorkRequestGETData,
  WorkRequestGETDataSearchResults,
  HcclUserContextGETData,
  WorkRequestItemPOSTData,
  WorkRequestItemGETData,
  WorkRequestItemPUTData,
  WorkRequestItemCriteria,
  WorkRequestItemGETDataSearchResults,
  WorkRequestLogPOSTData,
  WorkRequestLogGETData,
  WorkRequestLogPUTData,
  WorkRequestLogCriteria,
  WorkRequestLogGETDataSearchResults,
  WorkRequestRoutingReasonPOSTData,
  WorkRequestRoutingReasonGETData,
  WorkRequestRoutingReasonPUTData,
  WorkRequestRoutingReasonCriteria,
  WorkRequestRoutingReasonGETDataSearchResults,
  WorkRequestPOSTData,
  WorkRequestPUTData,
  WorkRequestCriteria,
  WorkRequestTeamPOSTData,
  WorkRequestTeamGETData,
  WorkRequestTeamPUTData,
  WorkRequestTeamCriteria,
  WorkRequestTeamGETDataSearchResults,
  WorkRequestTypeRefPOSTData,
  WorkRequestTypeRefGETData,
  WorkRequestTypeRefPUTData,
  WorkRequestTypeRefCriteria,
  WorkRequestTypeRefGETDataSearchResults
} from './hccl.interfaces';

@Injectable({
  providedIn: 'root'
})
export class HcclService extends CommonRequestServiceCaller {
 

  constructor(http: HttpClient) {
    super(http);
    const baseUrl = 'http://localhost:8099/trutesta-hccl-services';
    // 'https://devops2.intigna.io/trutesta-hccl-services';
    //  private readonly baseUrl = 
    this.setBaseUrl(baseUrl);
  }
  /*
  Create TypeScript interfaces and service methods for the All endpoints 
using the "CommonServiceRequest" object and calling using 
CommonRequestServiceCaller request method.

Generate the service calls for ALL the endpoints in the swagger json 
This prompt captures:
What: TypeScript interfaces and service methods
For: all  endpoints except the following paths : healthchecks

From: Swagger documentation [swagger-file]
In: [service-ts-file]
Using: CommonRequestServiceCaller.request  (instead of custom HTTP handling)
Key Requirement: Leverage existing shared HTTP service infrastructure

The prompt emphasizes the architectural decision to use the super 
CommonRequestServiceCaller request methods
 rather than implementing custom HTTP handling logic.

  */
  
  // Debug/Loggers
  getAllLoggers(pageNumber?: number, pageSize?: number): Observable<any> {
    const params: { [key: string]: string } = {};
    if (pageNumber !== undefined) params['pageNumber'] = pageNumber.toString();
    if (pageSize !== undefined) params['pageSize'] = pageSize.toString();
    
    const request: CommonServiceRequest = {
      url: '/hccl/debug/loggers',
      method: 'GET',
      params
    };
    return this.request<any>(request);
  }

  updateLoggerLevel(loggerConfig: LoggerConfigurationPUTData): Observable<void> {
    const request: CommonServiceRequest<LoggerConfigurationPUTData> = {
      url: '/hccl/debug/loggers/changeloggerlevel',
      method: 'PUT',
      body: loggerConfig
    };
    return this.request<void>(request);
  }

  // Job Definitions
  getJobDefinitions(status?: boolean, name?: string): Observable<JobDefinitionGETData[]> {
    const params: { [key: string]: string } = {};
    if (status !== undefined) params['status'] = status.toString();
    if (name) params['name'] = name;
    
    const request: CommonServiceRequest = {
      url: '/hccl/job-definitions',
      method: 'GET',
      params
    };
    return this.request<JobDefinitionGETData[]>(request);
  }

  createJobDefinition(jobDef: JobDefinitionPOSTData): Observable<void> {
    const request: CommonServiceRequest<JobDefinitionPOSTData> = {
      url: '/hccl/job-definitions',
      method: 'POST',
      body: jobDef
    };
    return this.request<void>(request);
  }

  getJobDefinitionById(id: string): Observable<JobDefinitionGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/job-definitions/${id}`,
      method: 'GET'
    };
    return this.request<JobDefinitionGETData>(request);
  }

  updateJobDefinition(id: string, jobDef: JobDefinitionPUTData): Observable<void> {
    const request: CommonServiceRequest<JobDefinitionPUTData> = {
      url: `/hccl/job-definitions/${id}`,
      method: 'PUT',
      body: jobDef
    };
    return this.request<void>(request);
  }

  deleteJobDefinition(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/job-definitions/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  queryJobDefinitions(criteria: JobDefinitionCriteria): Observable<QueryResponse<JobDefinitionGETData>> {
    const request: CommonServiceRequest<JobDefinitionCriteria> = {
      url: '/hccl/job-definitions/query-job-definitions',
      method: 'POST',
      body: criteria
    };
    return this.request<QueryResponse<JobDefinitionGETData>>(request);
  }

  initializeJobDefinitions(): Observable<void> {
    const request: CommonServiceRequest = {
      url: '/hccl/job-definitions/initialize',
      method: 'POST'
    };
    return this.request<void>(request);
  }

  getProcessLogs(definitionId: string): Observable<any[]> {
    const request: CommonServiceRequest = {
      url: `/hccl/job-definitions/${definitionId}/process-logs`,
      method: 'GET'
    };
    return this.request<any[]>(request);
  }

  getProcessLogById(definitionId: string, id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: `/hccl/job-definitions/${definitionId}/process-logs/${id}`,
      method: 'GET'
    };
    return this.request<any>(request);
  }

  completeProcessLog(definitionId: string, logId: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/job-definitions/${definitionId}/process-logs/${logId}/completed`,
      method: 'PUT'
    };
    return this.request<void>(request);
  }

  // Service Event Logs
  createServiceEventLog(eventLog: ServiceEventLogPOSTData): Observable<void> {
    const request: CommonServiceRequest<ServiceEventLogPOSTData> = {
      url: '/hccl/service-event-logs',
      method: 'POST',
      body: eventLog
    };
    return this.request<void>(request);
  }

  createServiceEventLogs(eventLogs: ServiceEventLogPOSTData[]): Observable<void> {
    const request: CommonServiceRequest<ServiceEventLogPOSTData[]> = {
      url: '/hccl/service-event-logs/events',
      method: 'POST',
      body: eventLogs
    };
    return this.request<void>(request);
  }

  getServiceEventLogById(id: string): Observable<ServiceEventLogGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/service-event-logs/${id}`,
      method: 'GET'
    };
    return this.request<ServiceEventLogGETData>(request);
  }

  updateServiceEventLog(id: string, eventLog: ServiceEventLogPUTData): Observable<void> {
    const request: CommonServiceRequest<ServiceEventLogPUTData> = {
      url: `/hccl/service-event-logs/${id}`,
      method: 'PUT',
      body: eventLog
    };
    return this.request<void>(request);
  }

  deleteServiceEventLog(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/service-event-logs/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  cancelServiceEventLog(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/service-event-logs/${id}/cancel`,
      method: 'PUT'
    };
    return this.request<void>(request);
  }

  downloadServiceEventLogFile(serviceEventLogId: string): Observable<Blob> {
    const request: CommonServiceRequest = {
      url: `/hccl/service-event-logs/${serviceEventLogId}/download-file`,
      method: 'GET'
    };
    return this.request<Blob>(request);
  }

  queryServiceEventLogs(criteria: ServiceEventLogCriteria): Observable<QueryResponse<ServiceEventLogGETData>> {
    const request: CommonServiceRequest<ServiceEventLogCriteria> = {
      url: '/hccl/service-event-logs/query-logs',
      method: 'POST',
      body: criteria
    };
    return this.request<QueryResponse<ServiceEventLogGETData>>(request);
  }

  queryEventSummaryByName(criteria: ServiceEventLogCriteria): Observable<any> {
    const request: CommonServiceRequest<ServiceEventLogCriteria> = {
      url: '/hccl/service-event-logs/query-event-summary-by-name',
      method: 'POST',
      body: criteria
    };
    return this.request<any>(request);
  }

  queryEventSummary(criteria: ServiceEventLogCriteria): Observable<any> {
    const request: CommonServiceRequest<ServiceEventLogCriteria> = {
      url: '/hccl/service-event-logs/query-event-summary',
      method: 'POST',
      body: criteria
    };
    return this.request<any>(request);
  }

  queryEventSummaryByReference(criteria: ServiceEventLogCriteria): Observable<any> {
    const request: CommonServiceRequest<ServiceEventLogCriteria> = {
      url: '/hccl/service-event-logs/query-event-summary-by-reference',
      method: 'POST',
      body: criteria
    };
    return this.request<any>(request);
  }

  // Catalog
  createCatalog(catalog: CatalogPOSTData): Observable<void> {
    const request: CommonServiceRequest<CatalogPOSTData> = {
      url: '/hccl/catalog/catalog',
      method: 'POST',
      body: catalog
    };
    return this.request<void>(request);
  }

  getCatalogById(id: string): Observable<CatalogGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/catalog/catalog/${id}`,
      method: 'GET'
    };
    return this.request<CatalogGETData>(request);
  }

  updateCatalog(id: string, catalog: CatalogPUTData): Observable<void> {
    const request: CommonServiceRequest<CatalogPUTData> = {
      url: `/hccl/catalog/catalog/${id}`,
      method: 'PUT',
      body: catalog
    };
    return this.request<void>(request);
  }

  deleteCatalog(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/catalog/catalog/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findCatalogOptions(criteria: CatalogCriteria): Observable<any> {
    const request: CommonServiceRequest<CatalogCriteria> = {
      url: '/hccl/catalog/catalog/options',
      method: 'POST',
      body: criteria
    };
    return this.request<any>(request);
  }

  findCatalogs(criteria: CatalogCriteria): Observable<QueryResponse<CatalogGETData>> {
    const request: CommonServiceRequest<CatalogCriteria> = {
      url: '/hccl/catalog/catalog/query',
      method: 'POST',
      body: criteria
    };
    return this.request<QueryResponse<CatalogGETData>>(request);
  }

  // Catalog Entry
  createCatalogEntry(catalogEntry: CatalogEntryPOSTData): Observable<void> {
    const request: CommonServiceRequest<CatalogEntryPOSTData> = {
      url: '/hccl/catalog/catalogentry',
      method: 'POST',
      body: catalogEntry
    };
    return this.request<void>(request);
  }

  getCatalogEntryById(id: string): Observable<CatalogEntryGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/catalog/catalogentry/${id}`,
      method: 'GET'
    };
    return this.request<CatalogEntryGETData>(request);
  }

  updateCatalogEntry(id: string, catalogEntry: CatalogEntryPUTData): Observable<void> {
    const request: CommonServiceRequest<CatalogEntryPUTData> = {
      url: `/hccl/catalog/catalogentry/${id}`,
      method: 'PUT',
      body: catalogEntry
    };
    return this.request<void>(request);
  }

  deleteCatalogEntry(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/catalog/catalogentry/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findCatalogEntryOptions(criteria: CatalogEntryCriteria): Observable<any> {
    const request: CommonServiceRequest<CatalogEntryCriteria> = {
      url: '/hccl/catalog/catalogentry/options',
      method: 'POST',
      body: criteria
    };
    return this.request<any>(request);
  }

  findCatalogEntries(criteria: CatalogEntryCriteria): Observable<QueryResponse<CatalogEntryGETData>> {
    const request: CommonServiceRequest<CatalogEntryCriteria> = {
      url: '/hccl/catalog/catalogentry/query',
      method: 'POST',
      body: criteria
    };
    return this.request<QueryResponse<CatalogEntryGETData>>(request);
  }

  // Experience
  createExperience(experience: ExperiencePOSTData): Observable<void> {
    const request: CommonServiceRequest<ExperiencePOSTData> = {
      url: '/hccl/experience/experience',
      method: 'POST',
      body: experience
    };
    return this.request<void>(request);
  }

  getExperienceById(id: string): Observable<ExperienceGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/experience/experience/${id}`,
      method: 'GET'
    };
    return this.request<ExperienceGETData>(request);
  }

  updateExperience(id: string, experience: ExperiencePUTData): Observable<void> {
    const request: CommonServiceRequest<ExperiencePUTData> = {
      url: `/hccl/experience/experience/${id}`,
      method: 'PUT',
      body: experience
    };
    return this.request<void>(request);
  }

  deleteExperience(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/experience/experience/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findExperienceOptions(criteria: ExperienceCriteria): Observable<any> {
    const request: CommonServiceRequest<ExperienceCriteria> = {
      url: '/hccl/experience/experience/options',
      method: 'POST',
      body: criteria
    };
    return this.request<any>(request);
  }

  findExperiences(criteria: ExperienceCriteria): Observable<QueryResponse<ExperienceGETData>> {
    const request: CommonServiceRequest<ExperienceCriteria> = {
      url: '/hccl/experience/experience/query',
      method: 'POST',
      body: criteria
    };
    return this.request<QueryResponse<ExperienceGETData>>(request);
  }

  // Provider
  createProvider(provider: ProviderPOSTData): Observable<void> {
    const request: CommonServiceRequest<ProviderPOSTData> = {
      url: '/hccl/prov/provider',
      method: 'POST',
      body: provider
    };
    return this.request<void>(request);
  }

  getProviderById(id: string): Observable<ProviderGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/prov/provider/${id}`,
      method: 'GET'
    };
    return this.request<ProviderGETData>(request);
  }

  updateProvider(id: string, provider: ProviderPUTData): Observable<void> {
    const request: CommonServiceRequest<ProviderPUTData> = {
      url: `/hccl/prov/provider/${id}`,
      method: 'PUT',
      body: provider
    };
    return this.request<void>(request);
  }

  deleteProvider(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/prov/provider/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findProviderOptions(criteria: ProviderCriteria): Observable<any> {
    const request: CommonServiceRequest<ProviderCriteria> = {
      url: '/hccl/prov/provider/options',
      method: 'POST',
      body: criteria
    };
    return this.request<any>(request);
  }

  findProviders(criteria: ProviderCriteria): Observable<QueryResponse<ProviderGETData>> {
    const request: CommonServiceRequest<ProviderCriteria> = {
      url: '/hccl/prov/provider/query',
      method: 'POST',
      body: criteria
    };
    return this.request<QueryResponse<ProviderGETData>>(request);
  }

  // Provider Request
  createProviderRequest(providerRequest: ProviderRequestPOSTData): Observable<void> {
    const request: CommonServiceRequest<ProviderRequestPOSTData> = {
      url: '/hccl/provreq/providerrequest',
      method: 'POST',
      body: providerRequest
    };
    return this.request<void>(request);
  }

  getProviderRequestById(id: string): Observable<ProviderRequestGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/provreq/providerrequest/${id}`,
      method: 'GET'
    };
    return this.request<ProviderRequestGETData>(request);
  }

  updateProviderRequest(id: string, providerRequest: ProviderRequestPUTData): Observable<void> {
    const request: CommonServiceRequest<ProviderRequestPUTData> = {
      url: `/hccl/provreq/providerrequest/${id}`,
      method: 'PUT',
      body: providerRequest
    };
    return this.request<void>(request);
  }

  deleteProviderRequest(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/provreq/providerrequest/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findProviderRequestOptions(criteria: ProviderRequestCriteria): Observable<any> {
    const request: CommonServiceRequest<ProviderRequestCriteria> = {
      url: '/hccl/provreq/providerrequest/options',
      method: 'POST',
      body: criteria
    };
    return this.request<any>(request);
  }

  findProviderRequests(criteria: ProviderRequestCriteria): Observable<QueryResponse<ProviderRequestGETData>> {
    const request: CommonServiceRequest<ProviderRequestCriteria> = {
      url: '/hccl/provreq/providerrequest/query',
      method: 'POST',
      body: criteria
    };
    return this.request<QueryResponse<ProviderRequestGETData>>(request);
  }

  // State Machine
  createStateTransitionLog(stateTransitionLog: StateTransitionLogPOSTData): Observable<void> {
    const request: CommonServiceRequest<StateTransitionLogPOSTData> = {
      url: '/hccl/statemachine/statetransitionlog',
      method: 'POST',
      body: stateTransitionLog
    };
    return this.request<void>(request);
  }

  getStateTransitionLogById(id: string): Observable<StateTransitionLogGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/statemachine/statetransitionlog/${id}`,
      method: 'GET'
    };
    return this.request<StateTransitionLogGETData>(request);
  }

  updateStateTransitionLog(id: string, stateTransitionLog: StateTransitionLogPUTData): Observable<void> {
    const request: CommonServiceRequest<StateTransitionLogPUTData> = {
      url: `/hccl/statemachine/statetransitionlog/${id}`,
      method: 'PUT',
      body: stateTransitionLog
    };
    return this.request<void>(request);
  }

  deleteStateTransitionLog(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/statemachine/statetransitionlog/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findStateTransitionLogOptions(criteria: StateTransitionLogCriteria): Observable<any> {
    const request: CommonServiceRequest<StateTransitionLogCriteria> = {
      url: '/hccl/statemachine/statetransitionlog/options',
      method: 'POST',
      body: criteria
    };
    return this.request<any>(request);
  }

  findStateTransitionLogs(criteria: StateTransitionLogCriteria): Observable<QueryResponse<StateTransitionLogGETData>> {
    const request: CommonServiceRequest<StateTransitionLogCriteria> = {
      url: '/hccl/statemachine/statetransitionlog/query',
      method: 'POST',
      body: criteria
    };
    return this.request<QueryResponse<StateTransitionLogGETData>>(request);
  }

  // Taxonomy
  createTaxonomyEntry(taxonomyEntry: TaxonomyEntryPOSTData): Observable<void> {
    const request: CommonServiceRequest<TaxonomyEntryPOSTData> = {
      url: '/hccl/taxonomy/taxonomyentry',
      method: 'POST',
      body: taxonomyEntry
    };
    return this.request<void>(request);
  }

  getTaxonomyEntryById(id: string): Observable<TaxonomyEntryGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/taxonomy/taxonomyentry/${id}`,
      method: 'GET'
    };
    return this.request<TaxonomyEntryGETData>(request);
  }

  updateTaxonomyEntry(id: string, taxonomyEntry: TaxonomyEntryPUTData): Observable<void> {
    const request: CommonServiceRequest<TaxonomyEntryPUTData> = {
      url: `/hccl/taxonomy/taxonomyentry/${id}`,
      method: 'PUT',
      body: taxonomyEntry
    };
    return this.request<void>(request);
  }

  deleteTaxonomyEntry(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/taxonomy/taxonomyentry/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findTaxonomyEntryOptions(criteria: TaxonomyEntryCriteria): Observable<any> {
    const request: CommonServiceRequest<TaxonomyEntryCriteria> = {
      url: '/hccl/taxonomy/taxonomyentry/options',
      method: 'POST',
      body: criteria
    };
    return this.request<any>(request);
  }

  findTaxonomyEntries(criteria: TaxonomyEntryCriteria): Observable<QueryResponse<TaxonomyEntryGETData>> {
    const request: CommonServiceRequest<TaxonomyEntryCriteria> = {
      url: '/hccl/taxonomy/taxonomyentry/query',
      method: 'POST',
      body: criteria
    };
    return this.request<QueryResponse<TaxonomyEntryGETData>>(request);
  }

  // Teams/Organizations
  createHcclOrganization(organization: HcclOrganizationPOSTData): Observable<void> {
    const request: CommonServiceRequest<HcclOrganizationPOSTData> = {
      url: '/hccl/teams/hcclorganization',
      method: 'POST',
      body: organization
    };
    return this.request<void>(request);
  }

  getHcclOrganizationById(id: string): Observable<HcclOrganizationGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/teams/hcclorganization/${id}`,
      method: 'GET'
    };
    return this.request<HcclOrganizationGETData>(request);
  }

  updateHcclOrganization(id: string, organization: HcclOrganizationPUTData): Observable<void> {
    const request: CommonServiceRequest<HcclOrganizationPUTData> = {
      url: `/hccl/teams/hcclorganization/${id}`,
      method: 'PUT',
      body: organization
    };
    return this.request<void>(request);
  }

  deleteHcclOrganization(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/teams/hcclorganization/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findHcclOrganizationOptions(criteria: HcclOrganizationCriteria): Observable<any> {
    const request: CommonServiceRequest<HcclOrganizationCriteria> = {
      url: '/hccl/teams/hcclorganization/options',
      method: 'POST',
      body: criteria
    };
    return this.request<any>(request);
  }

  findHcclOrganizations(criteria: HcclOrganizationCriteria): Observable<QueryResponse<HcclOrganizationGETData>> {
    const request: CommonServiceRequest<HcclOrganizationCriteria> = {
      url: '/hccl/teams/hcclorganization/query',
      method: 'POST',
      body: criteria
    };
    return this.request<QueryResponse<HcclOrganizationGETData>>(request);
  }

  // Integration EDU - CLSchool operations
  createCLSchool(clSchool: CLSchoolPOSTData): Observable<void> {
    const request: CommonServiceRequest<CLSchoolPOSTData> = {
      url: '/hccl/integration_edu/clschool',
      method: 'POST',
      body: clSchool
    };
    return this.request<void>(request);
  }

  getCLSchoolById(id: string): Observable<CLSchoolGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/integration_edu/clschool/${id}`,
      method: 'GET'
    };
    return this.request<CLSchoolGETData>(request);
  }

  updateCLSchool(id: string, clSchool: CLSchoolPUTData): Observable<void> {
    const request: CommonServiceRequest<CLSchoolPUTData> = {
      url: `/hccl/integration_edu/clschool/${id}`,
      method: 'PUT',
      body: clSchool
    };
    return this.request<void>(request);
  }

  deleteCLSchool(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/integration_edu/clschool/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findCLSchoolOptions(criteria: CLSchoolCriteria): Observable<any> {
    const request: CommonServiceRequest<CLSchoolCriteria> = {
      url: '/hccl/integration_edu/clschool/options',
      method: 'POST',
      body: criteria
    };
    return this.request<any>(request);
  }

  findCLSchools(criteria: CLSchoolCriteria): Observable<CLSchoolGETDataSearchResults> {
    const request: CommonServiceRequest<CLSchoolCriteria> = {
      url: '/hccl/integration_edu/clschool/query',
      method: 'POST',
      body: criteria
    };
    return this.request<CLSchoolGETDataSearchResults>(request);
  }

  // Integration EDU - CLStudent operations
  createCLStudent(clStudent: CLStudentPOSTData): Observable<void> {
    const request: CommonServiceRequest<CLStudentPOSTData> = {
      url: '/hccl/integration_edu/clstudent',
      method: 'POST',
      body: clStudent
    };
    return this.request<void>(request);
  }

  getCLStudentById(id: string): Observable<CLStudentGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/integration_edu/clstudent/${id}`,
      method: 'GET'
    };
    return this.request<CLStudentGETData>(request);
  }

  updateCLStudent(id: string, clStudent: CLStudentPUTData): Observable<void> {
    const request: CommonServiceRequest<CLStudentPUTData> = {
      url: `/hccl/integration_edu/clstudent/${id}`,
      method: 'PUT',
      body: clStudent
    };
    return this.request<void>(request);
  }

  deleteCLStudent(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/integration_edu/clstudent/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findCLStudentOptions(criteria: CLStudentCriteria): Observable<any> {
    const request: CommonServiceRequest<CLStudentCriteria> = {
      url: '/hccl/integration_edu/clstudent/options',
      method: 'POST',
      body: criteria
    };
    return this.request<any>(request);
  }

  findCLStudents(criteria: CLStudentCriteria): Observable<CLStudentGETDataSearchResults> {
    const request: CommonServiceRequest<CLStudentCriteria> = {
      url: '/hccl/integration_edu/clstudent/query',
      method: 'POST',
      body: criteria
    };
    return this.request<CLStudentGETDataSearchResults>(request);
  }

  // Integration EDU - CLGuidance operations
  createCLGuidance(clGuidance: CLGuidancePOSTData): Observable<void> {
    const request: CommonServiceRequest<CLGuidancePOSTData> = {
      url: '/hccl/integration_edu/clguidance',
      method: 'POST',
      body: clGuidance
    };
    return this.request<void>(request);
  }

  getCLGuidanceById(id: string): Observable<CLGuidanceGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/integration_edu/clguidance/${id}`,
      method: 'GET'
    };
    return this.request<CLGuidanceGETData>(request);
  }

  updateCLGuidance(id: string, clGuidance: CLGuidancePUTData): Observable<void> {
    const request: CommonServiceRequest<CLGuidancePUTData> = {
      url: `/hccl/integration_edu/clguidance/${id}`,
      method: 'PUT',
      body: clGuidance
    };
    return this.request<void>(request);
  }

  deleteCLGuidance(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/integration_edu/clguidance/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findCLGuidanceOptions(criteria: CLGuidanceCriteria): Observable<any> {
    const request: CommonServiceRequest<CLGuidanceCriteria> = {
      url: '/hccl/integration_edu/clguidance/options',
      method: 'POST',
      body: criteria
    };
    return this.request<any>(request);
  }

  findCLGuidances(criteria: CLGuidanceCriteria): Observable<CLGuidanceGETDataSearchResults> {
    const request: CommonServiceRequest<CLGuidanceCriteria> = {
      url: '/hccl/integration_edu/clguidance/query',
      method: 'POST',
      body: criteria
    };
    return this.request<CLGuidanceGETDataSearchResults>(request);
  }

  // Integration EDU - CLCourse operations
  createCLCourse(clCourse: CLCoursePOSTData): Observable<void> {
    const request: CommonServiceRequest<CLCoursePOSTData> = {
      url: '/hccl/integration_edu/clcourse',
      method: 'POST',
      body: clCourse
    };
    return this.request<void>(request);
  }

  getCLCourseById(id: string): Observable<CLCourseGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/integration_edu/clcourse/${id}`,
      method: 'GET'
    };
    return this.request<CLCourseGETData>(request);
  }

  updateCLCourse(id: string, clCourse: CLCoursePUTData): Observable<void> {
    const request: CommonServiceRequest<CLCoursePUTData> = {
      url: `/hccl/integration_edu/clcourse/${id}`,
      method: 'PUT',
      body: clCourse
    };
    return this.request<void>(request);
  }

  deleteCLCourse(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/integration_edu/clcourse/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findCLCourseOptions(criteria: CLCourseCriteria): Observable<any> {
    const request: CommonServiceRequest<CLCourseCriteria> = {
      url: '/hccl/integration_edu/clcourse/options',
      method: 'POST',
      body: criteria
    };
    return this.request<any>(request);
  }

  findCLCourses(criteria: CLCourseCriteria): Observable<CLCourseGETDataSearchResults> {
    const request: CommonServiceRequest<CLCourseCriteria> = {
      url: '/hccl/integration_edu/clcourse/query',
      method: 'POST',
      body: criteria
    };
    return this.request<CLCourseGETDataSearchResults>(request);
  }

  // Integration Actions - Promote Students
  promoteStudents(criteria: CLStudentCriteria): Observable<SimpleRestActionResponse> {
    const request: CommonServiceRequest<CLStudentCriteria> = {
      url: '/hccl/intg/actions/promote-students',
      method: 'POST',
      body: criteria
    };
    return this.request<SimpleRestActionResponse>(request);
  }

  // Teams - HcclUserProfile operations
  findHcclUserProfileOptions(criteria: HcclUserProfileCriteria): Observable<any> {
    const request: CommonServiceRequest<HcclUserProfileCriteria> = {
      url: '/hccl/teams/hccluserprofile/options',
      method: 'POST',
      body: criteria
    };
    return this.request<any>(request);
  }

  findHcclUserProfiles(criteria: HcclUserProfileCriteria): Observable<HcclUserProfileGETDataSearchResults> {
    const request: CommonServiceRequest<HcclUserProfileCriteria> = {
      url: '/hccl/teams/hccluserprofile/query',
      method: 'POST',
      body: criteria
    };
    return this.request<HcclUserProfileGETDataSearchResults>(request);
  }

  // Teams - HcclUser operations
  createHcclUser(hcclUser: HcclUserPOSTData): Observable<void> {
    const request: CommonServiceRequest<HcclUserPOSTData> = {
      url: '/hccl/teams/hccluser',
      method: 'POST',
      body: hcclUser
    };
    return this.request<void>(request);
  }

  getHcclUserById(id: string): Observable<HcclUserGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/teams/hccluser/${id}`,
      method: 'GET'
    };
    return this.request<HcclUserGETData>(request);
  }

  updateHcclUser(id: string, hcclUser: HcclUserPUTData): Observable<void> {
    const request: CommonServiceRequest<HcclUserPUTData> = {
      url: `/hccl/teams/hccluser/${id}`,
      method: 'PUT',
      body: hcclUser
    };
    return this.request<void>(request);
  }

  deleteHcclUser(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/teams/hccluser/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findHcclUserOptions(criteria: HcclUserCriteria): Observable<any> {
    const request: CommonServiceRequest<HcclUserCriteria> = {
      url: '/hccl/teams/hccluser/options',
      method: 'POST',
      body: criteria
    };
    return this.request<any>(request);
  }

  findHcclUsers(criteria: HcclUserCriteria): Observable<HcclUserGETDataSearchResults> {
    const request: CommonServiceRequest<HcclUserCriteria> = {
      url: '/hccl/teams/hccluser/query',
      method: 'POST',
      body: criteria
    };
    return this.request<HcclUserGETDataSearchResults>(request);
  }

  // Teams - HcclTeam operations
  createHcclTeam(hcclTeam: HcclTeamPOSTData): Observable<void> {
    const request: CommonServiceRequest<HcclTeamPOSTData> = {
      url: '/hccl/teams/hcclteam',
      method: 'POST',
      body: hcclTeam
    };
    return this.request<void>(request);
  }

  getHcclTeamById(id: string): Observable<HcclTeamGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/teams/hcclteam/${id}`,
      method: 'GET'
    };
    return this.request<HcclTeamGETData>(request);
  }

  updateHcclTeam(id: string, hcclTeam: HcclTeamPUTData): Observable<void> {
    const request: CommonServiceRequest<HcclTeamPUTData> = {
      url: `/hccl/teams/hcclteam/${id}`,
      method: 'PUT',
      body: hcclTeam
    };
    return this.request<void>(request);
  }

  deleteHcclTeam(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/teams/hcclteam/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findHcclTeams(criteria: HcclTeamCriteria): Observable<HcclTeamGETDataSearchResults> {
    const request: CommonServiceRequest<HcclTeamCriteria> = {
      url: '/hccl/teams/hcclteam/query',
      method: 'POST',
      body: criteria
    };
    return this.request<HcclTeamGETDataSearchResults>(request);
  }

  // Teams - HcclTeamMember operations
  createHcclTeamMember(hcclTeamMember: HcclTeamMemberPOSTData): Observable<void> {
    const request: CommonServiceRequest<HcclTeamMemberPOSTData> = {
      url: '/hccl/teams/hcclteammember',
      method: 'POST',
      body: hcclTeamMember
    };
    return this.request<void>(request);
  }

  getHcclTeamMemberById(id: string): Observable<HcclTeamMemberGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/teams/hcclteammember/${id}`,
      method: 'GET'
    };
    return this.request<HcclTeamMemberGETData>(request);
  }

  updateHcclTeamMember(id: string, hcclTeamMember: HcclTeamMemberPUTData): Observable<void> {
    const request: CommonServiceRequest<HcclTeamMemberPUTData> = {
      url: `/hccl/teams/hcclteammember/${id}`,
      method: 'PUT',
      body: hcclTeamMember
    };
    return this.request<void>(request);
  }

  deleteHcclTeamMember(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/teams/hcclteammember/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findHcclTeamMembers(criteria: HcclTeamMemberCriteria): Observable<HcclTeamMemberGETDataSearchResults> {
    const request: CommonServiceRequest<HcclTeamMemberCriteria> = {
      url: '/hccl/teams/hcclteammember/query',
      method: 'POST',
      body: criteria
    };
    return this.request<HcclTeamMemberGETDataSearchResults>(request);
  }

  // Teams - HcclTeamMemberRole operations
  createHcclTeamMemberRole(hcclTeamMemberRole: HcclTeamMemberRolePOSTData): Observable<void> {
    const request: CommonServiceRequest<HcclTeamMemberRolePOSTData> = {
      url: '/hccl/teams/hcclteammemberrole',
      method: 'POST',
      body: hcclTeamMemberRole
    };
    return this.request<void>(request);
  }

  getHcclTeamMemberRoleById(id: string): Observable<HcclTeamMemberRoleGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/teams/hcclteammemberrole/${id}`,
      method: 'GET'
    };
    return this.request<HcclTeamMemberRoleGETData>(request);
  }

  updateHcclTeamMemberRole(id: string, hcclTeamMemberRole: HcclTeamMemberRolePUTData): Observable<void> {
    const request: CommonServiceRequest<HcclTeamMemberRolePUTData> = {
      url: `/hccl/teams/hcclteammemberrole/${id}`,
      method: 'PUT',
      body: hcclTeamMemberRole
    };
    return this.request<void>(request);
  }

  deleteHcclTeamMemberRole(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/teams/hcclteammemberrole/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findHcclTeamMemberRoles(criteria: HcclTeamMemberRoleCriteria): Observable<HcclTeamMemberRoleGETDataSearchResults> {
    const request: CommonServiceRequest<HcclTeamMemberRoleCriteria> = {
      url: '/hccl/teams/hcclteammemberrole/query',
      method: 'POST',
      body: criteria
    };
    return this.request<HcclTeamMemberRoleGETDataSearchResults>(request);
  }

  // Teams - HcclTeamLog operations
  createHcclTeamLog(hcclTeamLog: HcclTeamLogPOSTData): Observable<void> {
    const request: CommonServiceRequest<HcclTeamLogPOSTData> = {
      url: '/hccl/teams/hcclteamlog',
      method: 'POST',
      body: hcclTeamLog
    };
    return this.request<void>(request);
  }

  getHcclTeamLogById(id: string): Observable<HcclTeamLogGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/teams/hcclteamlog/${id}`,
      method: 'GET'
    };
    return this.request<HcclTeamLogGETData>(request);
  }

  updateHcclTeamLog(id: string, hcclTeamLog: HcclTeamLogPUTData): Observable<void> {
    const request: CommonServiceRequest<HcclTeamLogPUTData> = {
      url: `/hccl/teams/hcclteamlog/${id}`,
      method: 'PUT',
      body: hcclTeamLog
    };
    return this.request<void>(request);
  }

  deleteHcclTeamLog(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/teams/hcclteamlog/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findHcclTeamLogs(criteria: HcclTeamLogCriteria): Observable<HcclTeamLogGETDataSearchResults> {
    const request: CommonServiceRequest<HcclTeamLogCriteria> = {
      url: '/hccl/teams/hcclteamlog/query',
      method: 'POST',
      body: criteria
    };
    return this.request<HcclTeamLogGETDataSearchResults>(request);
  }

  // Teams - HcclOrganizationTypeRef operations
  createHcclOrganizationTypeRef(hcclOrganizationTypeRef: HcclOrganizationTypeRefPOSTData): Observable<void> {
    const request: CommonServiceRequest<HcclOrganizationTypeRefPOSTData> = {
      url: '/hccl/teams/hcclorganizationtyperef',
      method: 'POST',
      body: hcclOrganizationTypeRef
    };
    return this.request<void>(request);
  }

  getHcclOrganizationTypeRefById(id: string): Observable<HcclOrganizationTypeRefGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/teams/hcclorganizationtyperef/${id}`,
      method: 'GET'
    };
    return this.request<HcclOrganizationTypeRefGETData>(request);
  }

  updateHcclOrganizationTypeRef(id: string, hcclOrganizationTypeRef: HcclOrganizationTypeRefPUTData): Observable<void> {
    const request: CommonServiceRequest<HcclOrganizationTypeRefPUTData> = {
      url: `/hccl/teams/hcclorganizationtyperef/${id}`,
      method: 'PUT',
      body: hcclOrganizationTypeRef
    };
    return this.request<void>(request);
  }

  deleteHcclOrganizationTypeRef(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/teams/hcclorganizationtyperef/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findHcclOrganizationTypeRefs(criteria: HcclOrganizationTypeRefCriteria): Observable<HcclOrganizationTypeRefGETDataSearchResults> {
    const request: CommonServiceRequest<HcclOrganizationTypeRefCriteria> = {
      url: '/hccl/teams/hcclorganizationtyperef/query',
      method: 'POST',
      body: criteria
    };
    return this.request<HcclOrganizationTypeRefGETDataSearchResults>(request);
  }

  // Teams - TeamMemberRoleRef operations
  createTeamMemberRoleRef(teamMemberRoleRef: TeamMemberRoleRefPOSTData): Observable<void> {
    const request: CommonServiceRequest<TeamMemberRoleRefPOSTData> = {
      url: '/hccl/teams/teammemberroleref',
      method: 'POST',
      body: teamMemberRoleRef
    };
    return this.request<void>(request);
  }

  getTeamMemberRoleRefById(id: string): Observable<TeamMemberRoleRefGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/teams/teammemberroleref/${id}`,
      method: 'GET'
    };
    return this.request<TeamMemberRoleRefGETData>(request);
  }

  updateTeamMemberRoleRef(id: string, teamMemberRoleRef: TeamMemberRoleRefPUTData): Observable<void> {
    const request: CommonServiceRequest<TeamMemberRoleRefPUTData> = {
      url: `/hccl/teams/teammemberroleref/${id}`,
      method: 'PUT',
      body: teamMemberRoleRef
    };
    return this.request<void>(request);
  }

  deleteTeamMemberRoleRef(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/teams/teammemberroleref/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findTeamMemberRoleRefs(criteria: TeamMemberRoleRefCriteria): Observable<TeamMemberRoleRefGETDataSearchResults> {
    const request: CommonServiceRequest<TeamMemberRoleRefCriteria> = {
      url: '/hccl/teams/teammemberroleref/query',
      method: 'POST',
      body: criteria
    };
    return this.request<TeamMemberRoleRefGETDataSearchResults>(request);
  }

  // Teams - TeamTypeMemberRoleRef operations
  createTeamTypeMemberRoleRef(teamTypeMemberRoleRef: TeamTypeMemberRoleRefPOSTData): Observable<void> {
    const request: CommonServiceRequest<TeamTypeMemberRoleRefPOSTData> = {
      url: '/hccl/teams/teamtypememberroleref',
      method: 'POST',
      body: teamTypeMemberRoleRef
    };
    return this.request<void>(request);
  }

  getTeamTypeMemberRoleRefById(id: string): Observable<TeamTypeMemberRoleRefGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/teams/teamtypememberroleref/${id}`,
      method: 'GET'
    };
    return this.request<TeamTypeMemberRoleRefGETData>(request);
  }

  updateTeamTypeMemberRoleRef(id: string, teamTypeMemberRoleRef: TeamTypeMemberRoleRefPUTData): Observable<void> {
    const request: CommonServiceRequest<TeamTypeMemberRoleRefPUTData> = {
      url: `/hccl/teams/teamtypememberroleref/${id}`,
      method: 'PUT',
      body: teamTypeMemberRoleRef
    };
    return this.request<void>(request);
  }

  deleteTeamTypeMemberRoleRef(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/teams/teamtypememberroleref/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findTeamTypeMemberRoleRefs(criteria: TeamTypeMemberRoleRefCriteria): Observable<TeamTypeMemberRoleRefGETDataSearchResults> {
    const request: CommonServiceRequest<TeamTypeMemberRoleRefCriteria> = {
      url: '/hccl/teams/teamtypememberroleref/query',
      method: 'POST',
      body: criteria
    };
    return this.request<TeamTypeMemberRoleRefGETDataSearchResults>(request);
  }

  // Teams - TeamTypeRef operations
  createTeamTypeRef(teamTypeRef: TeamTypeRefPOSTData): Observable<void> {
    const request: CommonServiceRequest<TeamTypeRefPOSTData> = {
      url: '/hccl/teams/teamtyperef',
      method: 'POST',
      body: teamTypeRef
    };
    return this.request<void>(request);
  }

  getTeamTypeRefById(id: string): Observable<TeamTypeRefGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/teams/teamtyperef/${id}`,
      method: 'GET'
    };
    return this.request<TeamTypeRefGETData>(request);
  }

  updateTeamTypeRef(id: string, teamTypeRef: TeamTypeRefPUTData): Observable<void> {
    const request: CommonServiceRequest<TeamTypeRefPUTData> = {
      url: `/hccl/teams/teamtyperef/${id}`,
      method: 'PUT',
      body: teamTypeRef
    };
    return this.request<void>(request);
  }

  deleteTeamTypeRef(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/teams/teamtyperef/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findTeamTypeRefs(criteria: TeamTypeRefCriteria): Observable<TeamTypeRefGETDataSearchResults> {
    const request: CommonServiceRequest<TeamTypeRefCriteria> = {
      url: '/hccl/teams/teamtyperef/query',
      method: 'POST',
      body: criteria
    };
    return this.request<TeamTypeRefGETDataSearchResults>(request);
  }

  // TixUI operations
  getCreateTicketSetupUi(data: CreateTicketPOSTData): Observable<CreateTicketSetupUIData> {
    const request: CommonServiceRequest<CreateTicketPOSTData> = {
      url: '/hccl/tixui/create-ticket-setup-ui',
      method: 'POST',
      body: data
    };
    return this.request<CreateTicketSetupUIData>(request);
  }

  createTicket(data: CreateTicketPOSTData): Observable<WorkRequestGETData> {
    const request: CommonServiceRequest<CreateTicketPOSTData> = {
      url: '/hccl/tixui/create-ticket',
      method: 'POST',
      body: data
    };
    return this.request<WorkRequestGETData>(request);
  }

  getDashQueuesForUserProfile(userProfileId: string): Observable<WorkQueueGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: `/hccl/tixui/dashboard/${userProfileId}/queues`,
      method: 'GET'
    };
    return this.request<WorkQueueGETDataSearchResults>(request);
  }

  getProviderQueuesMenu(tixId: string): Observable<WorkQueueGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: `/hccl/tixui/${tixId}/provider-queues-menu`,
      method: 'GET'
    };
    return this.request<WorkQueueGETDataSearchResults>(request);
  }

  getQueuesMenu(userProfileId: string): Observable<MenuControlDataList> {
    const request: CommonServiceRequest = {
      url: `/hccl/tixui/queues-menu?user-profile-id=${userProfileId}`,
      method: 'POST'
    };
    return this.request<MenuControlDataList>(request);
  }

  resolveTicketContext(userProfileId?: string): Observable<HcclUserContextGETData> {
    const params: { [key: string]: string } = {};
    if (userProfileId) {
      params['userProfileId'] = userProfileId;
    }
    
    const request: CommonServiceRequest = {
      url: '/hccl/tixui/get-context',
      method: 'GET',
      params
    };
    return this.request<HcclUserContextGETData>(request);
  }

  // WorkQueue
  createWorkQueue(data: WorkQueuePOSTData): Observable<void> {
    const request: CommonServiceRequest<WorkQueuePOSTData> = {
      url: '/hccl/tix/workqueue',
      method: 'POST',
      body: data
    };
    return this.request<void>(request);
  }

  getWorkQueueById(id: string): Observable<WorkQueueGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/tix/workqueue/${id}`,
      method: 'GET'
    };
    return this.request<WorkQueueGETData>(request);
  }

  updateWorkQueueById(id: string, data: WorkQueuePUTData): Observable<void> {
    const request: CommonServiceRequest<WorkQueuePUTData> = {
      url: `/hccl/tix/workqueue/${id}`,
      method: 'PUT',
      body: data
    };
    return this.request<void>(request);
  }

  deleteWorkQueueById(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/tix/workqueue/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findWorkQueues(criteria: WorkQueueCriteria): Observable<WorkQueueGETDataSearchResults> {
    const request: CommonServiceRequest<WorkQueueCriteria> = {
      url: '/hccl/tix/workqueue/query',
      method: 'POST',
      body: criteria
    };
    return this.request<WorkQueueGETDataSearchResults>(request);
  }

  // WorkQueueTypeRef operations
  createWorkQueueTypeRef(data: WorkQueueTypeRefPOSTData): Observable<void> {
    const request: CommonServiceRequest<WorkQueueTypeRefPOSTData> = {
      url: '/hccl/tix/workqueuetyperef',
      method: 'POST',
      body: data
    };
    return this.request<void>(request);
  }

  getWorkQueueTypeRefById(id: string): Observable<WorkQueueTypeRefGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/tix/workqueuetyperef/${id}`,
      method: 'GET'
    };
    return this.request<WorkQueueTypeRefGETData>(request);
  }

  updateWorkQueueTypeRefById(id: string, data: WorkQueueTypeRefPUTData): Observable<void> {
    const request: CommonServiceRequest<WorkQueueTypeRefPUTData> = {
      url: `/hccl/tix/workqueuetyperef/${id}`,
      method: 'PUT',
      body: data
    };
    return this.request<void>(request);
  }

  deleteWorkQueueTypeRefById(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/tix/workqueuetyperef/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findWorkQueueTypeRefs(criteria: WorkQueueTypeRefCriteria): Observable<WorkQueueTypeRefGETDataSearchResults> {
    const request: CommonServiceRequest<WorkQueueTypeRefCriteria> = {
      url: '/hccl/tix/workqueuetyperef/query',
      method: 'POST',
      body: criteria
    };
    return this.request<WorkQueueTypeRefGETDataSearchResults>(request);
  }

  // WorkRequestItem operations
  createWorkRequestItem(data: WorkRequestItemPOSTData): Observable<void> {
    const request: CommonServiceRequest<WorkRequestItemPOSTData> = {
      url: '/hccl/tix/workrequestitem',
      method: 'POST',
      body: data
    };
    return this.request<void>(request);
  }

  getWorkRequestItemById(id: string): Observable<WorkRequestItemGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/tix/workrequestitem/${id}`,
      method: 'GET'
    };
    return this.request<WorkRequestItemGETData>(request);
  }

  updateWorkRequestItemById(id: string, data: WorkRequestItemPUTData): Observable<void> {
    const request: CommonServiceRequest<WorkRequestItemPUTData> = {
      url: `/hccl/tix/workrequestitem/${id}`,
      method: 'PUT',
      body: data
    };
    return this.request<void>(request);
  }

  deleteWorkRequestItemById(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/tix/workrequestitem/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findWorkRequestItems(criteria: WorkRequestItemCriteria): Observable<WorkRequestItemGETDataSearchResults> {
    const request: CommonServiceRequest<WorkRequestItemCriteria> = {
      url: '/hccl/tix/workrequestitem/query',
      method: 'POST',
      body: criteria
    };
    return this.request<WorkRequestItemGETDataSearchResults>(request);
  }

  // WorkRequestLog operations
  createWorkRequestLog(data: WorkRequestLogPOSTData): Observable<void> {
    const request: CommonServiceRequest<WorkRequestLogPOSTData> = {
      url: '/hccl/tix/workrequestlog',
      method: 'POST',
      body: data
    };
    return this.request<void>(request);
  }

  getWorkRequestLogById(id: string): Observable<WorkRequestLogGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/tix/workrequestlog/${id}`,
      method: 'GET'
    };
    return this.request<WorkRequestLogGETData>(request);
  }

  updateWorkRequestLogById(id: string, data: WorkRequestLogPUTData): Observable<void> {
    const request: CommonServiceRequest<WorkRequestLogPUTData> = {
      url: `/hccl/tix/workrequestlog/${id}`,
      method: 'PUT',
      body: data
    };
    return this.request<void>(request);
  }

  deleteWorkRequestLogById(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/tix/workrequestlog/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findWorkRequestLogs(criteria: WorkRequestLogCriteria): Observable<WorkRequestLogGETDataSearchResults> {
    const request: CommonServiceRequest<WorkRequestLogCriteria> = {
      url: '/hccl/tix/workrequestlog/query',
      method: 'POST',
      body: criteria
    };
    return this.request<WorkRequestLogGETDataSearchResults>(request);
  }

  // WorkRequestRoutingReason operations
  createWorkRequestRoutingReason(data: WorkRequestRoutingReasonPOSTData): Observable<void> {
    const request: CommonServiceRequest<WorkRequestRoutingReasonPOSTData> = {
      url: '/hccl/tix/workrequestroutingreason',
      method: 'POST',
      body: data
    };
    return this.request<void>(request);
  }

  getWorkRequestRoutingReasonById(id: string): Observable<WorkRequestRoutingReasonGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/tix/workrequestroutingreason/${id}`,
      method: 'GET'
    };
    return this.request<WorkRequestRoutingReasonGETData>(request);
  }

  updateWorkRequestRoutingReasonById(id: string, data: WorkRequestRoutingReasonPUTData): Observable<void> {
    const request: CommonServiceRequest<WorkRequestRoutingReasonPUTData> = {
      url: `/hccl/tix/workrequestroutingreason/${id}`,
      method: 'PUT',
      body: data
    };
    return this.request<void>(request);
  }

  deleteWorkRequestRoutingReasonById(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/tix/workrequestroutingreason/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findWorkRequestRoutingReasons(criteria: WorkRequestRoutingReasonCriteria): Observable<WorkRequestRoutingReasonGETDataSearchResults> {
    const request: CommonServiceRequest<WorkRequestRoutingReasonCriteria> = {
      url: '/hccl/tix/workrequestroutingreason/query',
      method: 'POST',
      body: criteria
    };
    return this.request<WorkRequestRoutingReasonGETDataSearchResults>(request);
  }

  // WorkRequest operations
  createWorkRequest(data: WorkRequestPOSTData): Observable<void> {
    const request: CommonServiceRequest<WorkRequestPOSTData> = {
      url: '/hccl/tix/workrequest',
      method: 'POST',
      body: data
    };
    return this.request<void>(request);
  }

  getWorkRequestById(id: string): Observable<WorkRequestGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/tix/workrequest/${id}`,
      method: 'GET'
    };
    return this.request<WorkRequestGETData>(request);
  }

  updateWorkRequestById(id: string, data: WorkRequestPUTData): Observable<void> {
    const request: CommonServiceRequest<WorkRequestPUTData> = {
      url: `/hccl/tix/workrequest/${id}`,
      method: 'PUT',
      body: data
    };
    return this.request<void>(request);
  }

  deleteWorkRequestById(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/tix/workrequest/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findWorkRequests(criteria: WorkRequestCriteria): Observable<WorkRequestGETDataSearchResults> {
    const request: CommonServiceRequest<WorkRequestCriteria> = {
      url: '/hccl/tix/workrequest/query',
      method: 'POST',
      body: criteria
    };
    return this.request<WorkRequestGETDataSearchResults>(request);
  }

  // WorkRequestTeam operations
  createWorkRequestTeam(data: WorkRequestTeamPOSTData): Observable<void> {
    const request: CommonServiceRequest<WorkRequestTeamPOSTData> = {
      url: '/hccl/tix/workrequestteam',
      method: 'POST',
      body: data
    };
    return this.request<void>(request);
  }

  getWorkRequestTeamById(id: string): Observable<WorkRequestTeamGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/tix/workrequestteam/${id}`,
      method: 'GET'
    };
    return this.request<WorkRequestTeamGETData>(request);
  }

  updateWorkRequestTeamById(id: string, data: WorkRequestTeamPUTData): Observable<void> {
    const request: CommonServiceRequest<WorkRequestTeamPUTData> = {
      url: `/hccl/tix/workrequestteam/${id}`,
      method: 'PUT',
      body: data
    };
    return this.request<void>(request);
  }

  deleteWorkRequestTeamById(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/tix/workrequestteam/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findWorkRequestTeams(criteria: WorkRequestTeamCriteria): Observable<WorkRequestTeamGETDataSearchResults> {
    const request: CommonServiceRequest<WorkRequestTeamCriteria> = {
      url: '/hccl/tix/workrequestteam/query',
      method: 'POST',
      body: criteria
    };
    return this.request<WorkRequestTeamGETDataSearchResults>(request);
  }

  // WorkRequestTypeRef operations
  createWorkRequestTypeRef(data: WorkRequestTypeRefPOSTData): Observable<void> {
    const request: CommonServiceRequest<WorkRequestTypeRefPOSTData> = {
      url: '/hccl/tix/workrequesttyperef',
      method: 'POST',
      body: data
    };
    return this.request<void>(request);
  }

  getWorkRequestTypeRefById(id: string): Observable<WorkRequestTypeRefGETData> {
    const request: CommonServiceRequest = {
      url: `/hccl/tix/workrequesttyperef/${id}`,
      method: 'GET'
    };
    return this.request<WorkRequestTypeRefGETData>(request);
  }

  updateWorkRequestTypeRefById(id: string, data: WorkRequestTypeRefPUTData): Observable<void> {
    const request: CommonServiceRequest<WorkRequestTypeRefPUTData> = {
      url: `/hccl/tix/workrequesttyperef/${id}`,
      method: 'PUT',
      body: data
    };
    return this.request<void>(request);
  }

  deleteWorkRequestTypeRefById(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      url: `/hccl/tix/workrequesttyperef/${id}`,
      method: 'DELETE'
    };
    return this.request<void>(request);
  }

  findWorkRequestTypeRefs(criteria: WorkRequestTypeRefCriteria): Observable<WorkRequestTypeRefGETDataSearchResults> {
    const request: CommonServiceRequest<WorkRequestTypeRefCriteria> = {
      url: '/hccl/tix/workrequesttyperef/query',
      method: 'POST',
      body: criteria
    };
    return this.request<WorkRequestTypeRefGETDataSearchResults>(request);
  }
}
