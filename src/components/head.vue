<template>
  <div>
    <div class="header" v-if="!isAdmin">
      <router-link to="/index">
        <img src="../assets/logo.png" class="logo"/>
      </router-link>
      <div class="search-input" v-if="!isFirm">
        <el-input placeholder="找一找，总有适合你的工作" v-model="searchContent">
          <template slot="prepend">职位:</template>
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
      <div class="search-input" v-else>
        <el-input placeholder="根据职位搜索简历" v-model="searchContent">
          <template slot="prepend">职位:</template>
          <el-button slot="append" icon="el-icon-search" @click="searchResume"></el-button>
        </el-input>
      </div>
      <div>
        <el-dropdown v-if="!isFirm"  @command="handleCommand">
          <span class="el-dropdown-link">
            欢迎回来,{{username}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item  command="quit">退出登陆</el-dropdown-item>
            <el-dropdown-item command="myResume">我的简历</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown v-else  @command="handleCommand">
          <span class="el-dropdown-link">
            欢迎回来,{{username}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item  command="quit">退出登陆</el-dropdown-item>
            <el-dropdown-item command="positionDetail">我的公司</el-dropdown-item>
            <el-dropdown-item command="comInfo">编辑公司信息</el-dropdown-item>
            <el-dropdown-item command="jobPost">发布职位</el-dropdown-item>
            <el-dropdown-item command="resResume">收到的简历</el-dropdown-item>
            <el-dropdown-item command="modifier">信息修改</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="child">
      <router-view></router-view>
    </div>
    <el-dialog title="用户信息修改" :visible.sync="dialogVisible">
      <el-form :model="userForm">
        <el-form-item label="用户名" label-width="200">
          <el-input :disabled="true" v-model="userForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" label-width="200">
          <el-input v-model="userForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" label-width="200">
          <el-input v-model="userForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="200">
          <el-input v-model="userForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" label-width="200">
          <el-input v-model="userForm.arg" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="200">
         <el-radio-group v-model="userForm.sex">
            <el-radio :label="10">男</el-radio>
            <el-radio :label="20">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
      <el-button @click="onSubmit">提交</el-button>
    </div>
    </el-dialog>
  </div>
</template>
<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      searchContent: "",
      isFirm:false,
      username:"",
      isAdmin:false,
      dialogVisible:false,
      userForm:{}
    };
  },
  created(){
    if(sessionStorage.getItem("role")=="学生"||sessionStorage.getItem("role")=="企业"){
      this.isAdmin=false;
    }else{
      this.isAdmin=true;
    }
    if(!sessionStorage.getItem("username")){
      this.$router.push({path:"/"});
    }
    if(sessionStorage.getItem("cId")){
      this.getRuesume();
    }
    this.username = sessionStorage.getItem("username");
    console.log(sessionStorage.getItem("id"));
    if(sessionStorage.getItem("role")=="企业"){
      this.isFirm = true;
      this.getUserInfo();
    }
  },
  methods:{
    onSubmit(){
      let mobeilReg = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
      if (!mobeilReg.test(this.userForm.mobile)) {
        this.$message.error("电话号码填写错误");
        return;
      }
      this.$apollo.mutate({
        mutation:gql`
          mutation(
            $id:Int!
            $password:String
            $name:String
            $mobile:String
            $sex:Int
            $arg:Int
          ){
            member{
              update(
                id:$id
                password:$password
                name:$name
                mobile:$mobile
                sex:$sex
                arg:$arg
              ){
                id
              }
            }
          }
        `,
        variables:this.userForm
      }).then(data=>{
        console.log(data)
        this.$message({
          message:"您的信息修改成功",
          type:"success"
        })
        this.dialogVisible=false
      }).catch(err=>{
        console.log(err)
      })
    },
    search(){
      this.$router.push({path:"/index",query:{search:this.searchContent}})
    },
    searchResume(){
      this.$router.push({path:"/index",query:{searchResume:this.searchContent}})
    },
    getRuesume(){
      this.$apollo.mutate({
        mutation:gql`
          query(
            $companyId:Int
          ){
            memberDelivery{
              search(
                companyId:$companyId
              ){
                id
                companyPositionId
                memberId
              }
            }
          }
        `,
        variables:{
          companyId:sessionStorage.getItem("cId")
          
        }
      }).then(data=>{
        console.log(data)
                this.$notify({
          title: '收到简历提醒',
          message:`您的公司收到${data.data.memberDelivery.search.length}条投递简历`
        });
      }).catch(err=>{
        console.log(err)
      })
    },
    handleCommand(command){
      // console.log(command);
          if(command == 'quit'){
            sessionStorage.clear();
            this.$router.push({path:'/'})
          }else if(command == 'myResume'){
            this.$router.push({path:'/myResume'})
          }else if(command == 'positionDetail'){
            // console.log(sessionStorage.getItem('mId'));
            
            if(sessionStorage.getItem('cId')){
              this.$router.push({path:'/positionDetail'})
            }else{
              this.$router.push({path:'/comInfo'})
            }
          }else if(command == 'comInfo'){
            this.$router.push({path:'/comInfo'})
          }else if(command == 'jobPost'){
            this.$router.push({path:'/jobPost'})
          }else if(command == 'resResume'){
            this.$router.push({path:'/resResume'})
          }else{
            // this.$router.push({path:'/resResume'})
            this.dialogVisible = true;
            // this.getUserInfo();
          }
    },
    getUserInfo(){
      this.$apollo.mutate({
        mutation:gql`
          query($id:Int){
            member{
              detail(
                id:$id
              ){
                id
                username
                password
                name
                mobile
                sex
                arg
              }
            }
          }
        `,
        variables:{
          id:sessionStorage.getItem("id")
        }
      }).then(data=>{
        console.log(data.data.member.detail)
        this.userForm=data.data.member.detail;
      }).catch(err=>{
        console.log(err)
      })
    }
  }
};
</script>
<style scoped>
.header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.logo {
  width: 180px;
  height: 100px;
}
.search-input {
  width: 60%;
}
.child {
  width: 960px;
  margin: auto;
  background: white;
}
.el-dropdown-link {
cursor: pointer;
color: #409EFF;
}
.el-icon-arrow-down {
font-size: 12px;
}
</style>