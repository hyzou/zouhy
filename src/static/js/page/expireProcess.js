'use strict';
page.ctrl('expireProcess', [], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		apiParams = {
			pageNum: $params.pageNum || 1,
			process: $params.process || ''
		};
	/**
	* 加载逾期管理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadExpireProcessList = function(params, cb) {
		$.ajax({
			url: $http.api('expire.process'),
			data: params,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				setupPaging(result.page.pages, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
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
	* 绑定搜索事件
	**/
	$console.on('keydown', '#search', function(evt) {
		if(evt.which == 13) {
			alert("查询");
			var that = $(this),
				searchText = $.trim(that.val());
			if(!searchText) {
				return false;
			}
			apiParams.search = searchText;
			$params.search = searchText;
			apiParams.page = 1;
			$params.page = 1;
			loadExpireProcessList(apiParams);
			// router.updateQuery($scope.$path, $params);
		}
	});
	/**
	* 绑定立即处理事件
	*/
	$console.on('click', '#expireProcessTable .button', function() {
		var that = $(this);
		router.render(that.data('href'), {orderNo: that.data('id')});
	});

	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/expire-process'), function() {
		$scope.def.listTmpl = $console.find('#expireProcessTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#expireProcessTable'),
			$paging: $console.find('#pageToolbar')
		}
		loadExpireProcessList(apiParams);
	});

	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.page = _page;
		$params.page = _page;
		loadExpireProcessList(apiParams);
		cb();
	}
});



