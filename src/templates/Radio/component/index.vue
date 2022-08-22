<template>
  <label class="radio">
    <span class="radio-inner">
      <span v-if="radioType === 'theme'"
            class="radio-inner__input"
            :style="{ '--borderColor': borderColor, '--radioBgColor': bgColor, '--ScaleTimes': parseFloat(size).toString() === 'NaN' ? scaleSize[size] : size }"></span>
      <slot v-if="radioType !== 'theme'"></slot>
    </span>
    <input ref="radioRef"
           class="radio-input"
           type="radio"
           :name="name"
           :value="label"
           v-model="model"
           @change="handleChange" />
  </label>
</template>

<script>
const RADIOTYPES = ['radio', 'theme']
export default {
  name: 'Radio',
  props: {
    name: String,
    value: {},
    label: {},
    radioType: {
      type: String,
      default: 'radio',
      validator: (value) => {
        return RADIOTYPES.indexOf(value) !== -1
      }
    },
    color: {
      type: String,
      default: 'transparent'
    },
    size: {
      type: [String, Number],
      default: 'normal',
      validator: function (val) {
        return ['mini', 'normal', 'large'].indexOf(val) !== -1 || parseFloat(val).toString() !== "NaN"
      }
    },
    backgroundColor: String
  },
  data () {
    return {
      borderColor: 'transparent',
      scaleSize: {
        mini: 0.5,
        normal: 1,
        large: 1.5
      }
    }
  },
  computed: {
    hasGroup () {
      let parent = this.$parent

      while (parent) {
        if (parent.$options.componentName !== 'RadioGroup') {
          parent = parent.$parent
        } else {
          this.radioGroup = parent
          return true
        }
      }

      return false
    },
    bgColor () {
      return this.radioType === 'theme' ? this.label ? this.label : '#CD853F' : '#CD853F'
    },
    model: {
      get () {
        return this.hasGroup ? this.radioGroup.value : this.value
      },
      set (val) {
        this.hasGroup ? this.radioGroup.handleChange(val) : this.$emit('input', val)
        this.$refs.radioRef && (this.$refs.radioRef.checked = this.model === this.label)
      }
    }
  },
  watch: {
    model: {
      handler (newVal) {
        this.$nextTick(() => {
          this.borderColor = this.$refs.radioRef && (this.$refs.radioRef.checked = this.model === this.label) && this.color
        })
      },
      immediate: true
    }
  },
  methods: {
    handleChange () {
      this.$nextTick(() => {
        this.$emit('change', this.model)

        this.hasGroup && this.radioGroup.handleChange(this.model)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index';
</style>
