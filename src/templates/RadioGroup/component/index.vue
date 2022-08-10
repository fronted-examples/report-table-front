<template>
  <section class="radio-group">
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'RadioGroup',
  componentName: 'RadioGroup',
  props: {
    value: {}
  },
  created () {
    this.$on("handleChange", (value) => {
      this.$emit("change", value)
    })
  },
  methods: {
    handleChange (val) {
      this.$emit("input", val)
      this.$emit("change", val)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index';
</style>
