<template>
    <div>
        <el-select v-model="selectedValue" placeholder="请选择摄像头" @change="changeCVal">
            <el-option v-for="(option, index) in options" :key="index" :value="option.streamAddress" :label="option.cameraName"></el-option>
        </el-select>

        <el-select style="margin-left:15px;" v-model="selectedAlgValue" placeholder="请选择算法" @change="changeAVal">
            <el-option value="1" label="禁区检测"></el-option>
            <el-option value="2" label="人脸识别"></el-option>
            <el-option value="3" label="交互识别"></el-option>
            <el-option value="4" label="跌倒检测"></el-option>
            <el-option value="5" label="情绪分析"></el-option>
        </el-select>
        <el-button style="margin-left:10px;" @click="changeCA" type="primary" plain>检测</el-button>
        <div class="line"></div>
        <div class="vid" >
      <img ref="image" style="width: 300px; height: 300px; z-index: -1;" @error="onImageError" :src="imageSrc">
      <div v-for="(position, index) in positions" :key="index" :style="{ top: position.top + 'px', left: position.left + 'px' }" class="marker"></div>
        <button @click="startProcess" v-if="!completed" :style="{ display: this.changeValueA==='1' ?'block':'none' }">改变检测区域</button>
        <button @click="completeProcess" v-else>完成框选</button>
    </div>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                 // 加载视频前顶替用的图片
                imageSrc: require("../../assets/images/blank.png"),
                // imageSrc: require("../../assets/images/jiankong.png"),
                selectedValue:'',
                options: [], // 存储选项的数组
                changeValueC:'',
                selectedAlgValue:'',
                changeValueA:'',

                completed: false,
                showCoordinates: false,
                mouseX: 0,
                mouseY: 0,
                positions: [],
                lines: [],
                imageRect: null,
                count: 0,
            }
        },

    created(){
      this.findCamera()
    },
    methods: {
      findCamera () {
        const that = this;
        const gtoken = JSON.parse(localStorage.getItem('token')) 
        const config = {
        params:{
          current:1,
          size:10,
          keyword:''
        },
      headers: {
        token:gtoken
          }
        };
      this.$http.get(
        '/camera/page',config
      ).then((response) => {
        if (response.status === 401) {
            this.$router.push('/login');
          } else {
        if (response.data.code === 1){
          this.$message({
            type: 'success',
            message: '查询成功'
          });
          that.options = response.data.data.records   
        }else{
          this.$message({
            type: 'error',
            message: '查询失败'
          });
        }  }
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '网络问题，查询失败'
          });          
      });
    },
      changeCVal(val){
          this.changeValueC = val;
      },

      changeAVal(val){
          this.changeValueA = val;
      },
      
      async changeCA(){
        var camera=this.changeValueC;
        var algorithm=this.changeValueA;
        if(algorithm==="1"){
          const server_url = 'http://43.143.247.127:8090/api/v1/cv/area';
          const image = this.$refs.image;
          const video_url = camera;
          const url = `${server_url}?video_url=${video_url}`;
          try {
              await this.loadImage(image, url, 60000); // 设置加载超时时间为 6000 毫秒（60秒）
          } catch (error) {
              console.error(error);
          // 视频流加载失败
          // 展示超时对应的图片
              this.imageSrc = require("../../assets/images/timeout.jpg");
          }
        }else if(algorithm==="2"||algorithm==="3"||algorithm==="5"){
          const server_url = 'http://43.143.247.127:8090/api/v1/cv/face';
          const image = this.$refs.image;
          const video_url = camera;
          const url = `${server_url}?video_url=${video_url}`;
          try {
              await this.loadImage(image, url, 60000); // 设置加载超时时间为 6000 毫秒（60秒）
          } catch (error) {
              console.error(error);
          // 视频流加载失败
          // 展示超时对应的图片
              this.imageSrc = require("../../assets/images/timeout.jpg");
          }
        }else if(algorithm==="4"){
          const server_url = 'http://43.143.247.127:8090/api/v1/cv/fall';
          const image = this.$refs.image;
          const video_url = camera;
          const url = `${server_url}?video_url=${video_url}`;
          try {
              await this.loadImage(image, url, 60000); // 设置加载超时时间为 6000 毫秒（60秒）
          } catch (error) {
              console.error(error);
              this.imageSrc = require("../../assets/images/timeout.jpg");
          }
        }


      },
      onImageError() {
        // 图片404时展示这张图
      this.imageSrc = require("../../assets/images/error.jpg");
      },

      loadImage(element, url, timeout) {
          return new Promise((resolve, reject) => {
              const img = new Image();
              const timer = setTimeout(() => {
              reject(new Error('Image loading timed out'));
              }, timeout);
              img.onload = () => {
              clearTimeout(timer);
              element.src = url;
              resolve();
              };
              img.onerror = error => {
              clearTimeout(timer);
              reject(error);
              };
              img.src = url;
      });
      },
      startProcess() {
        this.showCoordinates = true;
        this.$refs.image.addEventListener('mousemove', this.handleMouseMove);
        this.$refs.image.addEventListener('click', this.handleClick);
        this.$message({
            type: 'success',
            message: '开始选择四边形区域点坐标'
        });
      },
      completeProcess() {
        this.showCoordinates = false;
        this.completed = true;
        this.$refs.image.removeEventListener('mousemove', this.handleMouseMove);
        this.$refs.image.removeEventListener('click', this.handleClick);

        this.open()
        
      },
      handleMouseMove(event) {
        this.mouseX = Math.round(event.pageX - this.imageRect.left);
        this.mouseY = Math.round(event.pageY - this.imageRect.top);
      },
      handleClick(event) {
        this.count++
        
        if (this.count == 4) {
          this.completed = true;
        }
        else if (this.count > 4) {
          this.$message({
              type: 'message',
              message: '已选择四个点，再次点击则取消第一个点！'
          });
          return 
        }

        const markerTop = Math.round(event.pageY - this.imageRect.top - 5);
        const markerLeft = Math.round(event.pageX - this.imageRect.left - 5);

        if (this.positions.length > 0) {
          const prevPosition = this.positions[this.positions.length - 1];
          const line = {
            x1: prevPosition.left + 5,
            y1: prevPosition.top + 5,
            x2: markerLeft + 5,
            y2: markerTop + 5
          };
          console.log(line)
          this.lines.push(line);
        }

        this.positions.push({ top: markerTop, left: markerLeft });
      },

      open() {

        var msg = '坐标a：(' + this.positions[0].left + ", " + this.positions[0].top + '), ' +
        '坐标b：(' + this.positions[1].left + ", " + this.positions[1].top + '), ' +
        '坐标c：(' + this.positions[2].left + ", " + this.positions[2].top + '), ' +
        '坐标d：(' + this.positions[3].left + ", " + this.positions[3].top + ')'

        // 计算禁区的请求参数
        const imgElement = this.$refs.image;
        const width = imgElement.style.width;
        const height = imgElement.style.height;

        var px1 = this.positions[0].left / parseFloat(width)
        var py1 = this.positions[0].top / parseFloat(height)
        var px2 = this.positions[1].left / parseFloat(width)
        var py2 = this.positions[1].top / parseFloat(height)
        var px3 = this.positions[2].left / parseFloat(width)
        var py3 = this.positions[2].top / parseFloat(height)
        var px4 = this.positions[3].left / parseFloat(width)
        var py4 = this.positions[3].top / parseFloat(height)

        this.$confirm(msg, '区域框选完毕！', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '框选成功！请等待模型加载'
          });
          
          // console.log(px1 + ", " + py1)
          // console.log(px2 + ", " + py2)
          // console.log(px3 + ", " + py3)
          // console.log(px4 + ", " + py4)

          // 请求体数据
          var data = {
            "px1": px1,
            "py1": py1,
            "px2": px2,
            "py2": py2,
            "px3": px3,
            "py3": py3,
            "px4": px4,
            "py4": py4
          }

          // 发请求
          console.log(data)

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
        
        this.positions = []
        this.lines = []
        this.completed = false
        this.count = 0
      }
      },
      mounted() {
        this.imageRect = this.$refs.image.getBoundingClientRect();
    }
};
</script>
<style>
.vid{
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%,-50%);
}
.marker {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: red;
  z-index: 0;
}

.container {
  position: relative;
}
.image-container {
  position: relative;
  display: inline-block; /* 图片和线条容器为水平排列 */
}
.image {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>