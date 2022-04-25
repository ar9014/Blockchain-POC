declare const window: any;

import { Component, OnInit } from '@angular/core';
import { AppConfigurationService } from './services/app.configuration.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{

   constructor(private blockchainConnectionService: AppConfigurationService) {
  }

  public ngOnInit(): void {
    this.openMetaMask();  // this is used to set up connection with metamask.
    this.blockchainConnectionService.supplyChain(); // opens metamask if account is not connected to current provider

    // this.blockchainConnectionService.addFarmer();

    // this.blockchainConnectionService.addProduct();
    // this.blockchainConnectionService.viewProduct(1);

    // this.blockchainConnectionService.addConsumer();
    // this.blockchainConnectionService.viewProduct(1);

    // this.blockchainConnectionService.getProuducts();

    // this.blockchainConnectionService.addItemInCart(1);

    // this.blockchainConnectionService.addItemInCart(5);

    // this.blockchainConnectionService.viewOrder();

    // this.blockchainConnectionService.createOrder();

    // this.blockchainConnectionService.addDistributor();

    //  this.blockchainConnectionService.addDistributorToOrderItem(1,'0x5244386624304A10c1F41f4DC35e033630ED91c1');

    // this.blockchainConnectionService.customerConfirmation(1,'Pune');

  //  this.blockchainConnectionService.orderDelivered(1);

    // this.blockchainConnectionService.getLogs();

   }

  openMetaMask(){
    this.blockchainConnectionService.openMetamask().then(resp =>{

    })
  }

}


