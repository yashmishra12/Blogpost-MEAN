import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  private mode = 'create';
  private postID: string;
  post: Post;
  isLoading = false;

  constructor(public postService: PostsService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if(paramMap.has('postID')) {
            this.mode = 'edit';
            this.postID = paramMap.get('postID') ?? '';
            this.isLoading = true

            this.postService.getPost(this.postID).subscribe( (postData) => {
              this.post = {id: postData._id, title: postData.title, content: postData.content}
              this.isLoading = false
            });
        }else {
          this.mode = 'create';
          this.postID = '';
        }
    } );
  }

  onSavePost(form: NgForm) {
    if (form.invalid) { return }

    this.isLoading=true;

    if(this.mode === 'create') {
      this.postService.addPost(form.value.title, form.value.content);
    } else {
      this.postService.updatePost(this.postID, form.value.title, form.value.content)
    }
    form.resetForm();
  }

}
