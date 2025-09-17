import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  SimpleMessage, SimpleMessageList, DateGETData ,Reference, RelationshipGETData, JobProcessLogPUTData , ServiceManifest, LoggerConfigurationData, LoggerConfigurationPUTData, JobDefinitionPOSTData, JobDefinitionCriteria, JobDefinitionPUTData, JobProcessLogPOSTData} from './common-request-service.model';
import { CommonRequestServiceCaller, CommonServiceRequest } from './common-request-service.model';
import { AppConstants } from '@app/shell/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class HcclService extends CommonRequestServiceCaller {
  constructor(http: HttpClient, appConstants: AppConstants) {
    super(http);

  // Hard code it if you want
   // const baseUrl: string = "http://localhost:8099/trutesta-hccl-services";
    const baseUrl: string = appConstants.endPoints()?.hcclServicesEndPoint;
    console.log("Setting HcclService baseUrl to " + baseUrl);
    this.setBaseUrl(baseUrl);
  }

  getCurrentManifest(): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/healthchecks/servicemanifest",
      method: "GET",
    };
    return this.request<any>(request);
  }

  getInternals(): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/healthchecks/internals.json",
      method: "GET",
    };
    return this.request<any>(request);
  }

  getSwagger(): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/healthchecks/swagger.json",
      method: "GET",
    };
    return this.request<any>(request);
  }

  ping(): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/healthchecks/ping",
      method: "GET",
    };
    return this.request<any>(request);
  }

  runHealthCheckOnDatabase(): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/healthchecks/database",
      method: "GET",
    };
    return this.request<any>(request);
  }

  getAllLoggers(pageNumber: number, pageSize: number): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/debug/loggers",
      method: "GET",
      params: { pageNumber: this.convertToString(pageNumber), pageSize: this.convertToString(pageSize) },
    };
    return this.request<any>(request);
  }

  updateLoggerLevel(body: LoggerConfigurationPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/debug/loggers/changeloggerlevel",
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  getJobDefinitions(status: boolean, name: string, pageNumber: number, pageSize: number, isPaging: boolean): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/job-definitions",
      method: "GET",
      params: { status: this.convertToString(status), name: this.convertToString(name), pageNumber: this.convertToString(pageNumber), pageSize: this.convertToString(pageSize), isPaging: this.convertToString(isPaging) },
    };
    return this.request<any>(request);
  }

  createJobDefinition(body: JobDefinitionPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/job-definitions",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getJobDefinitionById(id: string, isError: boolean): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/job-definitions/" + id,
      method: "GET",
      params: { isError: this.convertToString(isError) },
    };
    return this.request<any>(request);
  }

  updateJobDefinition(id: string, body: JobDefinitionPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/job-definitions/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteJobDefinition(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/job-definitions/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  getJobDefinitionsPost(body: JobDefinitionCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/job-definitions/query-job-definitions",
      method: "POST",
      body: body,
    };
    return this.request<any>(request);
  }

  initializeJobDefinitions(enableJob: boolean): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/job-definitions/initialize",
      method: "POST",
      params: { enableJob: this.convertToString(enableJob) },
    };
    return this.request<any>(request);
  }

  getJobProcessLogs(definition_id: string, name: string, dateCreated: string, isNotCompleted: boolean, pageNumber: number, pageSize: number, isPaging: boolean): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/job-definitions/" + definition_id + "/process-logs",
      method: "GET",
      params: { name: this.convertToString(name), dateCreated: this.convertToString(dateCreated), isNotCompleted: this.convertToString(isNotCompleted), pageNumber: this.convertToString(pageNumber), pageSize: this.convertToString(pageSize), isPaging: this.convertToString(isPaging) },
    };
    return this.request<any>(request);
  }

  createJobProcessLog(definition_id: string, body: JobProcessLogPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/job-definitions/" + definition_id + "/process-logs",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getJobProcessLogById(definition_id: string, id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/job-definitions/" + definition_id + "/process-logs/" + id,
      method: "GET",
    };
    return this.request<any>(request);
  }

  updateJobProcessLog(definition_id: string, id: string, body: JobProcessLogPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/job-definitions/" + definition_id + "/process-logs/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteJobProcessLog(definition_id: string, id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/job-definitions/" + definition_id + "/process-logs/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  setJobProcessLogCompleted(definition_id: string, log_id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/job-definitions/" + definition_id + "/process-logs/" + log_id + "/completed",
      method: "PUT",
    };
    return this.request<any>(request);
  }

  cancelServiceEventLog(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/service-event-logs/" + id + "/cancel",
      method: "PUT",
    };
    return this.request<any>(request);
  }

  createServiceEventLog(body: ServiceEventLogPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/service-event-logs",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  createServiceEventLogs(body: ServiceEventLogPOSTData[]): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/service-event-logs/events",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getServiceEventLogById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/service-event-logs/" + id,
      method: "GET",
    };
    return this.request<any>(request);
  }

  updateServiceEventLog(id: string, body: ServiceEventLogPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/service-event-logs/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteServiceEventLog(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/service-event-logs/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  downloadFile(service_event_log_id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/service-event-logs/" + service_event_log_id + "/download-file",
      method: "GET",
    };
    return this.request<any>(request);
  }

  getServiceEventLogs(body: ServiceEventLogCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/service-event-logs/query-logs",
      method: "POST",
      body: body,
    };
    return this.request<any>(request);
  }

  queryEventSummaryByDisplayNameAndEventName(body: ServiceEventLogCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/service-event-logs/query-event-summary-by-name",
      method: "POST",
      body: body,
    };
    return this.request<any>(request);
  }

  queryEventSummaryByEventName(body: ServiceEventLogCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/service-event-logs/query-event-summary",
      method: "POST",
      body: body,
    };
    return this.request<any>(request);
  }

  queryEventSummaryByReferenceIdAndEventName(body: ServiceEventLogCriteria): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/service-event-logs/query-event-summary-by-reference",
      method: "POST",
      body: body,
    };
    return this.request<any>(request);
  }

  createCatalogEntryInterest(body: CatalogEntryInterestPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentryinterest",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getCatalogEntryInterestById(id: string): Observable<CatalogEntryInterestGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentryinterest/" + id,
      method: "GET",
    };
    return this.request<CatalogEntryInterestGETData>(request);
  }

  updateCatalogEntryInterestById(id: string, body: CatalogEntryInterestPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentryinterest/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteCatalogEntryInterestById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentryinterest/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findCatalogEntryInterests(body: CatalogEntryInterestCriteria): Observable<CatalogEntryInterestGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentryinterest/query",
      method: "POST",
      body: body,
    };
    return this.request<CatalogEntryInterestGETDataSearchResults>(request);
  }

  showInterest(body: CatalogEntryInterestPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentryinterest/show-interest",
      method: "POST",
      body: body,
    };
    return this.request<any>(request);
  }

  createCatalogEntry(body: CatalogEntryPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentry",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getCatalogEntryById(id: string): Observable<CatalogEntryGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentry/" + id,
      method: "GET",
    };
    return this.request<CatalogEntryGETData>(request);
  }

  updateCatalogEntryById(id: string, body: CatalogEntryPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentry/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteCatalogEntryById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentry/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findCatalogEntrys(body: CatalogEntryCriteria): Observable<CatalogEntryGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentry/query",
      method: "POST",
      body: body,
    };
    return this.request<CatalogEntryGETDataSearchResults>(request);
  }

  findCatalogEntrysUsingVocode(body: CatalogEntryCriteria): Observable<VeiSearchResultsGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentry/query-using-vocode",
      method: "POST",
      body: body,
    };
    return this.request<VeiSearchResultsGETData>(request);
  }

  createCatalogEntryTag(body: CatalogEntryTagPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentrytag",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getCatalogEntryTagById(id: string): Observable<CatalogEntryTagGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentrytag/" + id,
      method: "GET",
    };
    return this.request<CatalogEntryTagGETData>(request);
  }

  updateCatalogEntryTagById(id: string, body: CatalogEntryTagPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentrytag/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteCatalogEntryTagById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentrytag/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findCatalogEntryTags(body: CatalogEntryTagCriteria): Observable<CatalogEntryTagGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentrytag/query",
      method: "POST",
      body: body,
    };
    return this.request<CatalogEntryTagGETDataSearchResults>(request);
  }

  createCatalogSearchResultEntry(body: CatalogSearchResultEntryPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogsearchresultentry",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getCatalogSearchResultEntryById(id: string): Observable<CatalogSearchResultEntryGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogsearchresultentry/" + id,
      method: "GET",
    };
    return this.request<CatalogSearchResultEntryGETData>(request);
  }

  updateCatalogSearchResultEntryById(id: string, body: CatalogSearchResultEntryPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogsearchresultentry/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteCatalogSearchResultEntryById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogsearchresultentry/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findCatalogSearchResultEntrys(body: CatalogSearchResultEntryCriteria): Observable<CatalogSearchResultEntryGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogsearchresultentry/query",
      method: "POST",
      body: body,
    };
    return this.request<CatalogSearchResultEntryGETDataSearchResults>(request);
  }

  createCatalogSearchResult(body: CatalogSearchResultPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogsearchresult",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getCatalogSearchResultById(id: string): Observable<CatalogSearchResultGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogsearchresult/" + id,
      method: "GET",
    };
    return this.request<CatalogSearchResultGETData>(request);
  }

  updateCatalogSearchResultById(id: string, body: CatalogSearchResultPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogsearchresult/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteCatalogSearchResultById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogsearchresult/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findCatalogSearchResults(body: CatalogSearchResultCriteria): Observable<CatalogSearchResultGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogsearchresult/query",
      method: "POST",
      body: body,
    };
    return this.request<CatalogSearchResultGETDataSearchResults>(request);
  }

  createCatalogSearch(body: CatalogSearchPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogsearch",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getCatalogSearchById(id: string): Observable<CatalogSearchGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogsearch/" + id,
      method: "GET",
    };
    return this.request<CatalogSearchGETData>(request);
  }

  updateCatalogSearchById(id: string, body: CatalogSearchPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogsearch/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteCatalogSearchById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogsearch/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findCatalogSearchs(body: CatalogSearchCriteria): Observable<CatalogSearchGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogsearch/query",
      method: "POST",
      body: body,
    };
    return this.request<CatalogSearchGETDataSearchResults>(request);
  }

  createCatalog(body: CatalogPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalog",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getCatalogById(id: string): Observable<CatalogGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalog/" + id,
      method: "GET",
    };
    return this.request<CatalogGETData>(request);
  }

  updateCatalogById(id: string, body: CatalogPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalog/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteCatalogById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalog/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findCatalogs(body: CatalogCriteria): Observable<CatalogGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalog/query",
      method: "POST",
      body: body,
    };
    return this.request<CatalogGETDataSearchResults>(request);
  }

  createCatalogTagRef(body: CatalogTagRefPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogtagref",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getCatalogTagRefById(id: string): Observable<CatalogTagRefGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogtagref/" + id,
      method: "GET",
    };
    return this.request<CatalogTagRefGETData>(request);
  }

  updateCatalogTagRefById(id: string, body: CatalogTagRefPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogtagref/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteCatalogTagRefById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogtagref/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findCatalogTagRefs(body: CatalogTagRefCriteria): Observable<CatalogTagRefGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogtagref/query",
      method: "POST",
      body: body,
    };
    return this.request<CatalogTagRefGETDataSearchResults>(request);
  }

  createExperienceLocation(body: ExperienceLocationPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/experiencelocation",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getExperienceLocationById(id: string): Observable<ExperienceLocationGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/experiencelocation/" + id,
      method: "GET",
    };
    return this.request<ExperienceLocationGETData>(request);
  }

  updateExperienceLocationById(id: string, body: ExperienceLocationPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/experiencelocation/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteExperienceLocationById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/experiencelocation/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findExperienceLocations(body: ExperienceLocationCriteria): Observable<ExperienceLocationGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/experiencelocation/query",
      method: "POST",
      body: body,
    };
    return this.request<ExperienceLocationGETDataSearchResults>(request);
  }

  createExperienceRegRule(body: ExperienceRegRulePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/experienceregrule",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getExperienceRegRuleById(id: string): Observable<ExperienceRegRuleGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/experienceregrule/" + id,
      method: "GET",
    };
    return this.request<ExperienceRegRuleGETData>(request);
  }

  updateExperienceRegRuleById(id: string, body: ExperienceRegRulePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/experienceregrule/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteExperienceRegRuleById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/experienceregrule/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findExperienceRegRules(body: ExperienceRegRuleCriteria): Observable<ExperienceRegRuleGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/experienceregrule/query",
      method: "POST",
      body: body,
    };
    return this.request<ExperienceRegRuleGETDataSearchResults>(request);
  }

  createExperience(body: ExperiencePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/experience",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getExperienceById(id: string): Observable<ExperienceGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/experience/" + id,
      method: "GET",
    };
    return this.request<ExperienceGETData>(request);
  }

  updateExperienceById(id: string, body: ExperiencePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/experience/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteExperienceById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/experience/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findExperiences(body: ExperienceCriteria): Observable<ExperienceGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/experience/query",
      method: "POST",
      body: body,
    };
    return this.request<ExperienceGETDataSearchResults>(request);
  }

  createExperienceType(body: ExperienceTypePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/experiencetype",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getExperienceTypeById(id: string): Observable<ExperienceTypeGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/experiencetype/" + id,
      method: "GET",
    };
    return this.request<ExperienceTypeGETData>(request);
  }

  updateExperienceTypeById(id: string, body: ExperienceTypePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/experiencetype/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteExperienceTypeById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/experiencetype/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findExperienceTypes(body: ExperienceTypeCriteria): Observable<ExperienceTypeGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/experiencetype/query",
      method: "POST",
      body: body,
    };
    return this.request<ExperienceTypeGETDataSearchResults>(request);
  }

  createCLCourse(body: CLCoursePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/integration_edu/clcourse",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getCLCourseById(id: string): Observable<CLCourseGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/integration_edu/clcourse/" + id,
      method: "GET",
    };
    return this.request<CLCourseGETData>(request);
  }

  updateCLCourseById(id: string, body: CLCoursePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/integration_edu/clcourse/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteCLCourseById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/integration_edu/clcourse/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findCLCourses(body: CLCourseCriteria): Observable<CLCourseGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/integration_edu/clcourse/query",
      method: "POST",
      body: body,
    };
    return this.request<CLCourseGETDataSearchResults>(request);
  }

  createCLGuidance(body: CLGuidancePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/integration_edu/clguidance",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getCLGuidanceById(id: string): Observable<CLGuidanceGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/integration_edu/clguidance/" + id,
      method: "GET",
    };
    return this.request<CLGuidanceGETData>(request);
  }

  updateCLGuidanceById(id: string, body: CLGuidancePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/integration_edu/clguidance/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteCLGuidanceById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/integration_edu/clguidance/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findCLGuidances(body: CLGuidanceCriteria): Observable<CLGuidanceGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/integration_edu/clguidance/query",
      method: "POST",
      body: body,
    };
    return this.request<CLGuidanceGETDataSearchResults>(request);
  }

  createCLSchool(body: CLSchoolPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/integration_edu/clschool",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getCLSchoolById(id: string): Observable<CLSchoolGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/integration_edu/clschool/" + id,
      method: "GET",
    };
    return this.request<CLSchoolGETData>(request);
  }

  updateCLSchoolById(id: string, body: CLSchoolPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/integration_edu/clschool/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteCLSchoolById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/integration_edu/clschool/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findCLSchools(body: CLSchoolCriteria): Observable<CLSchoolGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/integration_edu/clschool/query",
      method: "POST",
      body: body,
    };
    return this.request<CLSchoolGETDataSearchResults>(request);
  }

  createCLStudent(body: CLStudentPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/integration_edu/clstudent",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getCLStudentById(id: string): Observable<CLStudentGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/integration_edu/clstudent/" + id,
      method: "GET",
    };
    return this.request<CLStudentGETData>(request);
  }

  updateCLStudentById(id: string, body: CLStudentPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/integration_edu/clstudent/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteCLStudentById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/integration_edu/clstudent/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findCLStudents(body: CLStudentCriteria): Observable<CLStudentGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/integration_edu/clstudent/query",
      method: "POST",
      body: body,
    };
    return this.request<CLStudentGETDataSearchResults>(request);
  }

  createPMBucketFolder(body: PMBucketFolderPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmbucketfolder",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getPMBucketFolderById(id: string): Observable<PMBucketFolderGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmbucketfolder/" + id,
      method: "GET",
    };
    return this.request<PMBucketFolderGETData>(request);
  }

  updatePMBucketFolderById(id: string, body: PMBucketFolderPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmbucketfolder/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deletePMBucketFolderById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmbucketfolder/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findPMBucketFolders(body: PMBucketFolderCriteria): Observable<PMBucketFolderGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmbucketfolder/query",
      method: "POST",
      body: body,
    };
    return this.request<PMBucketFolderGETDataSearchResults>(request);
  }

  createPMFileBlob(body: PMFileBlobPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmfileblob",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getPMFileBlobById(id: string): Observable<PMFileBlobGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmfileblob/" + id,
      method: "GET",
    };
    return this.request<PMFileBlobGETData>(request);
  }

  updatePMFileBlobById(id: string, body: PMFileBlobPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmfileblob/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deletePMFileBlobById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmfileblob/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findPMFileBlobs(body: PMFileBlobCriteria): Observable<PMFileBlobGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmfileblob/query",
      method: "POST",
      body: body,
    };
    return this.request<PMFileBlobGETDataSearchResults>(request);
  }

  createPMFile(body: PMFilePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmfile",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getPMFileById(id: string): Observable<PMFileGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmfile/" + id,
      method: "GET",
    };
    return this.request<PMFileGETData>(request);
  }

  updatePMFileById(id: string, body: PMFilePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmfile/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deletePMFileById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmfile/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findPMFiles(body: PMFileCriteria): Observable<PMFileGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmfile/query",
      method: "POST",
      body: body,
    };
    return this.request<PMFileGETDataSearchResults>(request);
  }

  createProvider(body: ProviderPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/prov/provider",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getProviderById(id: string): Observable<ProviderGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/prov/provider/" + id,
      method: "GET",
    };
    return this.request<ProviderGETData>(request);
  }

  updateProviderById(id: string, body: ProviderPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/prov/provider/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteProviderById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/prov/provider/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findProviders(body: ProviderCriteria): Observable<ProviderGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/prov/provider/query",
      method: "POST",
      body: body,
    };
    return this.request<ProviderGETDataSearchResults>(request);
  }

  createProviderTypeRef(body: ProviderTypeRefPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/prov/providertyperef",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getProviderTypeRefById(id: string): Observable<ProviderTypeRefGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/prov/providertyperef/" + id,
      method: "GET",
    };
    return this.request<ProviderTypeRefGETData>(request);
  }

  updateProviderTypeRefById(id: string, body: ProviderTypeRefPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/prov/providertyperef/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteProviderTypeRefById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/prov/providertyperef/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findProviderTypeRefs(body: ProviderTypeRefCriteria): Observable<ProviderTypeRefGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/prov/providertyperef/query",
      method: "POST",
      body: body,
    };
    return this.request<ProviderTypeRefGETDataSearchResults>(request);
  }

  createProviderUser(body: ProviderUserPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/prov/provideruser",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getProviderUserById(id: string): Observable<ProviderUserGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/prov/provideruser/" + id,
      method: "GET",
    };
    return this.request<ProviderUserGETData>(request);
  }

  updateProviderUserById(id: string, body: ProviderUserPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/prov/provideruser/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteProviderUserById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/prov/provideruser/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findProviderUsers(body: ProviderUserCriteria): Observable<ProviderUserGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/prov/provideruser/query",
      method: "POST",
      body: body,
    };
    return this.request<ProviderUserGETDataSearchResults>(request);
  }

  createProviderRequest(body: ProviderRequestPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/provreq/providerrequest",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getProviderRequestById(id: string): Observable<ProviderRequestGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/provreq/providerrequest/" + id,
      method: "GET",
    };
    return this.request<ProviderRequestGETData>(request);
  }

  updateProviderRequestById(id: string, body: ProviderRequestPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/provreq/providerrequest/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteProviderRequestById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/provreq/providerrequest/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findProviderRequests(body: ProviderRequestCriteria): Observable<ProviderRequestGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/provreq/providerrequest/query",
      method: "POST",
      body: body,
    };
    return this.request<ProviderRequestGETDataSearchResults>(request);
  }

  createProviderRequestTypeRef(body: ProviderRequestTypeRefPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/provreq/providerrequesttyperef",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getProviderRequestTypeRefById(id: string): Observable<ProviderRequestTypeRefGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/provreq/providerrequesttyperef/" + id,
      method: "GET",
    };
    return this.request<ProviderRequestTypeRefGETData>(request);
  }

  updateProviderRequestTypeRefById(id: string, body: ProviderRequestTypeRefPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/provreq/providerrequesttyperef/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteProviderRequestTypeRefById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/provreq/providerrequesttyperef/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findProviderRequestTypeRefs(body: ProviderRequestTypeRefCriteria): Observable<ProviderRequestTypeRefGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/provreq/providerrequesttyperef/query",
      method: "POST",
      body: body,
    };
    return this.request<ProviderRequestTypeRefGETDataSearchResults>(request);
  }

  createStateTransitionLog(body: StateTransitionLogPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/statemachine/statetransitionlog",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getStateTransitionLogById(id: string): Observable<StateTransitionLogGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/statemachine/statetransitionlog/" + id,
      method: "GET",
    };
    return this.request<StateTransitionLogGETData>(request);
  }

  updateStateTransitionLogById(id: string, body: StateTransitionLogPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/statemachine/statetransitionlog/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteStateTransitionLogById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/statemachine/statetransitionlog/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findStateTransitionLogs(body: StateTransitionLogCriteria): Observable<StateTransitionLogGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/statemachine/statetransitionlog/query",
      method: "POST",
      body: body,
    };
    return this.request<StateTransitionLogGETDataSearchResults>(request);
  }

  createTaxonomyEntry(body: TaxonomyEntryPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/taxonomy/taxonomyentry",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getTaxonomyEntryById(id: string): Observable<TaxonomyEntryGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/taxonomy/taxonomyentry/" + id,
      method: "GET",
    };
    return this.request<TaxonomyEntryGETData>(request);
  }

  updateTaxonomyEntryById(id: string, body: TaxonomyEntryPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/taxonomy/taxonomyentry/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteTaxonomyEntryById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/taxonomy/taxonomyentry/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findTaxonomyEntrys(body: TaxonomyEntryCriteria): Observable<TaxonomyEntryGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/taxonomy/taxonomyentry/query",
      method: "POST",
      body: body,
    };
    return this.request<TaxonomyEntryGETDataSearchResults>(request);
  }

  createTaxonomyLevel(body: TaxonomyLevelPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/taxonomy/taxonomylevel",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getTaxonomyLevelById(id: string): Observable<TaxonomyLevelGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/taxonomy/taxonomylevel/" + id,
      method: "GET",
    };
    return this.request<TaxonomyLevelGETData>(request);
  }

  updateTaxonomyLevelById(id: string, body: TaxonomyLevelPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/taxonomy/taxonomylevel/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteTaxonomyLevelById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/taxonomy/taxonomylevel/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findTaxonomyLevels(body: TaxonomyLevelCriteria): Observable<TaxonomyLevelGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/taxonomy/taxonomylevel/query",
      method: "POST",
      body: body,
    };
    return this.request<TaxonomyLevelGETDataSearchResults>(request);
  }

  createTaxonomy(body: TaxonomyPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/taxonomy/taxonomy",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getTaxonomyById(id: string): Observable<TaxonomyGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/taxonomy/taxonomy/" + id,
      method: "GET",
    };
    return this.request<TaxonomyGETData>(request);
  }

  updateTaxonomyById(id: string, body: TaxonomyPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/taxonomy/taxonomy/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteTaxonomyById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/taxonomy/taxonomy/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findTaxonomys(body: TaxonomyCriteria): Observable<TaxonomyGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/taxonomy/taxonomy/query",
      method: "POST",
      body: body,
    };
    return this.request<TaxonomyGETDataSearchResults>(request);
  }

  createHcclOrganization(body: HcclOrganizationPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclorganization",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getHcclOrganizationById(id: string): Observable<HcclOrganizationGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclorganization/" + id,
      method: "GET",
    };
    return this.request<HcclOrganizationGETData>(request);
  }

  updateHcclOrganizationById(id: string, body: HcclOrganizationPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclorganization/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteHcclOrganizationById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclorganization/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findHcclOrganizations(body: HcclOrganizationCriteria): Observable<HcclOrganizationGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclorganization/query",
      method: "POST",
      body: body,
    };
    return this.request<HcclOrganizationGETDataSearchResults>(request);
  }

  createHcclOrganizationTypeRef(body: HcclOrganizationTypeRefPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclorganizationtyperef",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getHcclOrganizationTypeRefById(id: string): Observable<HcclOrganizationTypeRefGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclorganizationtyperef/" + id,
      method: "GET",
    };
    return this.request<HcclOrganizationTypeRefGETData>(request);
  }

  updateHcclOrganizationTypeRefById(id: string, body: HcclOrganizationTypeRefPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclorganizationtyperef/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteHcclOrganizationTypeRefById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclorganizationtyperef/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findHcclOrganizationTypeRefs(body: HcclOrganizationTypeRefCriteria): Observable<HcclOrganizationTypeRefGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclorganizationtyperef/query",
      method: "POST",
      body: body,
    };
    return this.request<HcclOrganizationTypeRefGETDataSearchResults>(request);
  }

  createHcclTeamLog(body: HcclTeamLogPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclteamlog",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getHcclTeamLogById(id: string): Observable<HcclTeamLogGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclteamlog/" + id,
      method: "GET",
    };
    return this.request<HcclTeamLogGETData>(request);
  }

  updateHcclTeamLogById(id: string, body: HcclTeamLogPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclteamlog/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteHcclTeamLogById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclteamlog/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findHcclTeamLogs(body: HcclTeamLogCriteria): Observable<HcclTeamLogGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclteamlog/query",
      method: "POST",
      body: body,
    };
    return this.request<HcclTeamLogGETDataSearchResults>(request);
  }

  createHcclTeamMemberRole(body: HcclTeamMemberRolePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclteammemberrole",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getHcclTeamMemberRoleById(id: string): Observable<HcclTeamMemberRoleGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclteammemberrole/" + id,
      method: "GET",
    };
    return this.request<HcclTeamMemberRoleGETData>(request);
  }

  updateHcclTeamMemberRoleById(id: string, body: HcclTeamMemberRolePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclteammemberrole/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteHcclTeamMemberRoleById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclteammemberrole/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findHcclTeamMemberRoles(body: HcclTeamMemberRoleCriteria): Observable<HcclTeamMemberRoleGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclteammemberrole/query",
      method: "POST",
      body: body,
    };
    return this.request<HcclTeamMemberRoleGETDataSearchResults>(request);
  }

  createHcclTeamMember(body: HcclTeamMemberPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclteammember",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getHcclTeamMemberById(id: string): Observable<HcclTeamMemberGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclteammember/" + id,
      method: "GET",
    };
    return this.request<HcclTeamMemberGETData>(request);
  }

  updateHcclTeamMemberById(id: string, body: HcclTeamMemberPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclteammember/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteHcclTeamMemberById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclteammember/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findHcclTeamMembers(body: HcclTeamMemberCriteria): Observable<HcclTeamMemberGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclteammember/query",
      method: "POST",
      body: body,
    };
    return this.request<HcclTeamMemberGETDataSearchResults>(request);
  }

  createHcclTeam(body: HcclTeamPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclteam",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getHcclTeamById(id: string): Observable<HcclTeamGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclteam/" + id,
      method: "GET",
    };
    return this.request<HcclTeamGETData>(request);
  }

  updateHcclTeamById(id: string, body: HcclTeamPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclteam/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteHcclTeamById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclteam/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findHcclTeams(body: HcclTeamCriteria): Observable<HcclTeamGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclteam/query",
      method: "POST",
      body: body,
    };
    return this.request<HcclTeamGETDataSearchResults>(request);
  }

  createHcclUserProfileRole(body: HcclUserProfileRolePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluserprofilerole",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getHcclUserProfileRoleById(id: string): Observable<HcclUserProfileRoleGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluserprofilerole/" + id,
      method: "GET",
    };
    return this.request<HcclUserProfileRoleGETData>(request);
  }

  updateHcclUserProfileRoleById(id: string, body: HcclUserProfileRolePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluserprofilerole/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteHcclUserProfileRoleById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluserprofilerole/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findHcclUserProfileRoles(body: HcclUserProfileRoleCriteria): Observable<HcclUserProfileRoleGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluserprofilerole/query",
      method: "POST",
      body: body,
    };
    return this.request<HcclUserProfileRoleGETDataSearchResults>(request);
  }

  createHcclUserProfile(body: HcclUserProfilePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluserprofile",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  createStudentTicket(id: string, body: CreateTicketPOSTData): Observable<WorkItemFormResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluserprofile/" + id + "/new-student-request",
      method: "POST",
      body: body,
    };
    return this.requestCreate<WorkItemFormResponse>(request);
  }

  getHcclUserProfileById(id: string): Observable<HcclUserProfileGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluserprofile/" + id,
      method: "GET",
    };
    return this.request<HcclUserProfileGETData>(request);
  }

  updateHcclUserProfileById(id: string, body: HcclUserProfilePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluserprofile/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteHcclUserProfileById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluserprofile/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findHcclUserProfiles(body: HcclUserProfileCriteria): Observable<HcclUserProfileGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluserprofile/query",
      method: "POST",
      body: body,
    };
    return this.request<HcclUserProfileGETDataSearchResults>(request);
  }

  createHcclUser(body: HcclUserPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluser",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getHcclUserById(id: string): Observable<HcclUserGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluser/" + id,
      method: "GET",
    };
    return this.request<HcclUserGETData>(request);
  }

  updateHcclUserById(id: string, body: HcclUserPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluser/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteHcclUserById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluser/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findHcclUsers(body: HcclUserCriteria): Observable<HcclUserGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluser/query",
      method: "POST",
      body: body,
    };
    return this.request<HcclUserGETDataSearchResults>(request);
  }

  createTeamMemberRoleRef(body: TeamMemberRoleRefPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/teammemberroleref",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getTeamMemberRoleRefById(id: string): Observable<TeamMemberRoleRefGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/teammemberroleref/" + id,
      method: "GET",
    };
    return this.request<TeamMemberRoleRefGETData>(request);
  }

  updateTeamMemberRoleRefById(id: string, body: TeamMemberRoleRefPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/teammemberroleref/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteTeamMemberRoleRefById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/teammemberroleref/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findTeamMemberRoleRefs(body: TeamMemberRoleRefCriteria): Observable<TeamMemberRoleRefGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/teammemberroleref/query",
      method: "POST",
      body: body,
    };
    return this.request<TeamMemberRoleRefGETDataSearchResults>(request);
  }

  createTeamTypeMemberRoleRef(body: TeamTypeMemberRoleRefPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/teamtypememberroleref",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getTeamTypeMemberRoleRefById(id: string): Observable<TeamTypeMemberRoleRefGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/teamtypememberroleref/" + id,
      method: "GET",
    };
    return this.request<TeamTypeMemberRoleRefGETData>(request);
  }

  updateTeamTypeMemberRoleRefById(id: string, body: TeamTypeMemberRoleRefPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/teamtypememberroleref/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteTeamTypeMemberRoleRefById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/teamtypememberroleref/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findTeamTypeMemberRoleRefs(body: TeamTypeMemberRoleRefCriteria): Observable<TeamTypeMemberRoleRefGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/teamtypememberroleref/query",
      method: "POST",
      body: body,
    };
    return this.request<TeamTypeMemberRoleRefGETDataSearchResults>(request);
  }

  createTeamTypeRef(body: TeamTypeRefPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/teamtyperef",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getTeamTypeRefById(id: string): Observable<TeamTypeRefGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/teamtyperef/" + id,
      method: "GET",
    };
    return this.request<TeamTypeRefGETData>(request);
  }

  updateTeamTypeRefById(id: string, body: TeamTypeRefPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/teamtyperef/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteTeamTypeRefById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/teamtyperef/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findTeamTypeRefs(body: TeamTypeRefCriteria): Observable<TeamTypeRefGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/teamtyperef/query",
      method: "POST",
      body: body,
    };
    return this.request<TeamTypeRefGETDataSearchResults>(request);
  }

  createWorkItemDeliverable(body: WorkItemDeliverablePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workitemdeliverable",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getWorkItemDeliverableById(id: string): Observable<WorkItemDeliverableGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workitemdeliverable/" + id,
      method: "GET",
    };
    return this.request<WorkItemDeliverableGETData>(request);
  }

  updateWorkItemDeliverableById(id: string, body: WorkItemDeliverablePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workitemdeliverable/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteWorkItemDeliverableById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workitemdeliverable/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findWorkItemDeliverables(body: WorkItemDeliverableCriteria): Observable<WorkItemDeliverableGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workitemdeliverable/query",
      method: "POST",
      body: body,
    };
    return this.request<WorkItemDeliverableGETDataSearchResults>(request);
  }

  createWorkQueue(body: WorkQueuePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workqueue",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getWorkQueueById(id: string): Observable<WorkQueueGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workqueue/" + id,
      method: "GET",
    };
    return this.request<WorkQueueGETData>(request);
  }

  updateWorkQueueById(id: string, body: WorkQueuePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workqueue/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteWorkQueueById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workqueue/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findWorkQueues(body: WorkQueueCriteria): Observable<WorkQueueGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workqueue/query",
      method: "POST",
      body: body,
    };
    return this.request<WorkQueueGETDataSearchResults>(request);
  }

  createWorkQueueTypeRef(body: WorkQueueTypeRefPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workqueuetyperef",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getWorkQueueTypeRefById(id: string): Observable<WorkQueueTypeRefGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workqueuetyperef/" + id,
      method: "GET",
    };
    return this.request<WorkQueueTypeRefGETData>(request);
  }

  updateWorkQueueTypeRefById(id: string, body: WorkQueueTypeRefPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workqueuetyperef/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteWorkQueueTypeRefById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workqueuetyperef/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findWorkQueueTypeRefs(body: WorkQueueTypeRefCriteria): Observable<WorkQueueTypeRefGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workqueuetyperef/query",
      method: "POST",
      body: body,
    };
    return this.request<WorkQueueTypeRefGETDataSearchResults>(request);
  }

  createWorkRequestItem(body: WorkRequestItemPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestitem",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getWorkRequestItemById(id: string): Observable<WorkRequestItemGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestitem/" + id,
      method: "GET",
    };
    return this.request<WorkRequestItemGETData>(request);
  }

  updateWorkRequestItemById(id: string, body: WorkRequestItemPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestitem/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteWorkRequestItemById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestitem/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findWorkRequestItems(body: WorkRequestItemCriteria): Observable<WorkRequestItemGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestitem/query",
      method: "POST",
      body: body,
    };
    return this.request<WorkRequestItemGETDataSearchResults>(request);
  }

  createWorkRequestLog(body: WorkRequestLogPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestlog",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getWorkRequestLogById(id: string): Observable<WorkRequestLogGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestlog/" + id,
      method: "GET",
    };
    return this.request<WorkRequestLogGETData>(request);
  }

  updateWorkRequestLogById(id: string, body: WorkRequestLogPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestlog/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteWorkRequestLogById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestlog/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findWorkRequestLogs(body: WorkRequestLogCriteria): Observable<WorkRequestLogGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestlog/query",
      method: "POST",
      body: body,
    };
    return this.request<WorkRequestLogGETDataSearchResults>(request);
  }

  createWorkRequestRoutingReason(body: WorkRequestRoutingReasonPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestroutingreason",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getWorkRequestRoutingReasonById(id: string): Observable<WorkRequestRoutingReasonGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestroutingreason/" + id,
      method: "GET",
    };
    return this.request<WorkRequestRoutingReasonGETData>(request);
  }

  updateWorkRequestRoutingReasonById(id: string, body: WorkRequestRoutingReasonPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestroutingreason/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteWorkRequestRoutingReasonById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestroutingreason/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findWorkRequestRoutingReasons(body: WorkRequestRoutingReasonCriteria): Observable<WorkRequestRoutingReasonGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestroutingreason/query",
      method: "POST",
      body: body,
    };
    return this.request<WorkRequestRoutingReasonGETDataSearchResults>(request);
  }

  createWorkRequest(body: WorkRequestPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequest",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getWorkRequestById(id: string): Observable<WorkRequestGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequest/" + id,
      method: "GET",
    };
    return this.request<WorkRequestGETData>(request);
  }

  updateWorkRequestById(id: string, body: WorkRequestPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequest/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteWorkRequestById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequest/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findWorkRequests(body: WorkRequestCriteria): Observable<WorkRequestGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequest/query",
      method: "POST",
      body: body,
    };
    return this.request<WorkRequestGETDataSearchResults>(request);
  }

  createWorkRequestTeam(body: WorkRequestTeamPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestteam",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getWorkRequestTeamById(id: string): Observable<WorkRequestTeamGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestteam/" + id,
      method: "GET",
    };
    return this.request<WorkRequestTeamGETData>(request);
  }

  updateWorkRequestTeamById(id: string, body: WorkRequestTeamPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestteam/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteWorkRequestTeamById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestteam/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findWorkRequestTeams(body: WorkRequestTeamCriteria): Observable<WorkRequestTeamGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestteam/query",
      method: "POST",
      body: body,
    };
    return this.request<WorkRequestTeamGETDataSearchResults>(request);
  }

  createWorkRequestTypeRef(body: WorkRequestTypeRefPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequesttyperef",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getWorkRequestTypeRefById(id: string): Observable<WorkRequestTypeRefGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequesttyperef/" + id,
      method: "GET",
    };
    return this.request<WorkRequestTypeRefGETData>(request);
  }

  updateWorkRequestTypeRefById(id: string, body: WorkRequestTypeRefPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequesttyperef/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteWorkRequestTypeRefById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequesttyperef/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findWorkRequestTypeRefs(body: WorkRequestTypeRefCriteria): Observable<WorkRequestTypeRefGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequesttyperef/query",
      method: "POST",
      body: body,
    };
    return this.request<WorkRequestTypeRefGETDataSearchResults>(request);
  }

  createPersonalStatement(body: PersonalStatementPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/personalstatement",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getPersonalStatementById(id: string): Observable<PersonalStatementGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/personalstatement/" + id,
      method: "GET",
    };
    return this.request<PersonalStatementGETData>(request);
  }

  updatePersonalStatementById(id: string, body: PersonalStatementPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/personalstatement/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deletePersonalStatementById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/personalstatement/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findPersonalStatements(body: PersonalStatementCriteria): Observable<PersonalStatementGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/personalstatement/query",
      method: "POST",
      body: body,
    };
    return this.request<PersonalStatementGETDataSearchResults>(request);
  }

  createVocationEncodingInstance(body: VocationEncodingInstancePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/vocationencodinginstance",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getVocationEncodingInstanceById(id: string): Observable<VocationEncodingInstanceGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/vocationencodinginstance/" + id,
      method: "GET",
    };
    return this.request<VocationEncodingInstanceGETData>(request);
  }

  updateVocationEncodingInstanceById(id: string, body: VocationEncodingInstancePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/vocationencodinginstance/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteVocationEncodingInstanceById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/vocationencodinginstance/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findVocationEncodingInstances(body: VocationEncodingInstanceCriteria): Observable<VocationEncodingInstanceGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/vocationencodinginstance/query",
      method: "POST",
      body: body,
    };
    return this.request<VocationEncodingInstanceGETDataSearchResults>(request);
  }

  createVocationEncodingRef(body: VocationEncodingRefPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/vocationencodingref",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getVocationEncodingRefById(id: string): Observable<VocationEncodingRefGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/vocationencodingref/" + id,
      method: "GET",
    };
    return this.request<VocationEncodingRefGETData>(request);
  }

  updateVocationEncodingRefById(id: string, body: VocationEncodingRefPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/vocationencodingref/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteVocationEncodingRefById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/vocationencodingref/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findVocationEncodingRefs(body: VocationEncodingRefCriteria): Observable<VocationEncodingRefGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/vocationencodingref/query",
      method: "POST",
      body: body,
    };
    return this.request<VocationEncodingRefGETDataSearchResults>(request);
  }

  createVocationEncoding(body: VocationEncodingPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/vocationencoding",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getVocationEncodingById(id: string): Observable<VocationEncodingGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/vocationencoding/" + id,
      method: "GET",
    };
    return this.request<VocationEncodingGETData>(request);
  }

  updateVocationEncodingById(id: string, body: VocationEncodingPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/vocationencoding/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteVocationEncodingById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/vocationencoding/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findVocationEncodings(body: VocationEncodingCriteria): Observable<VocationEncodingGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/vocationencoding/query",
      method: "POST",
      body: body,
    };
    return this.request<VocationEncodingGETDataSearchResults>(request);
  }

  encodeContent(body: EncodingPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/ai/encode",
      method: "POST",
      body: body,
    };
    return this.request<any>(request);
  }

  encodePrep(body: EncodingPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/ai/encodeprep",
      method: "POST",
      body: body,
    };
    return this.request<any>(request);
  }

  getEntityMapForFK(entity_type: string, body: any): Observable<HcclUserContextGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/intg/mapfk/" + entity_type,
      method: "POST",
      body: body,
    };
    return this.request<HcclUserContextGETData>(request);
  }

  getOrgSetupData(hccl_org_id: string, userId: string): Observable<HcclOrgSetupData> {
    const request: CommonServiceRequest = {
      url: "/hccl/intg/onboard/" + hccl_org_id + "/setupdata",
      method: "GET",
      params: { userId: this.convertToString(userId) },
    };
    return this.request<HcclOrgSetupData>(request);
  }

  onboardOrgUser(body: OnboardOrgUserPOSTData): Observable<HcclUserProfileGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/intg/onboard/orguser",
      method: "POST",
      body: body,
    };
    return this.request<HcclUserProfileGETData>(request);
  }

  promoteStudentsToUsers(body: CLStudentCriteria): Observable<SimpleRestActionResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/intg/actions/promote-students",
      method: "POST",
      body: body,
    };
    return this.request<SimpleRestActionResponse>(request);
  }

  resolveProviderTicketUIData(): Observable<WorkRequestDashboardUIGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/providers/dash-ui/tickets",
      method: "GET",
    };
    return this.request<WorkRequestDashboardUIGETData>(request);
  }

  resolveGuidanceUIData(): Observable<WorkRequestDashboardUIGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/students/dash-ui/guidance",
      method: "GET",
    };
    return this.request<WorkRequestDashboardUIGETData>(request);
  }

  acceptTicket(tix_id: string, body: RoutingActionPOSTData): Observable<WorkRequestGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tixui/" + tix_id + "/accept",
      method: "POST",
      body: body,
    };
    return this.request<WorkRequestGETData>(request);
  }

  callCreateTicket(body: CreateTicketPOSTData): Observable<WorkRequestGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tixui/create-ticket",
      method: "POST",
      body: body,
    };
    return this.request<WorkRequestGETData>(request);
  }

  callStateChangeGo(body: StateChangeFormRequest): Observable<StateChangeFormResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/tixui/state-change-go",
      method: "POST",
      body: body,
    };
    return this.request<StateChangeFormResponse>(request);
  }

  callStateChangeUISetup(entity_name: string, entity_id: string): Observable<StateChangeFormResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/tixui/state-change-setup/" + entity_name + "/" + entity_id,
      method: "POST",
    };
    return this.request<StateChangeFormResponse>(request);
  }

  callWorkRequestUi(tix_id: string, action_code: string, body: WorkItemFormRequest): Observable<WorkItemFormResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/tixui/" + tix_id + "/workrequestitemui/" + action_code,
      method: "POST",
      body: body,
    };
    return this.request<WorkItemFormResponse>(request);
  }

  getActionsMenu(tix_id: string): Observable<MenuControlDataList> {
    const request: CommonServiceRequest = {
      url: "/hccl/tixui/" + tix_id + "/wri-actions-menu",
      method: "GET",
    };
    return this.request<MenuControlDataList>(request);
  }

  getCreateTicketSetupUi(body: CreateTicketPOSTData): Observable<CreateTicketSetupUIData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tixui/create-ticket-setup-ui",
      method: "POST",
      body: body,
    };
    return this.request<CreateTicketSetupUIData>(request);
  }

  getDashQueuesForUserProfile(user_profile_id: string): Observable<WorkQueueGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/tixui/dashboard/" + user_profile_id + "/queues",
      method: "GET",
    };
    return this.request<WorkQueueGETDataSearchResults>(request);
  }

  getProviderQueuesMenu(tix_id: string): Observable<WorkQueueGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/tixui/" + tix_id + "/provider-queues-menu",
      method: "GET",
    };
    return this.request<WorkQueueGETDataSearchResults>(request);
  }

  rerouteTicket(tix_id: string, body: RoutingActionPOSTData): Observable<WorkRequestGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tixui/" + tix_id + "/reroute",
      method: "POST",
      body: body,
    };
    return this.request<WorkRequestGETData>(request);
  }

  resolveTicketContext(userProfileId: string): Observable<HcclUserContextGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tixui/get-context",
      method: "GET",
      params: { userProfileId: this.convertToString(userProfileId) },
    };
    return this.request<HcclUserContextGETData>(request);
  }

  checkApplicationHealth(): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/healthchecks/application",
      method: "GET",
    };
    return this.request<any>(request);
  }
}

