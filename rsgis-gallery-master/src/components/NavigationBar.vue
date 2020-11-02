<template>
<el-header height="180px">
    <div class="bar">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" background-color="rgba(255,255,255,0.7)" text-color="#589ef8" active-text-color="#589ef8" router="true">
            <el-menu-item index="/hometemp" style="margin-left:15%;font-size:19px;" >主站<el-divider direction="vertical"></el-divider></el-menu-item>
            
            <el-menu-item style="margin-left:3%;font-size: 17px;">
                <el-input placeholder="搜索" v-model="input"  size="mini">
                    <!-- <el-button slot="append" icon="el-icon-search" type="danger" style="background:rgba(88,158,248,0.8);"></el-button> -->
                </el-input>
                <el-button  icon="el-icon-search" type="primary" round  plain @click="keyword"></el-button>

            </el-menu-item>
            <el-submenu style="float:right; margin-right:15%;" class="sub">
                <template slot="title">       
                        <el-avatar :size="45" :src="userImg" @error="imgErrorHandler">
                        <img src="error.png"/></el-avatar>
                </template>
                
                <el-menu-item class="menuSub" @click="user" v-if="!isGuest">个人主页</el-menu-item>
                <el-menu-item class="menuSub" @click="modify" v-if="!isGuest">修改信息</el-menu-item>
                <el-menu-item class="menuSub" @click="create" v-if="!isGuest">创建项目</el-menu-item>
                <el-menu-item class="menuSub" @click="quit" v-if="!isGuest">退出登录</el-menu-item>
                <el-menu-item class="menuSub" @click="login" v-if="isGuest">登录</el-menu-item>
            </el-submenu>       
        </el-menu>
    </div>
</el-header>
</template>

<script>
export default {
    data () {
        return {
            userImg:"akari.jpg",
            activeIndex:"/user",
            input:'',
            userId:'',
            isGuest:true
        };
    },
    created() {
        var token=this.Secret_Key(sessionStorage.getItem("token"),'123456789','D');
        if(token==='user'||token==='admin'){
            this.isGuest=false;
            this.userId = this.Secret_Key(localStorage.getItem("user_account"),'123456789','D');
            this.$axios
                .post("/avatar/get",{
                        userId:this.userId
                })
                .then((res)=>{
                    if(res.data.code==0){

                    }else{
                        this.userImg=res.data.src;
                        
                    }
                })
                .catch((error)=>{

                })
        }
        else{
            this.isGuest=true;
        }
        
    },
    methods: {
        keyword() {
            if (this.input.length > 0)
            {
                sessionStorage.setItem('keyword',this.input);
                
                //window.open(this.$router.resolve({path:'/'}),'_blank');
                this.$router.push({path:'/hometemp'});
            }
            
        },
        imgErrorHandle () {
            return true;
        },
        user(){
            sessionStorage.setItem("userId",this.Secret_Key(this.userId,'123456789','E'));
            this.$router.push({path:'/temp'});
        },
        modify(){
            sessionStorage.setItem("userId",this.Secret_Key(this.userId,'123456789','E'));
            this.$router.push({path:'/modify'});
        },
        create() {
            sessionStorage.setItem("userId",this.Secret_Key(this.userId,'123456789','E'));
            this.$router.push({path:'/create'});
        },
        quit(){
            sessionStorage.clear();
            this.$router.push({path:'/login'});
        },
        login(){
            this.$router.push({path:'/login'});
        }
    },
}
</script>

<style scoped>
* {
    font-size: 17px;
}
.bar {
    /* max-height: 62px; */
    height:180px;
    overflow: hidden;
    background-image: url(/main-head.jpg);
    position:relative;
}
.el-menu-demo {
    max-height: 62px;
    overflow: hidden;
}
.el-input__inner {
    border-radius:14px;
}
.el-menu-item:hover {
    background-color: aliceblue !important;
}
.menuSub {
    font-size: 14px;
    margin: 2px 0px;
    text-align: center;
}
</style>