import { Component, ViewChild } from '@angular/core';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent {

  @ViewChild(ListComponent) listComponents: ListComponent;

  createdRole(createdRole: string) {
    this.listComponents.getRoles();
  }
}
