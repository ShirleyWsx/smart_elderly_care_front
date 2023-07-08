<template>
    <div>
        <el-select v-model="selectedValue" placeholder="请选择摄像头" @change="changeVal">
            <el-option value="1" label="摄像头1"></el-option>
            <el-option value="2" label="摄像头2"></el-option>
            <el-option value="3" label="摄像头3"></el-option>
        </el-select>
        <el-button style="margin-left:10px;" @click="changeCamera" type="primary" plain>切换</el-button>
        <div class="line"></div>
        <div class="vid" >
            <img ref="image"/>
        </div> 
    </div>
</template>
<script>
    export default {
        data(){
            return{
                selectedValue:'',
                changeValue:''
            }
        },
    methods: {
        changeVal(val){
            this.changeValue = val;
        },
        changeCamera(){
            var camera=this.changeValue;
            if(camera==="1"){
                this.gotoCameraOne()
            }else if(camera==="2"){
                this.gotoCameraTwo()
            }else if(camera==="3"){
                this.gotoCameraThree()
            }
        },

    async gotoCameraOne(){
        const server_url = 'http://43.143.247.127:8090/cv';
        const image1 = this.$refs.image;
        const video_url1 = 'rtmp://43.143.247.127:1935/hls/lym';
        const url1 = `${server_url}?video_url=${video_url1}`;
        await this.loadImage(image1, url1);

        },
    async gotoCameraTwo() {
        const server_url = 'http://43.143.247.127:8090/cv';
        const image2 = this.$refs.image;
        // const video_url2 = 'rtmp://43.143.247.127:1935/hls/wz';
        const video_url2 = '0';
        const url2 = `${server_url}?video_url=${video_url2}`;
        await this.loadImage(image2, url2);
    },
    async gotoCameraThree() {
        const server_url = 'http://43.143.247.127:8090/cv';
        const image3 = this.$refs.image;
        const video_url3 = 'rtmp://43.143.247.127:1935/hls/wsx';
        const url3 = `${server_url}?video_url=${video_url3}`;
        await this.loadImage(image3, url3);   
    },

    loadImage(element,url){
        return new Promise((resolve,reject)=>{
            const img = new Image();
            img.onload = ()=>{
                element.src = url;
                resolve();
            };
            img.onerror = error=>{
                reject(error);
            }; 
            img.src = url;
        });
    }
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

</style>