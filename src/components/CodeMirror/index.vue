<template>
  <codemirror ref="codeMirror" :options="options" @update="handleChange"></codemirror>
</template>

<script>
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/theme/eclipse.css';
import 'codemirror/theme/material-palenight.css';
import "codemirror/addon/fold/foldgutter.css"
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/xml-fold.js';
import 'codemirror/addon/fold/indent-fold.js';
import "codemirror/addon/fold/brace-fold";
import 'codemirror/addon/fold/markdown-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/edit/closeBrackets';
import 'codemirror/addon/edit/matchBrackets';
import 'codemirror/addon/hint/sql-hint.js';
import sqlFormatter from "sql-formatter";

export default {
  name: 'CodeMirror',
  props: {
    value: {},
    options: {
      type: Object,
      default: () => ({
        tabSize: 4,
        mode: { name: 'text/x-mysql' },
        theme: "eclipse",
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        foldgutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
        lineWrapping: true, //代码折叠
        foldGutter: true,
        matchBrackets: true,  //括号匹配
        autoCloseBrackets: true,
      })
    }
  },
  computed: {
    codeMirrorRef () {
      return this.$refs['codeMirror']
    },
    codeMirrorContent () {
      return this.codeMirrorRef.codemirror.getValue()
    }
  },
  methods: {
    changeContent (val) {
      this.codeMirrorRef.codemirror.setValue(val)
    },
    formatSqlContent () {
      this.changeContent(sqlFormatter.format(this.codeMirrorContent))
      console.log('format-sql: ', this.codeMirrorContent)
    },
    handleChange (e) {
      this.$emit('input', this.codeMirrorContent)
    }
  }
}
</script>
