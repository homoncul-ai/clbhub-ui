import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { CommonRequestServiceCaller, CommonServiceRequest } from './common-request-service.model';

// ============================================================================
// INTERFACES FOR /currency/healthchecks ENDPOINTS
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
// INTERFACES FOR /currency/debug/loggers ENDPOINTS
// ============================================================================

export interface LoggerConfigurationData {
  loggerName: string;
  loggerLevel: 'OFF' | 'FATAL' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE' | 'ALL';
}

export interface LoggerConfigurationPUTData {
  loggerConfigurationData: LoggerConfigurationData[];
}

export interface LoggersQueryParams {
  pageNumber?: number;
  pageSize?: number;
}

// ============================================================================
// INTERFACES FOR /currency/job-definitions ENDPOINTS
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
  ids?: string[]; // UUID array
  name?: string;
  status?: boolean;
  omitJobDefinitionId?: string; // UUID
}

export interface JobDefinitionQueryParams {
  status?: boolean;
  name?: string;
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
}

export interface JobDefinitionByIdParams {
  id: string; // UUID
  isError?: boolean;
}

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

export interface JobProcessLogQueryParams {
  name?: string;
  dateCreated?: string; // date-time format
  isNotCompleted?: boolean;
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
}

export interface JobProcessLogByIdParams {
  'definition-id': string; // UUID
  id: string; // UUID
}

export interface JobProcessLogCompletedParams {
  'definition-id': string; // UUID
  'log-id': string; // UUID
}

export interface JobProcessLogGETData {
  id?: string; // UUID
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

// ============================================================================
// INTERFACES FOR /currency/service-event-logs ENDPOINTS
// ============================================================================

export interface ServiceEventLogPOSTData {
  referenceId: string; // UUID
  entityName: string;
  eventName: string;
  eventJson?: string;
  nextEventName?: string;
  displayName?: string;
  groupId?: string; // UUID
  dateDue?: string; // date-time format
  applicationCode?: string;
  parentId?: string; // UUID
}

export interface ServiceEventLogPUTData {
  referenceId: string; // UUID
  entityName: string;
  eventName: string;
  eventJson?: string;
  nextEventName?: string;
  displayName?: string;
  groupId?: string; // UUID
  dateDue?: string; // date-time format
  applicationCode?: string;
  parentId?: string; // UUID
}

export interface ServiceEventLogCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[]; // UUID array
  entityName?: string;
  eventName?: string;
  eventNames?: string[];
  statuses?: number[];
  groupId?: string; // UUID
  referenceId?: string; // UUID
  dateLogStarts?: string; // date-time format
  dateLogEnds?: string; // date-time format
  dateDue?: string; // date-time format
  applicationCode?: string;
  parentId?: string; // UUID
  createdByName?: string;
}

export interface DocumentEventLogGETData {
  id?: string; // UUID
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  serviceEventLog?: RelationshipGETData;
  applicationId?: string; // UUID
  fileName?: string;
  fileSize?: number;
  mediaType?: string;
  aboutPath?: string;
  fileUuidReference?: string; // UUID
  dateUploaded?: DateGETData;
}

export interface ServiceEventLogGETData {
  id?: string; // UUID
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  referenceId?: string; // UUID
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
  groupId?: string; // UUID
  dateDue?: DateGETData;
  applicationCode?: string;
  parentId?: string; // UUID
  documentEventLogs?: DocumentEventLogGETData[];
}

export interface ServiceEventLogByIdParams {
  id: string; // UUID
}

export interface ServiceEventLogDownloadParams {
  'service-event-log-id': string; // UUID
}

// ============================================================================
// INTERFACES FOR /currency/admin/rateperiods ENDPOINTS
// ============================================================================

