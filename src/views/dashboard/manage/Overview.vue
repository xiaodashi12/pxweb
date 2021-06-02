<template>
    <CustomLayout >
    <div class="custom-body">
      <div>
        <CommonTitle title="概览"></CommonTitle>
      </div>
      <div class="custom-tools">
        <div class="table-head">
          <div class="custom-tools__info">基础信息</div>
          <el-button type="primary" icon="el-icon-plus" size="mini"
                     @click="handleChange">修改</el-button>
        </div>
        
        <div class="custom-tools__content">
          <el-form :model="form"
                 :inline="true"
                 @submit.native.prevent=""
                 class="table-form bg-gray"
                 label-width="130px">
          <el-row>
            <el-form-item label="网关名称：">
              Pixiu
              <!-- <el-input v-model="form.title"
                        clearable
                        placeholder="请输入"></el-input> -->
            </el-form-item>
            <el-form-item label="网关描述：">
              Pixiu
              <!-- <el-input v-model="form.title"
                        clearable
                        placeholder="请输入"></el-input> -->
            </el-form-item>
          </el-row>
        </el-form>
        </div>
      </div>
      <div class="table-head">
        <div class="custom-tools__info">映射服务</div>
        <el-button type="primary" icon="el-icon-plus" size="mini"
                     @click="handleAdd">新增</el-button>
      </div>
      <div class="custom-panel">
        <el-table v-loading="loading"
                  size="normal"
                  :data="tableData"
                  :empty-text="emptText"
                  row-class-name="custom-table-tr--hover"
                  header-row-class-name="custom-table-header"
                  @selection-change="handleSelectionChange"
                  style="width: 100%">
          <el-table-column 
                           prop=""
                           label="映射服务">
            
          </el-table-column>
          <el-table-column prop="path"
                           label="路径">
          </el-table-column>
          <el-table-column 
                           prop="type"
                           label="类型">
          </el-table-column>
          <el-table-column
                           prop="description"
                           label="描述">
          </el-table-column>
          <el-table-column
                           label="操作">
            <template slot-scope="scope">

              <el-button type="text"
                         @click="handleLook(scope.row)">查看</el-button>
              <el-button type="text" class="dltbtn"
                         @click="deleteRow(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="custom-pagination"
             style="float:right">
          
          <div style="display: flex;">
            <div>
              总共<span>{{ pagination.total }}</span>条记录<i class="custom-pagination__interval"></i>每页显示
              <el-select v-model="pagination.pageSize"
                         placeholder="请选择"
                         style="width:70px;">
                <el-option v-for="item in pagination.pageSizes"
                           :key="item"
                           :label="item"
                           :value="item">
                </el-option>
              </el-select>
              条记录
            </div>
            <el-pagination :current-page.sync="pagination.pageIndex"
                           :page-size.sync="pagination.pageSize"
                           layout="prev, pager, next"
                           :total="pagination.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
                title="新增"
                :visible.sync="dialogVisible"
                v-if="dialogVisible"
                width="640px"
                :before-close="handleClose">
            <div class="dialog_main">
                <el-row :gutter="22">
                    <el-col :span="12">
                        <div class="dialog_item">
                            <div class="item_label"> 路径：</div>
                            <div class="item_value" style="width:100%;">
                                <el-input
                                        size="small"
                                        placeholder="路径"
                                        v-model="chooseRow.path"
                                        clearable>
                                </el-input>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="dialog_item">
                            <div class="item_label">类型：</div>
                            <div class="item_value" style="width:100%;">
                                <el-input
                                        size="small"
                                        placeholder="类型"
                                        v-model="chooseRow.type"
                                        clearable>
                                </el-input>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="22">
                    <el-col :span="12">
                        <div class="dialog_item">
                            <div class="item_label"> 描述：</div>
                            <div class="item_value" style="width:100%;">
                                <el-input
                                        size="small"
                                        placeholder="描述"
                                        v-model="chooseRow.description"
                                        clearable>
                                </el-input>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="dialog_item">
                            <div class="item_label">超时：</div>
                            <div class="item_value" style="width:100%;">
                                <el-input
                                        size="small"
                                        placeholder="超时"
                                        v-model="chooseRow.timeout"
                                        clearable>
                                </el-input>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="handleClose">取 消</el-button>
                <el-button type="primary"  size="mini" @click="makeSure">确 定</el-button>
            </span>
        </el-dialog>
  </CustomLayout>
