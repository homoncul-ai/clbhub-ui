// HCCL Service Interfaces based on Swagger Documentation

// Common interfaces
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

export interface LoggerConfigurationData {
  loggerName: string;
  loggerLevel: 'OFF' | 'FATAL' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE' | 'ALL';
}

export interface LoggerConfigurationPUTData {
  loggerConfigurationData: LoggerConfigurationData[];
}

// Job Definitions
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

export interface JobDefinitionGETData {
  id?: string;
  name?: string;
  description?: string;
  status?: boolean;
  cronSchedule?: string;
  reserveBatchSize?: number;
  purgeEventLogDays?: number;
  purgeProcessLogDays?: number;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

// Service Event Logs
export interface ServiceEventLogCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  eventName?: string;
  eventReference?: string;
  eventStatus?: string;
  startDate?: string;
  endDate?: string;
  serviceName?: string;
}

export interface ServiceEventLogGETData {
  id?: string;
  eventName?: string;
  eventReference?: string;
  eventStatus?: string;
  eventData?: string;
  serviceName?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

// Catalog
export interface CatalogEntryPOSTData {
  name: string;
  description?: string;
  catalogId?: string;
  catalogEntryTagIds?: string[];
}

export interface CatalogEntryPUTData {
  name: string;
  description?: string;
  catalogId?: string;
  catalogEntryTagIds?: string[];
}

export interface CatalogEntryGETData {
  id?: string;
  name?: string;
  description?: string;
  catalogId?: string;
  catalogEntryTagIds?: string[];
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface CatalogEntryCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  catalogId?: string;
  omitCatalogEntryId?: string;
}

// Experience
export interface ExperiencePOSTData {
  name: string;
  description?: string;
  experienceTypeId?: string;
  experienceLocationIds?: string[];
  experienceRegRuleIds?: string[];
}

export interface ExperiencePUTData {
  name: string;
  description?: string;
  experienceTypeId?: string;
  experienceLocationIds?: string[];
  experienceRegRuleIds?: string[];
}

export interface ExperienceGETData {
  id?: string;
  name?: string;
  description?: string;
  experienceTypeId?: string;
  experienceLocationIds?: string[];
  experienceRegRuleIds?: string[];
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface ExperienceCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  experienceTypeId?: string;
  omitExperienceId?: string;
}

// Provider
export interface ProviderPOSTData {
  name: string;
  description?: string;
  providerTypeRefId?: string;
  providerUserIds?: string[];
}

export interface ProviderPUTData {
  name: string;
  description?: string;
  providerTypeRefId?: string;
  providerUserIds?: string[];
}

export interface ProviderGETData {
  id?: string;
  name?: string;
  description?: string;
  providerTypeRefId?: string;
  providerUserIds?: string[];
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface ProviderCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  providerTypeRefId?: string;
  omitProviderId?: string;
}

// Provider Request
export interface ProviderRequestPOSTData {
  name: string;
  description?: string;
  providerRequestTypeRefId?: string;
  providerId?: string;
}

export interface ProviderRequestPUTData {
  name: string;
  description?: string;
  providerRequestTypeRefId?: string;
  providerId?: string;
}

export interface ProviderRequestGETData {
  id?: string;
  name?: string;
  description?: string;
  providerRequestTypeRefId?: string;
  providerId?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface ProviderRequestCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  providerRequestTypeRefId?: string;
  providerId?: string;
  omitProviderRequestId?: string;
}

// State Machine
export interface StateTransitionLogPOSTData {
  stateMachineId: string;
  fromState?: string;
  toState: string;
  transitionReason?: string;
  entityId?: string;
  entityType?: string;
}

export interface StateTransitionLogPUTData {
  stateMachineId: string;
  fromState?: string;
  toState: string;
  transitionReason?: string;
  entityId?: string;
  entityType?: string;
}

export interface StateTransitionLogGETData {
  id?: string;
  stateMachineId?: string;
  fromState?: string;
  toState?: string;
  transitionReason?: string;
  entityId?: string;
  entityType?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface StateTransitionLogCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  stateMachineId?: string;
  entityId?: string;
  entityType?: string;
  omitStateTransitionLogId?: string;
}

// Taxonomy
export interface TaxonomyEntryPOSTData {
  name: string;
  description?: string;
  taxonomyLevelId?: string;
  parentTaxonomyEntryId?: string;
}

export interface TaxonomyEntryPUTData {
  name: string;
  description?: string;
  taxonomyLevelId?: string;
  parentTaxonomyEntryId?: string;
}

export interface TaxonomyEntryGETData {
  id?: string;
  name?: string;
  description?: string;
  taxonomyLevelId?: string;
  parentTaxonomyEntryId?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface TaxonomyEntryCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  taxonomyLevelId?: string;
  parentTaxonomyEntryId?: string;
  omitTaxonomyEntryId?: string;
}

// Teams
export interface HcclOrganizationPOSTData {
  name: string;
  description?: string;
  organizationTypeId?: string;
  parentOrganizationId?: string;
}

export interface HcclOrganizationPUTData {
  name: string;
  description?: string;
  organizationTypeId?: string;
  parentOrganizationId?: string;
}

export interface HcclOrganizationGETData {
  id?: string;
  name?: string;
  description?: string;
  organizationTypeId?: string;
  parentOrganizationId?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface HcclOrganizationCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  organizationTypeId?: string;
  parentOrganizationId?: string;
  omitOrganizationId?: string;
}

// Generic response interfaces
export interface PagedResponse<T> {
  content?: T[];
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
}

export interface QueryResponse<T> {
  data?: T[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
} 