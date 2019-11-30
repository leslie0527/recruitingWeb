<template>
  <div>
    <el-button type="primary" class="add-btn el-icon-plus" @click="addBtn">添加普通管理员</el-button>
    <el-table :data="adminList" style="width: 80%;margin:auto;">
      <el-table-column prop="id" label="ID" width="200"></el-table-column>
      <el-table-column prop="username" label="管理员账号" width="180"></el-table-column>
      <el-table-column prop="password" label="管理员密码" width="180"></el-table-column>
      <el-table-column prop="role" label="权限" width="180"></el-table-column>
      <el-table-column prop="isDelete" label="是否删除" width="180">
        <template slot-scope="scope">{{scope.row.isDelete?"是":"否"}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="scope.row.username === adminName" type="text" @click="updateBtn(scope)" size="small">编辑</el-button>
          <el-button v-if="scope.row.username !== 'admin' && !scope.row.isDelete && adminName === 'admin'" type="text" @click="deleteBtn(scope)" size="small">删除</el-button>
          <el-button v-if="scope.row.username !== 'admin' && scope.row.isDelete && adminName === 'admin'" type="text" @click="deleteBtn(scope)" size="small">恢复</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="width:50px;margin:auto">
        <el-pagination small layout="prev, next" @prev-click="prev()" @next-click="next()" background></el-pagination>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="addForm">
        <el-form-item label="管理员账号" label-width="150">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码" label-width="150">
          <el-input v-model="addForm.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createdAdmin()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import gql from "graphql-tag";
import { parse } from "path";
export default {
  data() {
    return {
      page: 1,
      adminList: [],
      dialogFormVisible: false,
      addForm: {},
      adminName:'',
      dialogTitle: "新增普通管理员"
    };
  },
  created() {
    this.adminName = sessionStorage.getItem("username");
    this.getAdminList();
  },
  methods: {
    prev() {
      this.page--;
      this.getAdminList();
    },
    next() {
      this.page++;
      this.getAdminList();
    },
    getAdminList() {
      this.$apollo
        .mutate({
          mutation: gql`
            query($page: Int) {
              admin {
                search(page: $page) {
                  id
                  username
                  password
                  role
                  isDelete
                }
              }
            }
          `,
          variables: {
            page: this.page
          }
        })
        .then(data => {
          console.log(data.data.admin.search);
          this.adminList = data.data.admin.search;
        })
        .catch(err => {});
    },
    addBtn() {
      this.dialogTitle = "添加普通管理员";
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    updateBtn(scope) {
      // console.log(scope.row);
      this.addForm = scope.row;
      this.dialogTitle = "修改普通管理员";
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    //删除 恢复管理员
    deleteBtn(scope){
      if (scope.row.username === 'admin') {
        return;
      }
      this.$apollo
              .mutate({
                mutation: gql`
            mutation($id: Int!,$isDelete:Boolean) {
              admin {
                update(id: $id,isDelete:$isDelete) {
                  isDelete
                }
              }
            }
          `,
                variables: {
                  id: scope.row.id,
                    isDelete:scope.row.isDelete ? false:true,
                }
              })
              .then(data => {
                this.getAdminList();
              })
              .catch(err => {});
    },
    createdAdmin() {
      if (this.dialogTitle == "修改普通管理员") {
        console.log(this.addForm);
        this.$apollo
          .mutate({
            mutation: gql`
              mutation(
                $id: Int!
                $username: String
                $password: String
                $isDelete: Boolean
              ) {
                admin {
                  update(
                    id: $id
                    username: $username
                    password: $password
                    role: ordinary
                    isDelete: $isDelete
                  ) {
                    id
                    username
                    password
                    role
                    isDelete
                  }
                }
              }
            `,
            variables: {
              id: this.addForm.id,
              username: this.addForm.username,
              password: this.addForm.password,
              isDelete: this.addForm.isDelete == 0 ? false : true
            }
          })
          .then(data => {
            this.$message({
              message: "账号修改成功",
              type: 'success'
            });
            this.dialogFormVisible = !this.dialogFormVisible;
          })
          .catch(err => {
            console.log(err);
            this.$message.error("修改失败，请稍后再试");
          });
      } else {
        this.$apollo
          .mutate({
            mutation: gql`
              mutation($username: String, $password: String) {
                admin {
                  create(
                    username: $username
                    password: $password
                    role: ordinary
                  ) {
                    id
                    username
                    password
                    role
                    isDelete
                  }
                }
              }
            `,
            variables: {
              username: this.addForm.username,
              password: this.addForm.password
            }
          })
          .then(data => {
              this.$message({
                  message: "账号添加成功",
                  type: 'success'
              });
            this.dialogFormVisible = !this.dialogFormVisible;
            this.adminList.push(data.data.admin.create);
          })
          .catch(err => {
              this.$message.error("该管理员已经添加");
          });
      }
    }
  }
};
</script>
<style scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.add-btn {
  margin: 20px;
}
</style>