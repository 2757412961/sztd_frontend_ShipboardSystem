<template>
  <el-container style="height:100%;">
    <el-aside width="500px">
     <a href="#/home" >
       <img
         id="img_logo"
         src="~assets/nmefc.png"
       >
     </a>
      <h2 id="h_title">
       {{this.$store.state.title}}
     </h2>
    </el-aside>
    <el-main style="padding:0;overflow: hidden;position: relative;">

      <div style="position: absolute;top: 50%;transform: translateY(-50%);right: 0;">
        <el-button type="text" style="padding: 5px;" @click="btn_user_click"><font-awesome-icon :icon="['far','user']"/><span style="padding:5px">您好，{{user}}</span></el-button>
        <el-button type="text" style="padding: 5px;"><font-awesome-icon :icon="['far','question-circle']"/>帮助</el-button>
        <el-button type="text" style="padding: 5px;" @click="signOutAlert"><font-awesome-icon :icon="['fas','sign-out-alt']" />退出</el-button>
        <user-modal ref="userModal"></user-modal>
      </div>
    </el-main>
  </el-container>
</template>

<script>
    import UserModal from "../components/User/UserModal";
    export default {
      name: "HeadNav",
      components: {UserModal},
      data(){
        return {
          active:'dataSearch'
        }
      },
      computed:{
        user() {
          return this.$store.state.name
        }
      },
      methods: {
        btn_user_click(){
          //this.$refs.userModal.openUserModal()
          if(this.$store.state.category==1){
            var api=`/api/SZTDService/selectAllUsers.action`;
            this.$axios.get(api)
              .then((response)=> {
                console.log(response.data);//成功回调
                this.$refs.userModal.openUserModal(response.data)
              })
              .catch((response)=>{
                //失败回调
                this.$confirm('服务器失联！', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
                });
              })

          }
        },
        signOutAlert(){
          this.$confirm('此操作将退出当前账号, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //跳转到登录界面
            this.$store.commit('setName',"");
            this.$store.commit('setCategory',"");
            this.$message({
              type: 'success',
              message: '退出登录成功！'
            });

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消退出登录！'
            });
          });
        }
      }
    }
</script>


<style scoped>
  .el-menu{
    border:0;
    height:59px
  }
  #img_logo{
    height:50px;
    width:50px;
    position: absolute;
    float:left;
    left:20px;
    top:5px;
  }
  #h_title{
    position: absolute;
    left:100px;
    margin-top:15px;
  }
  .el-button{
    color: #35495e;
  }
</style>
