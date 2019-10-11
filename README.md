# Boilerplate
## Workflow for small HTML, SCSS, Javascript ES6 projects.

This workflow is using GulpJS, Sass, browserSync, webpack and Babel to allows you to compile your SCSS files in CSS files, forget about -webkit- prefixing and earn some time reloading your page with an autoreload system when you save your HTML, SCSS or JS files.
You can also use BrowserSync to open your html pages on your mobile or other devices simultaneously.
Use imports and exports calls to organize your javascripts files and your js librairies and write ES6 Javascript without worrying about browser compatibility.

## Getting started


### Clone this repository

```
git clone git@github.com:leochocolat/boilerplate.git
```

### Make sure you have Node, NPM and Gulp on your machine :

Type these commands on your terminal
```
$ node --version
```
```
$ npm --version
```

* If you don't have Node Installed :
[Install Node](https://nodejs.org/en/download/)
* If you don't have NPM :
[Install NPM](https://www.npmjs.com/get-npm)

### Install Gulp Globaly :
```
$ npm install --global gulp-cli
```

Verify your gulp installation typing :
```
$ gulp --version
```

### Install dependencies

Got to your project folder :
```
$ cd boilerplate
```
You can now install all the dependencies you need by running :
```
$ npm install
```

### Start

#### Run Gulp
You are almost ready to go, you just need to run :
```
$ npm start
```
Your Home page will open on localhost:3000, your scss files will be compiled and all your files watched to live reload your html page when saved.

#### Run Webpack

If you want to compile your js files, you can run :
```
$ npm run develop
```

### Create production build 
```
$ npm run production
```

Your js files will be compiled and import/export calls will be translated to be understood by your browser.

## TODO

* Add sources manager with webpack
* Add HTML templating system (Handlebars?)

## Copyright

developed by [Léo Mouraire](https://leomouraire.com)