export interface JobProcessLogGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  jobDefinition?: RelationshipGETData;
  name?: string;
  totalEntriesReserved?: number;
  totalEntries?: number;
  dateCompleted?: DateGETData;
  totalTimeInSeconds?: number;
  status?: string;
  errorMessage?: string;
}

export interface ServiceEventLogPOSTData {
  referenceId: string;
  entityName: string;
  eventName: string;
  eventJson?: string;
  nextEventName?: string;
  displayName?: string;
  groupId?: string;
  dateDue?: string;
  applicationCode?: string;
  parentId?: string;
}

export interface DocumentEventLogGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  serviceEventLog?: RelationshipGETData;
  applicationId?: string;
  fileName?: string;
  fileSize?: number;
  mediaType?: string;
  aboutPath?: string;
  fileUuidReference?: string;
  dateUploaded?: DateGETData;
}

export interface ServiceEventLogGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  referenceId?: string;
  entityName?: string;
  eventName?: string;
  eventJson?: string;
  errorMessage?: string;
  retries?: number;
  status?: number;
  statusValue?: string;
  responseStatus?: number;
  responseStatusFamily?: number;
  successMessage?: string;
  nextEventName?: string;
  displayName?: string;
  groupId?: string;
  dateDue?: DateGETData;
  applicationCode?: string;
  parentId?: string;
  documentEventLogs?: DocumentEventLogGETData[];
}

