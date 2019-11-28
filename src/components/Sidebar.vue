<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" text-color="#fff" background-color="#324157" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                    {
                        icon: 'el-icon-setting',
                        index: 'adminManagement',
                        title: '管理员管理'
                    },
                    {
                        icon: 'el-icon-setting',
                        index: 'jobManagement',
                        title: '用户管理',
                        subs: [
                            {
                                index:'roleManagement',
                                title:'角色管理'
                            },
                            {
                                index: 'jobManagement',
                                title: '职位管理'
                            },
                            {
                                index: 'userResume',
                                title: '简历管理'
                            },
                            {
                                index: 'dataManagement',
                                title: '数据管理'
                            }
                        ]
                    }
                ]
            }
        },
        created(){
            if(!sessionStorage.getItem("role")=="超级管理员"){
                this.items.shift();
            }
            console.log(sessionStorage.getItem("role"))
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
