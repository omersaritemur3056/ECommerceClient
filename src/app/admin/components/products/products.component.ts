import { Component, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { CreateProduct } from 'src/app/contracts/product/create-product';
import { HttpClientService } from 'src/app/services/common/http-client.service';
import { ListComponent } from './list/list.component';
import { DialogService } from 'src/app/services/common/dialog.service';
import { QrcodeReadingDialogComponent } from 'src/app/dialogs/qrcode-reading-dialog/qrcode-reading-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends BaseComponent {

  constructor(spinner: NgxSpinnerService, private httpClientService: HttpClientService, private dialogService: DialogService){
    super(spinner)
  }

  @ViewChild(ListComponent) listComponents: ListComponent

  createdProduct(createdProduct: CreateProduct){
    this.listComponents.getProducts();
  }

  showProductQrCodeReading() {
    this.dialogService.openDialog({
      componentType: QrcodeReadingDialogComponent,
      data: null,
      options: {
        width: "1000px"
      },
      afterClosed: () => { }
    });
  }
}
