import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  viewHistoryFormDisplay = false;
  viewDeliverOrderFormDisplay= false;
  createOrderDisplay = false;
  addDistributorDisplay = false
  actions = new FormControl();

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

  addDistributor(){
    if(this.addDistributorDisplay){
      this.addDistributorDisplay= false;
      this.actionPageDisaply = true;
    }
    else{
      this.addDistributorDisplay = true;
      this.actionPageDisaply = false;
    }
  }

  viewHistoryForm(){
    if(this.viewHistoryFormDisplay){
      this.viewHistoryFormDisplay= false;
      this.actionPageDisaply = true;
    }
    else{
      this.viewHistoryFormDisplay = true;
      this.actionPageDisaply = false;
    }
  }

  viewDeliverOrderForm(){
    if(this.viewDeliverOrderFormDisplay){
      this.viewDeliverOrderFormDisplay= false;
      this.actionPageDisaply = true;
    }
    else{
      this.viewDeliverOrderFormDisplay = true;
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

  ViewHistoryEvent(event){
    if(event === 'true'){
      this.actionPageDisaply = true;
      this.viewHistoryFormDisplay = false;
    }
  }

  ViewDeliverOrderEvent(event){
    if(event === 'true'){
      this.actionPageDisaply = true;
      this.viewDeliverOrderFormDisplay = false;
    }
  }

  createOrderFrom(){
    if(this.createOrderDisplay){
      this.createOrderDisplay= false;
      this.actionPageDisaply = true;
    }
    else{
      this.createOrderDisplay = true;
      this.actionPageDisaply = false;
    }
  }

  createOrderEvent(event){
    if(event){
      this.actionPageDisaply = true;
      this.createOrderDisplay = false;
    }
  }

  AddDistributorEvent(event){
    if(event === 'true'){
      this.actionPageDisaply = true;
      this.addDistributorDisplay = false;
    }
  }

  valueChange(event){
    debugger
  }
}
