import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-order-form',
  templateUrl: './create-order-form.component.html',
  styleUrls: ['./create-order-form.component.scss'],
})
export class CreateOrderFormComponent implements OnInit {

  products: Products[]; 
  buttonDisabled: boolean = false;

  constructor() { }

  ngOnInit() {
    this.getProducts();

    const searchbar = document.querySelector('ion-searchbar');
    searchbar.addEventListener('ionInput', handleInput);

    var self= this;
    function handleInput(event) {
      const query = event.target.value.toLowerCase();
      const productLen = self.products.length;
      if(query && productLen){
          var products = self.products.filter((x)=>x.productName.toLocaleLowerCase().indexOf(query) > -1);
          if(products.length){
            self.products = products;
          } 
      } else {
        self.getProducts();
      }
    }
  }

 

  getProducts(){
    //// get products service call.
    this.products = [
      {productName:'Computer', productId:1, description:"10 Items..", iconChange:false},
      {productName:'Mouse', productId:2, description:"10 Items", iconChange:false},
      {productName:'Pen', productId:3, description:"3 Items", iconChange:false},
      {productName:'Paper', productId:4, description:"3 Items", iconChange:false},
      {productName:'Beer', productId:5, description:"5 Items", iconChange:false}
    ];
  }

  addProductIntoCart(productId){
    var iconChange = this.products.filter((x) => x.productId === productId)[0].iconChange;
    this.products.filter((x) => x.productId === productId)[0].iconChange = iconChange ? false :true;
    if(!iconChange){
      this.buttonDisabled = true;
     console.log(productId);
     /// add to product service call.
    } else {
      var iconStatusLen = this.products.filter(x=>x.iconChange === false).length;
      if(iconStatusLen === this.products.length){
        this.buttonDisabled = false;
      }
    }
  }

  createOrder(){
    // create order service call
    console.log("create order call.")
  }

}

interface  Products{
  productName:string;
  productId:number;
  description:string;
  iconChange: boolean;
}
