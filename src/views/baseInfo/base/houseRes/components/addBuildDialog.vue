<template>
  <div>
    <el-dialog
      title="楼栋"
      :visible.sync="addDialog"
      width="50%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        size="mini"
        ref="buildForm"
        :rules="rules"
        :label-position="labelPosition"
        label-width="90px"
        :model="buildFormData"
        style="min-width: 600px"
      >
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label"><i class="el-icon-s-custom"></i> 基本信息</span>
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>基本信息</span>
              </div>
              <!-- 基本信息的form -->
              <el-row :gutter="30">
                <el-col :span="8">
                  <el-form-item label="栋 号" prop="buildingNo">
                    <el-input v-model="buildFormData.buildingNo"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="栋 名" prop="buildingName">
                    <el-input v-model="buildFormData.buildingName"></el-input>
                  </el-form-item>
                </el-col>

                <el-col>
                  <el-form-item label="地 址" prop="addr">
                    <el-input v-model="buildFormData.addr"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="用 途" prop="purpose">
                    <el-input v-model="buildFormData.purpose"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="结 构" prop="structure">
                    <el-input v-model="buildFormData.structure"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="楼 高" prop="buildingHeight">
                    <el-input v-model="buildFormData.buildingHeight"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="柱 距" prop="columnDistance">
                    <el-input v-model="buildFormData.columnDistance"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="层 高" prop="floorHeight">
                    <el-input v-model="buildFormData.floorHeight"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="层 数" prop="layers">
                    <el-input v-model="buildFormData.layers"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <br />
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>土地</span>
              </div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="宗地面积" prop="parcelArea">
                    <el-input v-model="buildFormData.parcelArea"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="建筑面积" prop="buildingArea">
                    <el-input v-model="buildFormData.buildingArea"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="占地面积" prop="buildingArea">
                    <el-input v-model="buildFormData.area"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <!-- <el-divider>土地</el-divider> -->
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label"
              ><i class="el-icon-document"></i> 使用状况/产权</span
            >
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>使用状况</span>
              </div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="总 套 数" prop="allSets">
                    <el-input v-model="buildFormData.allSets"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="住宅套数" prop="liveSets">
                    <el-input v-model="buildFormData.liveSets"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="住宅面积" prop="liveArea">
                    <el-input v-model="buildFormData.liveArea"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="办公套数" prop="officeSets">
                    <el-input v-model="buildFormData.officeSets"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="办公面积" prop="workArea">
                    <el-input v-model="buildFormData.workArea"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="商铺间数" prop="shopsNum">
                    <el-input v-model="buildFormData.shopsNum"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="商铺面积" prop="shopArea">
                    <el-input v-model="buildFormData.shopArea"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="其它面积" prop="otherArea">
                    <el-input v-model="buildFormData.otherArea"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="其它套数" prop="otherSets">
                    <el-input v-model="buildFormData.otherSets"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <!-- <el-divider>使用状况</el-divider> -->
            <br />
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>产权信息</span>
              </div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="宗 地 号" prop="parcelNo">
                    <el-input v-model="buildFormData.parcelNo"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="地 支 号" prop="earthBranchNo">
                    <el-input v-model="buildFormData.earthBranchNo"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="使用年限" prop="serviceLife">
                    <el-input v-model="buildFormData.serviceLife"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="开始日期" prop="beginTime">
                    <el-date-picker
                      v-model="buildFormData.beginTime"
                      type="date"
                      placeholder="选择日期"
                      style="width: 100%"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="结束日期" prop="endTime">
                    <el-date-picker
                      v-model="buildFormData.endTime"
                      type="date"
                      placeholder="选择日期"
                      style="width: 100%"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="开工日期" prop="startDate">
                    <el-date-picker
                      v-model="buildFormData.startDate"
                      type="date"
                      placeholder="选择日期"
                      style="width: 100%"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="竣工日期" prop="completionTime">
                    <el-date-picker
                      v-model="buildFormData.completionTime"
                      type="date"
                      placeholder="选择日期"
                      style="width: 100%"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="产权证号" prop="certificateNo">
                    <el-input v-model="buildFormData.certificateNo"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="发证日期" prop="certificateDate">
                    <el-date-picker
                      v-model="buildFormData.certificateDate"
                      type="date"
                      placeholder="选择日期"
                      style="width: 100%"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="产 权 人" prop="owner">
                    <el-input v-model="buildFormData.owner"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <!-- <el-divider>产权信息</el-divider> -->
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label"><i class="el-icon-info"></i> 备注说明</span>
            <!-- 备注说明 -->
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>备注说明</span>
              </div>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备 注" prop="remark">
                    <el-input
                      type="textarea"
                      v-model="buildFormData.remark"
                    ></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="其他说明" prop="otherDescription">
                    <el-input
                      type="textarea"
                      v-model="buildFormData.otherDescription"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <br />
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>停车场设置</span>
              </div>
              <el-row :gutter="24">
                <el-col :span="8">
                  <el-form-item label="停车场系统" prop="parkingSys">
                    <el-input v-model="buildFormData.parkingSys"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="停车场代码" prop="parkingCode">
                    <el-input v-model="buildFormData.parkingCode"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <!-- <el-divider>停车场设置</el-divider> -->
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label"
              ><i class="el-icon-setting"></i> 费用测算精度</span
            >
            <!-- 费用测算精度 -->
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>精度设置</span>
              </div>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="管理费" prop="manageFeeAccuracy">
                    <el-select v-model="buildFormData.manageFeeAccuracy">
                      <el-option
                        v-for="item in jdOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="本体基金" prop="ontologyFundPrecision">
                    <el-select v-model="buildFormData.ontologyFundPrecision">
                      <el-option
                        v-for="item in jdOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="租金" prop="rentAccuracy">
                    <el-select v-model="buildFormData.rentAccuracy">
                      <el-option
                        v-for="item in jdOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <!-- <el-divider>精度设置</el-divider> -->
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label"><i class="el-icon-picture"></i> 图片</span>
            <!-- 图片 -->
            图片
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addDialogConfirm">确 定</el-button>
        <el-button @click="addDialogCance">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    addDialog: {
      type: Boolean,
      default: false,
    },
    buildFormData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      labelPosition: "right",
      jdOptions: [
        {
          label: "元",
          value: 0,
        },
        {
          label: "角",
          value: 1,
        },
        {
          label: "分",
          value: 2,
        },
      ],
      rules: {
        buildingNo: [
          { required: true, trigger: "blur", message: "请输入楼栋号" },
        ],
        buildingName: [
          { required: true, trigger: "blur", message: "请输入楼栋名" },
        ],
      },
    };
  },
  methods: {
    handleClose() {
      this.$refs["buildForm"].resetFields();
      this.$emit("closeAddDialog", false);
    },
    addDialogCance() {
      this.$refs["buildForm"].resetFields();
      this.$emit("closeAddDialog", false);
    },
    addDialogConfirm() {
      this.$refs["buildForm"].validate((valid) => {
        if (valid) {
          let val = {
            state: false,
            node: this.buildFormData,
          };
          this.$emit("submitLdForm", val);
        }
      });
    },
  },
};
</script>

<style>
</style>
