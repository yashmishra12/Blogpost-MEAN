import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

  constructor(public postService: PostsService, private authServie: AuthService) { }

  posts: Post[] = [];
  private postSub!: Subscription;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;
  userId: string;

  isLoading = false;
  totalPosts = 0;
  postsPerPage = 50;
  currentPage = 1;
  pageSizeOptions = [1, 5, 10, 20, 50]

  ngOnInit(): void {
    this.isLoading=true

    this.userId = this.authServie.getUserId();

    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postSub = this.postService.getPostUpdateListener().subscribe( (postData: {posts: Post[], postCount: number}) => {
      this.isLoading=false;
      this.totalPosts = postData.postCount
      this.posts=postData.posts;
    });

    this.userIsAuthenticated = this.authServie.getIsAuth();

    this.authStatusSub =  this.authServie.getAuthStatusListener().subscribe( isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authServie.getUserId();
    });

  }

  onDelete(postId: string) {
    this.postService.deletePost(postId).subscribe( () => {
      this.isLoading = true;
      this.postService.getPosts( this.postsPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;

    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
