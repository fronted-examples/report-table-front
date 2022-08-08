<template>
  <section class="book-reader">
    <div
         class="title-wrapper flex-row main-between secondary-center">
      <div
           class="icon-wrapper flex-row main-center secondary-center">
        <span class="icon-menu icon"></span>
      </div>

      <div
           class="icon-wrapper flex-row main-center secondary-center">
        <span class="icon-progress icon"></span>
      </div>

      <div
           class="icon-wrapper flex-row main-center secondary-center">
        <span class="icon-theme icon"></span>
      </div>

      <div
           class="icon-wrapper flex-row main-center secondary-center">
        <span class="icon-font icon">A</span>
      </div>
    </div>
    <div class="reader-wrapper">
      <div id="read"></div>
    </div>
    <div class="operate flex-row main-between">
      <el-button @click="prev">上一页</el-button>

      <el-button @click="next">下一页</el-button>
    </div>
  </section>
</template>

<script>
import Epub from 'epubjs'
const DOWNLOAD_URL = '/static/三国演义.epub'

export default {
  name: 'BookReader',
  data () {
    return {

    }
  },
  mounted () {
    this.showEpub()
  },
  methods: {
    // 电子书的解析和渲染
    showEpub () {
      // 生成Book
      this.book = new Epub(DOWNLOAD_URL)

      console.log(this.book)
      // 生成Rendition,通过Book.renderTo生成
      this.rendition = this.book.renderTo('read', {
        width: window.innerWidth,
        height: window.innerHeight - 100
      })
      // 通过Rendition.display渲染电子书
      this.rendition.display()
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
  .title-wrapper {
    box-sizing: border-box;
    padding: 20px 10px;
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 101;
    .icon-wrapper {
      width: 25%;
      .icon {
        font-size: 25px;
        cursor: pointer;
      }
    }
  }
}
</style>