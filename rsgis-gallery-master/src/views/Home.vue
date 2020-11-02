<template>
	<div class="home">
		<!-- <navigation-bar></navigation-bar> -->
		<!--展开图标-->
		<!-- <div class="side" @click="drawer = true">
			<div class="arrow-side">
				<i class="el-icon-arrow-right"  type="primary" ></i>
			</div>
		</div> -->
		
		<!-- 左侧工具栏 -->
		<div>
			<el-drawer :visible.sync="isDrawerVisible" :direction="direction" :before-close="handleClose" size="3">
				<u-header></u-header>
				<s-area></s-area>
			</el-drawer>  
		</div>
		
		<!--主界面-->
		<div class="home-main" :style="homeMainStyle">
			<p-list></p-list>
		</div>

		<!-- 页面底部 -->
		<!-- <div class="home-footer" :style="homeFooterStyle">
			我是底部
		</div> -->
	</div>
</template>

<script>
import $ from 'jquery';
import pList from '../components/ProjectList';
import uHeader from '../components/UserHeader';
import sArea from '../components/SearchArea';
import NavigationBar from '../components/NavigationBar';

export default {
	components: {
		uHeader, sArea, pList,NavigationBar,
	},
	name: 'home',
	data() {
		const footerHeight = 0;
		return {
			footerHeight: footerHeight,
			isDrawerVisible: true,
			direction: 'ltr',
			homeMainStyle: {
				height: (innerHeight - footerHeight) + 'px',
				width: '100%',
				'overflow': 'hidden'
			},
			homeFooterStyle: {
				height: footerHeight + 'px',
				width: '100%',
				'background-color': 'aquamarine',
				position: 'fixed'
			}
		}
	},
	methods: {
		handleClose(done) {
			done();
		},
	},
	created() {
		$(window).resize(() => {
			this.homeMainStyle.height = (innerHeight - this.footerHeight) + 'px';
		})
	},
}
</script>

<style scoped>
.side{
	position: fixed;
	width: 1%;
	height: 100%;
	left: 0;
	background-color: rgb(215, 215, 236);
}
.arrow-side{
	position:absolute;
	top:50%;
}
.card-style{
	float: left;
}
</style>