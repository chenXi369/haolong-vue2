<template>
  <div class="createRoom">
    <el-dialog
      title="成批生成房间资料"
      :visible.sync="roomState"
      width="50%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-table
        ref="multipleTable"
        :cell-style="{ padding: '4px' }"
        :data="buildDescList"
        border
        @selection-change="handleSelectionChange"
        @select="select"
        @select-all="selectAll"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column fixed="left" label="单元编码方式" align="center">
          <template slot-scope="scope">
            {{ scope.row.unitCode ? "数字" : "字母" }}
          </template>
        </el-table-column>
        <el-table-column
          label="单元开始序号"
          prop="unitStartNo"
          align="center"
        />
        <el-table-column label="单元结束序号" prop="unitEndNo" align="center" />

        <el-table-column label="开始楼层" prop="startFloor" align="center" />
        <el-table-column label="结束楼层" prop="endFloor" align="center" />
        <el-table-column label="房号编码方式" prop="roomNoCode" align="center">
          <template slot-scope="scope">
            {{ scope.row.roomNoCode ? "数字" : "字母" }}
          </template>
        </el-table-column>
        <el-table-column
          label="房间开始序号"
          prop="roomStartNo"
          align="center"
        />
        <el-table-column label="房间结束序号" prop="roomEndNo" align="center" />

        <el-table-column label="楼层范围" align="center">
          <template slot-scope="scope">
            {{ optionRangeOne[scope.row.floorRange].label }}
          </template>
        </el-table-column>
        <el-table-column label="房号范围" align="center">
          <template slot-scope="scope">
            {{ optionRangeTwo[scope.row.roomNoRange].label }}
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          prop="remark"
          align="center"
          width="250px"
        />
        <el-table-column
          label="操作"
          align="center"
          width="230"
          fixed="right"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-thumb"
              style="padding: 0"
              @click="handleUpdate(scope.row)"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              style="padding: 0; color: red"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
            <el-button
              style="padding: 0"
              type="text"
              size="mini"
              icon="el-icon-printer"
              @click="volumeCreate(scope.row)"
              >成批生成</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <div>
          <el-button
            type="warning"
            plain
            size="mini"
            :disabled="delExcessHouseState"
            @click="deleteSpare"
            >删除冗余房</el-button
          >
        </div>
        <div>
          <el-button
            icon="el-icon-circle-plus"
            type="success"
            plain
            size="mini"
            @click="add"
            >添加</el-button
          >
          <el-button
            type="warning"
            icon="el-icon-error"
            plain
            size="mini"
            @click="closeInnerDialog"
            >关闭</el-button
          >
        </div>
      </span>

      <el-dialog
        :key="innerState"
        width="900px"
        :visible.sync="innerVisible"
        append-to-body
        :title="title"
        :close-on-click-modal="false"
        :before-close="handleInnerClose"
      >
        <template v-if="innerState === 1">
          <div
            style="
              width: 100%;
              height: 250px;
              display: flex;
              padding: 0 20px;
              justify-content: space-between;
            "
          >
            <img
              src="@/assets/images/home.png"
              alt=""
              style="width: 35%; height: 100%"
            />
            <div class="right">
              <el-form
                size="mini"
                ref="startHomeForm"
                :model="startHomeForm"
                label-width="110px"
              >
                <el-form-item label="单元名称" prop="newUnit">
                  <el-radio-group v-model="startHomeForm.newUnit">
                    <el-radio :label="false">不重新生成</el-radio>
                    <el-radio :label="true">重新生成</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="房号" prop="newRoomNo">
                  <el-radio-group v-model="startHomeForm.newRoomNo">
                    <el-radio :label="false">不重新生成</el-radio>
                    <el-radio :label="true">重新生成</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="手工删除的房间" prop="newDeleted">
                  <el-radio-group v-model="startHomeForm.newDeleted">
                    <el-radio :label="false">不重新生成</el-radio>
                    <el-radio :label="true">重新生成</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </template>

        <template v-else-if="innerState === 2">
          <el-table
            :data="innerTableData"
            border
            :cell-style="{ padding: '4px' }"
          >
            <el-table-column
              fixed
              prop="unitNo"
              label="单元序号"
              width="80"
              align="left"
            />
            <el-table-column
              prop="unitName"
              label="单元名称"
              width="80"
              align="center"
            />
            <el-table-column
              prop="floorNo"
              label="楼层号"
              width="80"
              align="left"
            />
            <el-table-column
              prop="houseNo"
              label="房序号"
              width="80"
              align="left"
            />
            <el-table-column
              prop="roomNo"
              label="房号"
              width="80"
              align="left"
            />
            <el-table-column
              prop="buildingArea"
              label="建筑面积"
              width="80"
              align="right"
            />
            <el-table-column
              prop="insideArea"
              label="套内面积"
              width="80"
              align="right"
            />
            <el-table-column
              prop="subsidiaryArea1"
              label="附属面积1"
              width="80"
              align="right"
            />
            <el-table-column
              prop="subsidiaryArea2"
              label="附属面积2"
              width="80"
              align="right"
            />
            <el-table-column
              prop="towards"
              label="朝向"
              width="80"
              align="center"
            />
            <el-table-column
              prop="structure"
              label="结构"
              width="80"
              align="center"
            />
            <el-table-column
              prop="purpose"
              label="用途"
              width="80"
              align="center"
            />
            <el-table-column
              prop="unitName"
              label="装修说明"
              width="80"
              align="center"
            />
            <el-table-column
              prop="unitName"
              label="配套设施"
              width="80"
              align="center"
            />
            <el-table-column
              prop="houseStatus"
              label="房屋状态"
              width="80"
              align="center"
            />
            <el-table-column
              prop="manageFeeUnitPrice"
              label="管理费单价"
              width="80"
              align="right"
            />
            <el-table-column
              prop="ontologyFundUnitPrice"
              label="本体基金单价"
              width="80"
              align="right"
            />
            <el-table-column
              prop="unitRent"
              label="租金单价"
              width="80"
              align="right"
            />
            <el-table-column
              fixed="right"
              label="操作"
              width="140"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-edit"
                  @click="openEdit(scope.row)"
                >
                  修改
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template v-else-if="innerState === 3">
          <div
            style="
              width: 100%;
              height: 250px;
              display: flex;
              padding: 0 20px;
              justify-content: space-between;
            "
          >
            <img
              src="@/assets/images/home.png"
              alt=""
              style="width: 35%; height: 100%"
            />
            <div class="right">
              <el-form
                ref="stepFourForm"
                :model="stepFourForm"
                label-width="50px"
              >
                <el-form-item
                  label="单元名称"
                  prop="newUnit"
                  label-width="120px"
                >
                  <el-radio-group v-model="stepFourForm.newUnit">
                    <el-radio :label="false" style="margin-left: 40px"
                      >不重新生成</el-radio
                    >
                    <el-radio :label="true">重新生成</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="房号" prop="newRoomNo" label-width="90px">
                  <el-radio-group v-model="stepFourForm.newRoomNo">
                    <el-radio :label="false" style="margin-left: 70px"
                      >不重新生成</el-radio
                    >
                    <el-radio :label="true">重新生成</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="手工删除的房间"
                  prop="newDeleted"
                  label-width="160px"
                >
                  <el-radio-group v-model="stepFourForm.newDeleted">
                    <el-radio :label="false">不重新生成</el-radio>
                    <el-radio :label="true">重新生成</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-row>
                  <el-col :span="4">
                    <el-form-item prop="areaUpdated">
                      <el-checkbox v-model="stepFourForm.areaUpdated"
                        >面积更新</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item prop="structureUpdated">
                      <el-checkbox v-model="stepFourForm.structureUpdated"
                        >结构更新</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item prop="towardsUpdated">
                      <el-checkbox v-model="stepFourForm.towardsUpdated"
                        >朝向更新</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item prop="purposeUpdated">
                      <el-checkbox v-model="stepFourForm.purposeUpdated"
                        >用途更新</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item prop="decorationUpdated">
                      <el-checkbox v-model="stepFourForm.decorationUpdated"
                        >装修情况更新</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item prop="supportingUpdated">
                      <el-checkbox v-model="stepFourForm.supportingUpdated"
                        >配套设施更新</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item prop="rentUpdated">
                      <el-checkbox v-model="stepFourForm.rentUpdated"
                        >参考价格更新</el-checkbox
                      >
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
        </template>
        <template v-else>
          <div style="width: 100%; min-width: 750px">
            <el-form ref="form" :model="innerForm" label-width="100px">
              <el-divider>房号格式定义</el-divider>
              <el-row :gutter="5">
                <!-- 房号格式定义 -->
                <el-col :span="3">
                  <el-form-item label="内容" prop="definition1">
                    <el-select
                      v-model="innerForm.definition1"
                      placeholder="请选择"
                      style="width: 90px"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- 分割1 -->
                <el-col :span="1">
                  <el-form-item prop="delimiter1" label-width="89px">
                    <el-input
                      v-model="innerForm.delimiter1"
                      style="width: 40px"
                      maxlength="1"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item prop="definition2">
                    <el-select
                      v-model="innerForm.definition2"
                      placeholder="请选择"
                      style="width: 90px"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- 分割2 -->
                <el-col :span="1">
                  <el-form-item prop="delimiter2" label-width="89px">
                    <el-input
                      v-model="innerForm.delimiter2"
                      style="width: 40px"
                      maxlength="1"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item prop="definition3">
                    <el-select
                      v-model="innerForm.definition3"
                      placeholder="请选择"
                      style="width: 90px"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- 分割3 -->
                <el-col :span="1">
                  <el-form-item prop="delimiter3" label-width="89px">
                    <el-input
                      v-model="innerForm.delimiter3"
                      style="width: 40px"
                      maxlength="1"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item prop="definition4">
                    <el-select
                      v-model="innerForm.definition4"
                      placeholder="请选择"
                      style="width: 90px"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- 分割4 -->
                <el-col :span="1">
                  <el-form-item prop="delimiter4" label-width="89px">
                    <el-input
                      v-model="innerForm.delimiter4"
                      style="width: 40px"
                      maxlength="1"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item prop="definition5">
                    <el-select
                      v-model="innerForm.definition5"
                      placeholder="请选择"
                      style="width: 90px"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="8">
                <!-- 房号格式定义 -->
                <el-col :span="4">
                  <el-form-item label="格式" prop="format1">
                    <el-select
                      v-model="innerForm.format1"
                      placeholder="请选择"
                      style="width: 90px"
                    >
                      <el-option
                        v-for="item in optionTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item prop="format2">
                    <el-select
                      v-model="innerForm.format2"
                      placeholder="请选择"
                      style="width: 90px"
                    >
                      <el-option
                        v-for="item in optionTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item prop="format3">
                    <el-select
                      v-model="innerForm.format3"
                      placeholder="请选择"
                      style="width: 90px"
                    >
                      <el-option
                        v-for="item in optionTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item prop="format4">
                    <el-select
                      v-model="innerForm.format4"
                      placeholder="请选择"
                      style="width: 90px"
                    >
                      <el-option
                        v-for="item in optionTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item prop="format5">
                    <el-select
                      v-model="innerForm.format5"
                      placeholder="请选择"
                      style="width: 90px"
                    >
                      <el-option
                        v-for="item in optionTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="楼层范围" prop="floorRange">
                    <el-select
                      v-model="innerForm.floorRange"
                      placeholder="请选择"
                      style="width: 80%"
                    >
                      <el-option
                        v-for="item in optionRangeOne"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="房号范围" prop="roomNoRange">
                    <el-select
                      v-model="innerForm.roomNoRange"
                      placeholder="请选择"
                      style="width: 80%"
                    >
                      <el-option
                        v-for="item in optionRangeTwo"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="18">
                  <el-form-item label="单元编码方式" prop="unitCode">
                    <el-radio-group v-model="innerForm.unitCode" style="width: 100%">
                      <el-radio :label="true">数字编码</el-radio>
                      <el-radio :label="false">字母编码</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-divider>楼层描述</el-divider>
              <el-row :gutter="24">
                <!-- 楼层描述 -->
                <el-col :span="12">
                  <el-form-item label="单元开始序号" prop="unitStartNo">
                    <el-input
                      v-model="innerForm.unitStartNo"
                      style="width: 80%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="单元结束序号" prop="unitEndNo">
                    <el-input
                      v-model="innerForm.unitEndNo"
                      style="width: 80%"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="楼层开始序号" prop="startFloor">
                    <el-input
                      v-model="innerForm.startFloor"
                      style="width: 80%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="楼层结束序号" prop="endFloor">
                    <el-input v-model="innerForm.endFloor" style="width: 80%" />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="房间开始序号" prop="roomStartNo">
                    <el-input
                      v-model="innerForm.roomStartNo"
                      style="width: 80%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="房间结束序号" prop="roomEndNo">
                    <el-input
                      v-model="innerForm.roomEndNo"
                      style="width: 80%"
                    />
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="说 明" prop="remark">
                    <el-input
                      v-model="innerForm.remark"
                      type="textarea"
                      style="width: 92%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <div style="marigin: 20px 10px">
                <el-button type="mini" size="mini" @click="getRoomNum"
                  >房号模拟</el-button
                >
                <span style="color: blue; margin-left: 10px">
                  {{ roomNumSign }}</span
                >
                <span>{{ getValue }}</span>
              </div>
            </el-form>
          </div>
        </template>
        <div slot="footer">
          <template v-if="[1, 2, 3].indexOf(innerState) !== -1">
            <el-button
              type="primary"
              plain
              size="mini"
              :disabled="innerState === 1"
              @click="innerUp"
              ><i class="el-icon-arrow-left" />上一步</el-button
            >
            <el-button
              type="primary"
              plain
              size="mini"
              :disabled="innerState === 3"
              @click="innerDown"
              >下一步<i class="el-icon-arrow-right"
            /></el-button>
            <el-button
              :disabled="innerState !== 3"
              type="success"
              plain
              size="mini"
              @click="innerFinish"
              >完成</el-button
            >
          </template>
          <template v-else>
            <el-button type="primary" plain size="mini" @click="innerConfirm"
              >确认</el-button
            >
          </template>
          <el-button size="mini" @click="innerCancel">取消</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import {
  addBuildDesc,
  delBuildDesc,
  updateBuildDesc,
  getBuildDesc,
  delExcessHouse,
  addStartHouse,
  addOtherHouse,
} from "@/api/system/houseRes";
export default {
  props: {
    roomState: {
      type: Boolean,
      default: false,
    },
    buildDescList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      innerVisible: false,
      title: "",
      info:
        "生成描述中指定的开始楼层的房间资料，目的是首先为其它楼层的房间资料的自动建立确立模板！",
      startHomeForm: {
        descriptionId: 0,
        newUnit: false,
        newRoomNo: false,
        newDeleted: false,
      },
      innerState: 1,
      innerForm: {},
      getValue: "",
      options: [
        {
          value: "",
          label: "",
        },
        {
          value: "楼层",
          label: "楼层",
        },
        {
          value: "房号",
          label: "房号",
        },
        {
          value: "单元",
          label: "单元",
        },
      ],
      optionTypes: [
        {
          value: "",
          label: "",
        },
        {
          value: "00",
          label: "00",
        },
        {
          value: "000",
          label: "000",
        },
        {
          value: "字母",
          label: "字母",
        },
      ],
      optionRangeOne: [
        {
          value: 0,
          label: "全部楼层",
        },
        {
          value: 1,
          label: "奇数楼层",
        },
        {
          value: 2,
          label: "偶数楼层",
        },
      ],
      optionRangeTwo: [
        {
          value: 0,
          label: "全部房号",
        },
        {
          value: 1,
          label: "奇数房号",
        },
        {
          value: 2,
          label: "偶数房号",
        },
      ],
      roomNumSign: "房号格式模拟：",
      confirmState: "",
      multipleSelection: 0,
      delExcessHouseState: true,
      innerTableData: [],
      stepFourForm: {
        descriptionId: 0,
        beginIdList: "",
        newUnit: false,
        newRoomNo: false,
        newDeleted: false,
        areaUpdated: false,
        structureUpdated: false,
        towardsUpdated: false,
        purposeUpdated: false,
        decorationUpdated: false,
        supportingUpdated: false,
        rentUpdated: false,
      },
      houseIdList: [],
    };
  },
  methods: {
    handleClose() {
      this.$emit("closeRoom", false);
    },
    // 成批生成,打开新窗口
    volumeCreate(row) {
      this.innerVisible = true;
      this.innerState = 1;
      this.title = "第一步: 生成开始楼层房间资料";
      this.startHomeForm.descriptionId = row.descriptionId;
    },
    // 删除冗余房
    deleteSpare() {
      this.$confirm(
        `确定删除描述外的冗余房间的资料?(若房间有业主或租户所属,或者房间属于零星房屋,系统将不会自动删除!)`,
        "警告",
        {
          confirmButtonText: "是(Y)",
          cancelButtonText: "否(N)",
          type: "warning",
        }
      )
        .then(() => {
          return delExcessHouse({ descriptionId: this.multipleSelection });
        })
        .then((res) => {
          console.log(res.data);
          this.$message.success("删除成功");
        });
    },
    add() {
      this.innerForm = {};
      this.innerVisible = true;
      this.innerState = 4;
      this.confirmState = "新增";
      this.title = "大楼描述";
    },
    handleUpdate(row) {
      getBuildDesc({ descriptionId: row.descriptionId }).then((res) => {
        this.innerForm = { ...res.data };
      });
      this.innerVisible = true;
      this.innerState = 4;
      this.confirmState = "修改";
      this.title = "大楼描述";
    },
    handleDelete(row) {
      this.$confirm(`是否确认删除该描述?`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return delBuildDesc({ descriptionId: row.descriptionId });
        })
        .then(() => {
          this.$emit("getDescList", true);
          this.$message.success("删除成功");
        });
    },
    confirm() {
      this.$emit("closeRoom", false);
    },
    // 内层弹窗的处理
    innerCancel() {
      this.getValue = "";
      this.innerVisible = false;
    },
    innerUp() {
      if (this.innerState === 3) {
        this.innerState = 2;
        this.title = "第二步: 编辑开始楼层的房间资料";
      } else if (this.innerState === 2) {
        this.innerState = 1;
        this.title = "第一步: 生成开始楼层房间资料";
      } else if (this.innerState === 2) {
        this.innerState = 1;
        this.title = "第一步: 生成开始楼层房间资料";
        this.innerVisible = false;
      }
    },
    innerDown() {
      if (this.innerState === 1) {
        console.log(this.startHomeForm);
        addStartHouse(this.startHomeForm).then((res) => {
          // console.log(res.data);
          this.innerTableData = [...res.data];
          this.houseIdList = this.innerTableData.map((item) => {
            return (item = item.houseId);
          });
          this.stepFourForm.beginIdList = JSON.stringify(this.houseIdList)
            .replace("[", "")
            .replace("]", "");
          this.innerState = 2;
          this.title = "第二步: 编辑开始楼层的房间资料";
        });
      } else if (this.innerState === 2) {
        this.innerState = 3;
        this.title = "第三步: 成批生成其它楼层的房间资料";
        this.stepFourForm.descriptionId = this.startHomeForm.descriptionId;
      }
    },
    innerFinish() {
      addOtherHouse(this.stepFourForm).then(() => {
        this.innerVisible = false;
        this.$message.success("批量生成房屋成功");
        this.$emit("successAddHouse", "success");
      });
    },
    closeInnerDialog() {
      this.$emit("closeRoom", false);
    },
    innerConfirm() {
      if (this.confirmState === "新增") {
        if (this.innerForm !== {}) {
          addBuildDesc(this.innerForm).then(() => {
            this.$message.success("新增成功！");
            this.$emit("getDescList", true);
            this.innerVisible = false;
          });
        }
      } else if (this.confirmState === "修改") {
        updateBuildDesc(this.innerForm).then(() => {
          this.$message.success("修改成功！");
          this.$emit("getDescList", true);
          this.innerVisible = false;
        });
      }
    },
    // 房号模拟
    getRoomNum() {
      this.roomNumSign = "2单元19楼第五间的房号模拟：";
      // console.log(this.innerForm.definition1, this.innerForm.format1);
      let roomOne = "";
      let roomTwo = "";
      let roomThree = "";
      let roomFour = "";
      let roomFive = "";
      if (this.innerForm.definition1 === "楼层") {
        if (this.innerForm.format1 === "000") {
          roomOne = "019";
        } else if (this.innerForm.format1 === "00") {
          roomOne = "19";
        } else if (this.innerForm.format1 === "字母") {
          roomOne = "S";
        } else {
          roomOne = "19";
        }
      } else if (this.innerForm.definition1 === "房号") {
        if (this.innerForm.format1 === "000") {
          roomOne = "005";
        } else if (this.innerForm.format1 === "00") {
          roomOne = "05";
        } else if (this.innerForm.format1 === "字母") {
          roomOne = "E";
        } else {
          roomOne = "5";
        }
      } else if (this.innerForm.definition1 === "单元") {
        if (this.innerForm.format1 === "000") {
          roomOne = "002";
        } else if (this.innerForm.format1 === "00") {
          roomOne = "02";
        } else if (this.innerForm.format1 === "字母") {
          roomOne = "B";
        } else {
          roomOne = "2";
        }
      }

      if (this.innerForm.definition2 === "楼层") {
        if (this.innerForm.format2 === "000") {
          roomTwo = "019";
        } else if (this.innerForm.format2 === "00") {
          roomTwo = "19";
        } else if (this.innerForm.format2 === "字母") {
          roomTwo = "S";
        } else {
          roomTwo = "19";
        }
      } else if (this.innerForm.definition2 === "房号") {
        if (this.innerForm.format2 === "000") {
          roomTwo = "005";
        } else if (this.innerForm.format2 === "00") {
          roomTwo = "05";
        } else if (this.innerForm.format2 === "字母") {
          roomTwo = "E";
        } else {
          roomTwo = "5";
        }
      } else if (this.innerForm.definition2 === "单元") {
        if (this.innerForm.format2 === "000") {
          roomTwo = "002";
        } else if (this.innerForm.format2 === "00") {
          roomTwo = "02";
        } else if (this.innerForm.format2 === "字母") {
          roomTwo = "B";
        } else {
          roomTwo = "2";
        }
      }

      if (this.innerForm.definition3 === "楼层") {
        if (this.innerForm.format3 === "000") {
          roomThree = "019";
        } else if (this.innerForm.format3 === "00") {
          roomThree = "19";
        } else if (this.innerForm.format3 === "字母") {
          roomThree = "S";
        } else {
          roomThree = "19";
        }
      } else if (this.innerForm.definition3 === "房号") {
        if (this.innerForm.format3 === "000") {
          roomThree = "005";
        } else if (this.innerForm.format3 === "00") {
          roomThree = "05";
        } else if (this.innerForm.format3 === "字母") {
          roomThree = "E";
        } else {
          roomThree = "5";
        }
      } else if (this.innerForm.definition3 === "单元") {
        if (this.innerForm.format3 === "000") {
          roomThree = "002";
        } else if (this.innerForm.format3 === "00") {
          roomThree = "02";
        } else if (this.innerForm.format3 === "字母") {
          roomThree = "B";
        } else {
          roomThree = "2";
        }
      }

      if (this.innerForm.definition4 === "楼层") {
        if (this.innerForm.format4 === "000") {
          roomFour = "019";
        } else if (this.innerForm.format4 === "00") {
          roomFour = "19";
        } else if (this.innerForm.format4 === "字母") {
          roomFour = "S";
        } else {
          roomFour = "19";
        }
      } else if (this.innerForm.definition4 === "房号") {
        if (this.innerForm.format4 === "000") {
          roomFour = "005";
        } else if (this.innerForm.format4 === "00") {
          roomFour = "05";
        } else if (this.innerForm.format4 === "字母") {
          roomFour = "E";
        } else {
          roomFour = "5";
        }
      } else if (this.innerForm.definition4 === "单元") {
        if (this.innerForm.format4 === "000") {
          roomFour = "002";
        } else if (this.innerForm.format4 === "00") {
          roomFour = "02";
        } else if (this.innerForm.format4 === "字母") {
          roomFour = "B";
        } else {
          roomFour = "2";
        }
      }

      if (this.innerForm.definition5 === "楼层") {
        if (this.innerForm.format5 === "000") {
          roomFive = "019";
        } else if (this.innerForm.format5 === "00") {
          roomFive = "19";
        } else if (this.innerForm.format5 === "字母") {
          roomFive = "S";
        } else {
          roomFive = "19";
        }
      } else if (this.innerForm.definition4 === "房号") {
        if (this.innerForm.format5 === "000") {
          roomFive = "005";
        } else if (this.innerForm.format5 === "00") {
          roomFive = "05";
        } else if (this.innerForm.format5 === "字母") {
          roomFive = "E";
        } else {
          roomFive = "5";
        }
      } else if (this.innerForm.definition4 === "单元") {
        if (this.innerForm.format5 === "000") {
          roomFive = "002";
        } else if (this.innerForm.format5 === "00") {
          roomFive = "02";
        } else {
          roomFive = "B";
        }
      }
      this.getValue = `${roomOne}${this.innerForm.delimiter1}${roomTwo}${this.innerForm.delimiter2}${roomThree}${this.innerForm.delimiter3}${roomFour}${this.innerForm.delimiter4}${roomFive}`;
      // console.log(roomOne, roomTwo, roomThree, roomFour, roomFive);
    },
    handleSelectionChange(val) {
      if (val && val.length > 0) {
        this.multipleSelection = val[0].descriptionId;
        this.delExcessHouseState = false;
      } else {
        this.delExcessHouseState = false;
      }
    },
    select(selection, row) {
      if (selection.length > 1) {
        const del_row = selection.shift();
        this.$refs.multipleTable.toggleRowSelection(del_row, false);
      }
    },
    selectAll(selection) {
      if (selection.length > 1) {
        selection.length = 1;
      }
    },
    handleInnerClose() {
      this.getValue = "";
      this.innerVisible = false;
    },
    openEdit(row) {},
  },
};
</script>

<style lang="scss" scoped>
.createRoom {
  .dialog-footer {
    display: flex;
    justify-content: space-between;
  }
}
</style>
<style lang="scss">
.el-dialog__body {
  padding-top: 20px;
}
</style>
