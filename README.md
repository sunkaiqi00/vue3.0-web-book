# web-book

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

```
const a = [
  [1, 2, 3],
  [4, 5, 6]
]
console.log([].concat.apply([], a))
```

```
const flatten = (array) => {
  return [].concat(...array.map(item => [].concat(item, ...flatten(item.subitems))))
}
```
