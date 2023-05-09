import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/base/base.component';
import { CreateUser } from 'src/app/contracts/user/create-user';
import { User } from 'src/app/entities/user';
import { UserService } from 'src/app/services/common/models/user.service';
import { CustomToastrService, ToastPosition, ToastrMessageType } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent implements OnInit {

  frm: FormGroup;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private toastrService: CustomToastrService,
    spinner: NgxSpinnerService){
    super(spinner);
  }

  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      fullname: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      username: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.email]],
      password: ["", [Validators.required]],
      passwordConfirm: ["", [Validators.required]]
    }, {
      validators: (group: AbstractControl): ValidationErrors | null => {
        let password = group.get("password").value;
        let passwordConfirm = group.get("passwordConfirm").value;
        return password === passwordConfirm ? null : {notSame: true};
      }
    })
  }

  get component(){
    return this.frm.controls;
  }

  async onSubmit(user: User){
    this.submitted = true;

    if (this.frm.invalid) {
      return;
    }

    const result: CreateUser = await this.userService.create(user);
    if (result.succeeded) {
      this.toastrService.message(result.message, "Kullanıcı Kaydı Başarılı", {
        messageType: ToastrMessageType.Success,
        position: ToastPosition.TopCenter
      })
    }else{
      this.toastrService.message(result.message, "Hata!", {
        messageType: ToastrMessageType.Error,
        position: ToastPosition.TopCenter
      })
    }
  }
}
