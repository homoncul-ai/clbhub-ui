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
  QueryResponse
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
}
