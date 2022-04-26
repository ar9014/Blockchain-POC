import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppConfigurationService } from 'src/app/services/app.configuration.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent implements OnInit {
  @Output() viewProductObj = new EventEmitter();
  productData: any;
  productId = new FormControl();

  constructor(private blockchainConnectionService: AppConfigurationService) {
   }

  ngOnInit() {
  }

  viewProduct(){
    let result = this.blockchainConnectionService.viewProduct(this.productId.value);
    console.log(result);
    this.productData = result;
  }

  goBack(){
    this.viewProductObj.emit('true');
  }
}
