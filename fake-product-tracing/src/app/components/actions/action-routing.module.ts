import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionPage } from './action.page';

const routes: Routes = [
  {
    path: '',
    component: ActionPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionPageRoutingModule {}
