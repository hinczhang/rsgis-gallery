<template>
    
</template>
<script>


export default {
    data () {
        this.$router.replace({
            path:'/modify',
            name:'temp'
        })
        return {
            
        };
    },
    methods: {
        
        
    },
    created() {
         this.$router.push({path:'/modify'});
    },

}
</script>