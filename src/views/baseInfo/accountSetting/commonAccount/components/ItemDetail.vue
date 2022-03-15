<template>
  <el-dialog
    title="应收款项目"
    :visible.sync="itemDetailVisible"
    width="960px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    v-drag
  >
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="本月费用" name="first"></el-tab-pane>
      <el-tab-pane label="往月费用" name="second"></el-tab-pane>
      <el-tab-pane label="已收/欠收/预收" name="third"></el-tab-pane>
      <el-tab-pane label="备注" name="fourth">
        
      </el-tab-pane>
    </el-tabs>
    <section class="dialog-ctx">
      <component :is="componentName" v-on="$listeners" v-bind="$attrs"></component>
      <div style="margin: 0 10px">
        <el-input type="textarea" v-model="remark" :rows="8" v-if="componentName === ''"></el-input>
      </div>
    </section>
  </el-dialog>
</template>

<script>
import BadCrop from './BadCrop.vue'
import NewMonthPay from './NewMonthPay.vue'
import OtherMonthPay from './OtherMonthPay.vue'
export default {
  inheritAttrs: false,
  props: {
    itemDetailVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      remark: '',
      activeName: 'first',
      componentName: 'NewMonthPay'
    }
  },
  components: {
    BadCrop,
    NewMonthPay,
    OtherMonthPay
  },
  methods: {
    handleClose() {
      this.$emit('closeItemDetail', false)
    },
    handleClick(tab) {
      switch (tab.name) {
        case 'first':
          this.componentName = 'NewMonthPay'
          break;
        case 'second':
          this.componentName = 'OtherMonthPay'
          break;
        case 'third':
          this.componentName = 'BadCrop'
          break;
        case 'fourth':
          this.componentName = ''
          break;
        default: this.componentName = ''
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-ctx {
  box-sizing: border-box;
  width: 100%;
  padding: 20px 10px;
  border: 1px solid #eaeaea; border-top: 0px;
}
</style>
<style lang="scss">
.el-tabs__header {
  margin: 0;
}
</style>