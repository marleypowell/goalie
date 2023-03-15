import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, take } from 'rxjs';
import { AuthService } from './auth.service';
import { WINDOW } from './injection-tokens';

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
    (windowSpy.location as any)._href = 'http://localhost/home?query=string';
    service.login();

    const loginStartReq = httpTestingController.expectOne('/oauth-agent/login/start');
    loginStartReq.flush({
      authorizationRequestUrl: 'https://localhost:8443/oauth/v2/oauth-authorize',
    });

    expect(loginStartReq.request.method).toBe('POST');
    expect(loginStartReq.request.body).toEqual({ path: '/home?query=string' });
    expect(loginStartReq.request.withCredentials).toBe(true);
    expect(setHrefSpy).toHaveBeenCalledTimes(1);
    expect(setHrefSpy).toHaveBeenCalledWith('https://localhost:8443/oauth/v2/oauth-authorize');
  });

  it('should call login end endpoint', async () => {
    windowSpy.location.href = 'http://localhost/';
    service.checkAuth().pipe(take(1)).subscribe();

    const checkAuthReq = httpTestingController.expectOne('/oauth-agent/login/end');
    checkAuthReq.flush({
      handled: true,
      isLoggedIn: true,
    });

    expect(checkAuthReq.request.method).toBe('POST');
    expect(checkAuthReq.request.body).toEqual({ pageUrl: 'http://localhost/' });
    expect(checkAuthReq.request.withCredentials).toBe(true);

    const authState = await firstValueFrom(service.authState$);
    expect(authState).toEqual({
      handled: true,
      isLoggedIn: true,
    });
  });

  it('should call logout endpoint', () => {
    service.logout();

    const getLogoutUrlReq = httpTestingController.expectOne('/oauth-agent/logout');
    getLogoutUrlReq.flush({ url: 'https://localhost:8443/oauth/v2/oauth-logout' });

    expect(getLogoutUrlReq.request.method).toBe('POST');
    expect(getLogoutUrlReq.request.withCredentials).toBe(true);
    expect(setHrefSpy).toHaveBeenCalledTimes(1);
    expect(setHrefSpy).toHaveBeenCalledWith('https://localhost:8443/oauth/v2/oauth-logout');
  });
});
