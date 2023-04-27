<template>
	<el-container>
		<el-header style="height: 60px; padding-left: 0">
			<div class="logo" :style="{ width: isCollapse ? '64px' : '200px'}">
				<span style="color: #ffffff"> {{ isCollapse ? subtitle : title }} </span>
			</div>
			<div style="text-align: left; padding-left: 30px;display: inline-block;">
				<el-button plain v-if="!isCollapse" @click="isCollapse = true"><el-icon><Fold /></el-icon></el-button>
				<el-button plain v-show="isCollapse" @click="isCollapse = false"><el-icon><Expand /></el-icon></el-button>
			</div>
		</el-header>
		<el-container class="content-v">
			<el-aside class="aside" :style="{ width: isCollapse ? '64px' : '200px'}">
				<el-menu
						:default-active="menuActive"
						:uniqueOpened="true"
						:collapse="isCollapse"
						style="border: 0"
						background-color="#545c64"
						text-color="#fff"
						:router="true"
						active-text-color="#ffd04b">
					<el-menu-item index="/app/dash">
						<el-icon><Menu /></el-icon>
						<template #title>工作台</template>
					</el-menu-item>
					<el-menu-item index="/app/user">
						<el-icon><UserFilled /></el-icon>
						<template #title>用户管理</template>
					</el-menu-item>
					<el-sub-menu index="SensitiveWords">
						<template #title>
							<el-icon><WarnTriangleFilled /></el-icon>
							<span>敏感词</span>
						</template>
						<el-menu-item index="/app/SensitiveWords">设置</el-menu-item>
						<el-menu-item index="/app/SensitiveWordsHitRecord">命中记录</el-menu-item>
					</el-sub-menu>
					<el-menu-item index="/app/ChatGPTMessageRecord">
						<el-icon><ChatLineSquare /></el-icon>
						<template #title>对话记录</template>
					</el-menu-item>
					<el-menu-item index="/app/OpenAIKeyManager">
						<el-icon><Key /></el-icon>
						<template #title>OpenAI Key 池</template>
					</el-menu-item>

				</el-menu>
				<div class="footer" v-show="!isCollapse">&copy; 2023 - present</div>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
export default {
	data() {
		return {
			title: import.meta.env.VITE_APP_TITLE,
			subtitle: import.meta.env.VITE_APP_SUBTITLE,
			isCollapse: false
		}
	},
	computed: {
		menuActive() {
			return this.$route.path
		}
	}
}
</script>

<style scoped>
.el-header {
	height: 60px;
	background-color: white;
	line-height: 60px;
}

.footer {
	text-align: center;
	line-height: 60px;
	width: 200px;
	background-color: #545c64;
	color: #fecf57;
	clear: both;
	position: absolute;
	margin-top: -60px;
	bottom: 0px;
}

.aside {
	height: 100% !important;
	background-color: #545c64;
}

.el-container {
	height: 100%;
}

.el-header {
	height: 60px;
	background-color: white;
	line-height: 60px;
}

.el-header > span,
.el-header .el-dropdown {
	font-size: 18px;
}

.logo {
	background-color: #00aa8a; display: inline-block;text-align: center;
}

.el-main {
	text-align: left;
	color: #333;
}
</style>
