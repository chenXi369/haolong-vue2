<template>
  <div>
    <article class="userRegister">
      <div class="header">
        <el-row :gutter="20" type="flex" justify="space-between">
          <!-- 用户数据 -->
          <el-col :span="12">
            <el-button
              plain
              type="primary"
              icon="el-icon-circle-check"
              size="mini"
              @click="batchCheck()"
              >成批审核</el-button
            >
            <el-button
              plain
              type="warning"
              icon="el-icon-circle-check"
              size="mini"
              @click="batchNoCheck()"
              >成批反审核</el-button
            >
          </el-col>
          <el-col :span="12" type="flex" align="right">
            <el-col :span="8">
              <el-select
                v-model="searchCondition"
                placeholder="请选择搜索条件"
                style="width: 100%"
                size="mini"
              >
                <el-option
                  v-for="item in searchOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="16" style="display: flex">
              <el-input v-model="searchVal" size="mini" style="margin-right: 15px"></el-input>
              <el-button
                plain
                size="mini"
                type="primary"
                @click="search"
                icon="el-icon-search"
                :disabled="total === 0"
              >
                搜索
              </el-button>
              <el-button plain size="mini" type="success" icon="el-icon-refresh" @click="reSearch">
                重置
              </el-button>
            </el-col>
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
          <rent-check-list
            :content-style-obj="contentStyleObj"
            :house-list="houseList"
            :query-params="queryParams"
            :total="total"
            :loading="loading"
            @checkRentContract="checkRentContract"
            @openRentContract="openRentContract"
            @pageGetTable="pageGetTable"
          />
        </section>
      </main>
    </article>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import ElTree from "../../base/components/el-tree";
import RentCheckList from "./components/rentCheckList";
import { getWyList } from "@/api/system/houseRes";
import {
  rentContractList,
  updateRentContracts
} from "@/api/system/userRegister";

export default {
  components: {
    ElTree,
    RentCheckList,
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
      isSelectBuild: true,
      batchList: [],

      searchOptions: [
        {
          value: "房号",
          label: "房号",
        },
        {
          value: "租户名称",
          label: "承租人",
        },
        {
          value: "手机",
          label: "手机号",
        },
      ],
      searchVal: "",
      searchCondition: "",
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
    this.getRentContractList();
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
      })
    },
    // 打开右侧table和一些按钮
    changeShow(e) {
      console.log(e)
      if (Object.prototype.hasOwnProperty.call(e.node, "buildingId")) {
        this.showTable = e.value;
        this.selectNodeId = e.node.buildingId;
        this.isSelectBuild = true;
        Cookies.set("selectPropertyId", e.node.propertyId);
        this.getRentContractList(); // 获取当前楼栋下的房屋
      } else {
        this.selectNodeId = e.node.propertyId;
        this.isSelectBuild = false;
        this.getRentContractList(); // 获取当前wy下的房屋
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
    // 翻页时的处理
    pageGetTable() {
      this.getRentContractList();
    },
    getRentContractList(val) {
      this.loading = true;
      const params = {
        queryTerms: `where 合同状态=0 and LYID=${this.selectNodeId} ${val === undefined ? '' : val}`,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
      };
      if(!this.isSelectBuild) {
        params.queryTerms = `where 合同状态=0 and WYID=${this.selectNodeId} ${val === undefined ? '' : val}`
      }
      rentContractList(params).then((res) => {
        this.houseList = [...res.records];
        this.batchList = [...res.records].map((item) => {
          return item.ID;
        });
        this.houseDialogVisible = true;
        this.total = res.total;
        this.loading = false;
      });
    },
    // 变更合同的操作
    openRentContract(val) {
      this.openHtList = false;
      this.$router.push({
        path: "newContract",
        query: { id: val.ID, state: "CHECK" },
      });
    },
    // 成批审核
    batchCheck() {
      this.$confirm(`一定要对列表中未审核的合同进行审核吗?`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            contractIds: JSON.stringify(this.batchList)
              .replace("[", "")
              .replace("]", ""),
            review: 1,
          };
          return updateRentContracts(data);
        })
        .then(() => {
          this.getRentContractList();
          this.$message.success("合同审核成功！");
        });
    },
    // 成批反审核
    batchNoCheck() {
      this.$confirm(`一定要对列表中已审核的合同进行反审核吗?`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            contractIds: JSON.stringify(this.batchList)
              .replace("[", "")
              .replace("]", ""),
            review: 0,
          };
          return updateRentContracts(data);
        })
        .then(() => {
          this.getRentContractList();
          this.$message.success("合同反审核成功！");
        });
    },
    checkRentContract(val) {
      console.log(val);
      this.$confirm(
        `一定要对本合同进行${val.审核标志 ? "反审核" : "审核"}吗?`,
        "警告",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        let data = {
          contractIds: val.ID,
          review: val.审核标志 ? 0 : 1,
        };
        updateRentContracts(data).then(() => {
          this.isCheck = true;
          this.getRentContractList();
          this.$message.success(
            `合同${val.审核标志 ? "反审核" : "审核"}成功！`
          );
        });
      });
    },
    search() {
      let val = ''
      if(this.searchCondition === '房号' || '租户名称') {
        val = `and ${this.searchCondition} like '%${this.searchVal}%'`
      } else {
        val = `and ${this.searchCondition} = '${this.searchVal}'`
      }
      this.getRentContractList(val)
    },
    // 重置
    reSearch() {
      this.searchCondition = ""
      this.searchVal = ""
      this.getRentContractList()
    },
  },
};
</script>

<style lang="scss" scoped>
.userRegister {
  padding: 20px 10px 20px 10px;
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
