<template>
    <div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <!-- 首页user信息 -->
            <el-card shadow= 'hover'>
              <div class="userCard">
                <el-avatar :size="150" :src=imgUrl></el-avatar>
                <div class="userInfo">
                  <p class="important-font">lym</p>
                  <p class="secondary-font">管理员</p>
                </div>
              </div>
              <div class="login-info">
                <p>上次登录时间: 2023/07/16 18:16</p>
              </div>
            </el-card>
            <!-- 首页表格 -->
            <el-card shadow= 'hover' class="tableInfo">
              <div slot="header">
                <span class="important-font">事件信息</span>
              </div>
              <div>
                <el-table
                  :data="tableData"
                  stripe
                  border
                  height="450px"
                  style="width: 100%">
                  <el-table-column
                    prop="eventDate"
                    label="事件发生的时间"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="eventLocation"
                    label="事件发生的地点"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="eventType"
                    label="事件类型">
                  </el-table-column>
                </el-table>
              </div> 
            </el-card>
          </div>
        </el-col>
        <el-col :span="16">
          <!-- 柱状图 -->
          <el-card style="height: 280px">
            <div style="height:280px;" ref="barEcharts">{{createColumnChart()}}</div>
          </el-card>
          <div class= "num graph">
            <el-card style="width: 34%;height: 565px;marginRight: 1%">
              <div style="width: 100%;height: 465px;" ref="pieEcharts">{{createPieChart()}}</div>
            </el-card>
            <el-card style="width:65%;height: 565px"><div style="height: 265px"><el-calendar v-model="value"></el-calendar></div></el-card>
          </div>
        </el-col>
      </el-row>
    </div>
    </template>
     
    <script>     
    export default {
      name: "Index",
      data() {
        return {
          imgUrl:require('../assets/stb.jpg'),
          value: new Date(),
          tableData: [],
          
        }
      },
      created () {
        this.findEvent ()
    },
      methods:{
        findEvent () {
            const that = this;
            const gtoken = JSON.parse(localStorage.getItem('token')) 
            const config = {
            params:{
                current:1,
                size:this.pageSize,
                keyword:'',
                eventType:''
            },
            headers: {
                token:gtoken
                }
                };
            this.$http.get(
                '/event/page',config
            ).then((response) => {
                if (response.status === 401) {
                    this.$router.push('/login');
                    } else {
                if (response.data.code === 1){
                this.$message({
                    type: 'success',
                    message: '查询成功'
                });
                console.log(response.data);
                that.tableData = response.data.data.records    
                }else{
                this.$message({
                    type: 'error',
                    message: '查询失败'
                });
                } } 
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '网络问题，查询失败'
                });          
            });
},
   
createPieChart(){
        const that=this
        const gtoken = JSON.parse(localStorage.getItem('token')) ;
        const config = {
        headers: {
            token: gtoken
            }
        };
        this.$http.get(
        '/elderly/statistics/health',config
        ).then((response) => {
            if (response.status === 401) {
          this.$router.push('/login');
        } else {
            if (response.data.code === 1){
            this.$message({
            type: 'success',
            message: '查询成功'
            });
            //数据封装
            var healthData = response.data.data;
            var health = healthData['健康']
            var unfit= healthData["身体不适"]
            that.myChart = that.$echarts.init(that.$refs.pieEcharts)
            that.myChart.setOption({
                title: {
                    text: '32469',
                    subtext: '老年人的身体状况',
                    left: 'center',
                    top: '23%',
                    subtextStyle: {
                    fontSize: 18
                    }
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    icon: 'circle',
                    top: '0',
                    left: 'right'
                },
                series: [
                    {
                        name: '身体状况',
                        type: 'pie',
                        radius: ['40%', '55%'],
                        label: {
                            show: true,
                            padding: [0, -60],
                            overflow: 'none',
                            fontSize: '15',
                            fontWeight: 'bold',
                            formatter: '{d}%\n\n{c}'
                        },
                        labelLine: {
                            show: true,
                            length: 15,
                            length2: 60
                        },
                        itemStyle: {
                            normal: {
                                color: function (params) {
                                    var colorList = ['#4FC3F7', '#00C853', '#F57F17']
                                    return colorList[params.dataIndex]
                                }
                            }
                        },
                        data: [
                            { name: '健康', value: health },
                            { name: '身体不适', value: unfit },
                        ]
                    }
                ]
            })
        }else{
            this.$message({
            type: 'error',
            message: '查询失败'
            });
        }  }
        }).catch(() => {
            this.$message({
            type: 'info',
            message: '网络问题，失败'
            });          
        });
        
        },
        createColumnChart(){
        const that=this
        const gtoken = JSON.parse(localStorage.getItem('token')) ;
        const config = {
        params:{
            ageOffset:5
            },
        headers: {
            token: gtoken
            }
        };
        this.$http.get(
        '/elderly/statistics/age',config
        ).then((response) => {
            if (response.status === 401) {
          this.$router.push('/login');
        } else {
            if (response.data.code === 1){
            this.$message({
            type: 'success',
            message: '查询成功'
            });
            //数据封装
           console.log( response.data.data);
            var labelList = response.data.data.labelList
            var countList= response.data.data.countList
            that.myChart2 = that.$echarts.init(that.$refs.barEcharts)
            that.myChart2.setOption({
                title: {
                    text: '老年人的年龄统计',
                    left: 'top',
                    // top: '43%',
                    subtextStyle: {
                    fontSize: 18
                    }
                },
                tooltip: {
                    trigger: 'item'
                },
                xAxis: {
                    axisLabel: {
                        interval:0,
                    },

                    type: 'category',
                    data: labelList,
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        data: countList,
                        type: 'bar',
                    },
                    ],
                    })
        }else{
            this.$message({
            type: 'error',
            message: '查询失败'
            });
        } } 
        }).catch(() => {
            this.$message({
            type: 'info',
            message: '网络问题，失败'
            });          
        });

        }
      }
    }
    </script>
     
    <!-- Add "scoped" attribute to limit CSS to this component only -->
    <style lang="less" scoped>
    .el-card__body {
        padding: 10px;
    }
    .userCard{
      height: 180px;
      display: flex;
      border-bottom: 2px solid #DCDFE6;
      border-radius: 2px;
    }
    .userInfo{
      width: auto;
      padding: 6% 0 0 6%;
    }
    .important-font{
        font-weight: 900;
        font-size: 25px;
    }
    .secondary-font{
      color: #909399;
    }
    .login-info{
      height: 40px;
      text-align: left;
      color: #909399;
    }
    .tableInfo{
      margin: 20px 0 0 0;
    }
    .OrderCard{
       margin: 0 0 30px 30px;
       border: #DCDFE6 1px solid;
       border-radius: 10px;
       i{
         width: 30%;
         line-height: 120px;
         font-size: 30px;
         color:#fff
       }
       div{
         width: 300px;
       }
    }
    .el-card{
      border: none;
    }
    .num{
      display: flex;
      flex-wrap: wrap;
    }
    .graph{
      margin: 15px 0 0 0;
    }
    .el-calendar{
      height: 265px ;
    }
    </style>