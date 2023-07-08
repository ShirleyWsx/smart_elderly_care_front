<template>
    <div class="vid">
        <img ref="image3"/>
   </div> 
</template>
<script>
    export default {
    mounted() {
    this.fetchVideos();
},
    methods: {
    async fetchVideos() {
        const server_url = 'http://43.143.247.127:8090/cv';
        const image3 = this.$refs.image3;
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