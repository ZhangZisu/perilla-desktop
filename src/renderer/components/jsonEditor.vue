<template>
    <div class="editor">
    </div>
</template>

<script>
import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'

export default {
  name: 'jsonEditor',
  props: {
    readonly: false,
    value: {}
  },
  model: {
    prop: 'value',
    event: 'updateValue'
  },
  watch: {
    value (val) {
      this.editor.set(val)
    }
  },
  mounted () {
    let options = {
      modes: this.readonly ? ['view'] : ['tree', 'code', 'text'],
      onChange: () => {
        try {
          const newvalue = this.editor.get()
          this.$emit('updateValue', newvalue)
          this.$emit('update:valid', true)
        } catch (e) {
          this.$emit('update:valid', false)
        }
      }
    }
    this.editor = new JSONEditor(this.$el, options)
    this.editor.set(this.value)
  },
  beforeDestroy () {
    this.editor.destroy()
  }
}
</script>

<style lang="stylus" scoped>
.editor
  height 640px
  width 100%
</style>
