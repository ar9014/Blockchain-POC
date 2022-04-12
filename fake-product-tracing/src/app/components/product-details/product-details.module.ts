import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductDetailsComponent } from './product-details.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ProductDetailsRoutingModule } from './product-details-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: ProductDetailsComponent }]),
    ProductDetailsRoutingModule,
  ],
  declarations: [ProductDetailsComponent]
})
export class ProductDetailsPageModule {}
