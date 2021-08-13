const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // webpack5: false,
  // webpack(config) {
  //   const rule = config.module.rules
  //     .find(rule => rule.oneOf)
  //     .oneOf.find(r => {
  //       return r.issuer?.and?.includes(
  //         path.join(process.cwd(), 'src', 'pages', '_app.tsx')
  //       );
  //     });

  //   const ruleToRemove = config.module.rules
  //     .find(rule => rule.oneOf)
  //     .oneOf.findIndex(r => {
  //       return r.issuer?.and?.[0].toString() === '/node_modules/';
  //     });

  //   config.module.rules.find(rule => rule.oneOf).oneOf.splice(ruleToRemove, 1);

  //   const ruleToRemove2 = config.module.rules
  //     .find(rule => rule.oneOf)
  //     .oneOf.findIndex(r => {
  //       return (
  //         r.test?.join?.(',') ===
  //           '/(?<!\\.module)\\.css$/,/(?<!\\.module)\\.(scss|sass)$/' &&
  //         r.use?.[0]?.loader === 'error-loader'
  //       );
  //     });

  //   config.module.rules.find(rule => rule.oneOf).oneOf.splice(ruleToRemove2, 1);

  //   if (rule) {
  //     rule.issuer.and.push(/\.css$/, /\.js$/);
  //   }

  //   return config;
  // },
};
