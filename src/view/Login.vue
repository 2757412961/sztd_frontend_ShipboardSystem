<template>
  <div id="login_vue">
    <el-card id="login_card" class="box-card">
      <div slot="header" class="clearfix">
        <h2>{{this.$store.state.title}}</h2>
      </div>
      <div style="margin:0 40px 0 40px">
        <el-row style="padding:10px">
          <el-col :span="6" style="height:100%"><h3 style="line-height:2">用户名：</h3></el-col>
          <el-col :span="18">
            <Input v-model="userName" icon="md-person" placeholder="请输入用户名"/>
          </el-col>
        </el-row>
        <el-row style="padding:10px">
          <el-col :span="6" style="height:100%"> <h3 style="line-height:2">密码：</h3></el-col>
          <el-col :span="18">
            <Input v-model="password" type="password" icon="md-lock" placeholder="请输入密码"/>
          </el-col>
        </el-row>
        <el-row style="padding:15px;height:50px">
          <Checkbox style="line-height: 2.5;float: left;">记住密码</Checkbox>
          <Button type="info" style="width:80px;position:absolute;"  v-on:click="btn_login_click">登录</Button>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
    export default {
        name: "login",
      data(){
          return {
            userName:"",
            password: ""
          }
      },
      computed:{
        user() {
          return this.$store.state.name
        }
      },
      methods:{
        btn_login_click:function(event){
          //发起ajax请求
          var api=`/api/SZTDService/loginAjax.action?username=${this.userName}&password=${this.password}`;
          this.$axios.get(api)
            .then((response)=> {
              console.log(response.data);//成功回调
              if(response.data!=-1){
                //若登录成功，则跳转home页面，并修改全局user变量
                this.$store.commit('setName',this.userName);
                //TODO 添加用户权限
                this.$store.commit('setCategory',response.data);
                this.$router.push({
                  name: 'home'
                })
              }else{
                // 若不成功，则弹出警告框
                this.$confirm('用户名密码错误！', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
                })
              }

            })
            .catch((response)=>{
              //失败回调
              this.$confirm('服务器失联！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
            })

        }
      }
    }
</script>

<style scoped>
  #login_vue{
    height: 100%;
    width: 100%;
    background:url("../assets/login_bg.jpg") no-repeat center center scroll;
    background-size:cover;
    opacity:0.6;

  }
  #login_card{
    position:absolute;
    width:400px;
    height:260px;
    background-color: rgba(255,255,255,0.6);
    top: 0; left: 0;right: 0;bottom: 0;margin:auto;
  }
</style>
