import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})



export class PostListComponent implements OnInit, OnDestroy {

  constructor(public postService: PostsService) { }

  posts: Post[] = [];
  private postSub!: Subscription;

  ngOnInit(): void {
    this.posts = this.postService.getPosts();
    this.postSub = this.postService.getPostUpdateListener().subscribe( (post: Post[])=> { this.posts=post; });
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }

}
