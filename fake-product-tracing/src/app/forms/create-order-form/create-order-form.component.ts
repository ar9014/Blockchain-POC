import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-order-form',
  templateUrl: './create-order-form.component.html',
  styleUrls: ['./create-order-form.component.scss'],
})
export class CreateOrderFormComponent implements OnInit {

  constructor() { }

  orders: string[] = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

  ngOnInit() {
  }

}
