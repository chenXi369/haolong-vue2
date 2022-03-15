<template>
  <el-dialog
    title="租金明细-修改"
    :visible.sync="dialogPayRent"
    width="750px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <main>
      <el-form
        ref="payRentForm"
        :model="payRentData"
        label-width="130px"
        size="mini"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker
                v-model="payRentData.startDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker
                v-model="payRentData.endDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="正常租金" prop="normalRent">
              <el-input v-model="payRentData.normalRent"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="全额减免租金"
              prop="remissionStatus"
              label-width="120px"
            >
              <el-checkbox v-model="payRentData.remissionStatus" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="租金折扣" prop="rentDiscount">
              <el-input v-model="payRentData.rentDiscount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际租金" prop="rentActually">
              <el-input v-model="payRentData.rentActually"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="租金缴款日期" prop="paymentDate">
              <el-date-picker
                v-model="payRentData.paymentDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应交租金" prop="rentPayable">
              <el-input v-model="payRentData.rentPayable"></el-input>
            </el-form-item>
          </el-col>

          <el-col>
            <el-divider></el-divider>
            <el-col :span="12">
              <el-form-item label="正常管理费" prop="normalManageFee">
                <el-input v-model="payRentData.normalManageFee"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="全额减免管理费" prop="manageFeeReduce">
                <el-checkbox v-model="payRentData.manageFeeReduce" />
              </el-form-item>
            </el-col>
          </el-col>

          <el-col :span="12">
            <el-form-item label="管理费调整值" prop="manageFeeAdjustVal">
              <el-input v-model="payRentData.manageFeeAdjustVal"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管理费折扣" prop="manageFeeDiscount">
              <el-input v-model="payRentData.manageFeeDiscount"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="实际管理费" prop="manageFeeActually">
              <el-input v-model="payRentData.manageFeeActually"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管理费缴款日期" prop="manageFeePaymentDate">
              <el-date-picker
                v-model="payRentData.manageFeePaymentDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="实际管理费" prop="manageFeePayable">
              <el-input v-model="payRentData.manageFeePayable"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调租提醒" prop="rentAdjustmentReminder">
              <el-checkbox v-model="payRentData.rentAdjustmentReminder" />
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                :rows="3"
                v-model="payRentData.remark"
                style="height: 70px; overflow-y: scroll"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </main>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
      <el-button @click="cancel" size="mini">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogPayRent: {
      type: Boolean,
      default: false,
    },
    payRentData: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    handleClose() {
      this.$emit("closePayRent", false);
    },
    cancel() {
      this.$emit("closePayRent", false);
    },
    confirm() {
      this.$emit("submintPayRent", this.payRentData)
    },
  },
};
</script>

<style>
</style>
