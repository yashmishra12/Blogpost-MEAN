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
  isLoading = false;

  ngOnInit(): void {
    this.postService.getPosts();
    this.isLoading=true
    this.postSub = this.postService.getPostUpdateListener().subscribe( (post: Post[])=> {
      this.posts=post;
      this.isLoading=false;
    });
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }
}
