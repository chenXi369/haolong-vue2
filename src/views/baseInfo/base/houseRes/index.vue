<template>
  <div>
    <article class="houseRes">
      <div class="fixed-header">
        <el-row :gutter="24" type="flex" justify="space-between">
          <!-- 部门数据 -->
          <el-col :span="12">
            <el-button
              plain
              type="primary"
              icon="el-icon-d-caret"
              size="mini"
              :disabled="expandDisable"
              @click="expand"
            >{{ isExpand ? "紧凑结构" : "完整结构" }}</el-button>
            <el-button
              plain
              type="success"
              icon="el-icon-plus"
              size="mini"
              :disabled="isAdd"
              @click="add"
            >新增</el-button>
            <el-popover placement="top" width="375">
              <el-button
                plain
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delLd"
              >删除</el-button>
              <el-button
                plain
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="updateLd"
              >修改</el-button>
              <el-button
                plain
                type="success"
                icon="el-icon-document-copy"
                size="mini"
                @click="buildCopy"
              >栋复制</el-button>
              <el-button
                plain
                type="success"
                icon="el-icon-document"
                size="mini"
                :disabled="isBuildCopy"
                @click="buildStick"
              >栋粘贴</el-button>
              <el-button
                slot="reference"
                plain
                size="mini"
                type="warning"
                :disabled="ldPopover"
                style="margin-left: 12px"
              >楼栋</el-button>
            </el-popover>
            <el-popover placement="top" width="185">
              <el-button
                plain
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delWy"
              >删除</el-button>
              <el-button
                plain
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="updateWy"
              >修改</el-button>
              <el-button
                slot="reference"
                plain
                size="mini"
                type="warning"
                style="margin-left: 12px"
                :disabled="wyPopover"
              >物业</el-button>
            </el-popover>

            <span v-if="!isBuildCopy" style="margin-left: 24px; font-size: 12px; color: #999999">
              <!-- 被复制的大楼为：{{ selectDelName }} -->
              <button class="nh-hover">被复制的大楼为：{{ selectDelName }}</button>
            </span>
          </el-col>

          <el-col :span="12" style="display: flex; justify-content: flex-end">
            <el-button
              plain
              type="primary"
              icon="el-icon-printer"
              size="mini"
              :disabled="btnCreateRooms"
              @click="createRooms"
            >成批生成房屋</el-button>
            <el-button
              plain
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="exportTable"
            >导出</el-button>
            <span style="margin-left: 8px">
              <Search :keyword="keyword" />
            </span>
            <!-- <Sort @showShade="showShade"></Sort>
            <el-button @click="openProgress" size="mini"
              >上传<i class="el-icon-upload el-icon--right"></i
            ></el-button> -->
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
            @createRoom="createRoom"
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
            @openHtDialog="openHtDialog"
            @pageGetTable="pageGetTable"
            @deleteTabIndex="deleteTabIndex"
          />
        </section>

        <House-Dialig
          :home-dialog-form="homeDialogForm"
          :dialog-visible="dialogVisible"
          :btn-state="btnState"
          @closeHouseDialog="closeHouseDialog"
          @submitHouseForm="submitHouseForm"
        />
      </main>
      <el-collapse-transition v-if="progress">
        <Progress @closeProgress="closeProgress" />
      </el-collapse-transition>

      <!--  批量生成房屋  -->
      <create-room
        :room-state="roomState"
        :build-desc-list="buildDescList"
        @successAddHouse="successAddHouse"
        @getDescList="getDescList"
        @closeRoom="closeRoom"
      />
      <addBuild-Dialog
        :add-dialog="addDialog"
        :build-form-data="buildFormData"
        @submitLdForm="submitLdForm"
        @closeAddDialog="closeAddDialog"
      />
      <addWy-Dialog
        :add-wy-dialog="addWyDialog"
        :wy-form-data="wyFormData"
        @submitWyDialog="submitWyDialog"
        @closeAddWyDialog="closeAddWyDialog"
      />
    </article>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import CreateRoom from './components/createRoom'
