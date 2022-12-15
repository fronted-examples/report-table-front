module.exports = function () {
  return {
    presets: ['@vue/cli-plugin-babel/preset'],
    plugins: [
      [
        'import',
        {
          libraryName: 'library-ui',
          style: (name) => {
            return `${name}/index.css`
          },
          camel2DashComponentName: false, // 是否需要驼峰转短线
          camel2UnderlineComponentName: false // 是否需要驼峰转下划线
        }
      ],
      "transform-object-rest-spread"
      // "@babel/plugin-syntax-object-rest-spread"
    ]
  }
}
