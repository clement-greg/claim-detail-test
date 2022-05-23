import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maint-services-order',
  templateUrl: './maint-services-order.component.html',
  styleUrls: ['./maint-services-order.component.css']
})
export class MaintServicesOrderComponent implements OnInit {


  services: any[];
  packages: any[];
  landscapeFlipped = false;
  selectedIndex = 0;
  shoppingCartOpen = false;
  upgrades: any[];
  bundles: any[];

  cartItems: CartItem[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get(`/assets/json/maintenance-services.json`).subscribe((results: any) => {
      console.log(results);

      this.services = results;
    });

    this.http.get(`/assets/json/lawn-packages.json`).subscribe((results: any) => {
      console.log(results);

      this.packages = results;
    });

    this.http.get('/assets/json/additional-services.json').subscribe((results: any) => this.upgrades = results);
    this.http.get('/assets/json/bundles.json').subscribe((results: any) => this.bundles = results);

  }

  toggleUpgrade(upgrade) {
    if (upgrade.selected) {
      const cartItem = this.cartItems.find(i => i.description === upgrade.name);
      if (cartItem) {
        this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
      }
    } else {
      const cartItem = new CartItem();
      cartItem.amount = upgrade.startPrice;
      cartItem.description = upgrade.name;
      this.cartItems.push(cartItem);
    }

    upgrade.selected = !upgrade.selected;
  }

  addLandscapingPackage(packageItem) {
    this.selectedIndex = 3;
    const cartItem = new CartItem();
    cartItem.description = packageItem.name;
    cartItem.amount = packageItem.startPrice;
    this.cartItems.push(cartItem);
  }

  toggleShoppingCart() {
    this.shoppingCartOpen = !this.shoppingCartOpen;
  }

  deleteCartItem(cartItem: CartItem) {
    this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
    if (this.cartItems.length === 0) {
      this.shoppingCartOpen = false;
      this.selectedIndex = 0;
    }
  }
}

export class CartItem {
  description: string;
  amount: number;
}