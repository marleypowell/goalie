import { Route } from '@angular/router';
import { GoalListComponent } from './features/goal-list/goal-list.component';
import { GoalComponent } from './features/goal/goal.component';
import { HomeComponent } from './features/home/home.component';
import { PeoplesGoalsComponent } from './features/peoples-goals/peoples-goals.component';
import { ProfileComponent } from './features/profile/profile.component';
import { authGuard } from './shared/guards/auth.guard';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'goals', component: GoalListComponent, canActivate: [authGuard] },
  { path: 'goals/:id', component: GoalComponent, canActivate: [authGuard] },
  { path: 'peoples-goals', component: PeoplesGoalsComponent, canActivate: [authGuard] },
];