export interface ServiceEventLogCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  entityName?: string;
  eventName?: string;
  eventNames?: string[];
  statuses?: number[];
  groupId?: string;
  referenceId?: string;
  dateLogStarts?: string;
  dateLogEnds?: string;
  dateDue?: string;
  applicationCode?: string;
  parentId?: string;
  createdByName?: string;
}

export interface ServiceEventLogPUTData {
  referenceId: string;
  entityName: string;
  eventName: string;
  eventJson?: string;
  nextEventName?: string;
  displayName?: string;
  groupId?: string;
  dateDue?: string;
  applicationCode?: string;
  parentId?: string;
}

export interface CatalogEntryInterestPOSTData {
  catalogId: string;
  catalogEntryId: string;
  personalStatementId: string;
  userProfileId: string;
  interest: number;
  notes?: string;
}

export interface BaseCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
}

export interface CatalogEntryInterestGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  catalogId?: string;
  catalogEntryId?: string;
  personalStatementId?: string;
  userProfileId?: string;
  interest?: number;
  notes?: string;
}

export interface CatalogEntryInterestGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CatalogEntryInterestGETData[];
  filter?: BaseCriteria;
}

export interface DCPageData {
  totalRows?: number;
  pageNumber?: number;
  pageSize?: number;
  startingOffset?: number;
  totalPages?: number;
  endingOffset?: number;
  links?: string[];
}

