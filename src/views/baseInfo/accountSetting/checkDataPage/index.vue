<template>
  <div class="checkDataPage">
    <section v-for="(item, index) in errorData" :key="index">   
      <p v-html="item"></p>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errorData: []
    }
  },
  mounted() {
    let errData = sessionStorage.getItem('hlbSAAS-errorData')
    this.errorData = JSON.parse(errData)
  }
}
</script>

<style scoped>
  .checkDataPage {
    padding: 10px 20px;
  }
</style>