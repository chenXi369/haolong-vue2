<template>
  <div>
    <el-popover
      v-model="visible"
      placement="bottom"
      width="450"
      trigger="click"
    >
      <el-form :inline="true" :model="searchContent" size="mini" class="demo-form-inline">
        <!-- 搜索条件一 -->
        <el-form-item label="" style="position: relative">
          <el-select
            v-model="searchContent.selectConditOne"
            clearable
            placeholder="请选择"
            style="width: 120px"
            @change="selectOneVal"
          >
            <el-option
              v-for="(item, index) in selectOptions"
              :key="item.no"
              :label="item.fld"
              :value="index"
              :disabled="item.disabled"
            />
          </el-select>
          <el-select
            v-model="searchContent.selectOne"
            :disabled="searchContent.selectConditOne === ''"
            placeholder="比较"
            style="width: 80px; margin: 0 5px"
          >
            <el-option
              v-for="item in symbolData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <span>
            <el-select
              v-if="inputTypeOne === 'select'"
              v-model="searchContent.selectContentOne"
              filterable
              :disabled="searchContent.selectOne === ''"
              placeholder="请选择"
              style="width: 140px"
            >
              <el-option
                v-for="item in selectOneList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <el-input
              v-else-if="inputTypeOne === 'string' || 'number'"
              v-model="searchContent.selectContentOne"
              :disabled="searchContent.selectOne === ''"
              placeholder="请输入"
              style="width: 140px"
              @input="handleOneClick"
            />
          </span>

          <span
            class="radio"
            :class="{ 'active-radio': searchContent.selectConditOne === '' }"
          >
            <el-radio
              v-model="radioOne"
              label="1"
              :disabled="searchContent.selectConditOne === ''"
            >与</el-radio>
            <el-radio
              v-model="radioOne"
              label="0"
              :disabled="searchContent.selectConditOne === ''"
            >或</el-radio>
          </span>
        </el-form-item>

        <!-- 搜索条件二 -->
        <el-form-item label="" style="position: relative">
          <el-select
            v-model="searchContent.selectConditTwo"
            clearable
            :disabled="searchContent.selectConditOne === ''"
            placeholder="请选择"
            style="width: 120px"
            @change="selectTwoVal"
          >
            <el-option
              v-for="(item, index) in selectOptions"
              :key="item.no"
              :label="item.fld"
              :value="index"
              :disabled="item.disabled"
            />
          </el-select>
          <el-select
            v-model="searchContent.selectTwo"
            :disabled="searchContent.selectConditTwo === ''"
            placeholder="比较"
            style="width: 80px; margin: 0 5px"
          >
            <el-option
              v-for="item in symbolData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <span>
            <el-select
              v-if="inputTypeTwo === 'select'"
              v-model="searchContent.selectContentTwo"
              filterable
              :disabled="searchContent.selectTwo === ''"
              placeholder="请选择"
              style="width: 140px"
            >
              <el-option
                v-for="item in selectTwoList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <el-input
              v-else-if="inputTypeTwo === 'string' || 'number'"
              v-model="searchContent.selectContentTwo"
              :disabled="searchContent.selectTwo === ''"
              placeholder="请输入"
              style="width: 140px"
              @input="handleOneClick"
            />
          </span>

          <span
            class="radio"
            :class="{ 'active-radio': searchContent.selectConditTwo === '' }"
          >
            <el-radio
              v-model="radioTwo"
              label="1"
              :disabled="searchContent.selectConditTwo === ''"
            >与</el-radio>
            <el-radio
              v-model="radioTwo"
              label="0"
              :disabled="searchContent.selectConditTwo === ''"
            >或</el-radio>
          </span>
        </el-form-item>

        <!-- 搜索条件三 -->
        <el-form-item label="" style="position: relative">
          <el-select
            v-model="searchContent.selectConditThree"
            clearable
            :disabled="searchContent.selectConditTwo === ''"
            placeholder="请选择"
            style="width: 120px"
            @change="selectThreeVal"
          >
            <el-option
              v-for="(item, index) in selectOptions"
              :key="item.no"
              :label="item.fld"
              :value="index"
              :disabled="item.disabled"
            />
          </el-select>
          <el-select
            v-model="searchContent.selectThree"
            :disabled="searchContent.selectConditThree === ''"
            placeholder="比较"
            style="width: 80px; margin: 0 5px"
          >
            <el-option
              v-for="item in symbolData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <span>
            <el-select
              v-if="inputTypeThree === 'select'"
              v-model="searchContent.selectContentThree"
              filterable
              :disabled="searchContent.selectThree === ''"
              placeholder="请选择"
              style="width: 140px"
            >
              <el-option
                v-for="item in selectThreeList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <el-input
              v-else-if="inputTypeThree === 'string' || 'number'"
              v-model="searchContent.selectContentThree"
              :disabled="searchContent.selectThree === ''"
              placeholder="请输入"
              style="width: 140px"
              @input="handleOneClick"
            />
          </span>

          <span
            class="radio"
            :class="{ 'active-radio': searchContent.selectConditThree === '' }"
          >
            <el-radio
              v-model="radioThree"
              label="1"
              :disabled="searchContent.selectConditThree === ''"
            >与</el-radio>
            <el-radio
              v-model="radioThree"
              label="0"
              :disabled="searchContent.selectConditThree === ''"
            >或</el-radio>
          </span>
        </el-form-item>

        <!-- 搜索条件四 -->
        <el-form-item label="" style="position: relative">
          <el-select
            v-model="searchContent.selectConditFour"
            clearable
            :disabled="searchContent.selectConditThree === ''"
            placeholder="请选择"
            style="width: 120px"
            @change="selectFourVal"
          >
            <el-option
              v-for="(item, index) in selectOptions"
              :key="item.no"
              :label="item.fld"
              :value="index"
              :disabled="item.disabled"
            />
          </el-select>
          <el-select
            v-model="searchContent.selectFour"
            :disabled="searchContent.selectConditFour === ''"
            placeholder="比较"
            style="width: 80px; margin: 0 5px"
          >
            <el-option
              v-for="item in symbolData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <span>
            <el-select
              v-if="inputTypeFour === 'select'"
              v-model="searchContent.selectContentFour"
              filterable
              :disabled="searchContent.selectFour === ''"
              placeholder="请选择"
              style="width: 140px"
            >
              <el-option
                v-for="item in selectFourList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <el-input
              v-else-if="inputTypeFour === 'string' || 'number'"
              v-model="searchContent.selectContentFour"
              :disabled="searchContent.selectFour === ''"
              placeholder="请输入"
              style="width: 140px"
              @input="handleOneClick"
            />
          </span>
          <span
            class="radio"
            :class="{ 'active-radio': searchContent.selectConditFour === '' }"
          >
            <el-radio
              v-model="radioFour"
              label="1"
              :disabled="searchContent.selectConditFour === ''"
            >与</el-radio>
            <el-radio
              v-model="radioFour"
              label="0"
              :disabled="searchContent.selectConditFour === ''"
            >或</el-radio>
          </span>
        </el-form-item>

        <!-- 搜索条件五 -->
        <el-form-item label="" style="position: relative">
          <el-select
            v-model="searchContent.selectConditFive"
            clearable
            :disabled="searchContent.selectConditFour === ''"
            placeholder="请选择"
            style="width: 120px"
            @change="selectFiveVal"
          >
            <el-option
              v-for="(item, index) in selectOptions"
              :key="item.no"
              :label="item.fld"
              :value="index"
              :disabled="item.disabled"
            />
          </el-select>
          <el-select
            v-model="searchContent.selectFive"
            :disabled="searchContent.selectConditFive === ''"
            placeholder="比较"
            style="width: 80px; margin: 0 5px"
          >
            <el-option
              v-for="item in symbolData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <span>
            <el-select
              v-if="inputTypeFive === 'select'"
              v-model="searchContent.selectContentFive"
              filterable
              :disabled="searchContent.selectFive === ''"
              placeholder="请选择"
              style="width: 140px"
            >
              <el-option
                v-for="item in selectFiveList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <el-input
              v-else-if="inputTypeFive === 'string' || 'number'"
              v-model="searchContent.selectContentFive"
              :disabled="searchContent.selectFive === ''"
              placeholder="请输入"
              style="width: 140px"
              @input="handleOneClick"
            />
          </span>
        </el-form-item>
        <div style="text-align: right; margin: 0">
          <el-button
            type="primary"
            size="mini"
            class="btn-box"
            @click="search"
          >确认</el-button>
          <el-button
            size="mini"
            class="btn-box"
            @click="cancel"
          >取消</el-button>
        </div>
      </el-form>

      <el-button
        slot="reference"
        size="mini"
        @click="openPopover"
      >查询 <svg-icon icon-class="search" /></el-button>
    </el-popover>
  </div>
