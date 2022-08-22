<template>
  <section class="book-reader">
    <section class="title-operate_container">
      <div class="title-wrapper flex-row main-between secondary-center">
        <div class="icon-wrapper flex-row main-center secondary-center">
          <span class="icon-menu icon"
                @click="menusVisible = !menusVisible"></span>
        </div>

        <div class="icon-wrapper flex-row main-center secondary-center">
          <span class="icon-progress icon"></span>
        </div>

        <div class="icon-wrapper flex-row main-center secondary-center">
          <span class="icon-theme icon"
                @click="themeVisible = !themeVisible"></span>
        </div>

        <div class="icon-wrapper flex-row main-center secondary-center">
          <span class="icon-font icon">A</span>
        </div>
      </div>
      <drawer :visible.sync="themeVisible">
        <div class="theme flex-row secondary-center">
          <label class="theme-label">背景</label>

          <radio radio-type="theme"
                 v-for="(item, index) of bgColorOptions"
                 :key="item.label"
                 color="#708090"
                 :label="item.label"
                 v-model="themeColor"
                 @change="selectTheme(index)" />
        </div>
      </drawer>
    </section>
    <div class="reader-wrapper">
      <div id="read"></div>
    </div>
    <div class="operate flex-row main-between">
      <!-- frameborder属性：不设置边框，如果是vue2.x版本，那么可以使用src属性 -->
      <!-- <iframe style="width: 100%; height: 800px;"
              id="tempHtml"
              ref="tempHtml"
              frameborder="0"></iframe> -->

      <el-button @click="prev">上一页</el-button>

      <el-button @click="next">下一页</el-button>
    </div>

    <!-- 目录 -->
    <el-drawer class="drawer"
               :visible.sync="menusVisible"
               :show-close="false">
      <span slot="title"
            class="title">目录</span>
      <div class="nav-item flex-row main-between"
           v-for="item of bookMenus"
           :key="item.id"
           @click="toMenu(item)">
        <span>{{ item.label }}</span>
        <i class="el-icon-arrow-right"></i>
      </div>
    </el-drawer>
  </section>
</template>

<script>
import Epub from 'epubjs'
import turn from '@/utils/turn.js'

const DOWNLOAD_URL = '/static/81642.mobi'

