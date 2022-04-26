
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { AppConfigurationService } from 'src/app/services/app.configuration.service';

interface  Products {
  producerName: string;
  productDesc: string;
  productId: number;
  productName: string;
  quantity: number;
  iconChange: boolean;
}

@Component({
  selector: 'app-create-order-form',
  templateUrl: './create-order-form.component.html',
  styleUrls: ['./create-order-form.component.scss'],
})
export class CreateOrderFormComponent implements OnInit {
  @Output() createOrderObj = new EventEmitter();
  buttonDisabled: boolean = false;

  private products = new Subject<Products[]>();
  public productList : Products[];
  constructor(private blockchainConnectionService: AppConfigurationService) { }

  ngOnInit() {

    var self= this;
    self.getProducts();

    const searchbar = document.querySelector('ion-searchbar');
    searchbar.addEventListener('ionInput', handleInput);

    function handleInput(event) {
      const query = event.target.value.toLowerCase();
      if(query){
          var products = self.productList.filter((x)=>x.productName.toLocaleLowerCase().indexOf(query) > -1);

          if(products.length){
            self.productList = products;
          }

      } else{
        self.getProducts();
      }
    }
  }


  getProducts() {
    let result = this.blockchainConnectionService.getProuducts();

    result.then((data) => {
      this.products.next(data);
    });

    this.products.subscribe(items => {
      this.productList = items;

      this.productList = items.map((data)=> ({
        producerName: data.producerName,
        productDesc: data.productDesc,
        productId: data.productId,
        productName: data.productName,
        quantity: data.quantity,
        iconChange: false
      }));
    });

  }

  addProductIntoCart(productId){

    var iconChange = this.productList.filter((x) => x.productId === productId)[0].iconChange;
    this.productList.filter((x) => x.productId === productId)[0].iconChange = iconChange ? false : true;

    if(!iconChange){
      console.log(productId);
      this.blockchainConnectionService.addItemInCart(productId);
    }
  }

  createOrder(){
    // create order service call
    console.log("create order call.")
    this.blockchainConnectionService.createOrder();

  }

  goBack(){
    this.createOrderObj.emit('true');
  }
}

