<template>
<div class="admin-grade">
    <!-- search -->
    <div>
        <el-row type="flex" align="center" justify="space-around">
            <!-- <el-col :span="6">
                <el-radio-group v-model="isGrade" @change="handleChanged">
                    <el-radio-button label="全部" ></el-radio-button>
                    <el-radio-button label="未打分"></el-radio-button>
                    <el-radio-button label="已打分"></el-radio-button>
                </el-radio-group>
            </el-col> -->

            <el-col :span="6">
                <el-select v-model="searchCourse" clearable placeholder="选择课程" @change="handleChanged">
                    <el-option v-for="course in courses" :key="course" :label="course" :value="course"></el-option>
                </el-select>
            </el-col>

            <el-col :span="6">
                <el-date-picker
                    v-model="searchMonth"
                    type="monthrange"
                    range-separator="至"
                    start-placeholder="开始月份"
                    end-placeholder="结束月份"
                    @change="handleChanged"
                    value-format="yyyy-M">
                </el-date-picker>
            </el-col>
        </el-row>
    </div>
    <!-- table -->
    <el-table :data="tableData" border style="width: 100%" :row-class-name="tableRowClassName">
        <el-table-column
        align="center"
        prop="leader"
        label="组长"
        width="150">
        </el-table-column>
        <el-table-column
        align="center"
        prop="members"
        label="组员"
        width="300">
        </el-table-column>
        <el-table-column
        align="center"
        prop="item"
        label="项目"
        width="250">
        </el-table-column>
        <el-table-column
        align="center"
        prop="course"
        label="课程"
        width="250">
        </el-table-column>
        
        <el-table-column align="center" label="操作">
        <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openDialog(scope.$index, scope.row)">查看详情</el-button>
        </template>
        </el-table-column>
    </el-table>
    <!--  -->
    <el-pagination
      background      
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5,10,15]"
      :page-size="pagesize"
      layout="total,jumper,prev, pager, next,sizes"
      :total="files_count"
    ></el-pagination>
    <!-- 弹出显示的singleItem的Dialog -->
    <el-dialog :visible.sync="dialogVisible" v-if="dialogVisible" width="95%">
        <single-item></single-item>
    </el-dialog>
</div>

</template>


<script>
import SingleItem from '../components/SingleItem';
export default {
    components:{
        SingleItem
    },
    data() {

        return {
            dialogVisible:false,
            tableData:[{leader:"wang",item:"ok",userId:"200",itemId:200}],
            pagesize:5,
            currentPage:1,
            files_count:100,
            isGrade:'全部',
            courses: [],
            searchCourse:'',
            searchMonth:[],
            num:0,
        };
},

methods:{
    openDialog(index,row) {
        this.dialogVisible=true;
        sessionStorage.setItem("userId",this.Secret_Key(row.userId,'123456789','E'));
        sessionStorage.setItem("item",this.Secret_Key(row.itemId,'123456789','E'));
    },
    tableRowClassName({row, rowIndex})
    {
        if (row.grade <= -1)
        {
            return 'warning-row';
        }
        else
        {
            return 'success-row';
        }
    },
    //分页 初始页currentPage、初始每页数据数pagesize和数据testpage--->控制每页几条
    handleSizeChange:function(size){
        this.pagesize = size;
        this.handleGetFilesListApi();
        console.log(this.pagesize)
    },
    // 控制页面的切换
    handleCurrentChange: function(currentPage) {
        this.currentPage = currentPage;
        console.log(currentPage);
        this.handleGetFilesListApi();
    },
    //对所有数据进行分页处理 发送请求
    handleGetFilesListApi() {
      /*this.tableData = [];
      for (var i = 0; i < this.pagesize; i++)
      {
        this.tableData.push({
            leader:'test',
            members:'test test test test',
            course: 'GIS 软件开发设计',
            item: (i+1)*this.currentPage,
            itemId: 'test'+(i+1)*this.currentPage,
            grade:i-2,
      });
      }*/
        this.$axios
            .post("/newadmin/getinfo",{
                page:this.currentPage,
                isGrade:this.isGrade,
                course:this.searchCourse,
                date:this.searchMonth,
                size:this.pagesize
            })
            .then((response)=>{
                this.tableData=response.data.table;
                this.files_count=response.data.itemnum;
            })
            .catch((error)=>{

            })
        
    },
    handleChanged () {
        // console.log(this.isGrade,"-+-",this.searchCourse,"-+-",this.searchMonth);
        this.currentPage = 1;
        this.handleGetFilesListApi();
    },
    handleGrade (row) {
        //axios更新 itemId=row.itemId grade=row.grade 如果修改成功就不需要提示了，如果失败了再进行提示
        this.$axios
            .post("/newadmin/score",{
                itemId:row.itemId,
                grade:row.grade
            })
            .then((response)=>{

            })
            .catch((error)=>{

        })
    },
},
mounted() {
    this.handleGetFilesListApi();
    this.$axios
        .post("/home/readCourse",{

        }).then((response)=>{
            this.courses=response.data.course;
        }).catch((error)=>{
            this.$notify.error({
            title: '错误',
            message: '载入课程错误，请稍后重试！\n'+error,
        });
    })
},
}
</script>

<style scoped>
.admin-grade .el-table__body .warning-row{
    background: rgb(252, 245, 232);
  }

.admin-grade .el-table__body .success-row {
    background: rgb(242,249,236);
  }

</style>
