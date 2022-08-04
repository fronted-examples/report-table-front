<template>
  <section class="report-design">
    <div class="left">
      <div class="left-header">
        <span class="dataset-txt">数据集</span>
        <el-link class="dataset-btn"
                 :underline="false"
                 @click="addDataSet">
          新增数据集
        </el-link>
      </div>

      <el-tabs v-model="activeDatasetsName"
               v-if="datasets.length">
        <el-tab-pane v-for="item in datasets"
                     :key="item.datasetName"
                     :label="item.datasetName"
                     :name="item.datasetName">
          <div style="float:right">
            <el-button type="warning"
                       icon="el-icon-edit-outline"
                       circle
                       @click="editDataSet(item)"
                       title="编辑数据集"
                       size="mini" />

            <el-button type="danger"
                       icon="el-icon-delete"
                       circle
                       @click="deleteDataSet(item)"
                       title="删除数据集"
                       size="mini" />
          </div>

          <vue-draggable class="wrapper"
                         v-model="item.columns"
                         :sort="false"
                         :disabled="false">
            <div v-for="column in item.columns"
                 :key="column.name"
                 class="dataset-item"
                 @dragend="endDraggable(item.datasetName, column.name)">
              <el-tag>{{ column.name }} </el-tag>
            </div>
          </vue-draggable>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="center">
      <div class="center-header">
        <el-button type="primary"
                   size="mini"
                   @click="saveTpl">保存
        </el-button>
        <el-button type="warning"
                   size="mini"
                   @click="previewReport">预览
        </el-button>
      </div>
      <vue-draggable class="wrapper"
                     :sort="false"
                     style="width:100%;height:100%;"
                     :disabled="true">
        <LuckySheet ref="luckySheetRef"
                    :options="sheetOptions" />
      </vue-draggable>
    </div>

    <div class="right">
      <el-tabs v-model="activeSetting">
        <el-tab-pane label="报表设置"
                     name="报表设置">
          <el-form :model="reportSettingForm"
                   :rules="reportSettingFormRule"
                   ref="reportFormRef">
            <el-form-item label="扩展方向："
                          prop="cellExtend">
              <el-select v-model="reportSettingForm.cellExtend"
                         size="small"
                         placeholder="扩展方向"
                         @change="changeCellExtend"
                         clearable>
                <el-option v-for="item in extendOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="聚合方式："
                          prop="aggregateType">
              <el-select v-model="reportSettingForm.aggregateType"
                         size="small"
                         placeholder="聚合方式"
                         @change="changeAggregateType"
                         clearable>
                <el-option v-for="item in aggregateTypeOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="查询参数设置"
                     name="参数设置">参数设置</el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               width="80%"
               height="80%"
               title="数据集">
      <el-tabs type="border-card">
        <el-tab-pane label="sql语句">
          <el-form inline
                   ref="ruleForm"
                   :model="sqlForm"
                   :rules="sqlFormRules">
            <el-form-item label="数据集名称"
                          prop="datasetName">
              <el-input class="form-input"
                        v-model="sqlForm.datasetName" />
            </el-form-item>

            <el-form-item label="选择数据源"
                          prop="dataSourceName">
              <el-autocomplete class="form-input"
                               :fetch-suggestions="querySearch"
                               value-key="label"
                               @select="selectDataSource"
                               v-model="sqlForm.dataSourceName"
                               placeholder="数据源" />
            </el-form-item>

            <el-form-item label="sql类型"
                          prop="sqlTypeName">
              <el-select class="form-input"
                         v-model="sqlForm.sqlTypeName"
                         @change="selectSqlType">
                <el-option v-for="(item, index) of sqlTypes"
                           :key="index"
                           :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item>
          </el-form>

          <div style="height:40px;">
            <el-tooltip content="该操作将执行sql语句并校验sql语句的正确性，并将查询字段全部显示到下方的表格中"
                        placement="bottom">
              <el-tag type="success"
                      @click="execSql"
                      size="large"
                      style="cursor:pointer">
                <i class="el-icon-caret-right"></i>
                执行
              </el-tag>
            </el-tooltip>
            <el-tooltip content="该操作会将sql语句进行格式化并显示"
                        placement="right">
              <el-tag @click="formatSql"
                      style="cursor:pointer">
                <i class="el-icon-document"></i>
                格式化
              </el-tag>
            </el-tooltip>
          </div>

          <div class="code-mirror">
            <code-mirror ref="codeMirror"
                         v-model="codeContent" />
          </div>

          <div style="height:50%">
            <!--表格 start-->
            <el-table :data="
                sqlColumnTableData.tableData.slice(
                  (sqlColumnTableData.tablePage.currentPage - 1) *
                    sqlColumnTableData.tablePage.pageSize,
                  sqlColumnTableData.tablePage.currentPage *
                    sqlColumnTableData.tablePage.pageSize
                )
              "
                      border
                      style="width: 100%"
                      align="center"
                      size="small"
                      height="230px"
                      :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
              <el-table-column prop="columnName"
                               label="列名"
                               align="center">
              </el-table-column>
              <el-table-column prop="name"
                               label="别名"
                               align="center">
              </el-table-column>
              <el-table-column prop="dataType"
                               label="数据类型"
                               align="center">
              </el-table-column>
              <el-table-column prop="width"
                               label="宽度"
                               align="center">
              </el-table-column>
            </el-table>
            <!--表格 end-->
            <!--分页 start-->
            <el-pagination @current-change="handleCurrentChange"
                           @size-change="handleSizeChange"
                           :current-page="sqlColumnTableData.tablePage.currentPage"
                           :page-sizes="sqlColumnTableData.tablePage.pageSizeRange"
                           :page-size="sqlColumnTableData.tablePage.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="sqlColumnTableData.tablePage.pageTotal">
            </el-pagination>
            <!--分页 end-->
          </div>
        </el-tab-pane>
        <el-tab-pane label="参数配置">
          <div>
            <el-divider content-position="left">
              分页参数</el-divider>
            <el-form inline
                     :model="paginationForm"
                     class="demo-form-inline"
                     ref="paginationRef">
              <el-form-item label="是否分页"
                            prop="isPagination">
                <el-select v-model="paginationForm.isPagination"
                           placeholder="是否分页">
                  <el-option label="是"
                             value="1">
                  </el-option>
                  <el-option label="否"
                             value="2">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="paginationForm.isPagination == '1'"
                            label="每页条数"
                            prop="pageCount"
                            :rules="[
                  { required: true, message: '每页条数不能为空' },
                  { type: 'number', message: '必须为数字值' }
                ]">
                <el-input v-model.number="paginationForm.pageCount"
                          placeholder="每页条数">
                </el-input>
              </el-form-item>
            </el-form>
          </div>

          <div>
            <el-divider content-position="left">
              字段参数</el-divider>
            <el-form inline
                     ref="paramRef"
                     :model="paramForm"
                     :rules="paramFormRules">
              <el-form-item label="参数名称"
                            prop="paramName">
                <el-input v-model="paramForm.paramName"
                          placeholder="参数名称" />
              </el-form-item>

              <el-form-item label="参数编码"
                            prop="paramCode">
                <el-input v-model="paramForm.paramCode"
                          placeholder="参数编码" />
              </el-form-item>

              <el-form-item label="参数类型"
                            prop="paramType">
                <el-select v-model="paramForm.paramType">
                  <el-option label="字符串"
                             value="字符串">
                  </el-option>
                  <el-option label="数值"
                             value="数值">
                  </el-option>
                  <el-option label="日期"
                             value="日期">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="默认值"
                            prop="paramDefault">
                <el-input v-model="paramForm.paramDefault"
                          placeholder="默认值" />
              </el-form-item>

              <el-form-item label="是否必填"
                            prop="paramRequired">
                <el-select v-model="paramForm.paramRequired">
                  <el-option label="是"
                             value="是">
                  </el-option>
                  <el-option label="否"
                             value="否">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>

            <div class="warning-tip">
              注：当参数类型选择日期时，如果想让默认日期是当前日期，则默认值填写current或者CURRENT，如果想让默认日期是当前日期的天几天或者后几天，则填天数，例如前七天则填写-7，后七天则填写7。
            </div>

            <el-button type="primary"
                       @click="addParam">
              添加
            </el-button>

            <el-table :data="paramTableData.tableData"
                      border
                      style="width: 100%"
                      align="center"
                      size="small"
                      height="230px"
                      :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
              <el-table-column prop="paramName"
                               label="参数名"
                               align="center">
              </el-table-column>
              <el-table-column prop="paramCode"
                               label="参数编码"
                               align="center">
              </el-table-column>
              <el-table-column prop="paramType"
                               label="参数类型"
                               align="center">
              </el-table-column>
              <el-table-column prop="paramDefault"
                               label="默认值"
                               align="center">
              </el-table-column>
              <el-table-column prop="paramRequired"
                               label="是否必填"
                               align="center">
              </el-table-column>
              <el-table-column fixed="right"
                               label="操作"
                               width="130"
                               align="center">
                <template slot-scope="scope">
                  <el-button @click="editParam(scope.row)"
                             type="text"
                             size="small">
                    编辑
                  </el-button>
                  <el-button @click="deleteParam(scope.$index)"
                             type="text"
                             size="small">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取 消</el-button>
        <el-button type="primary"
                   @click="handleConfirm">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import LuckySheet from "@/components/LuckySheet/index"
