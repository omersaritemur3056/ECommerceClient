import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { CreateProduct } from 'src/app/contracts/product/create-product';
import { HttpErrorResponse } from '@angular/common/http';
import { ListProduct } from 'src/app/contracts/list-product';
import { Observable, firstValueFrom, } from 'rxjs';
import { ListProductImage } from 'src/app/contracts/product/list-product-image';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClientService: HttpClientService) { }

  create(product: CreateProduct, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    this.httpClientService.post({
      controller: "products"
    }, product).subscribe(result => {
      successCallBack();
      alert("başarılı");
    }, (errorResponse: HttpErrorResponse) => {
      const _error: Array<{ key: string, value: Array<string> }> = errorResponse.error;
      let message = "";
      _error.forEach((v, _index) => {
        v.value.forEach((_v, index) => {
          message += `${_v}<br>`;
        });
      });
      errorCallBack(message);
    });
  }

  async read(page: number = 0, size: number = 5, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{ totalCount: number; products: ListProduct[] }> {
    const promiseData: Promise<{ totalCount: number; products: ListProduct[] }> = this.httpClientService.get<{ totalCount: number; products: ListProduct[] }>({
      controller: "products",
      queryString: `page=${page}&size=${size}`
    }).toPromise();

    promiseData.then(d => successCallBack())
      .catch((errorResponse: HttpErrorResponse) => errorCallBack(errorResponse.message))

    return await promiseData;
  }

  async delete(id: string) {
    let deleteObservable: Observable<any> = this.httpClientService.delete<any>({
      controller: "products" 
    }, id);

    await firstValueFrom(deleteObservable);
  }

  async readImages(id: string, successCallBack?: () => void): Promise<ListProductImage[]>{
    const getObservable: Observable<ListProductImage[]> = this.httpClientService.get<ListProductImage[]>({
      action: "getproductimages",
      controller: "products"
    }, id);

    const images: ListProductImage[] = await firstValueFrom(getObservable); 
    successCallBack();
    return images;
  }

  async deleteImage(id: string, imageId: string, successCallBack?: () => void){
    const deleteObservable: Observable<any> = this.httpClientService.delete<any>({
      action: "deleteproductimage",
      controller: "products",
      queryString: `imageId=${imageId}`
    }, id)

    firstValueFrom(deleteObservable);
    successCallBack();
  }

  async changeShowcaseImage(imageId: string, productId: string, successCallBack?: () => void){
    const changeShowcaseImageObservable = this.httpClientService.get({
      controller: "products",
      action: "ChangeShowcaseImage",
      queryString: `imageId=${imageId}&productId=${productId}`
    });
    await firstValueFrom(changeShowcaseImageObservable);
    successCallBack();
  }
}
