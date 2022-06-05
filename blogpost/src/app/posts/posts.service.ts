import { Post } from "./post.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { v4 as uuidv4 } from 'uuid';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor (private http: HttpClient) {}
  uri: string = 'http://localhost:3000/api/posts';

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>(this.uri)
    .subscribe( (postData) => {
      this.posts = postData.posts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: uuidv4(), title: title, content: content};

    this.http.post<{message: string}>(this.uri, post)
      .subscribe( (resData) => {
        console.log(resData.message)
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
