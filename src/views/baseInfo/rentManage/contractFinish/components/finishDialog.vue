<template>
  <div>
    <el-dialog
      title="合同止约"
      :visible.sync="dialogVisible"
      width="700px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div>
        <el-form ref="finishForm" :model="finishForm" :rules="finishForm.terminationStatus ? finishRules : rules" label-width="100px">
          <el-card shadow="hover">
            <el-col :span="8">
              <el-form-item
                label="终止所有权"
                size="mini"
                prop="terminationStatus"
              >
                <el-checkbox
                  @change="isFinishContract"
                  v-model="finishForm.terminationStatus"
                />
              </el-form-item>
            </el-col>
            <transition name="el-zoom-in-center">
              <el-col :span="16">
                <el-form-item
                  label="终止日期"
                  size="mini"
                  prop="terminationDate"
                >
                  <el-date-picker
                    v-model="finishForm.terminationDate"
                    clearable
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    style="width: 98%"
                  />
                </el-form-item>
              </el-col>
            </transition>
            <el-col :span="24">
              <el-form-item label="终止类型" size="mini" prop="terminationType">
                <el-select
                  v-model="finishForm.terminationType"
                  style="width: 99%"
                >
                  <el-option
                    v-for="item in finishPermOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="终止原因"
                size="mini"
                prop="reasonsForTermination"
              >
                <el-input
                  v-model="finishForm.reasonsForTermination"
                  type="textarea"
                  :rows="2"
                  style="height: 50px; overflow-y: scroll; width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-card>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button plain type="primary" @click="confirmFinish" size="mini"
          >{{ !this.finishForm.terminationStatus ? '反止约' : '确认止约' }}</el-button
        >
        <el-button @click="cancel" size="mini">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    finishForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      finishPermOptions: [
        {
          label: "未终止",
          value: 0,
        },
        {
          label: "正常终止",
          value: 1,
        },
        {
          label: "租户主动终止",
          value: 2,
        },
        {
          label: "租户被动终止",
          value: 3,
        },
        {
          label: "其他原因",
          value: 4,
        },
      ],
      finishRules: {
        terminationDate: [
          { required: true, trigger: "blur", message: "请选择终止日期" },
        ],
        terminationType: [
          { required: true, trigger: "blur", message: "请选择终止类型" },
        ]
      },
      rules: {}
    }
  },
  methods: {
    confirmFinish() {
      this.$refs['finishForm'].validate((valid) => {
        if(valid) {
          this.$emit('finishContract', this.finishForm)
        }
      })
    },
    cancel() {
      this.$refs['finishForm'].resetFields()
      this.$emit('closeDialog', false)
    },
    handleClose() {
      this.$refs['finishForm'].resetFields()
      this.$emit('closeDialog', false)
    },
    isFinishContract(val) {
      if(!val) {
        this.$emit('isFinishPerm')
      }
    }
    // finishPermission() {
    //   this.isFinishPerm = this.finishForm.terminationStatus;
    // }
  }
};
</script>
