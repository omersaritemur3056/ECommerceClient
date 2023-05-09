import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { CreateOrder } from 'src/app/contracts/order/create-order';
import { ListOrder } from 'src/app/contracts/order/list-order';
import { SingleOrder } from 'src/app/contracts/order/single-order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpCLientService: HttpClientService) { }

  async create(order: CreateOrder): Promise<void> {
    const observable: Observable<any> = this.httpCLientService.post({
      controller: "orders"
    }, order);

    await firstValueFrom(observable);
  }

  async getAllOrders(page: number = 0, size: number = 5, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{ totalOrderCount: number; orders: ListOrder[] }> {
    const observable: Observable<{ totalOrderCount: number; orders: ListOrder[] }> = this.httpCLientService.get({
      controller: "orders",
      queryString: `page=${page}&size=${size}`
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then(value => successCallBack())
      .catch(error => errorCallBack(error));

    return await promiseData;
  }

  async getOrderById(id: string, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    const observable: Observable<SingleOrder> = this.httpCLientService.get<SingleOrder>({
      controller: "orders"
    }, id);

    const promiseData = firstValueFrom(observable);
    promiseData.then(value => successCallBack())
      .catch(error => errorCallBack(error))

    return await promiseData;
  }

  async completeOrder(id: string) {
    const observable: Observable<any> = this.httpCLientService.get({
      controller: "orders",
      action: "complete-order"
    }, id);

    await firstValueFrom(observable);
  }
}
