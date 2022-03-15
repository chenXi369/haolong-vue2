<template>
  <div>
    <el-dialog
      center
      width="800px"
      min-width="24%"
      title="居住人员档案"
      :visible="dialogFormVisible"
      :before-close="handleClose"
    >
      <article>
        <section>
          <el-row :gutter="20" class="left-table">
            <!-- 右侧 -->
            <el-upload
              class="avatar-uploader right-avatar"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="recordData.imageUrl !== ''" :src="recordData.imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <!-- 第一行 -->
            <el-col :span="24" style="display: flex; margin-bottom: 20px">
              <el-col class="table-box" :span="3">姓名</el-col>
              <el-col class="input-box" :span="6">
                <el-input v-model="recordData.name" size="medium" />
              </el-col>

              <el-col class="table-box" :span="3">性别</el-col>
              <el-col class="input-box" :span="5">
                <el-select v-model="recordData.sex" placeholder="请选择">
                  <el-option
                    v-for="item in optionSex"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-col>
            <!-- 第二行 -->
            <el-col :span="24" style="display: flex; margin-bottom: 20px">
              <el-col class="table-box" :span="3">序 号</el-col>
              <el-col class="input-box" :span="6">
                <el-input v-model="recordData.labelNum" size="medium" />
              </el-col>

              <el-col class="table-box" :span="3">婚姻</el-col>
              <el-col :span="5">
                <el-select v-model="recordData.marriage" placeholder="请选择">
                  <el-option
                    v-for="item in optionMarriage"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-col>
            <!-- 新的第三行 -->
            <el-col :span="24" style="display: flex; margin-bottom: 20px">
              <el-col class="table-box" :span="3">证件号</el-col>
              <el-col :span="6">
                <el-input v-model="recordData.idNum" size="medium" />
              </el-col>

              <el-col class="table-box" :span="3">关系</el-col>
              <el-col :span="5">
                <el-input v-model="recordData.relation" size="medium" />
              </el-col>
            </el-col>
            <!-- 第三行 -->
            <el-col :span="24" style="display: flex; margin-bottom: 20px">
              <el-col class="table-box" :span="3">出生日期</el-col>
              <el-col :span="8">
                <el-date-picker
                  v-model="recordData.brithDay"
                  type="date"
                  placeholder="选择日期"
                />
              </el-col>

              <el-col class="table-box" :span="2">邮编</el-col>
              <el-col :span="4">
                <el-input v-model="recordData.postCode" size="medium" />
              </el-col>
            </el-col>
            <!-- 第一行 -->
            <el-col :span="24" style="display: flex; margin-bottom: 20px">
              <el-col class="table-box" :span="3">联系电话</el-col>
              <el-col :span="9">
                <el-input v-model="recordData.phone" />
              </el-col>

              <el-col class="table-box" :span="3">电子邮件</el-col>
              <el-col :span="9">
                <el-input v-model="recordData.eMail" />
              </el-col>
            </el-col>
            <!-- 第二行 -->
            <el-col :span="24" style="display: flex; margin-bottom: 20px">
              <el-col class="table-box" :span="3">通讯地址</el-col>
              <el-col :span="13">
                <el-input v-model="recordData.mailAddress" size="medium" />
              </el-col>

              <el-col class="table-box" :span="2">民族</el-col>
              <el-col :span="6">
                <el-select v-model="recordData.nation" placeholder="请选择">
                  <el-option
                    v-for="item in optionsNation"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-col>
            <!-- 第四行 -->
            <el-col :span="24" style="display: flex; margin-bottom: 20px">
              <el-col class="table-box" :span="3">证件地址</el-col>
              <el-col :span="13">
                <el-input v-model="recordData.idAddress" size="medium" />
              </el-col>

              <el-col class="table-box" :span="2">籍贯</el-col>
              <el-col :span="6">
                <el-select v-model="recordData.origon" placeholder="请选择">
                  <el-option
                    v-for="item in optionsOrigon"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-col>
            <!-- 第五行 -->
            <el-col :span="24" style="display: flex; margin-bottom: 20px">
              <el-col class="table-box" :span="3">工作地址</el-col>
              <el-col :span="13">
                <el-input v-model="recordData.workAddress" size="medium" />
              </el-col>

              <el-col class="table-box" :span="2">国籍</el-col>
              <el-col :span="6">
                <el-select v-model="recordData.nationality" placeholder="请选择">
                  <el-option
                    v-for="item in optionsCountry"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-col>
          </el-row>
          <!-- 第二行 -->
          <el-row :gutter="20" style="display: flex; margin-bottom: 20px">
            <el-col :span="24">
              <!-- <el-col class="table-box" :span="3">暂住信息</el-col>
              <el-col :span="3">
                <el-input></el-input>
              </el-col> -->

              <el-col class="table-box" :span="3">暂住证号码</el-col>
              <el-col :span="6.5">
                <el-input v-model="recordData.shackNum" />
              </el-col>

              <el-col class="table-box" :span="2.5">有效期</el-col>
              <el-col :span="12">
                <el-date-picker
                  v-model="recordData.validityOne"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-col>
            </el-col>
          </el-row>
          <!-- 第三行 -->
          <el-row :gutter="20" style="display: flex; margin-bottom: 20px">
            <el-col :span="24">
              <el-col class="table-box" :span="3">出入证号</el-col>
              <el-col :span="6.5">
                <el-input v-model="recordData.inOutNum" />
              </el-col>
              <el-col class="table-box" :span="2.5">有效期</el-col>
              <el-col :span="12">
                <el-date-picker
                  v-model="recordData.validityTwo"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-col>
            </el-col>
          </el-row>
          <!-- 第四行 -->
          <el-row :gutter="20" style="display: flex; margin-bottom: 20px">
            <el-col :span="24">
              <el-col :span="3" class="textarea-box">备 注</el-col>
              <el-col :span="21">
                <el-input v-model="recordData.sign" type="textarea" />
              </el-col>
            </el-col>
          </el-row>
        </section>
      </article>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    recordData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formLabelWidth: '120px',
      optionMarriage: [
        {
          value: '已婚',
          label: '已婚'
        },
        {
          value: '未婚',
          label: '未婚'
        },
        {
          value: '离异',
          label: '离异'
        }
      ],
      optionSex: [
        {
          value: '男',
          label: '男'
        },
        {
          value: '女',
          label: '女'
        }
      ],
      optionsNation: [
        {
          value: '汉族',
          label: '汉族'
        },
        {
          value: '回族',
          label: '回族'
        },
        {
          value: '维吾尔族',
          label: '维吾尔族'
        },
        {
          value: '白族',
          label: '白族'
        }
      ],
      optionsOrigon: [
        {
          value: '广东',
          label: '广东省'
        },
        {
          value: '河南',
          label: '河南省'
        },
        {
          value: '湖南',
          label: '湖南省'
        }
      ],
      optionsCountry: [
        {
          value: 'China',
          label: '中国'
        },
        {
          value: 'USA',
          label: '美国'
        }
      ]
    }
  },
  methods: {
    confirm() {
      this.$emit('closeDialog', false)
    },
    cancel() {
      this.$emit('closeDialog', false)
    },
    handleClose() {
      this.$emit('closeDialog', false)
    },
    handleAvatarSuccess(res, file) {
      this.recordData.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG || !isPNG) {
        this.$message.error('上传头像图片只能是 JPG和PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
.left-table {
  position: relative;
  .flex-5 {
    width: 100px;
    display: inline-block;
  }
  .flex-4 {
    width: 80px;
    display: inline-block;
  }
  .flex-3 {
    width: 60px;
    display: inline-block;
  }
  .flex-2 {
    width: 40px;
  }
  .table-box {
    height: 36px;
    line-height: 36px;
    text-align: center;
    border-radius: 4px;
    border-right: 0px;
    display: inline-block;
    border: 1px solid #dcdfe6;
  }
}
.right-avatar {
  position: absolute;
  right: 20px;
  top: 0;
}
.table-box {
  height: 36px;
  line-height: 36px;
  text-align: center;
  border-radius: 4px;
  border-right: 0px;
  display: inline-block;
  border: 1px solid #dcdfe6;
}
.textarea-box {
  height: 54px;
  line-height: 54px;
  text-align: center;
  border-radius: 4px;
  border-right: 0px;
  display: inline-block;
  border: 1px solid #dcdfe6;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 50px;
  color: #c0c0c0;
  width: 174px;
  height: 202px;
  line-height: 202px;
  text-align: center;
}
.avatar {
  width: 174px;
  height: 202px;
  display: inline-block;
}
</style>
