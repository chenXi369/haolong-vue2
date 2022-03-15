<template>
  <div>
    <article class="userManage">
      <div class="header">
        <el-row :gutter="24">
          <!-- 部门数据
          <el-col :span="4">
            <el-button
              plain
              type="success"
              icon="el-icon-plus"
              size="mini"
              @click="addOwner"
              >新增</el-button
            >
          </el-col> -->
          <el-col :span="24">
            <el-form
              ref="queryForm"
              :model="searchParams"
              :inline="true"
              label-width="68px"
              style="height: 30px"
            >
              <el-form-item label="房号">
                <el-input
                  v-model="searchParams.roomNo"
                  placeholder="请输入房号"
                  clearable
                  size="mini"
                  style="width: 180px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item label="业主">
                <el-input
                  v-model="searchParams.name"
                  placeholder="请输入业主"
                  clearable
                  size="mini"
                  style="width: 180px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item label="银行账号" label-width="96px">
                <el-input
                  v-model="searchParams.account"
                  placeholder="请输入银行账号"
                  clearable
                  size="mini"
                  style="width: 180px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="mini"
                  style="margin-left: 30px"
                  :disabled="searchState"
                  @click="handleQuery"
                  >搜索</el-button
                >
                <el-button
                  plain
                  type="primary"
                  icon="el-icon-refresh"
                  size="mini"
                  @click="resetQuery"
                  >重置</el-button
                >
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>

      <main class="main">
        <section class="leftTree">
          <El-Tree
            :show-table="showTable"
            :org-list="orgList"
            :is-expand="isExpand"
            :treeLoading="treeLoading"
            :content-style-obj="contentStyleObj"
            @changeShow="changeShow"
            @changeWidth="changeWidth"
          />
        </section>
        <section
          v-if="ownerDialogVisible"
          :style="tableContStyle"
          style="margin-top: 24px; border-radius: 4px"
        >
          <live-person-tab />
        </section>
      </main>
    </article>
  </div>
</template>

<script>
import LivePersonTab from "./components/livePersonTab";
import ElTree from "../components/el-tree";
import { getWyList } from "@/api/system/houseRes";

export default {
  components: {
    ElTree,
    LivePersonTab,
  },
  data() {
    return {
      showTable: false,
      htListData: [],
      orgList: [],
      contentStyleObj: {
        height: "",
      },
      tableContStyle: {
        width: "",
      },
      isExpand: false,
      ownerDialogVisible: false,
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      total: 0,
      openHtList: false,
      selectNodeId: 0,
      searchParams: {
        roomNo: "",
        name: "",
        account: "",
      },
      isSelectNode: true,
      searchState: true,
      treeLoading: true,
    };
  },
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
    handleClick(tab) {
      this.activeRegisterName = tab.name;
    },
    // 获得树型图的紧凑机构数据
    getHomeTable() {
      getWyList().then((res) => {
        this.orgList = [...res.data];
        this.treeLoading = false;
      });
    },
    // 打开右侧table和一些按钮
    changeShow(e) {
      console.log(e);
      if (e.node.hasOwnProperty("propertyId")) {
        this.showTable = e.value;
        this.selectNodeId = e.node.propertyId;
        this.isSelectNode = false;
        this.getHouseList(); // 获取当前物业下的客户
      } else {
        this.selectNodeId = e.node.propertyId;
        this.isSelectNode = true;
        this.ownerDialogVisible = false;
      }
    },
    // 实时获取屏幕高度
    getHeight() {
      this.contentStyleObj.height = window.innerHeight - 250 + "px";
    },
    // 实时获取屏幕宽度
    getWidth() {
      this.tableContStyle.width = window.innerWidth - 540 + "px";
    },
    // 改变el-tree的div宽度继而改变table的div宽度
    changeWidth(val) {
      this.tableContStyle.width =
        document.querySelector(".userManage").clientWidth - val - 58 + "px";
    },
    changeDialog(val) {
      this.dialogVisible = val;
    },
    // 翻页时的处理
    pageGetTable() {
      this.getHouseList();
    },
    getHouseList() {
      this.ownerDialogVisible = true;
      const params = {
        buildingId: this.selectNodeId,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
      };
      // 获取物业所有用户信息
      getOwneraInfo(params).then((res) => {
        this.houseList = [...res.records];
        this.ownerDialogVisible = true;
        this.total = res.total;
      });
    },
    // 房屋对应的合同列表
    openHtDialog(val) {
      getOwnerHtList({ FWID: val }).then((res) => {
        this.htListData = [...res.data];
        this.openHtList = true;
      });
    },
    // 关闭合同的dialog
    closeHtDialog() {
      this.openHtList = false;
    },
    // 去业主登记
    toRegister() {},
    // 重置搜索
    // 重置搜索
    resetQuery() {
      this.searchParams = {
        roomNo: "",
        name: "",
        account: "",
      };
    },
    // 搜索
    handleQuery() {
      this.getHouseList(
        this.searchParams.name,
        this.searchParams.roomNo,
        this.searchParams.account
      );
    },
    // 新增
    addOwner() {
      this.$router.push({
        path: "ownerInfo",
        query: {
          state: "addOwnerInfo",
        },
      });
    },
    // 删除
    delOwner() {},
    // 修改
    updateOwner() {},
    // 导出
    exportTable() {},
  },
};
</script>

<style lang="scss" scoped>
.userManage {
  padding: 20px 20px 20px 10px;
  position: relative;
  .header {
    margin-left: 10px;
  }
  .main {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
}
</style>
