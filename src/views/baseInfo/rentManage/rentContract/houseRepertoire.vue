<template>
  <div class="rentHouseList">
    <article>
      <header class="goBack">
        <el-button
          type="text"
          size="mini"
          icon="el-icon-back"
          style="font-size: 16px"
          @click="goBack"
        >
          返回
        </el-button>
        <span class="title">房屋清单</span>
      </header>

      <main class="main">
        <el-row type="flex" justify="space-between">
          <el-col v-show="isEdit">
            <el-button
              plain
              type="warning"
              size="mini"
              icon="el-icon-edit"
              @click="updateSelectedHouse()"
            >
              修改
            </el-button>
          </el-col>

          <el-col v-show="!isEdit">
            <el-button
              plain
              type="success"
              size="mini"
              icon="el-icon-folder-checked"
              @click="saveData()"
            >
              保存
            </el-button>
            <el-button plain size="mini" icon="el-icon-back" @click="cancel()">
              取消
            </el-button>
          </el-col>
        </el-row>
        <br />
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <i class="el-icon-s-home" style="color: #409eff; margin-right: 4px" />
            <span>可选房屋</span>
            <section style="float: right">
              <Search
                :keyword="keyword"
                :query-terms="queryTerms"
                @searchBtn="searchBtn"
              />
            </section>
          </div>
          <el-table
            :v-loading="loading"
            :data="allrentHouseList"
            border
            :height="total > 0 ? '230' : '100'"
            :cell-style="{ padding: '4px' }"
            element-loading-text="请给我点时间！"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              align="center"
              width="47">
            </el-table-column>
            <el-table-column
              prop="大楼名称"
              label="栋名"
              width="100"
              align="center"
            />
            <el-table-column
              prop="单元名称"
              label="单元名称"
              width="100"
              align="center"
            />
            <el-table-column
              prop="房号"
              width="90"
              label="房号"
              align="center"
            />
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
            <el-table-column prop="建筑面积" label="a 建筑面积" align="right" />
            <el-table-column prop="套内面积" label="b 套内面积" align="right" />
            <el-table-column
              prop="附属面积1"
              label="c 附属面积1"
              align="right"
            />
            <el-table-column
              prop="附属面积2"
              label="d 附属面积2"
              align="right"
            />
            <el-table-column label="操作" align="center" width="100">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-check"
                  :disabled="isEdit"
                  @click="selectHouse(scope.row)"
                >
                  选定房屋
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getTable"
          />
        </el-card>
        <br />
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <i class="el-icon-s-home" style="color: #67c23a; margin-right: 4px" />
            <span>选定房屋</span>
            <el-popover
              placement="left"
              title="示例说明"
              width="500"
              trigger="hover"
              content="套内面积 + 附属面积1*0.5 + 附属面积2*0.75（即为 b + c*0.5 + d*0.75）"
            >
              <el-button
                slot="reference"
                style="float: right"
                type="text"
                icon="el-icon-info"
                >计算公式</el-button
              >
            </el-popover>
          </div>
          <el-table
            :data="selectedHouse"
            show-summary
            border
            :cell-style="{ padding: '4px' }"
            :summary-method="getSummaries"
          >
            <el-table-column
              fixed
              prop="大楼名称"
              label="栋名"
              width="100"
              align="center"
            />
            <el-table-column
              prop="单元名称"
              label="单元名称"
              width="80"
              align="center"
            />
            <el-table-column
              prop="房号"
              label="房号"
              width="70"
              align="center"
            />
            <el-table-column
              prop="房屋状态"
              label="房屋状态"
              width="120"
              align="center"
            />
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
            <el-table-column prop="建筑面积" label="a 建筑面积" align="right" />
            <el-table-column prop="套内面积" label="b 套内面积" align="right" />
            <el-table-column
              prop="附属面积1"
              label="c 附属面积1"
              align="right"
            />
            <el-table-column
              prop="附属面积2"
              label="d 附属面积2"
              align="right"
            />
            <el-table-column
              prop="areaFormula"
              label="面积公式"
              align="center"
            />
            <el-table-column
              prop="valuationArea"
              label="计价面积"
              align="right"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              fixed="right"
              width="100"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-close"
                  :disabled="isEdit"
                  @click="cancelSelect(scope.row)"
                >
                  取消选定
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </main>
    </article>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import Search from "@/components/Search";
