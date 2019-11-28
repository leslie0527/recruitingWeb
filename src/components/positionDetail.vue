<template>
  <div class="content">
    <div class="com-title">
      <img :src="comp.imgPath" alt class="comIcon" />
      <div class="com-text">
        <p class="com-name">{{comp.abbreviation}}</p>
        <p class="el-icon-suitcase" style="font-size:18px">{{comp.name}}</p>
        <p class="com-int">{{comp.describe}}</p>
        <div class="welfare">
          <p>{{comp.welfare}}</p>
        </div>
      </div>
    </div>
    <div style="padding:0 10px;min-height:300px;background:#eee">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="公司介绍" name="first">{{comp.introduce}}</el-tab-pane>
        <el-tab-pane label="在招职位" name="second">
          <div  @click="pushPost(item)" style="margin-top:10px;" v-for="(item,index) of comp.companyPosition" :key="index">
            <el-row class="top">
              <el-col :span="6" style="color:#333;">{{comp.abbreviation}}</el-col>
              <el-col :span="16" style="color:#999">{{!comp.scale?"未知":comp.scale}}|{{!comp.nature?"未知":comp.nature}}|{{!comp.range?"未知":comp.range}}</el-col>
              <el-col :span="2" style="color:#999">
                <el-button v-if="role=='学生'" type="primary">投递</el-button>
              </el-col>
            </el-row>
            <el-row class="bottom">
              <el-col  :span="6" style="color:#2161bf;">{{item.title}}</el-col>
              <el-col :span="6" style="color:rgb(215,57,55)">￥{{item.wages}}元/月</el-col>
              <el-col :span="6" style="color:#333;">工作地点:{{item.region}}</el-col>
              <el-col :span="6" style="color:#333;">经验:{{item.workExp}}</el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="职位描述" name="last" v-if="postShow">
          <el-button type="primary" style="float:right" @click="delPost(postDetail)">职位不合格</el-button>
          <h2>{{this.postDetail.title}}</h2>
          <p class="gray-color">职位详情</p>
          <p class="red-color">1.薪资:{{postDetail.wages}}元/月</p>
          <p class="gray-color">2.文凭要求:{{postDetail.diploma}}</p>
          <p class="gray-color">3.经验要求:{{postDetail.workExp}}</p>
          <p class="gray-color">4.职位要求:{{postDetail.ask}}</p>
          <p class="gray-color">5.工作城市:{{postDetail.region}}</p>
          <p class="gray-color">6.职位描述:{{postDetail.describe}}</p>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div style="position:fixed;right:0;top:400px">
      <hot-profession></hot-profession>
    </div>
  </div>
</template>
<script>
import hotProfession from "./hotProfession";
import gql from "graphql-tag";
import { isBoolean } from 'util';
export default {
  data() {
    return {
      role:"",
      activeName: "first",
      id:"",
      cId: "",
      comp:{},
      postDetail:{},
      postShow:false
    };
  },
  components: {
    "hot-profession": hotProfession
  },
  watch:{
    $route(to,from){
      this.getUrl();
    }
  },
  created() {
    this.role = sessionStorage.getItem("role");
    this.getUrl();
  },
  methods: {
    getUrl(){
          this.cId = this.$route.query.cId;
      if(this.$route.query.id){
        this.id = this.$route.query.id;
        this.activeName = "last";
        this.postShow = true;
        this.getPostDetail();
      }
      this.getDetail();
    },
    getPostDetail(){
      this.$apollo.mutate({
        mutation:gql`
          query($id:Int){
            companyPosition{
              detail(id:$id){
                id
                title
                wages
                diploma
                workExp
                describe
                ask
                region
                isDelete
              }
            }
          }
        `,
        variables:{
          id:this.id
        }
      }).then(data=>{
        this.postDetail=data.data.companyPosition.detail;
      })
      .catch(err=>{})
    },
    handleClick(tab, event) {
    },
    send(){

    },
    pushPost(item){
      console.log(item.id);
      this.$router.push({path:"/positionDetail",query:{cId:this.cId,id:item.id}})
    },
    delPost(postDetail){
      console.log(postDetail.id);
      this.$apollo.mutate({
        mutation:gql`
        mutation($id:Int!){
          companyPosition{
            update(
              id:$id
            isDelete:true){
              id
            }
          }
        }
        `,
        variables:{
          id:postDetail.id
        }
      }).then(data=>{
      // this.$router.push({path:"/positionDetail",query:{cId:this.cId,id:item.id}})
      this.$router.push({path:"/positionDetail",query:{cId:this.cId}})
      }).catch(err=>{console.log(err)})
    },
    getDetail() {
      this.$apollo
        .mutate({
          mutation: gql`
            query($id:Int){
              company {
                detail(id: $id) {
                  id
                  name
                  imgPath
                  abbreviation
                  describe
                  introduce
                  welfare
                  nature
                  scale
                  address
                  foundTime
                  registerCapital
                  legalPerson
                  range
                  companyPosition {
                    id
                    title
                    wages
                    diploma
                    workExp
                    describe
                    ask
                    region
                    number
                    isDelete
                  }
                  isDelete
                }
              }
            }
          `,
          variables: {
            id: this.cId
          }
        })
        .then(data => {
          if(!data.data.company.detail){
            this.$router.push({path:"/comInfo"})
          }
          this.comp = data.data.company.detail;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
.content {
  box-shadow: 5px 5px 10px #333;
}
.comIcon {
  width: 160px;
  height: 160px;
  border: 2px solid #ccc;
  margin: 20px;
}
.com-title {
  display: flex;
  height: 200px;
  background: #ccc;
  align-items: center;
  padding: 20px;
}
.welfare {
  display: flex;
  font-size: 10px;
}
.welfare p {
  border: 1px solid #666;
  padding: 2px 4px;
  margin-right: 10px;
}
.com-text {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  color: #666;
}
.com-name {
  font-size: 30px;
  font-weight: bolder;
  color: #295266;
}
.com-int {
  color: #999;
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
/* p {
  margin: 0;
} */
.red-color{
 color: #fa6a43;
 margin: 4px 0;
}
.gray-color{
  color:#61687c;
  margin: 4px 0;
}
</style>