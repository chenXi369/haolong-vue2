<template>
  <el-form
    ref="toolForm"
    :model="toolForm"
    label-width="70px"
    :inline="true"
    size="mini"
    @submit.native.prevent
  >
    <el-form-item label="查找">
      <el-input
        clearable
        v-model="toolForm.searchVal"
        style="width: 120%"
        placeholder="输入姓名、房号、手机号等"
        @change.native="search"
      ></el-input>
    </el-form-item>
    <el-form-item label=" " label-width="168px">
      <el-dropdown trigger="click" placement="bottom-end">
        <el-button type="primary" plain>
          批量更新<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            @click.native="batchUpdateDate(0)"
            :disabled="total === 0"
            >更新 开始日期</el-dropdown-item
          >
          <el-dropdown-item
            @click.native="batchUpdateDate(1)"
            :disabled="total === 0"
            >更新 结束日期</el-dropdown-item
          >
          <el-dropdown-item
            @click.native="batchUpdate(2)"
            divided
            :disabled="total === 0"
            >更新 托收代码</el-dropdown-item
          >
          <el-dropdown-item
            @click.native="batchUpdate(3)"
            :disabled="total === 0"
            >更新 银行代码</el-dropdown-item
          >

          <el-dropdown-item
            @click.native="batchUpdate(5)"
            divided
            :disabled="total === 0"
            >依银行代码更新托收代码</el-dropdown-item
          >
          <el-dropdown-item
            @click.native="batchUpdate(4)"
            :disabled="total === 0"
            >依托收代码更新银行代码</el-dropdown-item
          >
          <el-dropdown-item
            @click.native="suppleBankPayInfo"
            divided
            :disabled="total === 0"
            >自动补充银行托收资料</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </el-form-item>

    <el-form-item label=" " label-width="72px">
      <el-dropdown trigger="click" placement="bottom-end">
        <el-button type="primary" plain>
          批量导入<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-upload
            ref="uploadOne"
            class="upload-demo"
            action="/"
            :limit="1"
            :multiple="false"
            :show-file-list="false"
            :disabled="total === 0"
            :http-request="uploadFileOne"
            :before-upload="beforeUpload"
          >
            <el-dropdown-item :disabled="total === 0"
              >导入月费用（日期等）</el-dropdown-item
            >
          </el-upload>
          <el-upload
            ref="uploadTwo"
            class="upload-demo"
            action="/"
            :limit="1"
            :multiple="false"
            :show-file-list="false"
            :disabled="total === 0"
            :http-request="uploadFileTwo"
            :before-upload="beforeUpload"
          >
            <el-dropdown-item :disabled="total === 0"
              >导入收费项目（车牌等）</el-dropdown-item
            >
          </el-upload>
          <el-upload
            ref="uploadThree"
            class="upload-demo"
            action="/"
            :limit="1"
            :multiple="false"
            :show-file-list="false"
            :disabled="total === 0"
            :http-request="uploadFileThree"
            :before-upload="beforeUpload"
          >
            <el-dropdown-item :disabled="total === 0"
              >导入倍率值（折扣）</el-dropdown-item
            >
          </el-upload>
          <el-upload
            ref="uploadFour"
            class="upload-demo"
            action="/"
            :limit="1"
            :multiple="false"
            :show-file-list="false"
            :disabled="total === 0"
            :http-request="uploadFileFour"
            :before-upload="beforeUpload"
          >
            <el-dropdown-item :disabled="total === 0"
              >导入子表项目（含新增）</el-dropdown-item
            >
          </el-upload>
        </el-dropdown-menu>
      </el-dropdown>
    </el-form-item>

    <el-form-item label=" " label-width="56px">
      <el-button
        size="mini"
        icon="el-icon-download"
        round
        :disabled="total === 0 || exportLoading"
        @click="exportExcel"
        >导出 Excel</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0,
    },
    exportLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      toolForm: {
        searchVal: "",
      },
    };
  },
  methods: {
    search() {
      this.$emit("quickSearch", this.toolForm.searchVal);
    },
    batchUpdate(i) {
      this.$emit("batchUpdateOther", i);
    },
    batchUpdateDate(i) {
      this.$emit("batchUpdateDate", i);
    },
    suppleBankPayInfo() {
      const h = this.$createElement;
      this.$confirm("警告", {
        cancelButtonText: "取消",
        confirmButtonText: "确认",
        type: "warning",
        title: "提示",
        closeOnClickModal: false,
        message: h("div", null, [
          h(
            "p",
            null,
            "该功能将客户名称、客户证件、客户手机更新到空白的开户名、开户证件和预留手机信息！"
          ),
          h(
            "p",
            { style: "padding-top: 16px" },
            "确定要对整个物业进行更新吗？"
          ),
        ]),
      })
        .then(() => {
          this.$emit("handleBankPayInfoUpdate");
        })
        .catch(() => {
          console.log("用户点击取消");
        });
    },
    // 导出excel
    exportExcel() {
      this.$emit("exportExcelTable");
    },
    // 导入月费用
    uploadFileOne(content) {
      this.uploadFile(content.file, 'importMonthlyFee')
    },
    // 导入收费项目
    uploadFileTwo(content) {
      this.uploadFile(content.file, 'importChargeItems')
    },
    // 导入倍率值
    uploadFileThree(content) {
      this.uploadFile(content.file, 'importMagnification')
    },
    uploadFileFour(content) {
      this.uploadFile(content.file, 'importChargeItemsSubTable')
    },
    // 上传前的验证
    beforeUpload(file) {
      console.log(file)
      // const isCsv = file.name.indexOf(".csv") !== -1;
      // if (isCsv) {
      //   return true;
      // } else {
      //   this.$message.warning(`只能上传csv文件`);
      //   return false;
      // }
    },
    // 导入文件
    uploadFile(file, key) {
      const formData = new FormData()
      formData.append('file', file)
      let fileData = {
        file: formData,
        importKey: key
      }
      this.$emit('exportFileName', fileData)
    },
    //上传成功之后清除历史记录
    successUpload(key) {
      switch (key) {
        case 'importMonthlyFee':
          this.$refs.uploadOne.clearFiles()
          break;
        case 'importChargeItems':
          this.$refs.uploadTwo.clearFiles()
          break;
        case 'importMagnification':
          this.$refs.uploadThree.clearFiles()
          break;
        case 'importChargeItemsSubTable':
          this.$refs.uploadFour.clearFiles()
          break;
        default: this.$refs.uploadOne.clearFiles()
          break;
      }
    }
  }
}
</script>

<style></style>