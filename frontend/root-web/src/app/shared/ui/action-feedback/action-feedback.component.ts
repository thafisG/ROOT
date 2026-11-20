import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActionFeedbackService } from '../../../core/feedback/action-feedback.service';

@Component({
  selector: 'app-root-action-feedback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './action-feedback.component.html',
  styleUrl: './action-feedback.component.scss',
})
export class ActionFeedbackComponent {
  private readonly feedbackService = inject(ActionFeedbackService);

  protected readonly current = this.feedbackService.current;

  protected dismiss(): void {
    this.feedbackService.dismiss();
  }
}
