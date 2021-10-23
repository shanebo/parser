# Parser

Middleware for Dylan which provides parsing of posted data.

## Install

`npm install @dylan/parser`

## Usage

``` js
const dylan = require('dylan');
const parser = require('@dylan/parser');
const app = dylan();

app.use(parser());
```
