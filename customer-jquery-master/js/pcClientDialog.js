$(function(){
	// 对话框高度计算
	var bodyHeight = $("body").height();
	var head = $(".head").height();
	var footer = $(".footer").height();
	var dialogInput = $(".dialog_input").height();
	var dialogWrap = bodyHeight - head - dialogInput - footer;
	$(".dialog_wrap").height(dialogWrap);
	$(window).resize(function() { 
		var bodyHeight = $("body").height();
		var head = $(".head").height();
		var dialogInput = $(".dialog_input").height();
		var dialogWrap = bodyHeight - head - dialogInput - footer;
		$(".dialog_wrap").height(dialogWrap);
	});
	
	/*
	 *
	 * 是否关闭窗口对话框 
	 *
	 */
	
	//结束窗口对话框
	$(".head_closePage").click(function() {
		$(".mask, .dialog_endDialog").show();
	});
	
	//取消窗口对话框
	$(".dialog_cancel").click(function() {
		$(".mask, .dialog_endDialog").hide();
	});
	
	//取消窗口对话框
	$("#confirmOK").on("click", function() {
		var browserName = navigator.appName;
		if (browserName == "Netscape") {
			window.open('', '_self', '');
			window.close();
		} else {
			if (browserName == "Microsoft Internet Explorer") {
				window.open('', '_parent', '');
				window.close();
			}
		}
	});
	
	/***************************************对话内容列表************************************************************/
	
	//左边接收的语音播放
	var voiceMessFlag =true;
	$("body").on('click', '.dialog_left_card .voiceMess', function() {
		if (voiceMessFlag) {
			$(this).children("img").attr("src", "./images/left-sound.gif");
		} else {
			$(this).children("img").attr("src", "./images/left-sound.png");
		}
		voiceMessFlag = !voiceMessFlag;
	});	
	
	//右边接收的语音播放
	$("body").on('click', '.dialog_right_card .voiceMess', function() {
		if (voiceMessFlag) {
			$(this).children("img").attr("src", "./images/right-sound.gif");
		} else {
			$(this).children("img").attr("src", "./images/right-sound.png");
		}
		voiceMessFlag = !voiceMessFlag;
	});	
	
	//开始视频观看
	$("#videoPlay").on("click", function() {
		$(".mask,.video").show();
		$('.video-player').trigger("play");
	})
	
	//点击关闭video
	$('#closeVideo').on("click", function() {
		$('.mask,.video').hide();
		$('.video-player').trigger("pause");
	});
	
	//查看原像素图片
	$("body").on("click", ".maxImg", function() {
		$(".mask,.orginialPicture").show();
	})
	
	//关闭原像素图片
	$("body").on("click", ".closeVideo", function() {
		$(".mask,.orginialPicture").hide();
	})
	
	
	/*
	 *
	 * 请输入电话号码
	 *
	 */
	
	//获取焦点
	$("#blurPhoneValue").focus(function() {
		$(".tip").show();
	});
	
	//失去焦点
	$("#blurPhoneValue").blur(function() {
		$(".tip").hide();
	});
	
	//提交手机号并验证
	$("#submitPhone").click(function() {
		$("span[name='dialog_endDialogText']").text('');
		var blurPhoneValue = $("#blurPhoneValue").val();
		var message = "";
		var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
		if (blurPhoneValue == '') {
			message = "手机号码不能为空！";
			$("span[name='dialog_endDialogText']").text(message);
			model();
		} else if (blurPhoneValue.length != 11) {
			message = "请输入有效的手机号码！";
			$("span[name='dialog_endDialogText']").text(message);
			model();
		} else if (!myreg.test(blurPhoneValue)) {
			message = "请输入有效的手机号码！";
			$("span[name='dialog_endDialogText']").text(message);
		} else {
			var html = '';
			html += '<div id="recordCall" class="dialog_info_box">';
			html += '<p class="otherText dayNum">您的电话已被记录，请耐心等待，稍后我们的客服人员将与您联系</p>';
			html += '</div>';
			$(".dialog_wrap_box").append(html);
			$("#blurPhoneValue").val(""); //清空电话号码！
			$("span[name='dialog_endDialogText']").text("您确定要结束对话吗？");
			scrollBarBottom();
		}
	});
	
	//更改提示模态框
	function model() {
		$(".mask, .dialog_endDialog").show(); //是否显示弹出框
		$(".dialog_endDialog").find(".dialog_cancel, .dialog_closeConfirm").hide(); //是否隐藏取消、确定按钮
		$(".dialog_endDialog").find(".dialog_endDialog-ft").append("<div class='dialog_defineOK skinColor'>确定</div>");
	}
	
	//隐藏弹出框
	$("body").on("click", ".dialog_defineOK", function() {
		$(this).remove();
		$("span[name='dialog_endDialogText']").text("您确定要结束对话吗？");
		$(".dialog_endDialog-ft >div").show();
		$(".mask, .dialog_endDialog").hide();
	});
	
	// 发送消息，滚动条置底
	function scrollBarBottom() {
		$(".dialog_wrap").scrollTop($(".dialog_wrap_box").height() - $(".dialog_wrap").height() + 50);
	}
	scrollBarBottom();
	
	/*********************************对话输入******************************************/
	
	//发送按钮获取失去或失去焦点
	function InputArea() {
		$AreaValue = $("#inputAreaValue");
		$AreaValue.keyup(function() {
			if ($(this).text().length >= 1) {
				$(this).parent(".InputArea").find(".send").removeClass("sendGray").addClass("sendWhite skinColor"); //发送按钮是否为白色
			} else {
				$(this).parent(".InputArea").find(".send").removeClass("sendWhite skinColor").addClass("sendGray");
			}
		});
		$AreaValue.keydown(function() {
			if ($(this).text().length <= 0) {
				$(this).parent(".InputArea").find(".send").removeClass("sendWhite skinColor").addClass("sendGray"); //发送按钮是否为蓝色
			} else {
				$(this).parent(".InputArea").find(".send").removeClass("sendGray").addClass("sendWhite skinColor");
			}
		});
	}
	InputArea();
	
	//是否显示快捷键
	$(".send_pullUp").click(function() {
		if ($(".hotKey").is(":hidden")) {
			$(".hotKey").show();
		} else {
			$(".hotKey").hide();
		}
	});
	
	//切换发送快捷键
	$(".hotKey .hotKey-li").on("click", function() {
		$(this).parent(".hotKey").hide();
		$(this).addClass("enterActive").siblings().removeClass("enterActive");
	});
	
	//切换表情是否显示
	//var emoji = {http://test.miduoke.net/Web/faces/qq/0.png}
	var faceFlag = true;
	var voiceFlag = true;
	$("#selectk >span").on("click", function() {
		var index = $(this).index();
		if (index == 0) {
			var face = $("#faceList");
			face.empty();
			var sum = 0;
			var html = '';
			for (var i = 0; i <= 104; i++) {
				sum = i;
				html += '<span>';
				html += '<dd>';
				html += '<img class="emojiSvg" src="./images/faces/qq/' + sum + '.png"></dd>';
				html += '</span>';
			}
			face.append(html)
			//判断是都显示表情列表
			if (faceFlag) {
				face.show();
			} else {
				face.hide();
			}
			faceFlag = !faceFlag;
		} else if (index == 1) {
			$("#images_file").trigger("click");
		} else if (index == 2) {
	
		} else if (index == 3) {
	
		} else if (index == 4) {
			$(".alert,.mask").show();
			$("#submitEvaluation").parents(".alert").find("textarea").val("");
		}  else {
			if (voiceFlag) {
				$(this).addClass("icon_closeVoice").removeClass("icon_voice");
			} else {
				$(this).addClass("icon_voice").removeClass("icon_closeVoice");
			}
			voiceFlag = !voiceFlag;
		}
	});
	
	//添加表情
	$("body").on("click", "#faceList span dd", function(el) {
		var text = $(this).html();
		$('#faceList').hide();
		$('#inputAreaValue').focus();
		//这是在光标处插入的内容！
		insertHtmlAtCaret(text);
	});
	
	//光标位置插入内容或表情
	function insertHtmlAtCaret(html) {
		var sel, range;
		if (window.getSelection) {
			// IE9 and non-IE
			sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();
				var el = document.createElement("div");
				el.innerHTML = html;
				var frag = document.createDocumentFragment(),
					node, lastNode;
				while ((node = el.firstChild)) {
					lastNode = frag.appendChild(node);
				}
				range.insertNode(frag);
				// Preserve the selection
				if (lastNode) {
					range = range.cloneRange();
					range.setStartAfter(lastNode);
					range.collapse(true);
					sel.removeAllRanges();
					sel.addRange(range);
				}
			}
		} else if (document.selection && document.selection.type != "Control") {
			// IE < 9
			document.selection.createRange().pasteHTML(html);
		}
	}
	
	// 获得焦点的光标移动到最后的输入位置
	function setFocus(el) {
		el = el[0];
		el.focus();
		var range = document.createRange();
		range.selectNodeContents(el);
		range.collapse(false);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	}
	setFocus($('#inputAreaValue'));
	
	//发送消息内容
	$(".send").on('click', function() {
		var inputAreaValues = $("#inputAreaValue").html();
		var html = '';
		html += '<div class="dialog_right">';
		html += '<div class="dialog_right_box">';
		html += '<p class="dialog-time"><span>我 </span>' + time() + '</p>';
		html += '<div class="dialog-top">';
		html += '<div class="dialog_right_card skinColor">';
		html += '<div class="textMess">' + inputAreaValues + '</div>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		if (inputAreaValues.length != 0) {
			$("#inputAreaValue").empty();
			$(".dialog_wrap_box").append(html);
			scrollBarBottom();
		}
		$("#inputAreaValue").parent(".InputArea").find(".send").removeClass("sendWhite changeSkinColor").addClass("sendGray");
	});
	
	//获取当前的时间
	function time() {
		return new Date().toLocaleTimeString({
			hour12: false
		});
	}
	
	//评价
	$(".alert-bd_box .alert-bd_box_list").on("click", function() {
		var index = $(this).index();
		$(".alert-bd_box .alert-bd_box_list").removeAttr('selected');
		$(this).attr("selected", "selected");
		if (index == 0) {
			$(this).find("img").attr("src", "./images/praise.png");
			$(this).next().find("img").attr("src", "./images/average-gray.png");
			$(this).next().next().find("img").attr("src", "./images/badReview-gray.png");
		} else if (index == 1) {
			$(this).find("img").attr("src", "./images/average.png");
			$(this).prev().find("img").attr("src", "./images/praise-gray.png");
			$(this).next().find("img").attr("src", "./images/badReview-gray.png");
		} else {
			$(this).find("img").attr("src", "./images/badReview.png");
			$(this).prev().prev().find("img").attr("src", "./images/praise-gray.png");
			$(this).prev().find("img").attr("src", "./images/average-gray.png");
		}
	});
	
	//提交评价
	$("#submitEvaluation").on("click", function() {
		var evaluationVal = $(this).parents(".alert").find("textarea").val(); //获取评价输入的值
		var evaluationText = $(this).parents(".alert").find(".alert-bd_box").find(
			".alert-bd_box_list[selected='selected']").eq(0).find("p").text(); //获取评价
	
		var html = "";
		html += '<div class="dialog_info_box">';
		html += '<p class="otherText succeed messToggle">您给出了<span class="evaluate">' + evaluationText + '</span>' +
			evaluationVal + '</p>';
		html += '</div>';
		$(".dialog_wrap_box").append(html);
		//评价颜色区分
		var messEvaluation = $(".dialog_info_box:last-child").find(".evaluate");
		if (evaluationText == "好评") {
			messEvaluation.addClass("excellent-green");
		} else if (evaluationText == "中评") {
			messEvaluation.addClass("pass-orange");
		} else if (evaluationText == "差评") {
			messEvaluation.addClass("fail-red");
		}
		
		$(".alert,.mask").hide();
		scrollBarBottom();
		/* $.ajax({
			url:'',
			dataType:'json'
			methods:'post',
			data:'{evaluationVal,evaluationText}'
			success:function(res){
			},
			error:function () {
			}
		}); */
	})
	
	//关闭服务评价
	$(".alert-close").click(function(){
		$(this).parents(".alert").hide();
		$(".mask").hide();
	});
	
})