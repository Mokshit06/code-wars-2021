import axios from 'axios';
import esbuild, { Plugin } from 'esbuild';
import { URL } from 'url';

const httpPlugin: Plugin = {
  name: 'http',
  setup(build) {
    build.onResolve({ filter: /^https?:\/\// }, args => ({
      path: args.path,
      namespace: 'http-url',
    }));

    build.onResolve({ filter: /.*/, namespace: 'http-url' }, args => {
      return {
        path: new URL(args.path, args.importer).toString(),
        namespace: 'http-url',
      };
    });

    build.onLoad({ filter: /.*/, namespace: 'http-url' }, async args => {
      const { data: contents } = await axios.get(args.path);
      return { contents };
    });
  },
};

const virtualFs = (code: string): Plugin => ({
  name: 'virtual-fs',
  setup(build) {
    build.onResolve({ filter: /.*/ }, args => {
      if (args.path === '__ENTRY__.tsx') {
        return {
          namespace: 'virtual-fs',
          path: args.path,
        };
      }

      return {
        namespace: 'http-url',
        path: `https://cdn.skypack.dev/${args.path}`,
      };
    });

    build.onLoad({ filter: /.*/, namespace: 'virtual-fs' }, async args => {
      if (args.path === '__ENTRY__.tsx') {
        return {
          contents: code,
          loader: 'tsx',
        };
      }

      return {
        contents: `export default {}`,
        loader: 'tsx',
      };
    });
  },
});

export default async function build(code: string) {
  const result = await esbuild.build({
    entryPoints: ['__ENTRY__.tsx'],
    bundle: true,
    write: false,
    minify: true,
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    plugins: [httpPlugin, virtualFs(code)],
  });

  return result.outputFiles[0].text;
}
