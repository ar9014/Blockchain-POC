import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-distributor',
  templateUrl: './add-distributor.component.html',
  styleUrls: ['./add-distributor.component.scss'],
})
export class AddDistributorComponent implements OnInit {
  @Output() addDistributorObj = new EventEmitter();
  addDistributorForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.addDistributorForm = this.fb.group({
      account: [null, [Validators.required]],
      distributorName: [null, [Validators.required]]
    });
   }

  ngOnInit() {}

  addDistributor() {
    this.submitted = true
    if (this.addDistributorForm.invalid) {
      return;
    }
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.addDistributorForm.value, null, 4));
  }

  onReset() {
    this.submitted = false;
    this.addDistributorForm.reset();
  }

  goBack(){
    this.addDistributorObj.emit('true');
    // this.router.navigate(['./']);
  }

}
