<template>
  <el-dialog
    title="物业"
    :visible.sync="addWyDialog"
    width="750px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form
      ref="wyForm"
      :label-position="labelPosition"
      label-width="90px"
      :model="wyFormData"
      :rules="rules"
      size="mini"
    >
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-s-custom"></i> 基本信息</span>
          <!-- 基本信息的form -->

          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="编 号" prop="number">
                <el-input v-model="wyFormData.number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="名 称" prop="propertyName">
                <el-input v-model="wyFormData.propertyName"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="总 栋 数" prop="totalNumberOfBuildings">
                <el-input
                  v-model="wyFormData.totalNumberOfBuildings"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="总 套 数" prop="totalSets">
                <el-input v-model="wyFormData.totalSets"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="住宅套数" prop="numberOfResidentialUnits">
                <el-input
                  v-model="wyFormData.numberOfResidentialUnits"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="住宅面积" prop="residentialArea">
                <el-input v-model="wyFormData.residentialArea"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="办公套数" prop="numberOfOfficeUnits">
                <el-input v-model="wyFormData.numberOfOfficeUnits"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="办公面积" prop="officeSpace">
                <el-input v-model="wyFormData.officeSpace"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商铺间数" prop="numberOfShops">
                <el-input v-model="wyFormData.numberOfShops"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商铺面积" prop="shopArea">
                <el-input v-model="wyFormData.shopArea"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="其它套数" prop="otherSets">
                <el-input v-model="wyFormData.otherSets"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="其它面积" prop="otherAreas">
                <el-input v-model="wyFormData.otherAreas"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="占地面积" prop="areaCovered">
                <el-input v-model="wyFormData.areaCovered"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="建筑面积" prop="builtUpArea">
                <el-input v-model="wyFormData.builtUpArea"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="商铺间数" prop="numberOfShops">
                <el-input v-model="wyFormData.numberOfShops"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商铺面积" prop="shopArea">
                <el-input v-model="wyFormData.shopArea"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="容 积 率" prop="plotRatio">
                <el-input v-model="wyFormData.plotRatio"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="建筑密度" prop="buildingDensity">
                <el-input v-model="wyFormData.buildingDensity"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="绿 化 率" prop="greeningRate">
                <el-input v-model="wyFormData.greeningRate"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="柱 距" prop="columnSpacing">
                <el-input v-model="wyFormData.columnSpacing"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-document"></i> 土地和产权</span>
          <!-- 基本信息的form -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="宗 地 号" prop="parcelNo">
                <el-input v-model="wyFormData.parcelNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地 支 号" prop="localBranchNumber">
                <el-input v-model="wyFormData.localBranchNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="宗地面积" prop="landArea">
                <el-input v-model="wyFormData.landArea"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="土地用途" prop="landUse">
                <el-input v-model="wyFormData.landUse"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所 在 区" prop="district">
                <el-input v-model="wyFormData.district"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="使用年限" prop="serviceLife">
                <el-input v-model="wyFormData.serviceLife"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="土地位置" prop="landLocation">
                <el-input v-model="wyFormData.landLocation"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开始日期" prop="startDate">
                <el-date-picker
                  v-model="wyFormData.startDate"
                  type="date"
                  placeholder="选择日期"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="建设日期" prop="constructionDate">
                <el-date-picker
                  v-model="wyFormData.constructionDate"
                  type="date"
                  placeholder="选择日期"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束日期" prop="endDate">
                <el-date-picker
                  v-model="wyFormData.endDate"
                  type="date"
                  placeholder="选择日期"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="建成日期" prop="completionDate">
                <el-date-picker
                  v-model="wyFormData.completionDate"
                  type="date"
                  placeholder="选择日期"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产权证号" prop="titleCertificateNo">
                <el-input v-model="wyFormData.titleCertificateNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产权证日期" prop="titleCertificateDate">
                <el-date-picker
                  v-model="wyFormData.titleCertificateDate"
                  type="date"
                  placeholder="选择日期"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="产权人" prop="propertyOwner">
                <el-input v-model="wyFormData.propertyOwner"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-info"></i> 备注</span>
          <!-- 基本信息的form -->

          <el-row>
            <el-col :span="24">
              <el-form-item label="备 注" prop="remark">
                <el-input
                  type="textarea"
                  v-model="wyFormData.remark"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-picture"></i> 图片</span>
          <!-- 基本信息的form -->
          <span>图片</span>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addDialogConfirm">确 定</el-button>
      <el-button @click="addDialogCance">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    addWyDialog: {
      type: Boolean,
      default: false,
    },
    wyFormData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      labelPosition: "right",
      rules: {
        number: [
          { required: true, trigger: "blur", message: "请输入物业编号" },
        ],
        propertyName: [
          { required: true, trigger: "blur", message: "请输入物业名称" },
        ],
      },
    };
  },

  methods: {
    handleClose() {
      this.$refs["wyForm"].resetFields()
      this.$emit("closeAddWyDialog", false);
    },
    addDialogCance() {
      this.$refs["wyForm"].resetFields()
      this.$emit("closeAddWyDialog", false);
    },
    addDialogConfirm() {
      this.$refs["wyForm"].validate((valid) => {
        if (valid) {
          let val = {
            state: false,
            node: this.wyFormData,
          };
          if (valid) {
            this.$emit("submitWyDialog", val);
          }
        }
      });
    },
  },
};
</script>

<style>
</style>
