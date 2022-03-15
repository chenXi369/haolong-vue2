<template>
  <el-dialog
    :title="roomManageTitle"
    :visible.sync="roomManDialog"
    max-height="250"
    width="80%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <i class="el-icon-s-home" style="color: #409eff; margin-right: 4px" />
        <span>可选房屋（可多选）</span>
        <el-button
          style="float: right; padding: 3px 0"
          icon="el-icon-plus"
          type="text"
          :disabled="addDisable"
          @click="addAllSelectHouse"
          >添加</el-button
        >
      </div>
      <el-table
        border
        :v-loading="loading"
        :data="allHouseList"
        size="mini"
        :height="allHouseList.length > 0 ? '230' : '120'"
        :cell-style="{ padding: '2px 5px' }"
        element-loading-text="请给我点时间！"
        @selection-change="handleTopSelectionChange"
      >
        <el-table-column type="selection" align="center" width="47" fixed>
        </el-table-column>
        <el-table-column
          prop="大楼名称"
          label="栋名"
          width="100"
          align="left"
        />
        <el-table-column prop="房号" width="90" label="房号" align="left" />

        <el-table-column
          prop="建筑面积"
          label="a 建筑面积"
          width="100"
          align="right"
        />
        <el-table-column
          prop="套内面积"
          label="b 套内面积"
          width="100"
          align="right"
        />
        <el-table-column
          prop="附属面积1"
          label="c 附属面积1"
          width="100"
          align="right"
        />
        <el-table-column
          prop="附属面积2"
          label="d 附属面积2"
          width="100"
          align="right"
        />

        <el-table-column prop="面积公式" label="面积公式" align="left" />
        <el-table-column prop="计价面积" label="计价面积" align="right" />
        <el-table-column prop="房屋状态" label="房屋状态" align="center" />
        <el-table-column label="出租状态" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.出租状态" :disabled="true" />
          </template>
        </el-table-column>
        <el-table-column label="拆租" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.拆租状态" :disabled="true" />
          </template>
        </el-table-column>

        <!-- <el-table-column label="操作" align="center" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-check"
              @click="selectHouse(scope.row)"
            >
              选定
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </el-card>
    <br />
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <i class="el-icon-s-home" style="color: #67c23a; margin-right: 4px" />
        <span>已设定分表</span>
        <!-- <el-button
          style="float: right; padding: 3px 0"
          type="text"
          icon="el-icon-close"
          :disabled="delDisable"
          @click="delAllSelected"
          >删除</el-button
        > -->
      </div>
      <el-table
        border
        max-height="300"
        size="mini"
        v-loading="fbLoading"
        :data="selectedHouseList"
        show-summary
        :cell-style="{ padding: '2px' }"
      >
        <!-- <el-table-column type="selection" width="55" align="center">
        </el-table-column> -->
        <el-table-column
          fixed
          prop="大楼名称"
          label="栋名"
          width="100"
          align="left"
        ></el-table-column>
        <el-table-column label="房号" width="70" align="left">
          <template slot-scope="scope">{{ scope.row.房号 }}</template>
        </el-table-column>
        <el-table-column label="表类别" width="120" align="center">
          <template slot-scope="scope">
            <el-select
              v-if="scope.row.isEdit"
              v-model="scope.row.表类别"
              size="mini"
            >
              <el-option
                v-for="item in tableClassList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <span v-else>{{ tableClassList[scope.row.表类别].label }}</span>
          </template>
        </el-table-column>
        <el-table-column label="有效" align="center">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.有效性"
              :disabled="!scope.row.isEdit"
            />
          </template>
        </el-table-column>
        <el-table-column label="表名" width="120" align="left">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.表名"
              v-if="scope.row.isEdit"
            ></el-input>
            <span v-else>{{ scope.row.表名 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="底数" width="100" align="right">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.底数"
              v-if="scope.row.isEdit"
            ></el-input>
            <span v-else>{{ scope.row.底数 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="倍率" width="100" align="right">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.倍率"
              v-if="scope.row.isEdit"
            ></el-input>
            <span v-else>{{ scope.row.倍率 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="抄表日期" width="155" align="left">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.抄表日期"
              type="date"
              size="mini"
              style="width: 140px"
              v-if="scope.row.isEdit"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
            <span v-else>{{ scope.row.抄表日期 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="父表号" width="180" align="left">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.父表号"
              v-if="scope.row.isEdit"
            ></el-input>
            <span v-else>{{ scope.row.父表号 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="表号" width="180" align="left">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.表号"
              v-if="scope.row.isEdit"
            ></el-input>
            <span v-else>{{ scope.row.表号 }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="建筑面积"
          label="a 建筑面积"
          width="100"
          align="right"
        >
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.建筑面积"
              v-if="scope.row.isEdit"
            ></el-input>
            <span v-else>{{ scope.row.建筑面积 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="套内面积"
          label="b 套内面积"
          width="100"
          align="right"
        >
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.套内面积"
              v-if="scope.row.isEdit"
            ></el-input>
            <span v-else>{{ scope.row.套内面积 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="附属面积1"
          label="c 附属面积1"
          width="100"
          align="right"
        >
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.附属面积1"
              v-if="scope.row.isEdit"
            ></el-input>
            <span v-else>{{ scope.row.附属面积1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="附属面积2"
          label="d 附属面积2"
          width="100"
          align="right"
        >
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.附属面积2"
              v-if="scope.row.isEdit"
            ></el-input>
            <span v-else>{{ scope.row.附属面积2 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="面积公式" align="left">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.面积公式"
              v-if="scope.row.isEdit"
            ></el-input>
            <span v-else>{{ scope.row.面积公式 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="计价面积" label="计价面积" align="right">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-if="scope.row.isEdit"
              v-model="scope.row.计价面积"
            ></el-input>
            <span v-else>{{ scope.row.计价面积 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="房屋状态" align="center">
          <template slot-scope="scope">{{ scope.row.房屋状态 }}</template>
        </el-table-column>
        <el-table-column label="出租状态" align="center" width="80">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.出租状态" :disabled="true" />
          </template>
        </el-table-column>
        <el-table-column label="拆组状态" align="center" width="80">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.拆组状态" :disabled="true" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="135">
          <template slot-scope="scope">
            <span style="margin-right: 20px">
              <el-button
                type="text"
                size="mini"
                @click="editUpdateFb(scope.row)"
                v-if="!scope.row.isEdit"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="mini"
                @click="saveUpdateFb(scope.row)"
                v-else
                >保存</el-button
              >
            </span>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-close"
              @click="cancelSelect(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </el-dialog>
</template>

<script>
export default {
  props: {
    roomManageTitle: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false,
    },
    fbLoading: {
      type: Boolean,
      default: false,
    },
    roomManDialog: {
      type: Boolean,
      default: false,
    },
    allHouseList: {
      type: Array,
      default: () => [],
    },
    selectedHouseList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tableClassList: [
        { label: "普通表", id: 0 },
        { label: "峰期表", id: 1 },
        { label: "尖期表", id: 2 },
        { label: "平期表", id: 3 },
        { label: "谷期表", id: 4 },
        { label: "峰平谷计算", id: 5 },
      ],
      addSelection: [],
      addDisable: true,
      delSelection: [],
      delDisable: true,
    };
  },
  methods: {
    handleClose() {
      this.$emit("closeRoomManage");
    },
    handleTopSelectionChange(val) {
      this.addSelection = val;
      if (val && val.length > 0) {
        this.addDisable = false;
      } else {
        this.addDisable = true;
      }
    },
    // 选中
    // selectHouse(row) {
    //   this.$emit("selectedHouse", [].concat(row));
    // },
    addAllSelectHouse() {
      this.$emit("selectedHouse", this.addSelection);
    },
    // 删除
    cancelSelect(row) {
      this.$emit("cancelSelectedHouse", [].concat(row));
    },
    // delAllSelected() {
    //   this.$emit("cancelSelectedHouse", this.delSelection);
    // },
    // 编辑
    editUpdateFb(row) {
      row.isEdit = !row.isEdit;
    },
    // 保存
    saveUpdateFb(row) {
      row.isEdit = !row.isEdit;
      this.$emit("saveUpdateFb", row);
    },
    // handleSelectionChange(val) {
    //   this.delSelection = val;
    //   if (val && val.length > 0) {
    //     this.delDisable = false;
    //   } else {
    //     this.delDisable = true;
    //   }
    // },
  },
};
</script>

<style>
</style>