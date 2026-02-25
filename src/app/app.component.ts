import {
  Component,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  AfterViewInit
} from '@angular/core';
import { VERSION } from '@angular/material/core';
import { NavItem } from '../app/_models/nav-item';
import { NavService } from './_services/nav.service';
import { AuthService } from '../app/_services/auth.service';
import { SessionStateService } from './core/session/session-state.service';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  @ViewChild('appDrawer') appDrawer: ElementRef;

  version = VERSION;

  menuUsuario: unknown = [];
  navItems: NavItem[] = [];

  constructor(
    private navService: NavService,
    public authService: AuthService,
    private readonly sessionState: SessionStateService
  ) {
    this.menuUsuario = this.sessionState.parseStoredJson('menu_usuario', []);
    this.navItems = this.sessionState.getMenuItems();
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }
}
