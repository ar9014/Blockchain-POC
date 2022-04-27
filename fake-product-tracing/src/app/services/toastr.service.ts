import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { MessageType } from '../modal/messagetype';

@Injectable({
  providedIn: 'root'
})


export class ToastrService {

  constructor(private toastController: ToastController) { }

  public async showMessage(message:string, messageType: any){
    let messageClassName = "";

    if(messageType === MessageType.success){
      messageClassName = "toast-success-class";
    }

    if(messageType === MessageType.error){
      messageClassName = "toast-error-class";
    }

    if(messageType === MessageType.warning){
      messageClassName = "toast-warning-class";
    }

    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      cssClass: "toast-custom-class "+ messageClassName
    });
    toast.present();
  }
}
