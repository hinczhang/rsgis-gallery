<template>
    <el-card  shadow="always" style="width:90%;margin:10px auto;">
         <div slot="header" class="card-head">
            <el-link type="primary" @click="toItem" style="float:left;font-size:20px;">{{userItem.name}}</el-link>
            <el-tooltip  effect="dark" content="警告：这将删除整个项目内容！" placement="right">
            <el-button type="danger" v-if="owner" style="float:right;" size="mini" round v-on:click="deleteItem">删除</el-button>
            </el-tooltip>
         </div>
         <div class="card-content">
             <el-row v-if="userItem.note" style="font-style: italic;">{{userItem.note}}</el-row>
            <el-row>
                <el-col :span="2">课程：</el-col>
                <el-col :span="8">{{userItem.course}}</el-col>
                <el-col :span="7">创建时间：{{userItem.time}}</el-col>
                <el-col :span="7" style="float:right;text-align:right;">下载量：{{userItem.down_num}}</el-col>
            </el-row>
         </div>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            owner:false,
        };
    },
    props:{
        userItem:{},
       
    },
    methods: {
        toItem() {
            this.$axios
                .post('/create/view',{
                    itemId:this.userItem.itemId
                })
                .then((response)=>{
                    console.log('view add one')
                    sessionStorage.setItem("item",this.Secret_Key(this.userItem.itemId,'123456789','E'));
                    sessionStorage.setItem("userId",this.Secret_Key(this.userItem.userId,'123456789','E'));
                    this.$router.push({path:'/item'});
                })
                .catch((error)=>{
                    console.log('error add')
                })
            
        },
        deleteItem:function(){
            this.$axios
                .post("/user/deleteItem",{
                    item:this.userItem
                })
                .then((response)=>{
                    this.$notify({
                        title: '成功',
                        message: '删除成功',
                        type: 'success'
                    });
                    this.$emit('ItemrefreshSign',this.userItem.itemId);
                })
                .catch((error)=>{
                    this.$notify.error({
                        title: '错误',
                        message: '删除错误，请稍后重试',
                    });
                });
            
        }
    },
    mounted() {
        if (this.userItem.userId == this.Secret_Key(localStorage.getItem('user_account'),'123456789','D'))
        {
            
            this.owner = true;
        }
    }
}
</script>

<style scoped>
.card-head {
    margin-bottom: 20px;
}
.boxcard .el-card_body {
    padding:0px;
}
.card-content {
    font-size: 14px;
    text-align: left;
    color: rgba(55,55,55,0.6);
}

.el-row {
    margin-bottom: 10px;
}
</style>