import VueDraggable from "vuedraggable"
import CodeMirror from "@/components/CodeMirror/index"

import {
  getLuckySheetTplSettings,
  getDataSourcesByKeyword,
  execSql,
  addTplDataSets,
  getDatasetsByTplId,
  saveLuckySheetTpl
} from "@/apis/index"

export default {
  components: {
    LuckySheet,
    VueDraggable,
    CodeMirror
  },
  data () {
    return {
      activeDatasetsName: "",
      activeSetting: "报表设置",
      datasets: [], // 数据集
      dialogVisible: false,
      extendOptions: [{
        label: '向下扩展',
        value: 3
      }],
      aggregateTypeOptions: [{
        label: '列表',
        value: 'list'
      }],
      tplId: "",
      codeContent: "", // sql语句
      dataSources: [],
      dragEndR: 0, //拖拽停止单元格横坐标
      dragEndC: 0, //拖拽停止单元格纵坐标
      currentRangeFirstCellR: 0, //当前选中单元格第一个单元格的横坐标
      currentRangeFirstCellC: 0, //当前选中单元格第一个单元格的纵坐标
      isCanDoDeleteOperation: false, //是否可以做删除操作
      insertCount: 1, //插入行或者列的数量
      deleteStart: 0, //删除开始标志
      deleteEnd: 0, //删除结束标志
      deleteRStart: 0, //行删除开始标志
      deleteREnd: 0, //行删除结束标志
      deleteCStart: 0, //列删除开始标志
      deleteCEnd: 0, //列删除结束标志
      cellData: [],
      extraCustomCellConfigs: {}, //单元格额外的自定义配置
      title: "报表", //报表标题
      sqlTypes: [
        {
          label: "标准sql",
          value: 1
        },
        {
          label: "存储过程",
          value: 2
        }
      ],
      //sql解析对应的列表格数据
      sqlColumnTableData: {
        tableData: [],
        tablePage: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 0,
          pageSizeRange: [5, 10, 20, 50]
        }
      },
      // 参数配置对应表格数据
      paramTableData: {
        tableData: [],
        tablePage: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 0,
          pageSizeRange: [5, 10, 20, 50]
        }
      },
      sqlForm: {
        id: null,
        datasetName: "",
        dataSourceName: "",
        dataSource: -1,
        sqlTypeName: "",
        sqlType: -1
      },
      sqlFormRules: {
        datasetName: [
          {
            required: true,
            message: "数据集名称不能为空",
            trigger: ["blur", "change"]
          }
        ],
        dataSourceName: [
          {
            required: true,
            message: "数据源不能为空",
            trigger: ["blur", "change"]
          }
        ],
        sqlTypeName: [
          {
            required: true,
            message: "sql类型不能为空",
            trigger: ["blur", "change"]
          }
        ]
      },
      // 参数配置表单
      paramForm: {
        paramName: "", // 参数名称
        paramCode: "", // 参数编码
        paramType: "", // 参数类型
        paramDefault: "", // 默认值
        paramRequired: "", // 是否必选
        selectContent: "", // 下拉选择内容
        selectType: "" // 内容来源
      },
      paramFormRules: {
        paramName: [
          {
            required: true,
            message: "参数名称不能为空",
            trigger: ["blur", "change"]
          }
        ],
        paramCode: [
          {
            required: true,
            message: "参数编码不能为空",
            trigger: ["blur", "change"]
          }
        ],
        paramType: [
          {
            required: true,
            message: "参数类型不能为空",
            trigger: ["blur", "change"]
          }
        ],
        paramRequired: [
          {
            required: true,
            message: "请选择是否必填",
            trigger: ["blur", "change"]
          }
        ]
      },
      // 参数表单对应的参数
      paginationForm: {
        isPagination: "2", //是否分页
        pageCount: "100" //每页显示条数，默认为100
      },
      // 存储过程入参
      procedureInParamTableData: {
        tableData: [],
        tablePage: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 0,
          pageSizeRange: [5, 10, 20, 50]
        }
      },
      // 存储过程出参
      procedureOutParamTableData: {
        tableData: [],
        tablePage: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 0,
          pageSizeRange: [5, 10, 20, 50]
        }
      },
      reportSettingForm: {
        cellExtend: '',
        aggregateType: ''
      },
      reportSettingFormRule: {
        cellExtend: [{
          required: true, message: '扩展方向不能为空', trigger: ['blur', 'change']
        }],
        aggregateType: [{
          required: true, message: '聚合方式不能为空', trigger: ['blur', 'change']
        }]
      },
      sheetOptions: {
        container: "luckysheet", //luckysheet为容器id
        title: "", //表 头名
        lang: "zh", //中文
        index: "0", //工作表索引
        status: "1", //激活状态
        order: "0", //工作表的顺序
        hide: "0", //是否隐藏
        showtoolbar: true, //是否显示工具栏
        showinfobar: false, //是否显示顶部信息栏
        showsheetbar: false, //是否显示底部sheet按钮
        allowEdit: true,
        showtoolbarConfig: {
          currencyFormat: false, //货币格式
          percentageFormat: false, //百分比格式
          numberDecrease: false, // '减少小数位数'
          numberIncrease: false, // '增加小数位数
          moreFormats: false, // '更多格式'
          border: true, // '边框'
          textWrapMode: true, // '换行方式'
          textRotateMode: false, // '文本旋转方式'
          image: false, // '插入图片'
          chart: false, // '图表'（图标隐藏，但是如果配置了chart插件，右击仍然可以新建图表）
          postil: false, //'批注'
          pivotTable: false, //'数据透视表'
          function: false, // '公式'
          frozenMode: true, // '冻结方式'
          sortAndFilter: false, // '排序和筛选'
          conditionalFormat: false, // '条件格式'
          dataVerification: false, // '数据验证'
          splitColumn: false, // '分列'
          screenshot: false, // '截图'
          protection: false, // '工作表保护'
          print: false // '打印'
        },
        cellRightClickConfig: {
          copyAs: false, // 复制为
          deleteCell: false, // 删除单元格
          hideRow: false, // 隐藏选中行和显示选中行
          hideColumn: false, // 隐藏选中列和显示选中列
          matrix: false, // 矩阵操作选区
          sort: false, // 排序选区
          filter: false, // 筛选选区
          chart: false, // 图表生成
          image: false, // 插入图片
          data: false, // 数据验证
          cellFormat: false // 设置单元格格式
        },
        hook: {
          rangeSelect: this.rangeSelect,
          cellDragStop: this.cellDragStop,
          rowInsertBefore: this.rowInsertBefore,
          rowDeleteBefore: this.rowDeleteBefore
        }
      }
    }
  },
  created () {
    this.tplId = this.$route.query.id

    this.getDataSourcesByKeyword()
    this.getLuckySheetTplSettings()
    this.getDatasetsByTplId()
  },
  methods: {
    querySearch (queryString, cb) {
      var results = queryString
        ? this.dataSources.filter(this.createFilter(queryString))
        : this.dataSources
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return options => {
        return (
          options.label.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    selectDataSource (val) {
      this.sqlForm.dataSourceName = val.label
      this.sqlForm.dataSource = val.value
    },
    selectSqlType (val) {
      this.sqlForm.sqlType = val
    },
    addDataSet () {
      this.dialogVisible = true
    },
    //编辑数据集
    editDataSet (dataSet) {
      this.dialogVisible = true
    },
    // 删除数据集
    deleteDataSet (dataSet) {
      let params = {
        url: this.apis.reportDesign.deleteDataSetApi,
        messageContent: this.commonUtil.getMessageFromList(
          "confirm.delete",
          null
        ),
        callback: this.getDataSets,
        params: { id: dataSet.id },
        type: "get"
      }
      //弹出删除确认框
      this.commonUtil.showConfirm(params)
    },
    // 添加参数
    addParam () {
      this.$refs["paramRef"].validate(valid => {
        if (valid) {
          //从列表冲根据paramCode获取是否已经添加该参数
          let index = this.paramTableData.tableData.findIndex(
            item => item.paramCode === this.paramForm.paramCode
          )

          // 已经添加该参数，则修改参数内容
          if (index !== -1) {
            this.paramTableData.tableData[
              index
            ].paramName = this.paramForm.paramName
            this.paramTableData.tableData[
              index
            ].paramType = this.paramForm.paramType
            this.paramTableData.tableData[
              index
            ].paramDefault = this.paramForm.paramDefault
            this.paramTableData.tableData[
              index
            ].paramRequired = this.paramForm.paramRequired
            this.paramTableData.tableData[
              index
            ].selectType = this.paramForm.selectType
            this.paramTableData.tableData[
              index
            ].selectContent = this.paramForm.selectContent
          } else {
            //未添加该参数，则列表中新增一条数据
            let row = {
              paramName: this.paramForm.paramName,
              paramCode: this.paramForm.paramCode,
              paramType: this.paramForm.paramType,
              paramDefault: this.paramForm.paramDefault,
              paramRequired: this.paramForm.paramRequired,
              selectType: this.paramForm.selectType,
              selectContent: this.paramForm.selectContent
            }

            this.paramTableData.tableData.push(row)
          }

          this.$refs["paramRef"].resetFields() //校验重置
        } else {
          return false
        }
      })
    },
    // 编辑参数
    editParam (row) {
      this.paramForm.paramName = row.paramName
      this.paramForm.paramCode = row.paramCode
      this.paramForm.paramType = row.paramType
      this.paramForm.paramDefault = row.paramDefault
      this.paramForm.paramRequired = row.paramRequired
      this.paramForm.selectType = row.selectType
      this.paramForm.selectContent = row.selectContent
    },
    // 删除参数
    deleteParam (index) {
      this.paramTableData.tableData.splice(index, 1)
    },
    // 范围选中事件
    rangeSelect (sheet, range) {
      if (range.length) {
        this.isCanDoDeleteOperation = false
      }

      if (!range.length) {
        this.deleteRStart = range[0].row[0]
        this.deleteREnd = range[0].row[1]
        this.deleteCStart = range[0].column[0]
        this.deleteCEnd = range[0].column[1]
        this.isCanDoDeleteOperation = true
      }

      this.currentRangeFirstCellR = range[0].row[0]
      this.currentRangeFirstCellC = range[0].column[0]

      var cellFormData = this.extraCustomCellConfigs[
        range[0].row[0] + "_" + range[0].column[0]
      ]

      // 编辑查看时的报表设置
      if (cellFormData) {
        if (cellFormData.cellExtend) {
          this.reportSettingForm.cellExtend = cellFormData.cellExtend
        }

        if (cellFormData.aggregateType) {
          this.reportSettingForm.aggregateType = cellFormData.aggregateType
        }
      }
    },
    // 插入行或者列监听事件
    rowInsertBefore (coordinate, count) {
      this.insertCount = count
    },
    // 删除行或者列监听事件
    rowDeleteBefore (start, end) {
      this.deleteStart = start
      this.deleteEnd = end
      this.isCanDoDeleteOperation = true
    },
    // 获取luckySheet单元格的坐标
    cellDragStop (cell, position) {
      this.dragEndR = position.r
      this.dragEndC = position.c
    },
    //拖拽结束事件
    endDraggable (datasetName, columnName) {
      window.luckysheet.setCellValue(
        this.dragEndR,
        this.dragEndC,
        datasetName + ".${" + columnName + "}",
        null
      )
    },
    // 获取数据源
    getDataSourcesByKeyword () {
      getDataSourcesByKeyword().then(res => {
        this.dataSources = res.datasourceList.map(item => {
          return {
            label: item.databaseName,
            value: item.id
          }
        })
      })
    },
    // 获取已设计的报表
    getLuckySheetTplSettings () {
      let params = {
        tplId: this.tplId
      }

      getLuckySheetTplSettings(params).then(({ title, cellData, config, extraCustomCellConfigs, frozen, hyperlinks, isParamMerge }) => {
        this.sheetOptions.title = title
        this.sheetOptions.data = []

        let data = {
          celldata: cellData,
          hyperlink: hyperlinks,
          config: config,
          frozen: frozen
        }

        this.sheetOptions.data.push(data)

        this.extraCustomCellConfigs = extraCustomCellConfigs != null
          ? extraCustomCellConfigs
          : {}

        this.isParamMerge = isParamMerge == "1" ? true : false

        this.$refs['luckySheetRef'].initLuckySheet(this.sheetOptions)
      })
    },
    // sql语句列表修改当前页触发事件
    handleCurrentChange: function (val) {
      this.sqlColumnTableData.tablePage.currentPage = val
    },
    // sql语句列表修改当每页显示条数触发事件
    handleSizeChange: function (val) {
      this.sqlColumnTableData.tablePage.pageSize = val
    },
    // 执行sql
    execSql () {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (!this.codeContent) return this.$message.error("sql不能为空")

          let params = {
            tplSql: this.codeContent,
            tplId: this.tplId,
            datasourceId: this.sqlForm.dataSource
          }

          execSql(params).then(res => {
            this.sqlColumnTableData.tableData = res.table
            this.sqlColumnTableData.tablePage.pageTotal = res.table.length
          })
        }
      })
    },
    // 格式化sql
    formatSql () {
      this.$refs["codeMirror"].formatSqlContent()
    },
    getDatasetsByTplId () {
      let params = {
        tplId: this.tplId
      }

      getDatasetsByTplId(params).then(({ datasetList }) => {
        this.datasets = datasetList

        this.activeDatasetsName = datasetList[0].datasetName
      })
    },
    handleConfirm () {
      let params = {
        tplId: this.tplId,
        datasetType: 1, // 数据集类型：1-->报表，2-->大屏
        sqlType: this.sqlForm.sqlType,
        tplSql: this.codeContent,
        tplParam: this.paramTableData.tableData
          ? JSON.stringify(this.paramTableData.tableData)
          : "",
        datasourceId: this.sqlForm.dataSource,
        datasetName: this.sqlForm.datasetName,
        id: this.sqlForm.id,
        inParam: this.procedureInParamTableData.tableData
          ? JSON.stringify(this.procedureInParamTableData.tableData)
          : "",
        outParam: this.procedureOutParamTableData.tableData
          ? JSON.stringify(this.procedureOutParamTableData.tableData)
          : "",
        isPagination: this.paginationForm.isPagination,
        pageCount: this.paginationForm.pageCount
      }

      addTplDataSets(params).then(({ dataset }) => {
        if (this.datasets.length) {
          for (let i = 0; i < this.datasets.length; i++) {
            if (dataset.datasetName === this.datasets[i].datasetName) {
              this.datasets.splice(i, 1, dataset)
            } else {
              this.datasets.push(dataset)
            }
          }
        } else {
          this.datasets.push(dataset)
        }

        this.dialogVisible = false
        this.$message.success("添加成功")
      })
    },
    // 获取图表配置
    getSheetConfigs () {
      const result = {}
      let json = window.luckysheet.toJson()

      result.title = json.title

      if (json.data && json.data.length > 0) {
        result.hyperlinks = json.data[0].hyperlink
        result.config = json.data[0].config
        result.frozen = json.data[0].frozen
      }

      return result
    },
    // 获取自定义单元格配置
    getExtraCustomCellConfigs (cellData) {
      const result = {}

      if (cellData && cellData.length) {
        for (let index = 0; index < cellData.length; index++) {
          const element = cellData[index]

          let obj = this.extraCustomCellConfigs[element.r + "_" + element.c]

          if (obj) result[element.r + "_" + element.c] = obj
        }
      }

      return result
    },
    // 获取表格数据，将content为空的单元格排除掉
    getCellData () {
      let result = []
      let luckySheetFile = window.luckysheet.getLuckysheetfile()
      let data = window.luckysheet.transToCellData(luckySheetFile[0].data)

      if (data && data.length) {
        for (let index = 0; index < data.length; index++) {
          const element = data[index]

          if (element.v) {
            if (element.v.ct) {
              if (element.v.ct.t === "inlineStr") {
                if (element.v.ct.s) {
                  result.push(element)
                }
              } else {
                if (element.v.v) {
                  result.push(element)
                }
              }
            } else if (element.v.mc && element.v.mc.rs) {
              result.push(element)
            }
          }
        }
      }

      return result
    },
    // 将单元格数据json化
    cellDataToJsonObj (data) {
      const obj = {}

      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        if (element.v.mc) {
          let r = element.r
          let c = element.c
          let rs = element.v.mc.rs
          let cs = element.v.mc.cs

          for (let i = 0; i < rs; i++) {
            for (let t = 0; t < cs; t++) {
              obj[r + i + "-" + (c + t)] = "1"
            }
          }
        } else {
          obj[element.r + "-" + element.c] = "1"
        }
      }

      return obj
    },
    // 获取有边框的单元格
    getBorderCells (borderInfo) {
      let result = new Array()

      for (let index = 0; index < borderInfo.length; index++) {
        const element = borderInfo[index]

        if (element.rangeType && element.rangeType == "range") {
          let borderType = element.borderType

          if (
            borderType == "border-all" ||
            borderType == "border-left" ||
            borderType == "border-right" ||
            borderType == "border-top" ||
            borderType == "border-bottom"
          ) {
            let ranges = element.range

            for (let t = 0; t < ranges.length; t++) {
              const range = ranges[t]
              let row = range.row
              let column = range.column
              let startRow = row[0]
              let startCol = column[0]
              let rowAmount = row[1] - row[0] + 1
              let colAmount = column[1] - column[0] + 1

              for (let i = 0; i < rowAmount; i++) {
                for (let j = 0; j < colAmount; j++) {
                  let coor = startRow + i + "-" + (startCol + j)

                  if (result.indexOf(coor) < 0) {
                    result.push(coor)
                  }
                }
              }
            }
          } else if (borderType == "border-none") {
            let ranges = element.range

            for (let t = 0; t < ranges.length; t++) {
              const range = ranges[t]
              let row = range.row
              let column = range.column
              let startRow = row[0]
              let startCol = column[0]
              let rowAmount = row[1] - row[0] + 1
              let colAmount = column[1] - column[0] + 1

              for (let i = 0; i < rowAmount; i++) {
                for (let j = 0; j < colAmount; j++) {
                  let coor = startRow + i + "-" + (startCol + j)

                  if (result.indexOf(coor) >= 0) {
                    result.splice(result.indexOf(coor), 1)
                  }
                }
              }
            }
          }
        }
      }

      return result
    },
    // 获取没有内容的边框单元格
    getEmptyBorderCellData (config, cellData) {
      let result = []

      if (config != null) {
        let borderInfo = config.borderInfo

        if (borderInfo != null) {
          let obj = this.cellDataToJsonObj(cellData)
          let cells = this.getBorderCells(borderInfo)

          if (cells && cells.length > 0) {
            for (let index = 0; index < cells.length; index++) {
              const element = cells[index]
              let cellObj = obj[element]

              if (!cellObj) {
                let r = parseInt(element.split("-")[0])
                let c = parseInt(element.split("-")[1])
                let param = {
                  r: r,
                  c: c,
                  v: {
                    ct: {
                      fa: "General",
                      t: "g"
                    },
                    v: "",
                    m: ""
                  }
                }

                result.push(param)
              }
            }
          }
        }
      }

      return result
    },
    // 获取当前选中的单元格
    getSelectRangeCells () {
      let cells = []
      let selectedRanges = window.luckysheet.getRange()

      if (selectedRanges && selectedRanges.length) {
        for (let index = 0; index < selectedRanges.length; index++) {
          const range = selectedRanges[index]

          for (let r = range.row[0]; r <= range.row[1]; r++) {
            for (let c = range.column[0]; c <= range.column[1]; c++) {
              let cell = [r, c]
              cells.push(cell)
            }
          }
        }
      }

      return cells
    },
    // 修改单元格扩展方式
    changeCellExtend () {
      let cells = this.getSelectRangeCells()

      if (cells && cells.length) {
        for (let index = 0; index < cells.length; index++) {
          const element = cells[index]
          let obj = this.extraCustomCellConfigs[element[0] + "_" + element[1]]

          if (obj) {
            obj.cellExtend = this.reportSettingForm.cellExtend
          }

          if (!obj) {
            obj = {}
            obj.cellExtend = this.reportSettingForm.cellExtend

            this.extraCustomCellConfigs[element[0] + "_" + element[1]] = obj
          }
        }
      }
    },
    // 修改单元格聚合方式
    changeAggregateType () {
      let cells = this.getSelectRangeCells()

      // 根据单元格的横纵坐标设置配置
      if (cells && cells.length) {
        for (let index = 0; index < cells.length; index++) {
          const element = cells[index]
          let obj = this.extraCustomCellConfigs[element[0] + "_" + element[1]]

          if (obj) {
            obj.aggregateType = this.reportSettingForm.aggregateType
          }

          if (!obj) {
            obj = {}
            obj.aggregateType = this.reportSettingForm.aggregateType
            this.extraCustomCellConfigs[element[0] + "_" + element[1]] = obj
          }
        }
      }
    },
    // 保存模板
    saveTpl () {
      this.$refs['reportFormRef'].validate((valid) => {
        if (valid) {
          let cellData = this.getCellData()
          let extraCustomCellConfigs = this.getExtraCustomCellConfigs(cellData)
          let configs = this.getSheetConfigs()
          let borderCellData = this.getEmptyBorderCellData(configs.config, cellData)

          cellData = cellData.concat(borderCellData)
          // 无循环块则直接保存所有的单元格信息即可
          configs.cellData = cellData

          configs.extraCustomCellConfigs = extraCustomCellConfigs
          configs.tplId = this.tplId
          // configs.id = thi
          configs.isParamMerge = this.isParamMerge ? 1 : 2

          if (!cellData.length) return this.$message.error('报表内容不能为空')

          saveLuckySheetTpl(configs).then((res) => {
            this.$message.success("保存成功")
          })
        }
      })
    },
    // 预览
    previewReport () {
      window.open(this.$router.resolve({
        name: "ReportPreview",
        query: { id: this.tplId }
      }).href, "_blank")
    }
  }
};
</script>

