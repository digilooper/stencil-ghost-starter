import { Config } from '@stencil/core';
import { postcss } from '@stencil/postcss';
import autoprefixer from 'autoprefixer';
import postcssColorMod from 'postcss-color-mod-function';

// https://stenciljs.com/docs/config

export const config: Config = {
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.css',
  taskQueue: 'async',
  outputTargets: [{
    type: 'www',
    serviceWorker: null,
    copy: [
      { src: '_redirects' }
    ]
  }],
  plugins: [
    postcss({
      plugins: [
        autoprefixer(),
        postcssColorMod()
      ]
    }),
  ]
};
