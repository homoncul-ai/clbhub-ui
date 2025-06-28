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

// Base Criteria interface for SearchResults
export interface BaseCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
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

// Missing interfaces from Swagger
export interface JobProcessLogPOSTData {
  name: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  errorMessage?: string;
}

export interface JobProcessLogPUTData {
  name: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  errorMessage?: string;
}

export interface JobProcessLogGETData {
  id?: string;
  name?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  errorMessage?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface ServiceEventLogPOSTData {
  eventName: string;
  eventReference?: string;
  eventStatus?: string;
  eventData?: string;
  serviceName?: string;
}

export interface ServiceEventLogPUTData {
  eventName: string;
  eventReference?: string;
  eventStatus?: string;
  eventData?: string;
  serviceName?: string;
}

// Catalog interfaces
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

export interface CatalogGETData {
  id?: string;
  name?: string;
  description?: string;
  status?: boolean;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface CatalogCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  status?: boolean;
  omitCatalogId?: string;
}

export interface CatalogEntryTagPOSTData {
  name: string;
  description?: string;
}

export interface CatalogEntryTagPUTData {
  name: string;
  description?: string;
}

export interface CatalogEntryTagGETData {
  id?: string;
  name?: string;
  description?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface CatalogEntryTagCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  omitCatalogEntryTagId?: string;
}

export interface CatalogSearchPOSTData {
  name: string;
  description?: string;
  catalogId?: string;
  searchCriteria?: string;
}

export interface CatalogSearchPUTData {
  name: string;
  description?: string;
  catalogId?: string;
  searchCriteria?: string;
}

export interface CatalogSearchGETData {
  id?: string;
  name?: string;
  description?: string;
  catalogId?: string;
  searchCriteria?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface CatalogSearchCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  catalogId?: string;
  omitCatalogSearchId?: string;
}

export interface CatalogSearchResultPOSTData {
  name: string;
  description?: string;
  catalogSearchId?: string;
  resultData?: string;
}

export interface CatalogSearchResultPUTData {
  name: string;
  description?: string;
  catalogSearchId?: string;
  resultData?: string;
}

export interface CatalogSearchResultGETData {
  id?: string;
  name?: string;
  description?: string;
  catalogSearchId?: string;
  resultData?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface CatalogSearchResultCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  catalogSearchId?: string;
  omitCatalogSearchResultId?: string;
}

export interface CatalogSearchResultEntryPOSTData {
  catalogSearchResultId: string;
  catalogEntryId: string;
  catalogId: string;
  comments?: string;
}

export interface CatalogSearchResultEntryPUTData {
  catalogSearchResultId: string;
  catalogEntryId: string;
  catalogId: string;
  comments?: string;
}

export interface CatalogSearchResultEntryGETData {
  id?: string;
  catalogSearchResultId?: string;
  catalogEntryId?: string;
  catalogId?: string;
  comments?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface CatalogSearchResultEntryCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  status?: boolean;
  catalogSearchResultId?: string;
  catalogEntryId?: string;
  catalogId?: string;
  comments?: string;
}

export interface CatalogTagRefPOSTData {
  catalogId: string;
  catalogEntryTagId: string;
}

export interface CatalogTagRefPUTData {
  catalogId: string;
  catalogEntryTagId: string;
}

export interface CatalogTagRefGETData {
  id?: string;
  catalogId?: string;
  catalogEntryTagId?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface CatalogTagRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  catalogId?: string;
  catalogEntryTagId?: string;
  omitCatalogTagRefId?: string;
}

// Experience interfaces
export interface ExperienceTypePOSTData {
  name: string;
  description?: string;
}

export interface ExperienceTypePUTData {
  name: string;
  description?: string;
}

export interface ExperienceTypeGETData {
  id?: string;
  name?: string;
  description?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface ExperienceTypeCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  omitExperienceTypeId?: string;
}

export interface ExperienceLocationPOSTData {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface ExperienceLocationPUTData {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface ExperienceLocationGETData {
  id?: string;
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface ExperienceLocationCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  city?: string;
  state?: string;
  country?: string;
  omitExperienceLocationId?: string;
}

export interface ExperienceRegRulePOSTData {
  name: string;
  description?: string;
  ruleType?: string;
  ruleValue?: string;
}

export interface ExperienceRegRulePUTData {
  name: string;
  description?: string;
  ruleType?: string;
  ruleValue?: string;
}

export interface ExperienceRegRuleGETData {
  id?: string;
  name?: string;
  description?: string;
  ruleType?: string;
  ruleValue?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface ExperienceRegRuleCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  ruleType?: string;
  omitExperienceRegRuleId?: string;
}

// Integration EDU interfaces
export interface CLSchoolPOSTData {
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

export interface CLSchoolPUTData {
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

export interface CLSchoolCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  status?: boolean;
  businessCode?: string;
  available?: number;
  dataOriginCode?: string;
  organizationName?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  districtCode?: string;
  maxResults?: number;
}

export interface CLSchoolGETDataSearchResults {
  searchResults?: CLSchoolGETData[];
  pagingInfo?: DCPageData;
  filter?: BaseCriteria;
  empty?: boolean;
}

export interface CLStudentPOSTData {
  name: string;
  businessCode: string;
  available: number;
  dataOriginCode?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  firstName: string;
  lastName: string;
  schoolId: string;
}

export interface CLStudentPUTData {
  name: string;
  businessCode: string;
  available: number;
  dataOriginCode?: string;
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
  name?: string;
  businessCode?: string;
  available?: number;
  dataOriginCode?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  firstName?: string;
  lastName?: string;
  schoolId?: string;
}

export interface CLStudentCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  searchByText?: string;
  maxResults?: number;
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
}

export interface CLStudentGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CLStudentGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

// CLGuidance interfaces
export interface CLGuidancePOSTData {
  name: string;
  businessCode: string;
  available: number;
  firstName: string;
  lastName: string;
  schoolId: string;
  dataOriginCode?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  externalUserId?: string;
  externalUserEntityType?: string;
  externalUserName?: string;
}

export interface CLGuidancePUTData {
  name: string;
  businessCode: string;
  available: number;
  firstName: string;
  lastName: string;
  schoolId: string;
  dataOriginCode?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  externalUserId?: string;
  externalUserEntityType?: string;
  externalUserName?: string;
}

export interface CLGuidanceGETData {
  id?: string;
  name?: string;
  businessCode?: string;
  available?: number;
  firstName?: string;
  lastName?: string;
  schoolId?: string;
  dataOriginCode?: string;
  userEmail?: string;
  cellPhoneNumber?: string;
  workPhoneNumber?: string;
  externalUserId?: string;
  externalUserEntityType?: string;
  externalUserName?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface CLGuidanceCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  businessCode?: string;
  firstName?: string;
  lastName?: string;
  schoolId?: string;
  userEmail?: string;
  available?: number;
  omitCLGuidanceId?: string;
}

export interface CLGuidanceGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CLGuidanceGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

// CLCourse interfaces
export interface CLCoursePOSTData {
  name: string;
  businessCode: string;
  available: number;
  courseCode: string;
  courseName: string;
  schoolId: string;
  dataOriginCode?: string;
  description?: string;
  credits?: number;
  externalCourseId?: string;
  externalCourseEntityType?: string;
  externalCourseName?: string;
}

export interface CLCoursePUTData {
  name: string;
  businessCode: string;
  available: number;
  courseCode: string;
  courseName: string;
  schoolId: string;
  dataOriginCode?: string;
  description?: string;
  credits?: number;
  externalCourseId?: string;
  externalCourseEntityType?: string;
  externalCourseName?: string;
}

export interface CLCourseGETData {
  id?: string;
  name?: string;
  businessCode?: string;
  available?: number;
  courseCode?: string;
  courseName?: string;
  schoolId?: string;
  dataOriginCode?: string;
  description?: string;
  credits?: number;
  externalCourseId?: string;
  externalCourseEntityType?: string;
  externalCourseName?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface CLCourseCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  businessCode?: string;
  courseCode?: string;
  courseName?: string;
  schoolId?: string;
  description?: string;
  credits?: number;
  available?: number;
  omitCLCourseId?: string;
}

export interface CLCourseGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CLCourseGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

// Provider interfaces
export interface ProviderTypeRefPOSTData {
  name: string;
  description?: string;
}

export interface ProviderTypeRefPUTData {
  name: string;
  description?: string;
}

export interface ProviderTypeRefGETData {
  id?: string;
  name?: string;
  description?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface ProviderTypeRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  omitProviderTypeRefId?: string;
}

export interface ProviderUserPOSTData {
  name: string;
  description?: string;
  providerId?: string;
  userId?: string;
  role?: string;
}

export interface ProviderUserPUTData {
  name: string;
  description?: string;
  providerId?: string;
  userId?: string;
  role?: string;
}

export interface ProviderUserGETData {
  id?: string;
  name?: string;
  description?: string;
  providerId?: string;
  userId?: string;
  role?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface ProviderUserCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  providerId?: string;
  userId?: string;
  role?: string;
  omitProviderUserId?: string;
}

// Provider Request interfaces
export interface ProviderRequestTypeRefPOSTData {
  name: string;
  description?: string;
}

export interface ProviderRequestTypeRefPUTData {
  name: string;
  description?: string;
}

export interface ProviderRequestTypeRefGETData {
  id?: string;
  name?: string;
  description?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface ProviderRequestTypeRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  omitProviderRequestTypeRefId?: string;
}

// Taxonomy interfaces
export interface TaxonomyPOSTData {
  name: string;
  description?: string;
}

export interface TaxonomyPUTData {
  name: string;
  description?: string;
}

export interface TaxonomyGETData {
  id?: string;
  name?: string;
  description?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface TaxonomyCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  omitTaxonomyId?: string;
}

export interface TaxonomyLevelPOSTData {
  name: string;
  description?: string;
  taxonomyId?: string;
  parentTaxonomyLevelId?: string;
  levelOrder?: number;
}

export interface TaxonomyLevelPUTData {
  name: string;
  description?: string;
  taxonomyId?: string;
  parentTaxonomyLevelId?: string;
  levelOrder?: number;
}

export interface TaxonomyLevelGETData {
  id?: string;
  name?: string;
  description?: string;
  taxonomyId?: string;
  parentTaxonomyLevelId?: string;
  levelOrder?: number;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface TaxonomyLevelCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  taxonomyId?: string;
  parentTaxonomyLevelId?: string;
  omitTaxonomyLevelId?: string;
}

// Teams interfaces
export interface HcclOrganizationTypeRefPOSTData {
  name: string;
  description?: string;
}

export interface HcclOrganizationTypeRefPUTData {
  name: string;
  description?: string;
}

export interface HcclOrganizationTypeRefGETData {
  id?: string;
  name?: string;
  description?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface HcclOrganizationTypeRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  omitOrganizationTypeId?: string;
}

export interface HcclTeamPOSTData {
  name: string;
  description?: string;
  organizationId?: string;
  teamTypeId?: string;
}

export interface HcclTeamPUTData {
  name: string;
  description?: string;
  organizationId?: string;
  teamTypeId?: string;
}

export interface HcclTeamGETData {
  id?: string;
  name?: string;
  description?: string;
  organizationId?: string;
  teamTypeId?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface HcclTeamCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  organizationId?: string;
  teamTypeId?: string;
  omitTeamId?: string;
}

export interface HcclTeamMemberPOSTData {
  name: string;
  description?: string;
  teamId?: string;
  userId?: string;
  roleId?: string;
}

export interface HcclTeamMemberPUTData {
  name: string;
  description?: string;
  teamId?: string;
  userId?: string;
  roleId?: string;
}

export interface HcclTeamMemberGETData {
  id?: string;
  name?: string;
  description?: string;
  teamId?: string;
  userId?: string;
  roleId?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface HcclTeamMemberCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  teamId?: string;
  userId?: string;
  roleId?: string;
  omitTeamMemberId?: string;
}

export interface HcclTeamMemberRolePOSTData {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface HcclTeamMemberRolePUTData {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface HcclTeamMemberRoleGETData {
  id?: string;
  name?: string;
  description?: string;
  permissions?: string[];
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface HcclTeamMemberRoleCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  omitTeamMemberRoleId?: string;
}

export interface HcclTeamLogPOSTData {
  name: string;
  description?: string;
  teamId?: string;
  action?: string;
  details?: string;
}

export interface HcclTeamLogPUTData {
  name: string;
  description?: string;
  teamId?: string;
  action?: string;
  details?: string;
}

export interface HcclTeamLogGETData {
  id?: string;
  name?: string;
  description?: string;
  teamId?: string;
  action?: string;
  details?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface HcclTeamLogCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  teamId?: string;
  action?: string;
  omitTeamLogId?: string;
}

// Add missing interfaces that are referenced in swagger
export interface Reference {
  name?: string;
  link?: string;
}

export interface DateGETData {
  date?: string;
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

export interface DCPageData {
  totalRows?: number;
  pageNumber?: number;
  pageSize?: number;
  startingOffset?: number;
  totalPages?: number;
  endingOffset?: number;
  links?: string[];
}

// HcclUserProfile interfaces
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
}

// SearchResults interfaces
export interface HcclUserProfileGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: HcclUserProfileGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

export interface CatalogGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: CatalogGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

export interface HcclOrganizationGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: HcclOrganizationGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

// Missing interfaces from swagger
export interface HcclUserProfileCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  searchByText?: string;
  maxResults?: number;
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
  omitHcclUserProfileId?: string;
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

export interface HcclUserPUTData {
  name: string;
  businessCode: string;
  description: string;
  externalUserId?: string;
  externalUserEntityType?: string;
  externalUserName?: string;
  available: number;
}

export interface HcclUserCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  status?: boolean;
  businessCode?: string;
  description?: string;
  externalUserId?: string;
  externalUserEntityType?: string;
  externalUserName?: string;
  available?: number;
  omitHcclUserId?: string;
}

export interface HcclUserGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: HcclUserGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
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

// Simple Message interfaces for promote students functionality
export interface SimpleMessage {
  messageCode?: string;
  message?: string;
  severity?: number;
  exceptionMessage?: string;
  referenceCode?: string;
}

export interface SimpleMessageList {
  messages?: SimpleMessage[];
}

export interface SimpleRestActionContext {
  // Empty object as per swagger
}

export interface SimpleRestActionResponse {
  context?: SimpleRestActionContext;
  messages?: SimpleMessageList;
  data?: any;
  actionFormData?: { [key: string]: any };
  mapFormElements?: { [key: string]: any };
}

// Missing SearchResults interfaces
export interface HcclTeamGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: HcclTeamGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

export interface HcclTeamMemberGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: HcclTeamMemberGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

export interface HcclTeamMemberRoleGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: HcclTeamMemberRoleGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

export interface HcclTeamLogGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: HcclTeamLogGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

export interface HcclOrganizationTypeRefGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: HcclOrganizationTypeRefGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

// Missing interfaces for other entities
export interface TeamMemberRoleRefPOSTData {
  name: string;
  description?: string;
  available: number;
}

export interface TeamMemberRoleRefPUTData {
  name: string;
  description?: string;
  available: number;
}

export interface TeamMemberRoleRefGETData {
  id?: string;
  name?: string;
  description?: string;
  available?: number;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface TeamMemberRoleRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  available?: number;
  omitTeamMemberRoleRefId?: string;
}

export interface TeamMemberRoleRefGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: TeamMemberRoleRefGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

export interface TeamTypeMemberRoleRefPOSTData {
  name: string;
  description?: string;
  available: number;
}

export interface TeamTypeMemberRoleRefPUTData {
  name: string;
  description?: string;
  available: number;
}

export interface TeamTypeMemberRoleRefGETData {
  id?: string;
  name?: string;
  description?: string;
  available?: number;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface TeamTypeMemberRoleRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  available?: number;
  omitTeamTypeMemberRoleRefId?: string;
}

export interface TeamTypeMemberRoleRefGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: TeamTypeMemberRoleRefGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

export interface TeamTypeRefPOSTData {
  name: string;
  description?: string;
  available: number;
}

export interface TeamTypeRefPUTData {
  name: string;
  description?: string;
  available: number;
}

export interface TeamTypeRefGETData {
  id?: string;
  name?: string;
  description?: string;
  available?: number;
  createdDate?: string;
  lastModifiedDate?: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface TeamTypeRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  available?: number;
  omitTeamTypeRefId?: string;
}

export interface TeamTypeRefGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: TeamTypeRefGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

// WorkQueue interfaces for tixui endpoints
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

export interface WorkQueuePUTData extends WorkQueuePOSTData {}

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
}

export interface WorkQueueCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  status?: boolean;
  businessCode?: string;
  description?: string;
  prefixCode?: string;
  workQueueTypeId?: string;
  workQueueTeamId?: string;
  available?: number;
  organizationId?: string;
  externalQueue?: number;
  maxResults?: number;
}

export interface WorkQueueGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: WorkQueueGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

export interface WorkQueueTypeRefPOSTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
}

export interface WorkQueueTypeRefPUTData {
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

export interface WorkQueueTypeRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  available?: number;
  omitWorkQueueTypeRefId?: string;
}

export interface WorkQueueTypeRefGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: WorkQueueTypeRefGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

// MenuControl interfaces for tixui endpoints
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

// CreateTicketPOSTData interface for tixui endpoints
export interface CreateTicketPOSTData {
  advocateUserProfileId?: string;
  studentUserProfileId?: string;
  queueId?: string;
  workRequestTypeId?: string;
  title?: string;
  rawText?: string;
}

// CreateTicketSetupUIData interface for tixui endpoints
export interface CreateTicketSetupUIData {
  data?: CreateTicketPOSTData;
  queuesMenu?: MenuControlDataList;
  workRequestTypesMenu?: MenuControlDataList;
  currentUserProfile?: HcclUserProfileGETData;
}

// WorkRequest interfaces for tixui endpoints
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
  createdByTeamId?: string;
  createdByUserId?: string;
  acceptedByTeamId?: string;
  acceptedByUserId?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  parentWorkRequestItemId?: string;
}

