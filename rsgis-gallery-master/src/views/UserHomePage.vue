<template>
    <div>
        <navigation-bar></navigation-bar>
        <el-container>
            <user-avatar></user-avatar>
            <user-items ></user-items>
        </el-container>
    </div>
</template>

<script>
import NavigationBar from '../components/NavigationBar';
import UserAvatar from '../components/UserAvatar';
import UserItems from '../components/UserItems';

export default {
    components: {
        NavigationBar,
        UserItems,
        UserAvatar,
    },
    data () {
        return {
            
        };
    },
    methods: {
        
        
    },
    created() {
        var token=this.Secret_Key(sessionStorage.getItem("token"),'123456789','D');
        if(token!='user'){
            if(token==='admin'){
                this.$router.push({path:'/admin'});
            }else{
                this.$router.push({path:'/login'});
            }
        }
    },

}
</script>

<style scoped>

</style>