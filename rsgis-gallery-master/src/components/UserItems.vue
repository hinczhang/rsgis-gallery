<template>
    <el-main class="userMain">
        <!-- <div style="height:2000px;"></div> -->
        <!-- <el-row> -->
        <el-input placeholder="在该个人主页中搜索" v-model="input" class="selectinput"></el-input>
        <!-- <el-divider style="margin:0px;" direction="vertical"></el-divider> -->
        <el-button-group>
        <el-button  icon="el-icon-search" type="primary" @click="select" class="selectbutton" v-if="owner">搜索</el-button>
        <el-button  icon="el-icon-search" type="primary" @click="select" class="selectbutton withoutright" v-if="!owner">搜索</el-button>
        <el-button  icon="el-icon-circle-plus-outline" type="success" @click="createItem" v-if="owner" round>创建新项目</el-button>
        </el-button-group>
        <!-- </el-row> -->
        
        <div v-if="userItems.length==0">暂时还没有任何项目哦</div>
        <div v-for="(userItem,index) in userItems" :key="index">
            <item-card :userItem="userItem"  v-on:ItemrefreshSign="Itemrefresh"></item-card>
        </div>
    </el-main>
</template>

<script>
import ItemCard from './ItemCard';

export default {
    components: {
        ItemCard,
    },
    // props: {
    //     owner:Boolean,
    // },
    data () {
        return {
            input:"",
            userItem:{},
            userId:'',
            owner:false,
            userItems:[],
        };
    },
    
    created() {
       this.userId = this.Secret_Key(sessionStorage.getItem("userId"),'123456789','D');
       if (this.userId == this.Secret_Key(localStorage.getItem('user_account'),'123456789','D'))
       {
           this.owner = true;
       }
       else
       {
           this.owner = false;
       }
       this.getInfo();
    },
    methods: {
        getInfo(){
            this.$axios
                .post("/user/getinfo", {
                    userId: this.userId,
                })
                .then((response) => {
                    this.userItems=response.data.content;
                })
                .catch((error) => {
                    this.$notify.error({
                        title: '错误',
                        message: '主页信息提取错误，请稍后重试！\n'+error,
                    });
                });
        },
        Itemrefresh:function(itemId){
            this.getInfo();
        },
        select() {
            if(this.input.length!=0){
                this.$axios
                    .post('/home/userInfo',{
                        userId:this.userId,
                        keyword:this.input
                    })
                    .then((response)=>{
                        this.userItems=response.data.content;
                    })
                    .catch((error)=>{
                        this.$notify.error({
                            title: '错误',
                            message: '主页信息提取错误，请稍后重试！\n'+error,
                        });
                    })
            }
        },
        createItem() {
            this.$router.push({path:'/create'});
        },
    },
}
</script>

<style scoped>
.userMain {
    border-left:2px solid rgba(88,158,248,0.1);
    border-right:2px solid rgba(88,158,248,0.1);
    margin-right:15%;
    min-height: 550px;
}
</style>