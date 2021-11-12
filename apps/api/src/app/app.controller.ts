import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@svv/api/auth/guards';
import { UsersService } from '@svv/api/users/services';
import { ArticlesService } from '@svv/api/articles/services';
import { TeamsService } from '@svv/api/teams/services';
import { SponsorsService } from '@svv/api/sponsors/services';

@Controller()
@UseGuards(JwtAuthGuard)
export class AppController {
  constructor(
    private readonly usersService: UsersService,
    private readonly articlesService: ArticlesService,
    private readonly teamsService: TeamsService,
    private readonly sponsorsService: SponsorsService,
  ) {}

  @Get('health')
  @HttpCode(200)
  async getHealthStatus() {
    return 'API is running';
  }

  @Get('/info')
  async getDashboardInfo() {
    return {
      users: await this.usersService.findTotal(),
      teams: await this.teamsService.findTotal(),
      sponsors: await this.sponsorsService.findTotal(),
      articles: await this.articlesService.findTotal(),
    };
  }
}
