<template>
    <div class="login-wrap" >
        <el-form class="form" ref="loginForm" :model="form" label-width="70px">
            <el-form-item label="账户">
                <el-input  style="width:300px;" v-model="form.account" filterable placeholder="账户"></el-input>
                <!-- <el-select style="width:300px;" v-model="form.account" filterable placeholder="账户">
                    <el-option
                        v-for="item in accountList"
                        :key="item.account"
                        :label="item.account"
                        :value="item.account"
                    >
                        <span>{{item.account}}</span>
                        <el-tag :type="item.permission === 'admin' ? 'danger' : 'success'"
                            style="float:right"
                            size="mini"
                        >
                            {{item.permission === 'admin' ? '管理员' : '普通用户'}}
                        </el-tag>
                    </el-option>
                </el-select> -->
            </el-form-item>
            <el-form-item label="密码">
                <el-input style="width:300px;" v-model="form.password" placeholder="密码" type="password"></el-input>
            </el-form-item>
            <el-form-item v-if="isGtOk" label="完成验证">
                <span id="gtModule"></span>
            </el-form-item>
        </el-form>
        <br>
        <div class="bottom-btn">
            <el-button type="primary" @click="login()">登录</el-button>
            <el-button @click="register()">注册</el-button>
        </div>
    </div>
</template>

<script>
// 引入initGeetest
require('../assets/js/gt');

export default {
    data() {
        return {
            i: 0,
            form: {
                account: '',
                password: ''
            },
            isGtOk: false,
            captchaObj: {},
            accountList: [],
            gtRegistered: false
        }
    },
    methods: {
        handleGtInit(captchaObj) {
            this.isGtOk = true;
            this.captchaObj = captchaObj;
            this.captchaObj.appendTo('#gtModule');
        },
        login(loginForm='loginForm') {
            const self = this;

            if (!self.gtRegistered) {
                return self.$alert('请等待完成网络检测', '提示', {type: 'warning'});
            }
            
            // 极验验证
            if (self.isGtOk && self.captchaObj) {
                if (!self.captchaObj.getValidate()) {
                    return self.$alert('请先完成验证', '提示', {
                        type: 'warning'
                    });
                } else {
                    self.submitForm();
                }
            } else {
                self.submitForm();
            }            
        },
        submitForm() {
            const self = this;
            // 表单提交
            self.$refs.loginForm.validate()
            .then(valid => {
                if (valid) {
                    self.$axios.post('/api/user/login', self.form)
                    .then(response => {
                        const data = response.data;
                        if (data.status === 200) {
                            self.$message({
                                message: data.message,
                                type: 'success'
                            });
                            
                            // 设置用户权限
                            sessionStorage.setItem('permission', this.Secret_Key(data.permission,'123456789','E'));

                            // 分权限浏览页面
                            if (data.permission === 'user') {
                                self.$router.push('/user');
                                localStorage.setItem('user_name', this.Secret_Key(data.name,'123456789','E'));
                                localStorage.setItem('user_account', this.Secret_Key(self.form.account,'123456789','E'));
                                sessionStorage.setItem('userId', this.Secret_Key(self.form.account,'123456789','E'));
                                sessionStorage.setItem('token',this.Secret_Key('user','123456789','E'));
                            } else if (data.permission === 'admin') {
                                self.$router.push('/admin');
                                localStorage.setItem('user_name', this.Secret_Key(data.name,'123456789','E'));
                                localStorage.setItem('user_account', this.Secret_Key(self.form.account,'123456789','E'));
                                sessionStorage.setItem('token',this.Secret_Key('admin','123456789','E'));
                            }
                        } else {
                            self.$message({
                                message: '登入错误，请重试',///+self.form.account+'-'+self.form.password,
                                type: 'error'
                            });
                        }
                    })
                    .catch(err => {
                        if (err) {
                            self.$message({
                                message: '登入错误，请重试',
                                type: 'error'
                            });
                           
                        }
                    })
                }
            })
            .catch(valid => console.error("wrong") );
        },
        register() {
            this.$emit('register');
        },
        getAccount() {
            const self = this;
            self.$axios.get('/api/user/all-account')
            .then(response => {
                const data = response.data;
                if (data.status === 200) {
                    self.accountList = data.result;
                } else {
                    //console.error(data);
                    return self.$message({
                        type: 'error',
                        message: '[' + data.status + ']' + data.message
                    });
                }
            }).catch(err => console.error(err));
        }
    },
    created() {
        const self = this;
        self.getAccount();

        self.$axios.get('/gt/register?t=' + (new Date()).getTime())
        .then(response => {
            const data = response.data;
            const result = data.result;
            if (data.status === 200) {
                initGeetest({
                    gt: result.gt,
                    challenge: result.challenge,
                    new_captcha: result.new_captcha,
                    offline: !result.success,
                    product: "float", // float/popup
                    width: "100%"
                }, self.handleGtInit)
            } else {
                console.log(data)
            }

            // 表明已注册，可以登录
            self.gtRegistered = true;
            // self.$message({
            //     type: data.status === 200 ? 'warning' : 'info',
            //     message: '当前环境：' + (data.status === 200 ? '互联网连接' : '无互联网连接')
            // });

        }).catch(error => console.error(error));
    },
}
</script>

<style scoped>
.login-wrap {
    display: inline-block;
    vertical-align: middle;
    line-height: 0;
    text-align: left;
}
.form {
    text-align: center;
}
.bottom-btn {
    line-height: 0;
    text-align: center;
}
</style>