<style lang="scss" scoped>
.report-design {
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left {
    box-sizing: border-box;
    width: 15vw;
    height: 100%;
    padding: 0 20px;
    box-shadow: 5px 0 5px #dfdfdf;

    .left-header {
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .dataset-txt {
        font-size: 18px;
        margin-right: 10px;
      }

      .dataset-btn {
        font-size: 14px;
      }
    }

    .wrapper {
      width: 100%;
      height: 450px;
      overflow-y: auto;
      .dataset-item {
        display: inline-block;
        margin: 0 2px;
      }
    }
  }

  .form-input {
    width: 200px;
  }

  .code-mirror {
    height: 300px;
  }

  .warning-tip {
    background-color: rgba(230, 162, 60, 0.1);
    border-color: rgba(230, 162, 60, 0.2);
    color: #e6a23c;
    font-size: 12px;
    line-height: 18px;
    box-sizing: border-box;
    padding: 5px 10px;
    margin-bottom: 20px;
  }

  .center {
    width: 70vw;
    height: 100%;

    .center-header {
      display: flex;
      justify-content: flex-end;
      margin: 10px 10px 10px 0;
    }
  }

  .right {
    width: 15vw;
    height: 100%;
    box-shadow: -5px 0 5px #dfdfdf;
    padding: 0 20px;
    .el-tabs >>> .el-tabs__header .el-tabs__nav-wrap::after {
      height: 0;
    }
    .setting-item {
      align-items: center;
      margin-bottom: 10px;
      .setting-label {
        font-size: 12px;
      }
      .el-select {
        width: 120px;
      }
    }
  }
}
</style>
