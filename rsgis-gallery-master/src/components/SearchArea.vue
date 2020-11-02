<template>
    <div class="search-area">
        <!-- 搜索区 -->
        <div>
            <el-input maxlength="100px" name="Myinput" v-model="input" placeholder="请输入内容"></el-input>
            <el-button type="info">搜索</el-button>
        </div>

        <!-- 浏览区 -->
        <div>
            <el-tabs v-model="activeName" @tab-click="handleClick" class="el-header">
                <el-tab-pane label="按时间" name="first">
                    <el-tree :props="props" :load="loadNode" lazy show-checkbox @check-change="handleCheckChange">
                    </el-tree>
                </el-tab-pane>
            
                <el-tab-pane label="按课程" name="second">
                    <div>
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="checkedClass" @change="handleCheckedClassesChange">
                            <el-checkbox v-for="myclass in classes" :label="myclass" :key="myclass" border>{{myclass}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="按高分" name="third">
                    按高分
                </el-tab-pane>
            </el-tabs>

        </div>
    </div>
</template>

<script>
const classesOptions=['GIS软件设计','数据库设计','数字图像处理'];
export default {
    
    data() {
        return {
            activeName:'first',
            input: ' ',
            props: {
                label: 'name',
                children: 'zones'
            },
                    Treecount:1,
            checkAll: true,
            checkedClass: [],
            classes: classesOptions,
            isIndeterminate: true
        }
    },
    
    methods:{
        handleClick(tab,event){
            console.log(tab,event);
        },
    
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        handleCheckAllChange(val) {
            this.checkedClass = val ? classesOptions : [];
            this.isIndeterminate = false;
        },
        handleCheckedClassesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.classes.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.classes.length;
        },
    
        loadNode(node, resolve) {
        var hasChild=true;
        if (node.level === 0) {
          var CountData=new Date();
          var MonthData=new Array();
          for(var i=CountData.getFullYear();i>=2014;i--){
            MonthData.push({name:i+'年'});
          }
          return resolve(MonthData);
        }
        if(node.level===2){
          hasChild=false;
        }
        if (node.level > 1) return resolve([]);
        setTimeout(() => {
          var data;
          if (hasChild) {
            var data=new Array();
          for(var i=12;i>=1;i--){
              data.push({
              name: '月份' + i
            })
          };
          return resolve(data);
          } else {
            data = [];
          }

          resolve(data);
        }, 500);
      },
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
      handleNodeClick(data) {
        console.log(data);
      },
    }
}
</script>

<style scoped>
.search-area{
    text-align: center;
}
</style>