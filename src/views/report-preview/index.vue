<template>
  <div>
    <LuckySheet ref="luckySheetRef"
                :options="sheetOptions" />
  </div>
</template>

<script>
import LuckySheet from "@/components/LuckySheet/index"

import { previewLuckySheetReportData, getReportDatasetsParam } from '@/apis/index'

export default {
  components: {
    LuckySheet
  },
  data () {
    return {
      tplId: '',
      searchData: {},
      sheetOptions: {
        container: 'luckysheet', //luckysheet为容器id
        title: "", //表 头名
        lang: 'zh', //中文
        functionButton: '',
        index: '0', //工作表索引
        status: '1',//激活状态
        order: '0', //工作表的顺序
        hide: '0',  //是否隐藏
        showtoolbar: true,//是否显示工具栏
        showinfobar: false,//是否显示顶部信息栏
        showsheetbar: false,//是否显示底部sheet按钮
        allowEdit: false,
        showtoolbarConfig: {
          currencyFormat: false, //货币格式
          // percentageFormat: false, //百分比格式
          numberDecrease: false, // '减少小数位数'
          numberIncrease: false, // '增加小数位数
          // moreFormats: false, // '更多格式'
          border: true, // '边框'
          textWrapMode: true, // '换行方式'
          textRotateMode: false, // '文本旋转方式'
          image: false, // '插入图片'
          // chart: false, // '图表'（图标隐藏，但是如果配置了chart插件，右击仍然可以新建图表）
          postil: false, //'批注'
          pivotTable: false,  //'数据透视表'
          // function: false, // '公式'
          frozenMode: true, // '冻结方式'
          sortAndFilter: false, // '排序和筛选'
          conditionalFormat: false, // '条件格式'
          dataVerification: false, // '数据验证'
          splitColumn: false, // '分列'
          screenshot: false, // '截图'
          protection: false, // '工作表保护'
          print: false, // '打印'
        },
        cellRightClickConfig: {
          copyAs: false, // 复制为
          deleteCell: false, // 删除单元格
          hideRow: false, // 隐藏选中行和显示选中行
          hideColumn: false, // 隐藏选中列和显示选中列
          matrix: false, // 矩阵操作选区
          sort: false, // 排序选区
          filter: false, // 筛选选区
          // chart: false, // 图表生成
          image: false, // 插入图片
          data: false, // 数据验证
          cellFormat: false, // 设置单元格格式
          link: false, // 插入链接
        },
        hook: {
        }
      }
    }
  },
  created () {
    this.tplId = this.$route.query.id
    this.getReportDatasetsParam()
    this.previewLuckySheetReportData()
  },
  mounted () {
  },
  methods: {
    getReportDatasetsParam () {
      let params = {
        tplId: this.tplId
      }

      getReportDatasetsParam(params).then(({ reportDatasetsParam }) => {
        const { params } = reportDatasetsParam

        for (let i = 0; i < params.length; i++) {
          let dataSet = {}
          dataSet.datasetId = params[i].datasetId
          dataSet.datasetName = params[i].datasetName
          dataSet.datasourceId = params[i].datasourceId
          dataSet.params = []

          for (let j = 0; j < params[i].params.length; j++) {
            let param = {}

            param.paramName = params[i].params[j].paramName
            param.paramCode = params[i].params[j].paramCode
            param.paramType = params[i].params[j].paramType

            dataSet.params.push(param)
          }
        }
      })
    },
    previewLuckySheetReportData () {
      let params = {
        tplId: this.tplId
      }

      previewLuckySheetReportData(params).then(({ title, cellData, config, frozen, hyperlinks, pagination }) => {
        this.sheetOptions.data = [
          {
            celldata: cellData,
            hyperlink: hyperlinks,
            config: config,
            frozen: frozen
          }
        ]

        this.$nextTick(() => {
          this.$refs['luckySheetRef'].initLuckySheet(this.sheetOptions)
        })
      })
    }
  }
}
</script>
