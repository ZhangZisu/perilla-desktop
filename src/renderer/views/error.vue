<template>
  <v-container>
    <v-slide-y-transition mode="out-in">
      <v-flex>
        <div class="error-title" v-text="$t('404')"/>
      </v-flex>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
export default {
  name: 'errorView',
  data: function () {
    return {}
  }
}
</script>

<style lang="stylus" scoped>
.error-title
    font-size 144px
    text-align center
</style>
