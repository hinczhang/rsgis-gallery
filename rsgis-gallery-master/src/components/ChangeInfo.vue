<template>
<el-main class="changeMain">
<div class="ChangeHead">
    更新个人信息
</div>
<div class="ChangeInfo">
    <el-form :model="formData"  label-width="100px" :ref="formData" size="mini">
        <el-form-item label="姓 名">
            <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="年 级" :rules="[{type:'number',message:'年级必须为数字'}]">
            <el-input v-model="formData.grade" placeholder="填入年级，如‘2017’"></el-input>
        </el-form-item>
        <el-form-item label="邮 箱">
            <el-input v-model="formData.email"></el-input>
        </el-form-item>
         <el-form-item label="性 别">
            <el-radio-group v-model="formData.gender">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item>
            <el-tooltip effect="dark" content="只需要填写你想要更新的项目" placement="bottom">
            <!-- <el-button-group style="float: left;"> -->
            <el-button type="success" size="mini" round style="float:left;" @click="changeInfo">更新信息</el-button>
            <!-- </el-button-group> -->
            </el-tooltip>
            <el-button type="warning" size="mini" round @click="dialogVisible = true;"> 修改密码</el-button>
            <el-button type="info" size="mini" round @click="cancel">取消</el-button>
            
        </el-form-item>
    </el-form>
</div>
<!-- 修改密码的对话框 -->
<el-dialog title="修改密码" :visible.sync="dialogVisible" :show-close="false" :center="false" >
    <el-form :model="passwordData" label-width="100px" ref="password" size="mini" :rules="passRules" class="passForm">
        <el-form-item label="旧密码" prop="oldPass">
            <el-input v-model="passwordData.oldPass" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
            <el-input v-model="passwordData.newPass" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
            <el-input v-model="passwordData.checkPass" type="password" autocomplete="off"></el-input>
        </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
        <el-button-group>
        <el-button type="success" @click="changePassword" round >确 定</el-button>
        <el-button @click="dialogVisible = false" round>取 消</el-button>
        </el-button-group>
    </div>
</el-dialog>
</el-main>
</template>

<script>



export default {
    components: {
        
    },

    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请输入密码'));
            } else {
            if (this.passwordData.checkPass !== '') {
                this.$refs.password.validateField('checkPass');
            }
            callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请再次输入密码'));
            } else if (value !== this.passwordData.newPass) {
            callback(new Error('两次输入密码不一致!'));
            } else {
            callback();
            }
        };
        return {
            dialogVisible:false,
            userImg:'akari.jpg',
            userId:'',
            formData:{
                userId:this.userId,
                name:'',
                grade:'',
                email:'',
                gender:'',
            },
            passwordData:{
                oldPass:'',
                newPass:'',
                checkPass:'',
            },
            passRules:{
                oldPass: [{required: true, message:'请输入旧密码', trigger:'blur'}],
                newPass: [{required: true, message:'请输入新密码', trigger:'blur'},{ validator: validatePass,trigger: 'blur' }],
                checkPass: [{required: true, message:'请确认密码', trigger:'blur'},{ validator: validatePass2, trigger: 'blur' }],
            },
        };
    },
    methods: {
        changeInfo(){
            var temp=this.formData;
            this.$axios
                .post("/user/changeInfo", {
                    temp,
                    userId:this.userId
                })
                .then((response) => {
                    this.$notify({
                        title: '成功',
                        message: '修改信息成功',
                        type: 'success'
                    });
                    this.$router.push({path:'/user'});
                })          
                .catch((error) => {
                    this.$notify.error({
                        title: '错误',
                        message: '更改信息错误，请稍后重试！\n'+error,
                    });
                });
        },
        changePassword(){
            
            this.$refs['password'].validate((valid) => {
                if (valid) {
                    //Axios上传
                    this.$axios
                        .post("/user/changepw", {
                            userId: this.userId,
                            pwOld:this.passwordData.oldPass,
                            pwNew:this.passwordData.newPass
                        })
                        .then((response) => {
                            console.log("日狗")
                            this.$notify({
                                title: '成功',
                                message: '修改密码成功',
                                type: 'success'
                            });
                        })          
                        .catch((error) => {
                            this.$notify.error({
                                title: '错误',
                                message: '更改密码错误或者旧密码填写错误，请稍后重试！\n'+error,
                            });
                        });
        
                    this.dialogVisible = false;
                } else {
                    //未通过检验的提示

                    // this.dialogVisible = false;
                    return false;
                }
            });
        },
        cancel() {
            this.$router.push({path:'/user'});
        }
    },
    created() {
        // 
        this.userId = this.Secret_Key(localStorage.getItem("user_account"),'123456789','D') ;
        this.$axios
            .post("/user/pickInfo", {
                userId: this.userId,
            })
            .then((response) => {
                this.formData=response.data.Info;
            })
            .catch((error) => {
                this.$notify.error({
                    title: '错误',
                    message: '信息提取错误，请稍后重试！\n'+error,
                });
            });
    }
}
</script>

<style scoped>
.changeMain {
    border-left:2px solid rgba(88,158,248,0.1);
    border-right:2px solid rgba(88,158,248,0.1);
    margin-right:15%;
    min-height: 550px;
}
.ChangeHead {
    margin-left:15%;
    text-align:left;
    color: rgba(103,158,241,0.9);
    font-size: 30px;
}

.ChangeInfo {
    width:400px;
    margin-top:30px;
    margin-left:5%;

}

.el-form-item {
    margin-top:20px;
    margin-bottom:40px;
}


</style>