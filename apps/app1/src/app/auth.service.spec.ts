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

  beforeEach(() => {
    windowSpy = {
      location: {
        setHrefSpy: jest.fn(),
        set href(value: string) {
          this.setHrefSpy(value);
        },
        get href() {
          return this.setHrefSpy;
        },
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
    service.login();

    const loginStartReq = httpTestingController.expectOne('http://localhost:3334/api/login/start');
    loginStartReq.flush({
      authorizationRequestUrl: 'https://localhost:8443/oauth/v2/oauth-authorize',
    });

    expect(loginStartReq.request.method).toBe('POST');
    expect(loginStartReq.request.withCredentials).toBe(true);
    expect(windowSpy.location.href).toHaveBeenCalledTimes(1);
    expect(windowSpy.location.href).toHaveBeenCalledWith('https://localhost:8443/oauth/v2/oauth-authorize');
  });

  it('should call login end endpoint', async () => {
    service.updateAuthState().pipe(take(1)).subscribe();

    const checkAuthReq = httpTestingController.expectOne('http://localhost:3334/api/login/end');
    checkAuthReq.flush({
      handled: true,
      isLoggedIn: true,
    });

    expect(checkAuthReq.request.method).toBe('POST');
    expect(checkAuthReq.request.withCredentials).toBe(true);

    const authState = await firstValueFrom(service.authState$);
    expect(authState).toEqual({
      handled: true,
      isLoggedIn: true,
    });
    expect(windowSpy.history.replaceState).toHaveBeenCalledTimes(1);
    expect(windowSpy.history.replaceState).toHaveBeenCalledWith({}, 'Title!', '/');

    const getUserInfoReq = httpTestingController.expectOne('http://localhost:3334/api/user-info');
    getUserInfoReq.flush({
      name: 'John Doe',
    });

    expect(getUserInfoReq.request.method).toBe('GET');
    expect(getUserInfoReq.request.withCredentials).toBe(true);

    const userInfo = await firstValueFrom(service.userInfo$);
    expect(userInfo).toEqual({
      name: 'John Doe',
    });
  });
});
