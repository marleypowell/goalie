import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, take } from 'rxjs';
import { WINDOW } from '../shared/injection-tokens';
import { AuthService } from './auth.service';

describe(AuthService.name, () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  let windowSpy: {
    location: Partial<Location>;
    history: Partial<History>;
    document: Partial<Document>;
  };
  let setHrefSpy: jest.Mock;

  beforeEach(() => {
    setHrefSpy = jest.fn();
    windowSpy = {
      location: {
        _href: '',
        set href(value: string) {
          setHrefSpy(value);
          this._href = value;
        },
        get href() {
          return this._href;
        },
        origin: 'http://localhost',
      } as any as Location,
      history: {
        replaceState: jest.fn(),
      },
      document: {
        title: 'Title!',
      },
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: WINDOW, useValue: windowSpy }],
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login start endpoint', () => {
    service.login('/home?query=string');

    const loginStartReq = httpTestingController.expectOne('http://localhost/oauth-agent/login/start');
    loginStartReq.flush({
      authorizationRequestUrl: 'https://localhost:8443/oauth/v2/oauth-authorize',
    });

    expect(loginStartReq.request.method).toBe('POST');
    expect(loginStartReq.request.body).toEqual({ path: '/home?query=string' });
    expect(setHrefSpy).toHaveBeenCalledTimes(1);
    expect(setHrefSpy).toHaveBeenCalledWith('https://localhost:8443/oauth/v2/oauth-authorize');
  });

  it('should call login end endpoint', async () => {
    service.checkAuth('http://localhost/home').pipe(take(1)).subscribe();

    const checkAuthReq = httpTestingController.expectOne('http://localhost/oauth-agent/login/end');
    checkAuthReq.flush({
      handled: true,
      isLoggedIn: true,
    });

    expect(checkAuthReq.request.method).toBe('POST');
    expect(checkAuthReq.request.body).toEqual({ pageUrl: 'http://localhost/home' });

    const authState = await firstValueFrom(service.authState$);
    expect(authState).toEqual({
      handled: true,
      isLoggedIn: true,
    });
  });

  it('should call logout endpoint', () => {
    service.logout();

    const getLogoutUrlReq = httpTestingController.expectOne('http://localhost/oauth-agent/logout');
    getLogoutUrlReq.flush({ url: 'https://localhost:8443/oauth/v2/oauth-logout' });

    expect(getLogoutUrlReq.request.method).toBe('POST');
    expect(setHrefSpy).toHaveBeenCalledTimes(1);
    expect(setHrefSpy).toHaveBeenCalledWith('https://localhost:8443/oauth/v2/oauth-logout');
  });
});
