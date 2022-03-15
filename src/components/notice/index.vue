<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <div>
      <el-badge :value="12" :max="99" class="item">
        <svg-icon class-name="size-icon" icon-class="notice" />
      </el-badge>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="item of sizeOptions"
        :key="item.value"
        :command="item.value"
      >
        <svg-icon class-name="size-icon" :icon-class="item.value" />
        {{ item.label }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data() {
    return {
      sizeOptions: [
        { label: '合同提醒', value: 'htNotice' },
        { label: '事务提醒', value: 'swNotice' }
      ]
    }
  },
  methods: {
    // 切换command触发
    handleCommand(val) {
      if (val === 'htNotice') {
        this.$router.push('')
      } else {
        this.$router.push('')
      }
    }
  }
}
</script>
<style lang="scss">
.el-badge__content.is-fixed {
  top: 15px;
  right: 12px;
}
.el-badge__content {
  padding: 0 5px;
}
</style>
