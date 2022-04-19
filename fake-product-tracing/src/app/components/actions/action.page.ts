import { Component } from '@angular/core';
import { Router  } from '@angular/router';

@Component({
  selector: 'app-action',
  templateUrl: 'action.page.html',
  styleUrls: ['action.page.scss']
})
export class ActionPage{
  actionPageDisaply = true;
  addProductFormDisplay = false;
  viewProductDisplay = false;

  constructor() {}

  addProductForm(){
    if(this.addProductFormDisplay){
      this.addProductFormDisplay= false;
      this.actionPageDisaply = true;
    }
    else{
      this.addProductFormDisplay = true;
      this.actionPageDisaply = false;
    }
  }

  viewProduct(){
    if(this.viewProductDisplay){
      this.viewProductDisplay= false;
      this.actionPageDisaply = true;
    }
    else{
      this.viewProductDisplay = true;
      this.actionPageDisaply = false;
    }
  }

  AddProductEvent(event){
    if(event === 'true'){
      this.actionPageDisaply = true;
      this.addProductFormDisplay = false;
    }
  }

  ViewProductEvent(event){
    if(event === 'true'){
      this.actionPageDisaply = true;
      this.viewProductDisplay = false;
    }
  }
}
