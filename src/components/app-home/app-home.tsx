import { Component, Host, h, State } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
})
export class AppHome {

  @State() posts: any;

componentWillLoad() {

  this.getPosts();

}

async getPosts() {
  
  const response = await fetch('./assets/content/posts/pagination/1.json');
  const posts = await response.json();
  this.posts = posts.posts;
}


  render() {
    return (
      <Host>
        <ion-header>
          <ion-toolbar color="dark">
            <ion-title>Home</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <p class="ion-padding">
            Welcome to the Stencil Static CMS. You can use this starter to build entire apps with web components using Stencil and ionic/core! Check out the README for everything that comes
            in this starter out of the box and check out our docs on <a href="https://stenciljs.com">stenciljs.com</a> to get started.
          </p>

          <ion-list>
            { this.posts && this.posts.map( post => [
              <ion-item href={'/' + post.slug} detail>
                <ion-label class="ion-text-wrap">
                  <h2>{post.title}</h2>
                  <div innerHTML={post.excerpt}></div>
                </ion-label>
              </ion-item>
            ])}
          </ion-list>
        </ion-content>
      </Host>
    );
  }
}
