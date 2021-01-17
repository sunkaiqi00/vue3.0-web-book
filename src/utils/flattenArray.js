const flatten = (array) => {
  return [].concat(...array.map(item => [].concat(item, ...flatten(item.subitems))))
}

export default flatten
