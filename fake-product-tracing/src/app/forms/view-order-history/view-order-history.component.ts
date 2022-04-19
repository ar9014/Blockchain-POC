import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Step } from '../step.model';

@Component({
  selector: 'app-view-order-history',
  templateUrl: './view-order-history.component.html',
  styleUrls: ['./view-order-history.component.scss'],
})
export class ViewOrderHistoryComponent implements OnInit {
  @Output() viewHistoryObj = new EventEmitter();
  viewHistoryForm: FormGroup;
  submitted = false;
  steps: Step[];
  private placesSub: Subscription;

  private _steps = new BehaviorSubject<Step[]>([
    new Step(
      'Product Added',
      'Samir J',
      '01-01-2022',
      'Tumsar',
    ),
    new Step(
      'Product Ordered',
      "Dnyaneshwar M",
      '05-01-2022',
      'Akola'
    ),
    new Step(
      'Picked up for Delivery',
      'Akshay R',
      '08-01-2022',
      'Pune'  
    ),
    new Step(
      'Delivered to Customer',
      'Adharsh',
      '12-01-2022',
      'Nanded'  
    )
  ]);

  constructor(private fb: FormBuilder, private router: Router) {
    this.viewHistoryForm = this.fb.group({
      productNumber: [null, [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit() {}

  viewHistory() {
    this.submitted = true
    if (this.viewHistoryForm.invalid) {
      return;
    }
    let obsr = this._steps.asObservable();
    this.placesSub = obsr.subscribe(places => {
      this.steps = places;
    });
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.viewHistoryForm.value, null, 4));
  }

  onReset() {
    this.submitted = false;
    this.viewHistoryForm.reset();
  }

  goBack(){
    this.viewHistoryObj.emit('true');
    // this.router.navigate(['./']);
  }

}
