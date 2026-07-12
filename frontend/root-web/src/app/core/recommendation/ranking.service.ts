import { Injectable } from '@angular/core';
import { CategoryScore } from './score.service';

@Injectable({ providedIn: 'root' })
export class RankingService {
  rank(scores: CategoryScore[]): CategoryScore[] {
    return [...scores].sort((a, b) => b.needScore - a.needScore);
  }
}
