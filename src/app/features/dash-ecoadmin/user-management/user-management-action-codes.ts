import { SimpleMessageList } from '../../../restsvc/common-request-service.model';

/**
 * Mirror of the backend `ManageUserActionCodes.java` string constants.
 * These exact values are sent as `ManageUserRequest.actionCode`.
 */
export const ManageUserActionCodes = {
  ENABLE_USER: 'EnableUser',
  DISABLE_USER: 'DisableUser',
  DELETE_USER_COMPLETELY: 'DeleteUserCompletely',
  UPDATE_PERSONAL_INFO: 'UpdatePersonalInfo',
  TRIGGER_UPDATE_PASSWORD: 'TriggerUpdatePassword',
  CHANGE_EMAIL: 'ChangeEmail',
} as const;

export type ManageUserActionCode =
  (typeof ManageUserActionCodes)[keyof typeof ManageUserActionCodes];

/**
 * Message severity convention used across the app:
 * 1 = error, 2 = warning, 3 = info, 4 = success.
 */
export const MESSAGE_SEVERITY = {
  ERROR: 1,
  WARNING: 2,
  INFO: 3,
  SUCCESS: 4,
} as const;

/**
 * The spec references `rsp.messages.hasErrors()`, but `SimpleMessageList` is a
 * plain interface with no methods. This helper provides the equivalent check.
 */
export function hasErrors(messages?: SimpleMessageList): boolean {
  return (
    messages?.messages?.some(
      (m) => (m.severity ?? MESSAGE_SEVERITY.INFO) === MESSAGE_SEVERITY.ERROR,
    ) ?? false
  );
}

/** True when the backend reported warnings (e.g. partial success). */
export function hasWarnings(messages?: SimpleMessageList): boolean {
  return (
    messages?.messages?.some(
      (m) => (m.severity ?? MESSAGE_SEVERITY.INFO) === MESSAGE_SEVERITY.WARNING,
    ) ?? false
  );
}

/**
 * Extract a human-readable string from a SimpleMessageList for display.
 */
export function firstMessageText(messages?: SimpleMessageList): string {
  const list = messages?.messages ?? [];
  if (list.length === 0) {
    return '';
  }
  return list
    .map((m) => m.message || m.messageCode || '')
    .filter((t) => t.length > 0)
    .join(' ');
}
