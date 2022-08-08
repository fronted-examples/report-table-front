<template>
  <section class="book-reader">
    <div class="title-wrapper">
      <div class="icon-wrapper">
        <span class="icon-menu icon"></span>
      </div>

      <div class="icon-wrapper">
        <span class="icon-progress icon"></span>
      </div>

      <div class="icon-wrapper">
        <span class="icon-theme icon"></span>
      </div>

      <div class="icon-wrapper">
        <span class="icon-font icon">A</span>
      </div>
    </div>
    <div class="reader-wrapper">
      <div id="read"></div>
      <div class="mask">
        <div class="left" @click="prev"></div>
        <div class="center"></div>
        <div class="right" @click="next"></div>
      </div>
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
        height: window.innerHeight
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
  .reader-wrapper {
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;
      display: flex;
      width: 100%;
      height: 100%;
      // background-color: aqua;
      .left {
        flex: 0 0 200px;
        // background-color: red;
      }
      .center {
        flex: 1;
      }
      .right {
        flex: 0 0 200px;
        // background-color: orange;
      }
    }
  }
}
</style>