import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoutComponent } from './logout.component';
import { AuthService } from 'src/app/_services/auth.service';
import { By } from '@angular/platform-browser';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      declarations: [LogoutComponent],
      providers: [{ provide: AuthService, useValue: authServiceSpy }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout on ngOnInit', () => {
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should render "Cerrando session..!" text', () => {
    const text = fixture.debugElement.query(By.css('p')).nativeElement.textContent;
    expect(text).toContain('Cerrando session..!');
  });
});
