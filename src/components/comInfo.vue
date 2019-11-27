<template>
  <div class="content">
    <el-form ref="form" :model="comp" label-width="100px">
      <el-upload
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="comp.imgPath" :src="comp.imgPath" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <el-form-item label="公司名称">
        <el-input v-model="comp.name"></el-input>
      </el-form-item>
      <!-- <el-form-item label="行业">
        <el-select v-model="comp.range" placeholder="请选择">
          <el-option
            v-for="item in industryOptions"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="公司性质">
        <el-input v-model="comp.nature"></el-input>
      </el-form-item>
      <el-form-item label="公司规模">
        <el-input v-model="comp.scale"></el-input>
      </el-form-item>
      <el-form-item label="成立日期">
        <el-date-picker
          v-model="comp.foundTime"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="注册资本">
        <el-input v-model="comp.registerCapital">
            <template slot="append">万元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="法人代表">
        <el-input v-model="comp.legalPerson"></el-input>
      </el-form-item>
      <el-form-item label="公司简介">
        <el-input type="textarea" v-model="comp.introduce"></el-input>
      </el-form-item>
      <!-- <el-form-item label="活动性质">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
          <el-checkbox label="地推活动" name="type"></el-checkbox>
          <el-checkbox label="线下主题活动" name="type"></el-checkbox>
          <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="detele">格式化</el-button>
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </div>
  </div>
</template>
<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      comp: {
                  id:null,
                  name:'',
                  imgPath:'',
                  abbreviation:'',
                  describe:'',
                  introduce:'',
                  welfare:'',
                  nature:'',
                  scale:'',
                  address:'',
                  foundTime:'',
                  registerCapital:'',
                  legalPerson:'',
                  // range:'',
                  companyPosition :{
                    id:null,
                    title:'',
                    wages:'',
                    diploma:'',
                    workExp:'',
                    describe:'',
                    ask:'',
                    region:'',
                    number:'',
                    isDelete:false
                  },
                  isDelete:false
      },
      industryOptions: []
    };
  },
  created(){
    if(sessionStorage.getItem("cId")){
        this.getDetail();
      }
  },
  methods: {
    getComDetail(){

    },
    getDetail() {
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
        console.log(data)
        this.industryOptions=data.data.trade.all
      }).catch(err=>{
        console.log(err)
      })
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
                  # range
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
            id: sessionStorage.getItem("cId")
          }
        })
        .then(data => {
          console.log(data.data.company.detail)
          if(data.data.company.detail){
            this.comp = data.data.company.detail;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onSubmit(){
      console.log(this.comp);
      if(sessionStorage.getItem("cId")){
        this.comp.isDelete = false;
      this.$apollo.mutate({
        mutation:gql`
          mutation(
                $id:Int!
                $name:String
                $imgPath:String
                $abbreviation:String
                $describe:String
                $introduce:String
                $welfare:String
                $nature:String
                $scale:String
                $address:String
                $foundTime:String
                $registerCapital:String
                $legalPerson:String
                # $range:String
                $isDelete:Boolean
          ){
            company{
              update(
                id:$id
                name:$name
                imgPath:$imgPath
                abbreviation:$abbreviation
                describe:$describe
                introduce:$introduce
                welfare:$welfare
                nature:$nature
                scale:$scale
                address:$address
                foundTime:$foundTime
                registerCapital:$registerCapital
                legalPerson:$legalPerson
                # range:$range
                isDelete:$isDelete
              ){
                id
              }
            }
          }
        `,
        variables:{
                id:this.comp.id,
                name:this.comp.name,
                imgPath:this.comp.imgPath,
                abbreviation:this.comp.abbreviation,
                describe:this.comp.describe,
                introduce:this.comp.introduce,
                welfare:this.comp.welfare,
                nature:this.comp.nature,
                scale:this.comp.scale,
                address:this.comp.address,
                foundTime:this.comp.foundTime,
                registerCapital:this.comp.registerCapital,
                legalPerson:this.comp.legalPerson,
                // range:this.comp.range,
                isDelete:this.comp.isDelete
        }
      }).then(data=>{
        console.log(data)
      }).catch(err=>{
        console.log(err)
      })
      }else{
        this.comp.isDelete = false;
      this.$apollo.mutate({
        mutation:gql`
                mutation(
                  $name:String
                $imgPath:String
                $abbreviation:String
                $describe:String
                $introduce:String
                $welfare:String
                $nature:String
                $scale:String
                $address:String
                $foundTime:String
                $registerCapital:String
                $legalPerson:String
                # $range:String
                $memberId:Int
          ){
            company{
              create(
                name:$name
                imgPath:$imgPath
                abbreviation:$abbreviation
                describe:$describe
                introduce:$introduce
                welfare:$welfare
                nature:$nature
                scale:$scale
                address:$address
                foundTime:$foundTime
                registerCapital:$registerCapital
                legalPerson:$legalPerson
                # range:$range
                memberId:$memberId
              ){
                id
              }
            }
          }
        `,
        variables:{
                name:this.comp.name,
                imgPath:this.comp.imgPath,
                abbreviation:this.comp.abbreviation,
                describe:this.comp.describe,
                introduce:this.comp.introduce,
                welfare:this.comp.welfare,
                nature:this.comp.nature,
                scale:this.comp.scale,
                address:this.comp.address,
                foundTime:this.comp.foundTime,
                registerCapital:this.comp.registerCapital,
                legalPerson:this.comp.legalPerson,
                // range:this.comp.range,
                memberId:sessionStorage.getItem("id")
        }
      }).then(data=>{
        console.log(data.data.company.create.id);
        sessionStorage.setItem('cId',data.data.company.create.id);
      }).catch(err=>{
        console.log(err)
      })
      }
    },
    detele() {
      this.form = {
        imageUrl: "", //公司头像
        name: "", //公司名称
        industry: "", //行业
        nature: "", //公司性质
        scale: "", //公司规模
        time: "", //成立日期
        capital: "", //注册资本
        legal: "", //法人
        profile: "" //公司简介
      };
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
        // $(canvas).attr({
        //   width: w,
        //   height: h
        // });
        // document.getElementById("canvas").width = w;
        // document.getElementById("canvas").height = h;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(that, 0, 0, w, h);
        // 生成base64
        base64 = canvas.toDataURL("image/jpeg", quality || 0.4);
        console.log(base64);
        console.log(self.comp);
        self.comp.imgPath = base64;
        //这里可以直接将base64放在img的src上，直接就能显示图片了，这里压缩后图片的大小大概是5M压缩到了几十KB
      };
    }
  }
};
</script>
<style scoped>
.content {
  background: #eee;
  padding: 10px;
}
.avatar-uploader {
  text-align: center;
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
  border: 1px dashed #ccc !important;
  margin: 10px 0;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.dialog-footer {
  text-align: center;
}
</style>