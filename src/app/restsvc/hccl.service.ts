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

  createCatalogEntryFeedInstance(body: CatalogEntryFeedInstancePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentryfeedinstance",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getCatalogEntryFeedInstanceById(id: string): Observable<CatalogEntryFeedInstanceGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentryfeedinstance/" + id,
      method: "GET",
    };
    return this.request<CatalogEntryFeedInstanceGETData>(request);
  }

  updateCatalogEntryFeedInstanceById(id: string, body: CatalogEntryFeedInstancePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentryfeedinstance/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteCatalogEntryFeedInstanceById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentryfeedinstance/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findCatalogEntryFeedInstances(body: CatalogEntryFeedInstanceCriteria): Observable<CatalogEntryFeedInstanceGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentryfeedinstance/query",
      method: "POST",
      body: body,
    };
    return this.request<CatalogEntryFeedInstanceGETDataSearchResults>(request);
  }

  getCatalogEntryFeedInstanceByIdWithHint(id: string, hint: string): Observable<CatalogEntryFeedInstanceGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentryfeedinstance/" + id + "/hint",
      method: "GET",
      params: { hint: this.convertToString(hint) },
    };
    return this.request<CatalogEntryFeedInstanceGETData>(request);
  }

  createCatalogEntryFeedProfile(body: CatalogEntryFeedProfilePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentryfeedprofile",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getCatalogEntryFeedProfileById(id: string): Observable<CatalogEntryFeedProfileGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentryfeedprofile/" + id,
      method: "GET",
    };
    return this.request<CatalogEntryFeedProfileGETData>(request);
  }

  updateCatalogEntryFeedProfileById(id: string, body: CatalogEntryFeedProfilePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentryfeedprofile/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteCatalogEntryFeedProfileById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentryfeedprofile/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findCatalogEntryFeedProfiles(body: CatalogEntryFeedProfileCriteria): Observable<CatalogEntryFeedProfileGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentryfeedprofile/query",
      method: "POST",
      body: body,
    };
    return this.request<CatalogEntryFeedProfileGETDataSearchResults>(request);
  }

  getCatalogEntryFeedProfileByIdWithHint(id: string, hint: string): Observable<CatalogEntryFeedProfileGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentryfeedprofile/" + id + "/hint",
      method: "GET",
      params: { hint: this.convertToString(hint) },
    };
    return this.request<CatalogEntryFeedProfileGETData>(request);
  }

  createCatalogEntryGroupRef(body: CatalogEntryGroupRefPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentrygroupref",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getCatalogEntryGroupRefById(id: string): Observable<CatalogEntryGroupRefGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentrygroupref/" + id,
      method: "GET",
    };
    return this.request<CatalogEntryGroupRefGETData>(request);
  }

  updateCatalogEntryGroupRefById(id: string, body: CatalogEntryGroupRefPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentrygroupref/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteCatalogEntryGroupRefById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentrygroupref/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findCatalogEntryGroupRefs(body: CatalogEntryGroupRefCriteria): Observable<CatalogEntryGroupRefGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentrygroupref/query",
      method: "POST",
      body: body,
    };
    return this.request<CatalogEntryGroupRefGETDataSearchResults>(request);
  }

  createCatalogEntryInterest(body: CatalogEntryInterestPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentryinterest",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getCatalogEntryInterestById(id: string, hint: string): Observable<CatalogEntryInterestGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentryinterest/" + id,
      method: "GET",
      params: { hint: this.convertToString(hint) },
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

  getCatalogEntryByIdWithHint(id: string, hint: string): Observable<CatalogEntryGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentry/" + id + "/hint",
      method: "GET",
      params: { hint: this.convertToString(hint) },
    };
    return this.request<CatalogEntryGETData>(request);
  }

  createCatalogEntrySignupPacket(body: CatalogEntrySignupPacketPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentrysignuppacket",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getCatalogEntrySignupPacketById(id: string): Observable<CatalogEntrySignupPacketGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentrysignuppacket/" + id,
      method: "GET",
    };
    return this.request<CatalogEntrySignupPacketGETData>(request);
  }

  updateCatalogEntrySignupPacketById(id: string, body: CatalogEntrySignupPacketPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentrysignuppacket/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteCatalogEntrySignupPacketById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentrysignuppacket/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findCatalogEntrySignupPackets(body: CatalogEntrySignupPacketCriteria): Observable<CatalogEntrySignupPacketGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogentrysignuppacket/query",
      method: "POST",
      body: body,
    };
    return this.request<CatalogEntrySignupPacketGETDataSearchResults>(request);
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

  createCatalogTypeRef(body: CatalogTypeRefPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogtyperef",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getCatalogTypeRefById(id: string): Observable<CatalogTypeRefGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogtyperef/" + id,
      method: "GET",
    };
    return this.request<CatalogTypeRefGETData>(request);
  }

  updateCatalogTypeRefById(id: string, body: CatalogTypeRefPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogtyperef/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteCatalogTypeRefById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogtyperef/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findCatalogTypeRefs(body: CatalogTypeRefCriteria): Observable<CatalogTypeRefGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/catalogtyperef/query",
      method: "POST",
      body: body,
    };
    return this.request<CatalogTypeRefGETDataSearchResults>(request);
  }

  createFeedEntryInstance(body: FeedEntryInstancePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/feedentryinstance",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getFeedEntryInstanceById(id: string): Observable<FeedEntryInstanceGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/feedentryinstance/" + id,
      method: "GET",
    };
    return this.request<FeedEntryInstanceGETData>(request);
  }

  updateFeedEntryInstanceById(id: string, body: FeedEntryInstancePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/feedentryinstance/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteFeedEntryInstanceById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/feedentryinstance/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findFeedEntryInstances(body: FeedEntryInstanceCriteria): Observable<FeedEntryInstanceGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/feedentryinstance/query",
      method: "POST",
      body: body,
    };
    return this.request<FeedEntryInstanceGETDataSearchResults>(request);
  }

  getFeedEntryInstanceByIdWithHint(id: string, hint: string): Observable<FeedEntryInstanceGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/feedentryinstance/" + id + "/hint",
      method: "GET",
      params: { hint: this.convertToString(hint) },
    };
    return this.request<FeedEntryInstanceGETData>(request);
  }

  createFeedEntry(body: FeedEntryPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/feedentry",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getFeedEntryById(id: string): Observable<FeedEntryGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/feedentry/" + id,
      method: "GET",
    };
    return this.request<FeedEntryGETData>(request);
  }

  updateFeedEntryById(id: string, body: FeedEntryPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/feedentry/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteFeedEntryById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/feedentry/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findFeedEntrys(body: FeedEntryCriteria): Observable<FeedEntryGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/feedentry/query",
      method: "POST",
      body: body,
    };
    return this.request<FeedEntryGETDataSearchResults>(request);
  }

  getFeedEntryByIdWithHint(id: string, hint: string): Observable<FeedEntryGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/catalog/feedentry/" + id + "/hint",
      method: "GET",
      params: { hint: this.convertToString(hint) },
    };
    return this.request<FeedEntryGETData>(request);
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

  createParticipant(body: ParticipantPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/participant",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getParticipantById(id: string): Observable<ParticipantGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/participant/" + id,
      method: "GET",
    };
    return this.request<ParticipantGETData>(request);
  }

  updateParticipantById(id: string, body: ParticipantPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/participant/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteParticipantById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/participant/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findParticipants(body: ParticipantCriteria): Observable<ParticipantGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/participant/query",
      method: "POST",
      body: body,
    };
    return this.request<ParticipantGETDataSearchResults>(request);
  }

  createPersonalStatementResume(body: PersonalStatementResumePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/personalstatementresume",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getPersonalStatementResumeById(id: string): Observable<PersonalStatementResumeGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/personalstatementresume/" + id,
      method: "GET",
    };
    return this.request<PersonalStatementResumeGETData>(request);
  }

  updatePersonalStatementResumeById(id: string, body: PersonalStatementResumePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/personalstatementresume/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deletePersonalStatementResumeById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/personalstatementresume/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findPersonalStatementResumes(body: PersonalStatementResumeCriteria): Observable<PersonalStatementResumeGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/personalstatementresume/query",
      method: "POST",
      body: body,
    };
    return this.request<PersonalStatementResumeGETDataSearchResults>(request);
  }

  createResumeEntry(body: ResumeEntryPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/resumeentry",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getResumeEntryById(id: string): Observable<ResumeEntryGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/resumeentry/" + id,
      method: "GET",
    };
    return this.request<ResumeEntryGETData>(request);
  }

  updateResumeEntryById(id: string, body: ResumeEntryPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/resumeentry/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteResumeEntryById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/resumeentry/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findResumeEntrys(body: ResumeEntryCriteria): Observable<ResumeEntryGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/resumeentry/query",
      method: "POST",
      body: body,
    };
    return this.request<ResumeEntryGETDataSearchResults>(request);
  }

  createResumeUserInfo(body: ResumeUserInfoPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/resumeuserinfo",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getResumeUserInfoById(id: string): Observable<ResumeUserInfoGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/resumeuserinfo/" + id,
      method: "GET",
    };
    return this.request<ResumeUserInfoGETData>(request);
  }

  updateResumeUserInfoById(id: string, body: ResumeUserInfoPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/resumeuserinfo/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteResumeUserInfoById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/resumeuserinfo/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findResumeUserInfos(body: ResumeUserInfoCriteria): Observable<ResumeUserInfoGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/experience/resumeuserinfo/query",
      method: "POST",
      body: body,
    };
    return this.request<ResumeUserInfoGETDataSearchResults>(request);
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

  createPAiPromptRef(body: PAiPromptRefPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/paipromptref",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getPAiPromptRefById(id: string): Observable<PAiPromptRefGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/paipromptref/" + id,
      method: "GET",
    };
    return this.request<PAiPromptRefGETData>(request);
  }

  updatePAiPromptRefById(id: string, body: PAiPromptRefPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/paipromptref/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deletePAiPromptRefById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/paipromptref/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findPAiPromptRefs(body: PAiPromptRefCriteria): Observable<PAiPromptRefGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/paipromptref/query",
      method: "POST",
      body: body,
    };
    return this.request<PAiPromptRefGETDataSearchResults>(request);
  }

  getPAiPromptRefByIdWithHint(id: string, hint: string): Observable<PAiPromptRefGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/paipromptref/" + id + "/hint",
      method: "GET",
      params: { hint: this.convertToString(hint) },
    };
    return this.request<PAiPromptRefGETData>(request);
  }

  createPEntityTagVal(body: PEntityTagValPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pentitytagval",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getPEntityTagValById(id: string): Observable<PEntityTagValGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pentitytagval/" + id,
      method: "GET",
    };
    return this.request<PEntityTagValGETData>(request);
  }

  updatePEntityTagValById(id: string, body: PEntityTagValPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pentitytagval/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deletePEntityTagValById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pentitytagval/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findPEntityTagVals(body: PEntityTagValCriteria): Observable<PEntityTagValGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pentitytagval/query",
      method: "POST",
      body: body,
    };
    return this.request<PEntityTagValGETDataSearchResults>(request);
  }

  getPEntityTagValByIdWithHint(id: string, hint: string): Observable<PEntityTagValGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pentitytagval/" + id + "/hint",
      method: "GET",
      params: { hint: this.convertToString(hint) },
    };
    return this.request<PEntityTagValGETData>(request);
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

  createPMFileGroupEntry(body: PMFileGroupEntryPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmfilegroupentry",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getPMFileGroupEntryById(id: string): Observable<PMFileGroupEntryGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmfilegroupentry/" + id,
      method: "GET",
    };
    return this.request<PMFileGroupEntryGETData>(request);
  }

  updatePMFileGroupEntryById(id: string, body: PMFileGroupEntryPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmfilegroupentry/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deletePMFileGroupEntryById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmfilegroupentry/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findPMFileGroupEntrys(body: PMFileGroupEntryCriteria): Observable<PMFileGroupEntryGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmfilegroupentry/query",
      method: "POST",
      body: body,
    };
    return this.request<PMFileGroupEntryGETDataSearchResults>(request);
  }

  createPMFileGroup(body: PMFileGroupPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmfilegroup",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getPMFileGroupById(id: string): Observable<PMFileGroupGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmfilegroup/" + id,
      method: "GET",
    };
    return this.request<PMFileGroupGETData>(request);
  }

  updatePMFileGroupById(id: string, body: PMFileGroupPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmfilegroup/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deletePMFileGroupById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmfilegroup/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findPMFileGroups(body: PMFileGroupCriteria): Observable<PMFileGroupGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmfilegroup/query",
      method: "POST",
      body: body,
    };
    return this.request<PMFileGroupGETDataSearchResults>(request);
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

  downloadClientDocument(record_id: string, file_name: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/download/" + record_id + "/" + file_name,
      method: "GET",
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

  createPMessageAttachment(body: PMessageAttachmentPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmessageattachment",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getPMessageAttachmentById(id: string): Observable<PMessageAttachmentGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmessageattachment/" + id,
      method: "GET",
    };
    return this.request<PMessageAttachmentGETData>(request);
  }

  updatePMessageAttachmentById(id: string, body: PMessageAttachmentPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmessageattachment/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deletePMessageAttachmentById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmessageattachment/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findPMessageAttachments(body: PMessageAttachmentCriteria): Observable<PMessageAttachmentGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmessageattachment/query",
      method: "POST",
      body: body,
    };
    return this.request<PMessageAttachmentGETDataSearchResults>(request);
  }

  createPMessageEntry(body: PMessageEntryPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmessageentry",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getPMessageEntryById(id: string): Observable<PMessageEntryGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmessageentry/" + id,
      method: "GET",
    };
    return this.request<PMessageEntryGETData>(request);
  }

  updatePMessageEntryById(id: string, body: PMessageEntryPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmessageentry/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deletePMessageEntryById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmessageentry/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findPMessageEntrys(body: PMessageEntryCriteria): Observable<PMessageEntryGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmessageentry/query",
      method: "POST",
      body: body,
    };
    return this.request<PMessageEntryGETDataSearchResults>(request);
  }

  createPMessageParticipant(body: PMessageParticipantPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmessageparticipant",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getPMessageParticipantById(id: string): Observable<PMessageParticipantGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmessageparticipant/" + id,
      method: "GET",
    };
    return this.request<PMessageParticipantGETData>(request);
  }

  updatePMessageParticipantById(id: string, body: PMessageParticipantPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmessageparticipant/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deletePMessageParticipantById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmessageparticipant/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findPMessageParticipants(body: PMessageParticipantCriteria): Observable<PMessageParticipantGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmessageparticipant/query",
      method: "POST",
      body: body,
    };
    return this.request<PMessageParticipantGETDataSearchResults>(request);
  }

  createPMessage(body: PMessagePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmessage",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getPMessageById(id: string): Observable<PMessageGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmessage/" + id,
      method: "GET",
    };
    return this.request<PMessageGETData>(request);
  }

  updatePMessageById(id: string, body: PMessagePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmessage/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deletePMessageById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmessage/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findPMessages(body: PMessageCriteria): Observable<PMessageGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/pattern/pmessage/query",
      method: "POST",
      body: body,
    };
    return this.request<PMessageGETDataSearchResults>(request);
  }

  createPContractActivationCode(body: PContractActivationCodePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractactivationcode",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getPContractActivationCodeById(id: string): Observable<PContractActivationCodeGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractactivationcode/" + id,
      method: "GET",
    };
    return this.request<PContractActivationCodeGETData>(request);
  }

  updatePContractActivationCodeById(id: string, body: PContractActivationCodePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractactivationcode/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deletePContractActivationCodeById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractactivationcode/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findPContractActivationCodes(body: PContractActivationCodeCriteria): Observable<PContractActivationCodeGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractactivationcode/query",
      method: "POST",
      body: body,
    };
    return this.request<PContractActivationCodeGETDataSearchResults>(request);
  }

  getPContractActivationCodeByIdWithHint(id: string, hint: string): Observable<PContractActivationCodeGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractactivationcode/" + id + "/hint",
      method: "GET",
      params: { hint: this.convertToString(hint) },
    };
    return this.request<PContractActivationCodeGETData>(request);
  }

  createPContractParticipant(body: PContractParticipantPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractparticipant",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getPContractParticipantById(id: string): Observable<PContractParticipantGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractparticipant/" + id,
      method: "GET",
    };
    return this.request<PContractParticipantGETData>(request);
  }

  updatePContractParticipantById(id: string, body: PContractParticipantPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractparticipant/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deletePContractParticipantById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractparticipant/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findPContractParticipants(body: PContractParticipantCriteria): Observable<PContractParticipantGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractparticipant/query",
      method: "POST",
      body: body,
    };
    return this.request<PContractParticipantGETDataSearchResults>(request);
  }

  getPContractParticipantByIdWithHint(id: string, hint: string): Observable<PContractParticipantGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractparticipant/" + id + "/hint",
      method: "GET",
      params: { hint: this.convertToString(hint) },
    };
    return this.request<PContractParticipantGETData>(request);
  }

  createPContract(body: PContractPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontract",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getPContractById(id: string): Observable<PContractGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontract/" + id,
      method: "GET",
    };
    return this.request<PContractGETData>(request);
  }

  updatePContractById(id: string, body: PContractPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontract/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deletePContractById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontract/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findPContracts(body: PContractCriteria): Observable<PContractGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontract/query",
      method: "POST",
      body: body,
    };
    return this.request<PContractGETDataSearchResults>(request);
  }

  getPContractByIdWithHint(id: string, hint: string): Observable<PContractGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontract/" + id + "/hint",
      method: "GET",
      params: { hint: this.convertToString(hint) },
    };
    return this.request<PContractGETData>(request);
  }

  createPContractVersionInstance(body: PContractVersionInstancePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractversioninstance",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getPContractVersionInstanceById(id: string): Observable<PContractVersionInstanceGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractversioninstance/" + id,
      method: "GET",
    };
    return this.request<PContractVersionInstanceGETData>(request);
  }

  updatePContractVersionInstanceById(id: string, body: PContractVersionInstancePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractversioninstance/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deletePContractVersionInstanceById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractversioninstance/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findPContractVersionInstances(body: PContractVersionInstanceCriteria): Observable<PContractVersionInstanceGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractversioninstance/query",
      method: "POST",
      body: body,
    };
    return this.request<PContractVersionInstanceGETDataSearchResults>(request);
  }

  getPContractVersionInstanceByIdWithHint(id: string, hint: string): Observable<PContractVersionInstanceGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractversioninstance/" + id + "/hint",
      method: "GET",
      params: { hint: this.convertToString(hint) },
    };
    return this.request<PContractVersionInstanceGETData>(request);
  }

  createPContractVersion(body: PContractVersionPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractversion",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getPContractVersionById(id: string): Observable<PContractVersionGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractversion/" + id,
      method: "GET",
    };
    return this.request<PContractVersionGETData>(request);
  }

  updatePContractVersionById(id: string, body: PContractVersionPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractversion/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deletePContractVersionById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractversion/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findPContractVersions(body: PContractVersionCriteria): Observable<PContractVersionGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractversion/query",
      method: "POST",
      body: body,
    };
    return this.request<PContractVersionGETDataSearchResults>(request);
  }

  getPContractVersionByIdWithHint(id: string, hint: string): Observable<PContractVersionGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pcontract/pcontractversion/" + id + "/hint",
      method: "GET",
      params: { hint: this.convertToString(hint) },
    };
    return this.request<PContractVersionGETData>(request);
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

  createSwWorkProduct(body: SwWorkProductPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/swcat/swworkproduct",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getSwWorkProductById(id: string): Observable<SwWorkProductGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/swcat/swworkproduct/" + id,
      method: "GET",
    };
    return this.request<SwWorkProductGETData>(request);
  }

  updateSwWorkProductById(id: string, body: SwWorkProductPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/swcat/swworkproduct/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteSwWorkProductById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/swcat/swworkproduct/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findSwWorkProducts(body: SwWorkProductCriteria): Observable<SwWorkProductGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/swcat/swworkproduct/query",
      method: "POST",
      body: body,
    };
    return this.request<SwWorkProductGETDataSearchResults>(request);
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

  createFamilyUnitMember(body: FamilyUnitMemberPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/familyunitmember",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getFamilyUnitMemberById(id: string): Observable<FamilyUnitMemberGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/familyunitmember/" + id,
      method: "GET",
    };
    return this.request<FamilyUnitMemberGETData>(request);
  }

  updateFamilyUnitMemberById(id: string, body: FamilyUnitMemberPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/familyunitmember/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteFamilyUnitMemberById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/familyunitmember/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findFamilyUnitMembers(body: FamilyUnitMemberCriteria): Observable<FamilyUnitMemberGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/familyunitmember/query",
      method: "POST",
      body: body,
    };
    return this.request<FamilyUnitMemberGETDataSearchResults>(request);
  }

  createFamilyUnit(body: FamilyUnitPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/familyunit",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getFamilyUnitById(id: string): Observable<FamilyUnitGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/familyunit/" + id,
      method: "GET",
    };
    return this.request<FamilyUnitGETData>(request);
  }

  updateFamilyUnitById(id: string, body: FamilyUnitPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/familyunit/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteFamilyUnitById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/familyunit/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findFamilyUnits(body: FamilyUnitCriteria): Observable<FamilyUnitGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/familyunit/query",
      method: "POST",
      body: body,
    };
    return this.request<FamilyUnitGETDataSearchResults>(request);
  }

  createHcclAddr(body: HcclAddrPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccladdr",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getHcclAddrById(id: string): Observable<HcclAddrGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccladdr/" + id,
      method: "GET",
    };
    return this.request<HcclAddrGETData>(request);
  }

  updateHcclAddrById(id: string, body: HcclAddrPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccladdr/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteHcclAddrById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccladdr/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findHcclAddrs(body: HcclAddrCriteria): Observable<HcclAddrGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccladdr/query",
      method: "POST",
      body: body,
    };
    return this.request<HcclAddrGETDataSearchResults>(request);
  }

  getHcclAddrByIdWithHint(id: string, hint: string): Observable<HcclAddrGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccladdr/" + id + "/hint",
      method: "GET",
      params: { hint: this.convertToString(hint) },
    };
    return this.request<HcclAddrGETData>(request);
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

  createHcclPerson(body: HcclPersonPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclperson",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getHcclPersonById(id: string): Observable<HcclPersonGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclperson/" + id,
      method: "GET",
    };
    return this.request<HcclPersonGETData>(request);
  }

  updateHcclPersonById(id: string, body: HcclPersonPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclperson/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteHcclPersonById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclperson/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findHcclPersons(body: HcclPersonCriteria): Observable<HcclPersonGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hcclperson/query",
      method: "POST",
      body: body,
    };
    return this.request<HcclPersonGETDataSearchResults>(request);
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

  createHcclUserInvite(body: HcclUserInvitePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluserinvite",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getHcclUserInviteById(id: string): Observable<HcclUserInviteGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluserinvite/" + id,
      method: "GET",
    };
    return this.request<HcclUserInviteGETData>(request);
  }

  updateHcclUserInviteById(id: string, body: HcclUserInvitePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluserinvite/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteHcclUserInviteById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluserinvite/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findHcclUserInvites(body: HcclUserInviteCriteria): Observable<HcclUserInviteGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluserinvite/query",
      method: "POST",
      body: body,
    };
    return this.request<HcclUserInviteGETDataSearchResults>(request);
  }

  getHcclUserInviteByIdWithHint(id: string, hint: string): Observable<HcclUserInviteGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/teams/hccluserinvite/" + id + "/hint",
      method: "GET",
      params: { hint: this.convertToString(hint) },
    };
    return this.request<HcclUserInviteGETData>(request);
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

  createWorkRequestDeliverableSection(body: WorkRequestDeliverableSectionPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestdeliverablesection",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getWorkRequestDeliverableSectionById(id: string): Observable<WorkRequestDeliverableSectionGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestdeliverablesection/" + id,
      method: "GET",
    };
    return this.request<WorkRequestDeliverableSectionGETData>(request);
  }

  updateWorkRequestDeliverableSectionById(id: string, body: WorkRequestDeliverableSectionPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestdeliverablesection/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteWorkRequestDeliverableSectionById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestdeliverablesection/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findWorkRequestDeliverableSections(body: WorkRequestDeliverableSectionCriteria): Observable<WorkRequestDeliverableSectionGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestdeliverablesection/query",
      method: "POST",
      body: body,
    };
    return this.request<WorkRequestDeliverableSectionGETDataSearchResults>(request);
  }

  createWorkRequestDeliverable(body: WorkRequestDeliverablePOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestdeliverable",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getWorkRequestDeliverableById(id: string): Observable<WorkRequestDeliverableGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestdeliverable/" + id,
      method: "GET",
    };
    return this.request<WorkRequestDeliverableGETData>(request);
  }

  updateWorkRequestDeliverableById(id: string, body: WorkRequestDeliverablePUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestdeliverable/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteWorkRequestDeliverableById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestdeliverable/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findWorkRequestDeliverables(body: WorkRequestDeliverableCriteria): Observable<WorkRequestDeliverableGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestdeliverable/query",
      method: "POST",
      body: body,
    };
    return this.request<WorkRequestDeliverableGETDataSearchResults>(request);
  }

  getWorkRequestDeliverableByIdWithHint(id: string, hint: string): Observable<WorkRequestDeliverableGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequestdeliverable/" + id + "/hint",
      method: "GET",
      params: { hint: this.convertToString(hint) },
    };
    return this.request<WorkRequestDeliverableGETData>(request);
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

  getWorkRequestByIdWithHint(id: string, hint: string): Observable<WorkRequestGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tix/workrequest/" + id + "/hint",
      method: "GET",
      params: { hint: this.convertToString(hint) },
    };
    return this.request<WorkRequestGETData>(request);
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

  createUtilmonLoginYearmo(body: UtilmonLoginYearmoPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/utilmon/utilmonloginyearmo",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getUtilmonLoginYearmoById(id: string): Observable<UtilmonLoginYearmoGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/utilmon/utilmonloginyearmo/" + id,
      method: "GET",
    };
    return this.request<UtilmonLoginYearmoGETData>(request);
  }

  updateUtilmonLoginYearmoById(id: string, body: UtilmonLoginYearmoPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/utilmon/utilmonloginyearmo/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteUtilmonLoginYearmoById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/utilmon/utilmonloginyearmo/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findUtilmonLoginYearmos(body: UtilmonLoginYearmoCriteria): Observable<UtilmonLoginYearmoGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/utilmon/utilmonloginyearmo/query",
      method: "POST",
      body: body,
    };
    return this.request<UtilmonLoginYearmoGETDataSearchResults>(request);
  }

  createUtilmonReportingEvent(body: UtilmonReportingEventPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/utilmon/utilmonreportingevent",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getUtilmonReportingEventById(id: string): Observable<UtilmonReportingEventGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/utilmon/utilmonreportingevent/" + id,
      method: "GET",
    };
    return this.request<UtilmonReportingEventGETData>(request);
  }

  updateUtilmonReportingEventById(id: string, body: UtilmonReportingEventPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/utilmon/utilmonreportingevent/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteUtilmonReportingEventById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/utilmon/utilmonreportingevent/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findUtilmonReportingEvents(body: UtilmonReportingEventCriteria): Observable<UtilmonReportingEventGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/utilmon/utilmonreportingevent/query",
      method: "POST",
      body: body,
    };
    return this.request<UtilmonReportingEventGETDataSearchResults>(request);
  }

  createUtilmonStat(body: UtilmonStatPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/utilmon/utilmonstat",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getUtilmonStatById(id: string): Observable<UtilmonStatGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/utilmon/utilmonstat/" + id,
      method: "GET",
    };
    return this.request<UtilmonStatGETData>(request);
  }

  updateUtilmonStatById(id: string, body: UtilmonStatPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/utilmon/utilmonstat/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deleteUtilmonStatById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/utilmon/utilmonstat/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findUtilmonStats(body: UtilmonStatCriteria): Observable<UtilmonStatGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/utilmon/utilmonstat/query",
      method: "POST",
      body: body,
    };
    return this.request<UtilmonStatGETDataSearchResults>(request);
  }

  createPersonalStatementActivityLog(body: PersonalStatementActivityLogPOSTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/personalstatementactivitylog",
      method: "POST",
      body: body,
    };
    return this.requestCreate<any>(request);
  }

  getPersonalStatementActivityLogById(id: string): Observable<PersonalStatementActivityLogGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/personalstatementactivitylog/" + id,
      method: "GET",
    };
    return this.request<PersonalStatementActivityLogGETData>(request);
  }

  updatePersonalStatementActivityLogById(id: string, body: PersonalStatementActivityLogPUTData): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/personalstatementactivitylog/" + id,
      method: "PUT",
      body: body,
    };
    return this.request<any>(request);
  }

  deletePersonalStatementActivityLogById(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/personalstatementactivitylog/" + id,
      method: "DELETE",
    };
    return this.request<any>(request);
  }

  findPersonalStatementActivityLogs(body: PersonalStatementActivityLogCriteria): Observable<PersonalStatementActivityLogGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/vocode/personalstatementactivitylog/query",
      method: "POST",
      body: body,
    };
    return this.request<PersonalStatementActivityLogGETDataSearchResults>(request);
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

  downloadClientDocumentGet(record_id: string, file_name: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/public/download/" + record_id + "/" + file_name,
      method: "GET",
    };
    return this.request<any>(request);
  }

  downloadClientDocumentPublic(realm: string, record_id: string, salt: string, security_digest: string, file_name: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/public/dsig/" + realm + "/" + record_id + "/" + salt + "/" + security_digest + "/" + file_name,
      method: "GET",
    };
    return this.request<any>(request);
  }

  getCreateTicketSetupUi(body: CreateTicketPOSTData): Observable<CreateTicketSetupUIData> {
    const request: CommonServiceRequest = {
      url: "/hccl/public/tixui/create-ticket-setup-ui",
      method: "POST",
      body: body,
    };
    return this.request<CreateTicketSetupUIData>(request);
  }

  handleBounce(X_Postmark_Signature: string, body: string): Observable<PostmarkWebhookResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/public/email/bounce",
      method: "POST",
      body: body,
    };
    return this.request<PostmarkWebhookResponse>(request);
  }

  handleDelivery(X_Postmark_Signature: string, body: string): Observable<PostmarkWebhookResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/public/email/delivery",
      method: "POST",
      body: body,
    };
    return this.request<PostmarkWebhookResponse>(request);
  }

  handleGenericWebhook(X_Postmark_Signature: string, body: string): Observable<PostmarkWebhookResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/public/email/webhook",
      method: "POST",
      body: body,
    };
    return this.request<PostmarkWebhookResponse>(request);
  }

  handleInboundEmail(X_Postmark_Signature: string, body: string): Observable<PostmarkWebhookResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/public/email/inbound",
      method: "POST",
      body: body,
    };
    return this.request<PostmarkWebhookResponse>(request);
  }

  handleSpamComplaint(X_Postmark_Signature: string, body: string): Observable<PostmarkWebhookResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/public/email/spam-complaint",
      method: "POST",
      body: body,
    };
    return this.request<PostmarkWebhookResponse>(request);
  }

  onboardFamily(body: OnboardFamilyPOSTData): Observable<OnboardResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/public/onboard/family",
      method: "POST",
      body: body,
    };
    return this.request<OnboardResponse>(request);
  }

  onboardInvited(body: OnboardInvitedRequest): Observable<OnboardInvitedResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/public/onboard/invite",
      method: "POST",
      body: body,
    };
    return this.request<OnboardInvitedResponse>(request);
  }

  onboardStudent(body: OnboardStudentPOSTData): Observable<OnboardResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/public/onboard/student",
      method: "POST",
      body: body,
    };
    return this.request<OnboardResponse>(request);
  }

  resolveOnboardInvitedUIData(invitedId: string): Observable<OnboardInvitedUIData> {
    const request: CommonServiceRequest = {
      url: "/hccl/public/onboard/invite/setup",
      method: "GET",
      params: { invitedId: this.convertToString(invitedId) },
    };
    return this.request<OnboardInvitedUIData>(request);
  }

  resolvePublicSignupUIData(interest_id: string): Observable<OnboardStudentUIData> {
    const request: CommonServiceRequest = {
      url: "/hccl/public/onboard/student/setup",
      method: "GET",
    };
    return this.request<OnboardStudentUIData>(request);
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

  lookupAddress(body: string): Observable<OnboardAddressResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/onboard/onboard/lookup-address",
      method: "POST",
      body: body,
    };
    return this.request<OnboardAddressResponse>(request);
  }

  onboardCatalogEntry(body: OnboardCatalogEntryPOSTData): Observable<OnboardCatalogEntryResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/onboard/onboard/catalogentry",
      method: "POST",
      body: body,
    };
    return this.request<OnboardCatalogEntryResponse>(request);
  }

  onboardCatalogEntrySetup(body: OnboardCatalogEntryPOJO): Observable<OnboardCatalogEntryUIHelper> {
    const request: CommonServiceRequest = {
      url: "/hccl/onboard/onboard/catalogentry-setup",
      method: "POST",
      body: body,
    };
    return this.request<OnboardCatalogEntryUIHelper>(request);
  }

  onboardOrg(body: OnboardOrganizationPOSTData): Observable<OnboardOrganizationResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/onboard/onboard/organization",
      method: "POST",
      body: body,
    };
    return this.request<OnboardOrganizationResponse>(request);
  }

  onboardOrgSetup(body: OnboardOrganizationPOJO): Observable<OnboardOrganizationUIHelper> {
    const request: CommonServiceRequest = {
      url: "/hccl/onboard/onboard/organzation-setup",
      method: "POST",
      body: body,
    };
    return this.request<OnboardOrganizationUIHelper>(request);
  }

  onboardStudentPost(body: OnboardStudentPOSTData): Observable<OnboardResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/onboard/onboard/invite",
      method: "POST",
      body: body,
    };
    return this.request<OnboardResponse>(request);
  }

  lookupEntityMapEntry(entity_type: string, entity_id: string, addr_type_code: string): Observable<SimpleMapEntryResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/pmap/entity/" + entity_type + "/" + entity_id + "/" + addr_type_code,
      method: "GET",
    };
    return this.request<SimpleMapEntryResponse>(request);
  }

  lookupRelatedMapEntry(entity_type: string, entity_id: string, addr_type_code: string): Observable<SimpleMapEntryResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/pmap/related/" + entity_type + "/" + entity_id + "/" + addr_type_code,
      method: "GET",
    };
    return this.request<SimpleMapEntryResponse>(request);
  }

  getMessageEntryAttachments(entryId: string): Observable<PMessageAttachmentGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/pmessage/entries/" + entryId + "/attachments",
      method: "GET",
    };
    return this.request<PMessageAttachmentGETDataSearchResults>(request);
  }

  addAttachmentToEntry(entryId: string, body: PMessageAttachmentPOSTData): Observable<PMessageAttachmentGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pmessage/entries/" + entryId + "/attachments",
      method: "POST",
      body: body,
    };
    return this.request<PMessageAttachmentGETData>(request);
  }

  addEntry(messageId: string, body: PMessageEntryPOSTData): Observable<PMessageEntryGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pmessage/messages/" + messageId + "/entries",
      method: "POST",
      body: body,
    };
    return this.request<PMessageEntryGETData>(request);
  }

  addMentionToEntry(entryId: string, mentionedUserId: string, mentionText: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/pmessage/entries/" + entryId + "/mention",
      method: "PUT",
      params: { mentionedUserId: this.convertToString(mentionedUserId), mentionText: this.convertToString(mentionText) },
    };
    return this.request<any>(request);
  }

  createChannel(body: PMessagePOSTData): Observable<PMessageGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pmessage/channels",
      method: "POST",
      body: body,
    };
    return this.requestCreate<PMessageGETData>(request);
  }

  createNewMessage(body: PMessagePOSTData): Observable<PMessageGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pmessage/messages",
      method: "POST",
      body: body,
    };
    return this.requestCreate<PMessageGETData>(request);
  }

  editMessageEntry(entryId: string, body: PMessageEntryPUTData): Observable<PMessageEntryGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pmessage/entries/" + entryId,
      method: "PUT",
      body: body,
    };
    return this.request<PMessageEntryGETData>(request);
  }

  findMessagesWithUnreadEntries(userId: string): Observable<PMessageEntryGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/pmessage/users/" + userId + "/unread-entries",
      method: "GET",
    };
    return this.request<PMessageEntryGETDataSearchResults>(request);
  }

  getMessagesByUser(userId: string, limit: number): Observable<PMessageEntryGETDataSearchResults> {
    const request: CommonServiceRequest = {
      url: "/hccl/pmessage/users/" + userId + "/messages",
      method: "GET",
      params: { limit: this.convertToString(limit) },
    };
    return this.request<PMessageEntryGETDataSearchResults>(request);
  }

  updateMessage(messageId: string, body: PMessagePUTData): Observable<PMessageGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/pmessage/messages/" + messageId,
      method: "PUT",
      body: body,
    };
    return this.request<PMessageGETData>(request);
  }

  askToJoinFamily(body: CreateActivationCodeRequest): Observable<CreateActivationCodeResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/parents/invite-to-family",
      method: "POST",
      body: body,
    };
    return this.request<CreateActivationCodeResponse>(request);
  }

  resolveParentDashSignupUIData(interest_id: string): Observable<SignupUIData> {
    const request: CommonServiceRequest = {
      url: "/hccl/parents/dash-ui/resolve-signup-ui-data/" + interest_id,
      method: "GET",
    };
    return this.request<SignupUIData>(request);
  }

  resolveParentSignupVerdictUIData(interest_id: string): Observable<SignupVerdictUIData> {
    const request: CommonServiceRequest = {
      url: "/hccl/parents/dash-ui/resolve-signup-verdict-ui-data/" + interest_id,
      method: "GET",
    };
    return this.request<SignupVerdictUIData>(request);
  }

  resolveParentUIData(): Observable<FamilyParentDashUIGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/parents/dash-ui",
      method: "GET",
    };
    return this.request<FamilyParentDashUIGETData>(request);
  }

  resolvePersonalStatementUIData(id: string): Observable<PersonalStatementUIGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/parents/dash-ui/resolve-personal-statmentui/" + id,
      method: "GET",
    };
    return this.request<PersonalStatementUIGETData>(request);
  }

  getSignupPacketsSetupData(): Observable<ManageSignupPacketUIData> {
    const request: CommonServiceRequest = {
      url: "/hccl/providers/setup/signup-packets-setup-data",
      method: "GET",
    };
    return this.request<ManageSignupPacketUIData>(request);
  }

  resolveProviderTicketUIData(): Observable<WorkRequestDashboardUIGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/providers/dash-ui/tickets",
      method: "GET",
    };
    return this.request<WorkRequestDashboardUIGETData>(request);
  }

  addResumeEntries(id: string, body: ResumeAddEntriesPOSTData): Observable<PersonalStatementResumeGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/resume/" + id + "/add-entries",
      method: "POST",
      body: body,
    };
    return this.request<PersonalStatementResumeGETData>(request);
  }

  getAvailableEntries(id: string): Observable<ResumeEntryGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/resume/" + id + "/entries/available",
      method: "GET",
    };
    return this.request<ResumeEntryGETData>(request);
  }

  getFinalMarkdown(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/resume/" + id + "/markdown/final",
      method: "GET",
    };
    return this.request<any>(request);
  }

  getFinalMarkdownHtml(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/resume/" + id + "/markdown/final-html",
      method: "GET",
    };
    return this.request<any>(request);
  }

  getMarkdown(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/resume/" + id + "/markdown",
      method: "GET",
    };
    return this.request<any>(request);
  }

  getResume(id: string): Observable<PersonalStatementResumeGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/resume/" + id,
      method: "GET",
    };
    return this.request<PersonalStatementResumeGETData>(request);
  }

  reorderEntries(id: string, body: ResumeReorderEntriesPOSTData): Observable<PersonalStatementResumeGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/resume/" + id + "/reorder-entries",
      method: "POST",
      body: body,
    };
    return this.request<PersonalStatementResumeGETData>(request);
  }

  updateEntry(id: string, body: ResumeUpdateEntryPOSTData): Observable<PersonalStatementResumeGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/resume/" + id + "/update-entry",
      method: "POST",
      body: body,
    };
    return this.request<PersonalStatementResumeGETData>(request);
  }

  updateResume(id: string, body: ResumePOJO): Observable<PersonalStatementResumeGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/resume/" + id + "/update",
      method: "POST",
      body: body,
    };
    return this.request<PersonalStatementResumeGETData>(request);
  }

  joinFamily(code: string): Observable<HandleActivationCodeResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/students/join-family",
      method: "GET",
      params: { code: this.convertToString(code) },
    };
    return this.request<HandleActivationCodeResponse>(request);
  }

  loadCurrentFeed(refreshFeed: boolean): Observable<UserFeedGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/students/current-feed",
      method: "GET",
      params: { refreshFeed: this.convertToString(refreshFeed) },
    };
    return this.request<UserFeedGETData>(request);
  }

  resolveGuidanceUIData(): Observable<WorkRequestDashboardUIGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/students/dash-ui/resolve-guidance-data",
      method: "GET",
    };
    return this.request<WorkRequestDashboardUIGETData>(request);
  }

  resolvePersonalStatementUIDataGet(id: string): Observable<PersonalStatementUIGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/students/dash-ui/resolve-personal-statmentui/" + id,
      method: "GET",
    };
    return this.request<PersonalStatementUIGETData>(request);
  }

  resolveStudentDashData(student_userprofile_id: string): Observable<StudentDashUIGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/students/resolve-student-data/" + student_userprofile_id,
      method: "GET",
    };
    return this.request<StudentDashUIGETData>(request);
  }

  resolveStudentProfileData(student_userprofile_id: string): Observable<StudentProfileUIGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/students/resolve-student-profiled/" + student_userprofile_id,
      method: "GET",
    };
    return this.request<StudentProfileUIGETData>(request);
  }

  resolveStudentSignupUIData(interest_id: string): Observable<SignupUIData> {
    const request: CommonServiceRequest = {
      url: "/hccl/students/dash-ui/resolve-signup-ui-data/" + interest_id,
      method: "GET",
    };
    return this.request<SignupUIData>(request);
  }

  resolveStudentSignupVerdictUIData(interest_id: string): Observable<SignupVerdictUIData> {
    const request: CommonServiceRequest = {
      url: "/hccl/students/dash-ui/resolve-signup-verdict-ui-data/" + interest_id,
      method: "GET",
    };
    return this.request<SignupVerdictUIData>(request);
  }

  createTrutestaUsageGraph(body: UtilmonStatGraphCriteria): Observable<UtilmonStatGraphPOJO> {
    const request: CommonServiceRequest = {
      url: "/hccl/swcat/ttusage",
      method: "POST",
      body: body,
    };
    return this.requestCreate<UtilmonStatGraphPOJO>(request);
  }

  getDefaultUsageGraph(): Observable<UtilmonStatGraphPOJO> {
    const request: CommonServiceRequest = {
      url: "/hccl/swcat/ttusage0",
      method: "GET",
    };
    return this.request<UtilmonStatGraphPOJO>(request);
  }

  acceptTicket(tix_id: string, body: RoutingActionPOSTData): Observable<WorkRequestGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tixui/" + tix_id + "/accept",
      method: "POST",
      body: body,
    };
    return this.request<WorkRequestGETData>(request);
  }

  callCreateSignupRequest(body: SignupBehaviorPOSTData): Observable<WorkRequestGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tixui/create-signup-request",
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

  callVerdictSignupRequest(body: SignupVerdictPOSTData): Observable<WorkItemFormResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/tixui/verdict-signup-request",
      method: "POST",
      body: body,
    };
    return this.request<WorkItemFormResponse>(request);
  }

  callWorkRequestUi(tix_id: string, action_code: string, body: WorkItemFormRequest): Observable<WorkItemFormResponse> {
    const request: CommonServiceRequest = {
      url: "/hccl/tixui/" + tix_id + "/workrequestitemui/" + action_code,
      method: "POST",
      body: body,
    };
    return this.request<WorkItemFormResponse>(request);
  }

  getCreateTicketSetupUiPost(body: CreateTicketPOSTData): Observable<CreateTicketSetupUIData> {
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

  getWorkRequestUIController(tix_id: string): Observable<WorkRequestUIControllerGETData> {
    const request: CommonServiceRequest = {
      url: "/hccl/tixui/" + tix_id + "/uicontroller",
      method: "GET",
    };
    return this.request<WorkRequestUIControllerGETData>(request);
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

  entityActionCheck(body: SLEntityActionUiDefnRequest): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/servicelib/entityaction/check",
      method: "POST",
      body: body,
    };
    return this.request<any>(request);
  }

  entityActionDoc(body: SLEntityActionUiDefnRequest): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/servicelib/entityaction/doc",
      method: "POST",
      body: body,
    };
    return this.request<any>(request);
  }

  entityActionRun(body: SLEntityActionUiDefnRequest): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/servicelib/entityaction/run",
      method: "POST",
      body: body,
    };
    return this.request<any>(request);
  }

  entityActionUi(body: SLEntityActionUiDefnRequest): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/servicelib/entityaction/ui",
      method: "POST",
      body: body,
    };
    return this.request<any>(request);
  }

  fetchBubbleContents(entity_type: string, id: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/servicelib/bubble/" + entity_type + "/" + id,
      method: "GET",
    };
    return this.request<any>(request);
  }

  fetchMenu(entity_type: string, id: string, menu_code: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/servicelib/menu/" + entity_type + "/" + id + "/" + menu_code,
      method: "GET",
    };
    return this.request<any>(request);
  }

  getFeatures(): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/servicelib/features",
      method: "GET",
    };
    return this.request<any>(request);
  }

  loadMergePayload(body: MergePayloadRequest): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/servicelib/payload",
      method: "POST",
      body: body,
    };
    return this.request<any>(request);
  }

  loadMergePayloadGet(entity_type: string, id: string, datasets: string): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/servicelib/payload/" + entity_type + "/" + id,
      method: "GET",
      params: { datasets: this.convertToString(datasets) },
    };
    return this.request<any>(request);
  }

  loadServiceMetadata(): Observable<any> {
    const request: CommonServiceRequest = {
      url: "/hccl/servicelib/metadata",
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

export interface CatalogEntryFeedInstancePOSTData {
  catalogId: string;
  catalogEntryId: string;
  catalogEntryFeedContentId?: string;
  userProfileId: string;
  catalogEntryInterestId?: string;
  viewCount: number;
  viewTimeMs: number;
  dateExpires?: string;
  score: number;
  personalStatementId?: string;
  distanceInMiles: number;
  distanceInVocode: number;
  feedTypeCode?: string;
}

export interface BaseCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
}

export interface CatalogEntryFeedInstanceGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  catalogId?: string;
  catalogEntryId?: string;
  catalogEntryFeedContentId?: string;
  userProfileId?: string;
  catalogEntryInterestId?: string;
  viewCount?: number;
  viewTimeMs?: number;
  score?: number;
  personalStatementId?: string;
  distanceInMiles?: number;
  distanceInVocode?: number;
  feedTypeCode?: string;
}

export interface CatalogEntryFeedInstanceGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CatalogEntryFeedInstanceGETData[];
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

export interface CatalogEntryFeedInstanceCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  catalogId?: string;
  catalogEntryId?: string;
  catalogEntryFeedContentId?: string;
  userProfileId?: string;
  catalogEntryInterestId?: string;
  viewCount?: number;
  viewTimeMs?: number;
  score?: number;
  personalStatementId?: string;
  distanceInMiles?: number;
  distanceInVocode?: number;
  feedTypeCode?: string;
}

export interface CriteriaPredicateHint {
  matchingCase?: boolean;
  matchingLike?: boolean;
  matchingAddWildcard?: boolean;
}

export interface CatalogEntryFeedInstancePUTData {
  catalogId: string;
  catalogEntryId: string;
  catalogEntryFeedContentId?: string;
  userProfileId: string;
  catalogEntryInterestId?: string;
  viewCount: number;
  viewTimeMs: number;
  dateExpires?: string;
  score: number;
  personalStatementId?: string;
  distanceInMiles: number;
  distanceInVocode: number;
  feedTypeCode?: string;
}

export interface CatalogEntryFeedProfilePOSTData {
  userProfileId: string;
  minScore: number;
  maxDistanceInMiles: number;
  distanceInVocode: number;
  feedProfileDataJson?: string;
  getFeedProfileData?: FeedInputsPOJO;
}

