<template>
    <el-card shadow="hover" class="mgb20" style="width:100%;">
        当前所授课程
        <el-button type="primary" size="mini" style="float: right;" @click="dialogVisible = true">添加课程</el-button>
        <el-table :data="tableData" style="width:100%;">
            <el-table-column prop="c"></el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <el-button type="danger" @click="handleClick(scope.row)" size="mini" style="float: right;">删除</el-button>
                </template>
            </el-table-column>
        </el-table>



        <el-dialog
            title="添加课程"
            :visible.sync="dialogVisible"
            width="50%">
                <el-input placeholder="新课程" v-model="newCourse" style="width:70%;"></el-input>
                <el-button-group style="float:right;">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCourse">确 定</el-button>
                </el-button-group>
        </el-dialog>
    </el-card>

    
</template>

<script>
export default {
    

    data() {

        return{
            tableData: [{c:'gse'},{c:'gsi'}],
            newCourse:'',
            dialogVisible:false,
        };
    },
    methods: {
        addCourse() {
            //axios回调
            this.$axios
                .post('/newadmin/addCourse',{
                    course:this.newCourse
                })
                .then((response)=>{
                    this.newCourse="";
                    this.freshCourse();

                })
                .catch((error)=>{
                    this.$notify.error({
                    title: '错误',
                    message: '添加课程失败！\n'+error,
                    });
                })
            this.dialogVisible = false;
        },
        handleClick(row) {
            this.$axios
                .post('/newadmin/deleteCourse',{
                    course:row.c
                })
                .then((response)=>{
                    this.$notify({
                        title: '成功',
                        message: '删除成功',
                        type: 'success'
                    });
                    this.freshCourse();
                })
                .catch((error)=>{
                    this.$notify.error({
                        title: '错误',
                        message: '删除课程失败！\n'+error,
                    });
            })
        },
        freshCourse(){
            this.$axios
                .post('/newadmin/readCourse')
                .then((response)=>{
                    this.tableData=response.data.course;
                })
                .catch((error)=>{
            })
        }
    },
    created(){
        this.freshCourse()
    }
}
</script>

<style scoped>

</style>