import {
  addHouse,
  delHouse,
  defaultHouseList,
  checkSelectHouse,
  checkHouse,
} from "@/api/system/userRegister";
export default {
  components: {
    Search,
  },
  data() {
    return {
      allrentHouseList: [],
      multipleSelection: [],
      selectedHouse: [],
      keyword: "房屋情况",
      queryTerms: "",
      isEdit: false,
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      total: 0,
      searchCond: "",
      loading: false
    };
  },
  activated() {
    this.queryTerms = `where wyid = ${Cookies.get("selectPropertyId")}`;
  },
  methods: {
    goBack() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1);
    },
    // 保存
    saveData() {
      let newArr = this.selectedHouse.map(item => {
        return item = {
          roomNo: item.房号,
          unitName: item.单元名称,
          buildingArea: item.建筑面积,
          houseStatus: item.房屋状态,
          rentalStatus: item.出租状态,
          subsidiaryArea1: item.附属面积1,
          subsidiaryArea2: item.附属面积2,
          houseId: item.hasOwnProperty('ID') ? item.ID : item.houseId,
          insideArea: item.套内面积,
          leaseBreakdownStatus: item.拆租状态
        }
      })
      Cookies.set("rentHouseList", JSON.stringify(this.selectedHouse));
      Cookies.set("rentHouseLists", JSON.stringify(newArr));
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1);
    },
    // 取消
    cancel() {
      this.isEdit = true;
    },
    updateSelectedHouse() {
      this.isEdit = false;
    },
    defaultCheckHouse() {
      defaultHouseList({ houseId: this.$route.query.houseId }).then((res) => {
        console.log(res.data)
        this.selectedHouse = [].concat({ ...res.data });
      });
    },
    getCheckHouse() {
      checkHouse({ contractId: this.$route.query.contractId }).then((res) => {
        this.selectedHouse = [...res.data];
      });
    },
    // 多选时的处理
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection)
    },
    // 选定房屋
    selectHouse(row) {
      let data = {
        houseId: row.ID,
        contractId: this.$route.query.contractId,
      };
      addHouse(data).then(() => {
        if (this.$route.query.contractId === undefined) {
          if(this.selectedHouse.includes(row)) {
            this.$message.warning('该房屋已被选定！')
          } else {
            this.selectedHouse.push(row)
            this.$message.success("房屋选定成功");
          }
        } else {
          this.getCheckHouse();
          this.$message.success("房屋选定成功");
        }
      });
    },
    // 取消选定
    cancelSelect(row) {
      let params = {
        rentHouseListId: row.rentHouseListId,
        houseId: row.houseId,
      };
      if (this.selectedHouse && this.selectedHouse.length > 1) {
        delHouse(params).then(() => {
          if (this.$route.query.contractId === undefined) {
            this.selectedHouse.pop(row);
          } else {
            this.getCheckHouse();
          }
          this.$message.success("房屋取消选定成功");
        });
      } else {
        this.$message.warning("无法删除！你必须为业主保留至少一套房。");
      }
    },
    // 合计操作
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合 计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return (prev * 100 + curr * 100) / 100
            } else {
              return prev * 100 / 100
            }
          }, 0);
          sums[index] += "";
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    searchBtn(val) {
      this.loading = true
      let params = {
        queryTerms: `where 房屋状态 = '' and WYID =${Cookies.get(
          "selectPropertyId"
        )}${val}`,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
      };
      this.searchCond = val;
      checkSelectHouse(params).then((res) => {
        this.allrentHouseList = [...res.records];
        this.total = res.total;
        this.loading = false
      });
    },
    getTable(val) {
      this.queryParams = {
        pageSize: val.limit,
        pageNum: val.page,
      };
      this.searchBtn(this.searchCond);
    },
  },
};
</script>

<style lang="scss" scoped>
.rentHouseList {
  margin-bottom: 40px;
  position: relative;
  .goBack {
    padding: 8px 16px;
    border-bottom: 1px solid #eaeaea;
    box-shadow: 0px 0px 2px 4px #f5f5f5;
    &:hover {
      background-color: lavender;
    }
    .title {
      font-size: 18px;
      color: #666;
      margin-left: 30px;
      padding-left: 30px;
      border-left: 1px solid #ccc;
    }
  }
  .main {
    padding: 10px 26px;
  }
}
.el-card__header {
  padding: 12px 16px;
}
.el-popover--plain {
  padding: 15px 20px;
  background: #eaeaea;
}
</style>

