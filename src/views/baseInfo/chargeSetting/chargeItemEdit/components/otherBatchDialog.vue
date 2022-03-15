<template>
  <el-dialog
    title="请确认"
    :visible.sync="otherBatchUpdateVisible"
    width="500px"
    top="30vh"
    :close-on-click-modal="false"
    :before-close="handleCloseOtherBatch"
    v-drag
  >
    <section style="padding: 0 20px">
      <h4>你已选择更新的范围为：</h4>
      <div style="padding: 0px 10px">
        <p>物业：【{{ slectedUserQuery.propertyName }}】</p>
        <p>
          <el-radio v-model="buildRange" :label="1" style="display: block"
            >【{{ slectedUserQuery.buildingName }}】</el-radio
          >
          <el-radio v-model="buildRange" :label="0" style="display: block; margin-top: 10px">【全部楼栋】</el-radio>
        </p>
        <div style="padding-top: 5px">
          <p v-if="batchUpdateIndex === 2">
            一定要将托收代码 [{{
              otherBatchUpdateInfo.bankCode === undefined
                ? " "
                : otherBatchUpdateInfo.bankCode
            }}] 全部更改为 [{{
              otherBatchUpdateInfo.newBankCode === undefined
                ? " "
                : otherBatchUpdateInfo.newBankCode
            }}] 吗？
          </p>
          <p v-else-if="batchUpdateIndex === 3">
            一定要将银行代码 [{{
              otherBatchUpdateInfo.headOfficeCode === undefined
                ? " "
                : otherBatchUpdateInfo.headOfficeCode
            }}] 全部更改为 [{{
              otherBatchUpdateInfo.newHeadOfficeCode === undefined
                ? " "
                : otherBatchUpdateInfo.newHeadOfficeCode
            }}] 吗？
          </p>
          <p v-else-if="batchUpdateIndex === 5">
            一定要将银行代码 [{{
              otherBatchUpdateInfo.headOfficeCode === undefined
                ? " "
                : otherBatchUpdateInfo.headOfficeCode
            }}] 对应的托收代码全部更改为 [{{
              otherBatchUpdateInfo.newBankCode === undefined
                ? " "
                : otherBatchUpdateInfo.newBankCode
            }}] 吗？
          </p>
          <p v-else>
            一定要将托收代码 [{{
              otherBatchUpdateInfo.bankCode === undefined
                ? " "
                : otherBatchUpdateInfo.bankCode
            }}] 对应的银行代码全部更改为 [{{
              otherBatchUpdateInfo.newHeadOfficeCode === undefined
                ? " "
                : otherBatchUpdateInfo.newHeadOfficeCode
            }}] 吗？
          </p>
        </div>
      </div>
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" plain size="small" @click="confirmOtherBatch"
        >确 认</el-button
      >
      <el-button plain size="small" @click="cancelOtherBatch">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    batchUpdateIndex: {
      type: Number,
    },
    otherBatchUpdateVisible: {
      type: Boolean,
      default: false,
    },
    otherBatchUpdateInfo: {
      type: Object,
      default: () => {},
    },
    slectedUserQuery: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      buildRange: 1,
    };
  },
  methods: {
    confirmOtherBatch() {
      this.$emit("confirmOtherBatch", this.buildRange);
    },
    cancelOtherBatch() {
      this.$emit("closeOtherBatch");
    },
    handleCloseOtherBatch() {
      this.$emit("closeOtherBatch");
    },
  },
};
</script>

<style>
</style>