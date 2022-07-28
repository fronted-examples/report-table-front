<template>
  <div ref="luckySheet"
       id="luckysheet"></div>
</template>

<script>
import LuckyExcel from 'luckyexcel'

export default {
  name: 'Luckysheet',
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    this.defaultOptions = {
      container: 'luckysheet', // luckysheet为容器id
      myFolderUrl: '',
      plugins: ['chart'],
      lang: 'zh'
    }

    this.defaultOptions = Object.assign({}, this.defaultOptions, this.options)

    return {}
  },
  watch: {
    isCollapse () {
      window.luckysheet.resize()
    }
  },
  mounted () {
    this.initLuckySheet()
  },
  beforeDestroy () {
    this.destroyLuckySheet()
  },
  methods: {
    initLuckySheet (options) {
      this.defaultOptions = Object.assign(this.defaultOptions, options)
      window.luckysheet.create(this.defaultOptions)
    },
    destroyLuckySheet () {
      window.luckysheet.destroy()
    },
    importExcel (event) {
      const files = event.target.files
      if (files == null || files.length === 0) {
        return this.toastInfo('没有文件导入', 'error')
      }

      let name = files[0].name
      let suffixArr = name.split('.')
      let suffix = suffixArr[suffixArr.length - 1]
      if (suffix !== 'xlsx') {
        return this.toastInfo('当前只支持导入xlsx文件', 'error')
      }

      LuckyExcel.transformExcelToLucky(files[0], (exportJson, luckysheetfile) => {
        if (exportJson.sheets == null || exportJson.sheets.length === 0) {
          return this.toastInfo('读取excel文件内容失败，目前不支持xls文件', 'errorr')
        }

        console.log('exportJson: ', exportJson)

        window.luckysheet.destroy()

        this.defaultOptions.data = exportJson.sheets

        window.luckysheet.create(this.defaultOptions)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#luckysheet {
  box-sizing: border-box;
  padding: 0px;
  position: relative;
  width: 100%;
  height: 90vh;
}
#luckysheet >>> .luckysheet {
  box-sizing: border-box;
  width: 100% !important;
  height: 100% !important;
}

#luckysheet >>> .luckysheet .luckysheet-work-area .luckysheet_info_detail .luckysheet_info_detail_back,
#luckysheet >>> .luckysheet .luckysheet-work-area .luckysheet_info_detail .luckysheet-share-logo,
#luckysheet >>> .luckysheet .luckysheet-work-area .luckysheet_info_detail .luckysheet_info_detail_update,
#luckysheet >>> .luckysheet .luckysheet-work-area .luckysheet_info_detail .luckysheet_info_detail_save {
  display: none;
}
</style>
