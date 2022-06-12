module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          "~assets": "./src/assets",
          "~config": "./src/config",
          "~html": "./src/html",
          "~middlewares": "./src/middlewares",
          "~models": "./src/models",
          "~routes": "./src/routes",
          "~services": "./src/services",
          "~websockets": "./src/websockets",
          "~tokens": "./src/tokens",
          "~types": "./src/@types",
          "~uploads": "./src/uploads",
          "~utils": "./src/utils",
        },
      },
    ],
  ],
  ignore: ["**/*.spec.ts"],
};
