import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ScoringService } from './scoring.service';

@Controller()
export class ScoringController {
    constructor(private scoringService: ScoringService) {}

    @Get('scores')
    getScore() {
        return this.scoringService.getScore();
    }

    @Get('score/:houseName')
    getScoreByHouseName(@Param('houseName') houseName: string) {
        return this.scoringService.getScoreByHouseName(houseName);
    }
}
