import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopNavComponent } from './top-nav.component';
import { NavService } from '../../_services/nav.service';
import { AuthService } from '../../_services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';

describe('TopNavComponent', () => {
  let component: TopNavComponent;
  let fixture: ComponentFixture<TopNavComponent>;
  let mockNavService: jasmine.SpyObj<NavService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockNavService = jasmine.createSpyObj('NavService', ['openNav']);
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'logout',
      'isLoggedIn'
    ]);

    await TestBed.configureTestingModule({
      declarations: [TopNavComponent],
      imports: [
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: NavService, useValue: mockNavService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show the menu button if the user is logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('#menu'));
    expect(button).toBeTruthy();
  });

  it('should not show the menu button if the user is not logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(false);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('#menu'));
    expect(button).toBeNull();
  });

  it('should call navService.openNav() when menu button is clicked', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#menu'));
    button.triggerEventHandler('click', null);

    expect(mockNavService.openNav).toHaveBeenCalled();
  });

  it('should call authService.logout() when logout() is called', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
