<template>
  <section class="sql-server">
    <el-input class="search"
              placeholder="表名、表业务名、数据库"
              prefix-icon="el-icon-search"
              v-model="keyword">
    </el-input>

    <el-button class="add-table"
               type="primary"
               plain
               @click="visible = true">添加表记录</el-button>
    <div class="clear-float"></div>

    <el-table class="table"
              :data="tableData"
              border>
      <el-table-column prop="tableName"
                       label="表名" />
      <el-table-column prop="businessName"
                       label="表业务名" />
      <el-table-column prop="database"
                       label="所属数据库" />
      <el-table-column prop="mark"
                       label="备注" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link type="success"
                   @click.stop="getDetail(scope)">查看</el-link>
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

    <el-dialog :visible.sync="visible"
               width="80vw">
      <el-input class="search"
                v-model="tableName"
                placeholder="请输入表名" />
      <el-input class="search"
                placeholder="表业务名"
                v-model="businessName"></el-input>

      <el-input class="search"
                v-model="database"
                placeholder="所属数据库" />

      <div style="margin-top: 10px;">
        <el-button @click="moveUp">上移</el-button>
        <el-button @click="delRow"
                   type="danger"
                   plain>删除字段</el-button>
        <el-button @click="moveDown">下移</el-button>
        <el-button @click="addRow"
                   type="success"
                   plain>插入数据</el-button>
        <el-input-number v-model="num"
                         :min="1"
                         :max="10000"
                         label="数据条目"></el-input-number>
      </div>

      <el-table class="table"
                border
                :data="table"
                style="width: 100%"
                :key="itemKey">
        <el-table-column v-for="(col, index) in cols"
                         :key="index"
                         align="center">
          <template slot="header"
                    slot-scope="scope">
            <input ref="thInput"
                   v-if="col.edited"
                   class="table-input"
                   placeholder="输入表头"
                   v-model="col.title"
                   @blur="blurCol(col)"
                   @change="blurCol(col)" />
            <span>
              <em v-if="!col.edited">{{ cols[index].title }}</em>
            </span>
          </template>
          <template slot-scope="scope">
            <span class="table-span"
                  v-if="!scope.row[col.title].edited"
                  @click="editRow(col.title, scope.row.index)">{{
                scope.row[col.title][col.title]
            }}</span>
            <el-autocomplete class="table-select"
                             v-if="col.title === '类型' && scope.row[col.title].edited"
                             :ref="`tdInput-${col.title}-${scope.row.index}`"
                             :fetch-suggestions="querySearch"
                             v-model="scope.row[col.title][col.title]"
                             @focus="handleFocus(scope.row.index)"
                             @select="(value) => selectOption(scope, col.title, value, scope.row.index)">
            </el-autocomplete>
            <input v-if="col.title !== '类型' && !checkboxes.includes(col.title) && scope.row[col.title].edited"
                   class="table-input"
                   :ref="`tdInput-${col.title}-${scope.row.index}`"
                   :value="scope.row[col.title][col.title]"
                   @focus="handleFocus(scope.row.index)"
                   @blur="(e) => handleBlur(scope, col.title, scope.row.index, e)"
                   @change="(e) => inputValue(scope, col.title, e, scope.row.index)" />

            <input type="checkbox"
                   class="table-checkbox"
                   :ref="`tdInput-${col.title}-${scope.row.index}`"
                   v-if="checkboxes.includes(col.title)"
                   @change="(e) => changeCheck(scope, col.title, e, scope.row.index)" />
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addTable">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { getTables, addTable } from '@/apis/index'
export default {
  data () {
    this.checkboxes = ['能否为null', '虚拟', '主键']

    return {
      keyword: '',
      tableData: [],
      table: [],
      visible: false,
      tableName: '',
      businessName: '',
      database: '',
      cols: [{
        title: "字段名称",
        edited: false
      }, {
        title: '类型',
        edited: false
      }, {
        title: '长度',
        edited: false
      }, {
        title: '小数点',
        edited: false
      }, {
        title: '能否为null',
        edited: false
      }, {
        title: '虚拟',
        edited: false
      }, {
        title: '主键',
        edited: false
      }, {
        title: '注释'
      }],
      options: [{
        value: 'bigint',
        label: 'bigint'
      }, {
        value: 'binary',
        label: 'binary'
      }, {
        value: 'bit',
        label: 'bit'
      }, {
        value: 'blob',
        label: 'blob'
      }, {
        value: 'char',
        label: 'char'
      }, {
        value: 'date',
        label: 'date'
      }, {
        value: 'datetime',
        label: 'datetime'
      }, {
        value: 'decimal',
        label: 'decimal'
      }, {
        value: 'double',
        label: 'double'
      }, {
        value: 'float',
        label: 'float'
      }, {
        value: 'enum',
        label: 'enum'
      }, {
        value: 'geometry',
        label: 'geometry'
      }, {
        value: 'geometrycollection',
        label: 'geometrycollection'
      }, {
        value: 'int',
        label: 'int'
      }, {
        value: 'integer',
        label: 'integer'
      }, {
        value: 'json',
        label: 'json'
      }, {
        value: 'linestring',
        label: 'linestring'
      }, {
        value: 'longblob',
        label: 'longblob'
      }, {
        value: 'longtext',
        label: 'longtext'
      }, {
        value: 'mediumblob',
        label: 'mediumblob'
      }, {
        value: 'mediumint',
        label: 'mediumint'
      }, {
        value: 'mediumtext',
        label: 'mediumtext'
      }, {
        value: 'multilinestring',
        label: 'multilinestring'
      }, {
        value: 'multipoint',
        label: 'multipoint'
      }, {
        value: 'multipolygon',
        label: 'multipolygon'
      }, {
        value: 'numeric',
        label: 'numeric'
      }, {
        value: 'point',
        label: 'point'
      }, {
        value: 'polygon',
        label: 'polygon'
      }, {
        value: 'real',
        label: 'real'
      }, {
        value: 'set',
        label: 'set'
      }, {
        value: 'smallint',
        label: 'smallint'
      }, {
        value: 'text',
        label: 'text'
      }, {
        value: 'time',
        label: 'time'
      }, {
        value: 'timestamp',
        label: 'timestamp'
      }, {
        value: 'tinyblob',
        label: 'tinyblob'
      }, {
        value: 'tinyint',
        label: 'tinyint'
      }, {
        value: 'tinytext',
        label: 'tinytext'
      }, {
        value: 'varbinary',
        label: 'varbinary'
      }, {
        value: 'varchar',
        label: 'varchar'
      }, {
        value: 'year',
        label: 'year'
      }],
      colsIndex: 0,
      itemKey: null, // 强制让表格刷新一次
      num: 1,
      rowIndex: 0,
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [5, 10, 20, 50],
        total: 0
      }
    }
  },
  mounted () {
    this.getTables()
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
    // 当前页的记录数
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageInfo.pageSize = val
      this.getTables()
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
    getDetail ({ row }) {

      window.open(this.$router.resolve({
        name: "TableDetail",
        query: { id: row.id }
      }).href, '_blank')
    },
    editCol (col) {
      let flag
      for (let item of this.cols) {
        flag = false
        if (item.edited) flag = true
      }

      if (flag) return this.$message.error('您有正在编辑的表头')

      col.edited = true

      this.$nextTick(() => {
        this.$refs.thInput[0].focus()
      })
    },
    addCol () {
      this.cols.push({ title: '', edited: true })
      this.colsIndex = this.cols.length - 1
      this.itemKey = Math.random()
      this.$nextTick(() => {
        this.$refs.thInput[0].focus()
      })
    },
    deleteCol (index) {
      /**
       * bug 数据更新了 页面没更新数据 table拿到的数据还是以前的老数据，采用了给table加个key的方法解决
       * 让 table 重新加载 然后刷新数据
      */
      const data = JSON.parse(JSON.stringify(this.cols))
      data.forEach((element, ind) => {
        if (index === ind) {
          data.splice(index, 1)
        }
      })
      console.log("删除后的值", this.cols)
      this.$set(this, 'cols', data)
      this.colsIndex = this.cols.length - 1
      this.itemKey = Math.random()
    },
    addRow () {
      for (let i = 0; i < this.num; i++) {
        let param = {}
        param.index = i
        for (let key of Object.keys(this.cols)) {
          param[Object.values(this.cols[key]).splice(Object.values(this.cols[key]).length - 2, 1)] = {}
          param[Object.values(this.cols[key]).splice(Object.values(this.cols[key]).length - 2, 1)][Object.values(this.cols[key]).splice(Object.values(this.cols[key]).length - 2, 1)] = ''
          // debugger
          console.log('Object.values(this.cols[key]).splice(Object.values(this.cols[key]).length-2, 1): ', Object.values(this.cols[key]).splice(Object.values(this.cols[key]).length - 2, 1)[0])
          if (this.checkboxes.includes(Object.values(this.cols[key]).splice(Object.values(this.cols[key]).length - 2, 1)[0])) {
            param[Object.values(this.cols[key]).splice(Object.values(this.cols[key]).length - 2, 1)][Object.values(this.cols[key]).splice(Object.values(this.cols[key]).length - 2, 1)] = false
          }

          param[Object.values(this.cols[key]).splice(Object.values(this.cols[key]).length - 2, 1)].edited = true
        }
        this.table.push(param)
      }

      console.log('table: ', this.table)
    },
    editRow (title, index) {
      for (let i = 0; i < this.table.length; i++) {
        if (this.table[i].index === index) {
          this.table[i][title].edited = true
          this.$nextTick(() => {
            this.$refs[`tdInput-${title}-${index}`][0].focus()
          })
        }
      }
    },
    blurCol (col) {
      if (!col.title) return this.$message.error('请输入表头')
      col.edited = false

      if (this.table.length) {
        for (let item of this.table) {
          console.log('key: ', item)
          item[col.title] = ''
        }
      }
    },
    selectOption ({ row }, title, value, index) {
      console.log('value: ', value)
      for (let i = 0; i < this.table.length; i++) {
        if (this.table[i].index === index) {
          row[title][title] = value.value
          row[title].edited = false
        }
      }
    },
    inputValue ({ row }, title, e, index) {
      for (let i = 0; i < this.table.length; i++) {
        if (this.table[i].index === index) {
          row[title][title] = e.target.value ? e.target.value : '-'
          row[title].edited = false
        }
      }
    },
    changeCheck ({ row }, title, e, index) {
      for (let i = 0; i < this.table.length; i++) {
        if (this.table[i].index === index) {
          row[title][title] = this.$refs[`tdInput-${title}-${index}`][0].checked
        }
      }
      console.log('checkbox: ', this.$refs[`tdInput-${title}-${index}`][0].checked)
    },
    handleFocus (index) {
      this.rowIndex = index
      console.log('rowIndex: ', this.rowIndex)
    },
    handleBlur ({ row }, title, index, e) {
      console.log('blur: ', e.target.value, row)
      for (let i = 0; i < this.table.length; i++) {
        if (this.table[i].index === index) {
          row[title][title] = e.target.value ? e.target.value : '-'
          row[title].edited = false
        }
      }
    },
    moveUp () {
      if (this.rowIndex === 0) return
      console.log('rowIndex: ', this.rowIndex)
      this.table.splice(this.rowIndex, 1, ...this.table.splice(this.rowIndex - 1, 1, this.table[this.rowIndex]))
      this.table[this.rowIndex - 1].index = this.rowIndex - 1
      this.table[this.rowIndex].index = this.rowIndex

      this.rowIndex = this.rowIndex - 1
      console.log('table: ', this.table)
    },
    delRow () {
      this.table.splice(this.rowIndex, 1)
      console.log('table: ', this.table)
      for (let i = 0; i < this.table.length; i++) {
        if (i >= this.rowIndex) {
          this.table[i].index = this.table[i].index - 1
        }
      }
    },
    moveDown () {
      if (this.rowIndex === this.table.length - 1) return
      this.table.splice(this.rowIndex, 1, ...this.table.splice(this.rowIndex + 1, 1, this.table[this.rowIndex]))
      this.table[this.rowIndex + 1].index = this.rowIndex + 1
      this.table[this.rowIndex].index = this.rowIndex

      this.rowIndex = this.rowIndex + 1
    },
    addTable () {
      let params = {
        tableName: this.tableName,
        businessName: this.businessName,
        database: this.database,
        data: JSON.stringify(this.table),
        mark: ''
      }
      addTable(params)
    },
    getTables () {
      const params = {
        keyword: this.keyword
      }

      const pageInfo = {
        pageIndex: this.pageInfo.pageIndex,
        pageSize: this.pageInfo.pageSize
      }

      getTables(params, pageInfo).then(({ tableList, pageInfo }) => {
        this.tableData = tableList
        this.pageInfo.pageIndex = pageInfo.pageIndex
        this.pageInfo.total = pageInfo.totalSize
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sql-server {
  box-sizing: border-box;
  padding: 20px;
}

.search {
  width: 200px;
}

.add-table {
  float: right;
}

.clear-float {
  clear: both;
}

.table {
  margin-top: 10px;
}

.table >>> .el-input__inner {
  height: 25px;
  line-height: 25px;
}

.table >>> .el-input__icon {
  line-height: 25px;
}

table {
  border-collapse: collapse;
}

table,
th,
td {
  border: 1px solid black;
}

.icon {
  cursor: pointer;
  font-weight: bolder;
}

.icon:hover {
  color: #409eff;
}

em {
  font-style: normal;
}

.table-span {
  display: inline-block;
  width: 100%;
}

.table-checkbox {
  cursor: pointer;
}

.table-input {
  padding: 5px 10px;
  width: 50px;
  outline: none;
  border: none;
  border-bottom: 1px solid #dcdfe6;
  background-color: transparent;
}

.table-input::placeholder {
  color: #dcdfe6;
}

.table-input:focus {
  border-color: #409eff;
}

.table-select >>> .el-input .el-input__inner {
  border-radius: 0;
  border: none;
  border-bottom: 0.0625rem solid #dcdfe6;
  background-color: transparent;
}

.pagination {
  margin-top: 10px;
  float: right;
}
</style>
