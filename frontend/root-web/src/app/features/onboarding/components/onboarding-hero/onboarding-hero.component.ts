import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';

interface HeroContent {
  eyebrow: string;
  title: string;
  text: string;
}

const HERO_CONTENT: HeroContent[] = [
  {
    eyebrow: 'Bem-vindo',
    title: 'Sua jornada começa aqui',
    text: 'Vamos conhecer um pouco sobre você para oferecer uma experiência feita do seu jeito.',
  },
  {
    eyebrow: 'Sobre você',
    title: 'Conhecer você faz toda a diferença',
    text: 'Essas informações nos ajudam a sugerir atividades mais adequadas para o seu momento.',
  },
  {
    eyebrow: 'Objetivo',
    title: 'Cada objetivo é único',
    text: 'Seja ganhar força, criar hábitos ou simplesmente cuidar da saúde, vamos acompanhar você nessa jornada.',
  },
  {
    eyebrow: 'Rotina',
    title: 'No seu tempo',
    text: 'A vida muda todos os dias. Por isso, nossas recomendações acompanham o seu ritmo.',
  },
  {
    eyebrow: 'Pronto!',
    title: 'Está tudo quase preparado',
    text: 'Finalize o cadastro e descubra suas primeiras recomendações personalizadas.',
  }
];

@Component({
  selector: 'app-root-onboarding-hero',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './onboarding-hero.component.html',
  styleUrl: './onboarding-hero.component.scss',
})
export class OnboardingHeroComponent {
  readonly stepIndex = input.required<number>();

  protected readonly content = computed(() => HERO_CONTENT[this.stepIndex()] ?? HERO_CONTENT[0]);
}
