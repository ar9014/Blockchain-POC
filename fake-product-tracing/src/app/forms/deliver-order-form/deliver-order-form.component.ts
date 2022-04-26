import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { parse } from 'path';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AppConfigurationService } from 'src/app/services/app.configuration.service';
import { Step } from '../step.model';
// import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';

@Component({
  selector: 'app-deliver-order-form',
  templateUrl: './deliver-order-form.component.html',
  styleUrls: ['./deliver-order-form.component.scss'],
})
export class DeliverOrderFormComponent implements OnInit {
  @Output() viewHistoryObj = new EventEmitter();
  viewDeliverOrderFormDisplay: FormGroup;
  submitted = false;
  steps: Step[];
  private placesSub: Subscription;

  constructor(private fb: FormBuilder, private router: Router, private blockchainConnectionService: AppConfigurationService) {
    this.viewDeliverOrderFormDisplay = this.fb.group({
      orderNumber: [null, [Validators.required]]
    });

    // this.geolocation.getCurrentPosition().then((resp) =>
    //   alert(resp.coords.latitude + ' ' + resp.coords.longitude))
    //   .catch((error) => console.log('Error in getting location:', error)
    // );
  }

  ngOnInit() {}

  submitDeliveryOrder() {
    this.submitted = true
    if (this.viewDeliverOrderFormDisplay.invalid) {
      return;
    }
    // Get details related to order
    // let obsr = this._steps.asObservable();
    // this.placesSub = obsr.subscribe(places => {
    //   this.steps = places;
    // });
    this.blockchainConnectionService.orderDelivered(this.viewDeliverOrderFormDisplay?.value?.orderNumber);
  }

  onReset() {
    this.submitted = false;
    this.viewDeliverOrderFormDisplay.reset();
  }

  goBack(){
    this.viewHistoryObj.emit('true');
    // this.router.navigate(['./']);
  }

}
