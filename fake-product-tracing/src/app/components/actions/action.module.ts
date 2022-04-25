import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActionPage } from './action.page';
import { ActionPageRoutingModule } from './action-routing.module';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { AddProductFormComponent } from 'src/app/forms/add-product-form/add-product-form.component';
import { ViewProductComponent } from 'src/app/forms/view-product/view-product.component';
import { ViewOrderHistoryComponent } from 'src/app/forms/view-order-history/view-order-history.component';
import { DeliverOrderFormComponent } from 'src/app/forms/deliver-order-form/deliver-order-form.component';
import { CreateOrderFormComponent } from 'src/app/forms/create-order-form/create-order-form.component';
import { AddDistributorComponent } from 'src/app/forms/add-distributor/add-distributor.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ActionPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ActionPage,AddProductFormComponent, ViewProductComponent, ViewOrderHistoryComponent, DeliverOrderFormComponent, CreateOrderFormComponent, AddDistributorComponent],
  providers: [],
  exports: []
})
export class ActionPageModule {}
