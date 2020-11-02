<template>
    <div class="user-header">
    <el-dropdown trigger="click">
        <div>
            <el-avatar :size="80" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" type="primary"><i class="el-icon-arrow-down el-icon--right"></i></el-avatar>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>社区主页</el-dropdown-item>
                <el-dropdown-item>我的主页</el-dropdown-item>
                <el-dropdown-item>我的上传</el-dropdown-item>
                <el-dropdown-item>账号设置</el-dropdown-item>
                <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </div>
    </el-dropdown>
    </div>
</template>

<style scoped>
.user-header{
    text-align: center;
}
</style>