import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  form: FormGroup;

  constructor(public postService: PostsService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup( {
      title: new FormControl(null, Validators.required),
      content: new FormControl(null, Validators.required)
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if(paramMap.has('postID')) {
            this.mode = 'edit';
            this.postID = paramMap.get('postID') ?? '';
            this.isLoading = true

            this.postService.getPost(this.postID).subscribe( (postData) => {
              this.post = {id: postData._id, title: postData.title, content: postData.content};
              this.form.setValue({'title': this.post.title, 'content':this.post.content})
              this.isLoading = false
            });
        }else {
          this.mode = 'create';
          this.postID = '';
        }
    } );

    console.log(this.form)
  }

  onSavePost() {
    if (this.form.invalid) { return }

    this.isLoading=true;

    if(this.mode === 'create') {
      this.postService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postService.updatePost(this.postID, this.form.value.title, this.form.value.content)
    }

    this.form.reset();
  }

}
