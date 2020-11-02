<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">{{ title }}</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- <el-badge :value="12" class="item">
                    <i class="el-icon-info" size="small"></i>
                </el-badge> -->
                <!-- 消息中心 -->
                
                <div class="btn-bell" style="margin: 3px 10px 0 10px" @click="openDialog">
                    <el-badge :value="message" class="item">
                    <el-tooltip
                        effect="dark"
                        :content="message?`有${message}条未读消息`:`消息中心`"
                        placement="bottom"
                    >
                   
                    <i class="el-icon-bell"></i>
                 
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                     </el-badge>
                </div> 
               
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img src="../assets/img/img.jpg" />
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <!-- <a href="https://github.com/lin-xin/vue-manage-system" target="_blank">
                            <el-dropdown-item>项目仓库</el-dropdown-item>
                        </a> -->
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <el-dialog :visible.sync="dialogVisible" v-if="dialogVisible" width="60%">
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="BUG提交时间">
                        <span>{{ props.row.time }}</span>
                    </el-form-item>
                    <el-form-item label="提交人联系方式">
                        <span>{{ props.row.connect }}</span>
                    </el-form-item>
                    <el-form-item label="BUG细则">
                        <span>{{ props.row.detail }}</span>
                    </el-form-item>
                    </el-form>
                </template>
                </el-table-column>
                <el-table-column
                label="BUG提交时间"
                prop="time">
                </el-table-column>
                <el-table-column
                label="提交人联系方式"
                prop="connect">
                </el-table-column>
                <el-table-column
                label="操作"
                >
                <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="danger"
                    @click="handleEdit(scope.row)">删除记录</el-button>
                </template>
                </el-table-column>
            </el-table>
            
        </el-dialog>
    </div>
</template>
<script>
import bus from '../bus';
export default {
    data() {
        return {
            tableData:[],
            dialogVisible:false,
            collapse: false,
            fullscreen: false,
            name: '',
            message: 2
        };
    },
    props: {
        title: {
            required: true,
            type: String
        }
    },
    computed: {
        username() {
            let username = this.Secret_Key(localStorage.getItem('user_name'),'123456789','D')
            return username ? username : this.name;
        }
    },
    methods: {
        Refresh(){
            this.$axios
                .post("/home/getbug",{
                })
                .then((response)=>{
                    this.tableData=response.data.table;
                    this.message=this.tableData.length;
                })
                .catch((error)=>{
                    this.$notify.error({
                        title: '错误',
                        message: '获取信息失败，请稍后重试'+error,
                    });
                })
        },
        handleEdit(row) {
            this.$axios
                .post("/home/deletebug",{
                    id:row.id
                })
                .then((response)=>{
                    this.Refresh();
                })
                .catch((error)=>{
                    this.$notify.error({
                         title: '错误',
                        message: '删除信息失败，请稍后重试'+error,
                    });
                })
        },
        openDialog(){
            this.dialogVisible=true;
        },
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command == 'loginout') {
                sessionStorage.clear();
                this.$router.push('/login');
            }
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        }
    },
    mounted() {
        this.Refresh();
        if (document.body.clientWidth < 1500) {
            this.collapseChage();
        }
    }
};
</script>
<style scoped>
.header {
    background-color: #242f42;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    text-align: left;
    float: left;
    width: 250px;
    line-height: 70px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>
