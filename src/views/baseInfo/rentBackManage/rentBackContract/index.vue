<template>
  <article class="rentBackContract">
    <header class="header">
      <el-row :gutter="20" type="flex" justify="space-between">
        <!-- 用户数据 -->
        <el-col :span="12">
          <el-button
            plain
            type="primary"
            icon="el-icon-circle-plus"
            size="mini"
            @click="addBackContract()"
            >新增合同</el-button
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
            <el-input
              v-model="searchVal"
              size="mini"
              style="margin-right: 15px"
            ></el-input>
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
            <el-button
              plain
              size="mini"
              type="success"
              icon="el-icon-refresh"
              @click="reSearch"
            >
              重置
            </el-button>
          </el-col>
        </el-col>
      </el-row>
    </header>

    <main class="main">
      <section class="leftTree">
          <rent-back-tree
            :content-style-obj="contentStyleObj"
            :show-table="showTable"
            :org-list="orgList"
            @changeShow="changeShow"
            @changeWidth="changeWidth"
          />
        </section>
        <section
          v-if="rentBackListVisible"
          :style="tableContStyle"
          style="margin-top: 24px; border-radius: 4px"
        >
          <rent-back-list
            :content-style-obj="contentStyleObj"
            :rent-list="rentList"
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
</template>

<script>
import rentBackTree from './components/rentBackTree'
import rentBackList from './components/rentBackList'
import { getWyList } from "@/api/system/houseRes"
export default {
  data() {
    return {
      loading: false,
      orgList: [],
      rentList: [],
      showTable: false,
      searchCondition: "",
      searchOptions: [
        {
          value: 0,
          label: "房号",
        },
        {
          value: 1,
          label: "业主",
        },
        {
          value: 2,
          label: "银行账号",
        },
      ],
      searchVal: "",
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      contentStyleObj: {
        height: "",
      },
      tableContStyle: {
        width: "",
      },
      rentBackListVisible: false,     // table的v-if
    }
  },
  components: {
    rentBackTree,
    rentBackList
  },
  created() {
    this.getWidth()
    this.getHeight()
    window.addEventListener("resize", this.getHeight)
    // 紧凑结构
    this.getHomeTable();
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight)
  },
  methods: {
    // 实时获取屏幕高度
    getHeight() {
      this.contentStyleObj.height = window.innerHeight - 250 + "px"
    },
    // 实时获取屏幕宽度
    getWidth() {
      this.tableContStyle.width = window.innerWidth - 540 + "px"
    },
    // 获得树型图的紧凑机构数据
    getHomeTable() {
      getWyList().then((res) => {
        const newArr = [...res.data];
        this.getRangeTree(newArr, this.orgList)
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
    // 搜索
    search() {
      this.getRentBackList()
    },
    // 重置
    reSearch() {

    },
    addBackContract() {

    },
    // 点击楼栋显示table
    changeShow(e) {
      console.log(e)
      if (e.node.buildingId !== undefined) {
        this.showTable = e.value;
        this.selectNodeId = e.node.buildingId;
        this.searchState = false;
        this.getRentBackList(); // 获取当前楼栋下的房屋
      } else {
        this.selectNodeId = e.node.propertyId;
        this.searchState = true;
        this.houseDialogVisible = false;
        this.isSelectBuild = true;
      }
    },
    // 获取返租的list
    getRentBackList() {

    },
    // 改变el-tree的div宽度继而改变table的div宽度
    changeWidth(val) {
      this.tableContStyle.width =
        document.querySelector(".rentBackContract").clientWidth - val - 58 + "px";
    },
    // 打开table
    openRentContract() {

    },
    // 翻页的处理
    pageGetTable() {

    },
    // 审核的处理
    checkRentContract() {

    }
  }
};
</script>

<style lang="scss" scoped>
.rentBackContract {
  padding: 20px 10px 20px 10px;
  position: relative;
  .header {
    padding: 0px 0px 0px 12px;
  }
}
</style>
