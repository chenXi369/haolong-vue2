<template>
  <div>
    <article class="userManage">
      <div class="header">
        <el-row :gutter="24" type="flex" justify="space-between">
          <!-- 部门数据 -->
          <el-col :span="12">
            <el-button
              plain
              type="success"
              icon="el-icon-plus"
              size="mini"
              @click="addOwner"
              :disabled="isSelectNode"
            >新增</el-button>
          </el-col>

          <el-col :span="12" style="display: flex; justify-content: flex-end">
            <el-button
              plain
              type="warning"
              icon="el-icon-download"
              size="mini"
              :disabled="isSelectNode"
              @click="exportTable"
            >导出</el-button>
            <span style="margin-left: 8px">
              <Search :keyword="keyword" />
            </span>
          </el-col>
        </el-row>
      </div>

      <main class="main">
        <section class="leftTree">
          <El-Tree
            :content-style-obj="contentStyleObj"
            :show-table="showTable"
            :org-list="orgList"
            :is-expand="isExpand"
            @changeShow="changeShow"
            @changeWidth="changeWidth"
          />
        </section>
        <section
          v-if="ownerDialogVisible"
          :style="tableContStyle"
          style="margin-top: 24px; border-radius: 4px"
        >
          <manage-table
            :owner-list="ownerList"
            :content-style-obj="contentStyleObj"
            :query-params="queryParams"
            :total="total"
            :openHtList="openHtList"
            :loading="loading"
            @editOwner="editOwner"
            @delOwner="delOwner"
            @openHtDialog="openHtDialog"
            @pageGetTable="pageGetTable"
          />
        </section>
      </main>

      <section>
        <manage-dialog
          :title="title"
          :showDialog="showDialog"
          :ownerInfoForm="ownerInfoForm"
          @submitForm="submitForm"
          @closeForm="closeForm"
          @closeOwnerDialog="closeOwnerDialog"
        ></manage-dialog>
      </section>
    </article>
  </div>
</template>

<script>
import Search from '@/components/Search'
import ElTree from '../components/el-tree'
import ManageTable from './components/manageTable'
import manageDialog from './components/manageDialog'
import { getWyList } from '@/api/system/houseRes'
import { getOwnerHtList } from '@/api/system/userRegister'
import { addCustomer, delCustomer, updateCustomer, getCustomerList } from '@/api/system/userManage'

export default {
  components: {
    Search,
    ElTree,
    ManageTable,
    manageDialog
  },
  data() {
    return {
      ownerList: [],
      loading: false,
      showTable: false,
      showDialog: false,
      htListData: [],
      orgList: [
        {
          orgName: '物业项目',
          groupType: '1',
          children: []
        }
      ],
      contentStyleObj: {
        height: ''
      },
      tableContStyle: {
        width: ''
      },
      isExpand: true,
      ownerDialogVisible: false,
      queryParams: {
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      openHtList: false,
      selectNodeId: 0,
      searchParams: {
        houseId: '',
        roomNo: '',
        owner: '',
        bankAccount: ''
      },
      keyword: '',
      isSelectNode: true,
      title: '',
      ownerInfoForm: {}
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
  methods: {
    handleClick(tab) {
      this.activeRegisterName = tab.name
    },
    // 获得树型图的紧凑机构数据
    getHomeTable() {
      getWyList().then((res) => {
        const newArr = []
        this.getTreeList([...res.data], newArr)
        newArr.map((item) => {
          this.orgList[0].children.push(item)
        })
      })
    },
    // 递归树状数据
    getTreeList(treeList, newTreeList) {
      treeList.map((c) => {
        const tempData = {
          orgName: c.propertyName,
          propertyId: c.propertyId,
          groupType: '2'
        }
        newTreeList.push(tempData)
      })
    },
    // 打开右侧table和一些按钮
    changeShow(e) {
      if (e.node.hasOwnProperty('propertyId')) {
        this.showTable = e.value
        this.selectNodeId = e.node.propertyId
        this.isSelectNode = false
        this.getOwnerList() // 获取当前物业下的客户
      } else {
        this.selectNodeId = e.node.propertyId
        this.isSelectNode = true
        this.ownerDialogVisible = false
      }
    },
    // 实时获取屏幕高度
    getHeight() {
      this.contentStyleObj.height = window.innerHeight - 250 + 'px'
    },
    // 实时获取屏幕宽度
    getWidth() {
      this.tableContStyle.width = window.innerWidth - 540 + 'px'
      console.log(this.tableContStyle.width)
    },
    // 改变el-tree的div宽度继而改变table的div宽度
    changeWidth(val) {
      this.tableContStyle.width =
        document.querySelector('.userManage').clientWidth - val - 58 + 'px'
    },
    changeDialog(val) {
      this.dialogVisible = val
    },
    // 翻页时的处理
    pageGetTable(val) {
      console.log(val)
      this.queryParams = {
        pageSize: val.limit,
        pageNum: val.page,
      };
      this.getOwnerList();
    },
    getOwnerList() {
      this.loading = true
      this.ownerDialogVisible = true
      const params = {
        propertyId: this.selectNodeId,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize
      }
      // 获取物业所有用户信息
      getCustomerList(params).then((res) => {
        this.ownerList = [...res.records];
        this.ownerDialogVisible = true;
        this.total = res.total;
        this.loading = false
      });
    },
    // 房屋对应的合同列表
    openHtDialog(val) {
      getOwnerHtList({ FWID: val }).then((res) => {
        this.htListData = [...res.data]
        this.openHtList = true
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
        owner: '',
        bankAccount: ''
      }
    },
    // 新增
    addOwner() {
      this.title="客户资料-新增"
      this.ownerInfoForm = {}
      this.showDialog = true
    },
    // 删除
    delOwner(row) {
      this.$confirm(`是否要删除客户 [${row.customerName}] 吗`, "警告", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        return delCustomer(row.customerId)
      }).then(() => {
        this.getOwnerList()
        this.$message.success('客户信息删除成功！')
      })
    },
    // 修改
    editOwner(val) {
      this.title="客户资料-修改"
      this.ownerInfoForm = { ...val.row }
      this.showDialog = true
      this.ownerInfoForm.customerId = val.row.customerId
    },
    // 导出
    exportTable() {},
    closeOwnerDialog(val) {
      this.showDialog = val
    },
    closeForm() {
      this.showDialog = false
    },
    submitForm() {
      if(this.title === "客户资料-新增") {
        let data = {
          propertyId: this.selectNodeId,
          ...this.ownerInfoForm
        }
        addCustomer(data).then(() => {
          this.showDialog = false
          this.getOwnerList()
          this.$message.success('客户资料新增成功！')
        })
      } else if(this.title === "客户资料-修改") {
        updateCustomer(this.ownerInfoForm).then(() => {
          this.showDialog = false
          this.getOwnerList()
          this.$message.success('客户资料修改成功！')
        })
      }
    }
  }
}
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
.el-dialog__body {
  padding: 15px 20px;
}
</style>