export interface FeedInputsPOJO {
  ageMax?: number;
  randomInfluence?: number;
  vocationalPrimaryCodes?: string[];
  showingNonCatalog?: boolean;
  locationInfluence?: number;
  usingLocation?: boolean;
  usingPersonalStatements?: boolean;
}

export interface CatalogEntryFeedProfileGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  userProfileId?: string;
  minScore?: number;
  maxDistanceInMiles?: number;
  distanceInVocode?: number;
  feedProfileDataJson?: string;
  feedInputs?: FeedInputsPOJO;
  sbVocations?: MenuControlDataList;
  sbRandomInfluence?: MenuControlDataList;
  sbLocationInfluence?: MenuControlDataList;
}

export interface CatalogEntryFeedProfileGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CatalogEntryFeedProfileGETData[];
  filter?: BaseCriteria;
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

export interface CatalogEntryFeedProfileCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  userProfileId?: string;
  minScore?: number;
  maxDistanceInMiles?: number;
  distanceInVocode?: number;
}

export interface CatalogEntryFeedProfilePUTData {
  userProfileId: string;
  minScore: number;
  maxDistanceInMiles: number;
  distanceInVocode: number;
  feedProfileDataJson?: string;
  getFeedProfileData?: FeedInputsPOJO;
}

export interface CatalogEntryGroupRefPOSTData {
  businessCode: string;
  nameText: string;
  description: string;
  available: number;
}

export interface CatalogEntryGroupRefGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  businessCode?: string;
  nameText?: string;
  description?: string;
  available?: number;
}

export interface CatalogEntryGroupRefGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CatalogEntryGroupRefGETData[];
  filter?: BaseCriteria;
}

export interface CatalogEntryGroupRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  businessCode?: string;
  nameText?: string;
  available?: number;
}

export interface CatalogEntryGroupRefPUTData {
  businessCode: string;
  nameText: string;
  description: string;
  available: number;
}

export interface CatalogEntryInterestPOSTData {
  catalogId: string;
  catalogEntryId: string;
  personalStatementId: string;
  userProfileId: string;
  interest: number;
  notes?: string;
  messageId?: string;
  participantId?: string;
  currentStateCode: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
  resumeId?: string;
  signupPostDataJson?: string;
}

export interface CatalogEntryGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  catalogId?: string;
  signupPacketId?: string;
  entryCode?: string;
  title?: string;
  catalogTypeCode?: string;
  catalogTypeId?: string;
  entryGroupCode?: string;
  shortDescription?: string;
  description?: string;
  businessNeed?: string;
  businessSponsor?: string;
  entryPrice?: number;
  entryCost?: number;
  tarotPrompt?: string;
  notes?: string;
  entryStatusCode?: string;
  online?: number;
  available?: number;
  url?: string;
  tarotFileId?: string;
  tarotFileUrl?: string;
  vocodeInstanceId?: string;
  integrationEntityId?: string;
  integrationEntityType?: string;
  integrationEntityName?: string;
  version?: number;
  updateNotes?: string;
  updatedByUserProfileId?: string;
  referenceId?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  hcclAddrId?: string;
  ageRequired?: number;
  mdContents?: string;
  mdQualifications?: string;
  mdSignupInfo?: string;
  catalogCode?: string;
  distance?: number;
  distanceFromCode?: string;
  catalogEntryInterest?: CatalogEntryInterestGETData;
  catalog?: CatalogGETData;
  signupBehaviorMenu?: MenuControlDataList;
  signupPacketMenu?: MenuControlDataList;
  feedEntry?: FeedEntryGETData;
}

export interface CatalogEntryInterestGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  catalogId?: string;
  catalogEntryId?: string;
  personalStatementId?: string;
  userProfileId?: string;
  interest?: number;
  notes?: string;
  messageId?: string;
  participantId?: string;
  currentStateCode?: string;
  currentStateTransitionId?: string;
  resumeId?: string;
  signupPostDataJson?: string;
  catalogEntry?: CatalogEntryGETData;
  currentState?: EntityStateGETData;
  currentStateTransition?: EntityStateTransitionGETData;
  signupBehaviorPOSTData?: SignupBehaviorPOSTData;
}

export interface CatalogEntryInterestGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CatalogEntryInterestGETData[];
  filter?: BaseCriteria;
}

export interface CatalogGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  organizationId?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  taxonomyEntryId?: string;
  catalogTypeId?: string;
  urlPrefix?: string;
  url?: string;
  signupPacketId?: string;
  stats?: CatalogStatsPOJO;
  organization?: HcclOrganizationGETData;
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

export interface EntityStateGETData {
  id?: string;
  fgColor?: string;
  bgColor?: string;
  stateCode?: string;
  stateMsgCode?: string;
  stateName?: string;
  majorStatus?: number;
  openStatus?: boolean;
  closedStatus?: boolean;
  cancelledStatus?: boolean;
  categories?: string[];
}

export interface EntityStateTransitionGETData {
  stateFrom?: EntityStateGETData;
  stateTo?: EntityStateGETData;
  stateTransitionId?: string;
  logMessage?: string;
  dateEntered?: DateGETData;
  messages?: SimpleMessageList;
  closeParentIfPossible?: boolean;
  stateTransitionValid?: boolean;
  stateMachineName?: string;
}

export interface FeedEntryGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  feedTypeCode?: string;
  feedSubTypeCode?: string;
  title?: string;
  mdContents?: string;
  mdMore?: string;
  imageFileId?: string;
  imageFileUrl?: string;
  version?: number;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  hcclAddrId?: string;
  postedByEntityId?: string;
  postedByEntityType?: string;
  postedByEntityName?: string;
  postedByEntityExtra?: string;
}

export interface HcclAddrGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  parentEntityId?: string;
  parentEntityType?: string;
  parentEntityName?: string;
  organizationId?: string;
  formattedAddressJson?: string;
  addressTypeCode?: string;
  addrLine1?: string;
  addrLine2?: string;
  addrLine3?: string;
  addrLine4?: string;
  city?: string;
  stateCode?: string;
  countryCode?: string;
  zip?: string;
  zipPlus4?: string;
  geolocationLongitude?: number;
  geolocationLatitude?: number;
  addrSingleLine?: string;
  geoAppifyJson?: string;
}

export interface HcclOrganizationGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  mdMissionStatement?: string;
  available?: number;
  jsonData?: string;
  websiteUrl?: string;
  organizationTypeId?: string;
  orgPolicyCode?: string;
  parentEntityId?: string;
  parentEntityEntityType?: string;
  parentEntityName?: string;
  hcclAddrId?: string;
  primaryAddress?: HcclAddrGETData;
}

export interface SignupBehaviorPOSTData {
  catalogEntryInterestId?: string;
  studentUserProfileId?: string;
  resumeId?: string;
  consentToProviderMessaging?: boolean;
  consentToSendTranscript?: boolean;
  signupMessage?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  catalogId?: string;
  catalogEntryId?: string;
  personalStatementId?: string;
  userProfileId?: string;
  interest?: number;
  messageId?: string;
  participantId?: string;
  currentStateCode?: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
  resumeId?: string;
  interestRangeMin?: number;
  interestRangeMax?: number;
  catalogEntryIds?: string[];
}

export interface CatalogEntryInterestPUTData {
  catalogId: string;
  catalogEntryId: string;
  personalStatementId: string;
  userProfileId: string;
  interest: number;
  notes?: string;
  messageId?: string;
  participantId?: string;
  currentStateCode: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
  resumeId?: string;
  signupPostDataJson?: string;
}

export interface CatalogEntryPOSTData {
  catalogId: string;
  signupPacketId?: string;
  entryCode: string;
  title: string;
  catalogTypeCode: string;
  catalogTypeId: string;
  entryGroupCode?: string;
  shortDescription: string;
  description: string;
  businessNeed?: string;
  businessSponsor?: string;
  entryPrice?: number;
  entryCost?: number;
  tarotPrompt?: string;
  notes?: string;
  entryStatusCode?: string;
  online?: number;
  available: number;
  dateUnavailable?: string;
  url?: string;
  tarotFileId?: string;
  tarotFileUrl?: string;
  dateListingStarts?: string;
  dateListingEnds?: string;
  dateStart?: string;
  dateEnd?: string;
  vocodeInstanceId?: string;
  integrationEntityId?: string;
  integrationEntityType?: string;
  integrationEntityName?: string;
  version?: number;
  updateNotes?: string;
  updatedByUserProfileId?: string;
  referenceId?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  hcclAddrId?: string;
  ageRequired?: number;
  mdContents?: string;
  mdQualifications?: string;
  mdSignupInfo?: string;
}

export interface CatalogEntryGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CatalogEntryGETData[];
  filter?: BaseCriteria;
  catalog?: CatalogGETData;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  catalogId?: string;
  signupPacketId?: string;
  entryCode?: string;
  title?: string;
  catalogTypeCode?: string;
  catalogTypeId?: string;
  entryGroupCode?: string;
  shortDescription?: string;
  businessNeed?: string;
  businessSponsor?: string;
  entryPrice?: number;
  entryCost?: number;
  online?: number;
  available?: number;
  dateUnavailable?: string;
  url?: string;
  tarotFileId?: string;
  tarotFileUrl?: string;
  dateListingStarts?: string;
  dateListingEnds?: string;
  dateStart?: string;
  dateEnd?: string;
  vocodeInstanceId?: string;
  integrationEntityId?: string;
  integrationEntityType?: string;
  integrationEntityName?: string;
  version?: number;
  updateNotes?: string;
  updatedByUserProfileId?: string;
  referenceId?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  hcclAddrId?: string;
  ageRequired?: number;
  vocationEncodingId?: string;
  searchingForEditVersion?: boolean;
  ignoringWithInterest?: boolean;
}

export interface DhtmlxTreeNode {
  id?: string;
  value?: string;
  opened?: boolean;
  checked?: boolean;
  checkbox?: boolean;
  type?: string;
  items?: DhtmlxTreeNode[];
}

export interface PMFileGroupEntryGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  pmfileGroupId?: string;
  pmfileId?: string;
  folderName?: string;
  downloadAs?: string;
}

export interface PMFileGroupGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  title?: string;
  instructions?: string;
  available?: boolean;
  uploadGroupReferenceId?: string;
  parentEntityId?: string;
  parentEntityName?: string;
  parentEntityType?: string;
  aspectCode?: string;
  fileGroupEntryId?: string;
  fileTree?: DhtmlxTreeNode;
  mapIdToEntry?: any;
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
  entityDisplayName?: string;
  entityType?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  primaryCode?: number;
  secondaryCode?: number;
  fileGroup?: PMFileGroupGETData;
}

export interface CatalogEntryPUTData {
  catalogId: string;
  signupPacketId?: string;
  entryCode: string;
  title: string;
  catalogTypeCode: string;
  catalogTypeId: string;
  entryGroupCode?: string;
  shortDescription: string;
  description: string;
  businessNeed?: string;
  businessSponsor?: string;
  entryPrice?: number;
  entryCost?: number;
  tarotPrompt?: string;
  notes?: string;
  entryStatusCode?: string;
  online?: number;
  available: number;
  dateUnavailable?: string;
  url?: string;
  tarotFileId?: string;
  tarotFileUrl?: string;
  dateListingStarts?: string;
  dateListingEnds?: string;
  dateStart?: string;
  dateEnd?: string;
  vocodeInstanceId?: string;
  integrationEntityId?: string;
  integrationEntityType?: string;
  integrationEntityName?: string;
  version?: number;
  updateNotes?: string;
  updatedByUserProfileId?: string;
  referenceId?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  hcclAddrId?: string;
  ageRequired?: number;
  mdContents?: string;
  mdQualifications?: string;
  mdSignupInfo?: string;
}

export interface CatalogEntrySignupPacketPOSTData {
  organizationId: string;
  catalogId?: string;
  catalogEntryId?: string;
  fileGroupId?: string;
  name: string;
  signupBehaviorCode: string;
  description: string;
  available: number;
  instructionsMd: string;
}

export interface CatalogEntrySignupPacketGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  organizationId?: string;
  catalogId?: string;
  catalogEntryId?: string;
  fileGroupId?: string;
  name?: string;
  signupBehaviorCode?: string;
  description?: string;
  available?: number;
  instructionsMd?: string;
  signupInstructionsMD?: string;
  fileGroup?: PMFileGroupGETData;
}

export interface CatalogEntrySignupPacketGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CatalogEntrySignupPacketGETData[];
  filter?: BaseCriteria;
}

export interface CatalogEntrySignupPacketCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  organizationId?: string;
  catalogId?: string;
  catalogEntryId?: string;
  fileGroupId?: string;
  name?: string;
  signupBehaviorCode?: string;
  available?: number;
  findingDefaultForOrganization?: boolean;
}

export interface CatalogEntrySignupPacketPUTData {
  organizationId: string;
  catalogId?: string;
  catalogEntryId?: string;
  fileGroupId?: string;
  name: string;
  signupBehaviorCode: string;
  description: string;
  available: number;
  instructionsMd: string;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  entityDisplayName?: string;
  entityType?: string;
  catalogId?: string;
  comments?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  parentWorkRequestItemId?: string;
  catalog?: CatalogGETData;
  author?: HcclUserProfileGETData;
  entries?: CatalogSearchResultEntryGETData[];
  entryIds?: string[];
}

export interface CatalogSearchResultGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CatalogSearchResultGETData[];
  filter?: BaseCriteria;
}

export interface HcclPersonGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
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
  messageHandle?: string;
  languageCode?: string;
  hcclAddrId?: string;
  monthBorn?: number;
  yearBorn?: number;
}

export interface HcclUserGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  externalUserId?: string;
  externalUserEntityType?: string;
  externalUserName?: string;
  available?: number;
  personId?: string;
  languageCode?: string;
  birthYear?: number;
  birthMonth?: number;
  ageVerifiedById?: string;
  person?: HcclPersonGETData;
  userProfiles?: HcclUserProfileGETData[];
}

export interface HcclUserProfileGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  userId?: string;
  userCode?: string;
  messageHandle?: string;
  organizationId?: string;
  profileTypeCode?: string;
  jsonData?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  description?: string;
  available?: number;
  externalUserId?: string;
  externalUserEntityType?: string;
  externalUserName?: string;
  personId?: string;
  registrationJsonData?: string;
  roles?: string[];
  theUser?: HcclUserGETData;
  organization?: HcclOrganizationGETData;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  personalStatementId?: string;
  userProfileId: string;
  encodingText: string;
  vocationEncodingId?: string;
  status?: number;
}

export interface CatalogSearchGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  searchName?: string;
  businessCode?: string;
  description?: string;
  searchMapJson?: string;
  personalStatementId?: string;
  userProfileId?: string;
  encodingText?: string;
  vocationEncodingId?: string;
  status?: number;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  searchName?: string;
  businessCode?: string;
  description?: string;
  searchMapJson?: string;
  personalStatementId?: string;
  userProfileId?: string;
  vocationEncodingId?: string;
  status?: number;
}

export interface CatalogSearchPUTData {
  searchName: string;
  businessCode: string;
  description: string;
  searchMapJson: string;
  personalStatementId?: string;
  userProfileId: string;
  encodingText: string;
  vocationEncodingId?: string;
  status?: number;
}

