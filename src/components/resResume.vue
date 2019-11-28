  <template>
    <div>
        <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
            prop="memberResume.name"
            label="姓名"
            width="180">
        </el-table-column>
        <el-table-column
            prop="memberResume.mobile"
            label="手机"
            width="180">
        </el-table-column>
        <el-table-column
            prop="memberResume.position"
            label="意向职位">
        </el-table-column>
                <el-table-column
            prop="memberResume.workExp"
            label="工作经验">
        </el-table-column>
            <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
            <el-button type="text" @click="seeResume(scope.row)" size="small">查看简历</el-button>
            <el-button type="text" @click="openDialog(scope.row)" size="small">预约</el-button>
        </template>
        </el-table-column>
        </el-table>
        <el-dialog title="预约面试消息" :visible.sync="dialogFormVisible">
                <el-input v-model="inform" autocomplete="off"></el-input>
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
            dialogFormVisible:false,
            tableData: [],
            inform:"",
            id:null
        }
      },
      created(){
          this.getRuesume();
      },
      methods:{
          openDialog(item){
              this.dialogFormVisible=!this.dialogFormVisible;
              this.id = item.id;
          },
          onSubmit(){
              this.dialogFormVisible=!this.dialogFormVisible;
              console.log(this.id);
              this.$apollo.mutate({
                  mutation:gql`
                    mutation(
                        $id:Int!
                        $notice:String
                    ){
                    interviewNotice{
                        update(
                            id:$id
                            notice:$notice
                        ){
                            id
                        }
                    }
                }
                  `,
                variables:{
                    id:this.id,
                    notice:this.inform
                }
              }).then(data=>{
                  console.log(data)
              }).catch(err=>{
                  console.log(err)
              })
          },
          seeResume(item){
              this.$router.push({path:"/myResume",query:{id:item.memberId}})
          },
    getRuesume(){
      this.$apollo.mutate({
        mutation:gql`
          query(
            $companyId:Int
          ){
            memberDelivery{
              search(
                companyId:$companyId
              ){
                id
                companyPositionId
                memberId
                companyPosition{
                    title
                }
                memberResume{
                    name
                    mobile
                    workExp
                    position
                    
                }
              }
            }
          }
        `,
        variables:{
          companyId:sessionStorage.getItem("cId")
                }
            }).then(data=>{
                console.log(data.data.memberDelivery.search)
                this.tableData = data.data.memberDelivery.search;
            }).catch(err=>{
                console.log(err)
            })
        },
      }
    }
</script>
<style scoped>
    
</style>