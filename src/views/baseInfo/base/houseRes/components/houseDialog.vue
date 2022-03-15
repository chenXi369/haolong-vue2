<template>
  <div>
    <el-dialog
      :visible="dialogVisible"
      width="1000px"
      show-close
      class="article"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <div slot="title" class="dialog-title">
        <svg-icon
          style="width: 24px; height: 24px; margin-right: 6px"
          icon-class="house"
        />
        <span class="title-text">房屋</span>
      </div>
      <el-form
        ref="houseForm"
        size="mini"
        :rules="rules"
        :model="homeDialogForm"
        label-position="right"
        :label-width="formLabelWidth"
      >
        <el-row :gutter="12">
          <el-col :span="6">
            <!-- 房号 -->
            <el-form-item label="房 号" prop="roomNo">
              <el-input v-model="homeDialogForm.roomNo" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <!-- 单元名称 -->
            <el-form-item label="单元名称" prop="unitName">
              <el-input v-model="homeDialogForm.unitName" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 附属面积1 -->
            <el-form-item label="附属面积1" prop="subsidiaryArea1">
              <el-input v-model="homeDialogForm.subsidiaryArea1" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 用途 -->
            <el-form-item label="用 途" prop="purpose">
              <el-select
                v-model="homeDialogForm.purpose"
                placeholder="请选择用途"
              >
                <el-option
                  v-for="item in purposeOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 楼层号 -->
            <el-form-item label="楼 层 号" prop="floorNo">
              <el-input v-model="homeDialogForm.floorNo" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 单元序号 -->
            <el-form-item label="单元序号" prop="unitNo">
              <el-input v-model="homeDialogForm.unitNo" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 附属面积2 -->
            <el-form-item label="附属面积2" prop="subsidiaryArea2">
              <el-input v-model="homeDialogForm.subsidiaryArea2" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 结构 -->
            <el-form-item label="结 构" prop="structure">
              <el-select
                v-model="homeDialogForm.structure"
                placeholder="请选择结构"
              >
                <el-option
                  v-for="item in constructOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 房序号 -->
            <el-form-item label="房 序 号" prop="houseNo">
              <el-input v-model="homeDialogForm.houseNo" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 公摊面积 -->
            <el-form-item label="公摊面积" prop="shareArea">
              <el-input v-model="homeDialogForm.shareArea" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 柱距 -->
            <el-form-item label="柱 距" prop="columnDistance">
              <el-input v-model="homeDialogForm.columnDistance" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 朝向 -->
            <el-form-item label="朝 向" prop="towards">
              <el-select
                v-model="homeDialogForm.towards"
                placeholder="请选择朝向"
              >
                <el-option
                  v-for="item in towardsOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 建筑面积 -->
            <el-form-item label="建筑面积" prop="buildingArea">
              <el-input v-model="homeDialogForm.buildingArea" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 层高 -->
            <el-form-item label="层 高" prop="floorHeight">
              <el-input v-model="homeDialogForm.floorHeight" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 套内面积 -->
            <el-form-item label="套内面积" prop="insideArea">
              <el-input v-model="homeDialogForm.insideArea" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 荷载 -->
            <el-form-item label="荷 载" prop="loads">
              <el-input v-model="homeDialogForm.loads" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <!-- 装修说明 -->
            <el-form-item label="装修说明" prop="decorationInstruct">
              <el-input
                v-model="homeDialogForm.decorationInstruct"
                type="textarea"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <!-- 配套设施 -->
            <el-form-item label="配套设施" prop="supportingFacilities">
              <el-input
                v-model="homeDialogForm.supportingFacilities"
                type="textarea"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <!-- 其他说明 -->
            <el-form-item label="其他说明" prop="remark">
              <el-input v-model="homeDialogForm.remark" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider>状态</el-divider>
        <el-row :gutter="24">
          <el-col :span="4">
            <el-form-item label="竣工房" prop="completionStatus">
              <el-checkbox
                v-model="homeDialogForm.completionStatus"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="已收楼" prop="repossessionStatus">
              <el-checkbox
                v-model="homeDialogForm.repossessionStatus"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="已入住" prop="checkInStatus">
              <el-checkbox v-model="homeDialogForm.checkInStatus" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="已出租" prop="rentalStatus">
              <el-checkbox
                v-model="homeDialogForm.rentalStatus"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="业主出租" prop="agentStatus">
              <el-checkbox v-model="homeDialogForm.agentStatus" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="允许拆租" prop="leaseBreakdownStatus">
              <el-checkbox
                v-model="homeDialogForm.leaseBreakdownStatus"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="返租房" prop="rentBackStatus">
              <el-checkbox
                v-model="homeDialogForm.rentBackStatus"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="委托物业" prop="propertyType">
              <el-checkbox v-model="homeDialogForm.propertyType" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="自用房" prop="isSelfUse">
              <el-checkbox v-model="homeDialogForm.isSelfUse" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="零星房屋" prop="sporadicHouse">
              <el-checkbox v-model="homeDialogForm.sporadicHouse" />
            </el-form-item>
          </el-col>
          <!-- 右侧多选框 -->
          <el-col :span="12">
            <el-form-item label="房屋状态" prop="houseStatus">
              <el-select
                v-model="homeDialogForm.houseStatus"
                :disabled="homeDialogForm.houseStatus === '已售'"
              >
                <el-option
                  v-for="item in houseStatusOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="装修状态" prop="decorationStatus">
              <el-select v-model="homeDialogForm.decorationStatus">
                <el-option
                  v-for="item in decorationOptions"
                  :key="item.no"
                  :label="item.name"
                  :value="item.no"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider>房间空置时段</el-divider>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="空置开始" prop="vacantStart">
              <el-date-picker
                v-model="homeDialogForm.vacantStart"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="空置结束" prop="vacancyEnd">
              <el-date-picker
                v-model="homeDialogForm.vacancyEnd"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider>每平方米参考单价</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="管理费" prop="manageFeeUnitPrice">
              <el-input v-model="homeDialogForm.manageFeeUnitPrice" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="本体维修费" prop="ontologyFundUnitPrice">
              <el-input
                v-model="homeDialogForm.ontologyFundUnitPrice"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="租金" prop="unitRent">
              <el-input v-model="homeDialogForm.unitRent" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
