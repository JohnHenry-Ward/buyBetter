import { GithubFollowersComponent } from './github-followers/github-followers.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { AppRoutingModule } from './services/app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { PostsComponent} from './posts/posts-component.component';
import { PostService } from './services/post.service';
import { AppErrorHandler } from './common/app-error-handler';
import { HttpExerciseComponent } from './http-exercise/http-exercise.component';
import { GithubFollowersService } from './github-followers.service';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { GithubProfileComponent } from './github-profile/github-profile.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    HttpExerciseComponent,
    NavbarComponent,
    HomeComponent,
    GithubProfileComponent,
    GithubFollowersComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent 
      },
      { 
        path: 'followers/:id/:username',
        component: GithubProfileComponent 
      },
      { 
        path: 'followers/:username',
        component: GithubProfileComponent 
      },
      { 
        path: 'followers',
        component: GithubFollowersComponent, 
      },
      { 
        path: 'profile/:username',
        component: GithubProfileComponent 
      },
      { 
        path: 'posts',
        component: PostsComponent 
      },
      { 
        path: '**',
        component: NotFoundComponent 
      },
    ])
  ],
  providers: [
    PostService,
    GithubFollowersService,
    { provide: ErrorHandler, useClass: AppErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
