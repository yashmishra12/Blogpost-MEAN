import { Component, OnInit } from '@angular/core';
import { Posts } from './Posts';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})



export class PostListComponent implements OnInit {

  constructor() { }
  posts: Posts[] = [];

  ngOnInit(): void {
  }

}
