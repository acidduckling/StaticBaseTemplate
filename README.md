# Static Website Template
This is just a very simple template for building a static vanilla website with some very basic Gulp tasks configured to build and minify CSS and JS to the dist folder.

## .ENV File

The .env file has the environment name configured (typically **development** or **production**). The environment value is then loaded into the Gulp scripts using dotenv package. Using dotenv, the environment can easily be read with the following:

```javascript
process.env.ENVIRONMENT
```

## Dev Server
The project uses the Browser Sync package to offer a localhost serving and hot reloading for the browser, and file watchers for auto copying the files to dist.

Launch the server with
```bash
npm run serve
```

Manually run a build (without serving) using
```bash
npm run build
```