export interface CatalogEntryInterestCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  catalogId?: string;
  catalogEntryId?: string;
  personalStatementId?: string;
  userProfileId?: string;
  interest?: number;
  interestRangeMin?: number;
  interestRangeMax?: number;
}

export interface CatalogEntryInterestPUTData {
  catalogId: string;
  catalogEntryId: string;
  personalStatementId: string;
  userProfileId: string;
  interest: number;
  notes?: string;
}

export interface CatalogEntryPOSTData {
  catalogId: string;
  entryCode: string;
  title: string;
  catalogTypeCode: string;
  shortDescription: string;
  description: string;
  tarotPrompt?: string;
  notes?: string;
  available: number;
  url?: string;
  vocodeInstanceId?: string;
  integrationEntityId?: string;
  integrationEntityType?: string;
  integrationEntityName?: string;
  version?: number;
  updateNotes?: string;
  updatedByUserProfileId?: string;
  referenceId?: string;
}

export interface CatalogEntryGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  catalogId?: string;
  entryCode?: string;
  title?: string;
  catalogTypeCode?: string;
  shortDescription?: string;
  description?: string;
  tarotPrompt?: string;
  notes?: string;
  available?: number;
  url?: string;
  vocodeInstanceId?: string;
  integrationEntityId?: string;
  integrationEntityType?: string;
  integrationEntityName?: string;
  version?: number;
  updateNotes?: string;
  updatedByUserProfileId?: string;
  referenceId?: string;
  catalogCode?: string;
  distance?: number;
  distanceFromCode?: string;
}

export interface CatalogEntryGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CatalogEntryGETData[];
  filter?: BaseCriteria;
  catalog?: CatalogGETData;
}

export interface CatalogGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  organizationId?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  taxonomyEntryId?: string;
  urlPrefix?: string;
  url?: string;
  stats?: CatalogStatsPOJO;
}

export interface CatalogStatsPOJO {
  dateRange?: DateRangeGETData;
  entryCount?: number;
  interestCount?: number;
}

export interface DateRangeGETData {
  theStart?: DateGETData;
  theEnd?: DateGETData;
  valid?: boolean;
}

export interface CatalogEntryCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  catalogId?: string;
  entryCode?: string;
  title?: string;
  catalogTypeCode?: string;
  shortDescription?: string;
  available?: number;
  url?: string;
  vocodeInstanceId?: string;
  integrationEntityId?: string;
  integrationEntityType?: string;
  integrationEntityName?: string;
  version?: number;
  updateNotes?: string;
  updatedByUserProfileId?: string;
  referenceId?: string;
  vocationEncodingId?: string;
  searchingForEditVersion?: boolean;
}

export interface VeiSearchResultsGETData {
  catalogEntries?: CatalogEntryGETDataSearchResults;
  mapVocationRef?: any;
  mapCatalog?: any;
}

