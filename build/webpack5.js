const path = require('path');
const fs=require('fs')
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin=require('mini-css-extract-plugin')
const CaseSensitivePathsPlugin=require('case-sensitive-paths-webpack-plugin')

const chalk=require('chalk')

const {
  APP_PATH,
  getRuntimeArgv,
  checkEnv,
  run,
}=require(__dirname+'/lib')
const {NPM_ARGV, IS_DEV, IS_BUILD, IS_SERVE}=getRuntimeArgv()

const [outputPath, publicPath]=IS_DEV? ['dist', '/']: ['server/public/app', '/assets/app/']

class RemoveAssetsPlugin {
  constructor(pattern=/\.txt$/) {
    this.pattern=pattern
  }
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('RemoveAssetsPlugin', (compilation) => {
      compilation.hooks.afterProcessAssets.tap('RemoveAssetsPlugin', (assets) => {
        for(const file of Object.keys(assets)) {
          if(file.match(this.pattern)) {
          compilation.deleteAsset(file);
            delete assets[file]
          }
        }
      });
    });
  }
}

function replaceDevName(x) {
  if(IS_DEV) return x.replace(/\[contenthash\]/g, '')
  return x
}

const common = (isServer)=>({
  optimization: {
    runtimeChunk: false,
    splitChunks: (isServer || IS_DEV)? false: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/, // Target libraries in node_modules
          name: 'vendor',                 // Name of the output chunk
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // Babel のキャッシュを有効化
              cacheDirectory: true,
              targets: "> 0.25%, not ie <= 8",
              presets: [
                [
                  '@babel/preset-env',
                  {
                    bugfixes: true,
                    corejs: 3,
                    useBuiltIns: 'usage'
                  }
                ],
                ['@babel/preset-react', { runtime: 'automatic' }]
              ],
              plugins: ['@babel/plugin-transform-runtime']
            }
          },
        ]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        loader: 'sptc/dist/webpack.loader.js',
        options: {
          file: path.resolve(__dirname, 'sptc.inject.js'),
        }
      },
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'],
    alias: {
      '@': APP_PATH+'/src',
    },
  },

  // 開発時に自動リビルド + 再起動を行う簡易スクリプト例
  // （別途 `scripts/start-ssr-server.js` で実装）
  watch: IS_DEV? true: false,

  // source map でデバッグしやすく
  devtool: IS_DEV? 'source-map': false,

  plugins: [
    new RemoveAssetsPlugin(),
    new CaseSensitivePathsPlugin(),
  ],

});

const client = merge(common(false), {
  name: 'client',
  target: ['web', 'es5'],

  mode: IS_DEV? 'development': 'production',

  entry: {
    main: path.resolve(APP_PATH, 'src/bootstrap.jsx')
  },

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          outputPath: 'client/images',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
           loader: "postcss-loader",
           options: {
             postcssOptions: require(__dirname+"/postcss.config.js"),
           },
         },
          "sass-loader",
        ],
      }
    ]
  },

  // 出力先はすべて同じディレクトリにまとめる
  output: {
    path: APP_PATH+'/'+outputPath,
    publicPath: publicPath,
    filename: replaceDevName(`client/js/[name].[contenthash].js`),
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: replaceDevName(`client/css/[name].[contenthash].css`),
      chunkFilename: replaceDevName(`client/css/[name].[contenthash].chunk.css`),
    }),
  ],

});

const server = merge(common(true), {
  name: 'server',
  target: 'node',               // Node 用ビルド
  mode: IS_DEV? 'development': 'production',
  entry: {
    server: path.resolve(APP_PATH, 'src/bootstrap.jsx')
  },

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          emitFile: false,
          outputPath: 'client/images',
        },
      },
      {
        test: /\.s?css$/i,
        loader: 'file-loader',
        options: {
          emitFile: false,
        },
      }
    ]
  },

  // Node のモジュールはバンドルしない（高速化・サイズ削減）
  externals: [nodeExternals()],

  // 出力先はすべて同じディレクトリにまとめる
  output: {
    path: APP_PATH+'/'+outputPath,   // ← ここが **outputPath** の指定箇所
    publicPath: publicPath, // 開発サーバーでのベース URL
    filename: 'server.js',
    libraryTarget: 'commonjs2', // Node が require できる形
  },
});

function getWebpackCompiler() {
  const config=[client, server]
  const multiCompiler=webpack(config)

  multiCompiler.hooks.done.tap('done', (stats)=>{
    const [clientStats, serverStats] = stats.toJson({
      all: true,
      warnings: true,
      errors: true,
      modules: true,
      entrypoints: true,
      publicPath: false,
    }).children

    const errors=[...clientStats.errors, ...serverStats.errors]
    const warnings=[...clientStats.warnings, ...serverStats.warnings]

    if(errors.length) {
      console.log(chalk.red('Failed to compile.\n'))
      console.log(errors[0])
    }
    if(warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.\n'))
      console.log(warnings.map(x=>x.message).join('\n'))
    }
    const assets=resolveAssets(clientStats.entrypoints.main.assets)
    fs.writeFileSync(APP_PATH+'/'+outputPath+'/assets.json', JSON.stringify(assets))
    console.info(stats.toString({ colors: true }))
  })
  return multiCompiler
}

function resolveAssets(assets) {
  const ret={
    js: [],
    css: [],
  }
  for(let x of assets) {
    if(/\.js$/.test(x.name)) ret.js.push(x.name)
    if(/\.css$/.test(x.name)) ret.css.push(x.name)
  }
  return ret
}

function devServer() {
  const WebpackDevServer=require('webpack-dev-server')
  const multiCompiler=getWebpackCompiler()
  const devServerOptions = {
    compress: false,
    hot: true,
    port: 3000,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    },
    historyApiFallback: true,
    devMiddleware: {
      // Enables writing files to disk
      writeToDisk: filePath=>/server\.js/.test(filePath),
    },
  };
  const devServer = new WebpackDevServer(devServerOptions, multiCompiler);
  const runServer = async () => {
    console.log("Starting server...");
    await devServer.start();
  };

  run('sptcd', '-d -rindex.s -wserver'.split(' '))

  runServer();

}

function build() {
  const compiler=getWebpackCompiler()
  compiler.run()
}

checkEnv()


async function cleanDir(dir, stack=[]) {
  for(const fn of fs.readdirSync(dir)) {
    const fullname=dir+'/'+fn
    const isdir=fs.statSync(fullname).isDirectory()
    if(isdir) {
      await cleanDir(fullname, stack)
    }
    const err=await new Promise(r=>{
      fs[isdir? 'rmdir': 'unlink'](fullname, r)
    })
    if(err) throw err
  }
}

cleanDir(APP_PATH+'/'+outputPath).catch(e=>{}).finally(()=>{

  if(IS_DEV) {
    devServer()
  }else if(IS_BUILD) {
    build()
  }
})
