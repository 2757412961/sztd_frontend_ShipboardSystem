<template>
  <modal width="800"
    v-model="user_modal"
    title="用户管理">
    <div style="width: 80%;margin:0 auto">
      <el-row>
        <el-button
          size="mini"
          type="primary"
          @click="handleAdd()">+ Add</el-button>
      </el-row>

      <el-table
        :data="tableData"
        style="width: 100%;margin-top: 15px">
        <el-table-column
          label="姓名"
          prop="username">
        </el-table-column>
        <el-table-column
          label="权限"
          prop="category">
        </el-table-column>
        <el-table-column
          label="编辑"
          prop="id">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <add-user-modal ref="addUserModal" @refreshUser="refreshUser"></add-user-modal>
    <edit-user-modal ref="editUserModal" @refreshUser="refreshUser"></edit-user-modal>
  </modal>
</template>

<script>
    import AddUserModal from "./AddUserModal";
    import EditUserModal from "./EditUserModal";
    export default {
      name: "user-modal",
      components: {EditUserModal, AddUserModal},
      data(){
        return {
          user_modal:false,
          tableData: [],
          search: ''
        }
      },
      methods:{
        openUserModal(userData){
          this.tableData=userData;
          this.user_modal=true;
        },
        handleEdit(index, row){
          this.$refs.editUserModal.openEditUserModal(row.id,row.username,row.category)
        },
        handleDelete(index, row){
          console.log(row);
          var api=`/api/SZTDService/deleteUser.action?deletedID=${row.id}`;
          this.$axios.get(api)
            .then((response)=> {
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
              this.refreshUser();
            })
            .catch((response)=>{
              //失败回调
              this.$confirm('服务器失联！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
            })
        },
        handleAdd(){
          this.$refs.addUserModal.openAddUserModal()
        },
        refreshUser(){
          var api=`/api/SZTDService/selectAllUsers.action`;
          this.$axios.get(api)
            .then((response)=> {
              console.log(response.data);//成功回调
              this.tableData=response.data;
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
