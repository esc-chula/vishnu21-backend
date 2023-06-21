import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ScoringService } from './scoring.service';

@Controller('scores')
export class ScoringController {
    constructor(private scoringService: ScoringService) {}

    @Get()
    getScore() {
        return this.scoringService.getScore();
    }

    @Get('/:houseName')
    getScoreByHouseName(@Param('houseName') houseName: string) {
        return this.scoringService.getScoreByHouseName(houseName);
    }

    @Delete('/:_oid')
    deleteScoreHistory(@Param('_oid') _oid: string) {
        return this.scoringService.deleteScoreHistory(_oid);
    }
}