export interface WorkRequestGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: WorkRequestGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

// --- TIX/TIXUI INTERFACES (additions/updates below) ---

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

export interface WorkRequestItemCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  status?: boolean;
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
  maxResults?: number;
}

export interface WorkRequestItemGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: WorkRequestItemGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

export interface WorkRequestLogPOSTData {
  workRequestId: string;
  workRequestItemId?: string;
  logTypeCode: string;
  logText: string;
  jsonData?: string;
  createdByUserId?: string;
  createdByTeamId?: string;
}

export interface WorkRequestLogPUTData {
  workRequestId: string;
  workRequestItemId?: string;
  logTypeCode: string;
  logText: string;
  jsonData?: string;
  createdByUserId?: string;
  createdByTeamId?: string;
}

export interface WorkRequestLogGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  workRequestId?: string;
  workRequestItemId?: string;
  logTypeCode?: string;
  logText?: string;
  jsonData?: string;
  createdByUserId?: string;
  createdByTeamId?: string;
}

export interface WorkRequestLogCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  workRequestId?: string;
  workRequestItemId?: string;
  logTypeCode?: string;
  createdByUserId?: string;
  createdByTeamId?: string;
  maxResults?: number;
}

export interface WorkRequestLogGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: WorkRequestLogGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

export interface WorkRequestRoutingReasonPOSTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
}