</template>

<script>
import CommonTitle from '@/components/common/CommonTitle'
import CustomLayout from '@/components/common/CustomLayout.vue'
export default {
  name: '',
  components:{
    CommonTitle,
    CustomLayout
  },
  data () {
    return {
      form:{

      },
      dialogVisible:false,
      chooseRow:{
        timeout:'',
        description:'',
        type:'',
        path:''
      },
      pagination: { // 分页字段
        pageIndex: 1, // 当前页
        pageSize: 20, // 每页显示多少条
        total: 0, // 总条数
        pageSizes: [20, 50, 100]
      },
      tableData: [], // table列表数据
      loading: false,
      tableHeight: window.document.documentElement.clientHeight - 248, // table高度
      multipleSelection: [], // 多选时，已选项
      currentRow: {}, // 当前选中行
      areaDialogVisible: false, // 是否显示行政区划弹窗
      emptText: '暂无数据', // table数据为空的提示语
      isSizeInit: false, // 是否是页面初始化时设置的PageSize
      previewDialogVisible: false, // 是否显示行政区划弹窗
      currentTemplate: {},//当前选中的模板
    }
  },
  created() {
    //获取基础信息
    this.init()
    //获取 Resource 列表
    this.getResourceList()
    //获取 Resource 详情
    this.getResourceDetail()
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
    },
    getResourceDetail() {
      this.$get('/config/api/resource/detail', {
        resourceId: 1
      })
        .then((res) => {
          if (res.code == 10001) {
              let data = JSON.parse(res.data)
              console.log(data)
          } else {
            
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //映射服务列表
    getResourceList() {
      this.$get('/config/api/resource/list')
        .then((res) => {
          if (res.code == 10001) {
             this.tableData = JSON.parse(res.data)
          } else {
            
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
     //获取基础信息
    init() {  
      this.$get('/config/api/base')
        .then((res) => {
          if (res.code == 10001) {
            //  console.log(JSON.parse(res.data))
          } else {
            
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //修改用户信息
    handleChange() {
      let formData = new FormData();
      formData.append('name','pixiu');
      formData.append('description','pixiu111');
      this.$post('/config/api/base', formData)
        .then((res) => {
          if (res.code == 10001) {
            console.log(res)
          } else {
            
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    makeSure() {
      let formData = new FormData();
      formData.append('path', this.chooseRow.path);
      formData.append('type', this.chooseRow.type);
      formData.append('description', this.chooseRow.description);
      formData.append('timeout', this.chooseRow.timeout);
      let obj = {
        pre:{
          pluginNames:['rate limit', 'access']
        },
        post:{
          groupNames:['group2']
        }
          
      }
      formData.append('plugins', JSON.stringify(obj));
      let mobj = []
      formData.append('methods', null);
      this.$post('/config/api/resource', formData)
        .then((res) => {
          if (res.code == 10001) {
            this.dialogVisible = false
            this.getResourceList()
            console.log(res)
          } else {
            
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //删除
    deleteRow() {
      this.$post('/config/api/resource', {
        resourceId: 2
      })
        .then((res) => {
          if (res.code == 10001) {
            this.$message({
              type: 'success',
              message: '删除成功！',
            })
            this.getResourceList()
            console.log(res)
          } else {
            
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //新增
    handleAdd() {
      this.dialogVisible = true
      
    }
  }
}
</script>


<style scoped lang="less">
.custom-panel{
  margin-top: 20px;
}
.dltbtn{
  color: red;
}
.custom-tools__info{
  color: rgba(16, 16, 16, 100);
  font-size: 18px;
  text-align: left;
  margin-top: 10px;
}
.custom-tools__content{
  background-color: #fff;
  margin-top: 10px;
  padding: 10px 20px;
}
.table-head{
  display: flex;
  margin-top: 10px;
  justify-content: space-between;
}
.dialog_main {
    display: flex;
    flex-wrap: wrap;

    .dialog_item {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .item_label {
        min-width: 60px;
    }
}
</style>
