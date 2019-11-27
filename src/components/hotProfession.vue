<template>
    <div class="content">
        <div class="header">
            <p>热门职业推荐</p>
        </div>
        <div class="body">
            <div class="item">
                <img src="../assets/logo.png" alt="">
                <div>
                    <p class="p">公司名称</p>
                    <p class="p">招聘职位</p>
                </div>
            </div>
            <div class="item">
                <img src="../assets/logo.png" alt="">
                <div>
                    <p class="p">公司名称</p>
                    <p class="p">招聘职位</p>
                </div>
            </div>
            <div class="item">
                <img src="../assets/logo.png" alt="">
                <div>
                    <p class="p">公司名称</p>
                    <p class="p">招聘职位</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            
        }
    },
}
</script>
<style scoped>
    .content{
        width: 200px;
        box-shadow: -5px 5px 5px #666;
    }
    .header{
        width: 100%;
        height: 50px;
        background:#DD100D;
        color: white;
        line-height: 50px;
        text-align: center;
    }
    .body{
        background:white;
    }
    .body img{
        width: 50px;
        height:50px;
    }
    .p{
        margin: 0;
    }
    .item{
        width: 100%;
        display:flex;
        align-items: center;
        margin: 5px 0;
        border-bottom: 1px solid #666;
    }
</style>