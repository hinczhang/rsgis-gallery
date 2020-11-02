<template>
    z<el-container>
        <el-header height="70px" style="background:rgba(237,237,237,0.7);">
            <div style="text-align: left;height:100%;font-size:20px;"><el-image src="logo.png">圆梦课程成果展示平台</el-image> 
            <el-link style="float:right;font-size:10px;color:rgba(200,200,200,0.9);margin:20px;" @click="openDialog">BUG反馈</el-link>
            <!-- <el-button type="primary" plain style="float:right!important;font-size:15px;margin-right:30px">BUG反馈-请输入您的建议和意见</el-button> -->
            </div>
            
        </el-header><!-- 这个替换掉login.vue的第3-5行 -->
        <el-main style="background:rgba(237,237,237,0.7)">
            <div class="main_row">
            <el-row type="flex" justify="space-around" >
                <el-col :span="16">
                <el-carousel :interval="2000"  height="350px" type="card">
                    <el-carousel-item v-for="i in 6" :key="i">
                        <el-image :src="'./'+i+'.jpg'"></el-image>
                    </el-carousel-item>
                </el-carousel>
                </el-col>
                <el-col :span="7">
                <div class="login-dialog">
                    <!-- 注册界面 -->
                    <register-wrap v-if="isRegisterShow" @back="isRegisterShow = false;"></register-wrap>
                    <!-- 登录界面 -->
                    <login-wrap v-else @register="isRegisterShow = true;">
                    </login-wrap>
                </div>
                </el-col>
            </el-row>
            </div>
        </el-main>
        <el-footer height="70px" style="padding:0px;">
            <div style="height:100%;background-color:rgba(70,70,70,0.9);i"></div>
        </el-footer>
        <el-dialog :visible.sync="dialogVisible" v-if="dialogVisible" width="40%">
            <div style="font-size:20px;margin:0 0 30px 0;text-align:center;">BUG反馈</div>
            <el-form label-width="100px" class="demo-ruleForm" :model="formLabelAlign" ref="formLabelAlign" :rules="rules">
                <el-form-item label="选择时间" prop="time">
                    <div class="block" style="float:left!important;">
                    <el-date-picker
                        v-model="formLabelAlign.time"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="联系方式" prop="connect">
                    <el-input v-model="formLabelAlign.connect"></el-input>
                </el-form-item>
                <el-form-item label="详细情况" prop="detail">
                    <el-input type="textarea" v-model="formLabelAlign.detail"></el-input>
                </el-form-item>
                <el-form-item>
                    
                    <el-button type="primary" @click="submitForm('formLabelAlign')">立即创建</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </el-container>
</template>

<script>
// 登录组件
import LoginWrap from '../components/LoginWrap';
// 注册组件
import RegisterWrap from '../components/RegisterWrap';

export default {
    components: {
        LoginWrap, RegisterWrap
    },
    data() {
        return {
            dialogVisible:false,
            isRegisterShow: false,
            formLabelAlign: {
                time: '',
                connect: '',
                detail: ''
            },
            rules: {
                detail: [
                    { required: true, message: '请输入详细情况', trigger: 'blur' },
                ],
                connect: [
                    { required: true, message: '请输入联系方式', trigger: 'blur' }
                ],
                time: [
                    {  required: true, message: '请选择日期时间', trigger: 'change' }
                ]
            }
        }
    },
    methods:{
        openDialog(){
            this.dialogVisible=true;
        },
        submitForm(formName) {
            var bug=this.formLabelAlign;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$axios
                        .post("/home/sendbug",{
                            bug
                        })
                        .then((response)=>{
                            this.$notify({
                                title: '成功',
                                message: '信息上传成功！',
                                type: 'success'
                            });
                            this.dialogVisible=false;
                        })
                        .catch((error)=>{
                            this.$notify.error({
                                title: '错误',
                                message: '上传信息失败，请稍后重试'+error,
                            });
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm() {
            this.formLabelAlign.time='';
            this.formLabelAlign.connect='';
            this.formLabelAlign.detail='';
        }
    }
}
</script>

<style>
body, html ,#app, .el-container{
    padding:0px;
    margin: 0px;
    height:100%;
}
.login-main {
    background-color: rgb(50, 52, 59);
    height: 800px;
    line-height: 800px;
    width: 100%;
}
.login-dialog {
    height: 350px;
    line-height: 350px;
    width: 400px;
    border-radius: 25px;
    /* opacity: 0.8; (改成background)*/
    background-color: rgba(250, 250, 250, 0.5);
    /* position: absolute; */
    /* top: 25%; */
    /* left: 50%; */
    /* margin-left: -225px; */
}

.el-main{
    padding:0px;
}

.main_row {
    position:absolute;
    top:50%;
    transform: translateY(-50%);
    width:100%;
}


  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
    border: 1px solid rgba(0,49,79,0.9);
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
    border: 1px solid rgba(0,49,79,0.9);
  }
</style>
