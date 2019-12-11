<template>
  <div class="content">
    <div v-if="!isResume">
      <el-button type="primary" @click="createResume">创建简历</el-button>
    </div>

    <div v-else>
      <el-button type="primary" style="float:right" @click="updateResume" v-if="isUser">修改简历</el-button>
      <el-button type="primary" style="float:right" @click="delResume" v-if="isUser">删除当前简历</el-button>
      <div class="userIcon">
        <img :src="form.imgPath" />
      </div>
      <p class="user-name">
        <span>{{form.name}}</span> |
        <span>{{form.sex==10?"男":"女"}}</span> |
        <span>{{form.workExp}}</span> |
        <span>{{form.height}}cm</span>
      </p>
      <p>现居地:{{form.address}}</p>
      <p>
        <span>手机号:{{form.mobile}}</span>
        <span>邮箱:{{form.email}}</span>
      </p>
      <p>
        <span>{{form.isPost==10?"立即到岗":"到岗时间再议"}}</span>
        <span>{{form.positionState==10?"离职":"在职"}}</span>
      </p>
      <h5 class="title">求职意向</h5>
      <div class="line"></div>
      <el-row class="intent">
        <el-col :span="12">期望薪资:{{form.wages}}元/月</el-col>
        <el-col :span="12">期望工作地点:{{form.hopeAddress}}</el-col>
        <el-col :span="12">意向职位类别:{{form.positionType}}</el-col>
        <el-col :span="12">意向职位:{{form.position}}</el-col>
        <el-col :span="12">行业类型:{{form.post}}</el-col>
        <el-col :span="12">岗位级别:{{form.post}}</el-col>
      </el-row>
      <h5 class="title">工作/实习经历</h5>
      <div class="line"></div>
      <el-timeline class="exper">
        <el-timeline-item :timestamp="form.memberResumes.startTime" placement="top">
          <el-card>
            <h4>公司名称:{{form.memberResumes.companyName}}</h4>
            <p>工作内容:{{form.memberResumes.content}}</p>
            <p>工资:{{form.memberResumes.wages}}</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item :timestamp="form.memberResumes.endTime" placement="top"></el-timeline-item>
      </el-timeline>
      <h5 class="title">教育/培训经历</h5>
      <div class="line"></div>
      <el-timeline class="exper">
        <el-timeline-item :timestamp="form.memberResumes.entrancesTime" placement="top">
          <el-card>
            <h4>学校:{{form.memberResumes.school}}</h4>
            <p>学历:{{form.memberResumes.education}}</p>
            <p>专业名称:{{form.memberResumes.major}}</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item :timestamp="form.memberResumes.entrancedTime" placement="top"></el-timeline-item>
      </el-timeline>
      <h5 class="title">技能专长</h5>
      <div class="line"></div>
      <div class="show-box">{{form.memberResumes.skill}}</div>
      <h5 class="title">自我评价</h5>
      <div class="line"></div>
      <div class="show-box">{{form.memberResumes.evaluate}}</div>
      <h5 class="title">其他信息</h5>
      <div class="line"></div>
      <div class="show-box">{{form.memberResumes.other}}</div>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <!-- <el-form-item label="用户头像" :label-width="formLabelWidth"> -->
        <!-- <el-input v-model="form.imgPath" autocomplete="off"></el-input> -->
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.imgPath" :src="form.imgPath" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <!-- </el-form-item> -->
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off" type="number"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio-group v-model="form.sex" size="small">
            <el-radio label="10" border>男</el-radio>
            <el-radio label="20" border>女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身高" :label-width="formLabelWidth">
          <el-input v-model="form.height" autocomplete="off" type="number">
            <template slot="append">cm</template>
          </el-input>
        </el-form-item>
        <el-form-item label="年纪" :label-width="formLabelWidth">
          <el-input v-model="form.arg" autocomplete="off" type="number"></el-input>
        </el-form-item>
        <el-form-item label="工作经验" :label-width="formLabelWidth">
          <el-input v-model="form.workExp" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否立即到岗" :label-width="formLabelWidth">
          <el-radio-group v-model="form.isPost" size="small">
            <el-radio label="10" border>是</el-radio>
            <el-radio label="20" border>否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否在职" :label-width="formLabelWidth">
          <el-radio-group v-model="form.positionState" size="small">
            <el-radio label="10" border>离职</el-radio>
            <el-radio label="20" border>在职</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="意向职位" :label-width="formLabelWidth">
          <el-input v-model="form.position" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="意向职位类别" :label-width="formLabelWidth">
          <el-input v-model="form.positionType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="意向工作地点" :label-width="formLabelWidth">
          <el-input v-model="form.hopeAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="行业类别" :label-width="formLabelWidth">
          <el-select v-model="form.positionType" placeholder="请选择">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="期望工作地点" :label-width="formLabelWidth">
          <el-input v-model="form.hopeAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="期望薪资" :label-width="formLabelWidth">
          <el-input v-model="form.wages" autocomplete="off"></el-input>
        </el-form-item>
        <h5>工作/实习经历</h5>
        <div class="line"></div>
        <el-form-item label="公司名称" :label-width="formLabelWidth">
          <el-input v-model="form.memberResumes.companyName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="在职时间" :label-width="formLabelWidth">
          <div class="date-flex">
            <el-date-picker v-model="form.memberResumes.startTime" type="date" placeholder="选择日期"></el-date-picker>-
            <el-date-picker v-model="form.memberResumes.endTime" type="date" placeholder="选择日期"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="职位名称" :label-width="formLabelWidth">
          <el-input v-model="form.memberResumes.positionName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="任职部门" :label-width="formLabelWidth">
          <el-input v-model="form.memberResumes.serving" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="职位性质" :label-width="formLabelWidth">
          <el-select v-model="form.memberResumes.positionType" placeholder="请选择">
            <el-option v-for="item in option" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平均薪资" :label-width="formLabelWidth">
          <el-input v-model="form.memberResumes.wages" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工作内容" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.memberResumes.content" autocomplete="off"></el-input>
        </el-form-item>
        <h5>教育/培训经历</h5>
        <div class="line"></div>
        <el-form-item label="学校名称" :label-width="formLabelWidth">
          <el-input v-model="form.memberResumes.school" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学历" :label-width="formLabelWidth">
          <el-select v-model="form.memberResumes.education" placeholder="请选择">
            <el-option
              v-for="item in educOption"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业名称" :label-width="formLabelWidth">
          <el-input v-model="form.memberResumes.major" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="就读时间" :label-width="formLabelWidth">
          <div class="date-flex">
            <el-date-picker v-model="form.memberResumes.entrancesTime" type="date" placeholder="选择日期"></el-date-picker>-
            <el-date-picker v-model="form.memberResumes.entrancedTime" type="date" placeholder="选择日期"></el-date-picker>
          </div>

        </el-form-item>
        <el-form-item label="自我评价" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.memberResumes.evaluate" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="技能专长" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.memberResumes.skill" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="其他信息" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.memberResumes.other" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      id:null,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      dialogTitle: "简历修改",
      isResume: false,
      isUser:false,
      form: {
        // imgPath:"",//头像
        // name:"",//姓名
        // mobile:"",//手机号
        // sex:10,//性别
        // arg:10,//年纪
        // address:"",//地址
        // email:"",//邮箱
        // isPost:10,//是否立即到岗
        // positionState:10,//是否在职
        // workExp:"",//经验
        // height:"",//身高
        // position: "", //职位
        // positionType: "", //类别
        // hopeAddress:"",//工作地点
        // industry: "", //行业
        // site: "", //工作地点
        // wages: "", //期望薪资
        // comName: "", //公司名称
        // time: "", //在职时间
        // historyPost: "", //公司职位
        // historyDepart: "", //任职部门
        // nature: "", //职位性质
        // historySaraly: "", //平均薪资
        // jobContent: "", //工作内容
        // school: "", //学校名称
        // educ: "", //学历
        // spec: "", //专业名称
        // schoolTime: "", //就读时间
        // self:"",//自我评价
        // skill:"",//技能
        // else:""//其他信息
        memberResumes:{}
      },
      options: [
        {
          id: 1,
          name: "建筑"
        }
      ],
      option: [
        {
          id: 1,
          name: "兼职"
        },
        {
          id: 2,
          name: "全职"
        }
      ],
      educOption: [
        {
          id: 1,
          name: "大专"
        },
        {
          id: 2,
          name: "本科"
        },
        {
          id: 3,
          name: "硕士"
        },
        {
          id: 4,
          name: "博士"
        }
      ]
    };
  },
  created() {
    // if(!sessionStorage.getItem("id")){
    //   this.$router.push({path:'/'})
    // }
    if(this.$route.query.id){
      this.id = this.$route.query.id
    }else{
      this.id = sessionStorage.getItem("id")
      this.isUser=true;
    }
    // console.log(this.id);
    this.getResume(); 
  },
  methods: {
    getResume() {
      this.$apollo
        .mutate({
          mutation: gql`
            query($id: Int) {
              memberResume {
                search(memberId: $id) {
                  id
                  imgPath
                  name
                  mobile
                  sex
                  arg
                  school
                  workExp
                  height
                  address
                  email
                  isPost
                  positionState
                  wages
                  hopeAddress
                  positionType
                  position
                  post
                  memberResumes {
                    companyName
                    startTime
                    endTime
                    serving
                    positionType
                    wages
                    content
                    school
                    education
                    major
                    entrancesTime
                    entrancedTime
                    evaluate
                    skill
                    other
                    memberResumeId
                  }
                  memberId
                  isDelete
                }
              }
            }
          `,
          variables: {
            id: this.id
          }
        })
        .then(data => {
          console.log(data);
          if (data.data.memberResume.search.length >= 1) {
          console.log(data.data.memberResume.search[0]);
          this.form = data.data.memberResume.search[0];
            this.isResume = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //显示修改表单
    updateResume() {
      this.dialogTitle = "简历修改";
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    delResume(){
      this.$confirm('确认删除当前简历？')
          .then(_ => {
            this.form.isDelete = 1;
            this.onSubmit();
          })
          .catch(_ => {});
    },
    createResume() {
      this.dialogTitle = "简历创建";
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    onSubmit() {
      console.log(this.form);
      let mobeilReg = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
      let emailReg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/;
      if (!mobeilReg.test(this.form.mobile)) {
        this.$message.error("电话号码填写错误");
        return;
      }
      if (!emailReg.test(this.form.email)) {
        this.$message.error("邮箱地址填写错误");
        return;
      }
      if(this.dialogTitle=="简历创建"){
        this.$apollo.mutate({
          mutation:gql`
            mutation(
                  $imgPath:String
                  $name:String
                  $mobile:String
                  $sex:Int
                  $arg:Int
                  $school:String
                  $workExp:String
                  $height:Int
                  $address:String
                  $email:String
                  $isPost:Int
                  $positionState:Int
                  $wages:String
                  $hopeAddress:String
                  $positionType:String
                  $position:String
                  $post:String
                  $memberId:Int
            ){
              memberResume{
                create(
                  imgPath:$imgPath
                  name:$name
                  mobile:$mobile
                  sex:$sex
                  arg:$arg
                  school:$school
                  workExp:$workExp
                  height:$height
                  address:$address
                  email:$email
                  isPost:$isPost
                  positionState:$positionState
                  wages:$wages
                  hopeAddress:$hopeAddress
                  positionType:$positionType
                  position:$position
                  post:$post
                  memberId:$memberId
                ){
                  id
                }
              }
            }
          `,
          variables:{
                  imgPath:this.form.imgPath,
                  name:this.form.name,
                  mobile:this.form.mobile,
                  sex:this.form.sex,
                  arg:this.form.arg,
                  school:this.form.school,
                  workExp:this.form.workExp,
                  height:this.form.height,
                  address:this.form.address,
                  email:this.form.email,
                  isPost:this.form.isPost,
                  positionState:this.form.positionState,
                  wages:this.form.wages,
                  hopeAddress:this.form.hopeAddress,
                  positionType:this.form.positionType,
                  position:this.form.position,
                  post:this.form.post,
                  memberId:this.id
          }
        }).then(data=>{
          console.log(data)
          this.$apollo.mutate({
            mutation:gql`
              mutation(
                    $positionType:String
                    $wages:String
                    $content:String
                    $school:String
                    $education:String
                    $major:String
                    $entrancesTime:String
                    $entrancedTime:String
                    $evaluate:String
                    $skill:String
                    $other:String
                    $memberResumeId:Int
              ){
                memberResumes{
                  create(
                    positionType:$positionType
                    wages:$wages
                    content:$content
                    school:$school
                    education:$education
                    major:$major
                    entrancesTime:$entrancesTime
                    entrancedTime:$entrancedTime
                    evaluate:$evaluate
                    skill:$skill
                    other:$other
                    memberResumeId:$memberResumeId
                  ){
                    id
                  }
                }
              }
            `,
            variables:{
                    positionType:this.form.memberResumes.positionType,
                    wages:this.form.memberResumes.wages,
                    content:this.form.memberResumes.content,
                    school:this.form.memberResumes.school,
                    education:this.form.memberResumes.education,
                    major:this.form.memberResumes.major,
                    entrancesTime:this.form.memberResumes.entrancesTime,
                    entrancedTime:this.form.memberResumes.entrancedTime,
                    evaluate:this.form.memberResumes.evaluate,
                    skill:this.form.memberResumes.skill,
                    other:this.form.memberResumes.other,
                    memberResumeId:data.data.memberResume.create.id
            }
          }).then(data=>{
            console.log(data)
            this.$message({
            message:"简历创建成功",
            type:"success"
          });
          history.go(0);
          }).catch(err=>{
            console.log(err)
          })
        }).catch(err=>{
          console.log(err)
        })
      }else{
          this.$apollo
        .mutate({
          mutation: gql`
            mutation(
                  $id:Int!
                  $imgPath:String
                  $name:String
                  $mobile:String
                  $sex:Int
                  $arg:Int
                  $school:String
                  $workExp:String
                  $height:Int
                  $address:String
                  $email:String
                  $isPost:Int
                  $positionState:Int
                  $wages:String
                  $hopeAddress:String
                  $positionType:String
                  $position:String
                  $post:String
                  $memberId:Int
                  $isDelete:Boolean
            ){
              memberResume{
                update(
                  id:$id
                  imgPath:$imgPath
                  name:$name
                  mobile:$mobile
                  sex:$sex
                  arg:$arg
                  school:$school
                  workExp:$workExp
                  height:$height
                  address:$address
                  email:$email
                  isPost:$isPost
                  positionState:$positionState
                  wages:$wages
                  hopeAddress:$hopeAddress
                  positionType:$positionType
                  position:$position
                  post:$post
                  memberId:$memberId
                  isDelete:$isDelete
                ){
                  id
                }
              }
            }
          `,
          variables:{
                  id:this.form.id,
                  imgPath:this.form.imgPath,
                  name:this.form.name,
                  mobile:this.form.mobile,
                  sex:this.form.sex,
                  arg:this.form.arg,
                  school:this.form.school,
                  workExp:this.form.workExp,
                  height:this.form.height,
                  address:this.form.address,
                  email:this.form.email,
                  isPost:this.form.isPost,
                  positionState:this.form.positionState,
                  wages:this.form.wages,
                  hopeAddress:this.form.hopeAddress,
                  positionType:this.form.positionType,
                  position:this.form.position,
                  post:this.form.post,
                  memberId:this.form.memberId,
                  isDelete:this.form.isDelete?true:false
          }
        })
        .then(data => {
          console.log(data);
        })
        .catch(err => {
          console.log(err);
        });
      }
      // console.log(this.form.imgPath)
      
      this.dialogFormVisible = false;
    },
    handleAvatarSuccess(res, file) {
      this.cutImageBase64(file.raw, 400, 0);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 将头像图片转为base64格式字符串
    cutImageBase64(m_this, wid, quality) {
      var file = m_this;
      var URL = window.URL || window.webkitURL;
      var blob = URL.createObjectURL(file);
      var base64;
      var img = new Image();
      img.src = blob;
      let self = this;
      img.onload = function() {
        var that = this;
        //生成比例
        var w = that.width,
          h = that.height,
          scale = w / h;
        w = wid || w;
        h = w / scale;
        //生成canvas
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = w;
        canvas.height = h;
        console.log(w, h);
        ctx.drawImage(that, 0, 0, w, h);
        // 生成base64
        base64 = canvas.toDataURL("image/jpeg", quality || 0.8);
        console.log(base64);
        console.log(self.form);
        self.form.imgPath = base64;
        //这里可以直接将base64放在img的src上，直接就能显示图片了，这里压缩后图片的大小大概是5M压缩到了几十KB
      };
    }
  }
};
</script>
<style scoped>
.content {
  width: 100%;
  background: #eee;
  padding: 20px;
  text-align: center;
}
.userIcon {
  width: 90px;
  height: 90px;
  text-align: center;
  margin: auto;
}
.userIcon img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid #ccc;
}
.user-name {
  text-align: center;
}
.title {
  text-align: left;
}
.line {
  width: 100%;
  height: 1px;
  background: #999;
  margin: 10px 0;
}
.intent {
  text-align: left;
}
.intent > div {
  height: 30px;
  line-height: 30px;
}
.exper {
  text-align: left;
  margin: 20px;
}
.show-box {
  width: 90%;
  min-height: 100px;
  background: white;
  border-radius: 5px;
  word-wrap: break-word;
  margin: auto;
  padding: 10px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.date-flex {
  display: flex;
}
</style>