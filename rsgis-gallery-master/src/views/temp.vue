<template>
    
</template>
<script>


export default {
    data () {
        this.$router.replace({
            path:'/temp',
            name:'temp'
        })
        return {
            
        };
    },
    methods: {
        
        
    },
    created() {
        sessionStorage.setItem("userId",localStorage.getItem("user_account"))
        this.$router.push({path:'/user'});
    },

}
</script>