export interface CatalogPOSTData {
  organizationId: string;
  name: string;
  businessCode: string;
  description: string;
  available: number;
  taxonomyEntryId?: string;
  catalogTypeId?: string;
  urlPrefix?: string;
  url?: string;
  signupPacketId?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  organizationId?: string;
  name?: string;
  businessCode?: string;
  available?: number;
  taxonomyEntryId?: string;
  catalogTypeId?: string;
  urlPrefix?: string;
  url?: string;
  signupPacketId?: string;
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
  catalogTypeId?: string;
  urlPrefix?: string;
  url?: string;
  signupPacketId?: string;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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

export interface CatalogTypeRefPOSTData {
  businessCode: string;
  name: string;
  description: string;
  signupPacketId?: string;
}

export interface CatalogTypeRefGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  businessCode?: string;
  name?: string;
  description?: string;
  signupPacketId?: string;
}

export interface CatalogTypeRefGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CatalogTypeRefGETData[];
  filter?: BaseCriteria;
}

export interface CatalogTypeRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  businessCode?: string;
  name?: string;
  signupPacketId?: string;
}

export interface CatalogTypeRefPUTData {
  businessCode: string;
  name: string;
  description: string;
  signupPacketId?: string;
}

export interface FeedEntryInstancePOSTData {
  feedEntryId?: string;
  calcReasonJson?: string;
  userProfileId: string;
  viewCount: number;
  viewTimeMs: number;
  dateExpires?: string;
  score: number;
  distanceInMiles: number;
  distanceInVocode: number;
  personalStatementId?: string;
}

export interface FeedEntryInstanceGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  feedEntryId?: string;
  calcReasonJson?: string;
  userProfileId?: string;
  viewCount?: number;
  viewTimeMs?: number;
  score?: number;
  distanceInMiles?: number;
  distanceInVocode?: number;
  personalStatementId?: string;
  feedEntry?: FeedEntryGETData;
}

export interface FeedEntryInstanceGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: FeedEntryInstanceGETData[];
  filter?: BaseCriteria;
}

export interface FeedEntryInstanceCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  feedEntryId?: string;
  userProfileId?: string;
  viewCount?: number;
  viewTimeMs?: number;
  score?: number;
  distanceInMiles?: number;
  distanceInVocode?: number;
  personalStatementId?: string;
}

export interface FeedEntryInstancePUTData {
  feedEntryId?: string;
  calcReasonJson?: string;
  userProfileId: string;
  viewCount: number;
  viewTimeMs: number;
  dateExpires?: string;
  score: number;
  distanceInMiles: number;
  distanceInVocode: number;
  personalStatementId?: string;
}

export interface FeedEntryPOSTData {
  feedTypeCode?: string;
  feedSubTypeCode?: string;
  title: string;
  mdContents: string;
  mdMore?: string;
  imageFileId?: string;
  imageFileUrl?: string;
  version?: number;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  hcclAddrId?: string;
  postedByEntityId?: string;
  postedByEntityType?: string;
  postedByEntityName?: string;
  postedByEntityExtra?: string;
}

export interface FeedEntryGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: FeedEntryGETData[];
  filter?: BaseCriteria;
}

export interface FeedEntryCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  feedTypeCode?: string;
  feedSubTypeCode?: string;
  title?: string;
  imageFileId?: string;
  imageFileUrl?: string;
  version?: number;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  hcclAddrId?: string;
  postedByEntityId?: string;
  postedByEntityType?: string;
  postedByEntityName?: string;
  postedByEntityExtra?: string;
  subjectEntityIds?: string[];
  postedByEntityIds?: string[];
}

export interface FeedEntryPUTData {
  feedTypeCode?: string;
  feedSubTypeCode?: string;
  title: string;
  mdContents: string;
  mdMore?: string;
  imageFileId?: string;
  imageFileUrl?: string;
  version?: number;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  hcclAddrId?: string;
  postedByEntityId?: string;
  postedByEntityType?: string;
  postedByEntityName?: string;
  postedByEntityExtra?: string;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  exprienceTypeId: string;
  catalogEntryId?: string;
  currentStateCode: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
  dateStart?: string;
  dateEnd?: string;
  dateRegistrationStart?: string;
  dateRegistrationEnd?: string;
  maxParticipants?: number;
  minParticipants?: number;
  dateRegistrationClosed?: string;
  metadataJson: string;
  indexMd: string;
}

export interface ExperienceGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  exprienceTypeId?: string;
  catalogEntryId?: string;
  currentStateCode?: string;
  currentStateTransitionId?: string;
  maxParticipants?: number;
  minParticipants?: number;
  metadataJson?: string;
  indexMd?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  name?: string;
  businessCode?: string;
  available?: number;
  exprienceTypeId?: string;
  catalogEntryId?: string;
  currentStateCode?: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
  dateStart?: string;
  dateEnd?: string;
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
  exprienceTypeId: string;
  catalogEntryId?: string;
  currentStateCode: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
  dateStart?: string;
  dateEnd?: string;
  dateRegistrationStart?: string;
  dateRegistrationEnd?: string;
  maxParticipants?: number;
  minParticipants?: number;
  dateRegistrationClosed?: string;
  metadataJson: string;
  indexMd: string;
}

export interface ExperienceTypePOSTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
  statePolicyCode: string;
  experiencePolicyCode: string;
}

export interface ExperienceTypeGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  statePolicyCode?: string;
  experiencePolicyCode?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  name?: string;
  businessCode?: string;
  available?: number;
  statePolicyCode?: string;
  experiencePolicyCode?: string;
}

export interface ExperienceTypePUTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
  statePolicyCode: string;
  experiencePolicyCode: string;
}

export interface ParticipantPOSTData {
  userProfileId: string;
  catalogEntryInterestId?: string;
  catalogEntryId?: string;
  experienceId?: string;
  messageId?: string;
  name: string;
  businessCode: string;
  sequenceOrder: number;
  comments?: string;
  currentStateCode: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
  dateStart?: string;
  dateEnd?: string;
}

export interface ParticipantGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  userProfileId?: string;
  catalogEntryInterestId?: string;
  catalogEntryId?: string;
  experienceId?: string;
  messageId?: string;
  name?: string;
  businessCode?: string;
  sequenceOrder?: number;
  comments?: string;
  currentStateCode?: string;
  currentStateTransitionId?: string;
}

export interface ParticipantGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: ParticipantGETData[];
  filter?: BaseCriteria;
}

export interface ParticipantCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  userProfileId?: string;
  catalogEntryInterestId?: string;
  catalogEntryId?: string;
  experienceId?: string;
  messageId?: string;
  name?: string;
  businessCode?: string;
  sequenceOrder?: number;
  currentStateCode?: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
  dateStart?: string;
  dateEnd?: string;
}

export interface ParticipantPUTData {
  userProfileId: string;
  catalogEntryInterestId?: string;
  catalogEntryId?: string;
  experienceId?: string;
  messageId?: string;
  name: string;
  businessCode: string;
  sequenceOrder: number;
  comments?: string;
  currentStateCode: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
  dateStart?: string;
  dateEnd?: string;
}

export interface PersonalStatementResumePOSTData {
  userProfileId: string;
  personalStatmentId: string;
  title: string;
  resumeMd: string;
  resumeMdEdited?: string;
  resumeJson: string;
  available: number;
}

export interface PersonalStatementResumeGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  userProfileId?: string;
  personalStatmentId?: string;
  title?: string;
  resumeMd?: string;
  resumeMdEdited?: string;
  resumeJson?: string;
  available?: number;
  theResumePojo?: ResumePOJO;
}

export interface PersonalStatementResumeGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: PersonalStatementResumeGETData[];
  filter?: BaseCriteria;
}

export interface ResumeEntryPOJO {
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  sequenceOrder?: number;
  entityId?: string;
  title?: string;
  description?: string;
  resumeText?: string;
  position?: string;
  organizationName?: string;
  dateStart?: string;
  dateEnd?: string;
}

export interface ResumePOJO {
  sections?: ResumeSectionPOJO[];
}

export interface ResumeSectionPOJO {
  sequenceOrder?: number;
  markdown?: string;
  sectionCode?: string;
  included?: boolean;
  resumeEntries?: ResumeEntryPOJO[];
}

export interface PersonalStatementResumeCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  userProfileId?: string;
  personalStatmentId?: string;
  title?: string;
  available?: number;
}

export interface PersonalStatementResumePUTData {
  userProfileId: string;
  personalStatmentId: string;
  title: string;
  resumeMd: string;
  resumeMdEdited?: string;
  resumeJson: string;
  available: number;
}

export interface ResumeEntryPOSTData {
  userProfileId: string;
  participantId?: string;
  title: string;
  entryMd: string;
  entryMdEdited: string;
  entryJson: string;
  resumeEntryText: string;
  position: string;
  organizationName: string;
  longDescription: string;
  available: number;
  dateStart?: string;
  dateEnd?: string;
}

export interface ResumeEntryGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  userProfileId?: string;
  participantId?: string;
  title?: string;
  entryMd?: string;
  entryMdEdited?: string;
  entryJson?: string;
  resumeEntryText?: string;
  position?: string;
  organizationName?: string;
  longDescription?: string;
  available?: number;
  theResumeEntryPojo?: ResumeEntryPOJO;
}

export interface ResumeEntryGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: ResumeEntryGETData[];
  filter?: BaseCriteria;
}

export interface ResumeEntryCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  userProfileId?: string;
  participantId?: string;
  title?: string;
  resumeEntryText?: string;
  position?: string;
  organizationName?: string;
  available?: number;
  dateStart?: string;
  dateEnd?: string;
}

export interface ResumeEntryPUTData {
  userProfileId: string;
  participantId?: string;
  title: string;
  entryMd: string;
  entryMdEdited: string;
  entryJson: string;
  resumeEntryText: string;
  position: string;
  organizationName: string;
  longDescription: string;
  available: number;
  dateStart?: string;
  dateEnd?: string;
}

export interface ResumeUserInfoPOSTData {
  userProfileId: string;
  headerMd: string;
  eduMd: string;
  skillsMd: string;
  projectsMd: string;
  otherMd: string;
}

export interface ResumeUserInfoGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  userProfileId?: string;
  headerMd?: string;
  eduMd?: string;
  skillsMd?: string;
  projectsMd?: string;
  otherMd?: string;
}

export interface ResumeUserInfoGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: ResumeUserInfoGETData[];
  filter?: BaseCriteria;
}

export interface ResumeUserInfoCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  userProfileId?: string;
}

export interface ResumeUserInfoPUTData {
  userProfileId: string;
  headerMd: string;
  eduMd: string;
  skillsMd: string;
  projectsMd: string;
  otherMd: string;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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

export interface PAiPromptRefPOSTData {
  businessCode: string;
  pojoClassName: string;
  name: string;
  description: string;
  promptText: string;
  available: number;
}

export interface PAiPromptRefGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  businessCode?: string;
  pojoClassName?: string;
  name?: string;
  description?: string;
  promptText?: string;
  available?: number;
}

export interface PAiPromptRefGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: PAiPromptRefGETData[];
  filter?: BaseCriteria;
}

export interface PAiPromptRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  businessCode?: string;
  pojoClassName?: string;
  name?: string;
  available?: number;
}

export interface PAiPromptRefPUTData {
  businessCode: string;
  pojoClassName: string;
  name: string;
  description: string;
  promptText: string;
  available: number;
}

export interface PEntityTagValPOSTData {
  parentEntityId?: string;
  parentEntityType?: string;
  parentEntityName?: string;
  subjectEntityId: string;
  subjectEntityType: string;
  subjectEntityName: string;
  valueEntityId: string;
  valueEntityType: string;
  valueEntityName: string;
  dataTypeCode: string;
  tagCode: string;
  valueCodeDetail?: string;
  valueStringValue?: string;
  valueIntValue?: number;
  valueDoubleValue?: number;
  valueBooleanValue?: boolean;
  valueMinValue?: number;
  valueMaxValue?: number;
  idValue?: string;
  dateStart?: string;
  dateEnd?: string;
  dateTdsDuration?: string;
  jsonValue?: string;
  geolocationLongitude?: number;
  geolocationLatitude?: number;
}

export interface PEntityTagValGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  parentEntityId?: string;
  parentEntityType?: string;
  parentEntityName?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  valueEntityId?: string;
  valueEntityType?: string;
  valueEntityName?: string;
  dataTypeCode?: string;
  tagCode?: string;
  valueCodeDetail?: string;
  valueStringValue?: string;
  valueIntValue?: number;
  valueDoubleValue?: number;
  valueBooleanValue?: boolean;
  valueMinValue?: number;
  valueMaxValue?: number;
  idValue?: string;
  dateTdsDuration?: string;
  jsonValue?: string;
  geolocationLongitude?: number;
  geolocationLatitude?: number;
}

export interface PEntityTagValGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: PEntityTagValGETData[];
  filter?: BaseCriteria;
}

export interface PEntityTagValCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  parentEntityId?: string;
  parentEntityType?: string;
  parentEntityName?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  valueEntityId?: string;
  valueEntityType?: string;
  valueEntityName?: string;
  dataTypeCode?: string;
  tagCode?: string;
  valueCodeDetail?: string;
  valueStringValue?: string;
  valueIntValue?: number;
  valueDoubleValue?: number;
  valueBooleanValue?: boolean;
  valueMinValue?: number;
  valueMaxValue?: number;
  idValue?: string;
  dateStart?: string;
  dateEnd?: string;
  dateTdsDuration?: string;
  geolocationLongitude?: number;
  geolocationLatitude?: number;
}

export interface PEntityTagValPUTData {
  parentEntityId?: string;
  parentEntityType?: string;
  parentEntityName?: string;
  subjectEntityId: string;
  subjectEntityType: string;
  subjectEntityName: string;
  valueEntityId: string;
  valueEntityType: string;
  valueEntityName: string;
  dataTypeCode: string;
  tagCode: string;
  valueCodeDetail?: string;
  valueStringValue?: string;
  valueIntValue?: number;
  valueDoubleValue?: number;
  valueBooleanValue?: boolean;
  valueMinValue?: number;
  valueMaxValue?: number;
  idValue?: string;
  dateStart?: string;
  dateEnd?: string;
  dateTdsDuration?: string;
  jsonValue?: string;
  geolocationLongitude?: number;
  geolocationLatitude?: number;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  md5Hash?: string;
  fileBlob: string;
}

export interface PMFileBlobGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  pmfileId?: string;
  pathToFile?: string;
  md5Hash?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  pmfileId?: string;
  pathToFile?: string;
  md5Hash?: string;
}

export interface PMFileBlobPUTData {
  pmfileId?: string;
  pathToFile: string;
  md5Hash?: string;
  fileBlob: string;
}

export interface PMFileGroupEntryPOSTData {
  pmfileGroupId: string;
  pmfileId: string;
  folderName: string;
  downloadAs: string;
}

export interface PMFileGroupEntryGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: PMFileGroupEntryGETData[];
  filter?: BaseCriteria;
}

export interface PMFileGroupEntryCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  pmfileGroupId?: string;
  pmfileId?: string;
  folderName?: string;
  downloadAs?: string;
}

export interface PMFileGroupEntryPUTData {
  pmfileGroupId: string;
  pmfileId: string;
  folderName: string;
  downloadAs: string;
}

export interface EntityTuple {
  tenantId?: string;
  entityName?: string;
  entityOrgId?: string;
  entityId?: string;
  entityIdStr?: string;
  serviceCode?: string;
  entityDisplayText?: string;
}

export interface PMFileGroupPOSTData {
  title: string;
  instructions: string;
  available?: boolean;
  uploadGroupReferenceId?: string;
  parentEntityId: string;
  parentEntityName?: string;
  parentEntityType: string;
  aspectCode: string;
  fileGroupEntryId?: string;
  mapFolderFiles?: any;
  parentEntity?: EntityTuple;
}

