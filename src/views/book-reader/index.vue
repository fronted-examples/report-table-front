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
        <div>
          <label>背景</label>
          <el-radio-group v-model="bgColor">
            <el-radio :label="3">备选项</el-radio>
            <el-radio :label="6">备选项</el-radio>
            <el-radio :label="9">备选项</el-radio>
          </el-radio-group>
        </div>
      </drawer>
    </section>
    <div class="reader-wrapper">
      <div id="read"></div>
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
const DOWNLOAD_URL = '/static/三国演义.epub'

export default {
  name: 'BookReader',
  data () {
    return {
      menusVisible: false,
      themeVisible: false,
      bookMenus: [],
      bgColor: '',
      bgColorOptions: [{
        value: ''
      }]
    }
  },
  mounted () {
    this.showEpub()
  },
  methods: {
    // 电子书的解析和渲染
    async showEpub () {
      // 生成Book
      this.book = new Epub(DOWNLOAD_URL)

      // 获取书籍的章节
      const { toc } = await this.book.loaded.navigation
      this.bookMenus = toc

      // 生成Rendition,通过Book.renderTo生成
      this.rendition = this.book.renderTo('read', {
        width: window.innerWidth - 400,
        height: window.innerHeight - 100,
        allowScriptedContent: true
      })

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
}
</style>
