module.exports = {
  camelToSnake,
  snakeToCamel,
}

function camelToSnake(s) {
  // helloWorld => hello_world
  return s.replace(/[A-Z]/g, m => `_${m[0].toLowerCase()}`)
}

function snakeToCamel(s) {
  // hello_world => helloWorld
  // _test_hello => _testHello
  return s.toLowerCase().replace(/(\w)_(\w)/g, m => m[0] + m[2].toUpperCase())
}
