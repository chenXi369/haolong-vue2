<template>
  <el-dialog
    title="数据合法性校验"
    :visible.sync="symbolCheckVisible"
    top="5vh"
    width="1080px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    v-drag
  >
    <header>
      <el-form
        :ref="symbolCheckForm"
        :model="symbolCheckForm"
        size="mini"
        :inline="true"
      >
        <el-form-item label="物业">
          <el-select
            :disabled="true"
            v-model="symbolCheckForm.propertyId"
            @change="(item) => wyChange(item)"
            style="width: 220px"
          >
            <el-option
              v-for="item in propertyList"
              :key="item.propertyId"
              :label="item.propertyName"
              :value="item.propertyId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="月份" label-width="50px">
          <el-select 
            style="width: 120px" 
            v-model="symbolCheckForm.month" 
            @change="monthChange"
          >
            <el-option
              v-for="item in monthList"
              :key="item.计费月份"
              :label="item.计费月份"
              :value="item.计费月份"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label=" ">
          <el-input v-model="symbolCheckForm.htId" style="width: 100px" type="number"></el-input>
        </el-form-item>
        <el-form-item label=" " label-width="288px">
          <el-button plain v-if="!allChecked" type="primary" @click="allSelected"
            >全部选择</el-button
          >
          <el-button plain v-else type="primary" @click="allCancel"
            >全部取消</el-button
          >
          <el-button plain type="success" @click="startCheck"
            >开始检验</el-button
          >
        </el-form-item>
      </el-form>
    </header>
    <main style="margin-top: 12px">
      <el-table
        border
        v-loading="checkLoading"
        ref="multipleTable"
        :data="checkTableData"
        tooltip-effect="dark"
        style="width: 100%"
        height="700px"
        :highlight-current-row="highlightState"
        :cell-style="{padding: '3px 6px'}"
        :header-cell-style="{textAlign: 'center'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center"> </el-table-column>
        <el-table-column label="序号" width="80" align="center">
          <template slot-scope="scope">
            <span style="margin-right: 10px" v-show="scope.row.showError">
              <i class="el-icon-check" v-if="scope.row.errState" style="color: green"></i>
              <i class="el-icon-close" v-else style="color: red"></i>
            </span>
            <span>{{scope.row.no}}</span>
          </template>
        </el-table-column>
        <el-table-column label="检验内容" prop="verifyContent"> </el-table-column>
        <el-table-column label="发生错误" width="100" align="center">
          <template slot-scope="scope">{{scope.row.errNum}}</template>
        </el-table-column>
      </el-table>
    </main>
  </el-dialog>
</template>

<script>
import Bus from "@/api/Bus"
import { getWyList } from "@/api/system/houseRes"
import { getCheckDataList, checkStrip } from "@/api/chargeManage/accountManage"

export default {
  props: {
    disableForce: {
      type: Boolean,
      default: false
    },
    symbolCheckVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      symbolCheckForm: {
        propertyId: null,
        month: null,
        htId: ''
      },
      allChecked: false,
      monthList: [],
      propertyList: [],
      checkLoading: false,
      checkTableData: [],
      selectCheckData: [],
      highlightState: false,
      errorTotal: 0,
      errorData: [],
      interval: null   // 定时器
    };
  },
  mounted() {
    this.checkLoading = true
    this.getWyListInfo()
    this.getCheckDataArr()
    Bus.$on("wyMonthObj", val => {
      this.monthList = [...val.monthList]
      this.symbolCheckForm.propertyId = val.id
      this.symbolCheckForm.month = val.changeMonth
    })
  },
  beforeDestory() {
    Bus.$off("wyMonthObj")
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    // 物业改变
    wyChange(id) {
      this.symbolCheckForm.propertyId = id;
      this.$emit("changeProperty", id)
    },
    // 月份改变
    monthChange() {
      this.resetCheckData(this.checkTableData)
      this.allChecked = false
    },
    /** 获取所有物业
     * @param { null }
     * @return { Array| list }
     */
    getWyListInfo() {
      getWyList().then((res) => {
        let allList = [...res.data];
        this.propertyList = this.flatten(allList);
        this.symbolCheckForm.propertyId = this.propertyList[0].propertyId;
        this.checkLoading = false
      });
    },
    /** 获取检测数据列表
     * @param { null }
     * @return { Array| list }
     */
    getCheckDataArr() {
      getCheckDataList().then((res) => {
        const newArr = [...res.data]
        this.resetCheckData(newArr)
        this.checkLoading = false
      })
    },
    // 重置checkData的错误显示和信息
    resetCheckData(rows) {
      const newObj = { showError: false, errState: false, errNum: null }
      this.checkTableData = rows.map(item => item = {
        ...item,
        ...newObj
      })
    },
    // 递归函数
    flatten(data) {
      return data.reduce(
        (arr, { propertyId, propertyName, number }) =>
          arr.concat([
            { propertyId, propertyName: `[${number}] ${propertyName}` },
          ]),
        []
      );
    },
    // 全选
    async allSelected() {
      await this.resetCheckData(this.checkTableData)
      this.allChecked = true
      this.checkTableData.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row);
      })
    },
    // 全部取消
    async allCancel() {
      await this.resetCheckData(this.checkTableData)
      this.allChecked = false
      this.$refs.multipleTable.clearSelection();
    },
    
    // 开始检验
    async startCheck() {
      this.checkTableData.map(row => {
        row.showError = false
        row.errNum = null
      })
      const zeroCheckState = await this.zeroCheck()
      if(zeroCheckState) {
        this.realCheck()
      }
    },
    // 数据为空的检验
    zeroCheck() {
      if(this.selectCheckData && this.selectCheckData.length === 0) {
        this.$message.warning('请选中至少一条校验条件后开始校验！')
        return false
      } else {
        return true
      }
    },
    // 非空检验
    realCheck() {
      this.highlightState = true;
      const promiseArr = this.selectCheckData.map((item,index) => {
        
        let data = {
          CheckIdx: item.no,                  // 规则序号，list接口返回的
          WYID: this.symbolCheckForm.propertyId,
          JFYF: this.symbolCheckForm.month,
          HTID: !this.symbolCheckForm.htId ? '' : this.symbolCheckForm.htId     // 默认是空，如果填写只能是整数，代表HTID
        }
        /** 获取检测数据列表
          * @param { Object| data }
          * @return { String| '{errMsg errNum}' }
        */
        return checkStrip(data).then((res) => {
          item.showError = true
          if (!JSON.parse(res.data).Errors) {
            item.errState = true
          } else {
            item.errState = false
            item.errNum = JSON.parse(res.data).Errors
            this.errorTotal += item.errNum
            this.errorData.push(JSON.parse(res.data).ErrMsg)
          }
          this.$refs.multipleTable.setCurrentRow(this.selectCheckData[index])
        })
      })

      Promise.all(promiseArr).then((res) => {
        this.highlightState = false
        this.$message({
          type: 'success',
          message: '数据校验完成！'
        })
      }).then(() => {
        this.interval = setTimeout(() => {
          if(!!this.errorTotal) {
            let routeUrl = this.$router.resolve({name: "CheckDataPage"})  
            sessionStorage.setItem('hlbSAAS-errorData', JSON.stringify(this.errorData))
            this.errorTotal = 0
            this.errorData = []
            window.open(routeUrl.href, '_blank')
          }
        }, 1000)
      })
    },
    // 关闭弹窗
    handleClose() {
      this.$emit("closeSymbolCheck");
    },
    handleSelectionChange(rows) {
      this.selectCheckData = [...rows]
    },
  },
};
</script>

<style>
</style>