<template>
  <article class="rentPayManage">
    <header class="header">
      <el-row type="flex" justify="space-between">
        <!-- 用户数据 -->
        <el-col :span="17">
          <el-form
            :inline="true"
            :model="formInline"
            label-width="50px"
            size="mini"
          >
            <!-- <el-form-item label="">
              <el-checkbox v-model="formInline.isAllCheck" :disabled="disabledAll" @change="allCheck">全部</el-checkbox>
            </el-form-item> -->

            <el-form-item label="月份">
              <el-select
                v-model="formInline.months"
                placeholder="请选择"
                @change="selectMonth"
              >
                <el-option
                  v-for="item in monthOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="房号">
              <el-input
                v-model="formInline.roomNum"
                placeholder="请输入"
              ></el-input>
              <!-- <el-select v-model="formInline.roomNum" placeholder="请选择">
                <el-option
                  v-for="item in roomNumOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="客户">
              <el-input
                v-model="formInline.customer"
                placeholder="请输入"
              ></el-input>
              <!-- <el-select v-model="formInline.customer" placeholder="请选择">
                <el-option
                  v-for="item in userOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select> -->
            </el-form-item>
            <el-button
                plain
                type="primary"
                icon="el-icon-search"
                style="margin-left: 5px"
                size="mini"
                @click="search()"
                >搜索</el-button
              >
              <el-button
                plain
                type="success"
                icon="el-icon-refresh"
                style="margin-left: 12px"
                size="mini"
                @click="reSearch()"
                >重置</el-button
              >
          </el-form>
        </el-col>

        <el-col :span="7" type="flex" align="right">
          <el-col :span="24" type="flex" align="right">
            <el-button
              plain
              type="primary"
              icon="el-icon-refresh"
              style="margin-right: 12px"
              size="mini"
              @click="reCalc()"
              :disabled="selectWyId === 0"
              >重算租金</el-button
            >
            <el-upload
              ref="upload"
              class="upload-demo"
              style="display: inline-block"
              action="/"
              :multiple="false"
              :before-upload="beforeUpload"
              :limit="1"
              :on-exceed="handleExceed"
              :http-request="uploadFile"
              :show-file-list="false"
            >
              <el-button
                plain
                type="warning"
                icon="el-icon-upload"
                size="mini"
                :disabled="selectWyId === 0"
                >导入营业额</el-button
              >
              <el-tooltip
                class="item"
                effect="dark"
                content="只能上传csv文件"
                placement="top-end"
              >
                <el-button
                  size="medium"
                  icon="el-icon-info"
                  style="
                    padding: 0px;
                    border-radius: 50%;
                    width: 28px;
                    height: 28px;
                  "
                ></el-button>
              </el-tooltip>
            </el-upload>
          </el-col>
        </el-col>
      </el-row>
    </header>
    <main class="main">
      <rent-Tree
        :wyList="wyList"
        :defaultSpread="defaultSpread"
        :content-style-obj="contentStyleObj"
        :rentTreeLoading="rentTreeLoading"
        @changeShow="changeShow"
        @transWidth="transWidth"
      />
      <section
        :style="tableContStyle"
        style="margin-top: 24px; border-radius: 4px"
      >
        <rent-manage-list
          :rentList="rentList"
          :queryParams="queryParams"
          :contentStyleObj="contentStyleObj"
          :total="total"
          :loading="loading"
          @pageGetTable="pageGetTable"
          @recalculation="recalculation"
          @openRentContract="openRentContract"
          @selectRoom="selectRoom"
          @cancelSelectRoom="cancelSelectRoom"
        >
        </rent-manage-list>
      </section>
    </main>
  </article>
</template>

