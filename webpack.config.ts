import webpack from 'webpack';
import path from 'path';

const srcDir = path.join(__dirname, 'src');
const isProduction = process.env.NODE_ENV === 'production';
const config: webpack.Configuration = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    main: path.join(srcDir, 'main.ts'),
    inject: path.join(srcDir, 'inject.ts')
  },
  output: {
    path: path.join(__dirname, 'public', 'js'),
    filename: '[name].js'
  },
  devtool: isProduction ? false : 'cheap-module-source-map',
  resolve: {
    extensions: ['.ts']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: srcDir,
        exclude: '/node_modules/',
        use: 'ts-loader'
      }
    ]
  }
};

export default config;
