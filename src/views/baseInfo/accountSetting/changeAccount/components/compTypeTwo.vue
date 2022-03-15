<template>
  <div>
    <el-divider></el-divider>

    <p class="selectArea flex flex-row">
      <span>选定范围</span>
      <section class="selectArea-right flex">
        <span>选定用户：【{{compData.username}}】</span>
        <span style="margin-top: 18px">选定项目：【{{compData.itemName}}】</span>
      </section>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    compData: {
      type: Object,
      required: true,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.selectArea {
  padding: 5px 24px;
  font-size: 14px; color: #1890ff;
  .selectArea-right {
    color: #606266;
    margin-left: 92px;
    flex-direction: column;
  }
}
</style>
