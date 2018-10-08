<template>
  <v-expansion-panel expand v-model="expand">
    <v-expansion-panel-content v-for="(obj, i) in parsed" :key="i">
      <div slot="header" v-text="obj.key"/>
      <v-card>
        <v-card-text>
          <template v-if="typeof obj.value === 'object'">
            <z-json-node :value="obj.value"/>
          </template>
          <template v-else>
            <article class="markdown-body">
              <pre><code class="hljs plain" v-text="obj.value"/></pre>
            </article>
          </template>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  name: 'zJsonNode',
  props: ['value'],
  data () {
    return {
      parsed: [],
      expand: []
    }
  },
  created () {
    for (let key in this.value) {
      if (this.value[key] !== null && this.value[key] !== '') { this.parsed.push({ key: key, value: this.value[key] }) }
    }
    this.expand = [...Array(this.parsed.length).keys()].map(() => true)
  }
}
</script>
