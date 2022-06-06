import { Post } from "./post.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();


  constructor (private http: HttpClient, private router: Router) {}
  uri: string = 'http://localhost:3000/api/posts/';

  getPosts(postsPerPage: number, currentPage: number) {

    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;

    this.http.get<{message: string, posts: any, maxPosts: number}>(this.uri + queryParams)
    .pipe(map( postData => { return { posts: postData.posts.map( post => { return { id: post._id, ...post}}),
                                      maxPosts: postData.maxPosts
                                    }
                           }
    ))
    .subscribe( (transformedPostData) => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts});
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http.post<{message: string, post: Post}>(this.uri, postData)
      .subscribe( (resData) => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
   return this.http.delete(this.uri+postId);
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>(this.uri+id);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;

    if(typeof(image) === 'object' ) {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    }
    else {
        postData = {id: id, title: title, content: content, imagePath: image};
    }

    this.http.put(this.uri+id, postData).subscribe( (response) => {
      this.router.navigate(["/"]);
    });

  }

}