export default {
  name: 'BookReader',
  data () {
    return {
      menusVisible: false,
      themeVisible: false,
      bookMenus: [],
      bgColor: '',
      themeColor: 'rgba(255,255,255, 1)',
      bgColorOptions: [{
        label: 'rgba(255,255,255, 1)',
        name: 'default',
        style: {
          'body': {
            'background': 'rgba(255,255,255, 1)', 'color': '#000 !important'
          },
          'h1, h2, h3, h4, h5, h6, p': {
            'background': 'transparent', 'color': '#000 !important'
          }
        }
      }, {
        label: '#F4A460',
        name: 'orange',
        style: {
          'body': {
            'background': 'linear-gradient(	#FFE4C4, #FFDAB9, 	#D2B48C)', 'color': '#000 !important'
          },
          'h1, h2, h3, h4, h5, h6, p': {
            'background': 'transparent', 'color': '#000 !important'
          }
        }
      }, {
        label: 'rgba(0, 0, 0, 1)',
        name: 'dark',
        style: {
          'body': {
            'background': 'rgba(0, 0, 0, 1)', 'color': '#fff !important'
          },
          'h1, h2, h3, h4, h5, h6, p': {
            'background': 'transparent', 'color': '#fff !important'
          }
        }
      }]
    }
  },
  mounted () {
    this.showEpub()
  },
  watch: {
    themeColor (newVal) {
      console.log('themeColor: ', newVal)
    }
  },
  methods: {
    // 电子书的解析和渲染
    async showEpub () {
      // 生成Book
      this.book = new Epub(DOWNLOAD_URL)

      // 获取书籍的章节
      const { toc } = await this.book.loaded.navigation
      this.bookMenus = toc

      console.log('this.book: ', this.book)

      // Book对象的钩子函数ready
      this.book.ready.then(async () => {
        // 执行分页
        return this.book.locations.generate()
      }).then(result => {
        // 获取Locations对象
        this.locations = this.book.locations
      })

      // 生成Rendition,通过Book.renderTo生成
      this.rendition = this.book.renderTo('read', {
        width: '100%',
        height: window.innerHeight - 100,
        allowScriptedContent: true
      })

      // 向图书iframe框架中，加载字体
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(
            'https://fonts.font.im/css?family=Hanalei+Fill|Kirang+Haerang|Merriweather|MedievalSharp|Ranga')
        ]).then(() => {
          // console.log('字体全部加载完毕。。。')
        })
      })

      this.registerThemes()

      // 通过Rendition.display渲染电子书
      this.rendition.display()
    },
    // 解析电子书内容，获取封面，标题，作者等信息
    parseBook () {
      // 获取cover
      this.book.loaded.cover.then(cover => {
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url)
        })
      })

      // 标题作者
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata)
      })

      // 目录信息
      this.book.loaded.navigation.then(nav => {
        // flatten--扁平化处理，三维数组变一维数组
        const navItem = this.flatten(nav.toc)
        // 判断当前目录是第几级目录
        function find (item, v = 0) {
          const parent = navItem.filter(it => it.id === item.parent)[0]
          return !item.parent ? v : (parent ? find(parent, ++v) : v)
        }
        navItem.forEach(item => {
          item.level = find(item)
        })
        // BUG 这里没问题，navigation目录中没有目录-和作者信息，二section跳转时候，会有他们，所以会差两节
        // 用老师的书，没有问题，我自己写的书有这个问题(中英文的问题？、我下的书没有完全符号epub标准？)
        this.setNavigation(navItem)
      })
    },
    toMenu (item) {
      this.rendition.display(item.href)
      // this.menusVisible = false

      console.log('pageCount: ', this.book.pageList.item)
    },
    prev () {
      // Rendition.prev
      if (this.rendition) {
        this.rendition.prev()
      }
    },
    next () {
      // Rendition.next
      if (this.rendition) {
        this.rendition.next()
      }
    },
    selectTheme (index) {
      this.rendition.themes.select(this.bgColorOptions[index].name)
      this.themeVisible = false
    },
    registerThemes () {
      this.bgColorOptions.forEach((theme) => {
        this.rendition.themes.register(theme.name, theme.style)
      })
    },
    // 打散目录数据，将三维数组转变为一维数组
    flatten (array) {
      return [].concat(...array.map(v => [v, ...this.flatten(v.subitems)]))
    }
  }
}
</script>

<style lang="scss" scoped>
.book-reader {
  position: relative;
  height: 100%;
  .reader-wrapper {
  }
  .operate {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 20px;
  }
  .title-operate_container {
    position: relative;
    .title-wrapper {
      box-sizing: border-box;
      padding: 20px 10px;
      box-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.1);
      background-color: #fff;
      position: sticky;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1002;
      .icon-wrapper {
        width: 25%;
        .icon {
          font-size: 25px;
          cursor: pointer;
        }
      }
      .theme-drawer {
        position: absolute;
        top: 65px;
      }
    }
  }
  .drawer {
    >>> .el-drawer__header {
      padding: 0;
      margin-bottom: 0;
    }
    .title {
      font-size: 32px;
      font-weight: bolder;
      text-align: center;
      font-family: '隶书';
      padding: 10px;
      box-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.1);
    }
    .nav-item {
      cursor: pointer;
      box-sizing: border-box;
      width: 100%;
      padding: 20px 10px;
      box-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.1);
    }
  }
  .theme {
    box-sizing: border-box;
    padding: 20px;
    .theme-label {
      margin-right: 10px;
    }
  }
}
</style>
