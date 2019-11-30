<template>
  <div style="box-shadow:5px 5px 10px #ccc">
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#d73937"
      text-color="#fff"
      active-text-color="#fff"
      v-if="!isComp"
    >
      <el-submenu index="2">
        <template slot="title">热门职业</template>
        <el-menu-item index="2-1">热门职业选项</el-menu-item>
      </el-submenu>
      <!--行业读取trade接口然后循环。-->
      <!-- <el-menu-item index="1">行业</el-menu-item> -->
      <!--点击行业筛选职位-->
    </el-menu>
    <div class="welfare" v-if="!isComp">
      <div class="welfare-list">
        <span class="welfare-title">福利</span>
        <el-checkbox v-model="checked" @change="allList" style="margin:0 20px">不限</el-checkbox>
        <el-checkbox-group v-model="checkList" @change="searchList">
          <el-checkbox label="五险">五险</el-checkbox>
          <el-checkbox label="公积金">公积金</el-checkbox>
          <el-checkbox label="包吃">包吃</el-checkbox>
          <el-checkbox label="包住">包住</el-checkbox>
          <el-checkbox label="周末双休">周末双休</el-checkbox>
          <el-checkbox label="带薪年假">带薪年假</el-checkbox>
          <el-checkbox label="交通补助">交通补助</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="line"></div>
    <div class="welfare" v-if="!isComp">
      <div class="welfare-list">
        <span class="welfare-title">职业</span>
        <!-- <el-checkbox v-model="checked" style="margin:0 20px">不限</el-checkbox>
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="复选框 A">不限</el-checkbox>
          <el-checkbox label="复选框 B">不限</el-checkbox>
          <el-checkbox label="复选框 C">不限</el-checkbox>
          <el-checkbox label="复选框 D">不限</el-checkbox>
        </el-checkbox-group>-->
        <div style="margin:0 20px">
          <el-radio v-for="(item,key) of tradeOptions" :key="key" v-model="radio" @change="checkTrade(item.id)" :label="item.id">{{item.name}}</el-radio>
          <!-- <el-radio v-model="radio" label="2">备选项</el-radio> -->
        </div>
      </div>
    </div>
    <div v-if="!isComp">
      <div
      style="margin-top:10px;box-shadow:5px 5px 10px #ccc"
      v-for="(item,index) in indexList"
      :key="index"
      v-show="!item.isDelete"
    >
      <el-row class="top">
        <router-link :to="{path:'/positionDetail',query:{cId:item.companyId}}">
          <el-col :span="6" style="color:#333;">{{item.company?item.company.name:"未知"}}</el-col>
        </router-link>
        <el-col
          :span="16"
          style="color:#999"
        >{{!item.company?"未知":item.company.scale}}|{{!item.company?"未知":item.company.nature}}|{{!item.profession?"未知":item.profession.name}}</el-col>
        <el-col :span="2" style="color:#999">
          <!--判断当前帐号是否为公司是隐藏-->
          <el-button type="primary" v-if="role=='学生'" @click="send(item.id,item.companyId)">投递</el-button>
          <!---->
        </el-col>
      </el-row>
      <el-row class="bottom">
        <router-link :to="{path:'/positionDetail',query:{cId:item.companyId,id:item.id}}">
        <el-col :span="6" style="color:#2161bf;">{{item.title}}</el-col>
        </router-link>
        <el-col :span="6" style="color:rgb(215,57,55)">￥{{item.wages}}</el-col>
        <el-col :span="6" style="color:#333;">工作地点:{{item.region}}</el-col>
        <el-col :span="6" style="color:#333;">经验:{{item.workExp}}</el-col>
        <!-- <el-col :span="4"  style="color:#999;">昨天</el-col> -->
      </el-row>
    </div>
    </div>
    <div v-else style="margin-top:10px;box-shadow:5px 5px 10px #ccc">
          <el-row  v-for="item in resumeList" :key="item.id" class="top">
        <el-col :span="4">姓名:{{item.name}}</el-col>
        <el-col :span="5">手机号码:{{item.mobile}}</el-col>
        <el-col :span="3">性别:{{item.sex==10?"男":"女"}}</el-col>
        <el-col :span="3">年龄:{{item.arg}}岁</el-col>
        <el-col :span="3">工作经验:{{item.workExp}}</el-col>
        <el-col :span="3">意向职位:{{item.position}}</el-col>
        <el-col :span="3">
          <el-button type="primary" @click="handleClick(item)">简历详情</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="btn-flex">
      <el-button @click="prev" :disabled="disabled1">上一页</el-button>
      <el-button @click="next" :disabled="disabled2">下一页</el-button>
    </div>
    <div style="position:fixed;right:0;top:400px">
      <hot-profession></hot-profession>
    </div>
  </div>
