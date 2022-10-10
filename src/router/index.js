import Vue from "vue"
import Router from "vue-router"

import Layout from "@/layout/index"

import Login from '@/views/login/index'
import ssoLogin from '@/views/login/ssoLogin'

import StatisticsYears from '@/views/statistics-years/index'
import SqlServer from '@/views/sql-server/index'
import TableDetail from '@/views/table-detail/index'
import ReportDatabase from '@/views/report-database/index'
import ReportTemplate from '@/views/report-template/index'
import ReportDesign from '@/views/report-design/index'
import ReportPreview from '@/views/report-preview/index'
import BookReader from '@/views/book-reader/index'
import TableManage from "@/views/table-manage/index"

Vue.use(Router)

export default new Router({
  mode: "history",
  base: "/",
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login
    },
    {
      path: '/login',
      name: 'login',
      component: ssoLogin
    },
    {
      path: "/home",
      component: Layout,
      redirect: "/home/statistics-years",
      children: [
        {
          path: "statistics-years",
          name: "StatisticsYears",
          component: StatisticsYears
        },
        {
          path: "sql-server",
          name: "SqlServer",
          component: SqlServer
        },
        {
          path: "table-detail",
          name: "TableDetail",
          component: TableDetail
        }
      ]
    },
    {
      path: "/report",
      component: Layout,
      redirect: "/report/report-database",
      children: [
        {
          path: "report-database",
          name: "ReportDatabase",
          component: ReportDatabase
        },
        {
          path: "report-template",
          name: "ReportTemplate",
          component: ReportTemplate
        },
        {
          path: "table-manage",
          name: "TableManage",
          component: TableManage
        }
      ]
    },
    {
      path: '/book',
      component: Layout,
      redirect: '/book/book-reader',
      children: [{
        path: 'book-reader',
        name: 'BookReader',
        component: BookReader
      }]
    },
    {
      path: "report-preview",
      name: "ReportPreview",
      component: ReportPreview
    }
  ]
})
