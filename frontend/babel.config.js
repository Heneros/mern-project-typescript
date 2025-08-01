module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['last 2 versions']
      },
      modules: false,
      useBuiltIns: 'entry',
      corejs: 3
    }],
    ['@babel/preset-react', {
      runtime: 'automatic'
    }],
    '@babel/preset-typescript'
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    ['babel-plugin-module-resolver', {
      root: ['./src'],
      alias: {
        'app': './src/app',
        'entities': './src/entities', 
        'features': './src/features',
        'pages': './src/pages',
        'shared': './src/shared',
        'widgets': './src/widgets',
        'components': './src/components'
      }
    }]
  ],
  env: {
    development: {
      plugins: ['react-refresh/babel']
    }
  }
};