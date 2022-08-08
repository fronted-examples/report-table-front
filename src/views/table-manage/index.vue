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
      <el-card v-for="item of tableList"
               :key="item">
        <div class="card-header">
          {{ item }}
          <i class="el-icon-arrow-right"></i>
        </div>
      </el-card>
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
      tableList: []
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
  padding: 10px;
  .content {
    margin-top: 20px;
    height: calc(100vh - 80px);
    overflow: auto;
    .el-card {
      width: 60%;
      margin: 10px 0;
      .card-header {
        display: flex;
        justify-content: space-between;
        i {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
