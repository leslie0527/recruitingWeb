<template>
  <div>
    <div class="header">
      <img src="../assets/logo.png" class="logo" />
      <span class="title">{{title}}</span>
    </div>
    <div class="body">
      <div class="form">
        <div class="login">
          <div>
            <el-input v-model="form.username" placeholder="用户名称"></el-input>
            <p class="warn-text">用户名为4到16位，不包含特殊字符</p>
          </div>
          <div>
            <el-input v-model="form.userpwd" type="password" placeholder="用户密码"></el-input>
            <p class="warn-text">密码包含 数字,英文,字符中的两种以上，长度6-20</p>
          </div>
          <el-input
            style="margin-bottom:10px"
            v-model="form.userpwd2"
            type="password"
            v-show="!isLogin"
            placeholder="请重复密码"
          ></el-input>
          <el-button type="danger" v-if="isLogin" @click="login">登陆</el-button>
          <el-button type="danger" v-else @click="register">注册</el-button>
        </div>
        <div class="to-reg">
          <p style="font-size:14px;color:#666">还没有账号？</p>
          <p class="el-icon-d-arrow-right" style="color:#0ba6c2" @click="toReg">{{toRegText}}</p>
          <p style="color:#0ba6c2">企业登陆入口</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  //引入组件
import gql from "graphql-tag";
export default {
  data() {
    return {
      form: {
        username: "",
        userpwd: "",
        userpwd2: ""
      },
      usernameReg: /^[a-zA-Z0-9_-]{4,16}$/,
      userpwdReg: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$/,
      isLogin: true,
      toRegText: "立即注册",
      title: "求职者登陆"
    };
  },
  methods: {
    //切换登陆，注册
    toReg() {
      this.isLogin = !this.isLogin;
      if (this.isLogin) {
        this.toRegText = "立即注册";
        this.title = "求职者登陆";
      } else {
        this.toRegText = "立即登陆";
        this.title = "求职者注册";
      }
      this.username = "";
      this.userpwd = "";
      this.userpwd2 = "";
    },
    //登陆
    login() {
      // console.log(this.form);
      if (!this.usernameReg.test(this.form.username)) {
        this.$message.error("账户名格式错误，请核对后再试");
        return;
      }
      if (!this.userpwdReg.test(this.form.userpwd)) {
        this.$message.error("密码格式错误，请核对后再试");
        return;
      }
      this.$apollo
        .mutate({
          mutation: gql`
            query($username: String, $password: String) {
              member {
                login(username: $username, password: $password) {
                  id
                  username
                  role
                  company{
                    id
                  }
                  memberResume{
                    id
                  }
                }
              }
            }
          `,
          variables: {
            username: this.form.username,
            password: this.form.userpwd
          }
        })
        .then(data => {
          console.log(data.data.member.login);
          this.$message({message:"登陆成功，即将跳转",type:"success"})
          console.log(data.data.member.login);
          sessionStorage.setItem("username",data.data.member.login.username);
          sessionStorage.setItem("id",data.data.member.login.id);
          sessionStorage.setItem("role",data.data.member.login.role);
          if(data.data.member.login.role=='企业'){
            // console.log(data.data.member.login.company.id);
            if(data.data.member.login.company){
              // console.log(true);
              sessionStorage.setItem("cId",data.data.member.login.company.id);
            }
            
          }else{
            // console.log(data.data.member.login.memberResume.id)
            if(data.data.member.login.memberResume){
              sessionStorage.setItem("mId",data.data.member.login.memberResume.id);
            }
          }
          this.$router.push({path:"/index"});
        })
        .catch(err => {
          console.log(err);
          this.$message.error("账号或密码错误，请重新登陆");
        });
    },
    //注册
    register() {
      if (!this.usernameReg.test(this.form.username)) {
        this.$message.error("账户名格式错误，请核对后再试");
        return;
      }
      if (!this.userpwdReg.test(this.form.userpwd)) {
        this.$message.error("密码格式错误，请核对后再试");
        return;
      }
      if (this.form.userpwd !== this.form.userpwd2) {
        this.$message.error("两次密码不同,请核对后再试");
        return;
      }
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($username: String, $password: String) {
              member {
                register(username: $username, password: $password) {
                  id
                  username
                }
              }
            }
          `,
          variables: {
            username: this.form.username,
            password: this.form.userpwd
          }
        })
        .then(data => {
          // console.log(data);
          this.$message({ message: "注册成功，请登陆！", type: "success" });
          // this.form = {};
        })
        .catch(err => {
          // console.log(err);
          this.$message.error("用户名已存在，注册失败！");
        });
    }
  }
};
</script>
<style scoped>
.header {
  color: #666;
  font-size: 24px;
  /* margin-left:200px; */
  height: 100px;
  display: flex;
  align-items: center;
}
.logo {
  width: 180px;
  height: 100px;
}
.body {
  width: 100%;
  height: 500px;
  background: #f4ebe0;
  /* background: url("../assets/bgimg.jpg") no-repeat; */
  background-size: 100%;
}
.body::before {
  display: table;
  content: "";
}
.form {
  margin-top: 100px;
  margin-left: 60%;
  padding: 10px;
  width: 380px;
  /* height: 300px; */
  background: white;
  display: flex;
  /* flex-direction: column; */
}
.warn-text {
  font-size: 8px;
  color: #999;
  margin-top: 2px;
}
.to-reg {
  width: 30%;
  border-left: 1px dashed #999;
  padding: 10px;
}
.login {
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px;
}
</style>