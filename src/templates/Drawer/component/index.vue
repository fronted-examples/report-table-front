<template>
  <div>
    <transition :name="`slide-fade-${direction}`">
      <div v-if="visible"
           :class="`drawer-${direction}`"
           :style="{ '--drawerHeight': '60px', '--drawerTop': top }">
        <slot></slot>
      </div>
    </transition>

    <transition name="fade">
      <div class="mask"
           v-if="visible"
           @click="maskClose"></div>
    </transition>
  </div>
</template>

<script>
const DIRECTIONS = ['ttb', 'rtl', 'btt', 'ltr']

export default {
  name: 'Drawer',
  props: {
    top: Number,
    visible: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'ttb',
      validator: (val) => {
        return DIRECTIONS.indexOf(val) !== -1
      }
    }
  },
  methods: {
    maskClose () {
      this.$emit("update:visible", false)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index';
</style>
