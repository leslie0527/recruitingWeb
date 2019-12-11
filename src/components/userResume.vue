<template>
    <div>
        <el-table
      :data="resumeList"
      style="width: 100%">
            <el-table-column
                prop="name"
                label="姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="school"
                label="学校"
                width="180">
                <template slot-scope="scope">
                    {{scope.row.school?scope.row.school:"暂无数据"}}
                </template>
            </el-table-column>
            <el-table-column
                prop="arg"
                label="年龄"
                width="180">
            </el-table-column>
            <el-table-column
                prop="sex"
                label="性别"
                width="180">
                <template slot-scope="scope">
                    {{scope.row.sex==10?"男":"女"}}
                </template>
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="手机号码"
                width="180">
            </el-table-column>
            <el-table-column
                prop="email"
                label="电子邮箱"
                width="180">
            </el-table-column>
            <el-table-column
                prop="workExp"
                label="工作经验"
                width="180">
            </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                        <!-- <el-button type="text" size="small">编辑</el-button> -->
                    </template>
                    </el-table-column>
        </el-table>
    </div>
</template>
<script>
import gql from "graphql-tag";
export default {
    data() {
        return {
            resumeList:[],
            page:1
        }
    },
    created(){
        this.getUserResume();
    },
    methods: {
        getUserResume(){
            this.$apollo.mutate({
                mutation:gql`
                    query($page:Int){
                        memberResume{
                            search(page:$page){
                                memberId
                            id
                            name
                            mobile
                            sex
                            arg
                            school
                            workExp
                            email
                            }
                        }
                    }
                `,
                variables:{
                    page:this.page
                }
            }).then(data=>{
                console.log(data.data.memberResume.search)
                this.resumeList = data.data.memberResume.search;
                })
            .catch(err=>{console.log(err)})
        },
        handleClick(item){
            console.log(item);
            this.$router.push({path:"/myResume",query:{id:item.memberId}})
        }
    },
}
</script>
<style scoped>
    
</style>