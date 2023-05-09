import { Component, Inject, OnInit, Output } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileUploadOptions } from 'src/app/services/common/file-upload/file-upload.component';
import { ProductService } from 'src/app/services/common/models/product.service';
import { ListProductImage } from 'src/app/contracts/product/list-product-image';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { MatCard } from '@angular/material/card';
import { DialogService } from 'src/app/services/common/dialog.service';
import { DeleteDialogComponent, DeleteState } from '../delete-dialog/delete-dialog.component';

declare var $: any;

@Component({
  selector: 'app-select-product-image-dialog',
  templateUrl: './select-product-image-dialog.component.html',
  styleUrls: ['./select-product-image-dialog.component.scss']
})
export class SelectProductImageDialogComponent extends BaseDialog<SelectProductImageDialogComponent> implements OnInit {

  images: ListProductImage[];

  constructor(dialogRef: MatDialogRef<SelectProductImageDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: SelectProductImageState | string,
    private productService: ProductService, private spinner: NgxSpinnerService, 
    private dialog: DialogService){
    super(dialogRef);
  }

  async ngOnInit(): Promise<void> {
    this.spinner.show(SpinnerType.ScaleMultiple);
    this.images = await this.productService.readImages(this.data as string, () => {
      this.spinner.hide(SpinnerType.ScaleMultiple);
    });
  }

  async deleteImage(imageId: string, event: any){
    this.dialog.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteState.Yes,
      afterClosed: async () => {
        await this.productService.deleteImage(this.data as string, imageId, () => {
          this.spinner.hide(SpinnerType.ScaleMultiple)
          var card = $(event.srcElement).parent().parent();
          card.fadeOut(500);
        })
      },
    })
  }

  @Output() options: Partial<FileUploadOptions> = {
    accept: '.png, .jpg, .jpeg, .gif',
    action: 'upload',
    controller: 'products',
    explanation: 'Ürün resimlerini seçin ya da buraya sürükleyin...',
    isAdminPage: true,
    queryString: `id=${this.data}`
  }

  showCase(imageId: string){
    this.spinner.show(SpinnerType.ScaleMultiple)
    this.productService.changeShowcaseImage(imageId, this.data as string, () => {
      this.spinner.hide(SpinnerType.ScaleMultiple);
    })
  }
}

export enum SelectProductImageState{
  Close
}