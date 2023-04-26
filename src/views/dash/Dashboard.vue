<template>
	<div class="container-fluid">
		<div class="panel">
			<div class="panel-body">
				<div class="font20" v-if="quote.english">{{ quote.english }}</div>
				<div class="font20" v-if="quote.chinese">{{ quote.chinese }}</div>
				<el-row>
					<el-col :span="20">
						<div class="chat-element">
							<div class="pull-left img-element">
								<img alt="image" style="width: 80px; height: 80px" class="img-circle" src="@/assets/avatar.jpg">
							</div>
							<div class="media-body">
								<p class="font24 header">{{ welcome_msg }}</p>
								<p class="font13">
									跑步呐，最重要的是要有动力
								</p>
							</div>
						</div>
					</el-col>
					<el-col :span="4">&nbsp;</el-col>
				</el-row>
			</div>
		</div>

		<el-row :gutter="20">
			<el-col :span="4" v-for="metric in metrics" :key="metric.title">
				<div class="metric cursor-pointer" style="background-color: #ffffff">
					<p>
						<span class="number">{{ metric.title }}</span>
						<span class="title">{{ metric.subtitle }}</span>
					</p>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>



function getMsg(hour) {
	let msg
	if (hour < 5) {
		msg = '是不是又熬夜了，注意身体哦！'
	} else if (hour < 8) {
		msg = '一日之计在于晨！做好一天的计划'
	} else if (hour < 10) {
		msg = '上班开始！每天都是元气满满'
	} else if (hour < 12) {
		msg = '多和同事沟通能提高效率哦'
	} else if (hour < 13) {
		msg = '该吃饭了吧，人是铁，饭是钢哦！'
	} else if (hour < 14) {
		msg = '休息一下，下午才有力气搬砖！'
	} else if (hour < 17) {
		msg = '努力中....'
	} else if (hour < 18) {
		msg = '工作了一天，适当休息一下吧！'
	} else if (hour < 19) {
		msg = '看看自己劳动成功，好好的犒劳一下自己吧!'
	} else if (hour < 23) {
		msg = '不会在加班吧，努力吧骚年!'
	} else if (hour === 23) {
		msg = '偷偷告诉我：你最近是不是又胖了！'
	} else {
		msg = '鬼知道这是什么时间'
	}
	return msg
}

export default {
	data() {
		let myDate = new Date()
		myDate.getHours()
		return {
			welcome_msg: '告诉我现在几点了？',
			quote: {
				english: 'A friend is one of the nicest things you can have, and one of the best things you can be.',
				chinese: ''
			},
			metrics: [{title: '今日问题数', subtitle: 10}],
		}
	},
	mounted: function () {
		this.$nextTick(function () {
			setInterval(this.timer, 1000)
		})
	},
	methods: {
		timer: function () {
			let now = new Date()
			this.welcome_msg = getMsg(now.getHours())
		},
		openWindow(url) {
			window.open(url,'_blank');
		}
	}
}
</script>

<style scoped>
.media-body .header {
	margin-bottom: 10px;
	margin-top: 20px;
	font-weight: 100;
}

.img-element {
	padding: 10px;
}

.chat-element {
	padding: 15px;
}

.cursor-pointer {
	cursor:pointer;
}
</style>
