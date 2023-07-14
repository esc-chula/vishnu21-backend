import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresHistoryDTO } from './types/scores.dto';

@Controller('scores')
export class ScoresController {
  constructor(private scoresService: ScoresService) {}

  @Get()
  getScores() {
    return this.scoresService.getScores();
  }

  @Get('/:houseName')
  getScoreByHouseName(@Param('houseName') houseName: string) {
    return this.scoresService.getScoreByHouseName(houseName);
  }

  @Post()
  async createScoreHistory(
    @Body() scoresHistoryDTO: ScoresHistoryDTO,
  ): Promise<{ scoreId: string; createdAt: Date }> {
    return await this.scoresService.createScoreHistory(scoresHistoryDTO);
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