export interface PMFilePOSTData {
  downloadAs: string;
  folderPath: string;
  fileAccessCode: string;
  available?: boolean;
  pmbucketFolderId?: string;
  pmfileReferenceId?: string;
  uploadReferenceId?: string;
  uploadGroupReferenceId?: string;
  parentEntityId: string;
  parentEntityName?: string;
  parentEntityType: string;
  md5Hash?: string;
  copyFromPMFileId?: string;
  publicImage?: boolean;
  fileSize?: number;
  mimeType?: string;
  version?: number;
  bucketStorageUuid?: string;
  bucketFolderPath?: string;
  inTrash?: boolean;
  fileBlob?: string;
  fileBlobBase64?: string;
  blobMetadata?: any;
  fileGroupId?: string;
}

export interface PMFileGroupGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: PMFileGroupGETData[];
  filter?: BaseCriteria;
}

export interface PMFileGroupCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  title?: string;
  instructions?: string;
  available?: boolean;
  uploadGroupReferenceId?: string;
  parentEntityId?: string;
  parentEntityName?: string;
  parentEntityType?: string;
  aspectCode?: string;
  fileGroupEntryId?: string;
}

export interface PMFileGroupPUTData {
  title: string;
  instructions: string;
  available?: boolean;
  uploadGroupReferenceId?: string;
  parentEntityId: string;
  parentEntityName?: string;
  parentEntityType: string;
  aspectCode: string;
  fileGroupEntryId?: string;
}

export interface PMFileGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  downloadAs?: string;
  folderPath?: string;
  fileAccessCode?: string;
  available?: boolean;
  pmbucketFolderId?: string;
  pmfileReferenceId?: string;
  uploadReferenceId?: string;
  uploadGroupReferenceId?: string;
  parentEntityId?: string;
  parentEntityName?: string;
  parentEntityType?: string;
  md5Hash?: string;
  copyFromPMFileId?: string;
  publicImage?: boolean;
  fileSize?: number;
  mimeType?: string;
  version?: number;
  bucketStorageUuid?: string;
  bucketFolderPath?: string;
  inTrash?: boolean;
  downloadFileUrl?: string;
  downloadInternalFileUrl?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  downloadAs?: string;
  folderPath?: string;
  fileAccessCode?: string;
  available?: boolean;
  pmbucketFolderId?: string;
  pmfileReferenceId?: string;
  uploadReferenceId?: string;
  uploadGroupReferenceId?: string;
  parentEntityId?: string;
  parentEntityName?: string;
  parentEntityType?: string;
  md5Hash?: string;
  copyFromPMFileId?: string;
  publicImage?: boolean;
  fileSize?: number;
  mimeType?: string;
  version?: number;
  bucketStorageUuid?: string;
  bucketFolderPath?: string;
  inTrash?: boolean;
  showingPublicUrl?: boolean;
}

export interface PMFilePUTData {
  downloadAs: string;
  folderPath: string;
  fileAccessCode: string;
  available?: boolean;
  pmbucketFolderId?: string;
  pmfileReferenceId?: string;
  uploadReferenceId?: string;
  uploadGroupReferenceId?: string;
  parentEntityId: string;
  parentEntityName?: string;
  parentEntityType: string;
  md5Hash?: string;
  copyFromPMFileId?: string;
  publicImage?: boolean;
  fileSize?: number;
  mimeType?: string;
  version?: number;
  bucketStorageUuid?: string;
  bucketFolderPath?: string;
  inTrash?: boolean;
  fileBlob?: string;
  fileBlobBase64?: string;
}

export interface PMessageAttachmentPOSTData {
  pmessageId?: string;
  pmessageEntryId?: string;
  attachmentEntityId: string;
  attachmentEntityName?: string;
  attachmentEntityType: string;
}

export interface PMessageAttachmentGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  pmessageId?: string;
  pmessageEntryId?: string;
  attachmentEntityId?: string;
  attachmentEntityName?: string;
  attachmentEntityType?: string;
}

export interface PMessageAttachmentGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: PMessageAttachmentGETData[];
  filter?: BaseCriteria;
}

export interface PMessageAttachmentCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  pmessageId?: string;
  pmessageEntryId?: string;
  attachmentEntityId?: string;
  attachmentEntityName?: string;
  attachmentEntityType?: string;
}

export interface PMessageAttachmentPUTData {
  pmessageId?: string;
  pmessageEntryId?: string;
  attachmentEntityId: string;
  attachmentEntityName?: string;
  attachmentEntityType: string;
}

export interface PMessageEntryPOSTData {
  pmessageId?: string;
  authorUserProfileId?: string;
  messageParticipantId?: string;
  body: string;
  bodyFormatCode: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  attachments?: PMFilePOSTData[];
  attachmentTuples?: EntityTuple[];
}

export interface PMessageEntryGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  pmessageId?: string;
  authorUserProfileId?: string;
  messageParticipantId?: string;
  body?: string;
  bodyFormatCode?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  attachments?: PMessageAttachmentGETData[];
}

export interface PMessageEntryGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: PMessageEntryGETData[];
  filter?: BaseCriteria;
}

export interface PMessageEntryCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  pmessageId?: string;
  authorUserProfileId?: string;
  messageParticipantId?: string;
  body?: string;
  bodyFormatCode?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  dateLastRead?: string;
}

export interface PMessageEntryPUTData {
  pmessageId?: string;
  authorUserProfileId?: string;
  messageParticipantId?: string;
  body: string;
  bodyFormatCode: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
}

export interface PMessageParticipantPOSTData {
  pmessageId?: string;
  userProfileId?: string;
  dateLastViewed?: string;
  importance?: number;
}

export interface PMessageParticipantGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  pmessageId?: string;
  userProfileId?: string;
  importance?: number;
  userProfile?: HcclUserProfileGETData;
}

export interface PMessageParticipantGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: PMessageParticipantGETData[];
  filter?: BaseCriteria;
}

export interface PMessageParticipantCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  pmessageId?: string;
  userProfileId?: string;
  dateLastViewed?: string;
  importance?: number;
  userProfileIds?: string[];
}

export interface PMessageParticipantPUTData {
  pmessageId?: string;
  userProfileId?: string;
  dateLastViewed?: string;
  importance?: number;
}

export interface PMessagePOSTData {
  authorUserProfileId?: string;
  teamId?: string;
  title: string;
  description: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  dateLastEntry?: string;
}

export interface PMessageGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  authorUserProfileId?: string;
  teamId?: string;
  title?: string;
  description?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  participants?: PMessageParticipantGETData[];
  unreadMessageCount?: number;
}

export interface PMessageGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: PMessageGETData[];
  filter?: BaseCriteria;
}

export interface PMessageCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  authorUserProfileId?: string;
  teamId?: string;
  title?: string;
  description?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  dateLastEntry?: string;
  teamIds?: string[];
  participantUserProfileId?: string;
}

export interface PMessagePUTData {
  authorUserProfileId?: string;
  teamId?: string;
  title: string;
  description: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  dateLastEntry?: string;
}

export interface PContractActivationCodePOSTData {
  userProfileId: string;
  activationActionCode: string;
  userProfileUsername?: string;
  dateSigned?: string;
  dateExpires?: string;
  loginSessionId?: string;
  activationCode: string;
  claimedByUserProfileId: string;
}

export interface PContractActivationCodeGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  userProfileId?: string;
  activationActionCode?: string;
  userProfileUsername?: string;
  loginSessionId?: string;
  activationCode?: string;
  claimedByUserProfileId?: string;
}

export interface PContractActivationCodeGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: PContractActivationCodeGETData[];
  filter?: BaseCriteria;
}

export interface PContractActivationCodeCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  userProfileId?: string;
  activationActionCode?: string;
  userProfileUsername?: string;
  dateSigned?: string;
  dateExpires?: string;
  loginSessionId?: string;
  activationCode?: string;
  claimedByUserProfileId?: string;
  unclaimed?: boolean;
}

export interface PContractActivationCodePUTData {
  userProfileId: string;
  activationActionCode: string;
  userProfileUsername?: string;
  dateSigned?: string;
  dateExpires?: string;
  loginSessionId?: string;
  activationCode: string;
  claimedByUserProfileId: string;
}

export interface PContractParticipantPOSTData {
  userProfileUsername: string;
  contractVersionInstanceId: string;
  contractVersionId: string;
  contractCode: string;
  userProfileId: string;
  dateSigned?: string;
  loginSessionId: string;
  digitalHash: string;
  agreeData: string;
}

export interface PContractParticipantGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  userProfileUsername?: string;
  contractVersionInstanceId?: string;
  contractVersionId?: string;
  contractCode?: string;
  userProfileId?: string;
  loginSessionId?: string;
  digitalHash?: string;
  agreeData?: string;
}

export interface PContractParticipantGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: PContractParticipantGETData[];
  filter?: BaseCriteria;
}

export interface PContractParticipantCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  userProfileUsername?: string;
  contractVersionInstanceId?: string;
  contractVersionId?: string;
  contractCode?: string;
  userProfileId?: string;
  dateSigned?: string;
  loginSessionId?: string;
  digitalHash?: string;
  agreeData?: string;
}

export interface PContractParticipantPUTData {
  userProfileUsername: string;
  contractVersionInstanceId: string;
  contractVersionId: string;
  contractCode: string;
  userProfileId: string;
  dateSigned?: string;
  loginSessionId: string;
  digitalHash: string;
  agreeData: string;
}

export interface PContractPOSTData {
  name: string;
  businessCode: string;
  groupCode: string;
  description: string;
  digitalHashAlgo: string;
  available: number;
}

export interface PContractGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  name?: string;
  businessCode?: string;
  groupCode?: string;
  description?: string;
  digitalHashAlgo?: string;
  available?: number;
}

export interface PContractGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: PContractGETData[];
  filter?: BaseCriteria;
}

export interface PContractCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  name?: string;
  businessCode?: string;
  groupCode?: string;
  digitalHashAlgo?: string;
  available?: number;
}

export interface PContractPUTData {
  name: string;
  businessCode: string;
  groupCode: string;
  description: string;
  digitalHashAlgo: string;
  available: number;
}

export interface PContractVersionInstancePOSTData {
  contractVersionId: string;
  contractCode: string;
  instanceCode: string;
  mdContentsMerged?: string;
  digitalHash?: string;
  parentEntityId: string;
  parentEntityName?: string;
  parentEntityType: string;
  completedStatus: number;
}

export interface PContractVersionInstanceGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  contractVersionId?: string;
  contractCode?: string;
  instanceCode?: string;
  mdContentsMerged?: string;
  digitalHash?: string;
  parentEntityId?: string;
  parentEntityName?: string;
  parentEntityType?: string;
  completedStatus?: number;
}

export interface PContractVersionInstanceGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: PContractVersionInstanceGETData[];
  filter?: BaseCriteria;
}

export interface PContractVersionInstanceCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  contractVersionId?: string;
  contractCode?: string;
  instanceCode?: string;
  digitalHash?: string;
  parentEntityId?: string;
  parentEntityName?: string;
  parentEntityType?: string;
  completedStatus?: number;
}

export interface PContractVersionInstancePUTData {
  contractVersionId: string;
  contractCode: string;
  instanceCode: string;
  mdContentsMerged?: string;
  digitalHash?: string;
  parentEntityId: string;
  parentEntityName?: string;
  parentEntityType: string;
  completedStatus: number;
}

export interface PContractVersionPOSTData {
  contractId: string;
  contractCode: string;
  languageCode: string;
  title: string;
  consentMessage: string;
  mdContents: string;
  available: number;
  currentVersion: number;
  version?: number;
  digitalHashAlgo: string;
  digitalHash: string;
  agreeDataType: string;
  contract?: PContractPOSTData;
}

export interface PContractVersionGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  contractId?: string;
  contractCode?: string;
  languageCode?: string;
  title?: string;
  consentMessage?: string;
  mdContents?: string;
  available?: number;
  currentVersion?: number;
  version?: number;
  digitalHashAlgo?: string;
  digitalHash?: string;
  agreeDataType?: string;
}

export interface PContractVersionGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: PContractVersionGETData[];
  filter?: BaseCriteria;
}

export interface PContractVersionCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  contractId?: string;
  contractCode?: string;
  languageCode?: string;
  title?: string;
  consentMessage?: string;
  available?: number;
  currentVersion?: number;
  version?: number;
  digitalHashAlgo?: string;
  digitalHash?: string;
  agreeDataType?: string;
}

export interface PContractVersionPUTData {
  contractId: string;
  contractCode: string;
  languageCode: string;
  title: string;
  consentMessage: string;
  mdContents: string;
  available: number;
  currentVersion: number;
  version?: number;
  digitalHashAlgo: string;
  digitalHash: string;
  agreeDataType: string;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  entityDisplayName?: string;
  entityType?: string;
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
  currentState?: EntityStateGETData;
  currentStateTransition?: EntityStateTransitionGETData;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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

export interface SwWorkProductPOSTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
  availableForPricing: number;
  softwareCategoryCode?: string;
  businessNeedCode?: string;
  businessNeed?: string;
  productTypeCode: string;
  ipOwnershipCode: string;
  complexityCode: string;
  hostingCode: string;
  lifecycleCode: string;
  slaCode: string;
  linkWiki?: string;
  numberOfUniqueUsersPerYear: number;
  importance: number;
  revenuePerYear: number;
  recordCount: number;
  developmentHours: number;
  costPerMonth: number;
}

export interface SwWorkProductGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  availableForPricing?: number;
  softwareCategoryCode?: string;
  businessNeedCode?: string;
  businessNeed?: string;
  productTypeCode?: string;
  ipOwnershipCode?: string;
  complexityCode?: string;
  hostingCode?: string;
  lifecycleCode?: string;
  slaCode?: string;
  linkWiki?: string;
  numberOfUniqueUsersPerYear?: number;
  importance?: number;
  revenuePerYear?: number;
  recordCount?: number;
  developmentHours?: number;
  costPerMonth?: number;
}

export interface SwWorkProductGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: SwWorkProductGETData[];
  filter?: BaseCriteria;
}

export interface SwWorkProductCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  name?: string;
  businessCode?: string;
  available?: number;
  availableForPricing?: number;
  softwareCategoryCode?: string;
  businessNeedCode?: string;
  businessNeed?: string;
  productTypeCode?: string;
  ipOwnershipCode?: string;
  complexityCode?: string;
  hostingCode?: string;
  lifecycleCode?: string;
  slaCode?: string;
  linkWiki?: string;
  numberOfUniqueUsersPerYear?: number;
  importance?: number;
  revenuePerYear?: number;
  recordCount?: number;
  developmentHours?: number;
  costPerMonth?: number;
}

export interface SwWorkProductPUTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
  availableForPricing: number;
  softwareCategoryCode?: string;
  businessNeedCode?: string;
  businessNeed?: string;
  productTypeCode: string;
  ipOwnershipCode: string;
  complexityCode: string;
  hostingCode: string;
  lifecycleCode: string;
  slaCode: string;
  linkWiki?: string;
  numberOfUniqueUsersPerYear: number;
  importance: number;
  revenuePerYear: number;
  recordCount: number;
  developmentHours: number;
  costPerMonth: number;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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

export interface FamilyUnitMemberPOSTData {
  familyUnitId: string;
  personId: string;
  role?: string;
}

export interface FamilyUnitMemberGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  familyUnitId?: string;
  personId?: string;
  role?: string;
  person?: HcclPersonGETData;
  user?: HcclUserGETData;
}

export interface FamilyUnitMemberGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: FamilyUnitMemberGETData[];
  filter?: BaseCriteria;
}

export interface FamilyUnitMemberCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  familyUnitId?: string;
  personId?: string;
  role?: string;
}

export interface FamilyUnitMemberPUTData {
  familyUnitId: string;
  personId: string;
  role?: string;
}

export interface FamilyUnitPOSTData {
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
  familyName: string;
}

export interface FamilyUnitGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
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
  familyName?: string;
  members?: FamilyUnitMemberGETData[];
}

export interface FamilyUnitGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: FamilyUnitGETData[];
  filter?: BaseCriteria;
}

export interface FamilyUnitCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  familyName?: string;
}

export interface FamilyUnitPUTData {
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
  familyName: string;
}

