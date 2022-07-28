<template>
  <div>
    <input id="file" type="file" @change="uploadFile" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      sqls: []
    }
  },
  methods: {
    uploadFile (e) {
      console.log('e: ', e)
      // debugger
      var reader = new FileReader();
      reader.readAsText(e.target.files[0], "utf-8");
      reader.onload = (e) => {

        console.log('e: ', e)
        //读取完毕后输出结果
        this.parseTableSql(e.currentTarget.result)

        console.log('sqls: ', this.sqls)
      }
    },
    parseTableSql (sql) {
      if (sql.indexOf('create table'.toUpperCase()) !== -1) {
        let startSql = sql.substring(sql.indexOf('create table'.toUpperCase()))
        if (startSql.indexOf(';') !== -1) {
          let sqlPart = startSql.substring(startSql.indexOf('create table'.toUpperCase()), startSql.indexOf(';') + 1)
          let endSql = startSql.substring(startSql.indexOf(';'))
          let sqlJSON = this.analysis_create_sql(sqlPart)
          this.sqls.push({
            sql: sqlPart,
            sqlJSON: sqlJSON
          })
          console.log('end: ', sqlPart);

          console.log('analysis: ', this.analysis_create_sql(sqlPart))

          this.parseTableSql(endSql)
        }
      }
    },
    analysis_create_sql (sql) {
      sql = sql.trim();
      let sql_big = sql.toUpperCase(); // 大写sql，用来定位，取值还是取原sql
      let table_name = sql.substring(sql_big.indexOf("TABLE") + 5, sql_big.indexOf("(")).trim(); // 表名

      if (table_name.startsWith("`")) {
        table_name = table_name.substring(1, table_name.length - 1);
      }

      let table_annotation = this.analysis_sql_annotation(sql.substring(sql_big.lastIndexOf("COMMENT")));//表注释

      let rule = /\(\d{1,2}, \d\)/g
      let code = this.cut_start_end_out(sql, "(", ")")
      let matches = code.match(rule)
      let translateds = []

      if (matches !== null) {
        for (let i=0; i<matches.length; i++) {
          let translated = matches[i].replace(/,/g, '.')

          let param = {
            match: matches[i],
            translated: translated.replace(/\(|\)/g, '')
          }

          translateds.push(param)
        }

        for (let i=0; i<translateds.length; i++) {
          let pattern = new RegExp(`${translateds[i].match}`)

          code = code.replace(pattern, translateds[i].translated)
        }
      }

      console.log('code: ', code)

      let field_sql = code.split(",");
      let field_array = []; // 表字段
      let primaryKey = "";

      field_sql.forEach(item => {
        item = item.trim().toUpperCase();
        if (item.startsWith("PRIMARY") && item.indexOf("KEY") >= 0) {
          primaryKey = item;
        }
      });

      field_sql.forEach(item => {
        item = item.trim();
        if (item.toUpperCase().startsWith("PRIMARY KEY")) return;
        let obj = {}; // 字段对象

        //字段名
        if (item.startsWith("`")) {
          item = item.substring(1);
          obj.name = item.substring(0, item.indexOf("`"));
        } else {
          obj.name = item.substring(0, item.indexOf(" "));
        }

        item = item.substring(item.indexOf(obj.name) + obj.name.length + 1).trim();

        //字段注释
        let item_big = item.toUpperCase();
        let index = item_big.indexOf("COMMENT");
        if (index > -1) {
          obj.annotation = this.analysis_sql_annotation(item.substring(index));
          item = item.substring(0, index).trim();
        } else {
          obj.annotation = obj.name;
        }


        // 字段类型
        index = item.indexOf('(')
        if (index > -1) {
          obj.type = item.substring(0, index)
          item = item.substring(index, item.length).trim()
        } else if (item.indexOf(" ") < 0)  {
          obj.type = item;
        } else {
          obj.type = item.substring(0, item.indexOf(" "));
        }

        // 字段长度,先判断是否存在小数
        index = item.indexOf('.')
        if (index > -1) {
          obj.len = item.substring(item.indexOf('(')+1, index)
          obj.decimal = item.substring(index+1, item.indexOf(')')).trim()
          item = item.substring(item.indexOf(')')+1, item.length).trim()
        } else {
          index = item.indexOf(')')
          if (index > -1) {
            obj.len = item.substring(item.indexOf('(')+1, index)
            item = item.substring(index+1, item.length).trim()
          } else {
            obj.len = ''
          }
          obj.decimal = ''
        }

        // 是否为null
        index = item.indexOf('not'.toUpperCase())
        if (index > -1) {
          obj.isNull = item.substring(index, item.indexOf('null'.toUpperCase())+'null'.length)
        } else {
          obj.isNull = item.substring(item.indexOf('null'.toUpperCase()), 'null'.length)
        }

        //主键
        obj.primaryKey = primaryKey.indexOf(obj.name.toUpperCase()) >= 0;
        field_array[field_array.length] = obj;
      });

      return {
        table_name,
        table_annotation,
        field_array
      }
    },
    analysis_sql_annotation (sql) {
      return sql.substring(sql.indexOf("'") + 1, sql.lastIndexOf("'"));
    },
    cut_start_end_out (code, start, end) {
      let start_p = 0;
      let end_p = code.length;
      if (start != null) {
        start_p = code.indexOf(start);
        if (start_p < 0) {
          start_p = 0;
        }
        start_p = start_p + start.length;
      }
      if (end != null) {
        end_p = code.lastIndexOf(end);
        if (end_p < 0) {
          end_p = code.length;
        }
      }

      return code.substring(start_p, end_p);
    }
  }
}
</script>
