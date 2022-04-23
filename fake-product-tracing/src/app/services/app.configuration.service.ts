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
  ownerAddress: string = '0xb8b2472997F06CfFF9e0A485b839a610a422cbe0';  // contract owner
  producerAddress: string = '0x35078fcFbe02156dCCf96f1615AE45489658C6c8';  // ganache second account address
  consumerAddress: string = '0xA8E164F56F36ae89A0C6728174fa2685F7088F8a';  // ganache third account address
  distributorAddress: string = '0xF827B9401E0652EFC927e566425A09ebC31d76f0' // ganache fourth account address


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

  // to add product
  public addProduct() {

    const result = this.supplyChainContract.methods.addProducts('kachori','kachori garam','Gits','Mumbai', 12).send({
      from: this.producerAddress
    });

    result.then((result) => {
        console.log(result);
    });

  }


  // view product by index
  public viewProduct(inedx: number) {
    const result =  this.supplyChainContract.methods.viewProduct(1).call(
     { from: this.ownerAddress }
    )

    result.then(function(abc) {
      alert(abc);
    });

  }

}
