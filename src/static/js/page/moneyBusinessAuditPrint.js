'use strict';
page.ctrl('moneyBusinessAuditPrint', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			pageNum: 1
		};
	/**
	* 加载财务业务审批表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadMoneyPrintList = function(params, cb) {
		$.ajax({
			url: $http.api('loanUserStage/getFinancialData', 'cyj'),
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data.resultlist, function() {
					setupEvt();
				}, true);
				setupPaging(result.page, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		});
	}
	/**
	* 构造分页
	*/
	var setupPaging = function(count, isPage) {
		$scope.$el.$paging.data({
			current: parseInt(apiParams.page),
			pages: isPage ? count : (tool.pages(count || 0, apiParams.pageSize)),
			size: apiParams.pageSize
		});
		$('#pageToolbar').paging();
	}

	/**
	* 日历控件
	*/
	var setupDatepicker = function() {
		$console.find('.dateBtn').datepicker();
	}

	/**
	* dropdown控件
	*/
	function setupDropDown() {
		$console.find('.select').dropdown();
	}

	/**
	 * 绑定立即处理事件
	 */
	var setupEvt = function() {
		$scope.isAllClick = false;//批量下载是否能点击
		$scope.$checks = $scope.$el.$tbl.find('.checkbox').checking();

		$scope.$checks.each(function() {
			var that = this;
			that.$checking.onChange(function() {
				var flag = 0;
				$scope.$checks.each(function() {
					if($(this).attr('checked')) {
						flag++;
					}
				})
				if(flag == 0) {
					$scope.$allCheck.removeClass('checked').attr('checked', false);
					$scope.isAllClick = false;
				} else if(flag == $scope.$checks.length) {
					$scope.$allCheck.removeClass('checked').addClass('checked').attr('checked', true);
					$scope.isAllClick = true;
				} else {
					$scope.isAllClick = true;
				}
			});
		})


		// 绑定打印按钮
		$scope.$el.$tbl.find('.businessPrint').on('click', function() {
			
		});
	}

	/**
	 * 首次加载页面绑定事件
	 */
	var evt = function() {
		// 绑定搜索框模糊查询事件
		$console.find('#searchInput').on('keydown', function(evt) {
			if(evt.which == 13) {
				var that = $(this),
					searchText = $.trim(that.val());
				if(!searchText) {
					return false;
				}
				apiParams.keyWord = searchText;
				apiParams.pageNum = 1;
				loadMoneyPrintList(apiParams, function() {
					that.blur();
				});
			}
		});

		// 文本框失去焦点记录文本框的值
		$console.find('#searchInput').on('blur', function(evt) {
			var that = $(this),
				searchText = $.trim(that.val());
			if(!searchText) {
				delete apiParams.keyWord;
				return false;
			} else {
				apiParams.keyWord = searchText;
			}
		});

		//绑定搜索按钮事件
		$console.find('#search').on('click', function() {
			apiParams.pageNum = 1;
			loadMoneyPrintList(apiParams);
		});

		//绑定重置按钮事件
		$console.find('#search-reset').on('click', function() {
			// 下拉框数据以及输入框数据重置
			$console.find('.select input').val('');
			$console.find('#searchInput').val('');
			apiParams = {
				queryType: 1,  //征信资料下载
		    	pageNum: 1
			};
		});

		// 初始化复选框
		$scope.$allCheck = $console.find('.all-check-box .checkbox').checking();
		$scope.$allCheck[0].$checking.onChange(function() {
			if(!$scope.$allCheck.attr('checked')) {
				$scope.$el.$tbl.find('.checkbox').removeClass('checked').attr('checked', false);
				$scope.isAllClick = false;
			} else {
				$scope.$el.$tbl.find('.checkbox').removeClass('checked').addClass('checked').attr('checked', true);
				$scope.isAllClick = true;
			}
		});

		// 批量下载按钮
		$console.find('#allPrint').on('click', function() {

			var that = $(this);
			if(!$scope.isAllClick) {
				//toast('请选择批量下载的订单！')
				return false;
			}
			$.confirm({
				title: '批量下载',
				content: dialogTml.wContent.allCreditDownload,
				onContentReady: function() {
					$scope.$radios = this.$content.find('.checkbox').checking();

					$scope.$radios.each(function() {
						var that = this;
						that.$checking.onChange(function() {
							$scope.$radios.removeClass('checked').attr('checked', false);
							$(that).removeClass('checked').addClass('checked').attr('checked', true);
						});
					})
				},
				buttons: {
					close: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function() {
							$scope.userIds = [];
							$scope.$el.$tbl.find('.checkbox').each(function() {
								if($(this).attr('checked')) {
									$scope.userIds.push($(this).data('userId'));
								}
							});
							$scope.userIds = $scope.userIds.join(',');
							console.log($scope.userIds)
							this.$content.find('.checkbox').each(function() {
								if($(this).attr('checked')) {
									$scope.downLoadType = $(this).data('type');
								}
							});
							window.open($http.api('materialsDownLoad/downLoadCreditMaterials?userIds=' + $scope.userIds + '&downLoadType=' + $scope.downLoadType, true), '_blank');
						}
					}
				}
			})
		});
	}

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/money-business-audit-print'), function() {
		$scope.def.listTmpl = render.$console.find('#moneyAuditPrintListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#moneyAuditPrintTable'),
			$paging: $console.find('#pageToolbar')
		}
		setupDropDown();
		setupDatepicker();
		loadMoneyPrintList(apiParams, function() {
			evt();
		});
	});

	/**
	 * 分页请求数据回调
	 */
	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.pageNum = _page;
		loadMoneyPrintList(apiParams);
		cb();
	}

	/**
	 * 下拉框请求数据回调
	 */
	$scope.dropdownTrigger = {
		deptCompany: function(t, p, cb) {
			$.ajax({
				type: 'get',
				url: $http.api('pmsDept/getPmsDeptList', 'zyj'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					console.log(xhr)
					var sourceData = {
						items: xhr.data,
						id: 'id',
						name: 'name'
					};
					cb(sourceData);
				})
			})
		}
	}
});