import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import { BaseComponent } from 'src/app/base/base.component';

@Injectable({
  providedIn: 'root'
})
export class DynamicLoadComponentService {

  constructor(private componentFactoryResolve: ComponentFactoryResolver) { }

  async loadComponent(componentType: ComponentType, viewContainerRef: ViewContainerRef) {
    let _component: any = null;

    switch (componentType) {
      case ComponentType.BasketsComponent:
        _component = (await (import("../../ui/components/baskets/baskets.component"))).BasketsComponent;
        break;
    }

    viewContainerRef.clear();
    return viewContainerRef.createComponent(_component);
    //return viewContainerRef.createComponent(this.componentFactoryResolve.resolveComponentFactory(_component));
  }
}

export enum ComponentType {
  BasketsComponent
}