// Request interfaces
export interface RatePeriodsQueryParams {
  datePeriodStarts?: string; // date-time format
  fetchRates?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface RatePeriodByIdParams {
  id: string; // UUID
  fetchRates?: boolean;
}

export interface RatePeriodCurrentParams {
  fetchRates?: boolean;
}

// Request body interfaces
export interface CurrencyExchangeRatePeriodPOSTData {
  datePeriodStarts: string; // date-time format
  datePeriodEnds: string; // date-time format
  exchangeRates: ExchangeRateCurrencyData[];
  currentPeriod: boolean;
  businessCode: string;
  ratePeriodCodeToCopy?: string;
}

export interface ExchangeRateCurrencyData {
  currencyISONumericCodeOrId: string;
  exchangeRate: number;
}

export interface CurrencyExchangeRatePeriodPUTData {
  datePeriodStarts: string; // date-time format
  datePeriodEnds: string; // date-time format
  exchangeRates: ExchangeRateCurrencyData[];
  currentPeriod: boolean;
  businessCode: string;
}

// Response interfaces
export interface DateGETData {
  date?: string; // date-time format
  dateMilliseconds?: number;
  dateFormat?: string;
  formattedDate?: string;
  formattedDateTime?: string;
  year?: number;
  month?: number;
  dayOfMonth?: number;
  monthName?: string;
  convertToLocalTimezone?: boolean;
}

export interface Reference {
  name?: string;
  link?: string; // URI format
}

export interface RelationshipGETData {
  id?: string; // UUID
  type?: string;
  name?: string;
  icon?: string;
  description?: string;
  link?: string; // URI format
  aboutPath?: string;
}

export interface CurrencyExchangeRateGETData {
  id?: string; // UUID
  ratePeriod?: RelationshipGETData;
  currency?: RelationshipGETData;
  exchangeRate?: string;
  exchangeRateAmt?: number;
  exchangeCurrency?: RelationshipGETData;
}

export interface CurrencyExchangeRatePeriodGETData {
  id?: string; // UUID
  datePeriodStarts?: DateGETData;
  datePeriodEnds?: DateGETData;
  exchangeRates?: CurrencyExchangeRateGETData[];
  currentPeriod?: boolean;
  businessCode?: string;
}

// ============================================================================
// INTERFACES FOR /currency/admin/currency-formats ENDPOINTS
// ============================================================================

export interface CurrencyFormatPOSTData {
  name: string;
  businessCode?: string;
  description?: string;
  alignment: string;
  allowNegativeNumbers?: boolean;
  allowZeros: boolean;
  decimalSign: string;
  precision: number;
  prefix?: string;
  suffix?: string;
  thousandsDelimiter: string;
  status?: boolean;
  formatExpr?: string;
}

export interface CurrencyFormatPUTData {
  name: string;
  businessCode?: string;
  description?: string;
  alignment: string;
  allowNegativeNumbers?: boolean;
  allowZeros: boolean;
  decimalSign: string;
  precision: number;
  prefix?: string;
  suffix?: string;
  thousandsDelimiter: string;
  status?: boolean;
  formatExpr?: string;
}

export interface CurrencyFormatQueryParams {
  name?: string;
  status?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface CurrencyFormatByIdParams {
  id: string; // UUID
}

export interface CurrencyFormatGETData {
  id?: string; // UUID
  name?: string;
  businessCode?: string;
  description?: string;
  alignment?: string;
  allowNegativeNumbers?: boolean;
  allowZeros?: boolean;
  precision?: number;
  prefix?: string;
  suffix?: string;
  decimalSign?: string;
  thousandsDelimiter?: string;
  status?: boolean;
  formatExpr?: string;
}

// ============================================================================
// INTERFACES FOR /currency/admin/currencies ENDPOINTS
// ============================================================================

export interface CurrencyPOSTData {
  currencyISOCode: string;
  currencyISONumericCode: number;
  description?: string;
  currencyFormat?: RelationshipPOSTData;
  statusName?: 'Active' | 'Inactive';
  currencyIcon?: string;
}

export interface CurrencyPUTData {
  currencyISOCode: string;
  currencyISONumericCode: number;
  description?: string;
  currencyFormat?: RelationshipPOSTData;
  statusName?: 'Active' | 'Inactive';
  currencyIcon?: string;
}

export interface RelationshipPOSTData {
  id: string; // UUID
  type?: string;
}

export interface CurrencyQueryParams {
  currencyISOCode?: string;
  statusName?: string;
  fetchFormat?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface CurrencyByIdParams {
  id: string; // UUID
  fetchFormat?: boolean;
}

export interface CurrencyOptionsQueryParams {
  currencyISOCode?: string;
}

export interface CurrencyCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[]; // UUID array
  currencyISOCode?: string;
  status?: boolean;
  fetchFormat?: boolean;
}

export interface CurrencyGETData {
  id?: string; // UUID
  currencyISOCode?: string;
  currencyISONumericCode?: number;
  description?: string;
  statusName?: string;
  currencyFormatGETData?: CurrencyFormatGETData;
  currencyIcon?: string;
}

export interface CurrencyHelperViewGETData {
  id?: string; // UUID
  tenantId?: string; // UUID
  baseCurrencyISOCode?: string;
  currencyISOCode?: string;
  currencyActive?: boolean;
  currentRatePeriod?: boolean;
  ratePeriodCode?: string;
  exchangeRate?: number;
  formatExpr?: string;
  formatPrecision?: number;
  thouSep?: string;
  decSep?: string;
  symbol?: string;
}

export interface CurrencyWidgetGETData {
  baseCurrency: CurrencyGETData;
  mapCurrencyRates: { [key: string]: CurrencyHelperViewGETData };
}

export interface CurrencyWidgetQueryParams {
  ratePeriodCode?: string;
  activeCurrenciesOnly?: boolean;
}

export interface ExchangeRateQueryParams {
  currencyISOCode: string;
}

export interface APIExchangeRatePUTData {
  base: string;
  date?: string; // date-time format
  rates: { [key: string]: number };
}

// ============================================================================
// SERVICE CLASS
// ============================================================================

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private readonly baseUrl = 'https://devops2.intigna.io/dc-currency-service';

