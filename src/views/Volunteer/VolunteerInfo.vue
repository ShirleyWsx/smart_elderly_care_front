<template>
  <div>
      <div style="float: left;">
          <el-input
              placeholder="请输入义工姓名"
              v-model="input"
              clearable
              style="width: 300px; text-align: center;">
          </el-input>
          <el-button icon="el-icon-search" circle style="margin-left: 10px;"
           @click="getInfoByName"></el-button>
      </div>
      <div style="float: right;">
          <el-button type="primary" round @click="openInsertDialog">添加义工</el-button>
      </div>

      <br />
      <br />
      <br />

      <el-table :data="tableData" v-horizontal-scroll="'always'"
                style="width: 100%"
                :default-sort = "{prop: 'volunteerId', order: 'descending'}">
          <el-table-column prop="volunteerId" label="编号" sortable width="180" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="volunteerName" label="姓名" width="80" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="gender" label="性别" width="70" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="phone" label="电话" width="150" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="idCard" label="身份证号" width="180" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="birthday" label="出生日期" width="100" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="checkinDate" label="访问日期" width="100" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="checkoutDate" label="离开日期" width="100" header-align="center" align="center">
          </el-table-column>

          <el-table-column prop="operations" label="操作" header-align="center" align="center">
              <template slot-scope="scope">
                  <el-button type="info" size="small" @click="openDetailDialog(scope.$index, scope.row)">查看</el-button>
                  <el-button type="success" size="small" @click="openModifyDialog(scope.$index, scope.row)">修改</el-button>
                  <el-button type="danger" size="small" @click="deleteInfo(scope.$index, scope.row)">删除</el-button>
              </template>
          </el-table-column>
      </el-table>
      <el-pagination
          @current-change="handleCurrentChange" 
          background
          layout="prev, pager, next"
          :page-size="10"
          :total="totalItems" 
          :pager-count="pageCount">
      </el-pagination>

      <!-- 添加记录对话框 -->
      <el-dialog title="添加义工" :visible.sync="insertDialogFormVisible" width="400px">
          <el-form :model="form">
              <el-form-item label="姓名" :label-width="formLabelWidth">
                  <el-input v-model="form.volunteerName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="性别" :label-width="formLabelWidth">
                  <el-radio v-model="form.gender" label="男">男</el-radio>
                  <el-radio v-model="form.gender" label="女">女</el-radio>
                </el-form-item>
              <el-form-item label="电话" :label-width="formLabelWidth">
                  <el-input v-model="form.phone" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="身份证号" :label-width="formLabelWidth">
                  <el-input v-model="form.idCard" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="出生日期" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.birthday" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" autocomplete="off"></el-date-picker>
                </el-form-item>
              <el-form-item label="访问日期" :label-width="formLabelWidth">
                  <el-date-picker v-model="form.checkinDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" autocomplete="off"></el-date-picker>
              </el-form-item>
              <el-form-item label="离开日期" :label-width="formLabelWidth">
                  <el-date-picker v-model="form.checkoutDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" autocomplete="off"></el-date-picker>
              </el-form-item>
              <el-form-item label="图像目录" :label-width="formLabelWidth">
                    <el-input v-model="form.imgsetDir" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="头像路径" :label-width="formLabelWidth">
                    <el-input v-model="form.profilePhoto" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="上传图像" :label-width="formLabelWidth">
                  <div>
                    <el-upload
                    class="upload-demo"
                    action
                    :http-request="uploadFile"
                    ref="upload"
                    :auto-upload="false"
                    :file-list="fileList"
                    :show-file-list="true"
                    :before-upload="handleBeforeUpload"
                    :on-remove="handleRemove"
                    style="margin-left: 5px; display:inline;font-size:14px;"
                    >
                  <el-button size="medium" type="primary" style="margin-top: 5px;margin-bottom: 5px;">选择文件</el-button>
                  </el-upload>
                  </div>
                </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="insertDialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="insertInfo()">确 定</el-button>
          </div>
      </el-dialog>

      <!-- 编辑记录对话框 -->
      <el-dialog title="编辑信息" :visible.sync="modifyDialogFormVisible" width="400px">
          <el-form :model="form">
            <el-form-item label="编号" :label-width="formLabelWidth">
                  <el-input v-model="form.volunteerId" autocomplete="off" disabled></el-input>
              </el-form-item>
              <el-form-item label="姓名" :label-width="formLabelWidth">
                  <el-input v-model="form.volunteerName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="性别" :label-width="formLabelWidth">
                  <el-radio v-model="form.gender" label="男">男</el-radio>
                  <el-radio v-model="form.gender" label="女">女</el-radio>
                </el-form-item>
              <el-form-item label="电话" :label-width="formLabelWidth">
                  <el-input v-model="form.phone" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="身份证号" :label-width="formLabelWidth">
                  <el-input v-model="form.idCard" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="出生日期" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.birthday" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" autocomplete="off"></el-date-picker>
                </el-form-item>
              <el-form-item label="访问日期" :label-width="formLabelWidth">
                  <el-date-picker v-model="form.checkinDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" autocomplete="off"></el-date-picker>
              </el-form-item>
              <el-form-item label="离开日期" :label-width="formLabelWidth">
                  <el-date-picker v-model="form.checkoutDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" autocomplete="off"></el-date-picker>
              </el-form-item>
              <el-form-item label="图像目录" :label-width="formLabelWidth">
                    <el-input v-model="form.imgsetDir" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="头像路径" :label-width="formLabelWidth">
                    <el-input v-model="form.profilePhoto" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="上传图像" :label-width="formLabelWidth">
                  <div>
                    <el-upload
                    class="upload-demo"
                    action
                    :http-request="uploadFile"
                    ref="uploadModify"
                    :auto-upload="false"
                    :file-list="fileList"
                    :show-file-list="true"
                    :before-upload="handleBeforeUpload"
                    :on-remove="handleRemove"
                    style="margin-left: 5px; display:inline;font-size:14px;"
                    >
                  <el-button size="medium" type="primary" style="margin-top: 5px;margin-bottom: 5px;">选择文件</el-button>
                  </el-upload>
                  </div>
                </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="modifyDialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="modifyInfo()">确 定</el-button>
          </div>
      </el-dialog>

        <!-- 详情对话框 -->
        <el-dialog title="详细信息" :visible.sync="detailDialogFormVisible" width="400px">
          <el-form :model="form">
            <el-form-item label="编号" :label-width="formLabelWidth">
                  <el-input v-model="form.volunteerId" autocomplete="off" readonly></el-input>
              </el-form-item>
              <el-form-item label="姓名" :label-width="formLabelWidth">
                  <el-input v-model="form.volunteerName" autocomplete="off" readonly></el-input>
              </el-form-item>
              <el-form-item label="性别" :label-width="formLabelWidth">
                  <el-input v-model="form.gender" autocomplete="off" readonly></el-input>
              </el-form-item>
              <el-form-item label="电话" :label-width="formLabelWidth">
                  <el-input v-model="form.phone" autocomplete="off" readonly></el-input>
              </el-form-item>
              <el-form-item label="身份证号" :label-width="formLabelWidth">
                  <el-input v-model="form.idCard" autocomplete="off" readonly></el-input>
              </el-form-item>
              <el-form-item label="出生日期" :label-width="formLabelWidth">
                  <el-input v-model="form.birthday" autocomplete="off" readonly></el-input>
              </el-form-item>
              <el-form-item label="访问日期" :label-width="formLabelWidth">
                  <el-input v-model="form.checkinDate" autocomplete="off" readonly></el-input>
              </el-form-item>
              <el-form-item label="离开日期" :label-width="formLabelWidth">
                  <el-input v-model="form.checkoutDate" autocomplete="off" readonly></el-input>
              </el-form-item>
              <el-form-item label="图像目录" :label-width="formLabelWidth">
                    <el-input v-model="form.imgsetDir" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="头像路径" :label-width="formLabelWidth">
                    <el-input v-model="form.profilePhoto" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item label="头像" :label-width="formLabelWidth">
                  <img :src="form.imageUrl" class="avatar">             
                </el-form-item>
            </el-form>
        </el-dialog>

  </div>
