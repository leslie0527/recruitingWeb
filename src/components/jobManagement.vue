<template>
    <div>
    <el-table
      :data="positionList"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="职位"
        width="180">
      </el-table-column>
      <el-table-column
        prop="diploma"
        label="学历要求"
        width="180">
      </el-table-column>
      <el-table-column
        prop="wages"
        label="薪资待遇/元"
        width="180">
      </el-table-column>
      <el-table-column
        prop="workExp"
        label="工作经验要求"
        width="180">
      </el-table-column>
      <el-table-column
        prop="region"
        label="工作地点"
        width="180">
      </el-table-column>
      <el-table-column
        prop="number"
        label="简历投递数量"
        width="180">
      </el-table-column>
      <el-table-column
        prop="company.abbreviation"
        label="发布公司"
        width="180">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="detailBtn(scope.row.companyId,scope.row.id)" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="width:50px;margin:auto">
        <el-pagination small layout="prev, next" @prev-click="prev()" @next-click="next()" background></el-pagination>
    </div>
    </div>
</template>
<script>
import gql from "graphql-tag";
export default {
    data() {
        return {
            positionList:[],
            page:1
        }
    },
    created(){
        this.getPositionList();
    },
    methods:{
        prev() {
            this.page--;
            this.getPositionList();
        },
        next() {
            this.page++;
            this.getPositionList();
        },
        detailBtn(cId,id){
            // console.log(id);
            this.$router.push({path:"/positionDetail",query:{cId,id}})
        },
        getPositionList(){
        this.$apollo
                .mutate({
                mutation: gql`
                    query(
                        $page:Int
                    ){
                        companyPosition{
                            search(
                                page:$page
                            ){
                            id
                            title
                            wages
                            workExp
                            describe
                            ask
                            region
                            diploma
                            number
                            companyId
                            company{
                                name
                                abbreviation
                            }
                            }
                        }
                        }
                `,
                variables:{
                    page:this.page
                }}).then(data=>{
                    console.log(data.data.companyPosition.search);
                    this.positionList = data.data.companyPosition.search;
                }).catch(err=>{
                    console.log(err);
                })
        }
    }
}
</script>
<style scoped>

</style>