import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

import {mimeType} from "./mime-type.validator"

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
  imagePreview: string = "";
  form: FormGroup;


  constructor(public postService: PostsService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup( {
      title: new FormControl(null, Validators.required),
      content: new FormControl(null, Validators.required),
      image: new FormControl(null, Validators.required, mimeType)
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if(paramMap.has('postID')) {
            this.mode = 'edit';
            this.postID = paramMap.get('postID');
            this.isLoading = true

            this.postService.getPost(this.postID).subscribe( (postData) => {

              this.isLoading = false

              this.post = {id: postData._id,
                           title: postData.title,
                           content: postData.content,
                           imagePath: postData.imagePath,
                          creator: postData.creator};
              this.form.setValue({title: this.post.title, content:this.post.content, image: this.post.imagePath})

            });
        }else {
          this.mode = 'create';
          this.postID = null;
        }
    } );
  }

  onSavePost() {
    if (this.form.invalid) { return }

    this.isLoading=true;

    if(this.mode === 'create') {
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postService.updatePost(this.postID, this.form.value.title, this.form.value.content, this.form.value.image)
    }

    this.form.reset();
  }

  onImageUploaded(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();

    reader.onload = () => { this.imagePreview = reader.result as string };

    reader.readAsDataURL(file);
  }

}