d
<script>
import { getDictionary } from '@/api/system/systemData'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    homeDialogForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formLabelWidth: '90px',

      // 多选框属性
      checkAll: false,
      checkedCities: [],
      isIndeterminate: true,

      purposeOptions: [],
      constructOptions: [],
      towardsOptions: [],
      decorationOptions: [],
      houseStatusOptions: [],
      rules: {
        roomNo: [{ required: true, trigger: 'blur', message: '请输入房号' }],
        floorNo: [{ required: true, trigger: 'blur', message: '请输入楼层号' }],
        houseNo: [{ required: true, trigger: 'blur', message: '请输入放序号' }],
        buildingArea: [
          { required: true, trigger: 'blur', message: '请输入建筑面积' }
        ]
      }
    }
  },
  mounted() {
    getDictionary({ nodeName: '用途' }).then((res) => {
      this.purposeOptions = [...res.data]
    })
    getDictionary({ nodeName: '结构' }).then((res) => {
      this.constructOptions = [...res.data]
    })
    getDictionary({ nodeName: '朝向' }).then((res) => {
      this.towardsOptions = [...res.data]
    })
    getDictionary({ nodeName: '状态' }).then((res) => {
      this.houseStatusOptions = [...res.data]
    })
    getDictionary({ nodeName: '装修状态' }).then((res) => {
      this.decorationOptions = [...res.data]
    })
  },
  methods: {
    cancel() {
      this.$refs['houseForm'].resetFields()
      const val = {
        state: false
      }
      this.$emit('closeHouseDialog', val)
    },
    confirm() {
      this.$refs['houseForm'].validate((valid) => {
        if (valid) {
          const val = {
            state: false,
            node: this.homeDialogForm
          }
          this.$emit('submitHouseForm', val)
        }
      })
    },
    handleClose() {
      this.$refs['houseForm'].resetFields()
      const val = {
        state: false
      }
      this.$emit('closeHouseDialog', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  padding-bottom: 20px;
}
</style>

