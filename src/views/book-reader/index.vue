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
          <span class="icon-font icon"></span>
        </div>
      </div>
      <drawer :visible.sync="themeVisible">
        <div class="theme flex-column">
          <label class="theme-label">视图模式</label>

          <div class="drawer-items">
            <el-tooltip class="item"
                        effect="dark"
                        content="单页模式"
                        placement="top">
              <i class="icon-single-page mode-icon"
                 @click.stop="handleSpread('single')"></i>
            </el-tooltip>

            <el-tooltip class="item"
                        effect="dark"
                        content="双页模式"
                        placement="top">
              <i class="icon-double-page mode-icon"
                 @click.stop="handleSpread('double')"></i>
            </el-tooltip>

            <el-tooltip class="item"
                        effect="dark"
                        content="滚动模式"
                        placement="top">
              <i class="icon-scroll-page mode-icon"
                 @click.stop="handleSpread('scroll')"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="theme flex-column">
          <label class="theme-label">背景</label>

          <div class="drawer-items">
            <radio radio-type="theme"
                   v-for="(item, index) of bgColorOptions"
                   :key="item.label"
                   color="#708090"
                   size="large"
                   :label="item.label"
                   v-model="themeColor"
                   @change="selectTheme(index)" />
          </div>
        </div>
      </drawer>
    </section>
    <div class="reader-wrapper">
      <div id="read"></div>
      <div class="bg-one"></div>
      <div class="bg-two">
        <div class="spine-shadow-left"></div>
        <div class="book-spine"></div>
        <div class="spine-shadow-right"></div>
      </div>
      <div class="bg-three"></div>
    </div>
    <div class="operate flex-row main-between">
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

const DOWNLOAD_URL = 'http://101.35.44.70:9000/file/%E4%B8%89%E5%9B%BD%E6%BC%94%E4%B9%89.epub'
const fastTextEncoding = require('fast-text-encoding')

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
    // this.onTurn()
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

      console.log('book: ', this.book)
      const { zip } = this.book.archive
      let utf8decoder = new TextDecoder()
      console.log('zip: ', zip.files)
      for (let i = 0; i < Object.values(zip.files).length; i++) {
        // console.log('compress: ', Object.values(zip.files)[i]._data.compressedContent)
        console.log('utf8decoder: ', utf8decoder.decode(Object.values(zip.files)[i]._data.compressedContent))
      }
      // for (let i of zip.files) {
      //   console.log('compress: ', zip.files[i])
      // }

      // 生成Rendition,通过Book.renderTo生成
      this.rendition = this.book.renderTo('read', {
        width: '600px',
        height: window.innerHeight - 100,
        allowScriptedContent: true
      })

      this.registerThemes()

      // 通过Rendition.display渲染电子书
      this.rendition.display()

    },
    toMenu (item) {
      console.log('item: ', item)
      this.rendition.display(item.href)
      this.menusVisible = false
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
    // 设置阅读器分页模式
    handleSpread (mode) {
      if (mode === 'single') { }
      if (mode === 'double') { }
      if (mode === 'scroll') { }
    }
  }
}
</script>

