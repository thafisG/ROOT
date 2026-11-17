import { Injectable, signal } from '@angular/core';

export interface ActionFeedback {
  id: number;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ActionFeedbackService {
  private nextId = 0;
  private timeout: ReturnType<typeof setTimeout> | undefined;
  private readonly _current = signal<ActionFeedback | null>(null);

  readonly current = this._current.asReadonly();

  show(message: string, durationMs = 5000): void {
    if (this.timeout) clearTimeout(this.timeout);

    const feedback = { id: ++this.nextId, message };
    this._current.set(feedback);
    this.timeout = setTimeout(() => {
      if (this._current()?.id === feedback.id) this._current.set(null);
    }, durationMs);
  }

  dismiss(): void {
    if (this.timeout) clearTimeout(this.timeout);
    this._current.set(null);
  }
}
