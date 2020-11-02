<template>
<el-aside class="homeAside"  width="auto">
<!-- <div style="width:65px;position:relative;"></div> -->
<div class="fDiv" id="fMenu">
    <el-menu :collapse="isCollapse" @select="handleSelect">
        <el-menu-item @click="changeCollapse"><i :class="iClass" id="arrow"></i></el-menu-item>

        <el-submenu index="1">
            <template slot="title">
                <i class="el-icon-time"></i>
                <span slot="title">年份</span>
            </template>
            <template v-for="y in selectYear">
                <el-row :key="y">
                <el-tag  type="success" closable effect="dark"  :disable-transitions="true" @close="handleClose(1,y)">{{y}}</el-tag>
                </el-row>
            </template>
            <el-menu-item-group >
                <template v-for="i in year">
                <el-menu-item  :key="'1-'+i" :index="(i+2018)" v-show="selectYear.indexOf(i+2018)==-1">{{(i+2018)}}</el-menu-item>
                </template>
            </el-menu-item-group>
        </el-submenu>
            
        <el-submenu index="2" >
            <template slot="title">
                <i class="el-icon-collection-tag"></i>
                <span slot="title">课程</span>
            </template>
            <template v-for="(course, index) in selectCourses">
            <el-row :key="course">
            <el-tag   type="success" closable effect="dark"  :disable-transitions="true" @close="handleClose(2,index)">{{course}}</el-tag>
            </el-row>
            </template>
            <el-menu-item-group>
                <template v-for="(c, i) in courses" >
                    <el-menu-item :key="'2-'+i" :index="c" v-show="selectCourses.indexOf(c)==-1">{{c}}</el-menu-item>
                </template>
                
            </el-menu-item-group>
        </el-submenu>

        <el-submenu index="3" >
             <template slot="title">
                <i class="el-icon-finished"></i>
                <span slot="title">按浏览量</span>
            </template>
            <el-tag v-if="selectGrade" type="success" closable effect="dark"  :disable-transitions="true" @close="handleClose(3,selectGrade)">浏览量高</el-tag>
            <el-menu-item-group v-else>
                <el-menu-item index="85">浏览量高</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
    </el-menu>
</div>
</el-aside>
</template>

<script>
export default {
    
    data() {

        return {
            isCollapse:true,
            iClass:'el-icon-d-arrow-right',
            courses:[],
            year:0,
            selectYear:[],
            selectCourses:[],
            selectGrade:'',
        };
    },

    methods: {
        handleScroll() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop // 滚动条偏移量
            var fHeight = document.getElementById('fMenu').offsetHeight;
            var fMarginTop = document.getElementById('fMenu').style.marginTop;
            var wWidth = window.innerWidth;
            var wHeight = window.innerHeight;
            // let offsetTop = document.querySelector('#fMenu').offsetTop;  // 要滚动到顶部吸附的元素的偏移量
            // var fTop = scrollTop < 180 ? 180 - scrollTop : 0; 
            // document.getElementById('fMenu').style.top = fTop + 'px';
            // console.log(fHeight,wHeight,fMarginTop,fMarginTop  > (scrollTop-180) + 'px');
            if (fHeight < wHeight || fMarginTop  > (scrollTop-180) + 'px')
            {
                var fTop = scrollTop > 180 ? scrollTop - 180 : 0;
                document.getElementById('fMenu').style.marginTop = fTop + 'px';
            }
            else
            {
                if (fMarginTop < (scrollTop + wHeight - fHeight - 180) + 'px')
                {
                    var fTop = scrollTop + wHeight - fHeight - 180 > 0 ? scrollTop + wHeight - fHeight - 180 : 0;
                    document.getElementById('fMenu').style.marginTop = fTop + 'px';
                }
            }
        },

        changeCollapse () {
            if (this.isCollapse)
            {
                this.isCollapse = false;
                this.iClass = 'el-icon-d-arrow-left';
            }
            else
            {
                this.isCollapse = true;
                this.iClass = 'el-icon-d-arrow-right';
            }
           
        },

        handleSelect(index, indexPath){
            if (indexPath[0] == '1')
            {
                this.selectYear.push(index);
            }
            else if (indexPath[0] == '2')
            {
                this.selectCourses.push(index);
            }
            else if (indexPath[0] == '3')
            {
                this.selectGrade = index;
            }
            handleScroll();
        },

        handleClose(kind, name){
            var index;
            if (kind == 1)
            {
                index = this.selectYear.indexOf(name);
                this.selectYear.splice(index, 1);
            }
            else if (kind == 2)
            {
                this.selectCourses.splice(name, 1);
            }
            else if (kind == 3)
            {
                this.selectGrade = '';
            }

        },
    },

    mounted(){
        window.addEventListener('scroll',this.handleScroll) // 监听滚动事件
        this.year = new Date().getFullYear() - 2018;
        this.$axios
            .post("/home/readCourse",{

            }).then((response)=>{
                this.courses=response.data.course;
            }).catch((error)=>{
                this.$notify.error({
                    title: '错误',
                    message: '载入课程错误，请稍后重试！\n'+error,
                });
            })
    },

    created() {
       
    },

    watch: {
        selectGrade: {
            handler:function(n,o)
            {
                this.$emit('g',n);
            },
            immediate:true,
            deep:true,
        },
        selectYear: {
            handler:function(n,o)
            {
                this.$emit('y',n);
            },
            immediate:true,
            deep:true,
        },
        selectCourses: {
            handler:function(n,o)
            {
                this.$emit('c',n);
            },
            immediate:true,
            deep:true,
        },
    },
    
}
</script>

<style scoped>
.fDiv {
    /* position: fixed; */
    margin-top:0px;
    /* top:180px; */
    /* bottom:0; */
    overflow: visible;
}
</style>