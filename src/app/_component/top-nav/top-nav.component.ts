import { Component, OnInit } from '@angular/core';
import { NavService } from '../../_services/nav.service';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent implements OnInit {
  constructor(
    public navService: NavService,
    public authService: AuthService,
  ) {}

  ngOnInit() {}

  logout() {
    this.authService.logout();
    // localStorage.clear();
    // sessionStorage.clear();
  }
}
