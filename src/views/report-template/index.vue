<template>
  <section class="report-database">
    <div class="header">
      <el-input class="search-input"
                prefix-icon="el-icon-search"
                v-model="keyword"
                placeholder="数据库、业务名" />
      <el-autocomplete class="search-input"
                       :fetch-suggestions="querySearch"
                       value-key="label"
                       @select="selectDatabase"
                       v-model="type"
                       placeholder="数据库类型" />
      <el-button type="primary"
                 plain>查询</el-button>
    </div>

    <div class="body">
      <div class="table-operate">
        <el-button @click.stop="visible = true">新增</el-button>
        <el-button type="danger">批量删除</el-button>
      </div>
      <div class="clearfix"></div>
      <el-table border
                :data="table">
        <el-table-column prop="id"
                         label="id" />
        <el-table-column prop="tplCode"
                         label="报表标识" />
        <el-table-column prop="tplName"
                         label="报表名称" />
        <el-table-column prop="reportTypeLabel"
                         label="报表类型" />
        <el-table-column prop="datasourceLabel"
                         label="数据源" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link type="success">查看</el-link>
            <el-link type="primary"
                     @click="designReport(scope)">报表设计</el-link>
            <el-link type="danger">删除</el-link>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="pagination"
                     background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="pageInfo.pageIndex"
                     :page-sizes="pageInfo.pageSizes"
                     :page-size="pageInfo.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="pageInfo.total" />
      <div class="clearfix"></div>
    </div>

    <el-dialog class="dialog"
               title="新增"
               :visible.sync="visible">
      <el-form :model="form"
               :rules="rules"
               ref="ruleForm"
               label-width="120px">
        <el-form-item label="报表标识"
                      prop="tplCode">
          <el-input class="form-input"
                    v-model="form.tplCode" />
        </el-form-item>
        <el-form-item label="报表名称"
                      prop="tplName">
          <el-input class="form-input"
                    v-model="form.tplName" />
        </el-form-item>
        <el-form-item label="报表类型"
                      prop="reportTypeLabel">
          <el-select class="form-input"
                     placeholder="报表类型"
                     v-model="form.reportTypeLabel"
                     @change="selectType">
            <el-option v-for="(item, index) of optionsType"
                       :key="index"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="报表数据源"
                      prop="datasourceLabel">
          <el-select class="form-input"
                     placeholder="数据源"
                     v-model="form.datasourceLabel"
                     @change="selectSource">
            <el-option v-for="(item, index) of optionsSource"
                       :key="index"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary"
                   @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { getDataSourcesByKeyword, addReportTpl, getReportTplByKeyword, getReportTypeByKeyword } from '@/apis/index'

export default {
  data () {

    return {
      optionsType: [],
      optionsSource: [],
      type: '',
      keyword: '',
      table: [],
      visible: false,
      form: {
        tplCode: '',
        tplName: '',
        reportTypeLabel: '',
        reportType: -1,
        datasourceLabel: '',
        datasource: -1
      },
      rules: {
        tplCode: [{
          required: true, message: '数据标识不能为空', trigger: 'blur'
        }],
        tplName: [{
          required: true, message: '报表名不能为空', trigger: 'blur'
        }],
        reportTypeLabel: [{
          required: true, message: '类型不能为空', trigger: 'blur'
        }],
        datasourceLabel: [{
          required: true, message: '数据源不能为空', trigger: 'blur'
        }],
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [5, 10, 20, 50],
        total: 0
      }
    }
  },
  async created () {
    await this.getReportTypeByKeyword()
    await this.getDataSourcesByKeyword()

    this.getReportTplByKeyword()
  },
  methods: {
    querySearch (queryString, cb) {
      var results = queryString ? this.options.filter(this.createFilter(queryString)) : this.options
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (options) => {
        return (options.label.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    selectDatabase (val) {
      this.database = val.label
    },
    selectType (val) {
      this.form.reportType = val
    },
    selectSource (val) {
      this.form.datasource = val
    },
    designReport ({ row }) {
      window.open(this.$router.resolve({
        name: "ReportDesign",
        query: { id: row.id }
      }).href, '_blank')
    },
    // 当前页的记录数
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageInfo.pageSize = val
      this.initData()
    },
    // 当前页
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageInfo.pageIndex = val

      this.$router.replace({
        path: this.$route.path,
        query: {
          page: val
        }
      })
    },
    getReportTypeByKeyword () {
      return new Promise((resolve, reject) => {
        getReportTypeByKeyword().then((res) => {
          this.optionsType = res.reportTypeList.map((item) => {
            return {
              label: item.reportTypeName,
              value: item.id
            }
          })

          resolve()
        })
      })
    },
    getDataSourcesByKeyword () {
      return new Promise((resolve, reject) => {
        getDataSourcesByKeyword().then((res) => {
          this.optionsSource = res.datasourceList.map((item) => {
            return {
              label: item.databaseName,
              value: item.id
            }
          })

          resolve()
        })
      })
    },
    addReportTpl () {
      let params = {
        tplCode: this.form.tplCode,
        tplName: this.form.tplName,
        reportType: this.form.reportType,
        datasource: this.form.datasource
      }

      addReportTpl(params)
    },
    getReportTplByKeyword () {
      const params = {
        keyword: this.keyword
      }
      const pageInfo = {
        pageIndex: this.pageInfo.pageIndex,
        pageSize: this.pageInfo.pageSize
      }

      getReportTplByKeyword(params, pageInfo).then((res) => {
        this.table = res.reportTplList
        this.pageInfo.pageIndex = res.pageInfo.pageIndex
        this.pageInfo.total = res.pageInfo.totalSize

        this.table.forEach((item) => {
          this.optionsType.forEach((type) => {
            if (type.value === item.reportType) {
              item.reportTypeLabel = type.label
            }
          })
          this.optionsSource.forEach((source) => {
            if (source.value === item.datasource) {
              item.datasourceLabel = source.label
            }
          })
        })
      })
    },
    submit () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.addReportTpl()
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.report-database {
  padding: 10px 20px;

  .header {
    margin-bottom: 20px;

    .search-input {
      width: 200px;
    }
  }

  .body {
    .table-operate {
      margin: 10px 0;
      float: right;
    }

    .pagination {
      margin-top: 10px;
      float: right;
    }

    .clearfix {
      clear: both;
    }
  }

  .dialog {
    .el-form-item {
      display: inline-block;
    }

    .form-input {
      width: 150px;
    }
  }
}
</style>
