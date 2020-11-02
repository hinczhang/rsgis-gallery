<template>
<el-main class="homeMain">
<div>
    <div id="hList">
        <div v-if="ItemList.length == 0">似乎没有数据哦</div>
        <template v-for="i in hNumber">
            <el-row :key="'row'+i" >
                <el-col v-for="j in wNumber" :key="i+'col'+j" :span="4.5">
                    <show-item-card :info="ItemList[(i-1)*wNumber+(j-1)]" @open="openDialog"></show-item-card>
                </el-col>
            </el-row>
        </template>
        <el-row>
            <el-col :span="4.5" v-for="i in ItemList.length-hNumber*wNumber" :key="i+'col'">
                <show-item-card :info="ItemList[hNumber * wNumber + i - 1]" @open="openDialog"></show-item-card>
            </el-col>
        </el-row>
    </div>



    <!-- 弹出显示的singleItem的Dialog -->
    <el-dialog :visible.sync="dialogVisible" v-if="dialogVisible" width="95%">
        <single-item></single-item>
    </el-dialog>
</div>
</el-main>
</template>

<script>
import ShowItemCard from './ShowItemCard.vue';
import SingleItem from './SingleItem';

export default {
    components: {
        ShowItemCard,
        SingleItem,
    },
    data() {

        return {
            userId:'',
            keyword:'',
            screenWidth: '',
            ending:false,
            loading:false,
            page:0,
            wNumber:5,
            hNumber:0,
            dialogVisible:false,
            isCollapse:false,
            info:{
                img:'card.png',
                course:'GIS软件工程开发设计',
                itemName:'项目一',
                itemId:'',
                userId:'',
                members:'',
            },
            ItemList:[],
        };
    },
    props: {
        selectGrade:'',
        selectYear:[],
        selectCourses:[],
    },
    
    methods: {
        searchInfo(flag){
            
            this.$axios
                .post("/home/item",{
                    keyword:this.keyword,
                    course:this.selectCourses,
                    date:this.selectYear,
                    score:this.selectGrade,
                    page:this.page,
                    userId:this.userId
                })
                .then((response) =>{
                    //如果回调正常，还有新数据
                    if(flag){
                        this.page=0;
                        this.ItemList=[];
                        this.$emit('e',false);
                        this.ending = false;
                    }else{

                    }
                    if(response.data.res==0){
                        this.$emit('l',false);
                        this.loading = false;
                        this.ItemList=this.ItemList.concat(response.data.item);
                        this.page++;
                    }
                    else if(response.data.res==1){
                        //如果回调不正常，没有数据了

                        this.ItemList=this.ItemList.concat(response.data.item);
                        this.$emit('l',false);
                        this.loading = false;
                        this.$emit('e',true);
                        this.ending = true;
                    }
                            
                })
                .catch((error)=>{
                            
                })    
        },
        openDialog(data) {
            this.dialogVisible = data;
        },
        handleScroll() {
            
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop // 滚动条偏移量
            var hHeight = document.getElementById('hList').offsetHeight;
            var wHeight = window.innerHeight;
           
            if (((hHeight + 100 <= scrollTop + wHeight && !this.loading) || (hHeight < wHeight && scrollTop == 0))&& !this.ending)
            {
                this.$emit('l',true);
                this.loading = true;
                setTimeout(() => {
                    //AXios请求数据
                    this.searchInfo(false);
                    
                },500);
                
            }
        },
    },
    mounted() {
        window.addEventListener('scroll',this.handleScroll) // 监听滚动事件
        this.screenWidth = document.body.clientWidth;
        window.onresize = () => {
        return (() => {
            this.screenWidth = document.body.clientWidth;
        })();
        };
        
        this.keyword=sessionStorage.getItem("keyword");
        this.userId=this.Secret_Key(localStorage.getItem('user_account'),'123456789','D');
        sessionStorage.setItem("keyword",'');
       
        this.searchInfo(true);

    },
    watch: {
        screenWidth: {
            handler:function(n,o){
                if (n > 1200){
                    this.wNumber = 5;
                    document.getElementById('hList').style.width = '1100px';
                }
                else if (n > 1000){
                    this.wNumber = 4;
                    document.getElementById('hList').style.width = '900px';
                }
                else if (n > 800){
                    this.wNumber = 3;
                    document.getElementById('hList').style.width = '700px';
                }
                else if (n > 500){
                    this.wNumber = 2;
                    document.getElementById('hList').style.width = '500px';
                }
                else{
                    this.wNumber = 1;
                    document.getElementById('hList').style.width = '300px';
                }
                this.hNumber = Math.floor(this.ItemList.length / this.wNumber);

            },
            immediate:true,
        },
        ItemList: {
            handler:function(n,o){
                
                this.hNumber = Math.floor(this.ItemList.length / this.wNumber);
            },
            immediate:true,
        },
        selectYear: {
            handler:function(n,o){
                if(o===undefined){
                    return;
                }
                else{
                    this.ItemList=[];
                    this.page=0;
                    this.searchInfo(true);
                }
                
            },
            //immediate:true,
        },
        selectCourses: {
            handler:function(n,o){
                console.log(n,o)
                if(o===undefined){
                    
                    return;
                }
                else{
                    this.ItemList=[];
                    this.page=0;
                    this.searchInfo(true);
                }
                
            },
            //immediate:true,
        },
        selectGrade: {
            handler:function(n,o){
                if(n!=o&&o!=undefined){
                    this.ItemList=[];
                    this.page=0;
                    this.searchInfo(true);
                }
                
            },
            immediate:true,
        }
    },
    created() {

    },

}
</script>

<style scoped>

.homeMain {
    padding:0px;
    /* background-color:rgb(250,250,250); */
}

#hList {
    margin:0px auto;
    width:1100px;
}

</style>