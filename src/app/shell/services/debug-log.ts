import { BehaviorSubject } from 'rxjs';

/**
 * Dependency-free debug log buffer used by the on-screen debug console.
 *
 * Kept separate from HcclContextService so low-level modules (e.g. the REST
 * request caller) can append to it without creating a circular dependency.
 * HcclContextService re-exposes this API as static members.
 */
export class DebugLog {
  /** When true, the on-screen debug console is shown at the bottom of the app. */
  static enabled = false;

  /** Maximum number of debug lines retained in the buffer. */
  private static readonly MAX_LINES = 500;

  /** In-memory buffer of debug messages. */
  static messages: string[] = [];

  /** Stream of debug messages so the UI can react to appends. */
  static messages$ = new BehaviorSubject<string[]>(DebugLog.messages);

  /** Stream so the debug console can show/hide when config loads. */
  static enabled$ = new BehaviorSubject<boolean>(DebugLog.enabled);

  static setEnabled(value: boolean): void {
    DebugLog.enabled = value;
    DebugLog.enabled$.next(value);
  }

  /** Append a timestamped line of text to the debug console. */
  static append(text: string): void {
    const timestamp = new Date().toLocaleTimeString();
    DebugLog.messages.push(`[${timestamp}] ${text}`);

    const overflow = DebugLog.messages.length - DebugLog.MAX_LINES;
    if (overflow > 0) {
      DebugLog.messages.splice(0, overflow);
    }

    DebugLog.messages$.next(DebugLog.messages);
  }

  /** Clear all debug messages. */
  static clear(): void {
    DebugLog.messages.length = 0;
    DebugLog.messages$.next(DebugLog.messages);
  }
}
