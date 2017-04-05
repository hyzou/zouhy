'use strict';
page.ctrl('lendAudit', function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console;
//	$params.taskId = 80874;
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
	* 加载车贷办理数据
	* @params {object} params 请求参数 
	* @params {function} cb 回调函数
	*/
	var loadTabList = function(cb) {
		var params = {
			taskId: $params.taskId
		};
		$.ajax({
			type: 'post',
			url: $http.api('loanApproval/info', 'jbs'),
			data: params,
			dataType: 'json',
			success: $http.ok(function(xhr) {
				$scope.result = xhr;
				setupLocation();
				loadGuide(xhr.cfgData)
				setupEvent();
				leftArrow();
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	
	/**
	* 加载左侧导航菜单
	* @params {object} cfg 配置对象
	*/
	function loadGuide(cfg) {
		render.compile($scope.$el.$tab, $scope.def.tabTmpl, cfg, true);
		var code = cfg.frames[0].code;
		var pageCode = subRouterMap[code];
		console.log(pageCode);
		var params = {
			code: code,
			orderNo: $params.orderNo,
			taskId: $params.taskId
		}
		router.innerRender('#innerPanel', 'loanProcess/' + pageCode, params);
		return listenGuide();
	}

	function listenGuide() {
		$console.find('.tabLeftEvt').on('click', function() {
			var $that = $(this);
			var code = $that.data('type');
			var pageCode = subRouterMap[code];
			if(!pageCode) return false;
			var params = {
				code: code,
				orderNo: $params.orderNo,
				taskId: $params.taskId
			}
			router.innerRender('#innerPanel', 'loanProcess/' + pageCode, params);
		})
	}

	var setupEvent = function() {
		$console.find('#checkTabs a').on('click', function() {
			$('.panel-menu-item').each(function(){
				$(this).removeClass('panel-menu-item-active');
			})
			var that = $(this);
			var idx = that.data('idx');
			that.addClass('panel-menu-item-active');
			leftArrow();
		});
		$console.find('#submitOrder').on('click', function() {
			$.confirm({
				title: '提交',
				content: dialogTml.wContent.suggestion,
				useBootstrap: false,
				boxWidth: '500px',
				theme: 'light',
				type: 'purple',
				buttons: {
					'取消': {
			            action: function () {

			            }
			        },
			        '确定': {
			            action: function () {
	            			var _reason = $('#suggestion').val();
	            			console.log(_reason);
	            			if(!_reason) {
	            				$.alert({
	            					title: '提示',
									content: '<div class="w-content"><div>请填写处理意见！</div></div>',
									useBootstrap: false,
									boxWidth: '500px',
									theme: 'light',
									type: 'purple',
									buttons: {
										'确定': {
								            action: function () {
								            }
								        }
								    }
	            				})
	            				return false;
	            			} else {
	            				$.ajax({
									type: 'post',
									url: urlStr+'/loanInfoInput/submit/'+$params.taskId,
//									url: urlStr+'/loanInfoInput/submit/80871',
//									data: {
//										taskId: $params.taskId,
//										orderNo: $params.orderNo,
//										reason: _reason
//									},
									dataType: 'json',
									success: $http.ok(function(xhr) {
										console.log(xhr);
									})
								})
	            				$.ajax({
									type: 'post',
									url: $http.api('task/complete', 'jbs'),
									data: {
										taskId: $params.taskId,
										orderNo: $params.orderNo,
										reason: _reason
										},
									dataType: 'json',
									success: $http.ok(function(result) {
										console.log(result);
									})
								})
	            			}
			            }
			        }
			    }
			})
		});
	}
	var leftArrow = function(){
		$('.panel-menu-item').each(function(){
			$(this).find('.arrow').hide();
			if($(this).hasClass('panel-menu-item-active')){
				$(this).find('.arrow').show();
			}
		})
	}

	/**
	* 设置底部按钮操作栏
	*/
	var setupSubmitBar = function() {
		var $submitBar = $console.find('#submitBar');
		$submitBar.data({
			taskId: $params.taskId
		});
		$submitBar.submitBar(function($el) {
			evt($el);
		});
	}

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
		 * 申请平台垫资按钮
		 */
		$sub.on('#applyAdvance', function() {
			
		})

		/**
		 * 自行垫资按钮
		 */
		$sub.on('#selfAdvance', function() {
			
		})

		/**
		 * 审核通过
		 */
		$sub.on('approvalPass', function() {
			process();
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
						var taskIds = [];
						for(var i = 0, len = $params.tasks.length; i < len; i++) {
							taskIds.push(parseInt($params.tasks[i].id));
						}
						var params = {
							taskId: $params.taskId,
							taskIds: taskIds,
							orderNo: $params.orderNo
						}
						var reason = $.trim(this.$content.find('#suggestion').val());
						if(reason) params.reason = reason;
						flow.tasksJump(params, 'complete');
					}
				}
			}
		})
	}

	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/phoneCheck'), function() {
		$scope.def.tabTmpl = $console.find('#checkResultTabsTmpl').html();
		$scope.$el = {
			$tab: $console.find('#checkTabs')
		}
		loadTabList(function() {
			setupSubmitBar();
		});
	})
});



