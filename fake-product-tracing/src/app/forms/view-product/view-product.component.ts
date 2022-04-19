import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent implements OnInit {
  @Output() viewProductObj = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  goBack(){
    this.viewProductObj.emit('true');
  }
}
