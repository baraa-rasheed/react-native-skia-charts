// Resolve the library from ../src so edits hot-reload in the example app.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const root = path.resolve(__dirname, '..');
const config = getDefaultConfig(__dirname);
config.watchFolders = [root];
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];
config.resolver.extraNodeModules = { '@baraa-rasheed/skia-charts': path.join(root, 'src') };
config.resolver.disableHierarchicalLookup = true;
module.exports = config;
