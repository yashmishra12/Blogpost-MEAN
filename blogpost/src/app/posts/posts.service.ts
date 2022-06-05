import { Post } from "./post.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor (private http: HttpClient) {}
  uri: string = 'http://localhost:3000/api/posts/';

  getPosts() {
    this.http.get<{message: string, posts: any}>(this.uri)
    .pipe(map( postData => {return postData.posts.map(
      (post: { title: string; content: string; _id: any; }) => {
        return { title: post.title, content: post.content, id: post._id}
      })}
    ))
    .subscribe( (transformedPost) => {
      this.posts = transformedPost;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: "willBeReplaced", title: title, content: content};

    this.http.post<{message: string, postId: string}>(this.uri, post)
      .subscribe( (resData) => {
        post.id = resData.postId; //mongoDB mai jo ID dia woh daalo

        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http.delete(this.uri+postId).subscribe( () => {
      const updatedPost = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPost;
      this.postsUpdated.next([...this.posts]);
    });
  }
}
