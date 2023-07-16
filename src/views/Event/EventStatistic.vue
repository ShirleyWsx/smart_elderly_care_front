<template>
  <div>
      <div ref="lineChart" style="width: 800px; height: 400px; background-color: #ffffff; padding: 20px; border-radius: 20px;"></div>
      <div ref="myChart2" style="width: 800px; height: 400px; background-color: #ffffff; padding: 20px; border-radius: 20px;"></div>
  </div>
</template>

<script>

export default {
  mounted() {
       this.createLineChart()
      this.createColumnChart()
  },

  methods:{
    createLineChart(){
      const that=this
      const gtoken = JSON.parse(localStorage.getItem('token')) ;
      const config = {
      params:{
          year:2023
      },
      headers: {
          token: gtoken
          }
      };
      this.$http.get(
      '/event/statistics/time',config
      ).then((response) => {
          if (response.data.code === 1){
          this.$message({
          type: 'success',
          message: '查询成功'
          });
          //数据封装
         var countMonthList = response.data.data.countMonthList;
         that.lineChart = that.$echarts.init(that.$refs.lineChart)
         that.lineChart.setOption({
          title: {
              text: '离开访问时间对比'
          },
          // 提示框
          tooltip: {
              trigger: 'axis'
          },
          // 图例
          legend: {
              icon: 'circle',
              left: 'center',
              top: 0,
              data: ['次数']
          },
          grid: {
              left: '3%',
              right: '3%',
              bottom: '3%',
              containLabel: true
          },
          // 工具栏
          toolbox: {
              feature: {
                  saveAsImage: {
                      type: 'png'
                  },
                  magicType: {
                      type: ['line', 'bar']
                  }
              }
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
          },
          yAxis: {
              type: 'value'
          },
          series: [
              {
                  name: '次数',
                  type: 'line',
                  data: countMonthList
              }
          ]
      })
      }else{
          this.$message({
          type: 'error',
          message: '查询失败'
          });
      }  
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
            year: 2023
          },
        headers: {
          token: gtoken
          }
      };
      this.$http.get(
      '/event/statistics/location',config
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
          var locationList = response.data.data.locationList
          var countList= response.data.data.countList
          that.myChart2 = that.$echarts.init(that.$refs.myChart2)
          that.myChart2.setOption({
              title: {
                  text: '年龄统计',
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
                  data: locationList,
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