<template>
<div>
  <div id="wangeditor">
    <div v-show="isEditor">
      <div ref="editorElem" style="text-align:left;"><p  v-html="content"></p></div>
        <div style="top:15px!important;">
          <span class="edit-right" style="float:right!important;">
              <el-button-group>
                <el-button size="mini" type="primary" @click="getInfo()" >提交</el-button>
                <el-button size="mini" type="danger"  @click="cancel()" >取消</el-button>
              </el-button-group>
          </span>
        </div>
    </div>
    <div v-show="isRouterAlive">
      <div class="textbox"><p v-html="content" ></p></div>
    <div class="mybutton"><el-button type="primary" size="mini" @click="edit()" v-if="owner">编辑</el-button></div>
    </div>
  </div>

  </div>
</template>
<script>
import E from "wangeditor";
export default {
    name: "Editor",
    data() {
      return {
        isEditor:false,
        isRouterAlive:true,
        content:'<p style="text-align: center;">网络加载中，请稍后... ...',
        editor: null,
        editorContent: ''
      };
    },
    // catchData是一个类似回调函数，来自父组件，当然也可以自己写一个函数，主要是用来获取富文本编辑器中的html内容用来传递给服务端
    //传入参数
    props:{
        item:String,
        owner:false
    },
    methods:{
      getInfo(){
          this.content=this.editor.txt.html();
          console.log(this.item)
          this.$axios
              .post("/user/send", { 
                  item:this.item,
                  content:this.content   
              })
              .then((response) => {  
                  this.$notify({
                      title: '成功',
                      message: '修改成功',
                      type: 'success'
                  });   
                  this.$router.push({path:'/itemtemp'});
              })
              .catch((error) => {
                  this.$notify.error({
                      title: '错误',
                      message: '提交失败，请重试'+error
                  });
              });
          this.isRouterAlive=true;
          this.isEditor=false;
          
      },
      cancel(){
          this.isRouterAlive=true;
          this.isEditor=false;
      },
      edit(){
          this.isRouterAlive=false;
          this.isEditor=true;
      },
      loadContent(){
          this.$axios
              .post("/user/get", { 
                  item:this.item
              })
              .then((response) => {
                  this.content=response.data.content;
              })
              .catch((error) => {
                  this.$notify.error({
                      title: '错误',
                      message: '获取readme信息失败，请重试'+error
                  });
            });
        }
    },
    created(){
        this.loadContent();
    },
    mounted() {


      this.editor = new E(this.$refs.editorElem);
      
      this.editor.customConfig.menus = [
        // 菜单配置
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'code', // 插入代码
        'undo', // 撤销
        'redo' // 重复
      ];
      //var $text1 = $('#text1');
      /*editor.customConfig.onchange = function (html) {
            // 监控变化，同步更新到 textarea
            $text1.val(html)
      };*/
      this.editor.customConfig.uploadImgShowBase64=true;
      // 初始化 textarea 的值
      //$text1.val(editor.txt.html())
      this.editor.create(); // 创建富文本实例
    }
  }
</script>
<style scoped> 
  .textbox{
    margin-left: 10px;
  }
  .mybutton{
    float:right;
  }
</style>