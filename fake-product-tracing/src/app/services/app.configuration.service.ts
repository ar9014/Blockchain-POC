import { Injectable } from "@angular/core";
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

      result.then((instance) => { console.log(instance) });
  }

  // addConsumer
  public addConsumer() {
    const result = this.supplyChainContract.methods.addConsumer(this.consumerAddress).send({
      from: this.ownerAddress
    })

    result.then((instance) => { console.log(instance) });
  }

  // addDistributor
  public addDistributor() {
    const result = this.supplyChainContract.methods.addDistributor(this.distributorAddress).send({
      from: this.ownerAddress
    })

    result.then((instance) =>{
      console.log(instance)
    });
  }
  // to add product
  public addProduct() {

    const result = this.supplyChainContract.methods.addProducts('Samosa','Samosa garam','Gits','Nagpur', 18).send({
      from: this.producerAddress
    });

    result.then((result) => {
        console.log(result);
    });

  }

  // get product by index
  public viewProduct(index: number) {
    const result =  this.supplyChainContract.methods.viewProduct(index).call(
     { from: this.ownerAddress }
    )

    result.then((result) => {
      console.log(result);
    });
  }

  // to add products.
  public addItemInCart(productId: number) {
    const result = this.supplyChainContract.methods.addItemInCart(productId).send({
      from: this.consumerAddress
    });
    result.then((result) => {
        console.log(result);
    });
  }

  // to view product.
  public viewCartItems(index: number) {
   const result =  this.supplyChainContract.methods.viewCartItems(index).call(
    { from: this.consumerAddress }
   )
   result.then((result) => {  console.log(result); });
  }

  // create order
  public createOrder(location: string) {

    const result = this.supplyChainContract.methods.createOrder(location).send({
      from: this.consumerAddress
    });

    result.then((result) => {
        console.log(result);
    });
  }

  // adds distributor to order item
  public addDistributorToOrderItem(orderItem: number, distributor: string, location: string) {

    const result = this.supplyChainContract.methods.addDistributorToOrderItem(orderItem, distributor, location).send({
      from: this.producerAddress
    });

    result.then((result) => {
        console.log(result);
    });
  }

  // get logs
  public getLogs(index: number) {
    const result =  this.supplyChainContract.methods.getLogs().call();
    result.then((result) => {  console.log(result); });
  }

   // get all the products
  public getProuducts() {
   const result =  this.supplyChainContract.methods.getProuducts().call();
    result.then((result) => {
     console.log(result);
    });
  }

  // view order
  public viewOrder() {
    const result =  this.supplyChainContract.methods.viewOrder().call()
    result.then((result) => {
      console.log(result);
    });
  }

  // customer order confirmation
  public customerConfirmation(orderItem: number, location: string) {
    const result = this.supplyChainContract.methods.customerConfirmation(orderItem, location).send({
      from: this.consumerAddress
    });

    result.then((result) => {
        console.log(result);
    });
  }

  // distributor confirmation
  public orderDelivered(orderItem: number, location: string) {
    const result = this.supplyChainContract.methods.orderDelivered(orderItem, location).send({
      from: this.distributorAddress
    });

    result.then((result) => {
        console.log(result);
    });
  }
}
