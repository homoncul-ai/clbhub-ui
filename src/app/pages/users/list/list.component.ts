import { Component, inject, OnInit } from '@angular/core';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  standalone: false,
})
export class ListComponent implements OnInit {
  users: any[] = [];
  isLoading = true;


  ngOnInit() {

  }

  userClicked() {

  }
}
