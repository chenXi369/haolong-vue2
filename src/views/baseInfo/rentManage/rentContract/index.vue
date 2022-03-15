<template>
  <div>
    <article class="userRegister">
      <div class="header">
        <el-row>
          <!-- 用户数据 -->
          <el-col>
            <el-button
              plain
              type="primary"
              size="mini"
              icon="el-icon-edit"
              :disabled="isSelectBuild"
              @click="addRentContract()"
            >
              新签
            </el-button>
            <el-popover placement="left">
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
                    style="width: 120px"
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
                <el-form-item label="承租人">
                  <el-input
                    v-model="searchParams.name"
                    placeholder="请输入承租人"
                    clearable
                    size="mini"
                    style="width: 120px"
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
                <el-form-item label="合同号">
                  <el-input
                    v-model="searchParams.name"
                    placeholder="请输入合同号"
                    clearable
                    size="mini"
                    style="width: 150px"
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
                <el-form-item label="银行账号" label-width="96px">
                  <el-input
                    v-model="searchParams.account"
                    placeholder="请输入银行账号"
                    clearable
                    size="mini"
                    style="width: 200px"
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    size="mini"
                    style="margin-left: 30px"
                    @click="handleQuery"
                    >确认</el-button
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
              <el-button
                slot="reference"
                plain
                size="mini"
                type="warning"
                icon="el-icon-search"
                style="margin-left: 12px"
                :disabled="searchState"
                >搜索</el-button
              >
            </el-popover>
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
          v-if="houseDialogVisible"
          :style="tableContStyle"
          style="margin-top: 24px; border-radius: 4px"
        >
          <rent-cont-list
            :content-style-obj="contentStyleObj"
            :house-list="houseList"
            :ht-list-data="htListData"
            :query-params="queryParams"
            :total="total"
            :open-ht-list="openHtList"
            :loading="loading"
            @closeHtDialog="closeHtDialog"
            @delRentContract="delRentContract"
            @openRentContract="openRentContract"
            @pageGetTable="pageGetTable"
            @relateContract="relateContract"
          />
        </section>
      </main>
    </article>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import ElTree from "../../base/components/el-tree";
import RentContList from "./components/rentContList";
import { getWyList } from "@/api/system/houseRes";
import {
  rentContractList,
  rentContracts,
  delContract,
  updateRentContracts
} from "@/api/system/userRegister";

export default {
  components: {
    ElTree,
    RentContList,
  },
  data() {
    return {
      loading: false,
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
      houseDialogVisible: false,
      houseList: [],
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
      searchState: true,
      isSelectBuild: true,
      batchList: [],
      treeLoading: true
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
  activated() {
    this.getRentContractList()
  },
  methods: {
    handleClick(tab) {
      this.activeRegisterName = tab.name;
    },
    // 获得树型图的紧凑机构数据
    getHomeTable() {
      getWyList().then((res) => {
        this.orgList = [...res.data];
        this.treeLoading = false
      });
    },
    // 打开右侧table和一些按钮
    changeShow(e) {
      if (Object.prototype.hasOwnProperty.call(e.node, "buildingId")) {
        this.showTable = e.value;
        this.selectNodeId = e.node.buildingId;
        this.searchState = false;
        Cookies.set("selectPropertyId", e.node.propertyId);
        this.getRentContractList(); // 获取当前楼栋下的房屋
      } else {
        this.selectNodeId = e.node.propertyId;
        this.searchState = true;
        this.houseDialogVisible = false;
        this.isSelectBuild = true;
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
        document.querySelector(".userRegister").clientWidth - val - 58 + "px";
    },
    changeDialog(val) {
      this.dialogVisible = val;
    },
    // 翻页时的处理
    pageGetTable() {
      this.getRentContractList();
    },
    getRentContractList() {
      this.loading = true;
      const params = {
        queryTerms: `where 合同状态=0 and LYID=${this.selectNodeId}`,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
      };
      rentContractList(params).then((res) => {
        this.houseList = [...res.records];
        this.batchList = [...res.records].map(item => {return item.ID})
        if(this.houseList.length > 0) {
          this.isSelectBuild = false;
        } else {
          this.isSelectBuild = true;
        }
        this.houseDialogVisible = true;
        this.total = res.total;
        this.loading = false;
      });
    },
    // 新建租赁合同
    addRentContract() {
      this.$router.push({
        path: "newContract",
        query: {
          value: 'newRent',
          buildingId: this.selectNodeId
        }
      });
    },
    // 删除合同的操作
    delRentContract(val) {
      this.$confirm(`是否确认删除房号为 "${val.内部房号}" 的合同?`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let delParams = {
            contractId: val.ID,
            confirmFlag: 0,
          };
          delContract(delParams).then((res) => {
            if (res.code === 202) {
              this.$confirm(`${res.msg}`, "警告", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                console.log(delParams)
              })
            } else {
              this.getRentContractList();
              this.$message.success("删除成功");
            }
          });
        })
    },
    // 变更合同的操作
    openRentContract(val) {
      this.openHtList = false;
      this.$router.push({
        path: "newContract",
        query: { id: val.ID },
      });
    },
    // 关联合同
    relateContract(val) {
      const query = {
        customerId: val.KHID,
        contractId: val.ID,
      };
      rentContracts(query).then((res) => {
        this.openHtList = true;
        this.htListData = [...res.data];
      });
    },
    // 关闭合同的dialog
    closeHtDialog() {
      this.openHtList = false;
    },
    // 去业主登记
    toRegister() {},
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
      this.getRentContractList(
        this.searchParams.name,
        this.searchParams.roomNo,
        this.searchParams.account
      );
    }
  },
};
</script>

<style lang="scss" scoped>
.userRegister {
  padding: 20px 20px 20px 10px;
  position: relative;
  .header {
    padding: 0px 0px 0px 12px;
  }
  .main {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
}
</style>
