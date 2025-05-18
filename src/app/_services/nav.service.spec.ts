import { TestBed } from '@angular/core/testing';
import { NavService } from './nav.service';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Subject } from 'rxjs';

class MockRouter {
  public events = new Subject<Event>();
}

describe('NavService', () => {
  let service: NavService;
  let router: MockRouter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavService,
        { provide: Router, useClass: MockRouter }
      ]
    });

    service = TestBed.get(NavService);
    router = TestBed.get(Router);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería actualizar currentUrl cuando recibe NavigationEnd', () => {
    const newUrl = '/home';
    service.currentUrl.subscribe(url => {
      if (url) {
        expect(url).toBe(newUrl);
      }
    });

    const event = new NavigationEnd(1, '/login', newUrl);
    router.events.next(event);
  });

  it('debería llamar close en appDrawer cuando se invoca closeNav', () => {
    const closeSpy = jasmine.createSpy('close');
    service.appDrawer = { close: closeSpy };
    service.closeNav();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('debería llamar toggle en appDrawer cuando se invoca openNav', () => {
    const toggleSpy = jasmine.createSpy('toggle');
    service.appDrawer = { toggle: toggleSpy };
    service.openNav();
    expect(toggleSpy).toHaveBeenCalled();
  });
});
