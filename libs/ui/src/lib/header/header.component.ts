import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'goalie-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ToolbarModule, ButtonModule, NgIf, MenubarModule],
})
export class HeaderComponent {
  @Input() public title: string | null = null;

  @Input() public showLogoutButton: boolean | null = false;

  @Output() public readonly logout: EventEmitter<void> = new EventEmitter<void>();

  @Output() public readonly profile: EventEmitter<void> = new EventEmitter<void>();
}
