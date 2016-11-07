import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import inject from 'rollup-plugin-inject';

const pkg = require('./package.json');
const external = Object.keys(pkg.dependencies);

const globals = {
  jquery: 'jQuery',
  'jquery-serializejson': 'serializeJSON'
}

export default {
  entry: 'src/formhelper.js',
  plugins: [
    inject({
      include: 'node_modules/jquery-serializejson/**',
      modules: { jQuery: 'jquery' }
    }),
    babel(babelrc())
  ],
  external: external,
  targets: [
    {
      dest: pkg['main'],
      format: 'umd',
      moduleName: 'formHelper',
      moduleId: 'formhelper',
      sourceMap: true,
      globals
    },
    {
      dest: pkg['jsnext:main'],
      format: 'es',
      sourceMap: true,
      globals
    }
  ]
};
