'use strict';
page.ctrl('importHistory', [], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		apiParams = {
			pageNum: $params.pageNum || 1,
			process: $params.process || ''
		};
	/**
	 *逾期导入查看详情 
	* 加载逾期管理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/

	var loadExpireProcessList = function(params, cb) {
		$.ajax({
			url: urlStr + '/loanOverdueImport/importReordList',
//			url: $http.api('loanOverdueImport/importReordList','wl'),
			type: 'post',
			dataType: 'json',
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result, true);
				setupEvt();
				setupPaging(result.page, true);
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
	* 编译翻单页栏
	*/
	var setupScroll = function(page, cb) {
		render.compile($scope.$el.$scrollBar, $scope.def.scrollBarTmpl, page, true);
		if(cb && typeof cb == 'function') {
			cb();
		}
	}
	// 绑定翻页栏（上下页）按钮事件
	var pageChangeEvt = function() {
		$console.find('.page-change').on('click', function() {
			var that = $(this);
			var _pageNum = parseInt($scope.$el.$scrollBar.find('#page-num').text());
			if(that.hasClass('disabled')) return;
			if(that.hasClass('scroll-prev')) {
				apiParams.pageNum = _pageNum - 1;
				$params.pageNum = _pageNum - 1;
			} else if(that.hasClass('scroll-next')) {
				apiParams.pageNum = _pageNum + 1;
				$params.pageNum = _pageNum + 1;
			}
			loadCustomerList(apiParams);
		});
	}
 	/**
	* 绑定立即处理事件
	**/
	var setupEvt = function() {
		$console.find('#expInIpt').on('click', function() {
			router.render('expireInfoInput');
		});
	}

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/import-history'), function() {
		$scope.def.listTmpl = render.$console.find('#importHistoryTmpl').html();
		$scope.def.scrollBarTmpl = render.$console.find('#scrollBarTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#importHistoryTable'),
			$paging: $console.find('#pageToolbar'),
			$scrollBar: $console.find('#scrollBar')
		}
		if($params.process) {
			
		}
		loadExpireProcessList(apiParams);
	});

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		// router.updateQuery($scope.$path, $params);
		loadExpireProcessList(apiParams);
		cb();
	}
});