export interface VocationEncodingRefGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  primaryCode?: number;
  secondaryCode?: number;
}

export interface CatalogEntryPUTData {
  catalogId: string;
  entryCode: string;
  title: string;
  catalogTypeCode: string;
  shortDescription: string;
  description: string;
  tarotPrompt?: string;
  notes?: string;
  available: number;
  url?: string;
  vocodeInstanceId?: string;
  integrationEntityId?: string;
  integrationEntityType?: string;
  integrationEntityName?: string;
  version?: number;
  updateNotes?: string;
  updatedByUserProfileId?: string;
  referenceId?: string;
}

export interface CatalogEntryTagPOSTData {
  catalogId: string;
  catalogEntryId: string;
  tagId?: string;
  tagCode: string;
  tagStringValue?: string;
  tagIntValue?: number;
  tagDoubleValue?: number;
  tagBooleanValue?: boolean;
  tagMinValue?: number;
  tagMaxValue?: number;
  jsonValue?: string;
}

export interface CatalogEntryTagGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  catalogId?: string;
  catalogEntryId?: string;
  tagId?: string;
  tagCode?: string;
  tagStringValue?: string;
  tagIntValue?: number;
  tagDoubleValue?: number;
  tagBooleanValue?: boolean;
  tagMinValue?: number;
  tagMaxValue?: number;
  jsonValue?: string;
}

export interface CatalogEntryTagGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CatalogEntryTagGETData[];
  filter?: BaseCriteria;
}

export interface CatalogEntryTagCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  catalogId?: string;
  catalogEntryId?: string;
  tagId?: string;
  tagCode?: string;
  tagStringValue?: string;
  tagIntValue?: number;
  tagDoubleValue?: number;
  tagBooleanValue?: boolean;
  tagMinValue?: number;
  tagMaxValue?: number;
}

export interface CatalogEntryTagPUTData {
  catalogId: string;
  catalogEntryId: string;
  tagId?: string;
  tagCode: string;
  tagStringValue?: string;
  tagIntValue?: number;
  tagDoubleValue?: number;
  tagBooleanValue?: boolean;
  tagMinValue?: number;
  tagMaxValue?: number;
  jsonValue?: string;
}

export interface CatalogSearchResultEntryPOSTData {
  catalogSearchResultId: string;
  catalogEntryId: string;
  catalogId: string;
  comments?: string;
}

export interface CatalogSearchResultEntryGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  catalogSearchResultId?: string;
  catalogEntryId?: string;
  catalogId?: string;
  comments?: string;
  catalogEntry?: CatalogEntryGETData;
}

export interface CatalogSearchResultEntryGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CatalogSearchResultEntryGETData[];
  filter?: BaseCriteria;
}

export interface CatalogSearchResultEntryCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  catalogSearchResultId?: string;
  catalogEntryId?: string;
  catalogId?: string;
  comments?: string;
}

export interface CatalogSearchResultEntryPUTData {
  catalogSearchResultId: string;
  catalogEntryId: string;
  catalogId: string;
  comments?: string;
}

export interface CatalogSearchResultPOSTData {
  catalogId: string;
  comments?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  parentWorkRequestItemId?: string;
}

export interface CatalogSearchResultGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  catalogId?: string;
  comments?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  parentWorkRequestItemId?: string;
  entries?: CatalogSearchResultEntryGETData[];
  entryIds?: string[];
}

export interface CatalogSearchResultGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CatalogSearchResultGETData[];
  filter?: BaseCriteria;
}

export interface CatalogSearchResultCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  catalogId?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  parentWorkRequestItemId?: string;
}

export interface CatalogSearchResultPUTData {
  catalogId: string;
  comments?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  parentWorkRequestItemId?: string;
}

export interface CatalogSearchPOSTData {
  searchName: string;
  businessCode: string;
  description: string;
  searchMapJson: string;
}

export interface CatalogSearchGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  searchName?: string;
  businessCode?: string;
  description?: string;
  searchMapJson?: string;
}

export interface CatalogSearchGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CatalogSearchGETData[];
  filter?: BaseCriteria;
}

export interface CatalogSearchCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  searchName?: string;
  businessCode?: string;
  description?: string;
  searchMapJson?: string;
}

export interface CatalogSearchPUTData {
  searchName: string;
  businessCode: string;
  description: string;
  searchMapJson: string;
}

export interface CatalogPOSTData {
  organizationId: string;
  name: string;
  businessCode: string;
  description: string;
  available: number;
  taxonomyEntryId?: string;
  urlPrefix?: string;
  url?: string;
}

export interface CatalogGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CatalogGETData[];
  filter?: BaseCriteria;
}

export interface CatalogCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  organizationId?: string;
  name?: string;
  businessCode?: string;
  available?: number;
  taxonomyEntryId?: string;
  urlPrefix?: string;
  url?: string;
  includingCatalogStats?: boolean;
  statsDateRange?: DateRangeGETData;
}

export interface CatalogPUTData {
  organizationId: string;
  name: string;
  businessCode: string;
  description: string;
  available: number;
  taxonomyEntryId?: string;
  urlPrefix?: string;
  url?: string;
}

export interface CatalogTagRefPOSTData {
  tagCode: string;
  nameText: string;
  description: string;
  tagValueType: string;
  tagMaxValue?: number;
  tagMinValue?: number;
}

export interface CatalogTagRefGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  tagCode?: string;
  nameText?: string;
  description?: string;
  tagValueType?: string;
  tagMaxValue?: number;
  tagMinValue?: number;
}

export interface CatalogTagRefGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CatalogTagRefGETData[];
  filter?: BaseCriteria;
}

export interface CatalogTagRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  tagCode?: string;
  tagValueType?: string;
  tagMaxValue?: number;
  tagMinValue?: number;
}

export interface CatalogTagRefPUTData {
  tagCode: string;
  nameText: string;
  description: string;
  tagValueType: string;
  tagMaxValue?: number;
  tagMinValue?: number;
}

export interface ExperienceLocationPOSTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
  geolocationLongitude?: number;
  geolocationLatitude?: number;
}

export interface ExperienceLocationGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  geolocationLongitude?: number;
  geolocationLatitude?: number;
}

export interface ExperienceLocationGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: ExperienceLocationGETData[];
  filter?: BaseCriteria;
}

export interface ExperienceLocationCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  available?: number;
  geolocationLongitude?: number;
  geolocationLatitude?: number;
}

export interface ExperienceLocationPUTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
  geolocationLongitude?: number;
  geolocationLatitude?: number;
}

export interface ExperienceRegRulePOSTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
}

export interface ExperienceRegRuleGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
}

export interface ExperienceRegRuleGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: ExperienceRegRuleGETData[];
  filter?: BaseCriteria;
}

export interface ExperienceRegRuleCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  available?: number;
}

export interface ExperienceRegRulePUTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
}

export interface ExperiencePOSTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
  exprienceType: RelationshipGETData;
  currentStateTransitionId?: string;
  currentState?: string;
  currentStateDateEntered?: string;
  voctechTaxonomy: RelationshipGETData;
  location: RelationshipGETData;
  registrationRules?: RelationshipGETData;
  dateRegistrationStart?: string;
  dateRegistrationEnd?: string;
  maxParticipants?: number;
  minParticipants?: number;
  dateRegistrationClosed?: string;
}

export interface ExperienceGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  exprienceType?: RelationshipGETData;
  currentStateTransitionId?: string;
  currentState?: string;
  voctechTaxonomy?: RelationshipGETData;
  location?: RelationshipGETData;
  registrationRules?: RelationshipGETData;
  maxParticipants?: number;
  minParticipants?: number;
}

export interface ExperienceGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: ExperienceGETData[];
  filter?: BaseCriteria;
}

export interface ExperienceCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  available?: number;
  currentStateTransitionId?: string;
  currentState?: string;
  currentStateDateEntered?: string;
  dateRegistrationStart?: string;
  dateRegistrationEnd?: string;
  maxParticipants?: number;
  minParticipants?: number;
  dateRegistrationClosed?: string;
}

export interface ExperiencePUTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
  exprienceType: RelationshipGETData;
  currentStateTransitionId?: string;
  currentState?: string;
  currentStateDateEntered?: string;
  voctechTaxonomy: RelationshipGETData;
  location: RelationshipGETData;
  registrationRules?: RelationshipGETData;
  dateRegistrationStart?: string;
  dateRegistrationEnd?: string;
  maxParticipants?: number;
  minParticipants?: number;
  dateRegistrationClosed?: string;
}

export interface ExperienceTypePOSTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
  statePolicyCode: string;
}

export interface ExperienceTypeGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  statePolicyCode?: string;
}

export interface ExperienceTypeGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: ExperienceTypeGETData[];
  filter?: BaseCriteria;
}

export interface ExperienceTypeCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  available?: number;
  statePolicyCode?: string;
}

export interface ExperienceTypePUTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
  statePolicyCode: string;
}

export interface CLCoursePOSTData {
  organizationId?: string;
  name: string;
  businessCode: string;
  available: number;
  dataOriginCode?: string;
  catalogCode: string;
  title: string;
  shortDescription: string;
  description: string;
  schoolId: string;
}

export interface CLCourseGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  organizationId?: string;
  name?: string;
  businessCode?: string;
  available?: number;
  dataOriginCode?: string;
  catalogCode?: string;
  title?: string;
  shortDescription?: string;
  description?: string;
  schoolId?: string;
}

export interface CLCourseGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CLCourseGETData[];
  filter?: BaseCriteria;
}

export interface CLCourseCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  organizationId?: string;
  name?: string;
  businessCode?: string;
  available?: number;
  dataOriginCode?: string;
  catalogCode?: string;
  title?: string;
  shortDescription?: string;
  schoolId?: string;
}

export interface CLCoursePUTData {
  organizationId?: string;
  name: string;
  businessCode: string;
  available: number;
  dataOriginCode?: string;
  catalogCode: string;
  title: string;
  shortDescription: string;
  description: string;
  schoolId: string;
}

export interface CLGuidancePOSTData {
  organizationId?: string;
  name: string;
  businessCode: string;
  available: number;
  dataOriginCode?: string;
  userProfileId?: string;
  userId?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  firstName: string;
  lastName: string;
  schoolId: string;
  jobTitle?: string;
}

export interface CLGuidanceGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  organizationId?: string;
  name?: string;
  businessCode?: string;
  available?: number;
  dataOriginCode?: string;
  userProfileId?: string;
  userId?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  firstName?: string;
  lastName?: string;
  schoolId?: string;
  jobTitle?: string;
}

export interface CLGuidanceGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CLGuidanceGETData[];
  filter?: BaseCriteria;
}

export interface CLGuidanceCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  organizationId?: string;
  name?: string;
  businessCode?: string;
  available?: number;
  dataOriginCode?: string;
  userProfileId?: string;
  userId?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  schoolId?: string;
  jobTitle?: string;
}

export interface CLGuidancePUTData {
  organizationId?: string;
  name: string;
  businessCode: string;
  available: number;
  dataOriginCode?: string;
  userProfileId?: string;
  userId?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  firstName: string;
  lastName: string;
  schoolId: string;
  jobTitle?: string;
}

export interface CLSchoolPOSTData {
  organizationId?: string;
  name: string;
  businessCode: string;
  available: number;
  dataOriginCode?: string;
  organizationName?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  districtCode?: string;
}

export interface CLSchoolGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  organizationId?: string;
  name?: string;
  businessCode?: string;
  available?: number;
  dataOriginCode?: string;
  organizationName?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  districtCode?: string;
}

export interface CLSchoolGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CLSchoolGETData[];
  filter?: BaseCriteria;
}

export interface CLSchoolCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  organizationId?: string;
  name?: string;
  businessCode?: string;
  available?: number;
  dataOriginCode?: string;
  organizationName?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  districtCode?: string;
}

export interface CLSchoolPUTData {
  organizationId?: string;
  name: string;
  businessCode: string;
  available: number;
  dataOriginCode?: string;
  organizationName?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  districtCode?: string;
}

export interface CLStudentPOSTData {
  organizationId?: string;
  name: string;
  businessCode: string;
  available: number;
  dataOriginCode?: string;
  userProfileId?: string;
  userId?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  firstName: string;
  lastName: string;
  schoolId: string;
}

export interface CLStudentGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  organizationId?: string;
  name?: string;
  businessCode?: string;
  available?: number;
  dataOriginCode?: string;
  userProfileId?: string;
  userId?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  firstName?: string;
  lastName?: string;
  schoolId?: string;
}

export interface CLStudentGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CLStudentGETData[];
  filter?: BaseCriteria;
}

export interface CLStudentCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  organizationId?: string;
  name?: string;
  businessCode?: string;
  available?: number;
  dataOriginCode?: string;
  userProfileId?: string;
  userId?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  firstName?: string;
  lastName?: string;
  schoolId?: string;
}