export interface WorkRequestRoutingReasonPUTData {
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

export interface WorkRequestRoutingReasonCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  maxResults?: number;
}

export interface WorkRequestRoutingReasonGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: WorkRequestRoutingReasonGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

export interface WorkRequestPOSTData {
  name: string;
  businessCode: string;
  description: string;
  workRequestTypeId: string;
  workQueueId: string;
  createdByTeamId?: string;
  createdByUserId?: string;
  acceptedByTeamId?: string;
  acceptedByUserId?: string;
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
  workQueueId: string;
  createdByTeamId?: string;
  createdByUserId?: string;
  acceptedByTeamId?: string;
  acceptedByUserId?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  parentWorkRequestItemId?: string;
}

export interface WorkRequestCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  status?: boolean;
  businessCode?: string;
  description?: string;
  workRequestTypeId?: string;
  currentStateCode?: string;
  workQueueId?: string;
  createdByTeamId?: string;
  createdByUserId?: string;
  acceptedByTeamId?: string;
  acceptedByUserId?: string;
  subjectEntityId?: string;
  subjectEntityType?: string;
  subjectEntityName?: string;
  parentWorkRequestItemId?: string;
  maxResults?: number;
}

export interface WorkRequestTeamPOSTData {
  workRequestId: string;
  teamId: string;
  roleCode: string;
  available: number;
}

