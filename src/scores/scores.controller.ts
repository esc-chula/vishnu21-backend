import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresHistoryDTO } from './types/scores.dto';

@Controller('scores')
export class ScoresController {
  constructor(private scoresService: ScoresService) {}

  @Patch('/:id')
  updateScores(@Param('id') id: string, @Body() payload: ScoresHistoryDTO) {
    return this.scoresService.updateScores(id, payload);
  }
}
