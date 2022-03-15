<template>
  <div>
    <el-form
      ref="reportForm"
      :model="reportForm"
    >
      <el-row>
        <el-col :span="24">
          <!-- 报表权限 table -->
          <el-form-item label="">
            <el-table
              stripe
              border
              row-key="menuId"
              default-expand-all
              :data="reportData"
              :cell-style="{ padding: '2px' }"
              :header-cell-style="{ padding: '3px' }"
              style="width: 100%; margin-bottom: 20px"
              :tree-props="{
                children: 'children',
                hasChildren: 'hasChildren',
              }"
            >
              <!-- 顺序号列 -->
              <el-table-column
                label="顺序号"
                width="120"
                header-align="center"
              >
              </el-table-column>
              <!-- 目录列 -->
              <el-table-column
                label="报表名称"
                header-align="center"
              >
                <template slot-scope="scope">
                  <span style="margin-right: 8px">{{
                    scope.row.menuName
                  }}</span>
                  <el-checkbox
                    v-model="scope.row.allRow"
                    @change="allRow(scope.row)"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <!-- 新增列 -->
              <el-table-column align="center" width="200">
                <template slot="header">
                  浏览权
                  <el-checkbox
                    style="margin-left: 4px"
                    v-model="visitAll"
                    @change="allVisit()"
                  ></el-checkbox>
                </template>
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.permList[2].ownership"
                    @change="visit(scope.row)"
                    ></el-checkbox
                  >
                </template>
              </el-table-column>
              <!-- 修改列 -->
              <el-table-column align="center" width="200">
                <template slot="header">
                  编辑权
                  <el-checkbox
                    style="margin-left: 4px"
                    v-model="editAll"
                    @change="allEdit()"
                  ></el-checkbox>
                </template>
                <template slot-scope="scope">
                  <el-checkbox
                    v-model="scope.row.permList[1].ownership"
                    @change="edit(scope.row)"
                    ></el-checkbox
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    reportData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      reportForm: {},
      visitAll: false,
      editAll: false
    }
  },
  methods: {
    // 浏览权的全选
    allVisit() {},
    // 浏览的单选
    visit() {},

    // 编辑权的全选
    allEdit() {

    },
    // 编辑的单选
    edit() {

    }
  }
};
</script>

<style lang="scss" scoped>
</style>