export interface HcclAddrPOSTData {
  parentEntityId?: string;
  parentEntityType?: string;
  parentEntityName?: string;
  organizationId?: string;
  formattedAddressJson?: string;
  addressTypeCode?: string;
  addrLine1?: string;
  addrLine2?: string;
  addrLine3?: string;
  addrLine4?: string;
  city?: string;
  stateCode?: string;
  countryCode?: string;
  zip?: string;
  zipPlus4?: string;
  geolocationLongitude?: number;
  geolocationLatitude?: number;
  addrSingleLine?: string;
  geoAppifyJson?: string;
}

export interface HcclAddrGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: HcclAddrGETData[];
  filter?: BaseCriteria;
}

export interface HcclAddrCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  parentEntityId?: string;
  parentEntityType?: string;
  parentEntityName?: string;
  organizationId?: string;
  formattedAddressJson?: string;
  addressTypeCode?: string;
  addrLine1?: string;
  addrLine2?: string;
  addrLine3?: string;
  addrLine4?: string;
  city?: string;
  stateCode?: string;
  countryCode?: string;
  zip?: string;
  zipPlus4?: string;
  geolocationLongitude?: number;
  geolocationLatitude?: number;
}

export interface HcclAddrPUTData {
  parentEntityId?: string;
  parentEntityType?: string;
  parentEntityName?: string;
  organizationId?: string;
  formattedAddressJson?: string;
  addressTypeCode?: string;
  addrLine1?: string;
  addrLine2?: string;
  addrLine3?: string;
  addrLine4?: string;
  city?: string;
  stateCode?: string;
  countryCode?: string;
  zip?: string;
  zipPlus4?: string;
  geolocationLongitude?: number;
  geolocationLatitude?: number;
  addrSingleLine?: string;
  geoAppifyJson?: string;
}

export interface HcclOrganizationPOSTData {
  name: string;
  businessCode: string;
  description: string;
  mdMissionStatement?: string;
  available: number;
  jsonData?: string;
  websiteUrl?: string;
  organizationTypeId: string;
  orgPolicyCode: string;
  parentEntityId?: string;
  parentEntityEntityType?: string;
  parentEntityName?: string;
  hcclAddrId?: string;
  organizationTypeCode: string;
  primaryAddressSingleLine: string;
  primaryAddress?: HcclAddrPOSTData;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  websiteUrl?: string;
  organizationTypeId?: string;
  orgPolicyCode?: string;
  parentEntityId?: string;
  parentEntityEntityType?: string;
  parentEntityName?: string;
  hcclAddrId?: string;
  organizationTypeCode?: string;
}

export interface HcclOrganizationPUTData {
  name: string;
  businessCode: string;
  description: string;
  mdMissionStatement?: string;
  available: number;
  jsonData?: string;
  websiteUrl?: string;
  organizationTypeId: string;
  orgPolicyCode: string;
  parentEntityId?: string;
  parentEntityEntityType?: string;
  parentEntityName?: string;
  hcclAddrId?: string;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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

export interface HcclPersonPOSTData {
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
  messageHandle: string;
  languageCode: string;
  hcclAddrId?: string;
  monthBorn?: number;
  yearBorn?: number;
  hcclAddr?: HcclAddrPOSTData;
}

export interface HcclPersonGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: HcclPersonGETData[];
  filter?: BaseCriteria;
}

export interface HcclPersonCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  messageHandle?: string;
  languageCode?: string;
  hcclAddrId?: string;
  monthBorn?: number;
  yearBorn?: number;
}

export interface HcclPersonPUTData {
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
  messageHandle: string;
  languageCode: string;
  hcclAddrId?: string;
  monthBorn?: number;
  yearBorn?: number;
}

export interface HcclTeamLogPOSTData {
  nameText: string;
  description: string;
  teamId: string;
  userProfileId?: string;
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
  entityDisplayName?: string;
  entityType?: string;
  nameText?: string;
  description?: string;
  teamId?: string;
  userProfileId?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  nameText?: string;
  description?: string;
  teamId?: string;
  userProfileId?: string;
  roleCode?: string;
  actionCode?: string;
}

export interface HcclTeamLogPUTData {
  nameText: string;
  description: string;
  teamId: string;
  userProfileId?: string;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  name: string;
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
  entityDisplayName?: string;
  entityType?: string;
  name?: string;
  teamId?: string;
  userId?: string;
  userProfileId?: string;
  dateAdded?: DateGETData;
  dateRemoved?: DateGETData;
  userProfile?: HcclUserProfileGETData;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  name?: string;
  teamId?: string;
  userId?: string;
  userProfileId?: string;
  dateAdded?: string;
  dateRemoved?: string;
  teamIds?: string[];
}

export interface HcclTeamMemberPUTData {
  name: string;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  name?: string;
  businessCode?: string;
  description?: string;
  teamTypeId?: string;
  organizationId?: string;
  teamParentId?: string;
  teamParentEntityType?: string;
  teamParentName?: string;
  available?: number;
  memberUserProfileId?: string;
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

export interface HcclUserInvitePOSTData {
  emailAddress?: string;
  organizationId?: string;
  teamId?: string;
  inviteCode: string;
  notes?: string;
  dateExpires?: string;
  jsonData?: string;
  available: number;
  dateAccepted?: string;
  currentStateCode: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
}

export interface HcclUserInviteGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  emailAddress?: string;
  organizationId?: string;
  teamId?: string;
  inviteCode?: string;
  notes?: string;
  jsonData?: string;
  available?: number;
  currentStateCode?: string;
  currentStateTransitionId?: string;
  niceName?: string;
  organization?: HcclOrganizationGETData;
  createdByUserProfile?: HcclUserProfileGETData;
  callbackUrl?: string;
}

export interface HcclUserInviteGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: HcclUserInviteGETData[];
  filter?: BaseCriteria;
}

export interface HcclUserInviteCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  emailAddress?: string;
  organizationId?: string;
  teamId?: string;
  inviteCode?: string;
  notes?: string;
  dateExpires?: string;
  available?: number;
  dateAccepted?: string;
  currentStateCode?: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
}

export interface HcclUserInvitePUTData {
  emailAddress?: string;
  organizationId?: string;
  teamId?: string;
  inviteCode: string;
  notes?: string;
  dateExpires?: string;
  jsonData?: string;
  available: number;
  dateAccepted?: string;
  currentStateCode: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  messageHandle: string;
  organizationId: string;
  profileTypeCode: string;
  jsonData?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  description?: string;
  available: number;
  externalUserId?: string;
  externalUserEntityType?: string;
  externalUserName?: string;
  personId: string;
  registrationJsonData?: string;
  dateFirstLogin?: string;
  dateRegistrationComplete?: string;
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
  entityDisplayName?: string;
  entityType?: string;
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
  clientFacingMessageId?: string;
  internalFacingMessageId?: string;
  workRequestType?: WorkRequestTypeRefGETData;
  currentState?: EntityStateGETData;
  currentStateTransition?: EntityStateTransitionGETData;
  debugInfo?: string;
}

export interface WorkRequestItemGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
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
  currentState?: EntityStateGETData;
  currentStateTransition?: EntityStateTransitionGETData;
}

export interface WorkRequestTypeRefGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  name?: string;
  businessCode?: string;
  description?: string;
  policyBeanName?: string;
  available?: number;
}

export interface CreateTicketPOSTData {
  advocateUserProfileId?: string;
  studentUserProfileId?: string;
  queueId?: string;
  workRequestTypeId?: string;
  title?: string;
  rawText?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  userId?: string;
  userCode?: string;
  messageHandle?: string;
  organizationId?: string;
  profileTypeCode?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  description?: string;
  available?: number;
  externalUserId?: string;
  externalUserEntityType?: string;
  externalUserName?: string;
  personId?: string;
  dateFirstLogin?: string;
  dateRegistrationComplete?: string;
  findingColleagues?: boolean;
  externalUserIds?: string[];
}

export interface HcclUserProfilePUTData {
  userId: string;
  userCode: string;
  messageHandle: string;
  organizationId: string;
  profileTypeCode: string;
  jsonData?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  description?: string;
  available: number;
  externalUserId?: string;
  externalUserEntityType?: string;
  externalUserName?: string;
  personId: string;
  registrationJsonData?: string;
  dateFirstLogin?: string;
  dateRegistrationComplete?: string;
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
  personId: string;
  languageCode: string;
  birthYear?: number;
  birthMonth?: number;
  ageVerifiedById?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  name?: string;
  businessCode?: string;
  description?: string;
  externalUserId?: string;
  externalUserEntityType?: string;
  externalUserName?: string;
  available?: number;
  personId?: string;
  languageCode?: string;
  birthYear?: number;
  birthMonth?: number;
  ageVerifiedById?: string;
}

export interface HcclUserPUTData {
  name: string;
  businessCode: string;
  description: string;
  externalUserId?: string;
  externalUserEntityType?: string;
  externalUserName?: string;
  available: number;
  personId: string;
  languageCode: string;
  birthYear?: number;
  birthMonth?: number;
  ageVerifiedById?: string;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  parentDeliverableId?: string;
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
  fileGroupId?: string;
}

export interface WorkItemDeliverableGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  workRequestId?: string;
  workRequestItemId?: string;
  parentDeliverableId?: string;
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
  fileGroupId?: string;
  author?: HcclUserProfileGETData;
  catalogSearchResult?: CatalogSearchResultGETData;
  currentState?: EntityStateGETData;
  currentStateTransition?: EntityStateTransitionGETData;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  workRequestId?: string;
  workRequestItemId?: string;
  parentDeliverableId?: string;
  nameText?: string;
  businessCode?: string;
  description?: string;
  delivTypeCode?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  currentStateCode?: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
  linkToDeliverableId?: string;
  fileGroupId?: string;
}

export interface WorkItemDeliverablePUTData {
  workRequestId: string;
  workRequestItemId?: string;
  parentDeliverableId?: string;
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
  fileGroupId?: string;
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
  entityDisplayName?: string;
  entityType?: string;
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
  organization?: HcclOrganizationGETData;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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

export interface WorkRequestDeliverableSectionPOSTData {
  workRequestDeliverableId?: string;
  sequenceOrder: number;
  workRequestId: string;
  workRequestItemId?: string;
  itemActionCode: string;
  title: string;
  comments?: string;
  markdown?: string;
  workItemDeliverableId?: string;
}

export interface WorkRequestDeliverableSectionGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  workRequestDeliverableId?: string;
  sequenceOrder?: number;
  workRequestId?: string;
  workRequestItemId?: string;
  itemActionCode?: string;
  title?: string;
  comments?: string;
  markdown?: string;
  workItemDeliverableId?: string;
  workItemDeliverable?: WorkItemDeliverableGETData;
}

export interface WorkRequestDeliverableSectionGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: WorkRequestDeliverableSectionGETData[];
  filter?: BaseCriteria;
}

export interface WorkRequestDeliverableSectionCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  workRequestDeliverableId?: string;
  sequenceOrder?: number;
  workRequestId?: string;
  workRequestItemId?: string;
  itemActionCode?: string;
  title?: string;
  workItemDeliverableId?: string;
}

export interface WorkRequestDeliverableSectionPUTData {
  workRequestDeliverableId?: string;
  sequenceOrder: number;
  workRequestId: string;
  workRequestItemId?: string;
  itemActionCode: string;
  title: string;
  comments?: string;
  markdown?: string;
  workItemDeliverableId?: string;
}

export interface WorkRequestDeliverablePOSTData {
  workRequestId: string;
  nameText: string;
  comments?: string;
  markdown?: string;
  pmfileGroupId?: string;
  currentStateCode: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
}

export interface WorkRequestDeliverableGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  workRequestId?: string;
  nameText?: string;
  comments?: string;
  markdown?: string;
  pmfileGroupId?: string;
  currentStateCode?: string;
  currentStateTransitionId?: string;
  sections?: WorkRequestDeliverableSectionGETData[];
  currentState?: EntityStateGETData;
  currentStateTransition?: EntityStateTransitionGETData;
}

export interface WorkRequestDeliverableGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: WorkRequestDeliverableGETData[];
  filter?: BaseCriteria;
}

export interface WorkRequestDeliverableCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  workRequestId?: string;
  nameText?: string;
  pmfileGroupId?: string;
  currentStateCode?: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
}

export interface WorkRequestDeliverablePUTData {
  workRequestId: string;
  nameText: string;
  comments?: string;
  markdown?: string;
  pmfileGroupId?: string;
  currentStateCode: string;
  currentStateTransitionId?: string;
  currentStateDateEntered?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  clientFacingMessageId?: string;
  internalFacingMessageId?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  clientFacingMessageId?: string;
  internalFacingMessageId?: string;
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
  clientFacingMessageId?: string;
  internalFacingMessageId?: string;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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

export interface UtilmonLoginYearmoPOSTData {
  yearmo: string;
  orgId: string;
  realmName: string;
  orgName: string;
  eventTypeCode: string;
  userEmail: string;
  applicationCode: string;
  subSystemCode?: string;
  numLogins: number;
  year: number;
  month: number;
  quarter: number;
  dateYearMo: string;
}

export interface UtilmonLoginYearmoGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  yearmo?: string;
  orgId?: string;
  realmName?: string;
  orgName?: string;
  eventTypeCode?: string;
  userEmail?: string;
  applicationCode?: string;
  subSystemCode?: string;
  numLogins?: number;
  year?: number;
  month?: number;
  quarter?: number;
}

export interface UtilmonLoginYearmoGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: UtilmonLoginYearmoGETData[];
  filter?: BaseCriteria;
}

export interface UtilmonLoginYearmoCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  yearmo?: string;
  orgId?: string;
  realmName?: string;
  orgName?: string;
  eventTypeCode?: string;
  userEmail?: string;
  applicationCode?: string;
  subSystemCode?: string;
  numLogins?: number;
  year?: number;
  month?: number;
  quarter?: number;
  dateYearMo?: string;
  yearStart?: number;
  yearEnd?: number;
  quarterStart?: number;
  quarterEnd?: number;
}

export interface UtilmonLoginYearmoPUTData {
  yearmo: string;
  orgId: string;
  realmName: string;
  orgName: string;
  eventTypeCode: string;
  userEmail: string;
  applicationCode: string;
  subSystemCode?: string;
  numLogins: number;
  year: number;
  month: number;
  quarter: number;
  dateYearMo: string;
}

export interface UtilmonReportingEventPOSTData {
  subject: string;
  eventTypeCode: string;
  realmName: string;
  applicationCode: string;
  subSystemCode?: string;
  referenceId?: string;
  referenceGroupId?: string;
  eventData?: string;
  parentEntityId?: string;
  parentEntityName?: string;
  parentEntityType?: string;
  extraInfoJson?: string;
  durationMs: number;
  dateEventFinished: string;
}

export interface UtilmonReportingEventGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  subject?: string;
  eventTypeCode?: string;
  realmName?: string;
  applicationCode?: string;
  subSystemCode?: string;
  referenceId?: string;
  referenceGroupId?: string;
  eventData?: string;
  parentEntityId?: string;
  parentEntityName?: string;
  parentEntityType?: string;
  extraInfoJson?: string;
  durationMs?: number;
}

export interface UtilmonReportingEventGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: UtilmonReportingEventGETData[];
  filter?: BaseCriteria;
}

export interface UtilmonReportingEventCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  subject?: string;
  eventTypeCode?: string;
  realmName?: string;
  applicationCode?: string;
  subSystemCode?: string;
  referenceId?: string;
  referenceGroupId?: string;
  eventData?: string;
  parentEntityId?: string;
  parentEntityName?: string;
  parentEntityType?: string;
  extraInfoJson?: string;
  durationMs?: number;
  dateEventFinished?: string;
}

export interface UtilmonReportingEventPUTData {
  subject: string;
  eventTypeCode: string;
  realmName: string;
  applicationCode: string;
  subSystemCode?: string;
  referenceId?: string;
  referenceGroupId?: string;
  eventData?: string;
  parentEntityId?: string;
  parentEntityName?: string;
  parentEntityType?: string;
  extraInfoJson?: string;
  durationMs: number;
  dateEventFinished: string;
}

