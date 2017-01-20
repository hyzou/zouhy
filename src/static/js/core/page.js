
// 待办提醒框
var isOpen = false; 
$('#remind-tips').on('click',function (){
	if(!isOpen) {
		$('#remind').animate({
			right: '155px'
		},200);
		$(this).find('.iconfont').html('&#xe605;');
		isOpen = true;
	} else {
		$('#remind').animate({
			right: '0'
		},200);
		$(this).find('.iconfont').html('&#xe697;');
		isOpen = false;
	}
});

//单选框
$('.checkbox-normal').on('selectstart', false);
$('.checkbox-normal').on('click', function() {
	if(!$(this).attr('checked')) {
		$(this).addClass('checked').attr('checked',true);
		$(this).html('<i class="iconfont">&#xe659;</i>');
	} else {
		$(this).removeClass('checked').attr('checked',false);
		$(this).html('');
	}
})


//右边栏
$('.sideBar-item').hover(function() {
	$(this).find('.sideBar-content').show();	
},function() {
	$(this).find('.sideBar-content').hide();		
});


//测试鼠标移上提示框
$('.tips-area').hover(function() {
	$(this).find('.tips-content').toggle();
})

/**
* 顶部二维码、消息和用户展开效果
**/

//二维码
$(document).on('hover', '#navigator .QR-Code', function() {
	$(this).find('.QR-Code-area').toggle();
});

//消息
$(document).on('hover', '#navigator .message', function() {
	$(this).find('.message-area').toggle();
});

//用户名
$(document).on('hover', '#navigator .user', function() {
	$(this).find('.user-area').toggle();
	$(this).find('.user-field-item').toggleClass('user-field-item-active');
});



/**
 * 排序
 */
 $(document).on('click', '.time-sort', function() {
 	// 数据更新
 	
 	// 箭头更新
 	if( $(this).hasClass('time-sort-up') ) {
 		$(this).removeClass('time-sort-up').addClass('time-sort-down');	
 	} else if ( $(this).hasClass('time-sort-down') ) {
 		$(this).removeClass('time-sort-down').addClass('time-sort-up');	
 	}
	
});
