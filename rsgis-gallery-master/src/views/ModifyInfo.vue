<template>
<div>
    <navigation-bar></navigation-bar>
    <el-container>
        <change-avatar></change-avatar>
        <change-info></change-info>
    </el-container>
</div>
</template>

<script>
import NavigationBar from '../components/NavigationBar';
import ChangeInfo from '../components/ChangeInfo';
import ChangeAvatar from '../components/ChangeAvatar.vue';

export default {
    components: {
        NavigationBar,
        ChangeInfo,
        ChangeAvatar,
    },
    created(){
        var token=this.Secret_Key(sessionStorage.getItem("token"),'123456789','D');
        if(token!='user'){
            if(token==='admin'){
                this.$router.push({path:'/admin'});
            }else{
                this.$router.push({path:'/login'});
            }
        }
    }
}
</script>

<style scoped>

</style>