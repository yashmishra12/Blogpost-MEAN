import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "src/app/auth/login/login/login.component";
import { SignupComponent } from "src/app/auth/signup/signup/signup.component";
import { PostCreateComponent } from "src/app/posts/post-create/post-create.component";
import { PostListComponent } from "src/app/posts/post-list/post-list.component";

const routes: Routes = [
  {path: '', component: PostListComponent},
  {path: 'create', component: PostCreateComponent},
  {path: 'edit/:postID', component: PostCreateComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent}
];

@NgModule( {
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
