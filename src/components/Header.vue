<template>
    <div class="header">
        <div class="logo">登录管理系统</div>
        <div class="user-info">
                <span class="el-dropdown-link">
                    <!-- <img class="user-logo" src="../../../static/img/img.jpg"> -->
                    {{username}}
                </span>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                name: 'admin'
            }
        },
        created(){
            if(!sessionStorage.getItem("username")){
                this.$router.push({path:"/"});
            }
        },
        computed:{
            username(){
                let username = sessionStorage.getItem('username');
                return username ? username : this.name;
            }
        },
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
        background: #242f42;
    }
    .header .logo{
        float: left;
        width:250px;
        text-align: center;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
