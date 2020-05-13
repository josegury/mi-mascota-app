import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.page.html',
  styleUrls: ['./creditos.page.scss'],
})
export class CreditosPage implements OnInit {
  today = Date.now();
  constructor() { }

  ngOnInit() {
  }

}
