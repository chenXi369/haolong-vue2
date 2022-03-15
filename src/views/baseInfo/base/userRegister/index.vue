<template>
  <div>
    <article class="userRegister">
      <div class="header">
        <el-row :gutter="24">
          <!-- 用户数据 -->
          <el-col :span="24" :xs="24">
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
                  style="width: 200px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item label="业主">
                <el-input
                  v-model="searchParams.name"
                  placeholder="请输入业主"
                  clearable
                  size="mini"
                  style="width: 200px"
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
                  :disabled="searchState"
                  @click="handleQuery"
                >搜索</el-button>
                <el-button
                  plain
                  type="primary"
                  icon="el-icon-refresh"
                  size="mini"
                  @click="resetQuery"
                >重置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>

      <main class="main">
        <section class="leftTree">
          <contract-tree
            :content-style-obj="contentStyleObj"
            :show-table="showTable"
            :org-list="orgList"
            :is-expand="isExpand"
            :defaultChecked="defaultChecked"
            @changeShow="changeShow"
            @changeWidth="changeWidth"
          />
        </section>
        <section
          v-if="houseDialogVisible"
          :style="tableContStyle"
          style="margin-top: 24px; border-radius: 4px"
        >
          <House-Table
            :content-style-obj="contentStyleObj"
            :house-list="houseList"
            :ht-list-data="htListData"
            :query-params="queryParams"
            :total="total"
            :open-ht-list="openHtList"
            :loading="loading"
            @closeHtDialog="closeHtDialog"
            @edit="edit"
            @openEquityChange="openEquityChange"
            @pageGetTable="pageGetTable"
          />
        </section>
      </main>
    </article>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import HouseTable from './components/houseTable'
import { getWyList } from '@/api/system/houseRes'
import { getOwnerHouse, getOwnerHtList } from '@/api/system/userRegister'
import ContractTree from './components/contractTree.vue'

export default {
  components: {
    ContractTree,
    HouseTable
  },
  data() {
    return {
      loading: false,
      showTable: false,
      htListData: [],
      orgList: [],
      contentStyleObj: {
        height: ''
      },
      tableContStyle: {
        width: ''
      },
      isExpand: false,
      houseDialogVisible: false,
      houseList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      openHtList: false,
      selectNodeId: 0,
      searchParams: {
        roomNo: '',
        name: '',
        account: ''
      },
      searchState: true,
      defaultChecked: []
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
    this.getWidth()
    // 紧凑结构
    this.getHomeTable()
  },
  destroyed() {
    window.removeEventListener('resize', this.getHeight)
  },
  activated() {
    this.getHouseList()
  },
  methods: {
    handleClick(tab) {
      this.activeRegisterName = tab.name
    },
    // 获得树型图的紧凑机构数据
    getHomeTable() {
      getWyList().then((res) => {
        this.orgList = [...res.data]
      })
    },
    // 打开右侧table和一些按钮
    changeShow(e) {
      console.log(e)
      if (Object.prototype.hasOwnProperty.call(e.node, 'buildingId')) {
        this.showTable = e.value
        this.selectNodeId = e.node.buildingId
        this.searchState = false
        Cookies.set('selectPropertyId', e.node.propertyId)
        this.getHouseList() // 获取当前楼栋下的房屋
      } else {
        this.selectNodeId = e.node.propertyId
        this.searchState = true
        this.houseDialogVisible = false
      }
    },
    // 实时获取屏幕高度
    getHeight() {
      this.contentStyleObj.height = window.innerHeight - 250 + 'px'
    },
    // 实时获取屏幕宽度
    getWidth() {
      this.tableContStyle.width = window.innerWidth - 540 + 'px'
    },
    // 改变el-tree的div宽度继而改变table的div宽度
    changeWidth(val) {
      this.tableContStyle.width =
        document.querySelector('.userRegister').clientWidth - val - 58 + 'px'
    },
    // 打开编辑的dialog
    edit(val) {
      if (val.state) {
        console.log(val)
        this.$router.push({
          path: 'ownerRegister',
          query: {
            houseId: val.row.ID,
            buildingId: val.row.LYID,
            liveState: val.row.业主名称 ? val.row.业主名称 : undefined
          }
        })
        Cookies.set('roomState', val.row.出租状态)
      }
    },
    changeDialog(val) {
      this.dialogVisible = val
    },
    // 翻页时的处理
    pageGetTable() {
      this.getHouseList()
    },
    getHouseList(name, roomNo, account) {
      this.loading = true
      const params = {
        buildingId: this.selectNodeId,
        name: name,
        roomNo: roomNo,
        account: account,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize
      }
      getOwnerHouse(params).then((res) => {
        this.houseList = [...res.records]
        this.houseDialogVisible = true
        this.total = res.total
        this.loading = false
      })
    },
    // 房屋对应的合同列表
    // openEquityChange(val) {
    //   getOwnerHtList({ houseId: val }).then((res) => {
    //     this.htListData = [...res.data]
    //     this.openHtList = true
    //   })
    // },
    // 产权过户的操作
    openEquityChange(val) {
      console.log(val)
      this.$router.push({
        path: 'equityNewUser',
        query: { id: val.LID }
      })
    },
    // 关闭合同的dialog
    closeHtDialog() {
      this.openHtList = false
    },
    // 去业主登记
    toRegister() {},
    // 重置搜索
    resetQuery() {
      this.searchParams = {
        roomNo: '',
        name: '',
        account: ''
      }
    },
    // 搜索
    handleQuery() {
      this.getHouseList(this.searchParams.name, this.searchParams.roomNo, this.searchParams.account)
    }
  }
}
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