<style lang="scss" scoped>
.book-reader {
  position: relative;
  height: 100%;
  .reader-wrapper {
    position: relative;
    #read {
      position: relative;
      // display: flex;
      // justify-content: center;
    }
    // @media (min-width: 1000px) {
    //   #read:after {
    //     position: absolute;
    //     width: 1px;
    //     border-right: 2px #000 solid;
    //     height: 90%;
    //     z-index: 1;
    //     left: 50%;
    //     margin-left: -1px;
    //     top: 5%;
    //     opacity: 0.15;
    //     box-shadow: -2px 0 15px rgba(0, 0, 0, 1);
    //     content: '';
    //   }
    // }
    .bg-one,
    .bg-two,
    .bg-three {
      box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.18);
    }
    .bg-one {
      position: absolute;
      left: 7px;
      right: 7px;
      top: 5px;
      bottom: 5px;
      border: 1px solid rgba(191, 191, 191, 1);
      z-index: 1;
    }
    .bg-two {
      position: absolute;
      left: 9px;
      right: 9px;
      top: 5px;
      bottom: 5px;
      border: 1px solid rgba(191, 191, 191, 1);
      z-index: 2;
      overflow: hidden;
      .spine-shadow-left {
        width: 68px;
        height: 100%;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAADCAYAAAAqTqlmAAAA/0lEQVQoke2SQY7CMAxF/3dUUfUCbLj/kViz4AAghGgS238WQyOq4QhjKXqxZcfOlykJAAwAv53r9cppmgwASimD9/udZkYzI0k+n89xr7UaANRabVkWbH7v3WqtNDO21rgsC1trdHcDgIj4Q3cnSb5eL5oZ3X1QkgFAa80AIDMtMxkRjAiaGSOCmcnMpCRzdwAYBAB3ty1nE0L4NQHA+XwGAFwuF5xOJ2SmjscjJOl2u1FvFTNTAPB4PPBpW3yeZ63rSkmqtXKLHw4HzfOMdV13+Zmp3js/CQCSNE3TeL/3vqsrpSgixlylFL0/+nWuzJSZMTP1FmL04f+G7DfkB/uZQX9OFIuVAAAAAElFTkSuQmCC)
          repeat-y;
        z-index: 10;
        margin: 0;
        z-index: 10;
        position: absolute;
        left: calc(50% - 68px);
      }
      .book-spine {
        position: absolute;
        width: 1px;
        height: 100%;
        position: absolute;
        left: 50%;
        bottom: 100%;
        bottom: 0;
        border: 2px solid rgba(191, 191, 191, 1);
        border-left: none;
        box-sizing: border-box;
        z-index: 10;
      }
      .spine-shadow-right {
        width: 68px;
        height: 100%;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAADCAYAAAAqTqlmAAABVklEQVQokW1Suw4iMQycyWMThBB0NFtQ8yf3WfwkNQUNHRLSKquwnitus4pOWIrGHnlsJzFvt9sf55yccwohGP6ZhRA2JGktx3svM5P3Xt57rbwBwDAMBgAkLYQgM1PD3W4nSQohyHtvAPA/hhBsGAZN06RhGGRmSikpxmgAkFKyaZqQUtpiSTIz7fd7Nd/MdDwetSyLAUDDWquN4ygAPw9Jc5IEAGshmpmcczSzjUdn3+8X6yUEAJK0LAtb3PJrrZsmxoi+T62VPfa6Ugpyzkgpbfw8z5SkUgpzzj/n+nw+6HlJer/flKTz+Qwz0ziOeDweAID7/d6krY4k0ZEkADjnuP729iiN7xuvm4NlWbhuA733anHLjzFumlor+j4xRvXY63LOKKVgnueNTymJJHPOKqX8nOtwOKDnSfJ0OokkX68XnHN8Pp+4XC4AgOv12qStDknqLwxUBhX5L/TkAAAAAElFTkSuQmCC)
          repeat-y;
        z-index: 10;
        margin: 0;
        box-sizing: border-box;
        position: absolute;
        right: calc(50% - 68px);
      }
    }
    .bg-three {
      position: absolute;
      left: 5px;
      right: 5px;
      top: 5px;
      bottom: 5px;
      border: 1px solid rgba(191, 191, 191, 1);
      z-index: 0;
    }
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
      font-size: 15px;
    }

    .drawer-items {
      margin-top: 10px;
      .mode-icon {
        font-size: 60px;
        cursor: pointer;
        opacity: 0.4;
        margin: 0 10px;
        &:first-of-type {
          margin-left: 0;
        }
      }
      .icon-double-page {
        font-weight: bold;
      }
    }
  }
}
</style>
