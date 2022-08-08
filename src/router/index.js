import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/layout/index'

import StatisticsYears from '@/views/statistics-years/index'
import SqlServer from '@/views/sql-server/index'
import TableDetail from '@/views/table-detail/index'
import ReportDatabase from '@/views/report-database/index'
import ReportTemplate from '@/views/report-template/index'
import ReportDesign from '@/views/report-design/index'
import ReportPreview from '@/views/report-preview/index'
import BookReader from '@/views/book-reader/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/statistics-years',
      children: [{
        path: "statistics-years",
        name: "StatisticsYears",
        component: StatisticsYears
      }, {
        path: 'sql-server',
        name: 'SqlServer',
        component: SqlServer
      }, {
        path: 'table-detail',
        name: 'TableDetail',
        component: TableDetail
      }]
    },
    {
      path: '/report',
      component: Layout,
      redirect: '/report/report-database',
      children: [{
        path: '/report-database',
        name: 'ReportDatabase',
        component: ReportDatabase
      }, {
        path: '/report-template',
        name: 'ReportTemplate',
        component: ReportTemplate
      }]
    },
    {
      path: '/book',
      component: Layout,
      redirect: '/book/book-reader',
      children: [{
        path: '/book-reader',
        name: 'BookReader',
        component: BookReader
      }]
    },
    {
      path: '/report-design',
      name: 'ReportDesign',
      component: ReportDesign
    },
    {
      path: '/report-preview',
      name: 'ReportPreview',
      component: ReportPreview
    }
  ]
})