  constructor(private commonRequestService: CommonRequestServiceCaller) {}

  // ============================================================================
  // /currency/healthchecks ENDPOINTS
  // ============================================================================

  /**
   * Fetches the service manifest created during build
   * GET /currency/healthchecks/servicemanifest
   */
  getCurrentManifest(): Observable<ServiceManifest> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: '/currency/healthchecks/servicemanifest',
      method: 'GET'
    };
    return this.commonRequestService.request<ServiceManifest>(request);
  }

  /**
   * Fetches the Swagger, replacing the host with property file entry
   * GET /currency/healthchecks/internals.json
   */
  getInternals(): Observable<any> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: '/currency/healthchecks/internals.json',
      method: 'GET'
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Fetches the Swagger, replacing the host with property file entry
   * GET /currency/healthchecks/swagger.json
   */
  getSwagger(): Observable<any> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: '/currency/healthchecks/swagger.json',
      method: 'GET'
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Ping the Service
   * GET /currency/healthchecks/ping
   */
  ping(): Observable<void> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: '/currency/healthchecks/ping',
      method: 'GET'
    };
    return this.commonRequestService.request<void>(request);
  }

  /**
   * Runs Health Check on Database and return Results
   * GET /currency/healthchecks/database
   */
  runHealthCheckOnDatabase(): Observable<any> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: '/currency/healthchecks/database',
      method: 'GET'
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Performs a Health Check on the Dependent Applications
   * GET /currency/healthchecks/application
   */
  checkApplicationHealth(): Observable<any> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: '/currency/healthchecks/application',
      method: 'GET'
    };
    return this.commonRequestService.request<any>(request);
  }

  // ============================================================================
  // /currency/debug/loggers ENDPOINTS
  // ============================================================================

  /**
   * Fetches all the Loggers
   * GET /currency/debug/loggers
   */
  getAllLoggers(params?: LoggersQueryParams): Observable<any> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: '/currency/debug/loggers',
      method: 'GET',
      params: params as { [param: string]: string | string[] }
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Updates an existing Logger Level
   * PUT /currency/debug/loggers/changeloggerlevel
   */
  updateLoggerLevel(data: LoggerConfigurationPUTData): Observable<void> {
    const request: CommonServiceRequest<LoggerConfigurationPUTData> = {
      baseUrl: this.baseUrl,
      url: '/currency/debug/loggers/changeloggerlevel',
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.request<void>(request);
  }

  // ============================================================================
  // /currency/job-definitions ENDPOINTS
  // ============================================================================

  /**
   * Fetches all Job Definitions (deprecated)
   * GET /currency/job-definitions
   */
  getJobDefinitions_1(params?: JobDefinitionQueryParams): Observable<any> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: '/currency/job-definitions',
      method: 'GET',
      params: params as { [param: string]: string | string[] }
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Create a new Job Definition
   * POST /currency/job-definitions
   */
  createJobDefinition(data: JobDefinitionPOSTData): Observable<any> {
    const request: CommonServiceRequest<JobDefinitionPOSTData> = {
      baseUrl: this.baseUrl,
      url: '/currency/job-definitions',
      method: 'POST',
      body: data
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Fetches a Job Definition based on its id
   * GET /currency/job-definitions/{id}
   */
  getJobDefinitionById(params: JobDefinitionByIdParams): Observable<any> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: `/currency/job-definitions/${params.id}`,
      method: 'GET',
      params: { isError: params.isError?.toString() } as { [param: string]: string | string[] }
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Updates an existing Job Definition
   * PUT /currency/job-definitions/{id}
   */
  updateJobDefinition(id: string, data: JobDefinitionPUTData): Observable<void> {
    const request: CommonServiceRequest<JobDefinitionPUTData> = {
      baseUrl: this.baseUrl,
      url: `/currency/job-definitions/${id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.request<void>(request);
  }

  /**
   * Deletes an existing Job Definition
   * DELETE /currency/job-definitions/{id}
   */
  deleteJobDefinition(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: `/currency/job-definitions/${id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.request<void>(request);
  }

  /**
   * Fetches all Job Definitions
   * POST /currency/job-definitions/query-job-definitions
   */
  getJobDefinitions(data: JobDefinitionCriteria): Observable<any> {
    const request: CommonServiceRequest<JobDefinitionCriteria> = {
      baseUrl: this.baseUrl,
      url: '/currency/job-definitions/query-job-definitions',
      method: 'POST',
      body: data
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Initializes Job Definitions from Quartz XML File
   * POST /currency/job-definitions/initialize
   */
  initializeJobDefinitions(enableJob?: boolean): Observable<any> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: '/currency/job-definitions/initialize',
      method: 'POST',
      params: { enableJob: enableJob?.toString() } as { [param: string]: string | string[] }
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Fetches all Job Process Logs
   * GET /currency/job-definitions/{definition-id}/process-logs
   */
  getJobProcessLogs(definitionId: string, params?: JobProcessLogQueryParams): Observable<JobProcessLogGETData[]> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: `/currency/job-definitions/${definitionId}/process-logs`,
      method: 'GET',
      params: params as { [param: string]: string | string[] }
    };
    return this.commonRequestService.request<JobProcessLogGETData[]>(request);
  }

  /**
   * Create a new Job Process Log
   * POST /currency/job-definitions/{definition-id}/process-logs
   */
  createJobProcessLog(definitionId: string, data: JobProcessLogPOSTData): Observable<any> {
    const request: CommonServiceRequest<JobProcessLogPOSTData> = {
      baseUrl: this.baseUrl,
      url: `/currency/job-definitions/${definitionId}/process-logs`,
      method: 'POST',
      body: data
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Fetches a Job Process Log based on its id
   * GET /currency/job-definitions/{definition-id}/process-logs/{id}
   */
  getJobProcessLogById(params: JobProcessLogByIdParams): Observable<JobProcessLogGETData> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: `/currency/job-definitions/${params['definition-id']}/process-logs/${params.id}`,
      method: 'GET'
    };
    return this.commonRequestService.request<JobProcessLogGETData>(request);
  }

  /**
   * Updates an existing Job Process Log
   * PUT /currency/job-definitions/{definition-id}/process-logs/{id}
   */
  updateJobProcessLog(params: JobProcessLogByIdParams, data: JobProcessLogPUTData): Observable<void> {
    const request: CommonServiceRequest<JobProcessLogPUTData> = {
      baseUrl: this.baseUrl,
      url: `/currency/job-definitions/${params['definition-id']}/process-logs/${params.id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.request<void>(request);
  }

  /**
   * Deletes an existing Job Process Log
   * DELETE /currency/job-definitions/{definition-id}/process-logs/{id}
   */
  deleteJobProcessLog(params: JobProcessLogByIdParams): Observable<void> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: `/currency/job-definitions/${params['definition-id']}/process-logs/${params.id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.request<void>(request);
  }

  /**
   * Set Job Process Log as Completed
   * PUT /currency/job-definitions/{definition-id}/process-logs/{log-id}/completed
   */
  setJobProcessLogCompleted(params: JobProcessLogCompletedParams): Observable<any> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: `/currency/job-definitions/${params['definition-id']}/process-logs/${params['log-id']}/completed`,
      method: 'PUT'
    };
    return this.commonRequestService.request<any>(request);
  }

  // ============================================================================
  // /currency/service-event-logs ENDPOINTS
  // ============================================================================

  /**
   * Cancels an existing Service Event Log
   * PUT /currency/service-event-logs/{id}/cancel
   */
  cancelServiceEventLog(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: `/currency/service-event-logs/${id}/cancel`,
      method: 'PUT'
    };
    return this.commonRequestService.request<void>(request);
  }

  /**
   * Create a new Service Event Log
   * POST /currency/service-event-logs
   */
  createServiceEventLog(data: ServiceEventLogPOSTData): Observable<any> {
    const request: CommonServiceRequest<ServiceEventLogPOSTData> = {
      baseUrl: this.baseUrl,
      url: '/currency/service-event-logs',
      method: 'POST',
      body: data
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Create multiple service event log entries
   * POST /currency/service-event-logs/events
   */
  createServiceEventLogs(data: ServiceEventLogPOSTData[]): Observable<any> {
    const request: CommonServiceRequest<ServiceEventLogPOSTData[]> = {
      baseUrl: this.baseUrl,
      url: '/currency/service-event-logs/events',
      method: 'POST',
      body: data
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Fetches a Service Event Log based on its id
   * GET /currency/service-event-logs/{id}
   */
  getServiceEventLogById(params: ServiceEventLogByIdParams): Observable<ServiceEventLogGETData> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: `/currency/service-event-logs/${params.id}`,
      method: 'GET'
    };
    return this.commonRequestService.request<ServiceEventLogGETData>(request);
  }

  /**
   * Updates an existing Service Event Log
   * PUT /currency/service-event-logs/{id}
   */
  updateServiceEventLog(id: string, data: ServiceEventLogPUTData): Observable<void> {
    const request: CommonServiceRequest<ServiceEventLogPUTData> = {
      baseUrl: this.baseUrl,
      url: `/currency/service-event-logs/${id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.request<void>(request);
  }

  /**
   * Deletes an existing Service Event Log
   * DELETE /currency/service-event-logs/{id}
   */
  deleteServiceEventLog(id: string): Observable<void> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: `/currency/service-event-logs/${id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.request<void>(request);
  }

  /**
   * Used to download the file
   * GET /currency/service-event-logs/{service-event-log-id}/download-file
   */
  downloadFile(params: ServiceEventLogDownloadParams): Observable<any> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: `/currency/service-event-logs/${params['service-event-log-id']}/download-file`,
      method: 'GET'
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Fetches all Service Event Logs
   * POST /currency/service-event-logs/query-logs
   */
  getServiceEventLogs(data: ServiceEventLogCriteria): Observable<ServiceEventLogGETData[]> {
    const request: CommonServiceRequest<ServiceEventLogCriteria> = {
      baseUrl: this.baseUrl,
      url: '/currency/service-event-logs/query-logs',
      method: 'POST',
      body: data
    };
    return this.commonRequestService.request<ServiceEventLogGETData[]>(request);
  }

  /**
   * Fetches a summary Service Event Logs
   * POST /currency/service-event-logs/query-event-summary-by-name
   */
  queryEventSummaryByDisplayNameAndEventName(data: ServiceEventLogCriteria): Observable<any> {
    const request: CommonServiceRequest<ServiceEventLogCriteria> = {
      baseUrl: this.baseUrl,
      url: '/currency/service-event-logs/query-event-summary-by-name',
      method: 'POST',
      body: data
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Fetches a summary Service Event Logs and groups by event
   * POST /currency/service-event-logs/query-event-summary
   */
  queryEventSummaryByEventName(data: ServiceEventLogCriteria): Observable<any> {
    const request: CommonServiceRequest<ServiceEventLogCriteria> = {
      baseUrl: this.baseUrl,
      url: '/currency/service-event-logs/query-event-summary',
      method: 'POST',
      body: data
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Fetches a summary Service Event Logs and groups by reference
   * POST /currency/service-event-logs/query-event-summary-by-reference
   */
  queryEventSummaryByReferenceIdAndEventName(data: ServiceEventLogCriteria): Observable<any> {
    const request: CommonServiceRequest<ServiceEventLogCriteria> = {
      baseUrl: this.baseUrl,
      url: '/currency/service-event-logs/query-event-summary-by-reference',
      method: 'POST',
      body: data
    };
    return this.commonRequestService.request<any>(request);
  }

  // ============================================================================
  // /currency/admin/rateperiods ENDPOINTS
  // ============================================================================

  /**
   * Fetches a List of Rate Periods
   * GET /currency/admin/rateperiods
   */
  getRatePeriods(params?: RatePeriodsQueryParams): Observable<CurrencyExchangeRatePeriodGETData[]> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: '/currency/admin/rateperiods',
      method: 'GET',
      params: params as { [param: string]: string | string[] }
    };
    return this.commonRequestService.request<CurrencyExchangeRatePeriodGETData[]>(request);
  }

  /**
   * Creates a new Rate Period
   * POST /currency/admin/rateperiods
   */
  createCurrencyRatePeriod_1(data: CurrencyExchangeRatePeriodPOSTData): Observable<any> {
    const request: CommonServiceRequest<CurrencyExchangeRatePeriodPOSTData> = {
      baseUrl: this.baseUrl,
      url: '/currency/admin/rateperiods',
      method: 'POST',
      body: data
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Gets a Rate Period based on its Id
   * GET /currency/admin/rateperiods/{id}
   */
  getCurrencyRatePeriod_1(params: RatePeriodByIdParams): Observable<CurrencyExchangeRatePeriodGETData> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: `/currency/admin/rateperiods/${params.id}`,
      method: 'GET',
      params: { fetchRates: params.fetchRates?.toString() } as { [param: string]: string | string[] }
    };
    return this.commonRequestService.request<CurrencyExchangeRatePeriodGETData>(request);
  }

  /**
   * Updates a Rate Period
   * PUT /currency/admin/rateperiods/{id}
   */
  updateCurrencyRatePeriod_1(id: string, data: CurrencyExchangeRatePeriodPUTData): Observable<void> {
    const request: CommonServiceRequest<CurrencyExchangeRatePeriodPUTData> = {
      baseUrl: this.baseUrl,
      url: `/currency/admin/rateperiods/${id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.request<void>(request);
  }

  /**
   * Deletes a Currency Rate Period
   * DELETE /currency/admin/rateperiods/{id}
   */
  deleteCurrencyRatePeriod_1(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: `/currency/admin/rateperiods/${id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Get Current Rate Period
   * GET /currency/admin/rateperiods/current
   */
  getCurrentRatePeriod_1(params?: RatePeriodCurrentParams): Observable<CurrencyExchangeRatePeriodGETData> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: '/currency/admin/rateperiods/current',
      method: 'GET',
      params: { fetchRates: params?.fetchRates?.toString() } as { [param: string]: string | string[] }
    };
    return this.commonRequestService.request<CurrencyExchangeRatePeriodGETData>(request);
  }

  // ============================================================================
  // /currency/admin/currency-formats ENDPOINTS
  // ============================================================================

  /**
   * Fetches a List of Currency Formats
   * GET /currency/admin/currency-formats
   */
  findCurrencyFormats_1(params?: CurrencyFormatQueryParams): Observable<CurrencyFormatGETData[]> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: '/currency/admin/currency-formats',
      method: 'GET',
      params: params as { [param: string]: string | string[] }
    };
    return this.commonRequestService.request<CurrencyFormatGETData[]>(request);
  }

  /**
   * Creates a new program certification type
   * POST /currency/admin/currency-formats
   */
  createCurrencyFormat_1(data: CurrencyFormatPOSTData[]): Observable<any> {
    const request: CommonServiceRequest<CurrencyFormatPOSTData[]> = {
      baseUrl: this.baseUrl,
      url: '/currency/admin/currency-formats',
      method: 'POST',
      body: data
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Gets a document type category based on its id
   * GET /currency/admin/currency-formats/{id}
   */
  getCurrencyFormat_1(params: CurrencyFormatByIdParams): Observable<CurrencyFormatGETData> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: `/currency/admin/currency-formats/${params.id}`,
      method: 'GET'
    };
    return this.commonRequestService.request<CurrencyFormatGETData>(request);
  }

  /**
   * Updates a currency format
   * PUT /currency/admin/currency-formats/{id}
   */
  updateCurrencyFormat_1(id: string, data: CurrencyFormatPUTData): Observable<void> {
    const request: CommonServiceRequest<CurrencyFormatPUTData> = {
      baseUrl: this.baseUrl,
      url: `/currency/admin/currency-formats/${id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.request<void>(request);
  }

  /**
   * Deletes a currency format
   * DELETE /currency/admin/currency-formats/{id}
   */
  deleteCurrencyFormat_1(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: `/currency/admin/currency-formats/${id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.request<any>(request);
  }

  // ============================================================================
  // /currency/admin/currencies ENDPOINTS
  // ============================================================================

  /**
   * Fetches a list of currencies (deprecated)
   * GET /currency/admin/currencies
   */
  findCurrencies_1(params?: CurrencyQueryParams): Observable<CurrencyGETData[]> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: '/currency/admin/currencies',
      method: 'GET',
      params: params as { [param: string]: string | string[] }
    };
    return this.commonRequestService.request<CurrencyGETData[]>(request);
  }

  /**
   * Creates a new currency
   * POST /currency/admin/currencies
   */
  createCurrency_1(data: CurrencyPOSTData[]): Observable<any> {
    const request: CommonServiceRequest<CurrencyPOSTData[]> = {
      baseUrl: this.baseUrl,
      url: '/currency/admin/currencies',
      method: 'POST',
      body: data
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Gets a currency based on its id
   * GET /currency/admin/currencies/{id}
   */
  getCurrency_1(params: CurrencyByIdParams): Observable<CurrencyGETData> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: `/currency/admin/currencies/${params.id}`,
      method: 'GET',
      params: { fetchFormat: params.fetchFormat?.toString() } as { [param: string]: string | string[] }
    };
    return this.commonRequestService.request<CurrencyGETData>(request);
  }

  /**
   * Updates a currency
   * PUT /currency/admin/currencies/{id}
   */
  updateCurrency_1(id: string, data: CurrencyPUTData): Observable<void> {
    const request: CommonServiceRequest<CurrencyPUTData> = {
      baseUrl: this.baseUrl,
      url: `/currency/admin/currencies/${id}`,
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.request<void>(request);
  }

  /**
   * Deletes a currency
   * DELETE /currency/admin/currencies/{id}
   */
  deleteCurrency_1(id: string): Observable<any> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: `/currency/admin/currencies/${id}`,
      method: 'DELETE'
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Fetches a list of currency options
   * GET /currency/admin/currencies/options
   */
  findCurrencyOptions_1(params?: CurrencyOptionsQueryParams): Observable<any> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: '/currency/admin/currencies/options',
      method: 'GET',
      params: params as { [param: string]: string | string[] }
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Fetches all Currencies
   * POST /currency/admin/query-currencies
   */
  getCurrencies_1(data: CurrencyCriteria): Observable<CurrencyGETData[]> {
    const request: CommonServiceRequest<CurrencyCriteria> = {
      baseUrl: this.baseUrl,
      url: '/currency/admin/query-currencies',
      method: 'POST',
      body: data
    };
    return this.commonRequestService.request<CurrencyGETData[]>(request);
  }

  /**
   * Gets info required for formatting, calculating conversion amounts
   * GET /currency/admin/currencies/widget
   */
  getCurrencyHelper_1(params?: CurrencyWidgetQueryParams): Observable<CurrencyWidgetGETData> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: '/currency/admin/currencies/widget',
      method: 'GET',
      params: params as { [param: string]: string | string[] }
    };
    return this.commonRequestService.request<CurrencyWidgetGETData>(request);
  }

  /**
   * Fetches a List of Rate Periods
   * GET /currency/admin/exchange-rates/latest
   */
  getLatestExchangeRates_1(params: ExchangeRateQueryParams): Observable<any> {
    const request: CommonServiceRequest = {
      baseUrl: this.baseUrl,
      url: '/currency/admin/exchange-rates/latest',
      method: 'GET',
      params: { currencyISOCode: params.currencyISOCode } as { [param: string]: string | string[] }
    };
    return this.commonRequestService.request<any>(request);
  }

  /**
   * Update Latest Exchange Rates
   * PUT /currency/admin/exchange-rates
   */
  updateExchangeRates_1(data: APIExchangeRatePUTData): Observable<any> {
    const request: CommonServiceRequest<APIExchangeRatePUTData> = {
      baseUrl: this.baseUrl,
      url: '/currency/admin/exchange-rates',
      method: 'PUT',
      body: data
    };
    return this.commonRequestService.request<any>(request);
  }

  // ============================================================================
  // /currency/options ENDPOINTS
  // ============================================================================

  /**
   * Fetches all Currency Options
   * POST /currency/options/currencies
   */
  getCurrencyOptions_1(data: CurrencyCriteria): Observable<any> {
    const request: CommonServiceRequest<CurrencyCriteria> = {
      baseUrl: this.baseUrl,
      url: '/currency/options/currencies',
      method: 'POST',
      body: data
    };
    return this.commonRequestService.request<any>(request);
  }

  // ============================================================================
  // LEGACY ENDPOINTS (keeping for backward compatibility)
  // ============================================================================

  /**
   * Creates a new Rate Period
   * POST /currency/admin/rateperiods
   */
  createRatePeriod(data: CurrencyExchangeRatePeriodPOSTData): Observable<CurrencyExchangeRatePeriodGETData> {
    return this.createCurrencyRatePeriod_1(data);
  }

  /**
   * Gets a Rate Period based on its Id
   * GET /currency/admin/rateperiods/{id}
   */
  getRatePeriodById(params: RatePeriodByIdParams): Observable<CurrencyExchangeRatePeriodGETData> {
    return this.getCurrencyRatePeriod_1(params);
  }

  /**
   * Updates a Rate Period
   * PUT /currency/admin/rateperiods/{id}
   */
  updateRatePeriod(id: string, data: CurrencyExchangeRatePeriodPUTData): Observable<void> {
    return this.updateCurrencyRatePeriod_1(id, data);
  }

  /**
   * Deletes a Currency Rate Period
   * DELETE /currency/admin/rateperiods/{id}
   */
  deleteRatePeriod(id: string): Observable<void> {
    return this.deleteCurrencyRatePeriod_1(id);
  }

  /**
   * Get Current Rate Period
   * GET /currency/admin/rateperiods/current
   */
  getCurrentRatePeriod(params?: RatePeriodCurrentParams): Observable<CurrencyExchangeRatePeriodGETData> {
    return this.getCurrentRatePeriod_1(params);
  }
}
