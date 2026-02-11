import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoComponent } from './logo.component';
import { By } from '@angular/platform-browser';

describe('LogoComponent', () => {
  let component: LogoComponent;
  let fixture: ComponentFixture<LogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogoComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logo image with correct src and class', () => {
    const imgEl = fixture.debugElement.query(By.css('img'));
    expect(imgEl).toBeTruthy();
    expect(imgEl.attributes.src).toBe('assets/images/logo_app.png');
    expect(imgEl.nativeElement.classList).toContain('responsive');
  });
});
