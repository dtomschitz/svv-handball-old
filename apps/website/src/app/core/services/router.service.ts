import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  constructor(private router: Router, private location: Location) {}

  navigate(path: string | string[]) {
    this.router.navigate(Array.isArray(path) ? path : [path]);
  }

  back() {
    this.location.back();
  }

  forward() {
    this.location.forward();
  }
}
