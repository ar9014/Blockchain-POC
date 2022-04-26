import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { AppConfigurationService } from 'src/app/services/app.configuration.service';
import { Step } from '../step.model';

interface log {
  stateInString: string,
  productId: number,
  createdDateTime: any,
  location: string,
  createdByName: string
}

@Component({
  selector: 'app-view-order-history',
  templateUrl: './view-order-history.component.html',
  styleUrls: ['./view-order-history.component.scss'],
})
export class ViewOrderHistoryComponent implements OnInit {
  @Output() viewHistoryObj = new EventEmitter();
  viewHistoryForm: FormGroup;
  submitted = false;
  filteredData: log[];
  logsData: log[];

  private _steps = new Subject<log[]>();

  constructor(private fb: FormBuilder, private router: Router, private blockchainConnectionService: AppConfigurationService) {
    this.viewHistoryForm = this.fb.group({
      productNumber: [null, [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit() {}

  viewHistory() {

    this.submitted = true

    if (this.viewHistoryForm.invalid) {
      return;
    }

    let result = this.blockchainConnectionService.getLogs();

    result.then((data) => {
      this._steps.next(data);
    });

    this._steps.subscribe(places => {
        this.filteredData = places.filter(proj => proj.productId.toString() === this.viewHistoryForm?.value?.productNumber);
    });

  }

  onReset() {
    this.submitted = false;
    this.viewHistoryForm.reset();
  }

  goBack(){
    this.viewHistoryObj.emit('true');
  }

  convertToDateTime(time:any)
  {
    return new Date(time)
  }

}
