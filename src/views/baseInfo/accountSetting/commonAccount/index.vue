<template>
  <div class="commonAccount">
    <header class="header">
      <common-header
        :isCheckbox="isCheckbox"
        :showChargeItem="showChargeItem"
        :showCurrencyType="showCurrencyType"
      ></common-header>
      <tools></tools>
    </header>

    <main class="main">
      <account-user-list
        :topHeight="topHeight"
        :showMenus="showMenus"
        :queryParams="queryParams"
        :userHtTotal="userHtTotal"
        :handleSetting="handleSetting"
        :userTableData="userTableData"
        :userTableLoading="userTableLoading"
      ></account-user-list>
      <user-pay-item
        :bottomHeight="bottomHeight"
        :selectedPayItems="selectedPayItems"
        :selectItemLoading="selectItemLoading"
        @toItemDetail="toItemDetail"
        @toHistoryDetail="toHistoryDetail"
      ></user-pay-item>
    </main>

    <section>
      <item-detail
        :grandData="grandData"
        :itemDetailVisible="itemDetailVisible"
        @closeItemDetail="closeItemDetail"
      ></item-detail>

      <historical-arrear
        :tableData="tableData"
        :hisDetailVisible="hisDetailVisible"
        @closeHisDetail="closeHisDetail"
      ></historical-arrear>
    </section>
  </div>
</template>

<script>
import CommonHeader from '@/components/CommonHeader/index.vue'
import ItemDetail from './components/ItemDetail.vue'
import UserPayItem from './components/UserPayItem.vue'
import HistoricalArrear from './components/HistoricalArrear.vue'
import AccountUserList from './components/AccountUserList.vue'
import Tools from './components/AccountPayTools.vue'

export default {
  data() {
    return {
      isCheckbox: false,
      showChargeItem: false,
      showCurrencyType: true,

      // AccountUserList props
      topHeight: {
        height: 0
      },
      showMenus: '',
      queryParams: {
        pageSize: 20,
        pageNum: 0
      },
      userHtTotal: 0,
      handleSetting: '',
      userTableData: [],
      userTableLoading: false,

      // UserPayItem props
      selectedPayItems: [],
      bottomHeight: {
        height: 500
      },
      selectItemLoading: false,

      // ItemDetail props
      itemDetailVisible: true,
      itemDetailRow: {},

      // historyDetail props
      hisDetailVisible: false,
      hisDetailRow: {},
      tableData: [],

      grandData: {
        value: 1
      }
    };
  },
  components: {
    Tools,
    ItemDetail,
    UserPayItem,
    CommonHeader,
    HistoricalArrear,
    AccountUserList
  },
  methods: {
    // 关闭详情
    closeItemDetail(val) {
      this.itemDetailVisible = val
    },
    // 去详情
    toItemDetail(row) {
      this.itemDetailVisible = true
      this.itemDetailRow = { ...row }
    },
    // 关闭历史明细
    closeHisDetail(val) {
      this.hisDetailVisible = val
    },
    // 去历史明细
    toHistoryDetail(row) {
      this.hisDetailVisible = true
      this.hisDetailRow = { ...row }
    }
  }
};
</script>

<style lang="scss" scoped>
.commonAccount {
  .header {
    margin-top: 20px;
  }
  .main {
    width: 100%;
    padding: 10px 30px 20px;
  }
}
</style>