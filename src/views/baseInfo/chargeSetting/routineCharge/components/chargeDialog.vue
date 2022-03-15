<template>
  <article>
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      width="600px"
      :close-on-click-modal="false"
      :before-close="handleClose"
      v-drag
    >
      <el-row :gutter="20">
        <el-form
          size="mini"
          ref="chargeForm"
          :rules="rules"
          :model="chargeForm"
          :disabled="disableDialog"
          :label-width="formLabelWidth"
        >
          <el-col :span="16">
            <el-form-item label="项目编号" prop="no">
              <el-input v-model="chargeForm.no"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="20px" prop="category">
              <el-select v-model="chargeForm.category" style="width: 100%">
                <el-option
                  v-for="item in stateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="中文名称" prop="billingName">
              <el-input v-model="chargeForm.billingName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="30px" prop="fixedItem">
              <el-checkbox v-model="chargeForm.fixedItem">固定项目</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="英文名称" prop="engName">
              <el-input v-model="chargeForm.engName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="统计归类" prop="statisticsCategory">
              <el-select
                v-model="chargeForm.statisticsCategory"
                style="width: 80%"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>

              <el-button
                plain
                type="primary"
                icon="el-icon-search"
                size="mini"
                style="margin-left: 18px"
                @click="clear()"
                >清 除
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                v-model="chargeForm.remark"
                :rows="3"
                style="height: 68px; overflow-y: scroll"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer" v-if="!disableDialog">
        <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
        <el-button @click="cancel" size="mini">取 消</el-button>
      </div>
    </el-dialog>
  </article>
</template>

<script>
export default {
  name: "ChargeDialog",
  props: {
    title: {
      type: String,
      default: ''
    },
    chargeForm: {
      type: Object,
      default: () => {},
    },
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
    disableDialog: {
      type: Boolean,
      default: false,
    },
    chargeItemsNo: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      typeOptions: [],
      formLabelWidth: "80px",
      rules: {
        no: [
          { required: true, trigger: "blur", message: "请输入计费项目编号" },
          {
            validator: (value, callback) => {
              if (this.chargeItemsNo.includes(value)) {
                callback(new Error('请勿输入重复的计费项目'))
              }
            },
            trigger: 'blur'
          }
        ],
        category: [{ required: true, trigger: "blur", message: "请选择" }],
        billingName: [
          { required: true, trigger: "blur", message: "请输入计费项目名称" },
        ],
      },
      stateOptions: [
        { label: "默认", value: 0 },
        { label: "月费用项目", value: 1 },
      ]
    };
  },
  methods: {
    confirm() {
      this.$refs["chargeForm"].validate((valid) => {
        if (valid) {
          this.$emit("submitChargeForm", this.chargeForm);
        }
      });
    },
    cancel() {
      this.$emit("closeDialog");
    },
    handleClose() {
      this.$emit("closeDialog");
    },
    // 清除按钮的操作
    clear() {
      this.$confirm("确定要清除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$emit("clearDialog");
      });
    },
  },
};
</script>

<style>
</style>