export interface CLStudentPUTData {
  organizationId?: string;
  name: string;
  businessCode: string;
  available: number;
  dataOriginCode?: string;
  userProfileId?: string;
  userId?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  firstName: string;
  lastName: string;
  schoolId: string;
}

export interface PMBucketFolderPOSTData {
  nameText: string;
  businessCode: string;
  bucketName: string;
  bucketFolder: string;
  description: string;
  available: number;
}

export interface PMBucketFolderGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  nameText?: string;
  businessCode?: string;
  bucketName?: string;
  bucketFolder?: string;
  description?: string;
  available?: number;
}

export interface PMBucketFolderGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: PMBucketFolderGETData[];
  filter?: BaseCriteria;
}

export interface PMBucketFolderCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  nameText?: string;
  businessCode?: string;
  bucketName?: string;
  bucketFolder?: string;
  available?: number;
}

export interface PMBucketFolderPUTData {
  nameText: string;
  businessCode: string;
  bucketName: string;
  bucketFolder: string;
  description: string;
  available: number;
}

export interface PMFileBlobPOSTData {
  pmfileId?: string;
  pathToFile: string;
  fileBlob: string;
}

export interface PMFileBlobGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  pmfileId?: string;
  pathToFile?: string;
  fileBlob?: string;
}

export interface PMFileBlobGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: PMFileBlobGETData[];
  filter?: BaseCriteria;
}

export interface PMFileBlobCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  pmfileId?: string;
  pathToFile?: string;
}

export interface PMFileBlobPUTData {
  pmfileId?: string;
  pathToFile: string;
  fileBlob: string;
}

export interface PMFilePOSTData {
  downloadAs: string;
  logicalPath: string;
  fileAccessCode: string;
  available?: number;
  pmbucketFolderId?: string;
  pmfileReferenceId?: string;
  uploadReferenceId?: string;
  uploadGroupReferenceId?: string;
  parentEntityId: string;
  copyFromPMFileId?: string;
  inTrash?: boolean;
  publicImage?: boolean;
  fileSize?: number;
  mimeType?: string;
  version?: number;
  bucketStorageUuid?: string;
  bucketFolderPath?: string;
  fileBlob?: string;
}

export interface PMFileGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  downloadAs?: string;
  logicalPath?: string;
  fileAccessCode?: string;
  available?: number;
  pmbucketFolderId?: string;
  pmfileReferenceId?: string;
  uploadReferenceId?: string;
  uploadGroupReferenceId?: string;
  parentEntityId?: string;
  copyFromPMFileId?: string;
  inTrash?: boolean;
  publicImage?: boolean;
  fileSize?: number;
  mimeType?: string;
  version?: number;
  bucketStorageUuid?: string;
  bucketFolderPath?: string;
}

export interface PMFileGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: PMFileGETData[];
  filter?: BaseCriteria;
}

export interface PMFileCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  downloadAs?: string;
  logicalPath?: string;
  fileAccessCode?: string;
  available?: number;
  pmbucketFolderId?: string;
  pmfileReferenceId?: string;
  uploadReferenceId?: string;
  uploadGroupReferenceId?: string;
  parentEntityId?: string;
  copyFromPMFileId?: string;
  inTrash?: boolean;
  publicImage?: boolean;
  fileSize?: number;
  mimeType?: string;
  version?: number;
  bucketStorageUuid?: string;
  bucketFolderPath?: string;
}

export interface PMFilePUTData {
  downloadAs: string;
  logicalPath: string;
  fileAccessCode: string;
  available?: number;
  pmbucketFolderId?: string;
  pmfileReferenceId?: string;
  uploadReferenceId?: string;
  uploadGroupReferenceId?: string;
  parentEntityId: string;
  copyFromPMFileId?: string;
  inTrash?: boolean;
  publicImage?: boolean;
  fileSize?: number;
  mimeType?: string;
  version?: number;
  bucketStorageUuid?: string;
  bucketFolderPath?: string;
  fileBlob?: string;
}

export interface ProviderPOSTData {
  name: string;
  businessCode: string;
  description: string;
  teamParentId: string;
  teamParentEntityType: string;
  teamParentName: string;
  modelJson: string;
  providerTypeId: string;
}

export interface ProviderGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  teamParentId?: string;
  teamParentEntityType?: string;
  teamParentName?: string;
  modelJson?: string;
  providerTypeId?: string;
}

export interface ProviderGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: ProviderGETData[];
  filter?: BaseCriteria;
}

export interface ProviderCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  teamParentId?: string;
  teamParentEntityType?: string;
  teamParentName?: string;
}

export interface ProviderPUTData {
  name: string;
  businessCode: string;
  description: string;
  teamParentId: string;
  teamParentEntityType: string;
  teamParentName: string;
  modelJson: string;
  providerTypeId: string;
}

export interface ProviderTypeRefPOSTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
}

export interface ProviderTypeRefGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
}

export interface ProviderTypeRefGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: ProviderTypeRefGETData[];
  filter?: BaseCriteria;
}

export interface ProviderTypeRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
}

export interface ProviderTypeRefPUTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
}

export interface ProviderUserPOSTData {
  providerId: string;
  userId: string;
  userCode: string;
}

export interface ProviderUserGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  providerId?: string;
  userId?: string;
  userCode?: string;
}

export interface ProviderUserGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: ProviderUserGETData[];
  filter?: BaseCriteria;
}

export interface ProviderUserCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  userCode?: string;
}

export interface ProviderUserPUTData {
  providerId: string;
  userId: string;
  userCode: string;
}

export interface ProviderRequestPOSTData {
  name: string;
  businessCode: string;
  description: string;
  currentStateTransitionId?: string;
  currentStateCode: string;
  currentStateDateEntered: string;
  rawRequestText: string;
  requesterUserId: string;
  advocateUserId: string;
  vocationEncodingId?: string;
  requestTypeId: string;
}

export interface ProviderRequestGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  currentStateTransitionId?: string;
  currentStateCode?: string;
  rawRequestText?: string;
  requesterUserId?: string;
  advocateUserId?: string;
  vocationEncodingId?: string;
  requestTypeId?: string;
}

export interface ProviderRequestGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: ProviderRequestGETData[];
  filter?: BaseCriteria;
}

export interface ProviderRequestCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  currentStateTransitionId?: string;
  currentStateCode?: string;
  currentStateDateEntered?: string;
  requesterUserId?: string;
  advocateUserId?: string;
  vocationEncodingId?: string;
  requestTypeId?: string;
}

export interface ProviderRequestPUTData {
  name: string;
  businessCode: string;
  description: string;
  currentStateTransitionId?: string;
  currentStateCode: string;
  currentStateDateEntered: string;
  rawRequestText: string;
  requesterUserId: string;
  advocateUserId: string;
  vocationEncodingId?: string;
  requestTypeId: string;
}

export interface ProviderRequestTypeRefPOSTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
  policyBeanName: string;
}

export interface ProviderRequestTypeRefGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  policyBeanName?: string;
}

export interface ProviderRequestTypeRefGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: ProviderRequestTypeRefGETData[];
  filter?: BaseCriteria;
}

export interface ProviderRequestTypeRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  policyBeanName?: string;
}

export interface ProviderRequestTypeRefPUTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
  policyBeanName: string;
}

export interface StateTransitionLogPOSTData {
  nameText: string;
  transactionReferenceId: string;
  parentId: string;
  parentEntityType: string;
  parentName: string;
  stateMachineBeanName: string;
  actionCode?: string;
  fromState?: string;
  toState: string;
  userInRoleCode?: string;
  extendedJson?: string;
  actionDataId?: string;
}

export interface StateTransitionLogGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  nameText?: string;
  transactionReferenceId?: string;
  parentId?: string;
  parentEntityType?: string;
  parentName?: string;
  stateMachineBeanName?: string;
  actionCode?: string;
  fromState?: string;
  toState?: string;
  userInRoleCode?: string;
  extendedJson?: string;
  actionDataId?: string;
}

export interface StateTransitionLogGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: StateTransitionLogGETData[];
  filter?: BaseCriteria;
}

export interface StateTransitionLogCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  nameText?: string;
  transactionReferenceId?: string;
  parentId?: string;
  parentEntityType?: string;
  parentName?: string;
  stateMachineBeanName?: string;
  actionCode?: string;
  fromState?: string;
  toState?: string;
  userInRoleCode?: string;
  actionDataId?: string;
}

export interface StateTransitionLogPUTData {
  nameText: string;
  transactionReferenceId: string;
  parentId: string;
  parentEntityType: string;
  parentName: string;
  stateMachineBeanName: string;
  actionCode?: string;
  fromState?: string;
  toState: string;
  userInRoleCode?: string;
  extendedJson?: string;
  actionDataId?: string;
}

export interface TaxonomyEntryPOSTData {
  nameText: string;
  businessCode: string;
  description: string;
  available: number;
  taxonomy: RelationshipGETData;
  taxonomyLevel: RelationshipGETData;
  parentTaxonomyEntry?: RelationshipGETData;
  taxonomyPath?: string;
  entryLevel?: number;
}

export interface TaxonomyEntryGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  nameText?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  taxonomy?: RelationshipGETData;
  taxonomyLevel?: RelationshipGETData;
  parentTaxonomyEntry?: RelationshipGETData;
  taxonomyPath?: string;
  entryLevel?: number;
}

export interface TaxonomyEntryGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: TaxonomyEntryGETData[];
  filter?: BaseCriteria;
}

export interface TaxonomyEntryCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  nameText?: string;
  businessCode?: string;
  available?: number;
  taxonomyPath?: string;
  entryLevel?: number;
}

export interface TaxonomyEntryPUTData {
  nameText: string;
  businessCode: string;
  description: string;
  available: number;
  taxonomy: RelationshipGETData;
  taxonomyLevel: RelationshipGETData;
  parentTaxonomyEntry?: RelationshipGETData;
  taxonomyPath?: string;
  entryLevel?: number;
}

export interface TaxonomyLevelPOSTData {
  nameText: string;
  businessCode: string;
  description: string;
  available: number;
  taxonomy: RelationshipGETData;
  level: number;
}

export interface TaxonomyLevelGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  nameText?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  taxonomy?: RelationshipGETData;
  level?: number;
}

export interface TaxonomyLevelGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: TaxonomyLevelGETData[];
  filter?: BaseCriteria;
}

export interface TaxonomyLevelCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  nameText?: string;
  businessCode?: string;
  available?: number;
  level?: number;
}

export interface TaxonomyLevelPUTData {
  nameText: string;
  businessCode: string;
  description: string;
  available: number;
  taxonomy: RelationshipGETData;
  level: number;
}

export interface TaxonomyPOSTData {
  nameText: string;
  businessCode: string;
  description: string;
  available: number;
  maxLevels?: number;
  defaultWeight?: number;
}

export interface TaxonomyGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  nameText?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  maxLevels?: number;
  defaultWeight?: number;
}

export interface TaxonomyGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: TaxonomyGETData[];
  filter?: BaseCriteria;
}

export interface TaxonomyCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  nameText?: string;
  businessCode?: string;
  available?: number;
  maxLevels?: number;
  defaultWeight?: number;
}

export interface TaxonomyPUTData {
  nameText: string;
  businessCode: string;
  description: string;
  available: number;
  maxLevels?: number;
  defaultWeight?: number;
}

export interface HcclOrganizationPOSTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
  jsonData?: string;
  websiteUrl?: string;
  organizationTypeId: string;
  parentEntityId?: string;
  parentEntityEntityType?: string;
  parentEntityName?: string;
  organizationTypeCode: string;
}

export interface HcclOrganizationGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  jsonData?: string;
  websiteUrl?: string;
  organizationTypeId?: string;
  parentEntityId?: string;
  parentEntityEntityType?: string;
  parentEntityName?: string;
}

export interface HcclOrganizationGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: HcclOrganizationGETData[];
  filter?: BaseCriteria;
}

export interface HcclOrganizationCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  websiteUrl?: string;
  organizationTypeId?: string;
  parentEntityId?: string;
  parentEntityEntityType?: string;
  parentEntityName?: string;
  organizationTypeCode?: string;
}

export interface HcclOrganizationPUTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
  jsonData?: string;
  websiteUrl?: string;
  organizationTypeId: string;
  parentEntityId?: string;
  parentEntityEntityType?: string;
  parentEntityName?: string;
}

export interface HcclOrganizationTypeRefPOSTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
}

export interface HcclOrganizationTypeRefGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
}

export interface HcclOrganizationTypeRefGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: HcclOrganizationTypeRefGETData[];
  filter?: BaseCriteria;
}

export interface HcclOrganizationTypeRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
}

export interface HcclOrganizationTypeRefPUTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
}

export interface HcclTeamLogPOSTData {
  nameText: string;
  description: string;
  teamId: string;
  teamMemberId?: string;
  roleCode: string;
  actionCode: string;
  commentText?: string;
}

