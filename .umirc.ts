import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
  ],
  npmClient: 'pnpm',
  fastRefresh: true,
  mfsu: false,
  title: '供应商数据大屏',
  define: {
    BREAKPOINT: 1280, // 在小于这个值的时候，采用移动端的布局
    ECHARTS_DEFAULT_HEIGHT: 324, // echarts默认的高度，在移动端布局的情况下有效
    ECHARTS_COUNT: 3, // 左右展示的echarts图表数量
    PADDING: 16, // 左右两边的padding
  },
  outputPath: 'build',
  hash: true,
  links: [
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
  ],
  chainWebpack(config) {
    config.module
      .rule('otf')
      .test(/.otf$/)
      .use('file-loader')
      .loader('file-loader');

    config.module
      .rule('ttf')
      .test(/.ttf$/)
      .use('file-loader')
      .loader('file-loader');
  },
});
