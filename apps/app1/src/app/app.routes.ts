import { Route } from '@angular/router';
import { GoalListComponent } from './goal-list/goal-list.component';
import { GoalComponent } from './goal/goal.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'goals', component: GoalListComponent },
  { path: 'goals/:id', component: GoalComponent },
];
