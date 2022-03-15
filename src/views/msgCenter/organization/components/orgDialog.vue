<template>
  <!-- 添加或修改部门对话框 -->
  <el-dialog
    :title="title"
    :visible.sync="open"
    width="700px"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form
      ref="form"
      :model="form"
      :rules="!disabled ? rules : {}"
      label-width="90px"
      :disabled="disabled"
    >
      <el-row v-if="form.parentId !== 0">
        <el-col :span="24">
          <el-form-item label="上级部门" prop="parentId">
            <treeselect
              :disabled="disabled"
              v-model="form.parentId"
              :options="deptOptions"
              placeholder="选择上级部门"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称" prop="orgName">
            <el-input v-model="form.orgName" placeholder="请输入部门名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="级别" prop="groupType">
            <el-select
              v-model="form.groupType"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in selectState"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮编" prop="postcode">
            <el-input v-model="form.postcode" placeholder="请输入邮编" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话" prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="请输入电话"
              maxlength="11"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编号" prop="orgId">
            <el-input v-model="form.orgId" placeholder="请输入编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="5" v-model="form.remark" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-else>
        <el-col :span="8">
          <el-form-item label="编号" prop="email">
            <el-input v-model="form.email" placeholder="请输入集团编号" />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="名称" prop="email">
            <el-input
              v-model="form.email"
              placeholder="请输入集团名称"
              maxlength="50"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="地址" prop="email">
            <el-input v-model="form.email" placeholder="请输入集团地址" />
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="营业执照号" prop="email">
            <el-input v-model="form.email" placeholder="请输入集团营业执照号" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="法人" prop="email">
            <el-input v-model="form.email" placeholder="请输入集团公司法人" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话" prop="email">
            <el-input v-model="form.email" placeholder="请输入集团公司电话" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="传真" prop="email">
            <el-input v-model="form.email" placeholder="请输入集团公司传真号" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="form.remark" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="!disabled">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
    <div slot="footer" class="dialog-footer" v-else>
      <el-button @click="cancel">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {};
</script>

<style>
</style>