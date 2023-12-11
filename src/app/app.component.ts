import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppService } from './service/app.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule], // add ReactiveFormsModule
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  productsData: any;

  ngOnInit() {
    this.appService.getData().subscribe(data => this.productsData = data)
  }

  index: number = 0;
  itemsProd: any[] = [];
  itemsWhy: any[] = [];
  currentOrder: any[] = [];

  form = this.fb.group({
    order: ['', Validators.required],
    name: ['', Validators.required],
    phone: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private appService: AppService) {
  }

  prepareDataForForm(burger: any) {

    if (this.currentOrder.hasOwnProperty(burger.title)) {
      this.currentOrder[burger.title].count++;
      this.currentOrder[burger.title].price += Number(burger.price);
    } else {
      this.currentOrder[burger.title] = { count: 1, price: Number(burger.price) };
    }
    this.feelForm();
  }
  
  feelForm() {
    let currentOrderForPrint: any[] = [];
    for (let i in this.currentOrder) {
      currentOrderForPrint.push(`${i} ${this.currentOrder[i].count} шт. (${this.currentOrder[i].price} ${this.currency})`);
    }
    this.form.patchValue({ "order": currentOrderForPrint.join(', ')});
  }
  
  currency = '$';

  changeCurrency() {
    let newCurrency = '$';
    let coefficient = 1;

    if (this.currency === '$') {
        newCurrency = '₽';
        coefficient = 91;
    } else if (this.currency === '₽') {
        newCurrency = 'BYN';
        coefficient = 3.2;
    } else if (this.currency === 'BYN') {
        newCurrency = '€';
        coefficient = 0.9;
    } else if (this.currency === '€') {
        newCurrency = '¥';
        coefficient = 7.1;
    } else if (this.currency === '¥') {
        newCurrency = '₸';
        coefficient = 459;
    } else if (this.currency === '₸') {
        newCurrency = '₴';
        coefficient = 36.6;
    } else if (this.currency === '₴') {
        newCurrency = 'PLN';
        coefficient = 4;
    } else if (this.currency === 'PLN') {
        newCurrency = '₺';
        coefficient = 28.9;
    }

    this.currency = newCurrency;

    this.productsData.forEach((item: any) => {
      item.price = +(item.basePrice * coefficient).toFixed(1)
    })
  }
  
  scrollTo(target: HTMLElement) { 
    target.scrollIntoView({ behavior: 'smooth' });
  }

  confirmOrder() {
    if (this.form.valid) {
      this.appService.sendOrder(this.form.value)
        .subscribe(
          {
            next: (response: any) => {
              alert(response.message);
              this.form.reset()
            },
            error: (response) => {
              alert(response.error.message);
            },
          }
        )
    }
  }
}

// realization of itL 
/*

export class AppComponent {

  currency = '$'

  form = this.fb.group({
    order: ['', Validators.required],
    name: ['', Validators.required],
    phone: ['', Validators.required],
  });

  productsData: any;

  constructor(private fb: FormBuilder, private appService: AppService) {
  }



  ngOnInit() {
    this.appService.getData().subscribe(data => this.productsData = data)
  }

  scrollTo(target: HTMLElement, burger?: any) { 
    target.scrollIntoView({ behavior: 'smooth' });
    if (burger) {
      this.form.patchValue({order: burger.title + ' (' + burger.price + ' ' + this.currency + ')'});
      }
  }
  
  confirmOrder() {
    if (this.form.valid) {
      this.appService.sendOrder(this.form.value)
        .subscribe(
          {
            next: (response: any) => {
              alert(response.message);
              this.form.reset()
            },
            error: (response) => {
              alert(response.error.message);
            },
          }
        )
    }
  }  
  // 2 без бека
  confirmOrder() {
    if (this.form.valid) {
      alert("thx");
      this.form.reset();
      for (let i in this.currentOrder) {
        delete this.currentOrder[i];
      }
    }
  }

  changeCurrency() {

    let newCurrency = '$';
    let coefficient = 1;

    if (this.currency === '$') {
        newCurrency = '₽';
        coefficient = 91;
    } else if (this.currency === '₽') {
        newCurrency = 'BYN';
        coefficient = 3.2;
    } else if (this.currency === 'BYN') {
        newCurrency = '€';
        coefficient = 0.9;
    } else if (this.currency === '€') {
        newCurrency = '¥';
        coefficient = 7.1;
    } else if (this.currency === '¥') {
        newCurrency = '₸';
        coefficient = 459;
    } else if (this.currency === '₸') {
        newCurrency = '₴';
        coefficient = 36.6;
    } else if (this.currency === '₴') {
        newCurrency = 'PLN';
        coefficient = 4;
    } else if (this.currency === 'PLN') {
        newCurrency = '₺';
        coefficient = 28.9;
    }

    this.currency = newCurrency;

    this.productsData.forEach((item: any) => {
      item.price = +(item.basePrice * coefficient).toFixed(1)
    })
  }
}
*/

// add realization 
/* 

  // currencyArray = [
  //   { currency: '$', coefficient: 1 },
  //   { currency: '₽', coefficient: 90 },
  //   { currency: '₴', coefficient: 30 }
  // ]
    
  // currency = this.currencyArray[this.index].currency;
  // coefficient = this.currencyArray[this.index].coefficient;

 // changeCurrency() {
  //   this.currency = this.currencyArray[++this.index % this.currencyArray.length].currency
  //   this.coefficient = this.currencyArray[this.index % this.currencyArray.length].coefficient;
  //   this.itemsProd.forEach((item) => {
  //     item.price = +(item.basePrice * this.coefficient).toFixed(1);
  //     if (this.currentOrder.hasOwnProperty(item.title)) {
  //       this.currentOrder[item.title].price = +(item.price * this.currentOrder[item.title].count).toFixed(1)
  //     }
  //   })

  //   this.feelForm();
  // }

*/


console.log(' ====== good project on Angular :) ====== ');
console.log(' ====== good project on Angular with backend database :) ====== ');
