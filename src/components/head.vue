<template>
  <div>
    <div class="header">
      <router-link to="/index">
        <img src="../assets/logo.png" class="logo" />
      </router-link>
      <div class="search-input">
        <el-input placeholder="找一找，总有适合你的工作" v-model="searchContent">
          <template slot="prepend">职位:</template>
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
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
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="child">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      searchContent: "",
      isFirm:false,
      username:""
    };
  },
  created(){
    if(sessionStorage.getItem("cId")){
      this.getRuesume();
    }
    this.username = sessionStorage.getItem("username");
    console.log(sessionStorage.getItem("id"));
    if(sessionStorage.getItem("role")=="企业"){
      this.isFirm = true;
      this.$apollo.mutate({
        mutation:gql`
          query(
            $id:Int
          ){
            member{
              detail(
                id:$id
              ){
                username
                company{
                  id
                }
              }
            }
          }
        `,
        variables:{
          id:sessionStorage.getItem("id")
        }
      }).then(
        data=>{
          console.log(data)
        }
      ).catch(err=>{
        console.log(err)
      })
    }
  },
  methods:{
    search(){
      this.$router.push({path:"/index",query:{search:this.searchContent}})
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
          }else{
            this.$router.push({path:'/resResume'})
          }
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