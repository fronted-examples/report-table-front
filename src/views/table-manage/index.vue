<template>
  <section class="table-manage">
    <section class="header">
      <el-autocomplete class="search-input"
                       :fetch-suggestions="querySearch"
                       value-key="label"
                       v-model="dataSource"
                       @select="selectDataSource"
                       placeholder="数据源"
                       clearable />
    </section>

    <section class="content">
      <el-collapse v-model="activeNames">
        <el-collapse-item v-for="item of tableList"
                          :key="item.tableName"
                          :title="`表名：${item.tableName}`">
          <el-table border
                    :data="item.tableColumns">
            <el-table-column align="center"
                             label="字段名"
                             prop="columnName" />
            <el-table-column align="center"
                             label="注释"
                             prop="comment" />
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </section>
  </section>
</template>

<script>
import { getDataSourcesByKeyword, getTablesByDataSource } from '@/apis/index'
export default {
  name: 'TableManage',
  data () {
    return {
      dataSourceOptions: [],
      dataSourceId: '',
      dataSource: '',
      tableList: [],
      activeNames: ''
    }
  },
  created () {
    this.getDataSourcesByKeyword()
  },
  methods: {
    querySearch (queryString, cb) {
      const results = queryString ? this.dataSourceOptions.filter(this.createFilter(queryString)) : this.dataSourceOptions
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (option) => {
        return (option.label.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    selectDataSource (val) {
      this.dataSourceId = val.value
      this.getTablesByDataSource()
    },
    getDataSourcesByKeyword () {
      getDataSourcesByKeyword().then(({ datasourceList }) => {
        this.dataSourceOptions = datasourceList.map((item) => {
          return {
            label: item.databaseName,
            value: item.id
          }
        })
      })
    },
    getTablesByDataSource () {
      const params = {
        dataSourceId: this.dataSourceId
      }

      getTablesByDataSource(params).then(({ tableList }) => {
        this.tableList = tableList
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-manage {
  box-sizing: border-box;
  padding: 10px 0;
  .header {
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
    padding: 10px;
  }
  .content {
    padding: 10px;
    height: calc(100vh - 80px);
    overflow: auto;

    >>> .el-collapse {
      border: none;
    }

    >>> .el-collapse-item {
      margin: 10px 0;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    >>> .el-collapse-item__header {
      border: none;
      text-indent: 10px;
    }
  }
}
</style>
