<template>
	<div>
		<!-- Header -->
		<div class="user-dashboard-header">
			<img src="../assets/img/logo.png">
			<div class="header-wrap">
				<p style="margin:0;font-size:24px;">你好！ {{name}}</p>
				<el-button type="text" @click="dialogVisible=true;">修改密码</el-button>
				<el-button type="text" @click="logout">退出登录</el-button>
			</div>
		</div>
		<el-divider></el-divider>
		<!-- Body -->
		<div class="user-dashboard-body">
			<!-- File upload -->
			<div class="user-dashboard-sub-container">
				<u-score-wrap :account="account" @fresh="handleScoreFresh"></u-score-wrap>
			</div>
			<!-- Divider -->
			<el-divider direction="vertical"></el-divider>
			<!-- Rank -->
			<div class="user-dashboard-sub-container">
				<u-rank-wrap ref="RankWrap" :account="account"></u-rank-wrap>
			</div>
		</div>

		<!-- 修改密码弹框 -->
		<el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%">
			<el-form :model="form" ref="pwdForm" :rules="rules" label-width="120px">
				<el-form-item label="旧密码" prop="oldPwd" @keydown.enter.native="submitAlterPassword">
					<el-input v-model="form.oldPwd" placeholder="请输入" :type="pwdShow.old ? 'plain' : 'password'">
						<i class="el-icon-view" slot="suffix" @click="pwdShow.old=!pwdShow.old"></i>
					</el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="newPwd" @keydown.enter.native="submitAlterPassword">
					<el-input v-model="form.newPwd" placeholder="请输入" :type="pwdShow.new ? 'plain' : 'password'">
						<i class="el-icon-view" slot="suffix" @click="pwdShow.new=!pwdShow.new"></i>
					</el-input>
				</el-form-item>
				<el-form-item label="确认新密码" prop="confirmPwd" @keydown.enter.native="submitAlterPassword">
					<el-input v-model="form.confirmPwd" placeholder="请输入" :type="pwdShow.confirm ? 'plain' : 'password'">
						<i class="el-icon-view" slot="suffix" @click="pwdShow.confirm=!pwdShow.confirm"></i>
					</el-input>
				</el-form-item>
			</el-form>
			<div class="form-bottom">
				<el-button @click="form={};dialogVisible=false;">取消</el-button>
				<el-button type="primary" @click="submitAlterPassword">确认修改</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
import uScoreWrap from '../components/UserScoreWrap';
import uRankWrap from '../components/UserRankWrap';

export default {
	components: {
		uScoreWrap, uRankWrap
	},
	data() {
		const pwdValidator = (rule, value, callback) => {
			console.log(value)
            if (value === '') {
				callback(new Error('请输入密码'));
			} else if (value.length < 6) {
				callback(new Error('至少输入6位密码'));
            } else {
                callback();
            }
		};
		const pwdConfirm = (rule, value, callback) => {
            if (value === '') {
				callback(new Error('请输入密码'));
			} else if (value !== this.form.newPwd) {
				callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
		}
		return {
			name: this.Secret_Key(localStorage.getItem('user_name'),'123456789','D'),
			account: this.Secret_Key(localStorage.getItem('user_account'),'123456789','D'),
			dialogVisible: false,
			form: {
				oldPwd: '',
				newPwd: '',
				confirmPwd: ''
			},
			pwdShow: {
				old: false,
				new: false,
				confirm: false
			},
			rules: {
				oldPwd: [
					{required: true, message: '请输入旧密码'}
				],
				newPwd: [
					{required: true, validator: pwdValidator, trigger: 'blur'}
				],
				confirmPwd: [
					{required: true, validator: pwdConfirm, trigger: 'change'},
					{required: true, validator: pwdConfirm, trigger: 'blur'},
				]
			}
		}
	},
	methods: {
		submitAlterPassword() {
			const self = this;
			self.$refs.pwdForm.validate()
			.then(valid => {
				if (valid) {
					if (self.form.oldPwd === self.form.newPwd) {
						return self.$message({
							type: 'warning',
							message: '新旧密码一致，无需修改'
						});
					} else {
						// 加入用户账户
						self.form.account = self.account;

						self.$axios.post('/api/user/alter-password', self.form)
						.then(response => {
							const data = response.data;
							if (data.status === 200) {
								self.$message({
									type: 'success',
									message: '修改成功'
								});

								// self.form = {};
								self.dialogVisible = false;
							} else {
								console.error(data.message);
								self.$message({
									type: 'error',
									message: '[' + data.status + ']' + data.message
								});
							}
						})
						.catch(err => {
							console.error(err);
						});
					}
				}
			})
		},
		logout() {
			sessionStorage.clear();
			this.$router.replace('/login')
		},
		handleScoreFresh() {
			this.$refs.RankWrap.getRank();
		}
	},
}
</script>

<style scoped>
.user-dashboard-header {
	position: relative;
	width: 100%;
	height: 250px;
	vertical-align: bottom;
	margin: 0;
}
.user-dashboard-header img {
	height: 200px;
	width: 200px;
}
.user-dashboard-header .header-wrap {
	position: absolute;
	height: 50px;
	left: 0;
	bottom: 0;
	right: 0;
}
.user-dashboard-body {
	height: 800px;
	line-height: 800px;
}
.user-dashboard-body .el-divider {
	height: 100%;
	vertical-align: top;
}
.user-dashboard-sub-container {
	display: inline-block;
	vertical-align: top;
	height: 100%;
	/* width: 500px; */
}
.el-icon-view {
	cursor: pointer;
}
</style>