import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-root-coaching',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './coaching.component.html',
  styleUrl: './coaching.component.scss',
})
export class CoachingComponent {}
