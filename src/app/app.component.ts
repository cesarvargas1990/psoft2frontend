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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  @ViewChild('appDrawer') appDrawer: ElementRef;

  version = VERSION;

  menuUsuario = JSON.parse(localStorage.getItem('menu_usuario'));

  navItems: NavItem[] = this.menuUsuario;

  constructor(
    private navService: NavService,
    public authService: AuthService
  ) {}

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }
}
