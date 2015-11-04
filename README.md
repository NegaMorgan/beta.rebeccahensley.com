# rebeccahensley.com

## Developing

rebeccahensley.com is a static web page. It uses Gulp as a build tool to prepare files, prefix CSS, and optimize images.

Development dependencies are NPM, Bower, Gulp, and ImageMagick.

Clone the project and `npm install && bower install` to resolve dependencies.

#### BrowserSync

Gulp compiles Less to the `dist` directory and BrowserSync makes a local server available for testing.

```bash
gulp serve
```

## Building

The default Gulp task lints the code and builds the source files to the `/dist` directory.

```bash
gulp
```

From there, you can publish to GitHub pages or a webserver.

```bash
git subtree push --prefix dist origin gh-pages
```

## To Do
* ~~make images smaller~~, get page size down
* ~~add analytics~~
* performance tuning
* ~~remove extra theme files (images, css)~~
* ~~metatags / seo~~
* cross browser testing
* add newsletter signup form
* accessibility / aria
