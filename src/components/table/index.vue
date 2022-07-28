<template>
  <table border="1">
    <thead>
      <tr cellspacing="0">
        <th v-for="(col, index) of header" :key="index">
          <input ref="thInput" v-if="col.edited" class="table-input" placeholder="输入表头" v-model="col.title"
            @blur="blurCol(col)" @change="blurCol(col)" />
          <span>
            <em v-if="!col.edited">{{ cols[index].title }}</em>
            <el-tooltip v-if="!col.edited" effect="dark" content="编辑列" placement="top">
              <i v-if="!col.edited" class="icon el-icon-edit" @click.stop="editCol(col)"></i>
            </el-tooltip>
            <el-tooltip v-if="!col.edited && colsIndex === index" effect="dark" content="添加列" placement="top">
              <i v-if="!col.edited && colsIndex === index" class="icon el-icon-plus" @click.stop="addCol"></i>
            </el-tooltip>
            <el-tooltip v-if="!col.edited && colsIndex === index && cols.length > 1" effect="dark" content="删除列"
              placement="top">
              <i v-if="!col.edited && colsIndex === index && cols.length > 1" class="icon el-icon-minus"
                @click="deleteCol(index)"></i>
            </el-tooltip>
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in data" :key="index">
        <td v-for="(col, ind) of cols" :key="ind">
          <span>{{ row[col.title] }}---{{ ind }}</span>
          <input class="table-input" placeholder="键" :value="row[col]"
            @change="(e) => inputValue(row, col.title, index, e)" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'CustomTable',
  props: {
    header: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    }

  }
}
</script>
