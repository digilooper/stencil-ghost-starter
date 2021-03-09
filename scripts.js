const fetch = require('node-fetch');
const fs = require('fs');
const fse = require('fs-extra');
const request = require('request');
const download = require('image-downloader');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

//const api_key = '27bcf04fa982ca03b8323b5781';
//const api_url = 'http://localhost:2368/ghost/api/v3/content/posts';

const api_key = '5a562eebab8528c44e856a3e0a';
const api_url = 'https://eleventy.ghost.io';
const site_url = 'http://localhost:3333';
const content_path = '/assets/content/images';


const init = async () => {

    processData();

}

const processData = async ( ) => {

    let page = 1;

    const firstdata = await contentrequest(page);

    for (i = 0; i < firstdata.meta.pagination.pages; i++) {

        const data = await contentrequest(i);

        if ( data ) {
            const stringdata = JSON.stringify(data);

            let regExp = new RegExp(api_url + '/content/images');
    
            let newStr = stringdata.replace(regExp, content_path, 'g' );
    
            fse.outputFile( 'src/assets/content/posts/pagination/' + data.meta.pagination.page + '.json', newStr, function (err) {
                if (err) throw err;
                console.log('pagination created successfully.');
            });
            
            data.posts.map( async post => {
    
                const dom = new JSDOM(post.html , { includeNodeLocations: true } );
                const images = dom.window.document.querySelectorAll("img");
                
                images.forEach(function(image) {
    
                    const src = image.getAttribute('src');
                    const url = new URL(src);
    
                    const path = './src/assets/content/images' + url.pathname;
    
                    processImage( url.href, path );
    
                    let regExp = new RegExp(url.href);
                    let newStr = post.html.replace(regExp, content_path + url.pathname );
                    post.html = newStr;
    
                });
    
                post.html = await processLinks(post.html);
    
                const feature_url = new URL(post.feature_image);
                const feature_path = './src/assets/content/images' + feature_url.pathname;
                processImage( feature_url.href, feature_path );
    
                post.feature_image = '/assets/content/images' + feature_url.pathname;
    
                fse.outputFile( 'src/assets/content/posts/' + post.slug + '.json', JSON.stringify(post), function (err) {
                    if (err) throw err;
                    console.log( post.title + ' created successfully.');
                });
            });
        }
    }
}

const contentrequest = async ( page = 1 ) => {

    try {
        const response = await fetch( api_url + '/ghost/api/v3/content/posts' + '?key=' + api_key + '&page=' + page);
        const data = await response.json();
        console.log('Retrieved api data...');
        return data;
    } catch {
        return;
    }
 
}

const processImage = async ( src, path ) => {

    // Create a folder path to download into.
    const split = path.split('/');
    const filename = split.pop();
    let newpath = path.replace(filename, '' );

    try {
        if (!fs.existsSync(newpath)) {
            fse.ensureDirSync(newpath)
        }
    } catch (err) {
        console.error(err)
    }

    // Only download images that do not exists locally.
    try {
        if (!fs.existsSync(path)) {
            const options = {
                url: src,
                dest: path 
              }
              
              download.image(options)
                .then(({ filename }) => {
                  console.log('Saved to', filename)
                })
                .catch((err) => console.error(err))
        }
    } catch (err) {
        console.error(err)
    }


}

// Convert anchor tags to ion-router-links.
const processLinks = async ( html ) => {

    let newHTML = html;

    const dom = new JSDOM(html , { includeNodeLocations: true } );
    const links = dom.window.document.querySelectorAll("a");

    links.forEach(function(link) {

        const href = link.getAttribute('href');
        const url = new URL(href);

        if ( api_url === url.origin ) {
            const stripped = url.pathname.replace(/\/$/, '');
            const old_link = '<a href="' + url.href + '">' + link.text + '</a>';
            const router_link = '<ion-router-link href=' + stripped + '>' + link.text + '</ion-router-link>';
            let regExp = new RegExp(old_link);
            let newStr = html.replace(regExp, router_link);

            newHTML = newStr;
        }

    });

    return newHTML;

}


init();
