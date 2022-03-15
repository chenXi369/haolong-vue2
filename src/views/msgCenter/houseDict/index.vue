<template>
  <div class="houseDict">
    <el-row :gutter="24">
      <!-- 部门数据 -->
      <el-col :span="1.5">
        <el-button
          plain
          type="primary"
          icon="el-icon-d-caret"
          size="mini"
          @click="expand"
          >{{ isShow ? "折叠" : "展开" }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          plain
          type="success"
          icon="el-icon-plus"
          size="mini"
          @click="add"
          :disabled="isAdd"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          plain
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="exportTable"
          >导出</el-button
        >
      </el-col>
    </el-row>
    <el-row
      :gutter="20"
      style="margin: 20px 0; display: flex"
    >
      <el-col :span="4" style="min-width: 240px">
        <div class="head-container" :style="contentStyleObj">
          <el-tree
            ref="tree"
            accordion
            node-key="id"
            :data="orgOptions"
            :props="defaultProps"
            :highlight-current="true"
            @node-click="handleNodeClick"
            :default-expanded-keys="expandAll"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <svg-icon
                icon-class="compony"
                v-if="data.id === 0"
                style="margin-right: 3px"
              ></svg-icon>
              <svg-icon
                icon-class="houseDict"
                v-else-if="data.id === 1"
                style="margin-right: 3px"
              ></svg-icon>
              <svg-icon
                icon-class="houseDict-cw"
                v-else-if="data.id === 2"
                style="margin-right: 3px"
              ></svg-icon>
              <svg-icon
                icon-class="houseDict-xz"
                v-else-if="data.id === 3"
                style="margin-right: 3px"
              ></svg-icon>
              <svg-icon
                icon-class="other"
                v-else-if="data.id === 4"
                style="margin-right: 3px"
              ></svg-icon>
              <svg-icon
                icon-class="leixing"
                v-else-if="data.id === 5"
                style="margin-right: 3px"
              ></svg-icon>
              <svg-icon
                icon-class="houseDict-zd"
                v-else
                style="margin-right: 3px"
              ></svg-icon>
              <span style="font-size: 14px">{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </el-col>

      <el-col :span="20">
        <div class="body-container" v-if="showTable">
          <div class="title">{{ showTitle }}</div>
          <el-table
            border
            :key="showTitle"
            :data="tableData"
            v-loading="loading"
            :row-key="getRowKey"
            :cell-style="{padding: '3px'}"
          >
            <template v-if="provinces.indexOf(selectIndex) === -1">
              <el-table-column
                width="100"
                label="序号"
                align="center"
                prop="no"
              >
                <!-- <template slot-scope="scope">
                  <div
                    @dblclick="changeEnddate(scope.$index, scope.row)"
                    style="height: 40px; line-height: 40px"
                  >
                    <span v-show="!scope.row.edit_number">{{
                      scope.row.no
                    }}</span>
                    <el-input
                      :ref="'enddateinput' + scope.$index"
                      @blur="enddateblur(scope.$index, scope.row)"
                      @keyup.enter.native="$event.target.blur"
                      clearable
                      v-show="scope.row.edit_number"
                      size="mini"
                      v-model="scope.row.no"
                      placeholder="请输入内容"
                    ></el-input>
                  </div>
                </template> -->
              </el-table-column>
              <el-table-column
                v-if="[22].indexOf(selectIndex) === -1"
                label="名称"
                align="center"
                prop="name"
              >
                <!-- <template slot-scope="scope">
                  <div
                    @dblclick="changeValue(scope.$index, scope.row)"
                    style="height: 40px; line-height: 40px"
                  >
                    <span v-show="!scope.row.edit_name">{{
                      scope.row.name
                    }}</span>
                    <el-input
                      :ref="'valueinput' + scope.$index"
                      @blur="valueblur(scope.$index, scope.row)"
                      @keyup.enter.native="$event.target.blur"
                      clearable
                      v-show="scope.row.edit_name"
                      size="mini"
                      v-model="scope.row.name"
                      placeholder="请输入内容"
                    ></el-input>
                  </div>
                </template> -->
              </el-table-column>
            </template>

            <!-- 含有代码和符号的table -->
            <template v-if="[14, 15, 21].indexOf(selectIndex) !== -1">
              <el-table-column label="代码" prop="code" align="center">
              </el-table-column>
              <el-table-column
                label="符号"
                prop="symbol"
                align="center"
              ></el-table-column>
            </template>
            <!-- 汇率 -->
            <template v-if="[22].indexOf(selectIndex) !== -1">
              <el-table-column
                label="外币"
                prop="foreignCurrency"
                align="center"
              ></el-table-column>
              <el-table-column
                label="本位币"
                prop="baseCurrency"
                align="center"
              ></el-table-column>
              <el-table-column
                label="当日汇率"
                prop="exchangeRate"
                align="center"
              ></el-table-column>
              <el-table-column
                label="综合汇率（兑RMB）"
                prop="compExchangeRate"
                align="center"
              ></el-table-column>
            </template>
            <!-- 付款方式 -->
            <template v-if="[51].indexOf(selectIndex) !== -1">
              <el-table-column
                label="类别"
                prop="category"
                align="center"
              ></el-table-column>
              <el-table-column
                label="抵扣顺序"
                prop="deductionOrder"
                align="center"
              ></el-table-column>
            </template>
            <!-- 临时费别 -->
            <template v-if="[52].indexOf(selectIndex) !== -1">
              <el-table-column
                label="小数位"
                prop="calculationAccuracy"
                align="center"
              ></el-table-column>
              <el-table-column
                label="滞纳金比例"
                prop="lateFeeRatio"
                align="center"
              ></el-table-column>
              <el-table-column label="押金" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.depositItem"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="代收付" align="center">
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.receivePaymentProjects"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="备选项目" align="center">
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.alternativeProjects"
                  ></el-checkbox>
                </template>
              </el-table-column>
            </template>
            <!-- 零星项目 -->
            <template v-if="[53].indexOf(selectIndex) !== -1">
              <el-table-column label="备选项目" align="center">
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.alternativeProjects"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="移动支付项目" align="center">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.paymentItems"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="费用类型"
                prop="feeType"
                align="center"
              ></el-table-column>
              <el-table-column
                label="税率"
                prop="taxRate"
                align="center"
              ></el-table-column>
              <el-table-column
                label="单价"
                prop="unitPrice"
                align="center"
              ></el-table-column>
              <el-table-column
                label="单位"
                prop="unit"
                align="center"
              ></el-table-column>
              <el-table-column
                label="精度"
                prop="accuracy"
                align="center"
              ></el-table-column>
              <el-table-column
                label="比例"
                prop="proportion"
                align="center"
              ></el-table-column>
            </template>
            <!-- 行政区 -->
            <template v-if="provinces.indexOf(selectIndex) !== -1">
              <el-table-column label="省" prop="province" align="center">
              </el-table-column>
              <el-table-column
                label="市/区"
                prop="city"
                align="center"
              ></el-table-column>
              <el-table-column
                label="区号"
                prop="areaCode"
                align="center"
              ></el-table-column>
              <el-table-column
                label="邮编"
                prop="postcode"
                align="center"
              ></el-table-column>
            </template>

            <el-table-column label="操作" align="center" width="160">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="starUpdate(scope.row)"
                  >修改</el-button
                >
                <el-button
                  v-if="scope.row.staffId !== 1"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="starDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-- 通用的新增dialog -->
    <el-dialog
      :title="isAddTitle ? '新增 - ' + showTitle : '修改 - ' + showTitle"
      :visible.sync="visible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="70px" :rules="rules">
        <template v-if="provinces.indexOf(selectIndex) === -1">
          <el-form-item label="序号" prop="no">
            <el-input
              v-model.number="form.no"
              placeholder="请输入序号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name" v-if="selectIndex !== 22">
            <el-input
              v-model="form.name"
              placeholder="请输入名称"
              clearable
            ></el-input>
          </el-form-item>
        </template>
        <template v-if="formStateOne.indexOf(selectIndex) === -1">
          <el-form-item label="代码" placeholder="请输入代码" prop="code">
            <el-input v-model="form.code" clearable></el-input>
          </el-form-item>
          <el-form-item label="符号" placeholder="请输入符号" prop="symbol">
            <el-input v-model="form.symbol" clearable></el-input>
          </el-form-item>
        </template>
        <template v-if="selectIndex === 22">
          <el-form-item
            label="外币"
            placeholder="请输入外币名"
            prop="foreignCurrency"
          >
            <el-input v-model="form.foreignCurrency" clearable></el-input>
          </el-form-item>
          <el-form-item
            label="本位币"
            placeholder="请输入本位币名"
            prop="baseCurrency"
          >
            <el-input v-model="form.baseCurrency" clearable></el-input>
          </el-form-item>
          <el-form-item
            label="当日汇率"
            placeholder="请输入当日汇率"
            prop="exchangeRate"
          >
            <el-input v-model="form.exchangeRate" clearable></el-input>
          </el-form-item>
          <el-form-item
            label="综合汇率"
            placeholder="请输入综合汇率"
            prop="compExchangeRate"
          >
            <el-input v-model="form.compExchangeRate" clearable></el-input>
          </el-form-item>
        </template>

        <!-- 付款方式 -->
        <template v-if="selectIndex === 51">
          <el-form-item label="类别号" prop="category">
            <el-input
              v-model="form.category"
              placeholder="默认为0"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="抵扣序号" prop="deductionOrder">
            <el-input
              v-model="form.deductionOrder"
              placeholder="默认为0"
              clearable
            ></el-input>
          </el-form-item>
        </template>

        <!-- 临时费别 -->
        <template v-if="selectIndex === 52">
          <el-form-item label="违约金比例" prop="lateFeeRatio">
            <el-input
              v-model="form.lateFeeRatio"
              placeholder="请输入违约金比例值"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="计价精度" prop="calculationAccuracy">
            <el-select v-model="form.calculationAccuracy" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="form.depositItem">押金</el-checkbox>
            <el-checkbox v-model="form.receivePaymentProjects"
              >代收付</el-checkbox
            >
            <el-checkbox v-model="form.alternativeProjects"
              >备选项目</el-checkbox
            >
          </el-form-item>
        </template>

        <!-- 零星项目 -->
        <template v-if="selectIndex === 53">
          <el-form-item label="税率" prop="taxRate">
            <el-input
              v-model="form.taxRate"
              placeholder="请输入税率"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="单价" prop="unitPrice">
            <el-input
              v-model="form.unitPrice"
              placeholder="请输入单价"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="计量单位" prop="unit">
            <el-input
              v-model="form.unit"
              placeholder="请输入计量单位"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="小数精度" prop="accuracy">
            <el-select v-model="form.accuracy" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="form.alternativeProjects"
              >备选项目</el-checkbox
            >
            <el-checkbox v-model="form.paymentItems">移动支付项目</el-checkbox>
          </el-form-item>
        </template>

        <template v-if="provinces.indexOf(selectIndex) !== -1">
          <el-form-item label="省" prop="province">
            <el-input
              v-model="form.province"
              placeholder="请输入省"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="市/区" prop="city">
            <el-input
              v-model="form.city"
              placeholder="请输入税率市区名"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="区号" prop="areaCode">
            <el-input
              v-model="form.areaCode"
              placeholder="请输入区号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="邮编" prop="postcode">
            <el-input
              v-model="form.postcode"
              placeholder="请输入邮编"
              clearable
            ></el-input>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addConfirm">确 定</el-button>
        <el-button @click="addCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addDictionary,
  delDictionary,
  updateDictionary,
  getProvince,
  getDictionary,
} from "@/api/system/systemData";
export default {
  data() {
    return {
      contentStyleObj: {
        height: "",
      },
      nodeName: "",
      isAdd: true,
      isAddTitle: true,
      loading: false,
      tableData: [],
      isShow: false,
      showTable: false,
      selectIndex: 0,
      showTitle: "",
      visible: false,
      form: {},
      OldForm: {},
      rules: {
        no: [{ required: true, trigger: "blur", message: "请输入序号" }],
        name: [{ required: true, trigger: "blur", message: "请输入名称" }],
        baseCurrency: [
          { required: true, trigger: "blur", message: "请输入本位币名" },
        ],
        compExchangeRate: [
          { required: true, trigger: "blur", message: "请输入综合汇率" },
        ],
        exchangeRate: [
          { required: true, trigger: "blur", message: "请输入当前汇率" },
        ],
        foreignCurrency: [
          { required: true, trigger: "blur", message: "请输入外币名" },
        ],
        province: [{ required: true, trigger: "blur", message: "请输入省" }],
        city: [{ required: true, trigger: "blur", message: "请输入市/区" }],
        areaCode: [{ required: true, trigger: "blur", message: "请输入区号" }],
        postcode: [
          { required: true, trigger: "blur", message: "请输入正确的邮编" },
        ],
      },
      formTwo: {},
      rulesTwo: [],
      visibleTwo: false,
      formThree: {},
      rulesThree: [],
      visibleThree: false,
      provinces: [],
      provinceList: [],
      options: [
        {
          label: "0 - 元",
          value: "0",
        },
        {
          label: "1 - 角",
          value: "1",
        },
        {
          label: "2 - 分",
          value: "2",
        },
      ],
      orgOptions: [
        {
          id: 0,
          label: "数据字典",
          children: [
            {
              id: 1,
              label: "房屋",
              children: [
                {
                  id: 11,
                  label: "结构",
                },
                {
                  id: 12,
                  label: "朝向",
                },
                {
                  id: 13,
                  label: "用途",
                },
                {
                  id: 14,
                  label: "房屋状态",
                },
                {
                  id: 15,
                  label: "装修状态",
                },
              ],
            },
            {
              id: 2,
              label: "财务计费",
              children: [
                {
                  id: 21,
                  label: "币种",
                },
                {
                  id: 22,
                  label: "汇率",
                },
                {
                  id: 23,
                  label: "计量单位",
                },
                {
                  id: 24,
                  label: "预收费用来源",
                },
                {
                  id: 25,
                  label: "票据核销入账银行",
                },
                {
                  id: 26,
                  label: "单据字典",
                },
                {
                  id: 27,
                  label: "统计类别",
                },
              ],
            },
            {
              id: 5,
              label: "收费项目",
              children: [
                {
                  id: 51,
                  label: "付款方式",
                },
                {
                  id: 52,
                  label: "临时费别",
                },
                {
                  id: 53,
                  label: "零星项目",
                },
              ],
            },
            {
              id: 3,
              label: "行政区",
              children: [
                {
                  id: 31,
                  label: "国家和地区",
                },
                {
                  id: 32,
                  label: "行政区",
                  children: [],
                },
                {
                  id: 33,
                  label: "民族",
                },
              ],
            },
            {
              id: 4,
              label: "其他",
              children: [
                {
                  id: 41,
                  label: "业务类型",
                },
                {
                  id: 42,
                  label: "核算类型",
                },
                {
                  id: 43,
                  label: "总表类型",
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      expandAll: [0, 1, 2, 3, 4, 5],
      formStateOne: [
        11,
        12,
        13,
        22,
        23,
        24,
        25,
        26,
        27,
        31,
        33,
        41,
        42,
        43,
        51,
        52,
        53,
      ],
    };
  },
  computed: {
    // 指定一个key标识这一行的数据
    getRowKey(row) {
      return row.nodeName;
    },
  },
  created() {
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
    getProvince().then((res) => {
      this.provinces = [...res.data];
      this.provinceList = [...res.data].map((item) => {
        return {
          id: item,
          label: item,
        };
      });
      this.orgOptions[0].children[3].children[1].children = this.provinceList;
      this.provinces.map((item) => {
        this.formStateOne.push(item);
      });
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  methods: {
    // 实时获取屏幕高度
    getHeight() {
      this.contentStyleObj.height = window.innerHeight - 250 + "px";
    },
    expand() {
      this.isShow = !this.isShow;
      if (this.isShow) {
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = false;
        }
        this.expandAll = [0];
      } else {
        this.expandAll = [0, 1, 2, 3, 4, 5, 32];
      }
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.selectIndex = data.id;
      this.showTitle = data.label;
      // 打开新增按钮
      if ([0, 1, 2, 3, 4, 5].indexOf(data.id) !== -1) {
        this.isAdd = true;
      } else {
        this.isAdd = false;
      }
      if ([0, 1, 2, 3, 4, 5, 32].indexOf(data.id) !== -1) {
        this.showTable = false;
      } else {
        this.showTable = true;
        this.getDictionary(this.showTitle);
      }
    },
    // 获取单机的table
    getDictionary(name) {
      this.loading = true;
      this.tableData = [];
      let params = {};
      if (name === "房屋状态") {
        this.nodeName = "状态";
      } else if (name === "票据核销入账银行") {
        this.nodeName = "入帐银行";
      } else if (name === "国家和地区") {
        this.nodeName = "国籍";
      } else if (name === "行政区") {
        this.nodeName = "邮政";
      } else if (name === "核算类型") {
        this.nodeName = "核算类别";
      } else if (name === "总表类型") {
        this.nodeName = "总表类别";
      } else if (name === "预收费用来源") {
        this.nodeName = "费用来源";
      } else {
        this.nodeName = name;
      }
      if (this.provinces.indexOf(name) !== -1) {
        params.provinceName = this.nodeName;
        params.nodeName = "邮政";
      } else {
        params.nodeName = this.nodeName;
      }
      getDictionary(params).then((res) => {
        this.loading = false;
        this.tableData = [...res.data];
      });
    },
    // 导出树形结构
    exportTable() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出组织机构信息?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
        // return exportUser(queryParams);
      });
    },
    // 修改操作
    starUpdate(row) {
      this.visible = true;
      this.isAdd = false;
      this.isAddTitle = false;
      this.form = row;
      this.OldForm = row;
    },
    // 新增操作 - 调接口
    add() {
      this.visible = true;
      this.isAdd = false;
      this.isAddTitle = true;
      this.form = {};
    },
    addConfirm() {
      if (this.provinces.indexOf(this.nodeName) !== -1) {
        this.form.nodeName = "邮政";
      } else {
        this.form.nodeName = this.nodeName;
      }
      if (this.selectIndex === 52) {
        if (this.form.alternativeProjects) {
          this.form.alternativeProjects = "1";
        } else {
          this.form.alternativeProjects = "0";
        }
        if (this.form.depositItem) {
          this.form.depositItem = "1";
        } else {
          this.form.depositItem = "0";
        }
        if (this.form.receivePaymentProjects) {
          this.form.receivePaymentProjects = "1";
        } else {
          this.form.receivePaymentProjects = "0";
        }
      }
      if (this.selectIndex === 53) {
        if (this.form.alternativeProjects) {
          this.form.alternativeProjects = "1";
        } else {
          this.form.alternativeProjects = "0";
        }
        if (this.form.paymentItems) {
          this.form.paymentItems = "1";
        } else {
          this.form.paymentItems = "0";
        }
      }
      // 判断是新增还是修改 以及校验form是否为空
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.isAddTitle) {
            addDictionary(this.form).then(() => {
              this.visible = false;
              this.$message.success("新增成功");
              this.getDictionary(this.nodeName);
            });
          } else {
            let formData = {};
            if (this.selectIndex === 52) {
              formData = JSON.parse(
                JSON.stringify(this.form).replace(/tempFeeId/g, "id")
              );
            } else if (this.selectIndex === 53) {
              formData = JSON.parse(
                JSON.stringify(this.form).replace(/sporadicProjectsId/g, "id")
              );
            } else {
              formData = this.form;
            }
            updateDictionary(formData).then(() => {
              this.visible = false;
              this.$message.success("修改成功");
              this.getDictionary(this.nodeName);
            });
          }
        }
      });
    },
    addCancel() {
      this.visible = false;
    },
    handleClose() {
      this.visible = false;
    },
    // 删除操作
    starDelete(row) {
      console.log(row);
      const params = {
        nodeName: this.nodeName,
        delId: row.id,
      };
      if ([51].indexOf(this.selectIndex) !== -1) {
        params.delId = row.no;
      } else if ([52].indexOf(this.selectIndex) !== -1) {
        params.delId = row.tempFeeId;
      } else if ([52].indexOf(this.selectIndex) !== -1) {
        params.delId = row.sporadicProjectsId;
      }
      delDictionary(params).then((res) => {
        this.$message.success("删除成功");
        this.getDictionary(this.nodeName);
      });
    },
    // table单元格的编辑操作
    // changeEnddate(index, rowdata) {
    //   console.log(index, rowdata);
    //   this.tableData[index].edit_number = !this.tableData[index].edit_number; //直接加key
    //   this.tableData = [...this.tableData]; //因为我table绑定的表格数据是后接过来赋值的，所以需要这步操作，如果没有1、2步骤这个可以不加。后面也一样

    //   setTimeout(() => {
    //     //定时器是为了避免没有获取到dom的情况报错，所以象征性的给1毫秒让他缓冲
    //     this.$refs["enddateinput" + index].focus();
    //     //el-input的autofocus失效，所以用这个方法。对应在template里的refs绑定值
    //   }, 1);
    // },
    // enddateblur(index, rowdata) {
    //   console.log(index, rowdata);
    //   //enter方法和blur方法冲突的解决办法，就是在让他们触发同一个方法。具体看template里是怎么写的
    //   this.tableData[index].edit_number = !this.tableData[index].edit_number;
    //   this.tableData = [...this.tableData];
    // },

    // changeValue(index, rowdata) {
    //   console.log(index, rowdata);
    //   this.tableData[index].edit_name = !this.tableData[index].edit_name;
    //   this.tableData = [...this.tableData];

    //   setTimeout(() => {
    //     this.$refs["valueinput" + index].focus();
    //   }, 1);
    // },
    // valueblur(index, rowdata) {
    //   console.log(index, rowdata);
    //   this.tableData[index].edit_name = !this.tableData[index].edit_name;
    //   this.tableData = [...this.tableData];
    // },
  },
};
</script>

<style lang="scss" scope>
.houseDict {
  padding: 24px;
  .head-container {
    min-height: 680px;
    overflow: hidden;
    overflow-y: scroll;
  }
  .body-container {
    .title {
      text-align: center;
      margin: 0 0 20px 0;
      font-size: 20px;
    }
  }
}
</style>
