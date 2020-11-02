<template>
    
</template>
<script>


export default {
    data () {
        this.$router.replace({
            path:'/login',
            name:'temp'
        })
        return {
            
        };
    },
    methods: {
        
        
    },
    created() {
         this.$router.push({path:'/login'});
    },

}
</script>