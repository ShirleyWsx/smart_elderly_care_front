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
                  :default-sort = "{prop: 'user_id', order: 'descending'}">
                  <el-table-column prop="name" label="姓名" sortable width="120" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="phone" label="电话" sortable width="100" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="gender" label="性别" width="60" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="date" label="入园日期" width="100" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="IDcard" label="身份证号" width="120" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="age" label="年龄" width="100" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="area_name" label="管理区域" sortable width="100" header-align="center" align="center">
            </el-table-column>
            <el-table-column prop="status" label="身份" :formatter="statusFormatter" sortable width="90" header-align="center" align="center">
                <!-- <template slot-scope="scope">
                    {{scope.row.status == 1 ? '超级管理员' : '普通管理员'}}
                </template> -->
            </el-table-column>
            <el-table-column prop="operations" label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                    <el-button type="success" size="small" @click="openModifyDialog(scope.$index, scope.row)">修改</el-button>
                    <el-button type="danger" size="small" @click="deleteInfo(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="prev, pager, next"
            :total="1000">
        </el-pagination>

        <!-- 添加记录对话框 -->
        <el-dialog title="添加义工" :visible.sync="insertDialogFormVisible" width="400px">
            <el-form :model="form">
              <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="form.phone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth">
                    <el-input v-model="form.gender" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="入园日期" :label-width="formLabelWidth">
                    <el-input v-model="form.date" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" :label-width="formLabelWidth">
                    <el-input v-model="form.IDcard" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="年龄" :label-width="formLabelWidth">
                    <el-input v-model="form.age" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="管理区域" :label-width="formLabelWidth">
                    <el-select v-model="form.area_id" placeholder="请选择该管理员的管理区域"
                     @visible-change="findAllAreas" style="width: 280px">
                        <el-option v-for="area in this.allAreas" :key="area"
                         :label=area.area_name :value=area.area_id></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="身份" :label-width="formLabelWidth">
                    <el-select v-model="form.status" placeholder="请选择管理员身份" style="width: 280px">
                        <el-option label="普通管理员" value="0"></el-option>
                        <el-option label="超级管理员" value="1"></el-option>
                    </el-select>
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
              <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="form.phone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth">
                    <el-input v-model="form.gender" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="入园日期" :label-width="formLabelWidth">
                    <el-input v-model="form.date" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" :label-width="formLabelWidth">
                    <el-input v-model="form.IDcard" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="年龄" :label-width="formLabelWidth">
                    <el-input v-model="form.age" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="管理区域" :label-width="formLabelWidth">
                    <el-select v-model="form.area_id" placeholder="请选择该管理员的管理区域"
                     @visible-change="findAllAreas" style="width: 280px">
                        <el-option v-for="area in this.allAreas" :key="area"
                         :label=area.area_name :value=area.area_id></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="modifyDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyInfo()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<style>

</style>

<script>
export default {
  name: 'AlarmEvent',
  components: {

  },
  data () {
    return {
      // 搜索框输入的内容
      input: '',
      tableData: [],

      // 添加对话框
      insertDialogFormVisible: false,
      // 编辑对话框
      modifyDialogFormVisible: false,
      modifyId: undefined,

      form: {
        user_id: '',
        open_id: '',
        username: '',
        password: '',
        name: '',
        gender: '',
        email: '',
        area_id: '',
        area_name: '',
        status: ''
      },
      formLabelWidth: '80px',

      // 区域列表
      allAreas: []
    }
  },
  created () {
    this.findAll()
    this.findAllAreas()
  },
  methods: {
    areaFormatter (row, column) {
      // this.$http.get(
      //     "/area/findAll",
      // ).then((response)=>{
      //     console.log(response.data.data)
      // })
      return row.area_id
    },
    statusFormatter (row, column) {
      // return row.status
      return row.status === 1 ? '超级管理员' : '普通管理员'
    },
    findAll () {
      this.$http.get(
        '/user/findAll'
      ).then((response) => {
        this.tableData = response.data.data
        console.log(response)
      })
    },
    findAllAreas () {
      this.$http.get(
        '/area/findAll'
      ).then((response) => {
        this.allAreas = response.data.data
        console.log(response)
      })
    },
    getInfoById (id) {
      this.$http.get(
        '/user/' + id
      ).then((response) => {
        // this.form = response.data.data
        // console.log(response.data.data)
        if (response.data.code === '1') {
          this.form = response.data.data
        } else {
          this.form = {}
        }
      })
    },
    getInfoByName () {
      if (this.input === '') {
        this.findAll()
      } else {
        this.$http.get(
          '/user?name=' + this.input
        ).then((response) => {
          // this.form = response.data.data
          // console.log(response.data.data)
          if (response.data.code === '1') {
            this.tableData = response.data.data
          } else {
            this.tableData = []
          }
        })
      }
    },
    openInsertDialog () {
      this.form = {}
      this.insertDialogFormVisible = true
    },
    insertInfo () {
      this.insertDialogFormVisible = false
      this.$http.post(
        '/user/',
        this.form
      ).then((response) => {
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        // 发请求重新获取数据
        this.findAll()
      })
    },
    openModifyDialog (index, row) {
      this.modifyDialogFormVisible = true
      this.modifyId = row.user_id
      // 回显需要被修改的信息
      this.getInfoById(row.user_id)
    },
    modifyInfo () {
      this.modifyDialogFormVisible = false
      // 发送请求
      this.$http.put(
        '/user/',
        this.form
      ).then((response) => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        // 发请求重新获取数据
        this.findAll()
      })
    },
    deleteInfo (index, row) {
      // console.log(index)
      // console.log(row)
      // var delete_id = row.user_id
      // console.log(delete_id)
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        this.$http.delete(
          '/user/' + row.user_id
        ).then((response) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 发请求重新获取数据
          this.findAll()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