export interface HcclTeamLogGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  nameText?: string;
  description?: string;
  teamId?: string;
  teamMemberId?: string;
  roleCode?: string;
  actionCode?: string;
  commentText?: string;
}

export interface HcclTeamLogGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: HcclTeamLogGETData[];
  filter?: BaseCriteria;
}

export interface HcclTeamLogCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  nameText?: string;
  description?: string;
  teamId?: string;
  teamMemberId?: string;
  roleCode?: string;
  actionCode?: string;
}

export interface HcclTeamLogPUTData {
  nameText: string;
  description: string;
  teamId: string;
  teamMemberId?: string;
  roleCode: string;
  actionCode: string;
  commentText?: string;
}

export interface HcclTeamMemberRolePOSTData {
  teamId: string;
  teamMemberId: string;
  teamMemberRoleId: string;
  dateAdded: string;
  dateRemoved?: string;
}

export interface HcclTeamMemberRoleGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  teamId?: string;
  teamMemberId?: string;
  teamMemberRoleId?: string;
}

export interface HcclTeamMemberRoleGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: HcclTeamMemberRoleGETData[];
  filter?: BaseCriteria;
}

export interface HcclTeamMemberRoleCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  teamId?: string;
  teamMemberId?: string;
  teamMemberRoleId?: string;
  dateAdded?: string;
  dateRemoved?: string;
}

export interface HcclTeamMemberRolePUTData {
  teamId: string;
  teamMemberId: string;
  teamMemberRoleId: string;
  dateAdded: string;
  dateRemoved?: string;
}

export interface HcclTeamMemberPOSTData {
  teamId: string;
  userId: string;
  userProfileId?: string;
  dateAdded: string;
  dateRemoved?: string;
}

export interface HcclTeamMemberGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  teamId?: string;
  userId?: string;
  userProfileId?: string;
  dateAdded?: DateGETData;
  dateRemoved?: DateGETData;
}

export interface HcclTeamMemberGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: HcclTeamMemberGETData[];
  filter?: BaseCriteria;
}

export interface HcclTeamMemberCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  teamId?: string;
  userId?: string;
  userProfileId?: string;
  dateAdded?: string;
  dateRemoved?: string;
}

export interface HcclTeamMemberPUTData {
  teamId: string;
  userId: string;
  userProfileId?: string;
  dateAdded: string;
  dateRemoved?: string;
}

export interface HcclTeamPOSTData {
  name: string;
  businessCode: string;
  description: string;
  teamTypeId: string;
  organizationId?: string;
  teamParentId?: string;
  teamParentEntityType?: string;
  teamParentName?: string;
  available: number;
}

export interface HcclTeamGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  teamTypeId?: string;
  organizationId?: string;
  teamParentId?: string;
  teamParentEntityType?: string;
  teamParentName?: string;
  available?: number;
  teamMembers?: HcclTeamMemberGETData[];
  teamMemberRoles?: HcclTeamMemberRoleGETData[];
}

export interface HcclTeamGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: HcclTeamGETData[];
  filter?: BaseCriteria;
}

export interface HcclTeamCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  organizationId?: string;
  teamParentId?: string;
  teamParentEntityType?: string;
  teamParentName?: string;
  available?: number;
}

export interface HcclTeamPUTData {
  name: string;
  businessCode: string;
  description: string;
  teamTypeId: string;
  organizationId?: string;
  teamParentId?: string;
  teamParentEntityType?: string;
  teamParentName?: string;
  available: number;
}

export interface HcclUserProfileRolePOSTData {
  userId: string;
  roleCode: string;
  userProfileId: string;
  organizationId: string;
}

export interface HcclUserProfileRoleGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  userId?: string;
  roleCode?: string;
  userProfileId?: string;
  organizationId?: string;
}

export interface HcclUserProfileRoleGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: HcclUserProfileRoleGETData[];
  filter?: BaseCriteria;
}

export interface HcclUserProfileRoleCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  roleCode?: string;
  userProfileId?: string;
  organizationId?: string;
}

export interface HcclUserProfileRolePUTData {
  userId: string;
  roleCode: string;
  userProfileId: string;
  organizationId: string;
}

export interface HcclUserProfilePOSTData {
  userId: string;
  userCode: string;
  organizationId: string;
  profileTypeCode: string;
  jsonData?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  available: number;
  externalUserId?: string;
  externalUserEntityType?: string;
  externalUserName?: string;
}

export interface WorkItemFormContext {
  workRequestId: string;
  workRequestItemId?: string;
  userProfileId?: string;
  mapContextData?: any;
  mapResultsData?: any;
}

export interface WorkItemFormResponse {
  context?: WorkItemFormContext;
  messages?: SimpleMessageList;
  workItemData?: WorkRequestItemGETData;
  workRequestData?: WorkRequestGETData;
  actionFormData?: any;
  mapFormElements?: any;
}

export interface WorkRequestGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  workRequestTypeId?: string;
  currentStateCode?: string;
  currentStateTransitionId?: string;
  workQueueId?: string;
  initialWorkQueueId?: string;
  clientUserProfileId?: string;
  createdByTeamId?: string;
  createdByUserId?: string;
  createdByUserProfileId?: string;
  createdByOrganizationId?: string;
  acceptedByTeamId?: string;
  acceptedByUserId?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  parentWorkRequestItemId?: string;
}

export interface WorkRequestItemGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  workRequestId?: string;
  nameText?: string;
  businessCode?: string;
  sequenceOrder?: number;
  description?: string;
  acceptedByUserId?: string;
  roleCode?: string;
  actionCode?: string;
  jsonData?: string;
  commentText?: string;
  currentStateCode?: string;
  currentStateTransitionId?: string;
}

export interface CreateTicketPOSTData {
  advocateUserProfileId?: string;
  studentUserProfileId?: string;
  queueId?: string;
  workRequestTypeId?: string;
  title?: string;
  rawText?: string;
}

export interface HcclUserGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  externalUserId?: string;
  externalUserEntityType?: string;
  externalUserName?: string;
  available?: number;
}

export interface HcclUserProfileGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  userId?: string;
  userCode?: string;
  organizationId?: string;
  profileTypeCode?: string;
  jsonData?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  available?: number;
  externalUserId?: string;
  externalUserEntityType?: string;
  externalUserName?: string;
  roles?: string[];
  theUser?: HcclUserGETData;
}

export interface HcclUserProfileGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: HcclUserProfileGETData[];
  filter?: BaseCriteria;
}

export interface HcclUserProfileCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  userId?: string;
  userCode?: string;
  organizationId?: string;
  profileTypeCode?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  available?: number;
  externalUserId?: string;
  externalUserEntityType?: string;
  externalUserName?: string;
  externalUserIds?: string[];
}

export interface HcclUserProfilePUTData {
  userId: string;
  userCode: string;
  organizationId: string;
  profileTypeCode: string;
  jsonData?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  available: number;
  externalUserId?: string;
  externalUserEntityType?: string;
  externalUserName?: string;
  name: string;
}

export interface HcclUserPOSTData {
  name: string;
  businessCode: string;
  description: string;
  externalUserId?: string;
  externalUserEntityType?: string;
  externalUserName?: string;
  available: number;
}

export interface HcclUserGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: HcclUserGETData[];
  filter?: BaseCriteria;
}

export interface HcclUserCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  externalUserId?: string;
  externalUserEntityType?: string;
  externalUserName?: string;
  available?: number;
}

export interface HcclUserPUTData {
  name: string;
  businessCode: string;
  description: string;
  externalUserId?: string;
  externalUserEntityType?: string;
  externalUserName?: string;
  available: number;
}

export interface TeamMemberRoleRefPOSTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
}

export interface TeamMemberRoleRefGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
}

export interface TeamMemberRoleRefGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: TeamMemberRoleRefGETData[];
  filter?: BaseCriteria;
}

export interface TeamMemberRoleRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
}

export interface TeamMemberRoleRefPUTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
}

export interface TeamTypeMemberRoleRefPOSTData {
  teamType: RelationshipGETData;
  teamMemberRole: RelationshipGETData;
  available: number;
}

export interface TeamTypeMemberRoleRefGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  teamType?: RelationshipGETData;
  teamMemberRole?: RelationshipGETData;
  available?: number;
}

export interface TeamTypeMemberRoleRefGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: TeamTypeMemberRoleRefGETData[];
  filter?: BaseCriteria;
}

export interface TeamTypeMemberRoleRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  teamType?: RelationshipGETData;
  teamMemberRole?: RelationshipGETData;
  available?: number;
}

export interface TeamTypeMemberRoleRefPUTData {
  teamType: RelationshipGETData;
  teamMemberRole: RelationshipGETData;
  available: number;
}

export interface TeamTypeRefPOSTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
}

export interface TeamTypeRefGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
}

export interface TeamTypeRefGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: TeamTypeRefGETData[];
  filter?: BaseCriteria;
}

export interface TeamTypeRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
}

export interface TeamTypeRefPUTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
}

export interface WorkItemDeliverablePOSTData {
  workRequestId: string;
  workRequestItemId?: string;
  nameText: string;
  businessCode: string;
  description?: string;
  delivTypeCode: string;
  comments?: string;
  jsonData?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  currentStateCode: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
  linkToDeliverableId?: string;
}

export interface WorkItemDeliverableGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  workRequestId?: string;
  workRequestItemId?: string;
  nameText?: string;
  businessCode?: string;
  description?: string;
  delivTypeCode?: string;
  comments?: string;
  jsonData?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  currentStateCode?: string;
  currentStateTransitionId?: string;
  linkToDeliverableId?: string;
  catalogSearchResult?: CatalogSearchResultGETData;
}

export interface WorkItemDeliverableGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: WorkItemDeliverableGETData[];
  filter?: BaseCriteria;
}

export interface WorkItemDeliverableCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  workRequestId?: string;
  workRequestItemId?: string;
  nameText?: string;
  businessCode?: string;
  description?: string;
  delivTypeCode?: string;
  comments?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  currentStateCode?: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
  linkToDeliverableId?: string;
}

export interface WorkItemDeliverablePUTData {
  workRequestId: string;
  workRequestItemId?: string;
  nameText: string;
  businessCode: string;
  description?: string;
  delivTypeCode: string;
  comments?: string;
  jsonData?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  currentStateCode: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
  linkToDeliverableId?: string;
}

export interface WorkQueuePOSTData {
  name: string;
  businessCode: string;
  description: string;
  prefixCode: string;
  workQueueTypeId: string;
  workQueueTeamId: string;
  available: number;
  organizationId?: string;
  externalQueue: number;
}

export interface WorkQueueGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  prefixCode?: string;
  workQueueTypeId?: string;
  workQueueTeamId?: string;
  available?: number;
  organizationId?: string;
  externalQueue?: number;
  stats?: WorkQueueStatsPOJO;
}

export interface WorkQueueGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: WorkQueueGETData[];
  filter?: BaseCriteria;
}

export interface WorkQueueStatsPOJO {
  dateRange?: DateRangeGETData;
  entryCountBegin?: number;
  entryCountEnd?: number;
  createdCount?: number;
  openCount?: number;
  closedCount?: number;
  cancelledCount?: number;
}

export interface WorkQueueCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  prefixCode?: string;
  workQueueTypeId?: string;
  workQueueTeamId?: string;
  available?: number;
  organizationId?: string;
  externalQueue?: number;
  workQueueTypeCode?: string;
  organizationIdsToExclude?: string[];
  includingStats?: boolean;
  statsDateRange?: DateRangeGETData;
}

export interface WorkQueuePUTData {
  name: string;
  businessCode: string;
  description: string;
  prefixCode: string;
  workQueueTypeId: string;
  workQueueTeamId: string;
  available: number;
  organizationId?: string;
  externalQueue: number;
}

export interface WorkQueueTypeRefPOSTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
}

export interface WorkQueueTypeRefGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
}

export interface WorkQueueTypeRefGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: WorkQueueTypeRefGETData[];
  filter?: BaseCriteria;
}

export interface WorkQueueTypeRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
}

export interface WorkQueueTypeRefPUTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
}

export interface WorkRequestItemPOSTData {
  workRequestId: string;
  nameText: string;
  businessCode: string;
  sequenceOrder: number;
  description: string;
  acceptedByUserId?: string;
  roleCode?: string;
  actionCode: string;
  jsonData?: string;
  commentText?: string;
  currentStateCode: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
}

export interface WorkRequestItemGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: WorkRequestItemGETData[];
  filter?: BaseCriteria;
}

export interface WorkRequestItemCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  workRequestId?: string;
  nameText?: string;
  businessCode?: string;
  sequenceOrder?: number;
  description?: string;
  acceptedByUserId?: string;
  roleCode?: string;
  actionCode?: string;
  currentStateCode?: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
}

export interface WorkRequestItemPUTData {
  workRequestId: string;
  nameText: string;
  businessCode: string;
  sequenceOrder: number;
  description: string;
  acceptedByUserId?: string;
  roleCode?: string;
  actionCode: string;
  jsonData?: string;
  commentText?: string;
  currentStateCode: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
}

