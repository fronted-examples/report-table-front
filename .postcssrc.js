// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  plugins: {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    autoprefixer: {},
    "postcss-px2rem": {
      //UI图片的基准值 750px就是75,640px就是64,默认为75
      remUnit: 16,
      remPrecision: 6, //准换成rem后的小数点精确数位 默认为6
      baseDpr: 2 //基准device pixel ratio值 默认为2
      //当然npm上还有很多options 按需求配置
    }
  }
};