</template>
<script>
import hotProfession from "./hotProfession";
import gql from "graphql-tag";
export default {
  data() {
    return {
      tId:null,
      activeIndex: "1",
      activeIndex2: "1",
      disabled1:false,
      disabled2:false,
      checked: true,
      isComp:false,
      checkList: [],
      indexList: [],
      tradeOptions:[],
      resumeList:[],
      radio: "1",
      search: "",
      page:1,
      role:""
    };
  },
  components: {
    "hot-profession": hotProfession
  },
  created() {
    this.role=sessionStorage.getItem("role");
    if(this.role=="企业"){
      this.searchResume();
      this.isComp=true;
    }else{
        this.searchList();
        this.tradeOption();
    }
  },
  watch: {
    $route(to, from) {
      if(this.role=="企业"){
        this.searchResume();
      }else{
        this.searchList();
      }
    }
  },
  methods: {
    checkTrade(id){
      console.log(id);
      this.tId= id;
      this.searchList();
    },
    handleClick(item){
      console.log(item);
      this.$router.push({path:"/myResume",query:{id:item.memberId}})
    },
    searchResume(){
      console.log(this.$route.query.searchResume)
      if(this.$route.query.searchResume){
      this.$apollo.mutate({
        mutation:gql`
          query($page:Int,$positionType:String){
        memberResume{
          search(
            page:$page
            positionType:$positionType
          ){
               id
              name
              mobile
              sex
              arg
              workExp
              position
              memberId
              }
            }
          }
        `,
        variables:{
          page:this.page,
          positionType:this.$route.query.searchResume
        }
      }).then(data=>{
        this.resumeList = data.data.memberResume.search;
        console.log(this.resumeList);
      }).catch(err=>{
        console.log(err);
      })
      }else{
        this.$apollo.mutate({
        mutation:gql`
          query($page:Int){
        memberResume{
          search(
            page:$page
          ){
               id
              name
              mobile
              sex
              arg
              workExp
              position
              memberId
              }
            }
          }
        `,
        variables:{
          page:this.page
        }
      }).then(data=>{
        this.resumeList = data.data.memberResume.search;
        console.log(this.resumeList);
      }).catch(err=>{
        console.log(err);
      })
      }
    },
    tradeOption(){
      this.$apollo.mutate({
        mutation:gql`
        query{
          trade{
            all{
              id
              name
            }
          }
        }
        `
      }).then(data=>{
        console.log(data.data.trade.all);
        this.tradeOptions=data.data.trade.all;
      }).catch(err=>{
        console.log(err)
      })
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    searchList() {
      let item=null;
      console.log(this.checkList);
      if(this.checkList.length>0){
        this.checked = false
        for(let i of this.checkList){
          item+=i;
        }
      }else{
        this.checked = true
      }
      this.search = this.$route.query.search;
      console.log(item);
      if (this.search) {
        this.$apollo
          .mutate({
            mutation: gql`
              query(
                $title: String
                $page:Int
                $welfare:String
              ) {
                companyPosition {
                  search(
                    title: $title
                    page:$page
                    welfare:$welfare
                  ) {
                    id
                    title
                    wages
                    diploma
                    workExp
                    describe
                    region
                    isDelete
                    number
                    profession{
                      name
                    }
                    companyId
                    company {
                      name
                      nature
                      scale
                      # range
                      welfare
                    }
                  }
                }
              }
            `,
            variables: {
              title: this.search,
              page:this.page,
              welfare:item
            }
          })
          .then(data => {
            console.log(data);
            this.indexList = data.data.companyPosition.search;
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$apollo
          .mutate({
            mutation: gql`
              query(
                $page:Int
                $tradeId:Int
              ){
                companyPosition {
                  search(
                    page:$page
                    tradeId:$tradeId
                  ){
                    id
                    title
                    wages
                    diploma
                    workExp
                    describe
                    region
                    isDelete
                    number
                    profession{
                      name
                    }
                    companyId
                    company {
                      name
                      nature
                      scale
                      # range
                      welfare
                    }
                  }
                }
              }
            `,
            variables:{
              // welfare:item
              page:this.page,
              tradeId:this.tId
            }
          })
          .then(data => {
            console.log(data);
            this.indexList = data.data.companyPosition.search;
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    send(id,cId){
      console.log(id,cId);
      this.$apollo.mutate({
        mutation:gql`
          mutation(
                $companyId:Int
                $companyPositionId:Int
                $memberResumeId:Int
                $memberId:Int
          ){
            memberDelivery{
              create(
                companyId:$companyId
                companyPositionId:$companyPositionId
                memberResumeId:$memberResumeId
                memberId:$memberId
              ){
                id
              }
            }
          }
        `,
        variables:{
          companyId:cId,
          companyPositionId:id,
          memberResumeId:sessionStorage.getItem("mId"),
          memberId:sessionStorage.getItem("id")
        }
      }).then(data=>{
        console.log(data)
        this.$message({
          message:"简历投递成功",
          type:"success"
        })
      }).catch(err=>{
        console.log(err)
      })
    },
    allList(){
      // this.checked = !this.checked
      this.checkList = []
      this.searchList();
    },
    prev(){
      if(this.page==1){
        this.disabled1 = true;
        return;
      }
      this.page--;
      this.disabled2 = false;
      if(this.role=="企业"){
        this.searchResume();
      }else{
      this.searchList();
      }
    },
    next(){
      if(this.role=="企业"){
        if(this.resumeList.length<10){
          this.disabled2=true;
        }
        this.page++;
        this.disabled1 =false;
        this.searchResume();
      }else{
      if(this.indexList.length<10){
        this.disabled2=true;
      }
      this.page++;
      this.disabled1 =false;
      this.searchList();
      }
    }
  }
};
</script>
<style scoped>
.welfare-list {
  width: 100%;
  /* height: 30px; */
  line-height: 30px;
  padding-left: 30px;
  display: flex;
}
.welfare {
  background: #dedede;
  padding: 5px 0;
}
.welfare::before {
  display: table;
  content: "";
}
.welfare-title {
  padding-right: 10px;
  border-right: 1px solid #666;
  margin-right: 10px;
  color: #333;
  font-weight: bolder;
}
.line {
  width: 100%;
  height: 2px;
}
.top {
  background: #ccc;
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
  font-size: 14px;
}
.top div:hover {
  color: rgb(215, 57, 55);
}
.bottom div:hover {
  color: rgb(215, 57, 55);
}
.bottom {
  background: #eee;
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
  font-size: 16px;
}
.btn-flex{
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
</style>