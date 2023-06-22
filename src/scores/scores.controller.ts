import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresHistoryDTO } from './types/scores.dto';

@Controller('scores')
export class ScoresController {
  constructor(private scoresService: ScoresService) {}

  @Get()
  getScore() {
    return this.scoresService.getScore();
  }

  @Get('/:houseName')
  getScoreByHouseName(@Param('houseName') houseName: string) {
    return this.scoresService.getScoreByHouseName(houseName);
  }

  @Patch('/:id')
  updateScores(@Param('id') id: string, @Body() payload: ScoresHistoryDTO) {
    return this.scoresService.updateScores(id, payload);
  }

  @Delete('/:_oid')
  deleteScoreHistory(@Param('_oid') _oid: string) {
      return this.scoresService.deleteScoreHistory(_oid);
  }
}
