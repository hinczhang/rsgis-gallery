<template>
    <el-card shadow="hover" class="mgb20" style="width:100%;">
        <el-row>
            <el-col :span="6">当前提交情况</el-col>
            
        </el-row>
        <el-row style="margin-top:10px;">
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
        <el-row>
            <el-table
                :data="tableData"
                stripe
                style="width: 100%">
                <el-table-column
                prop="course"
                label="课程"
                align="center"
                width="510">
                </el-table-column>
                <el-table-column
                prop="num"
                label="提交量"
                align="center"
                width="270">
                </el-table-column>
                
            </el-table>
        </el-row>
    </el-card>
</template>

<script>
export default {
    data() {
        return{
            searchMonth:[],
            tableData:[]
        };
    },
    methods: {
       handleChanged(){
           this.handleGetFilesListApi();
       },
       handleGetFilesListApi(){
            this.$axios
                .post("/newadmin/stats",{
                    date:this.searchMonth
                })
                .then((response)=>{
                    console.log(response.data)
                    this.tableData=response.data.stats
                })
                .catch((error)=>{

                })
       }
    },
    created(){
        this.handleGetFilesListApi();
    }
}
</script>

<style scoped>

</style>
