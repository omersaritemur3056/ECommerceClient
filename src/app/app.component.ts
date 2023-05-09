import { Component, ViewChild } from '@angular/core';
import { AuthService } from './services/common/auth.service';
import { CustomToastrService, ToastrMessageType } from './services/ui/custom-toastr.service';
import { ToastPosition } from './services/ui/custom-toastr.service';
import { Router } from '@angular/router';
import { ComponentType, DynamicLoadComponentService } from './services/common/dynamic-load-component.service';
import { DynamicLoadComponentDirective } from './directives/common/dynamic-load-component.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ECommerceClient';

  @ViewChild(DynamicLoadComponentDirective, { static: true })
  dynamicLoadComponentDirective: DynamicLoadComponentDirective;

  constructor(public authService: AuthService, private toastrService: CustomToastrService, private router: Router,
    private dynamicLoadComponentService: DynamicLoadComponentService) {
    authService.identityCheck();
  }

  signOut() {
    localStorage.removeItem("accessToken");
    this.authService.identityCheck();
    this.router.navigate([""])
    this.toastrService.message("Oturum kapatılmıştır!", "Oturum Kapatıldı", {
      messageType: ToastrMessageType.Success,
      position: ToastPosition.TopCenter
    })
  }

  loadComponent() {
    this.dynamicLoadComponentService
      .loadComponent(ComponentType.BasketsComponent, this.dynamicLoadComponentDirective.viewContainerRef);
  }
}
