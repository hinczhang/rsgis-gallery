<template>

    <el-container direction="vertical">
        <navigation-bar></navigation-bar>
        <el-container>
            <search-menu @y="y" @c="c" @g="g"></search-menu>
            <el-container>
            <item-list :selectGrade="selectGrade" :selectYear="selectYear" :selectCourses="selectCourses" @l="load" @e="e"></item-list>
            <el-footer>
                <div  v-show="loading" v-loading="loading" element-loading-text="拼命加载中╮(╯▽╰)╭" element-loading-spinner="el-icon-loading"></div>
                <div v-show="ending" style="color:rgba(103,158,241,0.7);">到底了o(≧口≦)o</div>
            </el-footer>
            </el-container>
        </el-container>
    </el-container>

</template>

<script>

import NavigationBar from '../components/NavigationBar';
import SearchMenu from '../components/SearchMenu';
import ItemList from '../components/ItemList';


export default {
    components: {
        NavigationBar,
        SearchMenu,
        ItemList,
    },
    data() {

        return {
            loading:false,
            ending:false,
            selectGrade:'',
            selectYear:[],
            selectCourses:[],
            dialogVisible:false,
            widthTest:200,    
        };
    } ,
    methods: {
        y(data){
            this.selectYear = data;
        },

        c(data) {
            this.selectCourses = data;
        },

        g(data) {
            this.selectGrade = data;
        },
        load(data){
            this.loading = data;
        },
        e(data) {
            this.ending = data;
        }
    },
    mounted(){

    }

}
</script>

<style scoped>

</style>