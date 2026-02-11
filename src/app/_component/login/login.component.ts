import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  submitted: any;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    localStorage.clear();
  }

  login() {
    this.model.action = '/auth/login';

    this.authService.loginForm(this.model).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.authService.setUser(response);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
