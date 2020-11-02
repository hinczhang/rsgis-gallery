<template>
  <div class="card">
	  <img :src="img">
      <!-- <el-image :src="url" :style="cardImgStyle"></el-image>

      <div class="card-bottom">
        <span>好吃的汉堡</span>
        <div>
          <time class="time">A</time>
          <el-button type="text" class="button">操作按钮</el-button>
        </div>
      </div> -->
	  <div class="card-bottom">
		  <div class="information">
			  <p>作者：{{info.author}}</p>
			  <p>项目名称：{{info.projectName}}</p>
			  <p>上传时间：{{info.time}}</p>
		  </div>
		  <div class="operation">
			  <el-button type="primary" size="mini" @click="viewProject">查看</el-button>
			  <el-button type="danger" size="mini" @click="downloadProject">下载</el-button>
		  </div>
	  </div>
  </div>
</template>

<script>
export default {
	props: {
		img: {
			type: String,
			required: true
		},
		// info: {
		// 	type: Object,
		// 	required: false
		// }
	},
    data() {
        return {
			info: {
				author: '林杉',
				projectName: '一个项目',
				time: new Date(new Date().getTime() - Math.random() * 1000000000).toLocaleString()
			}
        };
	},
	methods: {
		viewProject() {
			this.$message.info('查看项目');
		},
		downloadProject() {
			this.$message.info('下载项目');
		}
	},
    
}
</script>

<style scoped>

/* by: 03 */
.card {
	height: auto;
	width: 100%;
	margin: 10px 0;
	position: relative;
	border-radius: 30px;
	background-color: azure;
	font-size: 14px;
}
.card img {
	border-radius: 30px 30px 0 0;
}
.card img {
	height: auto;
	width: 100%;
	min-height: 300px;
	margin: 0;
	vertical-align: bottom;
}
.card-bottom {
	margin: 0;
	height: 70px;
	width: 100%;
}
.card-bottom .information {
	padding-left: 15px;
	text-align: left;
	float: left;
	height: inherit;
}
.card-bottom .operation {
	padding-right: 15px;
	float: right;
	height: inherit;
	line-height: 70px;
}
.card-bottom p {
	margin: 0;
	padding: 0;
}
/* .card-bottom {
	background-image: url(https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1569045579623&di=241f1b01705563189f2fa6092343f2c4&imgtype=0&src=http%3A%2F%2Fku.90sjimg.com%2Felement_origin_min_pic%2F16%2F09%2F24%2F1057e5dfa48c4d3.jpg%2521%2Ffwfh%2F804x800%2Fquality%2F90%2Funsharp%2Ftrue%2Fcompress%2Ftrue);
	position: relative;
	bottom: 0;
	width: 100%;
	height: 60px;
	background-size:100% 60px;
} */
/* *** */

.time {
    font-size: 80%;
    color: #999;
}
.name{
	font-size: 100%
}
.author{
 	font-size: 100%
}
.detail{
  	font-size: 60%
}

  
  /* .bottom {
    margin-top: 10%;
    line-height: 100%;
  } */

.button {
	padding: 0;
	float: right;
}



  /* .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  } */
</style>