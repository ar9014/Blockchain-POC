import { Injectable } from "@angular/core";
import { error } from "protractor";
import Web3 from 'web3/dist/web3.min.js';
import { AbiService } from "../abi.service";

declare const window: any;

@Injectable({
    providedIn: 'root'
})
@Injectable()
export class AppConfigurationService {
  window: any;
  supplyChainContract: any;
  ownerAddress: string = '0x60431CE1331Bc9199Ad4A464C415963696b6e775';  // contract owner
  producerAddress: string = '0xaD3C10EaAd2F1b07fBa5Adb39FB8e87Fc32Fc4fC';  // ganache second account address
  consumerAddress: string = '0xE3F58A16c5a6D0e93F81cB317AF72a26Bd71cfC7';  // ganache third account address
  distributorAddress: string = '0x164ACB9b31d5d36F830ae07B7Bc0e36ad3BFEf23' // ganache fourth account address
  loc = 'Pune';

  constructor(private abiService: AbiService) {
  }

  private getAccounts = async () => {
      return await window.ethereum.request({ method: 'eth_accounts' });
  }

  public openMetamask = async () => {
      window.web3 = new Web3(window.ethereum);
      this.ownerAddress = await this.getAccounts();
      console.log("service",this.ownerAddress);
      if (!this.ownerAddress.length) {
        this.ownerAddress = await window.ethereum.enable();
      }
      return this.ownerAddress.length ? this.ownerAddress[0] : null;
  };

  public supplyChain = async () => {
    try {
      const contract = new window.web3.eth.Contract(
            this.abiService.getABI(),
            this.abiService.getContractAddress(),
          );
      this.supplyChainContract = contract;
    }
    catch (error) {
        const errorMessage = error.message;
        console.log(errorMessage)
    }
  }

  // is product owner
  public isOwner = async () => {
        const result = await this.supplyChainContract.methods.isOwner().call();
        alert(result);
  }

  // add producer
  public addFarmer() {
      const result = this.supplyChainContract.methods.addProducer(this.producerAddress).send({
        from: this.ownerAddress
      })

      result.then((instance) => { console.log(instance) }).catch((error) => {
        console.log('Error while trying to add farmer: ' + error.message)
      });
  }

  // addConsumer
  public addConsumer() {
    const result = this.supplyChainContract.methods.addConsumer(this.consumerAddress).send({
      from: this.ownerAddress
    })

    result.then((instance) => { console.log(instance) }).catch((error) => {
      console.log('Error while trying to add consumer: ' + error.message)
    });
  }

  // addDistributor
  public addDistributor() {
    const result = this.supplyChainContract.methods.addDistributor(this.distributorAddress).send({
      from: this.ownerAddress
    })

    result.then((instance) =>{
      console.log(instance)
    }).catch((error) => {
      console.log('Error while trying to add distributor role: ' + error.message)
    });
  }
  // to add product
  public addProduct(productName: string, productDesc: string, producerName: string, loaction: string, price: number) {
    const result = this.supplyChainContract.methods.addProducts(productName, productDesc, producerName, this.loc, price).send({
      from: this.producerAddress
    });

    // const result = this.supplyChainContract.methods.addProducts('Pen','Ball Pen','Cello', this.loc, 11).send({
    //   from: this.producerAddress
    // });

    result.then((result) => {
        console.log(result);
    }).catch((error) => {
      console.log('Error while trying to add new product: ' + error.message)
    });

  }

  // get product by index
  public viewProduct(index: number) {
    const result =  this.supplyChainContract.methods.viewProduct(index).call(
     { from: this.ownerAddress }
    )

    result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log('Error while trying to view products: ' + error.message)
    });
  }

  // to add products.
  public addItemInCart(productId: number) {
    const result = this.supplyChainContract.methods.addItemInCart(productId).send({
      from: this.consumerAddress
    });
    result.then((result) => {
        console.log(result);
    }).catch((error) => {
      console.log('Error while trying to add Items to cart: ' + error.message)
    });
  }

  // to view product.
  public viewCartItems(index: number) {
   const result =  this.supplyChainContract.methods.viewCartItems(index).call(
    { from: this.consumerAddress }
   )
   result.then((result) => {  console.log(result); }).catch((error) => {
    console.log('Error while trying to view cart items: ' + error.message)
  });
  }

  // create order
  public createOrder() {

    const result = this.supplyChainContract.methods.createOrder(this.loc).send({
      from: this.consumerAddress
    });

    result.then((result) => {
        console.log(result);
    }).catch((error) => {
      console.log('Error while trying to create order: ' + error.message)
    });
  }

  // adds distributor to order item
  public addDistributorToOrderItem(orderItem: number, distributor: string) {

    const result = this.supplyChainContract.methods.addDistributorToOrderItem(orderItem, distributor, this.loc).send({
      from: this.producerAddress
    });

    result.then((result) => {
        console.log(result);
    }).catch((error) => {
      console.log('Error while trying to add distributor to Order: ' + error.message)
    });;
  }

  // get logs
  public getLogs(): any {
    const result =  this.supplyChainContract.methods.getLogs().call();
    return result;
  }

   // get all the products
  public getProuducts() {
   const result =  this.supplyChainContract.methods.getProuducts().call();
    result.then((result) => {
     console.log(result);
    }).catch((error) => {
      console.log('Error while trying to get products: ' + error.message)
    });
  }

  // view order
  public viewOrder() {
    const result =  this.supplyChainContract.methods.viewOrder().call()
    result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log('Error while trying to view order: ' + error.message)
    });
  }

  // customer order confirmation
  public customerConfirmation(orderItem: number) {
    const result = this.supplyChainContract.methods.customerConfirmation(orderItem, this.loc).send({
      from: this.consumerAddress
    });

    result.then((result) => {
        console.log(result);
    }).catch((error) => {
      console.log('Error while trying to do customer confirmation: ' + error.message)
    });
  }

  // distributor confirmation
  public orderDelivered(orderItem: number) {
    const result = this.supplyChainContract.methods.orderDelivered(orderItem, this.loc).send({
      from: this.distributorAddress
    });

    result.then((result) => {
        console.log(result);
    }).catch((error) => {
      console.log('Error while trying to make order delivery confirmation: ' + error.message)
    });
  }
}
