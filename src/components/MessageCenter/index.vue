<template>
  <div @click="toMsgCenter" class="message">
    <el-tooltip class="item" effect="dark" content="信息中心" placement="bottom">
      <el-badge :value="100" :max="99" class="item">
        <svg-icon class-name="size-icon" icon-class="messageCenter" />
      </el-badge>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  methods: {
    toMsgCenter() {
      this.$router.push({
        path: "/message/center"
      })
    }
  },
};
</script>

