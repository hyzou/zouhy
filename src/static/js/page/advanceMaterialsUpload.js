'use strict';
page.ctrl('advanceMaterialsUpload', function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console;
	$scope.tasks = $params.tasks || [];
	$scope.activeTaskIdx = $params.selected || 0;

	/**
	* 加载垫资材料上传数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderInfo = function(cb) {
		var params = {
			taskId: $params.taskId
		}
		if($params.refer) {
			params.frameCode = $params.code;
		}
		$.ajax({
			type: 'post',
			url: $http.api('advancedMaterials/index', true),
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				$scope.result.tasks = $params.tasks ? $params.tasks.length : 1;
				$scope.result.orderNo = $params.orderNo;
				$scope.result.category = 'advanceMaterialsUpload';
				if($params.refer) {
					$scope.result.editable = 0;
				} else {
					$scope.result.editable = 1;
				}
				if(!$params.refer) {
					setupLocation();
					setupBackReason(result.data.loanTask.backApprovalInfo);	
				}
				render.compile($scope.$el.$loanPanel, $scope.def.listTmpl, result, function() {
					setupEvt();
				}, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	/**
	* 设置面包屑
	*/
	var setupLocation = function() {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $scope.$params.path,
			current: $scope.result.data.loanTask.taskName,
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			orderDate: $scope.result.data.loanTask.loanOrder.createDateStr
		});
		$location.location();
	}
	
	/**
	* 设置退回原因
	*/
	var setupBackReason = function(data) {
		var $backReason = $console.find('#backReason');
		if(!data) {
			$backReason.remove();
			return false;
		} else {
			$backReason.data({
				backReason: data.reason,
				backUser: data.roleName,
				backUserPhone: data.phone,
				backDate: tool.formatDate(data.transDate, true)
			});
			$backReason.backReason();
		}
	}

	/**
	 * 材料必填，必传检验
	 */
	function checkData(cb) {
		$.ajax({
			type: 'post',
			url: $http.api('orderMaterial/submit/' + $params.taskId, 'zyj'),
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
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
			checkData(function() {
				var canSubmit = flow.taskSubmit($params.tasks);
				if(canSubmit) {
					return process();
				}
				$.alert({
					title: '提示',
					content: tool.alert('您还有未完成的tab栏任务，前往完善？'),
					buttons: {
						ok: {
							text: '确定',
							action: function() {
								var taskIds = [];
								for(var i = 0, len = $params.tasks.length; i < len; i++) {
									taskIds.push(parseInt($params.tasks[i].id));
								}
								var params = {
									taskId: $params.taskId,
									taskIds: taskIds,
									orderNo: $params.orderNo
								}
								flow.tasksJump(params, 'complete');
							}
						}
					}
				})
			})
		})
	}

	/**
	* 退回原因选项分割
	*/
	var evt = function() {
		/**
		 * 订单退回的条件选项分割
		 */
		var taskJumps = $scope.result.data.loanTask.taskJumps;
		if(!taskJumps) return;
		for(var i = 0, len = taskJumps.length; i < len; i++) {
			taskJumps[i].jumpReason = taskJumps[i].jumpReason.split(',');
		}
	}

	/**
	 * 任务提交跳转
	 */
	function process() {
		$.confirm({
			title: '提交',
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

	/**
	 * 取消订单弹窗内事件逻辑处理
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
	 * 多次渲染页面立即处理事件
	 */
	var setupEvt = function() {
		/**
		 * 启动图片上传控件
		 */
		var imgsBars = $scope.$el.$loanPanel.find('.panel-content-imgs');
		imgsBars.each(function(index) {
			var that = $(this),
				_url = that.data('url'),
				_type = that.data('type'),
				$imgs = that.find('.uploadEvt.imgs'),
				$noimgs = that.find('.uploadEvt.noimgs');
			$imgs.imgUpload({
				viewable: true,
				markable: $params.refer ? true : false,
				getimg: function(cb) {
					cb($scope.result.data[_type])
				},
				marker: function (img, mark, cb) {
					var params = {
						id: img.id,
						auditResult: mark
					}
					if(mark == 0) {
						params.auditOpinion = '';
					}
					$.ajax({
						type: 'post',
						url: $http.api(_url + '/addOrUpdate', true), 
						data: params,
						dataType: 'json',
						success: $http.ok(function(result) {
							console.log(result);
							cb();
						})
					})
				},
				onclose: function(imgs) {
					$imgs.each(function(idx) {
						$(this).find('.imgs-error').remove();
						$(this).find('.imgs-item-upload').append(tool.imgs[imgs[idx].auditResult]);
					});
				}
			});

			$noimgs.imgUpload();
		});
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

	$console.load(router.template('iframe/material-upload'), function() {
		$scope.def = {
			listTmpl: $console.find('#loanUploadTmpl').html()
		}
		$scope.$el = {
			$loanPanel: $console.find('#loanUploadPanel')
		}
		loadOrderInfo(function() {
			router.tab($console.find('#tabPanel'), $scope.tasks, $scope.activeTaskIdx, tabChange);
			if(!$params.refer) {
				evt();
				setupSubmitBar();
			}
		});
	});

	/**
	 * 监听其它材料最后一个控件的名称
	 */
	var otherMaterialsListen = function() {
		var $imgel = $console.find('.otherMaterials .uploadEvt');
		$imgel.each(function(index) {
			$(this).data('idx', index);
		});
	}

	/***
	* 删除图片后的回调函数
	*/
	$scope.deletecb = function(self) {
		self.$el.remove();
		otherMaterialsListen();
	}

	/***
	* 上传图片成功后的回调函数
	*/
	$scope.uploadcb = function(self) {
		var $parent = self.$el.parent();
		if($parent.find('.uploadEvt').length == self.$el.data('idx') + 1) {
			self.$el.after(self.outerHTML);
		}
		self.$el.next().imgUpload();
		otherMaterialsListen();
	}
});
