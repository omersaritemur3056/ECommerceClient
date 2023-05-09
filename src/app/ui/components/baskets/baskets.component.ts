import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { ListBasketItem } from 'src/app/contracts/basket/list-basket-item';
import { UpdateBasketItem } from 'src/app/contracts/basket/update-basket-item';
import { CreateOrder } from 'src/app/contracts/order/create-order';
import { BasketItemDeleteState, BasketItemRemoveDialogComponent } from 'src/app/dialogs/basket-item-remove-dialog/basket-item-remove-dialog.component';
import { ShoppingCompleteDialogComponent, ShoppingCompleteState } from 'src/app/dialogs/shopping-complete-dialog/shopping-complete-dialog.component';
import { DialogService } from 'src/app/services/common/dialog.service';
import { BasketService } from 'src/app/services/common/models/basket.service';
import { OrderService } from 'src/app/services/common/models/order.service';
import { CustomToastrService, ToastPosition, ToastrMessageType } from 'src/app/services/ui/custom-toastr.service';

declare var $: any;

@Component({
  selector: 'app-baskets',
  templateUrl: './baskets.component.html',
  styleUrls: ['./baskets.component.scss']
})
export class BasketsComponent extends BaseComponent implements OnInit {

  basketItems: ListBasketItem[];

  constructor(spinner: NgxSpinnerService, private basketService: BasketService, private dialogService: DialogService,
    private toastrService: CustomToastrService, private router: Router, private orderService: OrderService) {
    super(spinner)
  }

  async ngOnInit(): Promise<void> {
    this.showSpinner(SpinnerType.ScaleMultiple)
    this.basketItems = await this.basketService.get();
    this.hideSpinner(SpinnerType.ScaleMultiple);
  }

  async changeQuantity(object: any) {
    this.showSpinner(SpinnerType.Spin);
    const basketItemId: string = object.target.attributes["id"].value;
    const quantity: number = object.target.value;
    const basketItem: UpdateBasketItem = new UpdateBasketItem();
    basketItem.basketItemId = basketItemId;
    basketItem.quantity = quantity;
    await this.basketService.updateQuantity(basketItem);
    this.hideSpinner(SpinnerType.Spin);
  }

  async removeBasketItem(basketItemId: string) {
    $("#basketModal").modal("hide");

    this.dialogService.openDialog({
      componentType: BasketItemRemoveDialogComponent,
      data: BasketItemDeleteState.Yes,
      afterClosed: async () => {
        this.showSpinner(SpinnerType.ScaleMultiple);
        await this.basketService.remove(basketItemId);

        var a = $("." + basketItemId)
        $("." + basketItemId).fadeOut(500, () => this.hideSpinner(SpinnerType.ScaleMultiple));
        $("#basketModal").modal("show");
      }
    });
  }

  shoppingCompleted() {
    $("#basketModal").modal("hide");

    this.dialogService.openDialog({
      componentType: ShoppingCompleteDialogComponent,
      data: ShoppingCompleteState.Yes,
      afterClosed: async () => {
        this.showSpinner(SpinnerType.ScaleMultiple);
        const order: CreateOrder = new CreateOrder();
        order.address = "Küçükçekmece/İstanbul";
        order.description = "Siparişiniz...";
        await this.orderService.create(order);
        this.hideSpinner(SpinnerType.ScaleMultiple);
        this.toastrService.message("Sipariş alınmıştır!", "Sipariş Oluşturuldu!", {
          messageType: ToastrMessageType.Info,
          position: ToastPosition.TopRight
        })
        this.router.navigate(["/"]);
      }
    });
  }
}
