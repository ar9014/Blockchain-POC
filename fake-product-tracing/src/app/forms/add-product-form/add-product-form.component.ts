import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConfigurationService } from 'src/app/services/app.configuration.service';

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
      producerName: [null, [Validators.required]],
      price: [null, [Validators.required]]
    });
  }
  ngOnInit() {}

  addProduct() {
    this.submitted = true
    if (this.addProductForm.invalid) {
      return;
    }
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.addProductForm.value, null, 4));
    this.blockchainConnectionService.addProduct(this.addProductForm.value.productName, this.addProductForm.value.productDesc, this.addProductForm.value.producerName, 'Pune',
      this.addProductForm.value.price);
  }

  onReset() {
    this.submitted = false;
    this.addProductForm.reset();
  }

  goBack(){
    this.addProductObj.emit('true');
  }

}
