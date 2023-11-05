import schema from './schema.json'
import babel from '@babel/core'
function babelLoader(content, map, meta) {
  const callBack = this.async()
  const options = this.getOptions(schema)
  babel.transform(content, options, (err, result) => {
    const { code, map, ast } = result
    if (err) {
      callBack(err)
    } else {
      callBack(null, code, map, meta)
    }
  })
}

export default babelLoader
