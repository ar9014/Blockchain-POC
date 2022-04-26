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
  ownerAddress: string = '0x5d09C0a00bA291F36ddb9d5bC14B9fe4A13D1f93';  // contract owner
  producerAddress: string = '0x1258F44a41912403Cd021988Cb5Ab2d27E89fcB6';  // ganache second account address
  consumerAddress: string = '0xC6bFC0b3d22A061a2Ad0d386F58Fc5ae43bc941B';  // ganache third account address
  distributorAddress: string = '0x5244386624304A10c1F41f4DC35e033630ED91c1' // ganache fourth account address
  loc = 'Pune';

  memberList = [{
    "Owner": "0x5d09C0a00bA291F36ddb9d5bC14B9fe4A13D1f93",
    "Producer": "0x1258F44a41912403Cd021988Cb5Ab2d27E89fcB6",
    "Consumer": "0xC6bFC0b3d22A061a2Ad0d386F58Fc5ae43bc941B",
    "Distributor": "0x5244386624304A10c1F41f4DC35e033630ED91c1",
  }]

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

      result.then((instance) => {
        console.log(instance)
      });
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
  public addProduct(productName: string, productDesc:string, producerName: string) {
    const result = this.supplyChainContract.methods.addProducts(productName, productDesc, producerName, this.loc, 40).send({
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
    const result = this.supplyChainContract.methods.addItemInCart(productId, this.loc).send({
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
  public createOrder() {

    const result = this.supplyChainContract.methods.createOrder(this.loc).send({
      from: this.consumerAddress
    });

    result.then((result) => {
        console.log(result);
    });
  }

  // adds distributor to order item
  public addDistributorToOrderItem(orderItem: number, distributor: string) {

    const result = this.supplyChainContract.methods.addDistributorToOrderItem(orderItem, distributor, this.loc).send({
      from: this.producerAddress
    });

    result.then((result) => {
        console.log(result);
    });
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
  public customerConfirmation(orderItem: number) {
    const result = this.supplyChainContract.methods.customerConfirmation(orderItem, this.loc).send({
      from: this.consumerAddress
    });

    result.then((result) => {
        console.log(result);
    });
  }

  // distributor confirmation
  public orderDelivered(orderItem: number) {
    const result = this.supplyChainContract.methods.orderDelivered(orderItem, this.loc).send({
      from: this.distributorAddress
    });

    result.then((result) => {
        console.log(result);
    });
  }
}
