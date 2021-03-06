'use strict';
page.ctrl('cancelOrderAudit', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			applyType: 1,
			pageNum: $params.pageNum || 1
		};
	/**
	* 加载终止订单审核数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadCancelOrderList = function(params, cb) {
		console.log(params);
		$.ajax({
			type: 'post',
			url: $http.api('loanOrderApply/get', 'cyj'),
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data.resultlist, function() {
					setupEvt();
				}, true);
				setupPaging(result.page.pages, true);
				setupScroll(result.page, function() {
					pageChangeEvt();
				});
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	/**
	* 构造分页
	*/
	var setupPaging = function(_page, isPage) {
		$scope.$el.$paging.data({
			current: parseInt(apiParams.pageNum),
			pages: isPage ? _page.pages : (tool.pages(_page.pages || 0, _page.pageSize)),
			size: _page.pageSize
		});
		$('#pageToolbar').paging();
	}

	/**
	* 启动dropdown控件
	*/
	function setupDropDown() {
		$console.find('.select').dropdown();
	}

	/**
	* 编译翻单页栏
	*/
	var setupScroll = function(page, cb) {
		render.compile($scope.$el.$scrollBar, $scope.def.scrollBarTmpl, page, true);
		if(cb && typeof cb == 'function') {
			cb();
		}
	}

	/**
	 * 首次加载页面绑定立即处理事件
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
				loadCancelOrderList(apiParams, function() {
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
			loadCancelOrderList(apiParams);
		});

		//绑定重置按钮事件
		$console.find('#search-reset').on('click', function() {
			// 下拉框数据以及输入框数据重置
			$console.find('.select input').val('');
			$console.find('#searchInput').val('');
			apiParams = {
				applyType: 1,
				pageNum: 1
			};
		});

		// 订单列表的排序
		$console.find('#time-sort').on('click', function() {
			var that = $(this);
			if(!that.data('sort')) {
				apiParams.createTimeSort = 1;
				loadCancelOrderList(apiParams, function() {
					that.data('sort', true);
					that.removeClass('time-sort-up').addClass('time-sort-down');
				});

			} else {
				delete apiParams.createTimeSort;
				loadCancelOrderList(apiParams, function() {
					that.data('sort', false);
					that.removeClass('time-sort-down').addClass('time-sort-up');
				});
			}
		});
	}


	/**
	 * 绑定立即处理事件
	 */
	var setupEvt = function() {
		// 排序翻页栏（上下页）
		$console.find('.page-change').on('click', function() {
			var that = $(this);
			var _pageNum = parseInt($scope.$el.$scrollBar.find('#page-num').text());
			if(that.hasClass('disabled')) return;
			if(that.hasClass('scroll-prev')) {
				apiParams.pageNum = _pageNum - 1;
			} else if(that.hasClass('scroll-next')) {
				apiParams.pageNum = _pageNum + 1;
			}
			loadCancelOrderList(apiParams);
		});

		// 订单当前进度的展开与隐藏
		$scope.$el.$tbl.find('.spread-tips').on('click', function() {
			var that = $(this);
			var $status = that.parent().find('.status-value');
			var $iconfont = that.find('.iconfont');
			if(!that.data('trigger')) {
				$status.show();
				$iconfont.html('&#xe601;');
				that.data('trigger', true);
			} else {
				$status.hide().eq(0).show();
				$iconfont.html('&#xe670;');
				that.data('trigger', false);
			}
			return false;
		})

		//立即审核按钮
		$scope.$el.$tbl.find('.toApply').on('click', function() {
			var that = $(this);
			router.render(that.data('href'), {
				orderNo: that.data('orderNo'),
				type: 'TerminationOrderApproval',
				path: 'cancelOrderAudit'
			});
			return false;
		})
	}

	// 绑定翻页栏（上下页）按钮事件
	var pageChangeEvt = function() {
		$console.find('.page-change').on('click', function() {
			var that = $(this);
			var _pageNum = parseInt($scope.$el.$scrollBar.find('#page-num').text());
			if(that.hasClass('disabled')) return;
			if(that.hasClass('scroll-prev')) {
				apiParams.pageNum = _pageNum - 1;
			} else if(that.hasClass('scroll-next')) {
				apiParams.pageNum = _pageNum + 1;
			}
			loadCancelOrderList(apiParams);
		});
	}
	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/cancel-order-audit'), function() {
		$scope.def.listTmpl = render.$console.find('#cancelOrderListTmpl').html();
		$scope.def.scrollBarTmpl = render.$console.find('#scrollBarTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#cancelOrderTable'),
			$paging: $console.find('#pageToolbar'),
			$scrollBar: $console.find('#scrollBar')
		}
		setupDropDown();
		loadCancelOrderList(apiParams, function() {
			evt();
		});
	});

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		
		loadCancelOrderList(apiParams);
		cb();
	}

	//进度id
	$scope.categoryPicker = function(picked) {
		if(picked.id == '全部') {
			delete apiParams.category;
			return false;
		}
		apiParams.category = picked.id;
	}

	//下拉框数据请求
	$scope.dropdownTrigger = {
		category: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('product/taskNameCode', 'zyj'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					xhr.data.unshift({
						taskNameCode: '全部',
						taskName: '全部'
					});
					var sourceData = {
						items: xhr.data,
						id: 'taskNameCode',
						name: 'taskName'
					};
					cb(sourceData);
				})
			})
		}
	}
});



