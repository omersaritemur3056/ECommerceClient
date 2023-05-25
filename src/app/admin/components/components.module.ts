import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthorizeMenuComponent } from './authorize-menu/authorize-menu.component';
import { AuthorizeMenuModule } from './authorize-menu/authorize-menu.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';



@NgModule({
  imports: [
    CommonModule,
    ProductsModule,
    OrdersModule,
    CustomersModule,
    DashboardModule,
    AuthorizeMenuModule,
    RoleModule,
    UserModule
  ],
  exports: [
    
  ],
  declarations: [
    //AuthorizeMenuComponent
  ]
})
export class ComponentsModule { }
