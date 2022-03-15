<template>
  <el-form
    ref="dosageToolForm"
    :model="dosageToolForm"
    label-width="70px"
    :inline="true"
    size="mini"
    @submit.native.prevent
  >
    <el-form-item label="查找">
      <el-input
        clearable
        v-model="dosageToolForm.searchVal"
        style="width: 140%"
        placeholder="输入客户名、房号、总表号、分表号等"
        @change.native="search"
      ></el-input>
    </el-form-item>

    <el-form-item label=" " label-width="120px">
      <el-dropdown trigger="click" placement="bottom-end">
        <el-button type="primary" plain>
          数 据<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :disabled="total === 0">
            <el-dropdown trigger="hover" placement="right-start">
              <span class="el-dropdown">
                计算附加项目费用<i style="margin-left: 60px"
                  class="el-icon-arrow-right el-icon--right"
                ></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>计算全部附加项目</el-dropdown-item>
                <el-dropdown-item>计算选定附加项目</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-dropdown-item>
          <el-dropdown-item :disabled="total === 0"
            >重新计算走表费用</el-dropdown-item
          >
          <el-dropdown-item :disabled="total === 0" divided>
            <el-dropdown trigger="hover" placement="right-start">
              <span class="el-dropdown">
                用量数据导入<i style="margin-left: 88px"
                  class="el-icon-arrow-right el-icon--right"
                ></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>从文件导入</el-dropdown-item>
                <el-dropdown-item>从智能表数据导入</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-dropdown-item>
          <el-dropdown-item :disabled="total === 0"
            >用量数据-导出文件</el-dropdown-item
          >

          <el-dropdown-item :disabled="total === 0" divided
            >指定用量报警值</el-dropdown-item
          >
          <el-dropdown-item :disabled="total === 0" divided
            >分摊计算...</el-dropdown-item
          >

          <el-dropdown-item :disabled="total === 0" divided
            >更新【上次】抄表日期</el-dropdown-item
          >
          <el-dropdown-item :disabled="total === 0" 
            >更新【本次】抄表日期</el-dropdown-item
          ><el-dropdown-item :disabled="total === 0" divided
            >校验总表与分表的数据关系</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </el-form-item>

    <el-form-item label=" " label-width="86px">
      <el-dropdown trigger="hover" placement="bottom-end">
        <el-button type="warning" plain>
          审 核<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :disabled="total === 0">成批审核</el-dropdown-item>
          <el-dropdown-item :disabled="total === 0" divided
            >成批反审核</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </el-form-item>

    <el-form-item label=" " label-width="84px">
      <el-dropdown trigger="hover" placement="bottom-end">
        <el-button type="primary" plain>
          报 表<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :disabled="total === 0"
            >用量登记表（当月 总/分表）</el-dropdown-item
          >
          <el-dropdown-item :disabled="total === 0"
            >用量登记表（下月 总/分表）</el-dropdown-item
          >

          <el-dropdown-item :disabled="total === 0" divided
            >用量登记表（当月 总表）</el-dropdown-item
          >
          <el-dropdown-item :disabled="total === 0"
            >用量登记表（下月 总表）</el-dropdown-item
          >

          <el-dropdown-item :disabled="total === 0" divided
            >计量费用明细表</el-dropdown-item
          >
          <el-dropdown-item :disabled="total === 0"
            >总表分表读书登记表（*）</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </el-form-item>

    <el-form-item label=" " label-width="58px">
      <el-dropdown trigger="hover" @command="handleCommand">
        <el-button type="primary" plain>
          排 序 <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            :command="0"
            :class="{ activeItem: dosageToolForm.sortType === 0 }"
            >单元，楼层，房号</el-dropdown-item
          >
          <el-dropdown-item
            divided
            :command="1"
            :class="{ activeItem: dosageToolForm.sortType === 1 }"
            >单元，房号，楼层</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </el-form-item>
    <el-form-item label=" " label-width="27px">
      <el-button
        plain
        round
        size="mini"
        type="success"
        icon="el-icon-caret-top"
        @click="showFinishUser"
        v-if="finishUserState"
        >显示止约客户</el-button
      >
      <el-button
        plain
        round
        size="mini"
        type="warning"
        icon="el-icon-caret-bottom"
        @click="hiddenFinishUser"
        v-else
        >隐藏止约客户</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      dosageToolForm: {
        sortType: 0,
        searchVal: "",
        showFinishUser: 1
      },
      finishUserState: true,
    };
  },
  methods: {
    // 止约客户的显示隐藏
    showFinishUser() {
      this.finishUserState = false
      this.dosageToolForm.showFinishUser = 0
      this.$emit('showFinishUser', this.dosageToolForm)
    },
    hiddenFinishUser() {
      this.finishUserState = true
      this.dosageToolForm.showFinishUser = 1
      this.$emit('showFinishUser', this.dosageToolForm)
    },
    // 排序切换
    handleCommand(e) {
      this.dosageToolForm.sortType = e;
      this.$emit("changeWyBuild", this.dosageToolForm);
    }
  }
}
</script>

<style scoped>
.activeItem {
  background: #eaeaea;
  color: #1890ff;
}
</style>