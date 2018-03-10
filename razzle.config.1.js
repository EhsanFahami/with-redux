'use strict';

const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const {
  CheckerPlugin,
  TsConfigPathsPlugin,
} = require('awesome-typescript-loader');
const HappyPack = require('happypack');

module.exports = {
  modify: (baseConfig, { target, dev }, webpack) => {
    const appConfig = Object.assign({}, baseConfig);
  
    // Setup TypeScript
    appConfig.module.rules.push({
      test: /\.tsx?$/,
      use: 'awesome-typescript-loader',
      exclude: /node_modules/,
    });

    appConfig.resolve.extensions = appConfig.resolve.extensions.concat([
      '.ts',
      '.tsx',
    ]);

    appConfig.devtool = 'cheap-module-source-map';
    appConfig.plugins.push(new CheckerPlugin());
    appConfig.plugins.push(new TsConfigPathsPlugin());
    
    
    // Setup HappyPack to speed up Babel
    let babelOptions;
    appConfig.module.rules = appConfig.module.rules.map(rule => {
      if (rule.loader === 'babel-loader') {
        babelOptions = rule.options;

        return {
          test: rule.test,
          include: rule.include,
          use: {
            loader: require.resolve('happypack/loader'),
            query: { id: 'babel' },
          },
        };
      }

      return rule;
    });

    appConfig.plugins.push(
      new HappyPack({
        id: 'babel',
        loaders: [
          {
            path: require.resolve('babel-loader'),
            query: babelOptions,
          },
        ],

        verbose: false,
      })
    );
    
    
    // Setup SCSS
    if (target === 'web') {
      appConfig.module.rules.push(
        dev
          ? {
              test: /.scss$/,
              use: [
                'style-loader',
                {
                  loader: 'css-loader',
                  options: {
                    modules: false,
                    sourceMap: true,
                  },
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
                    plugins: () => [
                      autoprefixer({
                        browsers: [
                          '>1%',
                          'last 4 versions',
                          'Firefox ESR',
                          'not ie < 9', // React doesn't support IE8 anyway
                        ],
                      }),
                    ],
                  },
                },
                'sass-loader',
              ],
            }
          : {
              test: /.scss$/,
              use: scssPlugin.extract({
                fallback: 'style-loader',
                use: [
                  {
                    loader: 'css-loader',
                    options: {
                      importLoaders: 1,
                    },
                  },
                  {
                    loader: 'postcss-loader',
                    options: {
                      ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
                      plugins: () => [
                        autoprefixer({
                          browsers: [
                            '>1%',
                            'last 4 versions',
                            'Firefox ESR',
                            'not ie < 9', // React doesn't support IE8 anyway
                          ],
                        }),
                      ],
                    },
                  },
                  'sass-loader',
                ],
              }),
            }
      );
      
      if (!dev) {
        appConfig.plugins.push(
          new ExtractTextPlugin('static/css/[name].[contenthash:8].css')
        )
      }
      
      
      // Setup Vendor Bundle
      appConfig.entry.vendor = [
        'react',
        'react-dom',
        'react-router-dom',
        'redux',
        'react-redux',
        'redux-thunk',
        'redux-pack',
        'react-helmet',
        'axios',
      ];

      appConfig.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
          names: ['vendor', 'manifest'],
          minChunks: Infinity,
        })
      );
      // extract common modules from all the chunks (requires no 'name' property)
      appConfig.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
          async: true,
          children: true,
          minChunks: 4,
        })
      );

     
    } else {
      // On the server, we can just simply use css-loader to
      // deal with scss imports
      appConfig.module.rules.push({
        test: /.scss$/,
        use: 'css-loader',
      });
    }

    return appConfig;
  },
};