export interface WorkRequestTeamPUTData {
  workRequestId: string;
  teamId: string;
  roleCode: string;
  available: number;
}

export interface WorkRequestTeamGETData {
  id?: string;
  createdByInfo?: Reference;
  dateCreated?: DateGETData;
  lastUpdatedByInfo?: Reference;
  dateLastUpdated?: DateGETData;
  workRequestId?: string;
  teamId?: string;
  roleCode?: string;
  available?: number;
}

export interface WorkRequestTeamCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  workRequestId?: string;
  teamId?: string;
  roleCode?: string;
  available?: number;
  maxResults?: number;
}

export interface WorkRequestTeamGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: WorkRequestTeamGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
}

export interface WorkRequestTypeRefPOSTData {
  name: string;
  businessCode: string;
  description: string;
  available: number;
}

export interface WorkRequestTypeRefPUTData {
  name: string;
  businessCode: string;
  description: string;
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
  available?: number;
}

export interface WorkRequestTypeRefCriteria {
  pageNumber?: number;
  pageSize?: number;
  isPaging?: boolean;
  ids?: string[];
  name?: string;
  businessCode?: string;
  description?: string;
  available?: number;
  maxResults?: number;
}

export interface WorkRequestTypeRefGETDataSearchResults {
  pagingInfo?: DCPageData;
  searchResults?: WorkRequestTypeRefGETData[];
  filter?: BaseCriteria;
  empty?: boolean;
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

export interface HcclUserContextGETData {
  currentUserProfileId?: string;
  messages?: SimpleMessageList;
  currentUserProfile?: HcclUserProfileGETData;
  userProfileMenu?: MenuControlDataList;
} 