'use strict';
page.ctrl('openCardSheet', function($scope) {
	var $console = render.$console,
		$params = $scope.$params;
	$scope.tasks = $params.tasks || [];
	$scope.activeTaskIdx = $params.selected || 0;

	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调ck函数
	*/
	var loadLoanList = function(cb) {
		var data={};
			data['taskId']=$params.taskId;
		$.ajax({
			type: 'post',
			url: urlStr + '/icbcCreditCardForm/queryICBCCreditCardForm',
			data: data,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				setupLocation();
				loanFinishedInput();
				setupEvt();
				setupDatepicker();
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	
	/***
	* 上传图片成功后的回调函数
	*/
	$scope.uploadcb = function(self) {
		var imgStr = $console.find('.imgs-view').attr('src');
		$("#imgUrl").val(imgStr);
	}
	
	$scope.deletecb = function(self) {
		$("#imgUrl").val('');
	}
	
	/**
	* 设置面包屑
	*/
	var setupLocation = function() {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $scope.$params.path,
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			current: $scope.result.data.loanTask.taskName,
			orderDate: $scope.result.data.loanTask.createDateStr
		});
		$location.location();
	}

	/**
	* 并行任务切换触发事件
	* @params {int} idx 触发的tab下标
	* @params {object} item 触发的tab对象
	*/
	var tabChange = function (idx, item) {
		console.log(item);
		router.render('loanProcess/' + item.key, {
			tasks: $scope.tasks,
			taskId: $scope.tasks[idx].id,
			orderNo: $params.orderNo,
			selected: idx,
			path: 'loanProcess'
		});
	}
	/**
	* 日历控件
	*/
	var setupDatepicker = function() {
		$console.find('.dateBtn').datepicker({
			onpicked: function() {
				$(this).parents().removeClass("error-input");
				$(this).siblings("i").remove();
			}
		});
	}


	/**
	* 页面加载完成对所有带“*”的input进行必填绑定
	*/
	var loanFinishedInput = function(){
		$(".info-key").each(function(){
			var jqObj = $(this);
			if(jqObj.has('i').length > 0){
				$(this).parent().siblings().find("input").addClass("required");
			}
			loanFinishedInputReq();
		});
	}
//页面加载完成对所有带“*”的input进行必填绑定,不需要必填的删除required
	var loanFinishedInputReq = function(){
		$("input[type='hidden'],input[type='text']").each(function(){
			var required = $(this).attr("name");
			if(!required){
				$(this).removeClass("required");
			}
		});
	}
	var setupEvt = function($el) {
		$console.find('input[type="text"]').on('change', function() {
			var thisName = $(this).attr('name'),
				thisId = $(this).attr('id'),
				that = $(this);
			if(thisName == 'yearIncomeMoney' || thisName == 'loanMoney' || thisName == 'feeRate' || thisName == 'carPrice'){
				var thisVal = that.val();
				var reg = /^(\d+\.\d{1,4}|\d+)$/;
				if(!reg.test(thisVal)){
					$(this).parent().addClass("error-input");
					$(this).after('<i class="error-input-tip sel-err">该项只能填写数字及最多四位小数</i>');
					that.val('');
				}
			}
			if( thisName == 'homezip' || thisName == 'corpzip' ){
				var thisVal = that.val();
				var reg = /^[1-9][0-9]{5}$/;
				if(!reg.test(thisVal)){
					$(this).parent().addClass("error-input");
					$(this).after('<i class="error-input-tip sel-err">邮政编码格式不正确</i>');
					that.val('');
				}
			}
			if( thisName == 'mvblno' || thisName == 'reltmobl1' || thisName == 'reltmobl2' ){
				var thisVal = that.val();
				var reg = /^1(3|4|5|7|8)\d{9}$/;
				if(!reg.test(thisVal)){
					$(this).parent().addClass("error-input");
					$(this).after('<i class="error-input-tip sel-err">手机号码格式不正确</i>');
					that.val('');
				}
			}
			if( thisName == 'hphoneno' || thisId == 'cophone' || thisName == 'relaphone1'|| thisName == 'rtcophon2'){
				var thisVal = that.val();
				var reg = /^0\d{2,3}-\d{7,8}(-\d{1,6})?$/;
				if(!reg.test(thisVal)){
					$(this).parent().addClass("error-input");
					$(this).after('<i class="error-input-tip sel-err">0000-12345678-8888(如有分机号)</i>');
					that.val('');
				}
			}
			if( thisName == 'stmtemail' ){
				var thisVal = that.val();
				var reg = /\w@\w*\.\w/;
				if(!reg.test(thisVal)){
					$(this).parent().addClass("error-input");
					$(this).after('<i class="error-input-tip sel-err">邮箱格式不正确</i>');
					that.val('');
				}
			}
		})
		$(".select-text").each(function(){
			$(this).attr('readonly','readonly')
		})
		if($("#dateStart").val("9999-12-31")){
			$("#dateStart").addClass('pointDisabled');
			$("#longTime").attr("checked", true); 
		}
		$console.find('#longTime').on('click', function(){
			if($("input[type='checkbox']").is(':checked')){
				$("#dateStart").val("9999-12-31").addClass('pointDisabled');
			}else{
				$("#dateStart").val("").removeClass('pointDisabled');
			}
		});
		$console.find('.uploadEvt').imgUpload();
		$console.find('#cophone').on('change', function() {
			var cophone = $(this).val();
			var phoneArr = cophone.split('-');
			if(!phoneArr[2]){
				$("#cophozono").val(phoneArr[0]);
				$("#cophoneno").val(phoneArr[1]);
				$("#cophonext").val('');
				$("#cophonext").removeClass('required');
			}else{
				$("#cophozono").val(phoneArr[0]);
				$("#cophoneno").val(phoneArr[1]);
				$("#cophonext").val(phoneArr[2]);
			}
		})
		$console.find('#loanMoney').on('change', function() {
			var loanMoney = $("#loanMoney").val(),
				feeRate = $("#feeRate").val(),
				carPrice = $("#carPrice").val(),
				feeamount,
				adjustAmount,
				loanRatio;
			if(loanMoney && feeRate){
				feeamount = loanMoney * feeRate / 100;
				adjustAmount = feeamount*1 + loanMoney*1;
				$("#feeamount").val(feeamount);
				$("#adjustAmount").val(adjustAmount);
				if(carPrice){
					loanRatio = (adjustAmount*1) / (carPrice*1) * 100;
					var loanRatio1 = loanRatio.toFixed(6)
					$("#loanRatio").val(loanRatio1);
				}
			}
		})
		$console.find('#feeRate').on('change', function() {
			
			var loanMoney = $("#loanMoney").val(),
				feeRate = $("#feeRate").val(),
				carPrice = $("#carPrice").val(),
				feeamount,
				adjustAmount,
				loanRatio;
			if(loanMoney && feeRate){
				feeamount = loanMoney * feeRate / 100;
				adjustAmount = feeamount*1 + loanMoney*1;
				$("#feeamount").val(feeamount);
				$("#adjustAmount").val(adjustAmount);
				if(carPrice){
					loanRatio = (adjustAmount*1) / (carPrice*1) * 100;
					var loanRatio1 = loanRatio.toFixed(6)
					$("#loanRatio").val(loanRatio1);
				}
			}
		})
		$console.find('#carPrice').on('change', function() {
			
			var adjustAmount = $("#adjustAmount").val(),
				carPrice = $("#carPrice").val(),
				loanRatio;
			if(adjustAmount && carPrice){
				loanRatio = (adjustAmount*1) / (carPrice*1) * 100;
				var loanRatio1 = loanRatio.toFixed(6)
				$("#loanRatio").val(loanRatio1);
			}
		})
	}		

	function saveData(cb) {
		
		var isTure = true;
		var requireList = $("#dataform").find(".required");
		requireList.each(function(){
			var value = $(this).val();
			if(!value){
				if(!$(this).parent().hasClass('info-value')){
					if($(this).parent().hasClass('loan-imgs-bar')){
						$(this).siblings('.uploadEvt').find('.imgs-item-upload').addClass("error-input");
						$(this).after('<i class="error-input-tip pic-err">请完善该必填项</i>');
					}else{
						$(this).siblings('.select').addClass("error-input");
						$(this).after('<i class="error-input-tip sel-err">请完善该必填项</i>');
					}
				}else{
					$(this).parent().addClass("error-input");
					$(this).after('<i class="error-input-tip">请完善该必填项</i>');
				}
				console.log($(this).index());
				isTure = false;
			}
		});
		if(isTure){
			
	        var params = $("#dataform").serialize();
//          params = decodeURIComponent(params,true);
	        var b = params.replace(/\+/g," ");
			b =  decodeURIComponent(b);
            var paramArray = b.split("&");
            var data1 = {};
            for(var i=0;i<paramArray.length;i++){
                var valueStr = paramArray[i];
                data1[valueStr.split('=')[0]] = valueStr.split('=')[1];
            }
			console.log(data1);
	        
			$.ajax({
				type: 'post',
				url: urlStr+'/icbcCreditCardForm/saveICBCCreditCardForm/' + $params.taskId,
				data: data1,
				dataType: "json",
//				contentType : 'application/json;charset=utf-8',
				success: $http.ok(function(result){
					if(result.data){
						var iptNode = "<input type='hidden' class='id' name='id'>";
						$('#dataform').append(iptNode);
						$('#dataform').find(".id").val(result.data);
					}
					process();
				})
			});
		}else{
			$.alert({
				title: '提示',
				content: tool.alert('请完善相关必填项！'),
				buttons: {
					ok: {
						text: '确定',
						action: function() {
						}
					}
				}
			});
		}
	}

//为完善项更改去掉错误提示
	$(document).on('input','input', function() {
		$(this).parents().removeClass("error-input");
		$(this).siblings("i").remove();
	})
	$(document).on('click','.select', function() {
		$(this).removeClass("error-input");
		$(this).siblings("i").remove();
	})
	$(document).on('click','.input-file', function() {
		$(this).parent().removeClass("error-input");
		$(this).parent().parent().siblings("i").remove();
	})
	

	/**
	* 设置底部按钮操作栏
	*/
	var setupSubmitBar = function() {
		var $submitBar = $console.find('#submitBar');
		$submitBar.data({
			taskId: $params.taskId
		});
		$submitBar.submitBar();
		var $sub = $submitBar[0].$submitBar;

		/**
		 * 退回订单
		 */
		$sub.on('backOrder', function() {
			$.alert({
				title: '退回订单',
				content: doT.template(dialogTml.wContent.back)($scope.result.data.loanTask.taskJumps),
				onContentReady: function() {
					dialogEvt(this.$content);
				},
				buttons: {
					close: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function () {
							var _reason = $.trim(this.$content.find('#suggestion').val());
							this.$content.find('.checkbox-radio').each(function() {
								if($(this).hasClass('checked')) {
									$scope.jumpId = $(this).data('id');
								}
							})

							if(!_reason) {
								$.alert({
									title: '提示',
									content: tool.alert('请填写处理意见！'),
									buttons: {
										ok: {
											text: '确定',
											action: function() {
											}
										}
									}
								});
								return false;
							} 
							if(!$scope.jumpId) {
								$.alert({
									title: '提示',
									content: tool.alert('请至少选择一项原因！'),
									buttons: {
										ok: {
											text: '确定',
											action: function() {
											}
										}
									}
								});
								return false;
							}
							var _params = {
								taskId: $params.taskId,
								jumpId: $scope.jumpId,
								reason: _reason
							}
							console.log(_params)
							$.ajax({
								type: 'post',
								url: $http.api('task/jump', 'zyj'),
								data: _params,
								dataType: 'json',
								success: $http.ok(function(result) {
									console.log(result);
									router.render('loanProcess');
									// toast.hide();
								})
							})
						}
					}
				}
			})
		})

		/**
		 * 提交
		 */
		$sub.on('taskSubmit', function() {
			// process();
			//先保存数据再提交订单
			saveData(function() {
				process();
			});
		})
	}

	/**
	 * 任务提交跳转
	 */
	function process() {
		$.confirm({
			title: '提交订单',
			content: dialogTml.wContent.suggestion,
			buttons: {
				close: {
					text: '取消',
					btnClass: 'btn-default btn-cancel',
					action: function() {}
				},
				ok: {
					text: '确定',
					action: function () {
						var that = this;
						var taskIds = [];
						for(var i = 0, len = $params.tasks.length; i < len; i++) {
							taskIds.push(parseInt($params.tasks[i].id));
						}
						var params = {
							taskId: $params.taskId,
							taskIds: taskIds,
							orderNo: $params.orderNo
						}
						var reason = $.trim(that.$content.find('#suggestion').val());
						if(reason) params.reason = reason;
						console.log(params);
						flow.tasksJump(params, 'approval');
					}
				}
			}
		})
	}

	/**
	 * 退回订单弹窗内事件逻辑处理
	 */
	var dialogEvt = function($dialog) {
		var $reason = $dialog.find('#suggestion');
		$scope.$checks = $dialog.find('.checkbox').checking();
		// 复选框
		$scope.$checks.filter('.checkbox-normal').each(function() {
			var that = this;
			that.$checking.onChange(function() {
				//用于监听意见有一个选中，则标题项选中
				var flag = 0;
				var str = '';
				$(that).parent().parent().find('.checkbox-normal').each(function() {
					if($(this).attr('checked')) {
						str += $(this).data('value') + ',';
						flag++;
					}
				})
				str = '#' + str.substring(0, str.length - 1) + '#';				
				$reason.val(str);
				if(flag > 0) {
					$(that).parent().parent().find('.checkbox-radio').removeClass('checked').addClass('checked').attr('checked', true);
				} else {
					$reason.val('');
					$(that).parent().parent().find('.checkbox-radio').removeClass('checked').attr('checked', false);
				}
				$(that).parent().parent().siblings().find('.checkbox').removeClass('checked').attr('checked', false);

				// if()
			});
		})

		// 单选框
		$scope.$checks.filter('.checkbox-radio').each(function() {
			var that = this;
			that.$checking.onChange(function() {
				$reason.val('');
				$(that).parent().parent().find('.checkbox-normal').removeClass('checked').attr('checked', false);
				$(that).parent().parent().siblings().find('.checkbox').removeClass('checked').attr('checked', false);
			});
		})
	}

	/**
	 * 首次加载页面时绑定的事件（底部提交按钮）
	 */
	var evt = function() {
		/**
		 * 订单退回的条件选项分割
		 */
		var taskJumps = $scope.result.data.loanTask.taskJumps;
		for(var i = 0, len = taskJumps.length; i < len; i++) {
			taskJumps[i].jumpReason = taskJumps[i].jumpReason.split(',');
		}
	}
	/**
	* 下拉
	*/
	var seleLoad = function(){
		$(".select").each(function(){
			var $that = $(this);
			$that.find('input').attr('readonly','readonly');
			var selected = $(this).data('selected');
			var re = /^[0-9]+.?[0-9]*$/;
			if((selected && re.test(selected)) || selected=='0'){
				$(this).find('.arrow-trigger').click();
				var lilist = $(this).find('li');
				$("li",$(this)).each(function(){
					var idx = $(this).data('id');
					if(selected == idx){
						$that.find('.select-text').val($(this).text());
						$(this).click();
						$that.find('.select-box').hide();
					}
				})
			}
		})
	}
	var noWrite = function(){
		$(".pointDisabled").each(function(){
			$(this).find('input').attr('readonly','readonly')
		})
	}
	
	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/open-card-sheet'), function() {
		$scope.def.listTmpl = render.$console.find('#openCardSheettmpl').html();
		$scope.def.selectOpttmpl = $console.find('#selectOpttmpl').html();
		$scope.$el = {
			$tbl: $console.find('#openCardSheet')
		}
		loadLoanList(function(){
			router.tab($console.find('#tabPanel'), $scope.tasks, $scope.activeTaskIdx, tabChange);
			evt();
			setupSubmitBar();
			setupDropDown();
			seleLoad();
			noWrite();
			$console.find('#cophonext').removeClass('required');
		});
	});

	

	$scope.bankPicker = function(picked) {
		console.log(picked);
	}
	
	/**dropdown 测试*/
	function setupDropDown() {
		$console.find('.select').dropdown();
	}
	var car = {
		brand: function(cb) {
			$.ajax({
				url: 'http://localhost:8083/mock/carBrandlist',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'brandId',
						name: 'carBrandName'
					}
					cb(sourceData);
				})
			})
		},
		series: function(brandId, cb) {
			$.ajax({
				url: 'http://localhost:8083/mock/carSeries',
				data: {brandId: brandId},
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'id',
						name: 'serieName'
					}
					cb(sourceData);
				})
			})
		},
		specs: function(seriesId, cb) {
			$.ajax({
				url: 'http://localhost:8083/mock/carSpecs',
				data: {
					serieId: seriesId
				},
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'carSerieId',
						name: 'specName'
					};
					cb(sourceData);
				})
			})
		}
	}

	var areaSel = {
		province: function(cb) {
			$.ajax({
				url: urlStr+'/area/get',
				dataType:'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'areaId',
						name: 'name'
					};
					cb(sourceData);
				})
			})
		},
		city: function(areaId, cb) {
			$.ajax({
				url: urlStr+'/area/get',
				data: {
					parentId: areaId
				},
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'areaId',
						name: 'name'
					}
					cb(sourceData);
				})
			})
		},
		country: function(areaId, cb) {
			$.ajax({
				url: urlStr+'/area/get',
				data: {
					parentId: areaId
				},
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'areaId',
						name: 'name'
					};
					cb(sourceData);
				})
			})
		}
	}

	$scope.dropdownTrigger = {
		car: function(tab, parentId, cb) {
			if(!cb && typeof cb != 'function') {
				cb = $.noop;
			}
			if(!tab) return cb();
			switch (tab) {
				case '品牌':
					car.brand(cb);
					break;
				case "车系":
					car.series(parentId, cb);
					break;
				case "车型":
					car.specs(parentId, cb);
					break;
				default:
					break;
			}
		},
		areaSel: function(tab, parentId, cb) {
			if(!cb && typeof cb != 'function') {
				cb = $.noop;
			}
			if(!tab) return cb();
			switch (tab) {
				case '省':
					areaSel.province(cb);
					break;
				case "市":
					areaSel.city(parentId, cb);
					break;
				case "区":
					areaSel.country(parentId, cb);
					break;
				default:
					break;
			}
		},
		selfPicker: function(t, p, cb) {
			var keyType = this.$el.data('key');
			var sourceData = {
				items: dataMap[keyType],
				id: 'value',
				name: 'name'
			};
			cb(sourceData);
		},
		dealerId: function(t, p, cb) {
			$.ajax({
				url: urlStr+"/carshop/list",
				data:{
					'code':'busiSourceName'
				},
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'value',
						name: 'name'
					};
					cb(sourceData);
				})
			})
		},
		repayPeriod: function(t, p, cb) {
			$.ajax({
				url: urlStr+"/loanConfigure/getItem",
				data:{
					'code':'repaymentTerm'
				},
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'value',
						name: 'name'
					};
					cb(sourceData);
				})
			})
		}
	}
});
