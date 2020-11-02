<template>
<el-aside style="margin-left:15%;" width="15%">
<div class="changeAvatar">
    <el-avatar :size="170" :src="userImg" @error="imgErrorHandler" class="avatar-img">
        <img src="error.png"/>
    </el-avatar>
    <el-upload
        ref="upload"
        class="upload-demo"
        action="/avatar/change"
        accept="image/jpeg,image/gif,image/png,image/jpg"
        :data="formData"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :on-success="handleSuccess"
        :show-file-list="false">
        <el-button slot="trigger" size="mini" type="primary" class="button-round-left" @click="change">更换头像</el-button>
        <el-button size="mini" type="danger" class="button-round-right" :disabled="userImg=='akari.jpg'" @click="deleteImg">删除头像</el-button>
    </el-upload>
    
    
</div>
</el-aside>
</template>

<script>
export default {
    data () {
        return {
            userImg:'akari.jpg',
            userId:"",
            formData:{
                userId:''
            }
        };
    },
    created() {
        this.userId = this.Secret_Key(localStorage.getItem("user_account"),'123456789','D');
        this.formData.userId=this.userId;
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
    },
    methods:{
        change(){
            this.$refs.upload.submit();
        },
        handleSuccess(){
            this.$router.push({path:'/modifytemp'});
        },
        deleteImg(){
            console.log("delete")
            this.$axios
                .post("/avatar/delete",{
                    userId:this.userId
                })
                .then((res)=>{
                    this.userImg='akari.jpg';
                    this.$router.push({path:'/modifytemp'});
                })
                .catch((error)=>{

                })
        }
    }
}
</script>

<style scoped>
.changeAvatar {
    margin-top:80px;

}

.avatar-img {
    border: 2px solid rgba(152, 200, 240, 0.9);
    border-radius: 50%;
    margin-bottom: 30px;

}
</style>