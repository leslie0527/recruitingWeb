<template>
    <div>
        <h3>职位发布</h3>
        <el-form :model="form" label-width="100px">
            <el-form-item label="职位名称" :label-width="formLabelWidth">
                <el-input v-model="form.title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="薪资" :label-width="formLabelWidth">
                <el-input v-model="form.wages" autocomplete="off" type="number">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>

            <el-form-item label="工作地点" :label-width="formLabelWidth">
                <el-input v-model="form.region" autocomplete="off"></el-input>
            </el-form-item>
            <!-- <el-col :span="12">
            <el-form-item label="招聘人数" :label-width="formLabelWidth">
              <el-input v-model="form.num" autocomplete="off" type="number"></el-input>
            </el-form-item>
            </el-col> -->
            <!-- </el-col> -->
            <!-- <el-col :span="12"> -->
            <div class="flex">
                <el-form-item label="学历要求" :label-width="formLabelWidth">
                    <!-- <el-input v-model="form.educ" autocomplete="off"></el-input> -->
                    <el-select v-model="form.diploma" placeholder="请选择">
                        <el-option
                                v-for="item in educOption"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <!-- </el-col> -->
                <!-- <el-col :span="12"> -->
                <el-form-item label="职位类型" :label-width="formLabelWidth">
                    <!-- <el-input v-model="form.educ" autocomplete="off"></el-input> -->
                    <el-select v-model="form.professionId" placeholder="请选择">
                        <el-option
                                v-for="item in professionOption"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <!-- </el-col> -->
            </div>
            <el-form-item label="经验要求" :label-width="formLabelWidth">
                <el-input v-model="form.workExp" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="岗位描述" :label-width="formLabelWidth">
                <el-input v-model="form.describe" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="岗位要求" :label-width="formLabelWidth">
                <el-input v-model="form.ask" type="textarea"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:center">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button v-if="!upState" type="primary" @click="onSubmit">确 定</el-button>
            <el-button v-if="upState" type="primary" @click="updateClick">修 改</el-button>
        </div>
    </div>
</template>
<script>
    import gql from "graphql-tag";

    export default {
        data() {
            return {
                formLabelWidth: "100px",
                cId: "",
                upState: false,
                form: {
                    title: "", //职位名称
                    wages: "", //薪资
                    // welfare: ["无"], //公司福利
                    diploma: "", //学历要求
                    workExp: "", //经验要求
                    ask: "", //职位要求
                    // lowAge: "", //最低年龄
                    // highAge: "", //最高年龄
                    region: "", //工作地点
                    // num: 0, //招聘人数
                    describe: "",//职位描述
                    professionId: null//职位类型
                },
                professionOption: [],
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
            this.$apollo.mutate({
                mutation: gql`
          query{
            profession{
              all{
                id
                name
              }
            }
          }
        `
            }).then(data => {
                console.log(data)
                this.professionOption = data.data.profession.all
            }).catch(err => {
                console.log(err)
            });
            let state = this.$route.query.state;
            if (state === 'update') {
                this.upState = true;
                this.$apollo.mutate({
                    mutation: gql`
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
                professionId
              }
            }
          }
        `,
                    variables: {
                        id: this.$route.query.id
                    }
                }).then(data => {
                    this.form.title = data.data.companyPosition.detail.title;
                    this.form.wages = data.data.companyPosition.detail.wages;
                    this.form.diploma = Number(data.data.companyPosition.detail.diploma);
                    this.form.workExp = data.data.companyPosition.detail.workExp;
                    this.form.describe = data.data.companyPosition.detail.describe;
                    this.form.ask = data.data.companyPosition.detail.ask;
                    this.form.region = data.data.companyPosition.detail.region;
                    this.form.professionId = data.data.companyPosition.detail.professionId;
                })
                    .catch(err => {
                    })
            }
        },
        methods: {
            //提交修改
            onSubmit() {
                console.log(this.form);
                //  let id = sessionStorage.getItem("cId");
                this.$apollo.mutate({
                    mutation: gql`
              mutation(
                $title:String
                $wages:String
                $diploma:String
                $workExp:String
                $describe:String
                $ask:String
                $region:String
                $companyId:Int
                $professionId:Int                
              ){
                companyPosition{
                  create(
                    title:$title
                    wages:$wages
                    diploma:$diploma
                    workExp:$workExp
                    describe:$describe
                    ask:$ask
                    region:$region
                    companyId:$companyId
                    professionId:$professionId
                  ){
                    id
                  }
                }
              }
            `,
                    variables: {
                        title: this.form.title,
                        wages: this.form.wages,
                        diploma: this.form.diploma,
                        workExp: this.form.workExp,
                        describe: this.form.describe,
                        ask: this.form.ask,
                        region: this.form.region,
                        companyId: sessionStorage.getItem("cId"),
                        professionId: this.form.professionId
                    }
                }).then(data => {
                    this.$message({
                        message: "职位创建成功",
                        type: 'success'
                    });
                    this.form = {};//清空用户输入
                    console.log(data)
                }).catch(err => {
                    console.log(err)
                })
            },
            updateClick () {
                //修改职位
                this.$apollo.mutate({
                    mutation: gql`
              mutation(
                $id:Int!,
                $title:String
                $wages:String
                $diploma:String
                $workExp:String
                $describe:String
                $ask:String
                $region:String
                $professionId:Int
              ){
                companyPosition{
                  update(
                    id:$id
                    title:$title
                    wages:$wages
                    diploma:$diploma
                    workExp:$workExp
                    describe:$describe
                    ask:$ask
                    region:$region
                    professionId:$professionId
                  ){
                    id
                  }
                }
              }
            `,
                    variables: {
                        id:Number(this.$route.query.id),
                        title: this.form.title,
                        wages: this.form.wages,
                        diploma: this.form.diploma,
                        workExp: this.form.workExp,
                        describe: this.form.describe,
                        ask: this.form.ask,
                        region: this.form.region,
                        professionId: this.form.professionId
                    }
                }).then(data => {
                    this.$message({
                        message: "职位修改成功",
                        type: 'success'
                    });
                    this.form = {};//清空用户输入
                    this.$router.push({path:"/positionDetail"})
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    };
</script>
<style scoped>
    .flex {
        display: flex;
        justify-content: space-around
    }
</style>