import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderComponent } from './loader.component';
import { LoaderService } from '../loader.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;
  let loadingSubject: BehaviorSubject<boolean>;
  let loaderServiceStub: Partial<LoaderService>;

  beforeEach(async(() => {
    loadingSubject = new BehaviorSubject<boolean>(false);

    loaderServiceStub = {
      isLoading: loadingSubject,
    };

    TestBed.configureTestingModule({
      declarations: [LoaderComponent],
      imports: [MatProgressSpinnerModule],
      providers: [{ provide: LoaderService, useValue: loaderServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner when loading is true', () => {
    loadingSubject.next(true);
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('mat-progress-spinner'));
    expect(spinner).not.toBeNull();
  });

  it('should hide spinner when loading is false', () => {
    loadingSubject.next(false);
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.progress-loader'));
    expect(container.nativeElement.hidden).toBe(true); // compatible con versiones antiguas
  });
});
