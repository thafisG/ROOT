import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-root-placeholder-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './placeholder-page.component.html',
  styleUrl: './placeholder-page.component.scss',
})
export class PlaceholderPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly title = toSignal(
    this.route.data.pipe(map((data) => (data['title'] as string) ?? 'Em breve')),
    { initialValue: 'Em breve' },
  );

  protected readonly description = toSignal(
    this.route.data.pipe(map((data) => (data['description'] as string) ?? '')),
    { initialValue: '' },
  );
}
