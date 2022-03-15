<template>
  <div class="changeAccount">
    <!-- 子组件 -->
    <carry-down-pay
      ref="carryDownPay"
      v-loading="loading"
      :checkHidden="checkHidden"
      :disableForce="disableForce"
      @overLoading="overLoading"
      @delChangePay="delChangePay"
      @openSymbolCheck="openSymbolCheck"
      @createChangePayOne="createChangePayOne"
      @createChangePayTwo="createChangePayTwo"
    >
      <template v-slot:buildUserArea>
        <component :is="compType" :compData="compData"></component>
      </template>
    </carry-down-pay>
    <!-- 子组件 -->
    <section>
      <symbol-check
        :disableForce="disableForce"
        :symbolCheckVisible="symbolCheckVisible"
        @changeProperty="changeProperty"
        @closeSymbolCheck="closeSymbolCheck"
      ></symbol-check>
      <reminder-area
        :dialogTitle="dialogTitle"
        :reminderVisible="reminderVisible"
        @confirmReminder="confirmReminder"
        @closeReminder="closeReminder"
      >
        <template v-slot:reminderTitle>{{reminder.reminderTitle}}</template>
        <template v-slot:reminderContent>
          <p v-for="item in reminder.reminderContent" :key="item">{{item}}</p>
        </template>
        <template v-slot:reminderFooter>{{reminder.reminderFooter}}</template>
      </reminder-area>
    </section>
  </div>
</template>

<script>
import ReminderArea from "@/components/Reminder/index.vue"
import SymbolCheck from "@/components/SymbolCheck/index.vue"
import CarryDownPay from "./components/carryDownPay.vue"

export default {
  components: {
    ReminderArea,
    SymbolCheck,
    CarryDownPay,
    compTypeOne: () => import(/* webpackChunkName: 'compTypeOne' */'./components/compTypeOne.vue'),
    compTypeTwo: () => import(/* webpackChunkName: 'compTypeTwo' */'./components/compTypeTwo.vue'),
    compTypeThree: () => import(/* webpackChunkName: 'compTypeThree' */'./components/compTypeThree.vue'),
    compTypeFour: () => import(/* webpackChunkName: 'compTypeFour' */'./components/compTypeFour.vue')
  },
  data() {
    return {
      disableForce: true,
      symbolCheckVisible: false,

      dialogTitle: "",
      reminder: {
        reminderTitle: null,
        reminderContent: [],
        reminderFooter: null,
      },
      reminderVisible: false,
      loading: true,
      checkHidden: true,
      compType: '',
      compData: {},
      compTypeList: ['', 'compTypeOne', 'compTypeTwo', 'compTypeThree', 'compTypeFour']
    };
  },
  activated() {
    let id = Number(this.$route.params.id)
    let type = Number(this.$route.params.type)

    this.compData = { ...this.$route.params }
    this.compType = this.compTypeList[type]

    if(~id !== -1) {
      this.checkHidden = false
      this.disableForce = false
      this.changeProperty(id)
    } else {
      this.checkHidden = true
      this.disableForce = true
      this.$refs.carryDownPay.cancelIsCreate()
    }
  },
  methods: {
    changeProperty(id) {
      this.$refs.carryDownPay.getNewPropertyId(id)
      this.$refs.carryDownPay.getAllChargeMonth(id)
    },
    overLoading() {
      this.loading = false
    },
    // 打开关闭数据校验
    openSymbolCheck() {
      this.symbolCheckVisible = true;
    },
    closeSymbolCheck() {
      this.symbolCheckVisible = false;
    },
    // 反冲
    delChangePay(val) {
      this.dialogTitle = '提醒'
      this.$set(this.reminder, 'reminderTitle', '特别注意')
      this.reminder.reminderContent = [
        `【 ${this.turnYearMonth(val.payMonth)} 】的应收款已经生成！`,
        `若反冲【 ${this.turnYearMonth(
          val.payMonth
        )} 】的应收款，系统会即刻删除该月的应收款。`,
      ];
      this.reminder.reminderFooter = `一定要进行反冲吗？`
      this.reminderVisible = true
    },
    // 生成转结应收款 (已经结转的月份)
    createChangePayOne(val) {
      this.dialogTitle = '提醒'
      this.reminder.reminderTitle = '生成新月份的应收款之前提醒'
      this.reminder.reminderContent = [
        '1. 你必须确保前一个月份的数据校验没有重大问题。',
        '2. 完成了前一个月份的综合预收抵扣工作。',
      ]
      this.reminder.reminderFooter = `【 ${this.turnYearMonth(
        val.payMonth
      )} 】的应收款已存在，一定要重新生成吗？`
      this.reminderVisible = true
    },
    createChangePayTwo(val) {
      this.dialogTitle = '提醒'
      this.reminder.reminderTitle = "生成新月份的应收款之前提醒"
      this.reminder.reminderContent = [
        "1. 你必须确保前一个月份的数据校验没有重大问题。",
        "2. 完成了前一个月份的综合预收抵扣工作。",
      ]
      this.reminder.reminderFooter = `确定要生成【 ${this.turnYearMonth(
        val.payMonth
      )} 】的应收款吗？`
      this.reminderVisible = true
    },
    confirmReminder() {
      this.reminderVisible = false
    },
    closeReminder() {
      this.reminderVisible = false
    },
    turnYearMonth(val) {
      return `${val.slice(0, 4)}年${val.slice(4, 6)}月`
    }
  }
}
</script>

<style lang="scss" scoped>
.changeAccount {
  padding: 20px;
}
</style>