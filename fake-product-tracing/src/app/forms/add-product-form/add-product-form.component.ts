import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConfigurationService } from 'src/app/services/app.configuration.service';
import Web3 from 'Web3';

@Component({
  selector: 'app-add-product-form',
  templateUrl: './add-product-form.component.html',
  styleUrls: ['./add-product-form.component.scss']
})
export class AddProductFormComponent implements OnInit {
  @Output() addProductObj = new EventEmitter();
  addProductForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private router: Router, private blockchainConnectionService: AppConfigurationService) {
    this.addProductForm = this.fb.group({
      productName: [null, [Validators.required, Validators.minLength(5)]],
      productDesc: [null, [Validators.required]],
      producerName: [null, [Validators.required]]
    });
  }
  ngOnInit() {}

  addProduct() {

    this.submitted = true
    if (this.addProductForm.invalid) {
      return;
    }

  let prodcutname =  this.addProductForm?.value?.productName;
  let prodcutdesc =  this.addProductForm?.value?.productDesc;
  let producerName =  this.addProductForm?.value?.producerName;

    this.blockchainConnectionService.addProduct(prodcutname, prodcutdesc, producerName);

  }

  onReset() {
    this.submitted = false;
    this.addProductForm.reset();
  }

  goBack(){
    this.addProductObj.emit('true');
  }

}
