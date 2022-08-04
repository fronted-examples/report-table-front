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
                 plain>查询
      </el-button>
    </div>

    <div class="body">
      <div class="table-operate">
        <el-button @click.stop="visible = true">新增
        </el-button>
        <el-button type="danger">批量删除</el-button>
      </div>
      <div class="clearFloat"></div>
      <el-table border
                :data="table">
        <el-table-column align="center"
                         prop="id"
                         label="id" />
        <el-table-column align="center"
                         prop="databaseName"
                         label="数据库" />
        <el-table-column align="center"
                         prop="businessName"
                         label="数据库业务名" />
        <el-table-column align="center"
                         prop="typeLabel"
                         label="数据库类型" />
        <el-table-column align="center"
                         label="数据库链接">
          <template slot-scope="scope">
            <el-tooltip effect="dark"
                        :content="scope.row.jdbcUrl"
                        placement="top">
              <span class="ellipsis-line"
                    :style="{'--ellipsisWidth': '100px'}">{{ scope.row.jdbcUrl }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="操作">
          <template slot-scope="scope">
            <el-link type="success">查看</el-link>
            <el-link type="warning"
                     @click="editDataSource(scope)">编辑</el-link>
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
      <div class="clearFloat"></div>
    </div>

    <el-dialog class="dialog"
               title="新增"
               :visible.sync="visible">
      <el-input class="title-input"
                v-model="form.businessName"
                placeholder="数据库业务名" />
      <el-form :model="form"
               :rules="rules"
               ref="ruleForm"
               label-width="100px"
               label-position="left"
               inline>
        <el-form-item label="数据库"
                      prop="databaseName">
          <el-input class="form-input"
                    v-model="form.databaseName" />
        </el-form-item>
        <el-form-item label="数据库类型"
                      prop="type">
          <el-select v-model="form.type"
                     class="form-input">
            <el-option v-for="(item, index) of options"
                       :key="index"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主机"
                      prop="localhost">
          <el-input class="form-input"
                    v-model="form.localhost" />
        </el-form-item>
        <el-form-item label="端口"
                      prop="port">
          <el-input class="form-input"
                    v-model.number="form.port" />
        </el-form-item>
        <el-form-item label="登录用户名"
                      prop="username">
          <el-input class="form-input"
                    v-model="form.username"
                    clearable />
        </el-form-item>
        <el-form-item label="登录密码"
                      prop="password">
          <el-input class="form-input"
                    v-model="form.password"
                    type="password"
                    show-password
                    clearable />
        </el-form-item>
      </el-form>

      <textarea type="textarea"
                class="url-tag"
                v-model="form.jdbcUrl"
                readonly />

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="visible = false">取 消
        </el-button>
        <el-button type="warning"
                   @click="connectionTest">测 试 连 接
        </el-button>
        <el-button type="primary"
                   @click="submit">
          确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { addDataSource, getDataSourcesByKeyword, connectionTest } from '@/apis/index'
export default {
  data () {
    const databaseCheck = (rule, value, callback) => {
      if (!/(^[a-z A-Z]+$)|(_-)/.test(value)) {
        return callback(new Error('只能输入英文字符'))
      }

      callback()
    }

    const portCheck = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
        return callback(new Error('请输入数字'))
      }

      callback()
    }

    const usernameCheck = (rule, value, callback) => {
      if (!/(^[a-z A-Z]+$)|(_-)/.test(value)) {
        return callback(new Error('只能输入英文字符'))
      }

      callback()
    }

    return {
      jdbcUrlMap: {
        0: 'jdbc:mysql://localhost:port/databaseName?useUnicode=true&characterEncoding=UTF-8&useSSL=false&autoReconnect=true',
        1: 'jdbc:oracle:thin:@localhost:port:databaseName',
        2: 'jdbc:sqlserver://localhost:port;databaseName=databaseName'
      },
      options: [{
        label: 'MySQL',
        value: 0
      }, {
        label: 'SqlServer',
        value: 1
      }, {
        label: 'Oracle',
        value: 2
      }],
      type: '',
      keyword: '',
      table: [],
      visible: false,
      form: {
        databaseName: '',
        businessName: '',
        type: 0,
        localhost: '',
        jdbcUrl: '',
        port: '',
        username: '',
        password: ''
      },
      rules: {
        databaseName: [{
          required: true, message: '数据库不能为空', trigger: 'blur'
        }, {
          validator: databaseCheck, trigger: 'change'
        }],
        type: [{
          required: true, message: '类型不能为空', trigger: 'blur'
        }],
        localhost: [{
          required: true, message: '地址不能为空', trigger: 'blur'
        }],
        port: [{
          required: true, message: '端口不能为空', trigger: 'blur'
        }, {
          validator: portCheck, trigger: 'change'
        }],
        username: [{
          required: true, message: '用户名不能为空', trigger: 'blur'
        }, {
          validator: usernameCheck, trigger: 'change'
        }],
        password: [{
          required: true, message: '密码不能为空', trigger: 'blur'
        }]
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [5, 10, 20, 50],
        total: 0
      }
    }
  },
  watch: {
    'form.type': {
      handler (newVal) {
        this.form.jdbcUrl = this.jdbcUrlMap[newVal]
      },
      immediate: true
    },
    'form.localhost': {
      handler (newVal) {
        this.form.jdbcUrl = this.jdbcUrlMap[this.form.type].replace(/localhost/, newVal ? newVal : 'localhost').replace(/port/, this.form.port ? this.form.port : 'port').replace(/databaseName/, this.form.databaseName ? this.form.databaseName : 'databaseName')
      },
      immediate: true
    },
    'form.port': {
      handler (newVal) {
        this.form.jdbcUrl = this.jdbcUrlMap[this.form.type].replace(/localhost/, this.form.localhost ? this.form.localhost : 'localhost').replace(/port/, newVal ? newVal : 'port').replace(/databaseName/, this.form.databaseName ? this.form.databaseName : 'databaseName')
      },
      immediate: true
    },
    'form.databaseName': {
      handler (newVal) {
        this.form.jdbcUrl = this.jdbcUrlMap[this.form.type].replace(/localhost/, this.form.localhost ? this.form.localhost : 'localhost').replace(/port/, this.form.port ? this.form.port : 'port').replace(/databaseName/, newVal ? newVal : 'databaseName')
      },
      immediate: true
    }
  },
  created () {
    this.getDataSourcesByKeyword()
  },
  methods: {
    querySearch (queryString, cb) {
      const results = queryString ? this.options.filter(this.createFilter(queryString)) : this.options
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (option) => {
        return (option.label.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    selectDatabase (val) {
      this.database = val.label
    },
    // 当前页的记录数
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageInfo.pageSize = val
      this.getDataSourcesByKeyword()
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
    getDataSourcesByKeyword () {
      let params = {
        keyword: this.keyword
      }
      let pageInfo = {
        pageIndex: this.pageInfo.pageIndex,
        pageSize: this.pageInfo.pageSize
      }

      getDataSourcesByKeyword(params, pageInfo).then(({ datasourceList, pageInfo }) => {
        this.table = datasourceList
        this.pageInfo.pageIndex = pageInfo.pageIndex
        this.pageInfo.total = pageInfo.totalSize

        this.table.forEach((item) => {
          item.typeLabel = !item.type ? 'mysql' : item.type === 1 ? 'SQL-Server' : 'Oracle'
        })
      })
    },
    // 编辑数据源
    editDataSource ({ row }) {
      this.visible = true

      this.form.businessName = row.businessName
      this.form.databaseName = row.databaseName
      this.form.type = row.type
      this.form.localhost = row.localhost
      this.form.port = parseInt(row.port)
      this.form.username = row.username
      this.form.password = row.password
    },
    addDataSource () {
      let params = {
        databaseName: this.form.databaseName,
        businessName: this.form.businessName,
        type: this.form.type,
        localhost: this.form.localhost,
        port: this.form.port,
        jdbcUrl: this.form.jdbcUrl,
        username: this.form.username,
        password: this.form.password
      }

      addDataSource(params)
    },
    connectionTest () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const params = {
            username: this.form.username,
            password: this.form.password,
            jdbcUrl: this.form.jdbcUrl,
            type: this.form.type
          }

          connectionTest(params).then(() => {
            this.$message.success('连接成功')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })

    },
    submit () {
      if (!this.form.businessName) return this.$message.error('业务名不能为空')

      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.addDataSource()
        } else {
          console.log('error submit!!')
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
  }

  .dialog {
    .form-input,
    .title-input {
      width: 150px;
    }

    .title-input >>> .el-input__inner {
      margin-bottom: 10px;
      border-top: none;
      border-left: none;
      border-right: none;
      border-radius: 0;
    }

    .url-tag {
      border: none;
      outline: none;
      box-sizing: border-box;
      background-color: #f0f9eb;
      color: #67c23a;
      width: 100%;
      white-space: wrap;
      padding: 8px 16px;
      border-radius: 4px;
      resize: none;
    }
  }

  .clearFloat {
    clear: both;
  }
}
</style>
