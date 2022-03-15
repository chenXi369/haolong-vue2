<template>
  <div>
    <el-tree
      show-checkbox
      default-expand-all
      :data="rangeTree"
      node-key='id'
      :default-checked-keys="rangeVal"
      :props="defaultProps"
      :check-strictly="true"
      @check="currentChecked"
    >
    </el-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label",
      },
      rangeTreeData: [],
      wuyes: [],
      noWuyes: []
    };
  },
  props: {
    rangeTree: {
      type: Array,
      default: () => [],
    },
    rangeVal: {
      type: Array,
      default: () => [],
    }
  },
  methods: {
    // 数据类型转换
    currentChecked(nodeObj, SelectedObj) {
      const wuyeArr = SelectedObj.checkedNodes
        .filter((item) => item.type === 1)
        .map((e) => (e = e.id));
      const noWyArr = SelectedObj.checkedNodes
        .filter((item) => item.type === 0)
        .map((e) => e.id);
      this.$emit("getWyIds", wuyeArr);
      this.$emit("getNoWyIds", noWyArr);
    }
  },
};
</script>

<style>
</style>
