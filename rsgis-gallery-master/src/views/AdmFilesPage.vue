<template>
    <div>
     <div style="margin:0 0 15px 0"><el-button type="primary" round @click="jump">进入文件管理系统页面</el-button></div>
    
     <div><el-image :src="img"></el-image></div>
    </div>
</template>

<script>
import { METHODS } from 'http'
export default {
        name: 'dashboard',
        data() {
            return {
                img:'filemanager.gif'
            }
        },
        methods:{
            jump(){
                window.open('http://47.111.9.61:8888');
            }
        }
}
</script>

<style>
.adm-file-page {
    padding: 0 150px;
    height: 100%;
}
.adm-file-page .el-tree-node__content {
    height: 35px;
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
</style>