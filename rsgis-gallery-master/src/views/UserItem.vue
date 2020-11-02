<template>
    <div style="min-height:100%;">
        <navigation-bar></navigation-bar>
        <single-item></single-item>
    </div>
</template>

<script>
import SingleItem from '../components/SingleItem.vue';
import NavigationBar from '../components/NavigationBar';

export default {
    components: {
        SingleItem,
        NavigationBar,
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