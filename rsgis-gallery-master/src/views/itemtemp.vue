<template>
    
</template>
<script>


export default {
    data () {
        this.$router.replace({
            path:'/item',
            name:'temp'
        })
        return {
            
        };
    },
    methods: {
        
        
    },
    created() {
         this.$router.push({path:'/item'});
    },

}
</script>