import { Component, Host, h, Prop, State } from '@stencil/core';
import fitvids from 'fitvids';

@Component({
  tag: 'app-post',
  styleUrl: 'app-post.css',
})
export class AppPost {

  @Prop() slug: string;
  @State() post: any;

  componentWillLoad() {
    this.getPosts();
  }

  componentDidRender() {
    fitvids()
  }

  async getPosts() {
  
    const response = await fetch('./assets/content/posts/' + this.slug + '.json');
    const post = await response.json();
    console.log(post)
    this.post = post;
  }

  render() {
    return (
      <Host>
        <ion-header>
          <ion-toolbar color="dark">
            <ion-buttons slot="start">
              <ion-back-button defaultHref="/" />
            </ion-buttons>
            <ion-title></ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          
        {this.post &&
            <main id="site-main" class="site-main outer">
              <div class="inner">

                  <article class="post-full">

                      <header class="post-full-header">

                          { this.post.primary_tag && <section class="post-full-tags">
                              <a href={this.post.primary_tag.url}>{this.post.primary_tag.name}</a>
                          </section> }
                        
                          <h1 class="post-full-title">{this.post.title}</h1>

                      
                          { this.post.custom_excerpt && <p class="post-full-custom-excerpt">{this.post.custom_excerpt}</p> }
                        

                          {/* <div class="post-full-byline">

                              <section class="post-full-byline-content">

                                  <ul class="author-list">
                                      {{#foreach authors}}
                                      <li class="author-list-item">

                                          <div class="author-card">
                                              {{#if profile_image}}
                                              <img class="author-profile-image" src="{{img_url profile_image size="xs"}}" alt="{{name}}" />
                                              {{else}}
                                              <div class="author-profile-image">{{> "icons/avatar"}}</div>
                                              {{/if}}
                                              <div class="author-info">
                                                  {{#if bio}}
                                                  <div class="bio">
                                                      <h2>{{name}}</h2>
                                                      <p>{{bio}}</p>
                                                      <p><a href="{{url}}">More posts</a> by {{name}}.</p>
                                                  </div>
                                                  {{else}}
                                                  <h2>{{name}}</h2>
                                                  <p>Read <a href="{{url}}">more posts</a> by this author.</p>
                                                  {{/if}}
                                              </div>
                                          </div>

                                          {{#if profile_image}}
                                          <a href="{{url}}" class="author-avatar">
                                              <img class="author-profile-image" src="{{img_url profile_image size="xs"}}" alt="{{name}}" />
                                          </a>
                                          {{else}}
                                          <a href="{{url}}" class="author-avatar author-profile-image">{{> "icons/avatar"}}</a>
                                          {{/if}}

                                      </li>
                                      {{/foreach}}
                                  </ul>

                                  <section class="post-full-byline-meta">
                                      <h4 class="author-name">{{authors}}</h4>
                                      <div class="byline-meta-content">
                                          <time class="byline-meta-date" datetime="{{date format="YYYY-MM-DD"}}">{{date format="D MMM YYYY"}}</time>
                                          <span class="byline-reading-time"><span class="bull">&bull;</span> {{reading_time}}</span>
                                      </div>
                                  </section>

                              </section>


                          </div> */}
                      </header>

                      { this.post.feature_image &&
                      <figure class="post-full-image">
                          <img
                              // srcset={this.post.feature_image} 300w,
                              //         {{img_url feature_image size="m"}} 600w,
                              //         {{img_url feature_image size="l"}} 1000w,
                              //         {{img_url feature_image size="xl"}} 2000w"
                              sizes="(max-width: 800px) 400px,
                                  (max-width: 1170px) 1170px,
                                      2000px"
                              src={this.post.feature_image}
                              alt={this.post.title}
                          />
                      </figure>
                      }

                      <section class="post-full-content">
                          <div class="post-content" innerHTML={this.post.html}></div>
                      </section>

                  </article>

              </div>
          </main>
        }
        </ion-content>
      </Host>
    );
  }

}
