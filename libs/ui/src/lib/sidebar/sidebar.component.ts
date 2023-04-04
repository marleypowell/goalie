import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'goalie-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  @Input() public open: boolean | null = true;

  @Output() public readonly opened = new EventEmitter<boolean>();

  @Output() public readonly closed = new EventEmitter<boolean>();

  public readonly links: MenuItem[] = [
    {
      label: 'Home',
      icon: PrimeIcons.HOME,
      routerLink: 'home',
      routerLinkActiveOptions: 'link-active',
    },
    {
      label: 'My Goals',
      icon: PrimeIcons.FLAG,
      routerLink: 'goals',
      routerLinkActiveOptions: 'link-active',
    },
    {
      label: `People's Goals`,
      icon: PrimeIcons.FLAG,
      routerLink: 'peoples-goals',
      routerLinkActiveOptions: 'link-active',
    },
  ];
}
