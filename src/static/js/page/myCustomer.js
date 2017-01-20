'use strict';
page.ctrl('myCustomer', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			process: $params.process || 0,
			page: $params.page || 1,
			pageSize: 20
		};
	/**
	* 加载我的客户数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadCustomerList = function(params, cb) {
		$.ajax({
			url: $http.api($http.apiMap.myCustomer),
			data: params,
			// url: 'http://192.168.0.119:8080/LoanOrder/getMyCustomer',
			// data: {
			// 	loanOrderQuery : {},
			// 	page: 1
			// },
			success: $http.ok(function(result) {
				console.log(result);
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
	* 绑定立即处理事件
	*/
	// $(document).on('click', '#myCustomerTable .button', function() {
	// 	var that = $(this);
	// 	router.render(that.data('href'));
	// });

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('my-customer'), function() {
		$scope.def.listTmpl = render.$console.find('#myCustomerListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#myCustomerTable'),
			$paging: $console.find('#pageToolbar')
		}
		if($params.process) {
			
		}
		loadCustomerList(apiParams);
	});

	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.page = _page;
		$params.page = _page;
		router.updateQuery($scope.$path, $params);
		loadCustomerList(apiParams);
		cb();
	}
});