<script>
import RentTree from "./components/rentTree";
import { getWyList } from "@/api/system/houseRes";
import {
  getSelectMonth,
  getRentPayList,
  reCalculate,
  importTurnover,
} from "@/api/system/rentManage.js";
import RentManageList from "./components/rentManageList.vue";
export default {
  data() {
    return {
      wyList: [],
      contentStyleObj: {
        height: "",
      },
      formInline: {},
      monthOptions: [],
      roomNumOptions: [],
      userOptions: [],

      rentList: [],
      queryParams: {
        pageSize: 20,
        pageNum: 1,
      },
      total: 0,
      loading: false,
      selectWyId: 0,
      selectBuildId: 0,
      tableContStyle: {
        width: "",
      },
      disabledAll: true,
      defaultSpread: [],
      defaultChecked: [],
      fileList: [],
      isSelectRoom: false,
      selectRoomId: 0,
      rentTreeLoading: true
    };
  },
  components: { RentTree, RentManageList },
  created() {
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
    this.getWidth();
    // 紧凑结构
    this.getHomeTable();
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  methods: {
    // 实时获取屏幕高度
    getHeight() {
      this.contentStyleObj.height = window.innerHeight - 260 + "px";
    },
    // 实时获取屏幕宽度
    getWidth() {
      this.tableContStyle.width = window.innerWidth - 540 + "px";
    },
    // 改变el-tree的div宽度继而改变table的div宽度
    transWidth(val) {
      this.tableContStyle.width =
        document.querySelector(".rentPayManage").clientWidth - val - 54 + "px";
    },
    // 紧凑结构
    getHomeTable() {
      getWyList().then((res) => {
        const newArr = [...res.data];
        this.getRangeTree(newArr, this.wyList);
        this.defaultSpread = [this.wyList[0].propertyId];
        this.defaultChecked = [this.wyList[0].buildingList[0].buildingId];
        this.rentTreeLoading = false
      });
    },
    getRangeTree(treeList, newTreeList) {
      treeList.map((c) => {
        let tempData = {
          label: c.hasOwnProperty("buildingId")
            ? c.buildingName
            : c.propertyName,
          id: c.hasOwnProperty("buildingId") ? c.buildingId : c.propertyId,
          propertyId: c.propertyId,
          buildingId: c.hasOwnProperty("buildingId") ? c.buildingId : undefined,
          type: c.hasOwnProperty("buildingId") ? "build" : "wy",
          disabled: false,
        };
        if (c.buildingList && c.buildingList.length > 0) {
          tempData.buildingList = [];
          this.getRangeTree(c.buildingList, tempData.buildingList);
        }
        newTreeList.push(tempData);
      });
    },
    // 根据 wyid 获取默认月份
    getSelectMonth(wyId, buildingId) {
      getSelectMonth({ propertyId: wyId }).then((res) => {
        this.monthOptions = [...res.data];
        this.$set(this.formInline, "months", this.monthOptions[0]);
        this.loading = true;
        if (buildingId !== undefined) {
          this.disabledAll = false;
          this.selectBuildId = buildingId;
          this.getRentList(buildingId);
        } else {
          this.getRentList(undefined);
          this.selectBuildId = 0;
        }
      });
    },
    // 获取对应的调租
    getRentList(id) {
      let query = {
        propertyId: this.selectWyId,
        chargingMonth: this.formInline.months,
        roomNo: this.formInline.roomNum,
        customerName: this.formInline.customer,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
      };
      if (id !== undefined) {
        query.buildingId = id;
      }
      getRentPayList(query).then((res) => {
        this.loading = false;
        this.rentList = [...res.records];
        this.total = res.total;
      });
    },
    // 改变月份的处理
    selectMonth() {
      this.getRentList(this.selectBuildId);
    },
    // 选全部的处理
    // allCheck(val) {
    //   if(val) {
    //     this.getRentList(undefined);
    //   }else {
    //     this.getRentList(this.selectBuildId);
    //   }
    // },
    changeShow(val) {
      this.selectWyId = val.node.propertyId;
      this.getSelectMonth(val.node.propertyId, val.node.buildingId);
    },
    // 翻页的处理
    pageGetTable() {},
    openRentContract() {},
    // 重算租金
    reCalc() {
      const val = {};
      console.log(this.isSelectRoom,  this.selectRoomId)
      if(this.isSelectRoom) {
        val.type = 0, //单条计算
        val.rentDetailId = this.selectRoomId
      } else if (this.selectBuildId === 0) {
        val.type = 1;
        val.propertyId = this.selectWyId;
        val.chargingMonth = this.formInline.months;
      } else {
        val.type = 2;
        val.buildingId = this.selectBuildId;
        val.chargingMonth = this.formInline.months;
      }
      this.$confirm(`是否要重新计算租金?`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return reCalculate(val);
        })
        .then(() => {
          this.getRentList(this.selectBuildId);
          this.$message.success("租金重算成功！");
        });
    },
    // 上传前的验证
    beforeUpload(file) {
      const isCsv = file.name.indexOf(".csv") !== -1;
      if (isCsv) {
        return true;
      } else {
        this.$message.warning(`只能上传csv文件`);
        return false;
      }
    },
    handleExceed() {},
    uploadFile(content) {
      console.log(content)
      const formData = new FormData();
      formData.append('propertyId', this.selectWyId)
      formData.append('file', content.file)
      formData.append('chargingMonth', this.formInline.months)
      importTurnover(formData).then(() => {
        this.getRentList(this.selectBuildId);
        this.$message({
          type: "success",
          message: "上传文件成功",
        });
      })
    },
    recalculation(val) {
      this.$confirm(`是否要重新计算租金?`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return reCalculate(val);
        })
        .then(() => {
          this.getRentList(this.selectBuildId);
          this.$message.success("租金重算成功！");
        });
    },
    selectRoom(val) {
      this.isSelectRoom = true
      this.selectRoomId = val.LID
    },
    cancelSelectRoom() {
      this.isSelectRoom = false
    }
  },
};
</script>

<style lang="scss" scoped>
.rentPayManage {
  padding: 20px 20px 20px 10px;
  position: relative;
  .header {
    padding: 0px 0px 0px 18px;
  }
  .main {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
}
</style>
