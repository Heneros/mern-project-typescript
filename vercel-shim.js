require('ts-node').register({
  project: 'tsconfig.build.json',
  transpileOnly: true,
  files: true,
  ignore: [
    '/(node_modules)/',
    '/(dist)/',
    '/(frontend)/'
  ]
});

require('tsconfig-paths/register');
require('./backend/server.ts');