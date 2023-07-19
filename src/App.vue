<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<!-- <script>

export default {
  name: 'app',
  components: {
  }
}
</script> -->

<script>
import io from "socket.io-client/dist/socket.io";

  export default {
    name: 'App',
    components: {
    },
    data() {
      return {
        alerts: ['ad'],
      };
    },
    mounted() {
      const socket = io("http://43.143.247.127:8090/ws", {
      // const socket = io("http://localhost:8090/ws", {
        transports: ['websocket'],
        path: "/ws/socket.io",
      });

      // 连接成功
      socket.on("connect", () => {
        console.log("Connected to Socket.IO server");
      });
      // 连接关闭
      socket.on("disconnect", () => {
        console.log("Disconnected from Socket.IO server");
      });

      // 服务端预警响应消息弹窗
      socket.on("alarm_message", (data) => {
        this.$message({
            type: 'error',
            message: '【来自服务端】 ' + data.message + "，类型：【" + data.alert_type + "】"
        });
        console.log(data)
        this.alerts.push(data);
      });

      
      // // 发送 chat 事件到服务器进行聊天
      // socket.emit("chat", { message: "Hello, server!" })
      // // 服务端聊天响应消息弹窗
      // socket.on("chat_message", (data) => {
      //   this.$message({
      //       type: 'error',
      //       message: '【来自服务端】 ' + data.message
      //   });
      //   console.log(data)
      //   this.alerts.push(data);
      // });

    },
  };
</script>
<style>
</style>
