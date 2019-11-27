<template>
    <div>
        <el-table
      :data="roleList"
      style="width: 100%">
            <el-table-column
                prop="username"
                label="用户名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="用户手机"
                width="180">
                <template slot-scope="scope">
                    {{scope.row.mobile?scope.row.mobile:"暂无数据"}}
                </template>
            </el-table-column>
            <el-table-column
                prop="sex"
                label="性别"
                width="180">
                <template slot-scope="scope">
                {{scope.row.sex?scope.row.sex:"暂无数据"}}
                </template>
            </el-table-column>
            <el-table-column
                prop="arg"
                label="年龄"
                width="180">
                <template slot-scope="scope">
                {{scope.row.arg?scope.row.arg:"暂无数据"}}
                </template>
            </el-table-column>
            <el-table-column
                prop="role"
                label="角色"
                width="180">
                <template slot-scope="scope">
                {{scope.row.role?scope.row.role:"暂无数据"}}
                </template>
            </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
                        <el-button type="text" @click="handleClick(scope.row)" size="small">角色分配</el-button>
                    </template>
                    </el-table-column>
        </el-table>
            <div style="width:50px;margin:auto">
                <el-pagination small layout="prev, next" @prev-click="prev()" @next-click="next()" background></el-pagination>
            </div>
        <el-dialog style="text-align:center" title="角色分配" :visible.sync="dialogFormVisible">
                    <el-select v-model="role" placeholder="请选择角色">
                        <el-option label="应聘者" value="student"></el-option>
                        <el-option label="招聘者" value="enterprise"></el-option>
                    </el-select>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="updateRole()">确 定</el-button>
                    </div>
        </el-dialog>
    </div>
</template>
<script>
import gql from "graphql-tag";
import { log } from 'util';
export default {
    data() {
        return {
            page:1,
            roleList:[],
            role:"",
            dialogFormVisible:false,
            id:""
        }
    },
    created(){
        this.getRoleList();
    },
    methods:{
        prev() {
            this.page--;
            this.getRoleList();
        },
        next() {
            this.page++;
            this.getRoleList();
        },
        getRoleList(){
            this.$apollo.mutate({
                mutation:gql`
                    query($page:Int){
                        member{
                            search(
                                page:$page
                            ){
                                id
                                username
                                password
                                mobile
                                sex
                                arg
                                role
                            }
                        }
                    }
                `,
                variables:{
                    page:this.page
                }
            }).then(data=>{
                console.log(data.data.member.search)
                this.roleList = data.data.member.search;
            })
            .catch(err=>{console.log(err)})
        },
        handleClick(item){
            this.dialogFormVisible=!this.dialogFormVisible
             this.role=item.role;
             this.id = item.id;
        },
        updateRole(){
            this.dialogFormVisible = false;
            this.$apollo.mutate({
                 mutation:gql`
                        mutation($id:Int!,$role:memberRoleEnumMutation){
                            member{
                            update(
                                id:$id
                                role:$role
                            ){
                                id
                            }
                        }
                    }
                 `,
                 variables:{
                     id:this.id,
                    role:this.role
                 }
             }).then(data=>{
                 console.log(data)
                 this.$message({
                     message:"当前用户角色修改成功",
                     type:'success'
                 })
                 })
             .catch(err=>{console.log(err)});
        }
    }
}
</script>
<style scoped>

</style>