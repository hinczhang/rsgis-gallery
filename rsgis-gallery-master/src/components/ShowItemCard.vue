<template>

<el-card class="showItemCard"  shadow="hover">
<div @click="openDialog">
<div class="imgBox" >
    <div class="img">
        <el-image :src="info.img" fit="contain">
            <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
            </div>
            <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
            </div>
        </el-image>
        <el-image :src="info.img"></el-image>
    </div>
</div>
<div class="text" @click="openDialog">
        <div class="textHead">{{info.itemName}} <span style="float:right;color:rgba(151,158,165,0.9);font-size:12px;"><i class="el-icon-thumb"></i>{{info.view}}</span></div>
        <div class="textContent"><i class="el-icon-collection-tag"></i>{{info.course}}</div>
        <div class="textContent"><i class="el-icon-user"></i>{{info.members}}</div>   
       
</div>
</div>
</el-card>
</template>

<script>
export default {
    data () {

        return {
            
        };
    },
    props: {
        info:{},
    },
    methods: {
        openDialog() {
            this.$axios
                .post('/create/view',{
                    itemId:this.info.itemId
                })
                .then((response)=>{
                    console.log('view add one')
                    sessionStorage.setItem("userId",this.Secret_Key(this.info.userId,'123456789','E'));
                    sessionStorage.setItem("item",this.Secret_Key(this.info.itemId,'123456789','E'));
                    this.$emit('open',true);
                })
                .catch((error)=>{
                    console.log('error add')
                })
            
        }
    },
}
</script>

<style scoped>
.showItemCard {
    padding:0px;
    font-size:11px;
    color:rgba(151,158,165,0.9);
    width: 200px;
    margin:10px 7px;
}

.text {
    height:110px;
    width:180px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align:left;
    padding:10px;
}

.textHead {
    color: #555;
    margin:10px 0px;
    font-size:14px;
}

.textContent {
    margin:15px 0px;
    text-align: left;
}

.imgBox {
    position:relative;
    width: 200px;
    height:120px;
    overflow:hidden;
    /* border-radius:10px; */
}

.img{
  position:absolute;
  animation-play-state:paused;
}
.img:hover{
  animation:move 4s linear infinite;
}
@keyframes move{
  from {top:0px;}
  to {top:-250px;}
}
</style>
