<template>
  <modal width="400"
         v-model="editUser_modal"
         @on-ok="editUser"
         title="编辑用户">
    <el-row  style="margin-top:10px">
      <label style="font-size: 14px;float:left;line-height:2;font-weight:bold">用户名：</label>
      <label style="float:right;width: 75%;" >{{userName}}</label>
    </el-row>
    <el-row style="margin-top:10px">
      <label style="font-size: 14px;float:left;line-height:2;font-weight:bold">权限：</label>
      <el-select
        style="float:right;width: 75%;"
        v-model="category_edit" placeholder="请选择数据类型" size="small">
        <el-option
          v-for="item in categorys"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-row>
  </modal>
</template>

<script>
    export default {
        name: "edit-user-modal",
      data() {
        return {
          editUser_modal: false,

          categorys: [{
            value: '1',
            label: '管理员'
          }, {
            value: '0',
            label: '普通用户'
          }],
          userId:"",
          userName: "",
          category_edit: ""
        }
      },
      methods:{
        openEditUserModal(id,username,category){
          this.userId=id;
          this.userName=username;
          this.category_edit=category;
          this.editUser_modal=true;
        },
        editUser(){
          var api=`/api/SZTDService/updateUserCategory.action?selectedID=${this.userId}&updatedCategory=${this.category_edit}`;
          this.$axios.get(api)
            .then((response)=> {
              console.log(response.data);//成功回调
              if(response.data=="success"){
                this.$message({
                  type: 'success',
                  message: '修改成功！'
                });
                this.$emit('refreshUser');
              }else{
                this.$confirm('修改失败！', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
                });
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

</style>
