<template>
  <el-menu default-active="0" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff"
    active-text-color="#ffd04b">
    <el-submenu v-for="(menu, index) in menus" :key="index" :index="(index + 1).toString()"
      @click.native.stop="toTarget(menu)">
      <template slot="title">
        <i :class="menu.icon"></i>
        <span>{{ menu.label }}</span>
      </template>
      <el-menu-item-group v-if="menu.children.length">
        <el-menu-item :index="(childIndex + 1).toString()" v-for="(child, childIndex) in menu.children"
          @click.native.stop="toTarget(child)" :key="childIndex">
          <i :class="child.icon"></i>
          {{ child.label }}
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<style>
.el-menu-vertical-demo {
  width: 100%;
  height: 100%;
}

.el-submenu .el-menu-item {
  min-width: 100%;
}

.el-menu-item-group__title {
  padding: 0;
}
</style>

<script>
export default {
  data () {
    return {
      menus: [{
        label: '报表管理',
        icon: 'el-icon-pie-chart',
        children: [{
          label: '数据库管理',
          icon: 'el-icon-s-data',
          name: 'ReportDatabase'
        }, {
          label: '报表模板管理',
          icon: 'el-icon-pie-chart',
          name: 'ReportTemplate'
        }]
      }, {
        label: "客户管理",
        icon: "el-icon-setting",
        children: [{
          label: "SqlServer数据表",
          icon: "el-icon-user",
          name: "SqlServer"
        }, {
          label: "统计年鉴",
          icon: "el-icon-user",
          name: 'StatisticsYears'
        }]
      }]
    };
  },
  methods: {
    toTarget (item) {
      console.log("item: ", item)
      if (!item.name) {
        return this.$router.replace({
          name: item.children[0].name
        }).catch(() => { })
      }

      this.$router.push({
        name: item.name
      }).catch(() => { })
    }
  },
};
</script>
