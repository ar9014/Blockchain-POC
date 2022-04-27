import { Injectable } from "@angular/core";
import { error } from "protractor";
import Web3 from 'web3/dist/web3.min.js';
import { AbiService } from "../abi.service";
import { ToastrService } from 'src/app/services/toastr.service';
import { MessageType } from "../modal/messagetype";
declare const window: any;

@Injectable({
    providedIn: 'root'
})
@Injectable()
export class AppConfigurationService {
  window: any;
  supplyChainContract: any;

    ownerAddress: string = '0xE42e16f19D956307E134E95690C6bd91d37ad795'; // contract owner
    producerAddress: string = '0x46CC138c5E270fE45efdE90bE94E9d71FE8Ea639'; // ganache second account address
    consumerAddress: string = '0x81aA227ecC76F7B70B5c0782a691BDfFCAB6ec79'; // ganache third account address
    distributorAddress: string = '0xf022d66A8F8Edf8d7FA6cDf2C9B971839D9F40Bd' // ganache fourth account address

  loc = 'Pune';

  constructor(private abiService: AbiService, private toastrService: ToastrService) {
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

      result.then((instance) => { console.log(instance);
        this.toastrService.showMessage("Farmer added successfully.", MessageType.success);
       }).catch((error) => {
        this.toastrService.showMessage("Error while trying to add farmer.", MessageType.error);
        console.log('Error while trying to add farmer: ' + error.message)
      });
  }

  // addConsumer
  public addConsumer() {
    const result = this.supplyChainContract.methods.addConsumer(this.consumerAddress).send({
      from: this.ownerAddress
    })

    result.then((instance) => { console.log(instance);
      this.toastrService.showMessage("Consumer added successfully.", MessageType.success);
     }).catch((error) => {
      this.toastrService.showMessage("Error while trying to add farmer.", MessageType.error);
      console.log('Error while trying to add consumer: ' + error.message)
    });
  }

  // addDistributor
  public addDistributor() {
    const result = this.supplyChainContract.methods.addDistributor(this.distributorAddress).send({
      from: this.ownerAddress
    })

    result.then((instance) =>{
      console.log(instance);
      this.toastrService.showMessage("Distributor added successfully.", MessageType.success);
    }).catch((error) => {
      this.toastrService.showMessage("Error while trying to add farmer.", MessageType.error);
      console.log('Error while trying to add distributor role: ' + error.message)
    });
  }

  // to add product
  public addProduct(productName: string, productDesc: string, producerName: string, price: number) {
    const result = this.supplyChainContract.methods.addProducts(productName, productDesc, producerName, this.loc, price).send({
      from: this.producerAddress
    });

    result.then((instance) =>{
      console.log(instance);
      this.toastrService.showMessage("Product Added.", MessageType.success);
    }).catch((error) => {
      this.toastrService.showMessage("Failed to add.", MessageType.error);
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
      this.toastrService.showMessage("Error while trying to add farmer.", MessageType.error);
      console.log('Error while trying to view products: ' + error.message)
    });
  }

  // to add products.
  public addItemInCart(productId: number) {
    const result = this.supplyChainContract.methods.addItemInCart(productId, this.loc).send({
      from: this.consumerAddress
    });

    result.then((result) => {
        console.log(result);
      // this.toastrService.showMessage("Product added into cart.", MessageType.success);
    }).catch((error) => {
      // this.toastrService.showMessage("Error while trying to add farmer.", MessageType.error);
      console.log('Error while trying to add Items to cart: ' + error.message)
    });
  }

  // to view product.
  public viewCartItems(index: number) {
   const result =  this.supplyChainContract.methods.viewCartItems(index).call(
    { from: this.consumerAddress }
   )
   result.then((result) => {  console.log(result);
   }).catch((error) => {
    console.log('Error while trying to view cart items: ' + error.message);
    this.toastrService.showMessage("Error while trying to add farmer.", MessageType.error);
  });
  }

  // create order
  public createOrder() {

    const result = this.supplyChainContract.methods.createOrder(this.loc).send({
      from: this.consumerAddress
    });

    result.then((instance) =>{
      console.log(instance);
      this.toastrService.showMessage("Order created", MessageType.success);
    }).catch((error) => {
      this.toastrService.showMessage("Failed to create an order.", MessageType.error);
    });

  }

  // adds distributor to order item
  public addDistributorToOrderItem(orderItem: number, distributor: string) {

    const result = this.supplyChainContract.methods.addDistributorToOrderItem(orderItem, distributor, this.loc).send({
      from: this.producerAddress
    });

    result.then((result) => {
        console.log(result);
        this.toastrService.showMessage("Distributor added", MessageType.success);

    }).catch((error) => {
      console.log('Error while trying to add distributor to Order: ' + error.message);
      this.toastrService.showMessage("Failed to add distributor", MessageType.error);
    });;
  }

  // get logs
  public getLogs(): any {
    const result =  this.supplyChainContract.methods.getLogs().call();
    return result;
  }

   // get all the products
  public getProuducts() : any {
   const result =  this.supplyChainContract.methods.getProuducts().call();
    return result;
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
      console.log('Error while trying to do customer confirmation: ' + error.message);
      this.toastrService.showMessage("Error while trying to add farmer.", MessageType.error);
    });
  }

  // distributor confirmation
  public orderDelivered(orderItem: number) {
    const result = this.supplyChainContract.methods.orderDelivered(orderItem, this.loc).send({
      from: this.distributorAddress
    });

    result.then((result) => {
        console.log(result);
        this.toastrService.showMessage("Item delivered", MessageType.success);
    }).catch((error) => {
      console.log('Error while trying to make order delivery confirmation: ' + error.message);
      this.toastrService.showMessage("Failed", MessageType.error);
    });
  }
}
