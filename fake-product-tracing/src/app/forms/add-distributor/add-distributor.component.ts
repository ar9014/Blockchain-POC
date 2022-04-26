import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConfigurationService } from 'src/app/services/app.configuration.service';

@Component({
  selector: 'app-add-distributor',
  templateUrl: './add-distributor.component.html',
  styleUrls: ['./add-distributor.component.scss'],
})
export class AddDistributorComponent implements OnInit {
  @Output() addDistributorObj = new EventEmitter();
  addDistributorForm: FormGroup;
  submitted = false;
  selectedUserAddress: string;
  userAccounts: UserAccounts[]= [
    {
      name: 'Disctributor 1',
      address: '0x555d1413170b1280BD7ee42c1A8B98b6E62774f7'
    }
  ];
  constructor(private fb: FormBuilder, private router: Router, private blockchainConnectionService: AppConfigurationService) {
    this.addDistributorForm = this.fb.group({
      account: [null, [Validators.required]],
      orderNumber: [null, [Validators.required]]
    });
   }

  ngOnInit() {}

  addDistributor() {
    this.submitted = true
    if (this.addDistributorForm.invalid) {
      return;
    }

    this.blockchainConnectionService.addDistributorToOrderItem(Number(this.addDistributorForm.get('orderNumber').value), this.addDistributorForm.get('account').value);
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.addDistributorForm.value, null, 4));
  }

  // userChange(userAddress: string) {
  //   this.selectedUserAddress = userAddress;
  // }

  onReset() {
    this.submitted = false;
    this.addDistributorForm.reset();
  }

  goBack(){
    this.addDistributorObj.emit('true');
    // this.router.navigate(['./']);
  }

}

interface UserAccounts {
  name: string;
  address: string
}
