import { FacebookLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { AuthService } from 'src/app/services/common/auth.service';
import { UserAuthService } from 'src/app/services/common/models/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent {

  constructor(private userAuthService: UserAuthService, spinner: NgxSpinnerService, private authService: AuthService,
    private activatedRoute: ActivatedRoute, private router: Router, private socialAuthService: SocialAuthService) {
    super(spinner);
    socialAuthService.authState.subscribe(async (user: SocialUser) => {
      console.log(user);
      this.showSpinner(SpinnerType.ScaleMultiple)
      switch (user.provider) {
        case "GOOGLE":
          await userAuthService.googleLogin(user, () => {
            authService.identityCheck();
            this.hideSpinner(SpinnerType.ScaleMultiple)
          })
          break;
        case "FACEBOOK":
          await userAuthService.facebookLogin(user, () => {
            authService.identityCheck();
            this.hideSpinner(SpinnerType.ScaleMultiple)
          })
          break;
      }
    })
  }

  async login(usernameOrEmail: string, password: string) {
    this.showSpinner(SpinnerType.ScaleMultiple);
    await this.userAuthService.login(usernameOrEmail, password, () => {
      this.authService.identityCheck();
      this.activatedRoute.queryParams.subscribe(params => {
        const returnUrl: string = params["returnUrl"]
        if (returnUrl) {
          this.router.navigate([returnUrl]);
        }
      })
      this.hideSpinner(SpinnerType.ScaleMultiple)
    });
  }

  facebookLogin() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
}
