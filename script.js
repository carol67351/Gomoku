var chess = document.getElementById('chess');
var context = chess.getContext('2d');
var me = true;
var over = false;
context.strokeStyle = '#bfbfbf';
//初始化棋子都未落子
var chessBoard = [];
for (var i = 0; i < 15; i++) {
	chessBoard[i] = [];
	for (var j = 0; j < 15; j++) {
		chessBoard[i][j] = 0;
	}
}
//水印图片
var logo = new Image();
logo.src = 'image.png';
logo.onload = function () {
	context.drawImage(logo, 0, 0, 450, 450);	
}
window.onload=function(){
drawChessBoard();
}
//画棋盘
var drawChessBoard = function () {
	for (var i = 0; i < 15; i++) {
		context.moveTo(15 + i * 30, 15);
		context.lineTo(15 + i * 30, 435);
		context.stroke();
		context.moveTo(15, 15 + i * 30);
		context.lineTo(435, 15 + i * 30);
		context.stroke();
	}
}
//赢法数组 三维
var wins = [];
for (var i = 0; i < 15; i++) {
	wins[i] = [];
	for (var j = 0; j < 15; j++) {
		wins[i][j] = [];
	}
}
//赢法种类索引值
var count = 0;
//纵线赢法
for (var i = 0; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[i][j + k][count] = true;
		}
		count++;
	}
}
//横线赢法
for (var i = 0; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[j + k][i][count] = true;
		}
		count++;
	}
}
//斜线赢法
for (var i = 0; i < 11; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[i + k][j + k][count] = true;
		}
		count++;
	}
}
//反斜线赢法
for (var i = 0; i < 11; i++) {
	for (var j = 14; j > 3; j--) {
		for (var k = 0; k < 5; k++) {
			wins[i + k][j - k][count] = true;
		}
		count++;
	}
}
//赢法统计数组 一维 初始化
var myWin = [];
var computerWin = [];
for (var i = 0; i < count; i++) {
	myWin[i] = 0;
	computerWin[i] = 0;
}
//画棋子
var oneStep = function (i, j, me) {
	context.beginPath();
	context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
	if (me) {
		gradient.addColorStop(0, "#0a0a0a");
		gradient.addColorStop(1, "#636766");
	} else {
		gradient.addColorStop(0, "#d1d1d1");
		gradient.addColorStop(0, "#f9f9f9");
	}
	context.fillStyle = gradient;
	context.fill();
}
//我方落子
chess.onclick = function (e) {
	if (over) {
		return;
	}
	if (!me) {
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);
	//判断棋子是否已落子
	if (chessBoard[i][j] == 0) {
		oneStep(i, j, me);
		chessBoard[i][j] = 1;
		//判断我方是否赢棋
		for (var k = 0; k < count; k++) {
			if (wins[i][j][k]) {
				myWin[k]++;
				computerWin[k] = 6;
				if (myWin[k] == 5) {
					window.alert("你赢了！");
					over = true;
				}
			}
		}
		if (!over) {
			me = !me;
			computerAI();
		}
	}
}
//计算机落子 根据得分来判断在哪里落子
//初始化
var computerAI = function () {
	var myScore = [];
	var computerScore = [];
	//保存最高分数的点  值 坐标
	var max = 0;
	var u = 0, v = 0;
	for (var i = 0; i < 15; i++) {
		myScore[i] = [];
		computerScore[i] = [];
		for (var j = 0; j < 15; j++) {
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	//获得最优落子位置
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			if (chessBoard[i][j] == 0) {
				for (var k = 0; k < count; k++) {
					if (wins[i][j][k]) {
						//拦截我方分数
						if (myWin[k] == 1) {
							myScore[i][j] += 200;
						}
						if (myWin[k] == 2) {
							myScore[i][j] += 400;
						}
						if (myWin[k] == 3) {
							myScore[i][j] += 1000;
						}
						if (myWin[k] == 4) {
							myScore[i][j] += 2000;
						}
						//计算机拦截分数
						if (computerWin[k] == 1) {
							computerScore[i][j] += 220;
						}
						if (computerWin[k] == 2) {
							computerScore[i][j] += 500;
						}
						if (computerWin[k] == 3) {
							computerScore[i][j] += 1500;
						}
						if (computerWin[k] == 4) {
							computerScore[i][j] += 20000;
						}
					}
					//判断落子位置
					if (myScore[i][j] > max) {
						max = myScore[i][j]
						u = i;
						v = j;
					} else if (myScore[i][j] == max) {
						if (computerScore[i][j] > computerScore[u][v]) {
							u = i;
							v = j;
						}
					}
					if (computerScore[i][j] > max) {
						max = computerScore[i][j]
						u = i;
						v = j;
					} else if (computerScore[i][j] == max) {
						if (myScore[i][j] > myScore[u][v]) {
							u = i;
							v = j;
						}
					}
				}
			}
		}
	}
	oneStep(u, v, false);
	chessBoard[u][v] = 2;
	for (var k = 0; k < count; k++) {
		if (wins[u][v][k]) {
			computerWin[k]++;
			myWin[k] = 6;
			if (computerWin[k] == 5) {
				window.alert("计算机赢了！");
				over = true;
			}
		}
	}
	if (!over) {
		me = !me;
	}
}