import { Component, OnInit } from '@angular/core';
// import { ProductsService } from '../../products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: 'product-details.page.html',
  styleUrls: ['product-details.page.scss']
})
export class ProductDetailsComponent implements OnInit{
  article;
  constructor() {
    // this.article = this.productsService.currentArticle;
  }

  ngOnInit() {
    // this.article = this.productsService.currentArticle;
  }
}
