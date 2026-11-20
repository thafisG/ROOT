import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ActionFeedbackComponent } from './shared/ui/action-feedback/action-feedback.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ActionFeedbackComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
