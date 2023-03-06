import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'goalie-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, NgIf],
})
export class HeaderComponent {
  @Input() public title: string | null = null;

  @Input() public showLoginButton: boolean | null = false;

  @Input() public showLogoutButton: boolean | null = false;

  @Output() public readonly login: EventEmitter<void> = new EventEmitter();

  @Output() public readonly logout: EventEmitter<void> = new EventEmitter();
}
