<template>
    <el-main class="createMain">
        <div class="create-head">创建新项目</div>
        <div style="margin-left:10%;float:left;color:#606266;height:220px;width:90%;text-align:left;">选择项目展板：
        <div class="create-img">
            <el-upload
                class="avatar-uploader"
                ref="upload"
                name="img"
                action="/create/upload"
                accept="image/jpeg,image/gif,image/png,image/jpg"
                :limit="1"
                :auto-upload="false"
                :data="formData"
                :show-file-list="false"
                :on-change="imageChange"
                :on-success="handleImgSuccess"
                :before-upload="beforeImgUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </div>
        </div>
        <div class="create-form">
            

        <el-form :model="formData" :rules="formRules" label-width="100px" ref="formData" >
            <el-form-item label="所属课程" prop="course">
                <el-select v-model="formData.course" placeholder="请选择项目所属的课程" style="float: left;">
                    <template v-for="(course, index) in courses">
                        <el-option :label="course" :value="course" :key="index"></el-option>
                    </template>
                </el-select>
            </el-form-item>

            <el-form-item label="项目名称" prop="name">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            
            <el-form-item label="项目简介" prop="illustrator">
                <el-input v-model="formData.illustrator" placeholder="项目简介，选填"></el-input>
            </el-form-item>

            <el-row>
            <el-col :span="13">
                <el-form-item prop="members[0].id" label="组长学号" :rules="[{required:true,message:'学号不能为空',trigger: 'blur'},{type:'number',message:'学号必须为数字'}]">
                    <el-input v-model.number="formData.members[0].id" placeholder="学号" autocomplete="off"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="11">
                <el-form-item prop="members[0].name" label="姓名" :rules="{required:true,message:'姓名不能为空',trigger: 'blur'}">
                    <el-input v-model="formData.members[0].name" placeholder="姓名"></el-input>
                </el-form-item>
            </el-col>
            </el-row>
            
            <el-form-item label="">
                <el-button type="primary" round size="mini" style="float: right;" @click="addMembers">增加成员</el-button>
                <span style="color:rgb(211,213,218);">请添加项目组所有成员的信息（不包括组长）</span>
            </el-form-item>
            
            <el-row v-for="(temp, index) in formData.members.slice(1)" :key="index">
                 <el-col :span="11">
                    <el-form-item :prop="'members.'+(index+1)+'.id'" :label="'组员'+(index+1)+'学号'" :rules="[{required:true,message:'学号不能为空',trigger: 'blur'},{type:'number',message:'学号必须为数字'}]" size="mini">
                        <el-input v-model.number="temp.id" placeholder="学号" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item :prop="'members.'+(index+1)+'.name'" label="姓名" :rules="{required:true,message:'姓名不能为空',trigger: 'blur'}" size="mini">
                        <el-input v-model="temp.name" placeholder="姓名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="2">
                    <el-button size="mini" type="warning" @click="deleteMembers(temp)">删除</el-button>
                </el-col>
            </el-row>

            <el-button round type="success" icon="el-icon-check" style="float:left;margin-left:8%;" @click="createItem">创建项目</el-button>
            <el-button round type="info" @click="cancel">取消</el-button>
        </el-form>
        </div>
    </el-main>
</template>

<script>
export default {
    data() {
        return {
            courses:[],
            userId:"",
            imageUrl:'',
            formData: {
                userId:'',
                name:'',
                course:'',
                illustrator:'',
                members:[{id:'',name:''}],
                membersJson:'',
            },
            formRules: {
                name:[{ required: true, message: '请输入项目名称', trigger: 'blur' }],
                course:[{required: true, message: '请选择所属课程', trigger: 'change'}],
                illustrator:[{required: false, message: '选填', trigger: 'blur'}],
            },
        };
    },
    methods: {
        createItem() {
            //var Mmembers=new Array();
            this.formData.sendmembers=JSON.stringify(this.formData.members);
            if(this.imageUrl===''){
                this.$notify({
                    title: '警告',
                    message: '请加入展板图片！',
                    type: 'warning'
                });
                return;
            }
            /*for(var i=0;i<Mmembers.length;i++){
                var temp=JSON.stringify(this.formData.members[i]);
                Mmembers.push(JSON.parse(temp));
            }*/
            //this.formData.members=Mmembers;
            this.$refs.upload.submit();
        },

        imageChange(file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },

        beforeImgUpload () {
            
        },
        handleImgSuccess(res,file,fileList){
            this.$notify({
                title: '成功',
                message: '上传成功',
                type: 'success'
            });
            sessionStorage.setItem("item",this.Secret_Key(res.itemId,'123456789','E'))
            this.$router.push({path:'/item'});

        },
        handleImgFail(err,file,fileList){
            this.$notify.error({
                title: '错误',
                message: err,
            });
        },
        cancel () {
            this.$router.push({path:'/user'});
        },
        addMembers () {
            this.formData.members.push({id:'',name:''});
        },
        deleteMembers(member) {
            var index = this.formData.members.indexOf(member);
            if (index !== -1)
            {
                this.formData.members.splice(index, 1);
            }
        },
    },
    created() {
        this.userId = this.Secret_Key(localStorage.getItem("user_account"),'123456789','D');
        this.formData.userId = this.userId;
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
 .avatar-uploader {
    float: left;
    position: relative;
}
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader:hover  {
    border-color: #409EFF;
  }
 .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 165px;
    height: 165px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 165px;
    height: 165px;
    display: block;
  }
.create-head {
    text-align: left;
    margin-left: 10%;
    margin-top:3%;
    margin-bottom: 3%;
    font-size: 25px;
    color: rgba(103,158,241,0.9);
}
.create-img {
    margin-left: 0px;
    margin-bottom: 20px;
}
.create-form {
    width: 500px;
    margin-left: 8%;
    margin-top: 25px;
    /* float: left; */
}
.createMain {
    margin-right: 15%;
    border-left:2px solid rgba(88,158,248,0.1);
    border-right:2px solid rgba(88,158,248,0.1);
    /* background-color: aquamarine; */
    min-height: 100%;
    overflow: hidden;
}
</style>