export interface WorkRequestLogPOSTData {
  nameText: string;
  description: string;
  transactionReferenceId: string;
  workRequestId: string;
  workRequestItemId?: string;
  workRequestReasonId?: string;
  stateTransitionLogId?: string;
  createdByUserId: string;
  roleCode: string;
  eventCode: string;
  actionSubCode?: string;
  statusCode?: string;
  commentText?: string;
  workItemDeliverableId?: string;
}

export interface WorkRequestLogGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
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
  workItemDeliverableId?: string;
}

export interface WorkRequestLogGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: WorkRequestLogGETData[];
  filter?: BaseCriteria;
}

export interface WorkRequestLogCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
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
  workItemDeliverableId?: string;
}

export interface WorkRequestLogPUTData {
  nameText: string;
  description: string;
  transactionReferenceId: string;
  workRequestId: string;
  workRequestItemId?: string;
  workRequestReasonId?: string;
  stateTransitionLogId?: string;
  createdByUserId: string;
  roleCode: string;
  eventCode: string;
  actionSubCode?: string;
  statusCode?: string;
  commentText?: string;
  workItemDeliverableId?: string;
}

export interface WorkRequestRoutingReasonPOSTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
}

export interface WorkRequestRoutingReasonGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
}

export interface WorkRequestRoutingReasonGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: WorkRequestRoutingReasonGETData[];
  filter?: BaseCriteria;
}

export interface WorkRequestRoutingReasonCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
}

export interface WorkRequestRoutingReasonPUTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
}

export interface WorkRequestPOSTData {
  name: string;
  businessCode: string;
  description: string;
  workRequestTypeId: string;
  currentStateCode: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
  workQueueId: string;
  initialWorkQueueId: string;
  clientUserProfileId?: string;
  createdByTeamId?: string;
  createdByUserId?: string;
  createdByUserProfileId?: string;
  createdByOrganizationId?: string;
  acceptedByTeamId?: string;
  acceptedByUserId?: string;
  dateAccepted?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  parentWorkRequestItemId?: string;
}

export interface WorkRequestGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: WorkRequestGETData[];
  filter?: BaseCriteria;
}

export interface WorkRequestCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  workRequestTypeId?: string;
  currentStateCode?: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
  workQueueId?: string;
  initialWorkQueueId?: string;
  clientUserProfileId?: string;
  createdByTeamId?: string;
  createdByUserId?: string;
  createdByUserProfileId?: string;
  createdByOrganizationId?: string;
  acceptedByTeamId?: string;
  acceptedByUserId?: string;
  dateAccepted?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  parentWorkRequestItemId?: string;
}

export interface WorkRequestPUTData {
  name: string;
  businessCode: string;
  description: string;
  workRequestTypeId: string;
  currentStateCode: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
  workQueueId: string;
  initialWorkQueueId: string;
  clientUserProfileId?: string;
  createdByTeamId?: string;
  createdByUserId?: string;
  createdByUserProfileId?: string;
  createdByOrganizationId?: string;
  acceptedByTeamId?: string;
  acceptedByUserId?: string;
  dateAccepted?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  parentWorkRequestItemId?: string;
}

export interface WorkRequestTeamPOSTData {
  name: string;
  businessCode: string;
  description: string;
  teamId: string;
  ownerEntityId?: string;
  ownerEntityType?: string;
  ownerEntityName?: string;
}

export interface WorkRequestTeamGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  teamId?: string;
  ownerEntityId?: string;
  ownerEntityType?: string;
  ownerEntityName?: string;
}

export interface WorkRequestTeamGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: WorkRequestTeamGETData[];
  filter?: BaseCriteria;
}

export interface WorkRequestTeamCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  teamId?: string;
  ownerEntityId?: string;
  ownerEntityType?: string;
  ownerEntityName?: string;
}

export interface WorkRequestTeamPUTData {
  name: string;
  businessCode: string;
  description: string;
  teamId: string;
  ownerEntityId?: string;
  ownerEntityType?: string;
  ownerEntityName?: string;
}

export interface WorkRequestTypeRefPOSTData {
  name: string;
  businessCode: string;
  description: string;
  policyBeanName: string;
  available: number;
}

export interface WorkRequestTypeRefGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  policyBeanName?: string;
  available?: number;
}

export interface WorkRequestTypeRefGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: WorkRequestTypeRefGETData[];
  filter?: BaseCriteria;
}

export interface WorkRequestTypeRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  policyBeanName?: string;
  available?: number;
}

export interface WorkRequestTypeRefPUTData {
  name: string;
  businessCode: string;
  description: string;
  policyBeanName: string;
  available: number;
}

export interface PersonalStatementPOSTData {
  name: string;
  businessCode: string;
  description?: string;
  statementTypeCode?: string;
  parentEntityId: string;
  parentEntityType?: string;
  parentEntityName?: string;
  rawText: string;
  encodingText: string;
  vocationEncodingId?: string;
  status?: number;
}

export interface PersonalStatementGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  name?: string;
  businessCode?: string;
  description?: string;
  statementTypeCode?: string;
  parentEntityId?: string;
  parentEntityType?: string;
  parentEntityName?: string;
  rawText?: string;
  encodingText?: string;
  vocationEncodingId?: string;
  status?: number;
}

export interface PersonalStatementGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: PersonalStatementGETData[];
  filter?: BaseCriteria;
}

export interface PersonalStatementCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  statementTypeCode?: string;
  parentEntityId?: string;
  parentEntityType?: string;
  parentEntityName?: string;
  vocationEncodingId?: string;
  status?: number;
}

export interface PersonalStatementPUTData {
  name: string;
  businessCode: string;
  description?: string;
  statementTypeCode?: string;
  parentEntityId: string;
  parentEntityType?: string;
  parentEntityName?: string;
  rawText: string;
  encodingText: string;
  vocationEncodingId?: string;
  status?: number;
}

export interface VocationEncodingInstancePOSTData {
  vocationEncodingId: string;
  encodingName: string;
  vocationEncodingRefId: string;
  sequenceOrder?: number;
  encodingDistance: number;
  originCode?: string;
  primaryCode?: number;
  secondaryCode?: number;
}

export interface VocationEncodingInstanceGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  vocationEncodingId?: string;
  encodingName?: string;
  vocationEncodingRefId?: string;
  sequenceOrder?: number;
  encodingDistance?: number;
  originCode?: string;
  primaryCode?: number;
  secondaryCode?: number;
}

export interface VocationEncodingInstanceGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: VocationEncodingInstanceGETData[];
  filter?: BaseCriteria;
}

export interface VocationEncodingInstanceCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  vocationEncodingId?: string;
  encodingName?: string;
  vocationEncodingRefId?: string;
  sequenceOrder?: number;
  originCode?: string;
  encodingDistance?: number;
  primaryCode?: number;
  secondaryCode?: number;
  secondaryCodeDistance?: number;
  catalogEntryTypeCode?: string;
}

export interface VocationEncodingInstancePUTData {
  vocationEncodingId: string;
  encodingName: string;
  vocationEncodingRefId: string;
  sequenceOrder?: number;
  encodingDistance: number;
  originCode?: string;
  primaryCode?: number;
  secondaryCode?: number;
}

export interface VocationEncodingRefPOSTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
  primaryCode?: number;
  secondaryCode?: number;
}

export interface VocationEncodingRefGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: VocationEncodingRefGETData[];
  filter?: BaseCriteria;
}

export interface VocationEncodingRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  primaryCode?: number;
  secondaryCode?: number;
}

export interface VocationEncodingRefPUTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
  primaryCode?: number;
  secondaryCode?: number;
}

export interface VocationEncodingPOSTData {
  encodingTypeCode?: string;
  parentEntityId?: string;
  parentEntityType?: string;
  parentEntityName?: string;
  encodingText: string;
  encodingResponseJson?: string;
  status?: number;
  errorMessage?: string;
  dateStart?: string;
  durationMs?: number;
  pipelineLogJson?: string;
  available?: number;
}

export interface VocationEncodingGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  encodingTypeCode?: string;
  parentEntityId?: string;
  parentEntityType?: string;
  parentEntityName?: string;
  encodingText?: string;
  encodingResponseJson?: string;
  status?: number;
  errorMessage?: string;
  durationMs?: number;
  pipelineLogJson?: string;
  available?: number;
  vocationEncodingInstances: VocationEncodingInstanceGETData[];
}

export interface VocationEncodingGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: VocationEncodingGETData[];
  filter?: BaseCriteria;
}

export interface VocationEncodingCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  encodingTypeCode?: string;
  parentEntityId?: string;
  parentEntityType?: string;
  parentEntityName?: string;
  status?: number;
  errorMessage?: string;
  dateStart?: string;
  durationMs?: number;
  available?: number;
}

export interface VocationEncodingPUTData {
  encodingTypeCode?: string;
  parentEntityId?: string;
  parentEntityType?: string;
  parentEntityName?: string;
  encodingText: string;
  encodingResponseJson?: string;
  status?: number;
  errorMessage?: string;
  dateStart?: string;
  durationMs?: number;
  pipelineLogJson?: string;
  available?: number;
}

export interface SearchDistancePOJO {
  datapointId?: string;
  distance?: number;
  title?: string;
  code?: string;
  definition?: string;
}

export interface EncodingPOSTData {
  textToEncode: string;
  sourceOfText: string;
}

export interface HcclUserContextGETData {
  currentUserProfileId: string;
  messages: SimpleMessageList;
  currentUserProfile: HcclUserProfileGETData;
  userProfileMenu: MenuControlDataList;
  dashQueues: WorkQueueGETData[];
}

export interface MenuControlData {
  id?: string;
  name?: string;
  icon?: string;
  active?: boolean;
  selected?: boolean;
  groupId?: string;
  roleRequired?: string;
  helpText?: string;
  allowedByRole?: boolean;
  allowedByRule?: boolean;
}

export interface MenuControlDataList {
  applicationName?: string;
  clientId?: string;
  menuId?: string;
  menuName?: string;
  label?: string;
  menuItems?: MenuControlData[];
  defaultAllowedByRule?: boolean;
}

export interface HcclOrgSetupData {
  profileTypeMenu: MenuControlDataList;
}

export interface OnboardOrgUserPOSTData {
  organizationId?: string;
  name?: string;
  userName?: string;
  emailAddress?: string;
  workPhone?: string;
  cellPhone?: string;
  roles?: string[];
  profileTypeCode?: string;
}

export interface SimpleRestActionContext {
  userName?: string;
}

export interface SimpleRestActionResponse {
  context?: SimpleRestActionContext;
  messages?: SimpleMessageList;
  data?: any;
  actionFormData?: any;
  mapFormElements?: any;
}

export interface EntityStateStatGETData {
  itemCount?: number;
  stateCode?: string;
  stateLabel?: string;
}

export interface WorkRequestDashboardUIGETData {
  recentWorkRequests?: WorkRequestGETDataSearchResults;
  mapStats?: any;
}

export interface RoutingActionPOSTData {
  userProfileId?: string;
  reasonId?: string;
  comments?: string;
  newQueueId?: string;
}

export interface EntityState {
  name?: string;
  stateCode?: string;
  requiredRole?: string;
  bgColor?: string;
  fgColor?: string;
  icon?: string;
  majorStatus?: number;
  defaultInitialState?: boolean;
  closeParentIfPossible?: boolean;
  defaultReadyState?: boolean;
  finalState?: boolean;
  categories?: string[];
  nextStates?: string[];
  closedState?: boolean;
  cancelledState?: boolean;
  openState?: boolean;
}

export interface EntityStateTransition {
  stateFrom?: EntityState;
  stateTo?: EntityState;
  stateTransitionId?: string;
  logMessage?: string;
  dateEntered?: string;
  messages?: SimpleMessageList;
  closeParentIfPossible?: boolean;
  stateTransitionValid?: boolean;
}

export interface StateChangeFormContext {
  entityType?: string;
  entityId: string;
  userProfileId?: string;
  mapContextData?: any;
  mapResultsData?: any;
}

export interface StateChangeFormResponse {
  context?: StateChangeFormContext;
  messages?: SimpleMessageList;
  nextStatesMenu?: MenuControlDataList;
  mapStateTransitions?: any;
  actionFormData?: any;
  mapFormElements?: any;
}

export interface StateChangeFormRequest {
  op?: string;
  context?: StateChangeFormContext;
  comments?: string;
  showingLegalTransitionsOnly?: boolean;
  nextState?: EntityStateTransition;
  actionFormData?: any;
}

export interface WorkItemFormRequest {
  op?: string;
  context?: WorkItemFormContext;
  actionFormData?: any;
}

export interface CreateTicketSetupUIData {
  data?: CreateTicketPOSTData;
  queuesMenu?: MenuControlDataList;
  workRequestTypesMenu?: MenuControlDataList;
  currentUserProfile?: HcclUserProfileGETData;
}

