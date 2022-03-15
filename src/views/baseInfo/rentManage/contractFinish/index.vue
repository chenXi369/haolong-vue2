<template>
  <div>
    <article class="userRegister">
      <div class="header">
        <el-row :gutter="24">
          <!-- 用户数据 -->
          <el-col>
            <el-col :span="4">
              <el-select v-model="searchCondition" placeholder="请选择搜索条件" style="width: 100%" size="mini">
                <el-option
                  v-for="item in searchOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-input v-model="searchVal" size="mini"></el-input>
            </el-col>
            <el-col :span="16">
              <el-button
                plain
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="search()"
                :disabled="total === 0"
                >搜索</el-button
              >
              <el-button
                plain
                type="success"
                icon="el-icon-refresh"
                size="mini"
                @click="reSearch()"
                >重置</el-button
              >
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
          <rent-Finish-list
            :content-style-obj="contentStyleObj"
            :house-list="houseList"
            :query-params="queryParams"
            :total="total"
            :loading="loading"
            @finishRentContract="finishRentContract"
            @openRentContract="openRentContract"
            @pageGetTable="pageGetTable"
          />
        </section>
      </main>
      <finish-dialog
        :dialogVisible="dialogVisible"
        :finishForm="finishForm"
        @closeDialog="closeDialog"
        @finishContract="finishContract"
        @isFinishPerm="isFinishPerm"
      >
      </finish-dialog>
    </article>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import ElTree from "../../base/components/el-tree";
import RentFinishList from "./components/rentFinishList";
import FinishDialog from './components/finishDialog.vue';
import { getWyList } from "@/api/system/houseRes";
import { rentContractList, updateContract, getContract } from "@/api/system/userRegister";

export default {
  components: {
    ElTree,
    RentFinishList,
    FinishDialog
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
          value: "合同号",
          label: "合同号",
        },
        {
          value: "银行帐号",
          label: "银行账号",
        },
      ],
      searchCondition: "",
      searchVal: "",
      dialogVisible: false,
      finishForm: {},
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
      });
    },
    // 打开右侧table和一些按钮
    changeShow(e) {
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
    closeDialog(val) {
      this.dialogVisible = val;
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
        if (this.houseList.length > 0) {
          this.isSelectBuild = false;
        } else {
          this.isSelectBuild = true;
        }
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
        query: { id: val.ID, state: "FINISH" },
      });
    },
    finishRentContract(val) {
      this.dialogVisible = true
      this.$set(this.finishForm, 'contractId', val.ID)
      this.$set(this.finishForm, 'terminationStatus', true)
      if(val.终止日期 !== '') {
        getContract({contractId: val.ID}).then((res) => {
          console.log(res.contract)
          this.$set(this.finishForm, 'terminationDate', res.contract.terminationDate)
          this.$set(this.finishForm, 'terminationType', res.contract.terminationType)
          this.$set(this.finishForm, 'reasonsForTermination', res.contract.reasonsForTermination)
        })
      }
    },
    // 提交止约
    finishContract(val) {
      updateContract(val).then(() => {
        this.$message.success('选定合同止约成功！')
        this.dialogVisible = false
        this.getRentContractList()
      })
    },
    // 所有权的改变引起的变化
    isFinishPerm() {
      this.$set(this.finishForm, 'terminationDate', null)
      this.$set(this.finishForm, 'terminationType', null)
      this.$set(this.finishForm, 'reasonsForTermination', null)
    },
    // 搜索
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
  padding: 20px 20px 20px 10px;
  position: relative;
  .main {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
}
</style>
