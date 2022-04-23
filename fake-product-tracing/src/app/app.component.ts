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

    this.blockchainConnectionService.addProduct();
    // this.blockchainConnectionService.viewProduct(2);
   }

  openMetaMask(){
    this.blockchainConnectionService.openMetamask().then(resp =>{

    })
  }

}


