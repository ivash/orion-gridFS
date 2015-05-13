Package.describe({
  name: 'brightbind:orion-gridfs',
  summary: 'Local storage (with gridFS) for orion:filesystem',
  version: '0.1.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use([
    'orionjs:core@1.0.0',
    'orionjs:filesystem@1.0.1',
    'cfs:standard-packages@0.5.9',
    'cfs:gridfs@0.0.33',
    'underscore'
    ]);

  api.addFiles([
    'gridfs.js',
    ]);

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('orionjs:filesystem');
});
