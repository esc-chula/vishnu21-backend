import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresHistoryDTO } from './types/scores.dto';
import { AllowRoles, PublicRoute } from '@/auth/auth.decorator';

@Controller('scores')
export class ScoresController {
  constructor(private scoresService: ScoresService) {}

  @Get()
  @PublicRoute()
  getScores() {
    return this.scoresService.getScores();
  }

  @Get('/user')
  getUserScore(@Req() req: any) {
    return this.scoresService.getScoreByHouseId(req.user.groupId);
  }

  @Get('/house/:id')
  getScoreByHouseId(@Param('id') id: string) {
    return this.scoresService.getScoreByHouseId(id);
  }

  @Post()
  async createScoreHistory(
    @Body() scoresHistoryDTO: ScoresHistoryDTO,
  ): Promise<{ scoreId: string; createdAt: Date }> {
    return await this.scoresService.createScoreHistory(scoresHistoryDTO);
  }

  @AllowRoles('Activity', 'IT', 'Admin', 'Board')
  @Patch('/:id')
  updateScores(@Param('id') id: string, @Body() payload: ScoresHistoryDTO) {
    return this.scoresService.updateScores(id, payload);
  }

  @AllowRoles('Activity', 'IT', 'Admin', 'Board')
  @Delete('/:_oid')
  deleteScoreHistory(@Param('_oid') _oid: string) {
    return this.scoresService.deleteScoreHistory(_oid);
  }
}
