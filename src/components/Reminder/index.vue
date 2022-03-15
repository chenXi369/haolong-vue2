<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="reminderVisible"
    width="550px"
    top="30vh"
    :close-on-click-modal="false"
    :before-close="handleCloseReminder"
    v-drag
  >
    <section style="padding: 0 20px">
      <div class="reminderTitle">
        <slot name='reminderTitle'></slot>
      </div>
      <div class="reminderContent">
        <slot name="reminderContent"></slot>
      </div>
      <div class="reminderFooter">
        <slot name="reminderFooter"></slot>
      </div>
    </section>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" plain size="small" @click="confirmReminder"
        >确 认</el-button
      >
      <el-button plain size="small" @click="cancelReminder">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogTitle: {
      type: String,
      default: '',
    },
    reminderVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 确认
    confirmReminder() {
      this.$emit('confirmReminder')
    },
    cancelReminder() {
      this.$emit('closeReminder')
    },
    handleCloseReminder() {
      this.$emit('closeReminder')
    }
  },
};
</script>

<style lang="scss" scoped>
.reminderTitle {
  padding: 15px 0px;
}
.reminderFooter {
  padding: 15px 0px;
}
</style>
