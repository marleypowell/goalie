import { CompleteGoalDto, CreateGoalDto, Goal, GoalActivity } from '@goalie/shared/goals';
import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { map, Observable } from 'rxjs';

@Controller('goals')
export class GoalController {
  @Client({
    transport: Transport.NATS,
    options: {
      url: 'nats://localhost:4222',
    },
  })
  private client: ClientProxy;

  @Post()
  public create(@Body() createGoalDto: CreateGoalDto): Observable<unknown> {
    return this.client.send('createGoal', createGoalDto);
  }

  @Get('list')
  public findAll(): Observable<Goal[]> {
    return this.client.send('getGoals', {}).pipe(
      map((res) => {
        console.log(res);

        if (!res.data?.length) {
          throw new NotFoundException('No goals found');
        }

        return res.data;
      })
    );
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Observable<Goal> {
    return this.client.send('getGoal', { goalId: id }).pipe(
      map((res) => {
        if (!res.data) {
          throw new NotFoundException(`Goal with id ${id} not found`);
        }

        return res.data;
      })
    );
  }

  @Get(':id/activity')
  public findOneActivity(@Param('id') id: string): Observable<GoalActivity[]> {
    return this.client.send('getGoalActivity', { goalId: id }).pipe(
      map((res) => {
        if (!res.data?.length) {
          throw new NotFoundException(`Goal activity with id ${id} not found`);
        }

        return res.data;
      })
    );
  }

  @Post(':id/complete')
  public complete(@Param('id') id: string): Observable<unknown> {
    const dto = new CompleteGoalDto();
    dto.goalId = id;
    return this.client.send('completeGoal', dto);
  }
}
