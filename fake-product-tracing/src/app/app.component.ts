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
    this.blockchainConnectionService.supplyChain(); // opens metamask if account is connected to current provider

    // this.blockchainConnectionService.addFarmer();

    // this.blockchainConnectionService.addProduct();
    // this.blockchainConnectionService.viewProduct(1);

    // this.blockchainConnectionService.addConsumer();
    // this.blockchainConnectionService.viewProduct(1);

    // this.blockchainConnectionService.getProuducts();

    // this.blockchainConnectionService.addItemInCart(1);

    // this.blockchainConnectionService.addItemInCart(1);

    // this.blockchainConnectionService.viewOrder();

    // this.blockchainConnectionService.createOrder('Satara');

    // this.blockchainConnectionService.addDistributor();

    //  this.blockchainConnectionService.addDistributorToOrderItem(1,'0x164ACB9b31d5d36F830ae07B7Bc0e36ad3BFEf23','Pune');

    // this.blockchainConnectionService.customerConfirmation(1,'Pune');

   // this.blockchainConnectionService.orderDelivered(1,'Pune');

   }

  openMetaMask(){
    this.blockchainConnectionService.openMetamask().then(resp =>{

    })
  }

}