</template>

<style>
.el-upload-list__item-name{
  display: none;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .spanname{
    width: 100px;
    height: 30px;
    /* background: blue; */
    position: absolute;
    top: 75px;
    left: 40px;
  }
</style>

<script>
 import axios from 'axios';
export default {
name: 'AlarmEvent',
components: {

},
data () {
  return {
    // 搜索框输入的内容
    input: '',
    tableData: [],
    dialogVisible:false,
    fileList:[],
    imageUrl:'',
    dialogImageUrl:'' , //图片预览路径

    //上传后的文件列表
    fileList: [],
    // 允许的文件类型
    fileType: [ "pdf", "doc", "docx", "xls", "xlsx","txt","png","jpg", "bmp", "jpeg"],
    // 运行上传文件大小，单位 M
    fileSize: 50,
    selectedFile:null,

    //分页
    pageSize:10,  //默认10条
    totalItems:0,
    pageCount:1,

    // 添加对话框
    insertDialogFormVisible: false,
    // 编辑对话框
    modifyDialogFormVisible: false,
    //详情对话框
    detailDialogFormVisible: false,
    modifyId: undefined,

    form: {
      volunteerId: '',
      volunteerName: '',
      gender: '',
      phone: '',
      idCard: '',
      birthday: '',
      checkinDate: '',
      checkoutDate: '',
      imgsetDir:'',
      profilePhoto:'',
      imageUrl:'',
    },
    formLabelWidth: '80px',

    // 区域列表
    allAreas: []
  }
},
created () {
  this.findAll(1)
},
methods: {
  findAll (currentPage) {
    const that = this;
    const gtoken = JSON.parse(localStorage.getItem('token')) 
    const config = {
    params:{
      current:currentPage,
      size:this.pageSize,
      keyword:''
    },
    headers: {
      token:gtoken
        }
      };
    this.$http.get(
      '/volunteer/page',config
    ).then((response) => {
      if (response.status === 401) {
          this.$router.push('/login');
        } else {
      if (response.data.code === 1){
        this.$message({
          type: 'success',
          message: '查询成功'
        });
        that.tableData = response.data.data.records
        that.totalItems = response.data.data.total
        that.pageCount = response.data.data.pages    
      }else{
        this.$message({
          type: 'error',
          message: '查询失败'
        });
      }}  
    }).catch(() => {
        this.$message({
          type: 'info',
          message: '网络问题，查询失败'
        });          
    });
  },

    handleCurrentChange(val) {
        console.log('当前页: '+val);
        this.findAll(val);
      },


  getInfoById (id) {
    const that = this;
    const gtoken = JSON.parse(localStorage.getItem('token')) 
    const config = {
    headers: {
      token:gtoken
        }
      };
    this.$http.get(
      '/volunteer/' + id,config
    ).then((response) => {
      if (response.status === 401) {
          this.$router.push('/login');
        } else {
      if (response.data.code === 1) {
        that.form = response.data.data
        var volunteerId = response.data.data.volunteerId
        that.form.imageUrl = "https://cos-lqyrmk-1312783534.cos.ap-beijing.myqcloud.com/resources/smart_elderly_care/cv_file/profile/volunteer/"+volunteerId+".jpg";
      } else {
        that.form = {}
      }}
    }).catch(() => {
        this.$message({
          type: 'info',
          message: '网络问题，加载失败'
        });          
    });
  },
  getInfoByName () {
    const that = this
    const gtoken = JSON.parse(localStorage.getItem('token')) 
    const config = {
    params:{
      current:'',
      size:'',
      keyword:this.input
    },
    headers: {
      token:gtoken
        }
      };
    if (this.input === '') {
      this.findAll(1)
    } else {
      this.$http.get(
      '/volunteer/page',config
    ).then((response) => {
      if (response.status === 401) {
          this.$router.push('/login');
        } else {
      if (response.data.code === 1){
        this.$message({
          type: 'success',
          message: '查询成功'
        });
        that.tableData = response.data.data.records    
      }else{
        this.$message({
          type: 'error',
          message: '查询失败'
        });
      }}  
    }).catch(() => {
        this.$message({
          type: 'info',
          message: '网络问题，查询失败'
        });          
    });
    }
  },
  openDetailDialog (index, row) {
      this.detailDialogFormVisible = true
      // 回显需要被修改的信息
      this.getInfoById(row.volunteerId)
  },
  openInsertDialog () {
    this.form = {}
    this.insertDialogFormVisible = true
  },
  insertInfo () {
    const that = this;
    const gtoken = JSON.parse(localStorage.getItem('token')) 
    const config = {
    headers: {
      token:gtoken
        }
      };
    this.insertDialogFormVisible = false
    this.$http.post(
      '/volunteer',{
      volunteerName: that.form.volunteerName,
      gender: that.form.gender,
      phone: that.form.phone,
      idCard: that.form.idCard,
      birthday: that.form.birthday,
      checkinDate: that.form.checkinDate,
      checkoutDate: that.form.checkoutDate,
      imgsetDir:that.form.imgsetDir,
      profilePhoto:that.form.profilePhoto
      },
      config
    ).then((response) => {
      if (response.status === 401) {
          this.$router.push('/login');
        } else {
      if (response.data.code === 1){
        this.$message({
          type: 'success',
          message: '添加成功'
        });
        localStorage.setItem("volunteerId", JSON.stringify(response.data.data.volunteerId)) 
        that.$refs.upload.submit()
        this.findAll(1)
      }else{
        this.$message({
          type: 'error',
          message: '添加失败'
        });
      }}    
    }).catch(() => {
        this.$message({
          type: 'info',
          message: '网络问题，添加失败'
        });          
    });
  },
  openModifyDialog (index, row) {
    this.modifyDialogFormVisible = true
    // 回显需要被修改的信息
    this.getInfoById(row.volunteerId)
  },
  modifyInfo () {
    this.modifyDialogFormVisible = false
    const that = this;
    const gtoken = JSON.parse(localStorage.getItem('token')) 
    const config = {
    headers: {
      token:gtoken
        }
      };
    this.$http.put(
      '/volunteer',{
      volunteerId: that.form.volunteerId,
      volunteerName: that.form.volunteerName,
      gender: that.form.gender,
      phone: that.form.phone,
      idCard: that.form.idCard,
      birthday: that.form.birthday,
      checkinDate: that.form.checkinDate,
      checkoutDate: that.form.checkoutDate,
      imgsetDir:that.form.imgsetDir,
      profilePhoto:that.form.profilePhoto
      },
      config
    ).then((response) => {
      if (response.status === 401) {
          this.$router.push('/login');
        } else {
      if (response.data.code === 1){
        this.$message({
          type: 'success',
          message: '修改成功'
        });
        that.$refs.uploadModify.submit()
        localStorage.setItem("volunteerId", JSON.stringify(that.form.volunteerId)) 
        this.findAll(1)
      }else{
        this.$message({
          type: 'error',
          message: '修改失败'
        });
      } }   
    }).catch(() => {
        this.$message({
          type: 'info',
          message: '网络问题，修改失败'
        });          
    });
  },
  deleteInfo (index, row) {
    const gtoken = JSON.parse(localStorage.getItem('token')) 
    const config = {
    headers: {
      token:gtoken
        }
      };
    this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // 发送请求
      this.$http.delete(
        '/volunteer/' + row.volunteerId,config
      ).then((response) => {
        if (response.status === 401) {
          this.$router.push('/login');
        } else {
        if(response.data.code === 1) {
          this.$message({
          type: 'success',
          message: '删除成功!'
        });
        // 发请求重新获取数据
        this.findAll(1)
        }else{
          this.$message({
          type: 'error',
          message: '删除失败'
        });
        }}
      })
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
  },
  handleBeforeUpload(file,fileList) {
  // 获取选择的文件的属性信息
  this.selectedFile = file;
  this.fileList = fileList
    },
//上传文件的事件
  uploadFile(){
    var volunteerId=JSON.parse(localStorage.getItem("volunteerId"))
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('id', volunteerId)
    formData.append('file_type', "volunteer")
    console.log(formData.get('file'));
    axios.post('http://43.143.247.127:8090/api/v1/info/upload', formData)
        .then(response => {
          if (response.status === 401) {
          this.$router.push('/login');
        } else {
          // 处理成功响应
          this.$message({
              type: 'success',
              message: '上传成功'
          });
          console.log("文件上传成功");}
        })
    .catch(error => {
      console.error(error);
      // 处理错误
      });
      localStorage.removeItem("volunteerId")
  },
  handleRemove(file, fileList) {
    // 处理文件被移除的逻辑
    const index = fileList.indexOf(file);
    if (index !== -1) {
      fileList.splice(index, 1); // 移除对应的文件
    }
    }
}
}
</script>