export interface UtilmonStatPOSTData {
  yearmo: string;
  quarter: number;
  orgId?: string;
  orgName: string;
  dataValue0: string;
  applicationCode: string;
  subSystemCode?: string;
  eventTypeCode: string;
  realmName: string;
  year: number;
  month: number;
  dateYearMo: string;
  amount: number;
  count: number;
}

export interface UtilmonStatGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  yearmo?: string;
  quarter?: number;
  orgId?: string;
  orgName?: string;
  dataValue0?: string;
  applicationCode?: string;
  subSystemCode?: string;
  eventTypeCode?: string;
  realmName?: string;
  year?: number;
  month?: number;
  amount?: number;
  count?: number;
}

export interface UtilmonStatGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: UtilmonStatGETData[];
  filter?: BaseCriteria;
}

export interface UtilmonStatCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  yearmo?: string;
  quarter?: number;
  orgId?: string;
  orgName?: string;
  dataValue0?: string;
  applicationCode?: string;
  subSystemCode?: string;
  eventTypeCode?: string;
  realmName?: string;
  year?: number;
  month?: number;
  dateYearMo?: string;
  amount?: number;
  count?: number;
}

export interface UtilmonStatPUTData {
  yearmo: string;
  quarter: number;
  orgId?: string;
  orgName: string;
  dataValue0: string;
  applicationCode: string;
  subSystemCode?: string;
  eventTypeCode: string;
  realmName: string;
  year: number;
  month: number;
  dateYearMo: string;
  amount: number;
  count: number;
}

export interface PersonalStatementActivityLogPOSTData {
  userProfileId: string;
  personalStatmentId: string;
  nameText: string;
  actionCode?: string;
  notes?: string;
  documentId: string;
  documentEntityType: string;
  documentName: string;
  extendedJson?: string;
}

export interface PersonalStatementActivityLogGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  entityDisplayName?: string;
  entityType?: string;
  userProfileId?: string;
  personalStatmentId?: string;
  nameText?: string;
  actionCode?: string;
  notes?: string;
  documentId?: string;
  documentEntityType?: string;
  documentName?: string;
  extendedJson?: string;
}

export interface PersonalStatementActivityLogGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: PersonalStatementActivityLogGETData[];
  filter?: BaseCriteria;
}

export interface PersonalStatementActivityLogCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  idsToExclude?: string[];
  searchByText?: string;
  maxResults?: number;
  orderByHint?: string;
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
  userProfileId?: string;
  personalStatmentId?: string;
  nameText?: string;
  actionCode?: string;
  documentId?: string;
  documentEntityType?: string;
  documentName?: string;
}

export interface PersonalStatementActivityLogPUTData {
  userProfileId: string;
  personalStatmentId: string;
  nameText: string;
  actionCode?: string;
  notes?: string;
  documentId: string;
  documentEntityType: string;
  documentName: string;
  extendedJson?: string;
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
  entityDisplayName?: string;
  entityType?: string;
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
  progress?: PersonalStatementProgressPOJO;
}

export interface PersonalStatementGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: PersonalStatementGETData[];
  filter?: BaseCriteria;
}

export interface PersonalStatementProgressPOJO {
  progressReport?: string;
  progressPercent?: number;
  progressSummary?: string;
  nextStep?: string;
  completedResume?: boolean;
  completedSignupForJob?: boolean;
  completedSignupForCourse?: boolean;
  showedInterestForJob?: boolean;
  showedInterestForCourse?: boolean;
  contactedProvider?: boolean;
  acceptedForCourse?: boolean;
  acceptedForJob?: boolean;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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
  entityDisplayName?: string;
  entityType?: string;
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
  optionalDataHint?: string;
  predicateHint?: CriteriaPredicateHint;
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

export interface CreateTicketSetupUIData {
  data?: CreateTicketPOSTData;
  queuesMenu?: MenuControlDataList;
  workRequestTypesMenu?: MenuControlDataList;
  currentUserProfile?: HcclUserProfileGETData;
}

export interface PostmarkWebhookResponse {
  success?: boolean;
  messageId?: string;
  messages?: SimpleMessageList;
}

export interface OnboardResponse {
  messages?: SimpleMessageList;
  loginUrl?: string;
}

export interface OnboardFamilyMemberPOSTData {
  messageHandle?: string;
  userName?: string;
  counselorId?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  firstName: string;
  lastName?: string;
  familyMemberCode: string;
  onboardConfirm?: string;
  cellPhoneSmsEnabled?: boolean;
  willingToReceiveEmail?: boolean;
  willingToReceiveSms?: boolean;
}

export interface OnboardFamilyPOSTData {
  organizationId: string;
  initialPassword?: string;
  family?: FamilyUnitPOSTData;
  parents?: OnboardFamilyMemberPOSTData[];
  students?: OnboardFamilyMemberPOSTData[];
}

export interface OnboardInvitedResponse {
  messages?: SimpleMessageList;
  dashboardUrl?: string;
}

export interface ConsentRequestPOSTData {
  contractVersionId?: string;
  agreeValue?: string;
  consenting?: boolean;
}

export interface MultiConsentRequestPOSTData {
  consents?: ConsentRequestPOSTData[];
}

export interface OnboardInvitedRequest {
  inviteId?: string;
  messageHandle?: string;
  userName?: string;
  firstName: string;
  lastName?: string;
  password?: string;
  acceptNotes?: string;
  consents: MultiConsentRequestPOSTData;
}

export interface OnboardOrgUserPOSTData {
  organizationCode: string;
  firstName?: string;
  lastName?: string;
  messageHandle?: string;
  userName?: string;
  emailAddress?: string;
  cellPhone?: string;
  initialPassword?: string;
  roles?: string[];
  profileTypeCode?: string;
}

export interface OnboardStudentPOSTData {
  schoolId?: string;
  counselorId?: string;
  consents: MultiConsentRequestPOSTData;
  orgUserData: OnboardOrgUserPOSTData;
}

export interface OnboardInvitedUIData {
  messages?: SimpleMessageList;
  invite?: HcclUserInviteGETData;
  languageCodesSb?: MenuControlDataList;
  schoolsSb?: MenuControlDataList;
  schoolId?: string;
  mapSchoolIdToCounselorSb?: any;
}

export interface ConsentRequestGETData {
  title?: string;
  consentMessage?: string;
  mdContents?: string;
  contractVersionId?: string;
  contract?: PContractVersionGETData;
}

export interface MultiConsentRequestGETData {
  contracts?: ConsentRequestGETData[];
}

export interface OnboardStudentUIData {
  schoolSelectData?: MenuControlDataList;
  consents?: MultiConsentRequestGETData;
}

export interface HcclUserContextGETData {
  currentUserProfileId: string;
  messages: SimpleMessageList;
  currentUserProfile: HcclUserProfileGETData;
  userProfileMenu: MenuControlDataList;
  dashQueues: WorkQueueGETData[];
}

export interface HcclOrgSetupData {
  profileTypeMenu: MenuControlDataList;
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

export interface OnboardAddressResponse {
  messages?: SimpleMessageList;
  hcclAddr?: HcclAddrGETData;
}

export interface OnboardCatalogEntryResponse {
  messages?: SimpleMessageList;
  catalogEntry?: CatalogEntryGETData;
}

export interface HtmImagePOSTData {
  alt?: string;
  imageUrl?: string;
}

export interface OnboardCatalogEntryPOSTData {
  catalogEntry: CatalogEntryPOSTData;
  catalogEntryImage?: HtmImagePOSTData;
  signupBehaviorCode?: string;
  webPageContents?: string;
  aiGenerationNotes?: string;
  mdSignupInstructions?: string;
}

export interface OnboardCatalogEntryUIHelper {
  messages?: SimpleMessageList;
  catalogEntryData?: OnboardCatalogEntryPOSTData;
  catalogTypeSb?: MenuControlDataList;
  catalogSb?: MenuControlDataList;
}

export interface OnboardCatalogEntryPOJO {
  name?: string;
  url?: string;
  notes?: string;
  catalogEntryTypeCode?: string;
  organizationId?: string;
  catalogId?: string;
  usingYamlCache?: boolean;
}

export interface OnboardOrganizationResponse {
  messages?: SimpleMessageList;
  organization?: HcclOrganizationGETData;
  invite?: HcclUserInviteGETData;
}

export interface OnboardOrganizationPOSTData {
  providerOrganization: HcclOrganizationPOSTData;
  orgTypeCode?: string;
  creatingAdminUser?: boolean;
  creatingCatalog?: boolean;
  providerUser?: OnboardOrgUserPOSTData;
  companyLogo?: HtmImagePOSTData;
  companyMissionStatementImage?: HtmImagePOSTData;
  inviteUserEmail?: string;
  inviteUserWelcomeNotes?: string;
}

export interface OnboardOrganizationUIHelper {
  orgData?: OnboardOrganizationPOSTData;
  orgPolicySb?: MenuControlDataList;
}

export interface OnboardOrganizationPOJO {
  name?: string;
  url?: string;
  notes?: string;
  entryUrls?: string[];
  profileTypeCode?: string;
  orgTypeCode?: string;
  usingYamlCache?: boolean;
}

export interface SimpleMapEntry {
  color?: string;
  title?: string;
  text?: string;
  linkUrl?: string;
  linkText?: string;
  geolocationLatitude?: number;
  geolocationLongitude?: number;
  entityType?: string;
  entityId?: string;
  calculatingUrl?: boolean;
  showingLink?: boolean;
}

export interface SimpleMapEntryResponse {
  messages?: SimpleMessageList;
  searchResults?: SimpleMapEntry[];
}

export interface CreateActivationCodeResponse {
  messages?: SimpleMessageList;
  activationCode?: string;
}

export interface CreateActivationCodeRequest {
  addingAsChild?: boolean;
  addingAsParent?: boolean;
  emailAddress?: string;
}

export interface SignupBehavior {
  code?: string;
  name?: string;
  requiringResume?: boolean;
  consentingToSendTranscript?: boolean;
  ackingProviderContact?: boolean;
}

export interface SignupUIData {
  signupPacket?: CatalogEntrySignupPacketGETData;
  catalogEntryInterest?: CatalogEntryInterestGETData;
  resumeSelectData?: MenuControlDataList;
  signupBehavior?: SignupBehavior;
  providerOrganizationName?: string;
  messages?: SimpleMessageList;
  workRequestId?: string;
  stateTransitionLog?: StateTransitionLogGETData;
}

export interface SignupVerdictUIData {
  catalogEntryInterest?: CatalogEntryInterestGETData;
  signupBehavior?: SignupBehavior;
  messages?: SimpleMessageList;
  studentUserProfile?: HcclUserProfileGETData;
  workRequestId?: string;
  stateTransitionLog?: StateTransitionLogGETData;
  personalStatementResume?: PersonalStatementResumeGETData;
}

export interface FamilyParentDashUIGETData {
  family?: FamilyUnitGETData;
}

export interface PMessageUIGETData {
  message?: PMessageGETData;
  unreadEnties?: PMessageEntryGETData[];
  unreadEntryCount?: number;
}

export interface PersonalStatementUIGETData {
  messages?: PMessageUIGETData[];
  personalStatement?: PersonalStatementGETData;
  personalStatementResumeCriteria?: PersonalStatementResumeCriteria;
  catalogEntryInterestCriteria?: CatalogEntryInterestCriteria;
}

export interface ManageSignupPacketUIData {
  signupBehaviors?: SignupBehavior[];
  signupBehaviorSelectData?: MenuControlDataList;
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

export interface ResumeAddEntriesPOSTData {
  entryIds?: string[];
}

export interface ResumeReorderEntriesPOSTData {
  entryIds?: string[];
}

export interface ResumeUpdateEntryPOSTData {
  entryJson?: string;
}

export interface HandleActivationCodeResponse {
  messages?: SimpleMessageList;
  family?: FamilyUnitGETData;
}

export interface UserFeedGETData {
  feedEntries?: FeedEntryInstanceGETData[];
}

export interface StudentDashUIGETData {
  profileTypeCode?: string;
  student?: HcclUserProfileGETData;
  family?: FamilyUnitGETData;
  messages?: PMessageUIGETData[];
  teams?: HcclTeamGETData[];
  personalStatements?: PersonalStatementGETData[];
  advisoryTeamPMessageId?: string;
  feedProfile?: CatalogEntryFeedProfileGETData;
  guidanceTeam?: HcclTeamGETData;
  school?: HcclOrganizationGETData;
}

export interface StudentProfileUIGETData {
  profileTypeCode?: string;
  student?: HcclUserProfileGETData;
  family?: FamilyUnitGETData;
  guidanceTeam?: HcclTeamGETData;
  school?: HcclOrganizationGETData;
  feedProfile?: CatalogEntryFeedProfileGETData;
  mapEntry?: SimpleMapEntry;
}

export interface UtilStatGraphDataPOJO {
  id?: string;
  name?: string;
  businessCode?: string;
  catalogEntry?: CatalogEntryGETData;
  swWorkProduct?: SwWorkProductGETData;
  dataPoints?: number[];
  mapDatapoints?: any;
  countTotal?: number;
}

export interface UtilmonStatGraphPOJO {
  quarters?: string[];
  data?: UtilStatGraphDataPOJO[];
  mapData?: any;
}

export interface UtilmonStatGraphCriteria {
  topCount?: number;
  yearmoCrit?: UtilmonLoginYearmoCriteria;
  graphDataCode?: string;
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
  cancelledState?: boolean;
  closedState?: boolean;
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
  stateMachineName?: string;
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

export interface SignupVerdictPOSTData {
  workRequestId?: string;
  workRequestItemId?: string;
  verdictAccepted?: boolean;
  comments?: string;
}

export interface WorkItemFormRequest {
  op?: string;
  context?: WorkItemFormContext;
  actionFormData?: any;
}

export interface WorkRequestUIControllerGETData {
  workRequest?: WorkRequestGETData;
  workRequestItem?: WorkRequestItemGETData;
  deliverable?: WorkRequestDeliverableGETData;
  showingItemsList?: boolean;
  showingCreateWorkItem?: boolean;
  createWorkItemActionMenu?: MenuControlDataList;
  messages?: SimpleMessageList;
}

export interface GenericFormUI {
  formUiType?: string;
  title?: string;
  description?: string;
  schema?: any;
  ui?: any;
  data?: any;
}

export interface SLEntityActionUiDefnResponse {
  ui?: GenericFormUI;
  checkMessages?: SimpleMessageList;
  actionMessages?: SimpleMessageList;
  responseData?: any;
  status?: number;
  message?: string;
}

export interface SLEntityActionUiDefnRequest {
  id?: string;
  entityActionCode?: string;
  formData?: any;
}

export interface SLControlProperty {
  name?: string;
  value?: any;
  comment?: string;
}

export interface SLFeature {
  property?: string;
  name?: string;
  enabled?: boolean;
  status?: string;
  statusInfo?: string;
  ctrlProps?: any;
  messages?: SimpleMessageList;
}

export interface SLFeatures {
  features?: SLFeature[];
}

export interface MergeFieldInsertImage {
  classUrl?: string;
  webUrl?: string;
  imageFileName?: string;
  barcodeType?: string;
  barcodeText?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageUnit?: number;
  byteArray?: string;
}

export interface MergePayloadData {
  datasets?: any;
  images?: any;
  watermarks?: any;
}

export interface MergePayloadRequest {
  payloadName?: string;
  entityTuples?: EntityTuple[];
  datasets?: string[];
  languageCode?: string;
  usingJsonData?: boolean;
  aspect?: string;
}

export interface MergePayloadResponse {
  messages?: SimpleMessageList;
  request?: MergePayloadRequest;
  payloads?: MergePayloadData[];
}

export interface MergeWatermark {
  watermarkText?: string;
}

export interface SLEntityDataset {
  name?: string;
  descrip?: string;
  status?: number;
}

export interface SLEntityDefnGETData {
  entityName?: string;
  supportingMergeData?: boolean;
  datasets?: SLEntityDataset[];
}

export interface SLServiceMetaData {
  serviceCode?: string;
  descrip?: string;
  entities?: SLEntityDefnGETData[];
}

