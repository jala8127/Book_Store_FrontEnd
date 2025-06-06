import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.scss'
})
export class UserHomeComponent implements OnInit {

  topBooks: any[] = [];
  topAuthors: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.topBooks = [
      { title: 'Harry Potter', imageUrl: 'assets/images/hp.jpg' },
      { title: 'The Witcher', imageUrl: 'assets/images/witcher.webp' },
      { title: 'Solo Leveling', imageUrl: 'assets/images/solo.webp' },
      { title: 'The Road', imageUrl: 'assets/images/road.jpg' },
      { title: 'Percy Jackson', imageUrl: 'assets/images/rick.jpg' }
    ];

    this.topAuthors = [
      { title: 'Eichiro Oda', imageUrl: 'assets/images/oda.jpeg' },
      { title: 'J.K.Rowling', imageUrl: 'assets/images/rowling.jpeg' },
      { title: 'Cormac McCarthy', imageUrl: 'assets/images/mcarthy.jpeg' },
      { title: 'Harper Lee', imageUrl: 'assets/images/lee.jpeg' }
    ];
  }
}