import AddBuildDialog from './components/addBuildDialog'
import AddWyDialog from './components/addWyDialog'
import HouseDialig from './components/houseDialog'
import HouseTable from './components/houseTable'
import ElTree from '../components/el-tree'
import Search from '@/components/Search'
import Sort from '@/components/Sort'
import Progress from '@/components/Progress'
import {
  getWyList,
  getExpandWyList,
  addWy,
  delWy,
  updateWy,
  checkWy,
  getExpandBuildList,
  getExpandHomeList,
  delHome,
  updateHome,
  addHome,
  addBuild,
  delBuild,
  checkBuild,
  updateBuild,
  getBuildDescList,
  getHouseContract,
  copyBuild,
  copyFloor,
  copyHouse
} from '@/api/system/houseRes'
export default {
  components: {
    HouseDialig,
    HouseTable,
    AddBuildDialog,
    AddWyDialog,
    ElTree,
    Search,
    Sort,
    Progress,
    CreateRoom
  },
  data() {
    return {
      loading: false,
      isAdd: true,
      isdel: true,
      addDialog: false,
      isExpand: false,
      expandDisable: false,
      // 批量生成房间
      roomState: false,
      orgList: [],
      showTable: false,
      houseList: [],
      htListData: [],
      dialogVisible: false,
      tableWidth: 0,
      progress: false,
      contentStyleObj: {
        height: ''
      },
      tableContStyle: {
        width: ''
      },
      selectNode: '',
      addWyDialog: false, // 新增物业
      selectNodeId: 0, // 选中的物业id
      selectDelName: '',
      wyDialogState: '', // 物业的弹窗打开时的状态  是新增还是修改
      wyFormData: {},
      houseDialogVisible: false,
      queryParams: {
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      homeDialogForm: {},
      btnState: '',
      wyPopover: true,
      ldPopover: true,
      buildFormData: {},
      btnCreateRooms: true,
      buildDescList: [],
      openHtList: false,
      isBuildCopy: true,
      isFloorCopy: true,
      isHouseCopy: true,
      keyword: '房屋资源'
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
    // 紧凑结构
    getHomeTable() {
      getWyList().then((res) => {
        this.expandDisable = false
        this.orgList = [...res.data]
      })
    },
    // 完整结构
    isExpandHomeTable() {
      getExpandWyList().then((res) => {
        this.expandDisable = false
        this.orgList = []
        const newArr = [].concat({ ...res.data })
        this.getRangeTree(newArr, this.orgList)
      })
    },
    // 获取当前物业节点下的楼栋
    // getExpandBuildList(id) {
    //   getExpandBuildList({ propertyId: id }).then((res) => {
    //     console.log(res.data);
    //   });
    // },
    getRangeTree(treeList, newTreeList) {
      treeList.map((c) => {
        const tempData = {
          orgName: c.orgName || c.propertyName || c.buildingName,
          id: c.hasOwnProperty('propertyId') ? (c.hasOwnProperty('buildingName') ? c.buildingId : c.propertyId) : c.groupId,
          groupType: c.hasOwnProperty('groupType') ? `${c.groupType}` : (c.hasOwnProperty('buildingName') ? `ld` : `wy`)
        }
        if (c.children) {
          if (c.wuyes && c.wuyes.length === 0) {
            tempData.children = []
            this.getRangeTree(c.children, tempData.children)
          } else {
            c.wuyes.map((item) => {
              c.children.push(item)
            })
            tempData.children = []
            this.getRangeTree(c.children, tempData.children)
          }
        }
        newTreeList.push(tempData)
      })
    },
    // 房屋对应的合同列表
    openHtDialog(val) {
      // console.log(111)
      getHouseContract({ houseId: val }).then(res => {
        this.htListData = [...res.data]
        this.openHtList = true
      })
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
    closeAddDialog() {
      this.addDialog = false
    },
    closeAddWyDialog() {
      this.addWyDialog = false
    },
    // 紧凑结构和完整结构的切换
    expand() {
      this.isExpand = !this.isExpand
      this.expandDisable = true
      if (this.isExpand) {
        this.isExpandHomeTable()
      } else {
        this.getHomeTable()
      }
    },
    // 改变el-tree的div宽度继而改变table的div宽度
    changeWidth(val) {
      this.tableContStyle.width =
        document.querySelector('.houseRes').clientWidth - val - 58 + 'px'
    },
    // 打开右侧table和一些按钮
    changeShow(e) {
      if (e.node.hasOwnProperty('buildingId')) {
        this.showTable = e.value
        this.selectNodeId = e.node.buildingId
        this.getHouseList() // 获取当前楼栋下的房屋
      } else {
        this.selectNodeId = e.node.propertyId
        this.houseDialogVisible = false
      }
      if (this.isExpand) {
        if (e.node.groupType === 'wy') {
          this.isAdd = false
          this.ldPopover = true
          this.wyPopover = false
          this.selectNode = 'ld'
        } else if (e.node.groupType === '2') {
          this.isAdd = false
          this.ldPopover = true
          this.wyPopover = true
          this.selectNode = 'wy'
        } else {
          this.isAdd = true
          this.ldPopover = true
          this.wyPopover = true
        }
        this.selectNodeId = e.node.id
        this.selectDelName = e.node.orgName
      } else {
        if (e.node.hasOwnProperty('buildingNo')) {
          this.selectNode = 'home'
          this.ldPopover = false
          this.wyPopover = true
          this.isAdd = false
          this.showTable = e.value
          this.selectNodeId = e.node.buildingId
          this.selectDelName = e.node.buildingName
          this.getHouseList() // 获取当前楼栋下的房屋
        } else {
          this.selectNode = 'ld'
          this.isAdd = false
          this.ldPopover = true
          this.wyPopover = false
          this.selectNodeId = e.node.propertyId
          this.selectDelName = e.node.propertyName
          this.houseDialogVisible = false
        }
      }
      if (e.node.hasOwnProperty('buildingNo')) {
        this.btnCreateRooms = false
      } else {
        this.btnCreateRooms = true
      }
    },
    pageGetTable() {
      this.getHouseList()
    },
    getHouseList() {
      this.loading = true
      const params = {
        buildingId: this.selectNodeId,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize
      }
      getExpandHomeList(params).then((res) => {
        this.houseList = [...res.records]
        this.houseDialogVisible = true
        this.total = res.total
        this.loading = false
      })
    },
    // 打开编辑的dialog
    edit(row) {
      this.btnState = '修改'
      this.homeDialogForm = row
      this.dialogVisible = true
    },
    closeHouseDialog(val) {
      this.dialogVisible = val.state
    },
    // 房屋form的新增和修改
    submitHouseForm(val) {
      if (this.btnState === '新增') {
        if (val.node !== {}) {
          addHome(val.node).then(() => {
            this.$message.success('新增成功！')
            this.getHouseList()
            this.dialogVisible = false
          })
        }
      } else if (this.btnState === '修改') {
        updateHome(val.node).then(() => {
          this.$message.success('修改成功！')
          this.getHouseList()
          this.dialogVisible = false
        })
      }
    },
    // 删除表格选中列
    deleteTabIndex(val) {
      this.$confirm(`是否确认删除房号为 "${val.roomNo}" 的数据?`, '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const delParams = {
            houseId: val.houseId
          }
          return delHome(delParams)
        })
        .then(() => {
          this.getHouseList()
          this.$message.success('删除成功')
        })
    },
    // 添加遮罩层
    showShade(val) {
      console.log(val)
    },
    openProgress() {
      this.progress = true
    },
    closeProgress(val) {
      this.progress = val
    },
    // 打开批量生成房间的弹窗
    createRoom(val) {
      this.roomState = val
    },
    // 关闭批量生成房间的弹窗
    closeRoom(val) {
      this.roomState = val
    },
    add() {
      this.btnState = '新增'
      if (this.selectNode === 'ld') {
        this.addDialog = true
        this.buildFormData = {}
        this.buildFormData.propertyId = this.selectNodeId
      } else if (this.selectNode === 'wy') {
        this.addWyDialog = true
        this.wyFormData = {}
        this.wyFormData.groupId = this.selectNodeId
      } else {
        this.dialogVisible = true
        this.homeDialogForm = {}
        this.homeDialogForm.buildingId = this.selectNodeId
      }
    },
    // 导出
    exportTable() {},
    // 删除
    delWy() {
      this.$confirm(`是否确认删除 "${this.selectDelName}" 的数据?`, '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const delParams = {
            propertyId: this.selectNodeId
          }
          return delWy(delParams)
        })
        .then(() => {
          this.getHomeTable()
          this.$message.success('删除成功')
        })
    },
    delLd() {
      this.$confirm(`是否确认删除 "${this.selectDelName}" 的数据?`, '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const delParams = {
            buildingId: this.selectNodeId
          }
          return delBuild(delParams)
        })
        .then(() => {
          this.getHomeTable()
          this.$message.success('删除成功')
        })
    },
    // 修改操作
    updateWy() {
      this.btnState = '修改'
      checkWy({ propertyId: this.selectNodeId }).then((res) => {
        this.addWyDialog = true
        this.wyFormData = { ...res.data }
      })
    },
    updateLd() {
      this.btnState = '修改'
      checkBuild({ buildingId: this.selectNodeId }).then((res) => {
        this.addDialog = true
        this.buildFormData = { ...res.data }
      })
    },
    // 楼栋Dialog的确认操作
    submitLdForm(e) {
      if (this.btnState === '新增') {
        if (e.node !== {}) {
          addBuild(e.node).then(() => {
            this.$message.success('新增成功！')
            if (this.isExpand) {
              this.isExpandHomeTable()
            } else {
              this.getHomeTable()
            }
            this.addDialog = false
          })
        }
      } else if (this.btnState === '修改') {
        updateBuild(e.node).then(() => {
          if (this.isExpand) {
            this.isExpandHomeTable()
          } else {
            this.getHomeTable()
          }
          this.$message.success('楼栋信息修改成功！')
          this.addDialog = false
        })
      }
    },
    // 物业dialog的确认操作
    submitWyDialog(e) {
      if (this.btnState === '新增') {
        if (e.node !== {}) {
          addWy(e.node).then(() => {
            this.$message.success('新增成功！')
            if (this.isExpand) {
              this.isExpandHomeTable()
            } else {
              this.getHomeTable()
            }
            this.addWyDialog = false
          })
        }
      } else if (this.btnState === '修改') {
        updateWy(e.node).then(() => {
          if (this.isExpand) {
            this.isExpandHomeTable()
          } else {
            this.getHomeTable()
          }
          this.$message.success('物业信息修改成功！')
          this.addWyDialog = false
        })
      }
    },
    // 成批生成房屋
    createRooms() {
      getBuildDescList({ buildingId: this.selectNodeId }).then((res) => {
        this.roomState = true
        this.buildDescList = [...res.data]
      })
    },
    getDescList(val) {
      if (val) {
        this.createRooms()
      }
    },
    closeHtDialog() {
      this.openHtList = false
    },
    // 楼复制
    buildCopy() {
      this.isBuildCopy = false
      Cookies.set('buildCopyId', this.selectNodeId, { expires: 30 })
      console.log(this.selectDelName)
      this.$message.success('大楼复制成功！')
    },
    buildStick() {
      const data = {
        sourceBuildingId: Number(Cookies.get('buildCopyId')),
        targetBuildingId: this.selectNodeId
      }
      copyBuild(data).then(res => {
        this.$message.success('楼栋信息粘贴成功！')
        this.getHouseList()
        this.isBuildCopy = true
      })
    },
    // 批量生成房屋成功
    successAddHouse(val) {
      if (val === 'success') {
        this.roomState = false
        this.getHouseList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.houseRes {
  padding: 20px 20px 20px 10px;
  position: relative;
  .flex-from {
    display: flex;
    flex-direction: row;
  }
  .fixed-header {
    margin-left: 14px;
  }
  .main {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
}
.el-form-item {
  margin-right: 16px;
  display: flex;
  flex-wrap: nowrap;
}
.el-form-item__label {
  width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
