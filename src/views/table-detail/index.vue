<template>
  <div class="table-detail">
    <h1 style="text-align:center">{{ businessName }}</h1>
    <el-table
      border
      :data="tableData"
      max-height="350">
      <el-table-column prop="字段名称" label="字段名称" />
      <el-table-column prop="类型" label="类型" />
      <el-table-column prop="长度" label="长度" />
      <el-table-column prop="小数点" label="小数点" />
      <el-table-column label="能否为null">
        <template slot-scope="scope">
          <span>{{ scope.row['能否为null'] ? '能' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="虚拟">
        <template slot-scope="scope">
          <span>{{ scope.row['虚拟'] ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="主键" label="主键">
        <template slot-scope="scope">
          <span>{{ scope.row['主键'] ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="注释" label="注释" />
    </el-table>
  </div>
</template>

<script>
import { getTableById } from '@/apis/index'
export default {
  data () {
    return {
      businessName: '',
      tableData: [],
      id: ''
    }
  },
  mounted () {
    this.id = this.$route.query.id

    this.getTable()
  },
  methods: {
    getTable() {
      let params = {
        id: this.id
      }
      // debugger
      getTableById(params).then((res) => {
        this.businessName = res.table.businessName
        this.tableData = JSON.parse(res.table.data).map((item) => {
          let params = {}
          for (let i=0; i<Object.keys(item).length; i++ ) {
            if (Object.keys(item)[i] === 'index') {
              params[Object.keys(item)[i]] = item[Object.keys(item)[i]]
            } else {
              params[Object.keys(item)[i]] = item[Object.keys(item)[i]][Object.keys(item)[i]]
            }
          }
          console.log('params: ', params)

          return params
        })

        console.log('tableData: ', this.tableData)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-detail {
  padding: 10px 20px;
}
</style>
