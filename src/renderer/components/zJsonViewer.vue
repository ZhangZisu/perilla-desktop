<template>
    <v-tabs color="primary" dark v-model="tabs">
        <v-tab v-for="i in 2" :key="i">
            <template v-if="i == 1">{{ $t('visualization') }}</template>
            <template v-else-if="i == 2">{{ $t('raw') }}</template>
        </v-tab>
        <v-tab-item v-for="i in 2" :key="i">
            <template v-if="i == 1">
                <z-json-node :value="value"/>
            </template>
            <template v-else-if="i == 2">
                <z-monaco-editor v-model="content" :readonly="true" class="editor" language="json"/>
            </template>
        </v-tab-item>
    </v-tabs>
</template>

<script>
import zJsonNode from './zJsonNode'
import zMonacoEditor from './zMonacoEditor'

export default {
  name: 'zJsonViewer',
  components: {
    zJsonNode,
    zMonacoEditor
  },
  props: ['value'],
  data () {
    return {
      content: '',
      tabs: 0
    }
  },
  created () {
    this.content = JSON.stringify(this.value, null, '\t')
  }
}
</script>

<style lang="stylus" scoped>
.editor
  height 500px
</style>
