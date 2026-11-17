import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { WorkoutExerciseDraft } from '../../workout.service';

@Component({
  selector: 'app-workout-import',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './workout-import.component.html',
  styleUrl: './workout-import.component.scss',
})
export class WorkoutImportComponent {
  readonly mode = input.required<'message' | 'photo'>();
  readonly exercisesImported = output<WorkoutExerciseDraft[]>();
  readonly referenceImageChanged = output<string | null>();

  protected readonly message = signal('');
  protected readonly image = signal<string | null>(null);
  protected readonly status = signal('');
  protected readonly progress = signal(0);
  protected readonly isProcessing = signal(false);
  protected readonly error = signal('');

  protected onMessageInput(event: Event): void {
    this.message.set((event.target as HTMLTextAreaElement).value);
  }

  protected importMessage(): void {
    const result = this.parseExercises(this.message());
    this.exercisesImported.emit(result.exercises);
    this.status.set(
      result.exercises.length
        ? `${result.exercises.length} exercícios identificados. Revise e ajuste cada campo antes de salvar.${result.skipped ? ` ${result.skipped} linha(s) fora do padrão foram ignoradas.` : ''}`
        : 'Não identifiquei exercícios no padrão. Use uma linha por exercício: Supino — 3×8.',
    );
  }

  protected async onImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.error.set('');
    this.status.set('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.error.set('Selecione uma foto JPG, PNG ou WebP.');
      input.value = '';
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      this.error.set('A foto precisa ter até 8 MB.');
      input.value = '';
      return;
    }

    this.isProcessing.set(true);
    this.progress.set(0);
    this.status.set('Preparando a foto para leitura…');
    try {
      const compressedImage = await this.compressImage(file);
      this.image.set(compressedImage);
      this.referenceImageChanged.emit(compressedImage);
      await this.extractText(compressedImage);
    } catch {
      this.error.set('Não consegui ler essa foto. Tente uma imagem mais nítida ou cole a mensagem do professor.');
      this.status.set('');
    } finally {
      this.isProcessing.set(false);
      input.value = '';
    }
  }

  protected removeImage(): void {
    this.image.set(null);
    this.referenceImageChanged.emit(null);
    this.error.set('');
    this.status.set('Foto removida da ficha.');
  }

  private async extractText(imageData: string): Promise<void> {
    this.status.set('Baixando o modelo de leitura em português…');
    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker('por', 1, {
      logger: (message) => {
        if (message.status === 'recognizing text') {
          this.progress.set(Math.round(message.progress * 100));
          this.status.set(`Lendo texto da foto… ${this.progress()}%`);
        } else if (message.status) {
          this.status.set('Preparando leitura em português…');
        }
      },
    });

    try {
      const { data } = await worker.recognize(imageData);
      const parsed = this.parseExercises(data.text);
      this.exercisesImported.emit(parsed.exercises);
      this.status.set(
        parsed.exercises.length
          ? `${parsed.exercises.length} exercícios extraídos. Revise os nomes, séries e repetições antes de salvar.${parsed.skipped ? ` ${parsed.skipped} linha(s) não seguiram o padrão e foram ignoradas.` : ''}`
          : 'A foto foi lida, mas não encontrei linhas no padrão. Você pode corrigir o texto colando a mensagem do professor.',
      );
    } finally {
      await worker.terminate();
    }
  }

  private parseExercises(text: string): { exercises: WorkoutExerciseDraft[]; skipped: number } {
    const lines = text
      .replace(/\r/g, '\n')
      .split(/[\n;]+/)
      .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim())
      .filter((line) => line && !/^(treino|ficha|exercícios?)(\s+[a-z0-9]+)?\s*:?$/i.test(line));
    const exercises: WorkoutExerciseDraft[] = [];

    for (const line of lines) {
      const match = line.match(/^(.+?)(?:\s*[—–-]\s*|\s+)(\d{1,2})\s*(?:x|×|\*)\s*(\d{1,3})\b.*$/i);
      if (!match) continue;
      const name = match[1].trim().replace(/[.,:;]+$/, '');
      const sets = Number(match[2]);
      const repetitions = Number(match[3]);
      if (!name || sets < 1 || repetitions < 1) continue;

      exercises.push({
        id: crypto.randomUUID(),
        name: name.slice(0, 80),
        sets: Math.min(sets, 20),
        repetitions: Math.min(repetitions, 100),
        restSeconds: 60,
      });
      if (exercises.length === 20) break;
    }

    return { exercises, skipped: Math.max(0, lines.length - exercises.length) };
  }

  private compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, 1200 / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext('2d');
        URL.revokeObjectURL(objectUrl);
        if (!context) return reject(new Error('canvas-unavailable'));

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        let quality = 0.82;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        while (dataUrl.length > 650_000 && quality > 0.5) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        if (dataUrl.length > 650_000) return reject(new Error('image-too-large'));
        resolve(dataUrl);
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('invalid-image'));
      };
      image.src = objectUrl;
    });
  }
}
