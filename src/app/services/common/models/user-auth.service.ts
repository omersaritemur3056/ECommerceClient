import { SocialUser } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { TokenResponse } from 'src/app/contracts/token/token-response';
import { CustomToastrService, ToastrMessageType, ToastPosition } from '../../ui/custom-toastr.service';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private httpClientService: HttpClientService, private toastrService: CustomToastrService) { }

  async login(usernameOrEmail: string, password: string, callBackFunction?: () => void): Promise<any>{
    const observable: Observable<any | TokenResponse> = this.httpClientService.post<any | TokenResponse>({
      controller: 'auth',
      action: 'login'
    }, {usernameOrEmail, password})

    const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;
    if (tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
      this.toastrService.message("Kullanıcı girişi başarıyla sağlandı!", "Giriş Başarılı!", {
        messageType: ToastrMessageType.Success,
        position: ToastPosition.TopCenter
      });
    }
    callBackFunction();
  }

  async googleLogin(user: SocialUser, callBackFunction?: () => void): Promise<any>{
    const observable: Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      action: "google-login",
      controller: "auth"
    }, user);

    const tokenResponse = await firstValueFrom(observable) as TokenResponse;
    if (tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
      this.toastrService.message("Google üzerinden giriş başarıyla sağlandı!", "Giriş Başarılı!", {
        messageType: ToastrMessageType.Success,
        position: ToastPosition.TopCenter
      });
    }
    callBackFunction();
  }

  async facebookLogin(user: SocialUser, callBackFunction?: () => void): Promise<any>{
    const observable: Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      controller: "auth",
      action: "facebook-login"
    }, user);

    const tokenResponse = await firstValueFrom(observable) as TokenResponse;
    if (tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
      this.toastrService.message("Facebook üzerinden giriş başarıyla sağlandı!", "Giriş Başarılı!", {
        messageType: ToastrMessageType.Success,
        position: ToastPosition.TopCenter
      });
    }
    callBackFunction();
  }

  async refreshTokenLogin(refreshToken: string, callBackFunction?: (state)=>void){
    const observable: Observable<any | TokenResponse> = this.httpClientService.post({
      controller: "auth",
      action: "refreshtokenlogin"
    }, {refreshToken: refreshToken});

    try {
      const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;

    if (tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
    }

    callBackFunction(tokenResponse ? true : false);
    } catch {
      callBackFunction(false);
    }
  }

  async passwordReset(email: string, callBackFunction?: () => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action: "password-reset"
    }, { email: email });

    await firstValueFrom(observable);
    callBackFunction();
  }

  async verifyResetToken(resetToken: string, userId: string, callBackFunction?: () => void): Promise<boolean> {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action: "verify-reset-token"
    }, {
      resetToken: resetToken,
      userId: userId
    });

    const state: boolean = await firstValueFrom(observable);
    callBackFunction();
    return state;
  }
}
