import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from  '../../products.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  data: any;
  constructor(private productsService: ProductsService, private router: Router) {
  }

  ngOnInit() {
    this.productsService.getData('top-headlines?country=us&category=business').subscribe(data => {
      this.data = data;
    })
  }

  onGoToSinglePage(article){
    this.productsService.currentArticle = null;
    this.productsService.currentArticle = article;
    this.router.navigate(['/tabs/tab3']);
  }
}
