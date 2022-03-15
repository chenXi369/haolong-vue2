<template>
  <el-dialog
    title="客户查询"
    :visible.sync="dialogImport"
    width="700px"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-row>
      <el-form :model="userSearchForm">
        <el-col :span="8">
          <el-form-item label="" size="mini" prop="region">
            <el-select
              v-model="region"
              placeholder="请选择"
              @change="selectedCond"
            >
              <el-option label="客户名或简码" :value="0" />
              <el-option label="房号" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="" size="mini" label-width="10px">
            <el-input
              clearable
              v-model="btnValue"
              :placeholder="placeholder"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4" :offset="1">
          <el-form-item label="" size="mini">
            <el-button
              plain
              type="success"
              icon="el-icon-search"
              @click="searchOwner()"
            >
              查询
            </el-button>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="选项一" size="mini" prop="ownerOrTenant">
            <el-radio-group v-model="userSearchForm.ownerOrTenant">
              <el-radio
                v-for="item in resourceOneList"
                :key="item.value"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="选项二" size="mini" prop="companyOrPersonal">
            <el-radio-group v-model="userSearchForm.companyOrPersonal">
              <el-radio
                v-for="item in resourceTwoList"
                :key="item.value"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <transition name="el-fade-in-linear">
      <section v-show="isOwnerTable">
        <el-divider><i class="el-icon-document" /> 客户列表</el-divider>
        <el-table
          ref="multipleTable"
          :cell-style="{ padding: '4px' }"
          :data="ownerList"
          border
          height="250"
          @select="select"
          @select-all="selectAll"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="栋号" align="left" width="100" prop="栋号" />
          <el-table-column label="房号" align="left" width="100" prop="房号" />
          <el-table-column label="简码" align="center" width="150" prop="简码" />
          <el-table-column label="客户名称" align="center" prop="客户名称" />
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getTable"
        />
      </section>
    </transition>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" :disabled="selectedValue">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Cookies from 'js-cookie'
import { importCustomerList } from "@/api/system/userRegister";
export default {
  props: {
    dialogImport: {
      type: Boolean,
      default: false,
    },
    userSearchForm: {
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      ownerList: [],
      isOwnerTable: false,
      resourceOneList: [
        {
          label: "全部",
          value: 0,
        },
        {
          label: "业主",
          value: 1,
        },
        {
          label: "租户",
          value: 2,
        },
      ],
      resourceTwoList: [
        {
          label: "全部",
          value: 0,
        },
        {
          label: "个人",
          value: 1,
        },
        {
          label: "单位",
          value: 2,
        },
      ],
      placeholder: "请输入客户名或简码",
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 20
      },
      selectedInfo: {},
      selectedValue: true,
      btnValue: "",
      region: 0
    };
  },
  methods: {
    handleClose() {
      this.ownerList = []
      this.selectedValue = true
      this.isOwnerTable = false
      this.$emit("closeImportOwner", false);
    },
    confirm() {
      if(this.selectedInfo !== {}) {
        var val = {
          node: this.selectedInfo,
          state: false
        }
      }else {
        val = { state: false }
      }
      this.ownerList = []
      this.selectedValue = true
      this.isOwnerTable = false
      this.$emit("confirmImportOwner", val);
    },
    cancel() {
      this.ownerList = []
      this.selectedValue = true
      this.isOwnerTable = false
      this.$emit("closeImportOwner", false);
    },
    // 查询接口
    searchOwner() {
      if(this.region === 0) {
        this.userSearchForm.roomNo = undefined
        this.userSearchForm.nameOrShortCode = this.btnValue
      }else {
        this.userSearchForm.roomNo = this.btnValue
        this.userSearchForm.nameOrShortCode = undefined
      }
      this.userSearchForm.propertyId = Cookies.get('selectPropertyId')
      this.userSearchForm.pageNum = this.queryParams.pageNum
      this.userSearchForm.pageSize = this.queryParams.pageSize
      importCustomerList(this.userSearchForm).then((res) => {
        this.ownerList = [ ...res.records ]
        this.total = res.total
      });
      this.isOwnerTable = true;
    },
    select(selection, row) {
      if (selection.length > 1) {
        const del_row = selection.shift();
        this.$refs.multipleTable.toggleRowSelection(del_row, false);
      }
      this.selectedInfo = { ...row }
      this.selectedValue = false
    },
    selectAll(selection) {
      if (selection.length > 1) {
        selection.length = 1;
      }
    },
    selectedCond(val) {
      if (val === "0") {
        this.btnValue = ""
        this.placeholder = "请输入客户名或简码";
      } else {
        this.btnValue = ""
        this.placeholder = "请输入房间号";
      }
    },
    getTable(val) {
      this.queryParams = {
        pageSize: val.limit,
        pageNum: val.page
      }
      this.searchOwner()
    }
  },
};
</script>

<style>
</style>