</template>

<script>
import { queryGet } from '@/api/system/systemData'
export default {
  props: {
    keyword: {
      type: String,
      default: ''
    },
    queryTerms: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      searchContent: {
        // 搜索的条件
        selectConditOne: '',
        selectConditTwo: '',
        selectConditThree: '',
        selectConditFour: '',
        selectConditFive: '',

        selectOne: '',
        selectTwo: '',
        selectThree: '',
        selectFour: '',
        selectFive: '',

        selectContentOne: '',
        selectContentTwo: '',
        selectContentThree: '',
        selectContentFour: '',
        selectContentFive: ''
      },

      selectedOneData: [],
      selectedTwoData: [
        { label: '男', value: 0 },
        { label: '女', value: 1 }
      ],
      selectedThreeData: [],
      selectedFourData: [],
      selectedFiveData: [],

      selectOptions: [],
      conditTwoList: [],
      conditThreeList: [],
      conditFourList: [],
      conditFiveList: [],

      symbolData: [
        { label: '包含', value: 'like' },
        { label: '=', value: '=' },
        { label: '<>', value: '<>' },
        { label: '>', value: '>' },
        { label: '>=', value: '>=' },
        { label: '<', value: '<' },
        { label: '<=', value: '<=' }
      ],
      // 连接符或与
      radioOne: '1',
      radioTwo: '1',
      radioThree: '1',
      radioFour: '1',
      radioFive: '1',

      inputTypeOne: '',
      inputTypeTwo: '',
      inputTypeThree: '',
      inputTypeFour: '',
      inputTypeFive: '',

      selectOneList: [],
      selectTwoList: [],
      selectThreeList: [],
      selectFourList: [],
      selectFiveList: []
    }
  },
  methods: {
    cancel() {
      this.visible = false
    },
    search() {
      let conditeOne = ''; let conditeTwo = ''; let conditeThree = ''; let conditeFour = ''; let conditeFive = ''
      if (this.searchContent.selectConditOne !== '') {
        conditeOne = this.selectOptions[this.searchContent.selectConditOne].fld
      }
      if (this.searchContent.selectConditTwo !== '') {
        conditeTwo = this.selectOptions[this.searchContent.selectConditTwo].fld
      }
      if (this.searchContent.selectConditThree !== '') {
        conditeThree = this.selectOptions[this.searchContent.selectConditThree].fld
      }
      if (this.searchContent.selectConditFour !== '') {
        conditeFour = this.selectOptions[this.searchContent.selectConditFour].fld
      }
      if (this.searchContent.selectConditFive !== '') {
        conditeFive = this.selectOptions[this.searchContent.selectConditFive].fld
      }

      const oneStep = `${conditeOne}${this.searchContent.selectOne}${this.searchContent.selectContentOne === '' ? '' : `'${this.searchContent.selectContentOne}'`}`
      const twoStep = `${conditeTwo}${this.searchContent.selectTwo}${this.searchContent.selectContentTwo === '' ? '' : `'${this.searchContent.selectContentTwo}'`}`
      const threeStep = `${conditeThree}${this.searchContent.selectThree}${this.searchContent.selectContentThree === '' ? '' : `'${this.searchContent.selectContentThree}'`}`
      const fourStep = `${conditeFour}${this.searchContent.selectFour}${this.searchContent.selectContentFour === '' ? '' : `'${this.searchContent.selectContentFour}'`}`
      const fiveStep = `${conditeFive}${this.searchContent.selectFive}${this.searchContent.selectContentFive === '' ? '' : `'${this.searchContent.selectContentFive}'`}`
      // console.log(oneStep, twoStep, threeStep, fourStep, fiveStep)
      let relateOne = 'and'
      let relateTwo = 'and'
      let relateThree = 'and'
      let relateFour = 'and'
      if (this.radioOne === '0') {
        relateOne = 'or'
      }
      if (this.radioTwo === '0') {
        relateTwo = 'or'
      }
      if (this.radioThree === '0') {
        relateThree = 'or'
      }
      if (this.radioFour === '0') {
        relateFour = 'or'
      }
      if(this.searchContent.selectContentTwo === '') {
        relateOne = ''
      }
      if(this.searchContent.selectContentThree === '') {
        relateTwo = ''
      }
      if(this.searchContent.selectContentFour === '') {
        relateThree = ''
      }
      if(this.searchContent.selectContentFive === '') {
        relateFour = ''
      }
      var total = this.searchContent.selectContentOne === '' ? '' : ' and ' +
        `${oneStep} ${relateOne} ${twoStep} ${relateTwo} ${threeStep} ${relateThree} ${fourStep} ${relateFour} ${fiveStep}`
      this.$emit('searchBtn', total)
      this.visible = false
    },
    onSubmit() {
      console.log('submit!')
    },
    selectOneVal(one) {
      console.log(one)
      if (this.searchContent.selectConditOne !== '') {
        console.log(this.selectOptions)
        const conditionOne = this.selectOptions[one].optionalValues
        const conditionTwo = this.selectOptions[one].type
        if (conditionOne.length > 0) {
          this.inputTypeOne = 'select'
          this.selectOneList = conditionOne
        } else {
          switch (conditionTwo) {
            case 0:
              this.inputTypeOne = 'string'
              break
            case 1:
              this.inputTypeOne = 'boolean'
              break
            case 3:
              this.inputTypeOne = 'number'
              break
            case 7:
              this.inputTypeOne = 'parseFloat'
              break
            case 8:
              this.inputTypeOne = 'date'
              break
          }
        }
      } else {
        this.searchContent.selectOne = ''
        this.searchContent.selectContentOne = ''
      }
    },
    selectTwoVal(two) {
      if (this.searchContent.selectConditTwo !== '') {
        const conditionOne = this.selectOptions[two].optionalValues
        const conditionTwo = this.selectOptions[two].type
        if (conditionOne.length > 0) {
          this.inputTypeTwo = 'select'
          this.selectTwoList = conditionOne
        } else {
          switch (conditionTwo) {
            case 0:
              this.inputTypeTwo = 'string'
              break
            case 1:
              this.inputTypeTwo = 'boolean'
              break
            case 3:
              this.inputTypeTwo = 'number'
              break
            case 7:
              this.inputTypeTwo = 'parseFloat'
              break
            case 8:
              this.inputTypeTwo = 'date'
              break
          }
        }
      } else {
        this.searchContent.selectTwo = ''
        this.searchContent.selectContentTwo = ''
      }
    },
    selectThreeVal(three) {
      if (this.searchContent.selectConditThree !== '') {
        console.log(this.selectOptions[three])
        const conditionOne = this.selectOptions[three].optionalValues
        const conditionTwo = this.selectOptions[three].type
        if (conditionOne.length > 0) {
          this.inputTypeThree = 'select'
          this.selectThreeList = conditionOne
        } else {
          switch (conditionTwo) {
            case 0:
              this.inputTypeThree = 'string'
              break
            case 1:
              this.inputTypeThree = 'boolean'
              break
            case 3:
              this.inputTypeThree = 'number'
              break
            case 7:
              this.inputTypeThree = 'parseFloat'
              break
            case 8:
              this.inputTypeThree = 'date'
              break
          }
        }
      } else {
        this.searchContent.selectThree = ''
        this.searchContent.selectContentThree = ''
      }
    },
    selectFourVal(four) {
      if (this.searchContent.selectConditFour !== '') {
        console.log(this.selectOptions[four])
        const conditionOne = this.selectOptions[four].optionalValues
        const conditionTwo = this.selectOptions[four].type
        if (conditionOne.length > 0) {
          this.inputTypeFour = 'select'
          this.selectFourList = conditionOne
        } else {
          switch (conditionTwo) {
            case 0:
              this.inputTypeFour = 'string'
              break
            case 1:
              this.inputTypeFour = 'boolean'
              break
            case 3:
              this.inputTypeFour = 'number'
              break
            case 7:
              this.inputTypeFour = 'parseFloat'
              break
            case 8:
              this.inputTypeFour = 'date'
              break
          }
        }
      } else {
        this.searchContent.selectFour = ''
        this.searchContent.selectContentFour = ''
      }
    },
    selectFiveVal(five) {
      if (this.searchContent.selectConditFive !== '') {
        console.log(this.selectOptions[five])
        const conditionOne = this.selectOptions[five].optionalValues
        const conditionTwo = this.selectOptions[five].type
        if (conditionOne.length > 0) {
          this.inputTypeFive = 'select'
          this.selectFiveList = conditionOne
        } else {
          switch (conditionTwo) {
            case 0:
              this.inputTypeFive = 'string'
              break
            case 1:
              this.inputTypeFive = 'boolean'
              break
            case 3:
              this.inputTypeFive = 'number'
              break
            case 7:
              this.inputTypeFive = 'parseFloat'
              break
            case 8:
              this.inputTypeFive = 'date'
              break
          }
        }
      } else {
        this.searchContent.selectFive = ''
        this.searchContent.selectContentFive = ''
      }
    },
    handleOneClick() {
      this.searchContent.selectContentOne = this.searchContent.selectContentOne.replace(
        /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\.%.@.#.&.*]/g,
        ''
      )
    },
    handleFourClick() {
      if (!this.searchContent.selectContentFour.match(/^((?!0)\d{1,2}|150)$/)) {
        this.$message({
          showClose: true,
          message: '请输入正确的年龄',
          type: 'warning'
        })
        this.searchContent.selectContentFour = ''
      }
    },
    openPopover() {
      queryGet({ keyword: this.keyword, queryTerms: this.queryTerms }).then(
        (res) => {
          if(this.keyword === '房屋情况') {
            let newArr  = [...res.data].filter(item => {
              if(['结构', '朝向', '备注'].includes(item.fld)) {
                item.disabled = true
                return item
              } else {
                return item
              }
            })
            this.selectOptions = newArr
            console.log(this.selectOptions)
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.radio {
  width: 64px;
  height: 36px;
  padding: 1.5px 12px;
  border: 1px solid #dfe4ed;
  border-radius: 4px;
  color: #c0c4cc;
  position: absolute;
  left: 360px;
  top: 0;
  display: flex;
  flex-direction: column;
}
.active-radio {
  background: #f5f7fa;
}
</style>
