<template>
  <el-dialog
    :title="batchUpdateTitle"
    :visible.sync="batchUpdateVisible"
    width="500px"
    top="30vh"
    :close-on-click-modal="false"
    :before-close="handleCloseBatchUpdate"
    v-drag
  >
    <section style="padding: 0 20px">
      <el-form :model="batchUpdateForm" ref="batchUpdateForms" size="small">
        <el-form-item
          label="选择项目有效开始时间"
          v-if="batchUpdateIndex === 0"
        >
          <el-date-picker
            v-model="batchUpdateForm.startTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="选择项目有效结束时间"
          v-if="batchUpdateIndex === 1"
        >
          <el-date-picker
            v-model="batchUpdateForm.endTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>

        <template v-if="batchUpdateIndex === 2">
          <el-form-item :inline="true" label="请输入旧的托收代码">
            <el-input v-model="batchUpdateForm.bankCode"></el-input>
          </el-form-item>
          <el-form-item label="请输入新的托收代码">
            <el-input v-model="batchUpdateForm.newBankCode"></el-input>
          </el-form-item>
        </template>

        <template v-if="batchUpdateIndex === 3">
          <el-form-item label="请输入旧的银行代码">
            <el-input v-model="batchUpdateForm.headOfficeCode"></el-input>
          </el-form-item>
          <el-form-item label="请输入新的银行代码">
            <el-input v-model="batchUpdateForm.newHeadOfficeCode"></el-input>
          </el-form-item>
        </template>

        <template v-if="batchUpdateIndex === 5">
          <el-form-item
            label="请输入银行代码"
            prop="headOfficeCode"
            :rules="{
              required: true,
              message: '银行代码不能为空',
              trigger: 'blur',
            }"
          >
            <el-input v-model="batchUpdateForm.headOfficeCode"></el-input>
          </el-form-item>
          <el-form-item
            label="请输入新的托收代码"
            prop="newBankCode"
            :rules="{
              required: true,
              message: '托收代码不能为空',
              trigger: 'blur',
            }"
          >
            <el-input v-model="batchUpdateForm.newBankCode"></el-input>
          </el-form-item>
        </template>

        <template v-if="batchUpdateIndex === 4">
          <el-form-item
            label="请输入托收代码"
            prop="bankCode"
            :rules="{
              required: true,
              message: '托收代码不能为空',
              trigger: 'blur',
            }"
          >
            <el-input v-model="batchUpdateForm.bankCode"></el-input>
          </el-form-item>
          <el-form-item
            label="请输入新的银行代码"
            prop="newHeadOfficeCode"
            :rules="{
              required: true,
              message: '银行代码不能为空',
              trigger: 'blur',
            }"
          >
            <el-input v-model="batchUpdateForm.newHeadOfficeCode"></el-input>
          </el-form-item>
        </template>
      </el-form>
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" plain size="small" @click="confirmBatchUpdate"
        >确 认</el-button
      >
      <el-button plain size="small" @click="cancelBatchUpdate">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      batchUpdateForm: {},
      batchTitleList: [
        "开始日期",
        "结束日期",
        "更新托收代码",
        "更新银行代码",
        "依托收代码更新银行代码",
        "依银行代码更新托收代码",
      ],
    };
  },
  props: {
    batchUpdateVisible: {
      type: Boolean,
      default: false,
    },
    batchUpdateIndex: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    batchUpdateTitle() {
      return this.batchTitleList[this.batchUpdateIndex];
    },
  },
  methods: {
    // 确认
    confirmBatchUpdate() {
      let rowArr = Object.keys(this.batchUpdateForm);
      if (rowArr && rowArr.length > 0) {
        if ([0, 1].includes(this.batchUpdateIndex)) {
          this.$emit("confirmBatchUpdateDate", this.batchUpdateForm);
        } else if ([4, 5].includes(this.batchUpdateIndex)) {
          this.$refs.batchUpdateForms.validate((valid) => {
            if (valid) {
              this.$emit("confirmBatchUpdateOther", this.batchUpdateForm);
            }
          });
        } else this.$emit("confirmBatchUpdateOther", this.batchUpdateForm);
      } else this.$emit("closeBatchUpdate");
    },
    // 取消
    cancelBatchUpdate() {
      this.batchUpdateForm = {};
      this.$refs.batchUpdateForms.resetFields()
      this.$emit("closeBatchUpdate");
    },
    handleCloseBatchUpdate() {
      this.batchUpdateForm = {};
      this.$refs.batchUpdateForms.resetFields()
      this.$emit("closeBatchUpdate");
    },
    // 清空表单
    clearBatchForm() {
      this.batchUpdateForm = {};
      if ([4, 5].includes(this.batchUpdateIndex)) {}
        this.$refs.batchUpdateForms.validateField();
    },
  },
};
</script>

<style>
</style>