'use strict';
(function(g) {
	/**
	* 材料code相对应材料名称
	* key:  材料code
	* value: 材料名称
	*/
	g.materialsCodeMap = {
	    "sfzzm":"身份证正面",
	    "sfzfm":"身份证反面",
	    "zxsqszp":"征信授权书签字照片",
	    "zxsqs":"征信授权书",
	    "hkbsy":"户口本首页",
	    "hkbhzy":"户口本户主页",
	    "hkbgry":"户口本本人页",
	    "sbz":"士兵证/军官证",
	    "jhz":"结婚证",
	    "lhz":"离婚证",
	    "ccfgxy":"财产分割协议",
	    "dszm":"单身证明",
	    "swzm":"死亡证明",
	    "srzm":"收入证明",
	    "yhlssy":"银行流水首页",
	    "yhlsmy":"银行流水末页",
	    "ysjx1":"流水结息季度一",
	    "ysjx2":"流水结息季度二",
	    "ysjx3":"流水结息季度三",
	    "ysjx4":"流水结息季度四",
	    "fcznry":"房产证内容页",
	    "tdz":"土地证",
	    "qz":"契证",
	    "gffp":"购房发票",
	    "gfhtmzy":"购房合同名字页",
	    "gfhtdzy":"购房合同地址页",
	    "gfhtfkfs":"购房合同付款方式",
	    "gfhtqzy":"购房合同签字页",
	    "zjfzm":"自建房证明",
	    "jzzm":"居住证明",
	    "yyzzzb":"营业执照正本",
	    "cwbb1":"财务报表第一页",
	    "gszc1":"公司章程第一页",
	    "gszc2":"公司章程第二页",
	    "gszc3":"公司章程第三页",
	    "gszc4":"公司章程第四页",
	    "yzbg":"验资报告",
	    "swdjzzb":"税务登记证正本",
	    "zzjgdmzzb":"组织机构代码证正本",
	    "cwbb2":"财务报表第二页",
	    "cwbb3":"财务报表第三页",
	    "cwbb4":"财务报表第四页",
	    "cwbb5":"财务报表第五页",
	    "cwbb6":"财务报表第六页",
	    "cwbb7":"财务报表第七页",
	    "cwbb8":"财务报表第八页",
	    "yyzzfb":"营业执照副本",
	    "swdzfb":"税务登记证副本",
	    "zzjgdmzfb":"组织机构代码证副本",
	    "khxkzzb":"开户许可证正本",
	    "khxkzfb":"开户许可证副本",
	    "otherloan1":"其他材料1",
	    "otherloan2":"其他材料2",
	    "otherloan3":"其他材料3",
	    "otherloan4":"其他材料4",
	    "otherloan5":"其他材料5",
	    "otherloan6":"其他材料6",
	    "otherloan7":"其他材料7",
	    "otherloan8":"其他材料8",
	    "otherloan9":"其他材料9",
	    "otherloan10":"其他材料10",
	    "otherloan11":"其他材料11",
	    "otherloan12":"其他材料12",
	    "otherloan13":"其他材料13",
	    "otherloan14":"其他材料14",
	    "otherloan15":"其他材料15",
	    "otherloan16":"其他材料16",
	    "otherloan17":"其他材料17",
	    "otherloan18":"其他材料18",
	    "otherloan19":"其他材料19",
	    "otherloan20":"其他材料20",
	    "otherloan21":"其他材料21",
	    "otherloan22":"其他材料22",
	    "otherloan23":"其他材料23",
	    "otherloan24":"其他材料24",
	    "otherloan25":"其他材料25",
	    "otherloan26":"其他材料26",
	    "otherloan27":"其他材料27",
	    "otherloan28":"其他材料28",
	    "otherloan29":"其他材料29",
	    "otherloan30":"其他材料30",
	    "otherloan31":"其他材料31",
	    "otherloan32":"其他材料32",
	    "otherloan33":"其他材料33",
	    "otherloan34":"其他材料34",
	    "otherloan35":"其他材料35",
	    "otherloan36":"其他材料36",
	    "otherloan37":"其他材料37",
	    "otherloan38":"其他材料38",
	    "otherloan39":"其他材料39",
	    "otherloan40":"其他材料40",
	    "otherloan41":"其他材料41",
	    "otherloan42":"其他材料42",
	    "otherloan43":"其他材料43",
	    "otherloan44":"其他材料44",
	    "otherloan45":"其他材料45",
	    "otherloan46":"其他材料46",
	    "otherloan47":"其他材料47",
	    "otherloan48":"其他材料48",
	    "otherloan49":"其他材料49",
	    "otherloan50":"其他材料50",
	    "otherloan51":"其他材料51",
	    "otherloan52":"其他材料52",
	    "otherloan53":"其他材料53",
	    "otherloan54":"其他材料54",
	    "otherloan55":"其他材料55",
	    "otherloan56":"其他材料56",
	    "otherloan57":"其他材料57",
	    "otherloan58":"其他材料58",
	    "otherloan59":"其他材料59",
	    "otherloan60":"其他材料60",
	    "clh":"承诺函",
	    "fqwtkksqs":"分期委托扣款申请书",
	    "sddzqrxy":"送达地址确认协议",
	    "fzdmssqwts":"非指定模式授权委托书",
	    "hyztsmjjs":"婚姻状态申明具结书",
	    "qcgchtnry":"汽车购车合同内容页",
	    "qcgchtqzy":"汽车购车合同签字页",
	    "srzm2":"收入证明二",
	    "gygfqdgd":"工银购车分期商品订购单",
	    "gcfqsqsnry":"购车分期申请书内容页",
	    "gcfqsqsqzy":"购车分期申请书签字页",
	    "grjszhzm":"个人结算账户证明",
	    "rzzlxy":"融资租赁协议",
	    "gdhtydys":"股东会同意抵押决议书",
	    "dlysxkz":"道路运输许可证",
	    "gkxy":"挂靠协议",
	    "jfxqwg":"家访小区外观",
	    "jfdylzp":"家访单元楼照片",
	    "jfzpmp":"家访照片门牌",
	    "jfzpkt":"家访照片客厅",
	    "jfzphy":"家访照片与借款人合影",
	    "scxhy":"生产型与借款人合影",
	    "myxgsmc":"贸易型公司名称",
	    "myxbgcd":"贸易型办公场地",
	    "myxhy":"贸易型和借款人合影",
	    "scxgsmc":"生产型公司名称",
	    "scxsccd":"生产型生产场地",
	    "scxckzp":"生产型仓库照片",
	    "othersmtc1":"上门调查其他1",
	    "othersmtc2":"上门调查其他2",
	    "othersmtc3":"上门调查其他3",
	    "qyzp":"签约照片",
	    "qykbhtqzy":"空白合同签字页",
	    "qywzht1":"完整合同第一页",
	    "qywzht2":"完整合同第二页",
	    "qywzht3":"完整合同第三页",
	    "othersign1":"其他签约材料1",
	    "othersign2":"其他签约材料2",
	    "othersign3":"其他签约材料3",
	    "othersign4":"其他签约材料4",
	    "othersign5":"其他签约材料5",
	    "othersign6":"其他签约材料6",
	    "st":"收条",
	    "cldgxy":"车辆代购协议",
	    "wthksqs":"委托还款授权书",
	    "lhyhbzh":"联合银行保证函",
	    "lhyhksqb":"联合银行卡申请表",
	    "lhyhjkhtqzy":"联合银行借款合同签字页",
	    "lhyhdyhtqzy":"联合银行抵押合同签字页",
	    "lhyhywdlxy":"联合银行业务代理协议",
	    "lhyhgxht":"联合银行购销合同",
	    "lhyhzyts":"联合银行重要提示",
	    "lhyhcl":"联合银行共同还款人承诺",
	    "lhyhgcrjsz":"联合银行购车人驾驶证",
	    "dzpz":"垫资凭证",
	    "qysp1":"签约视频1",
	    "qysp2":"签约视频2",
	    "qysp3":"签约视频3",
	    "sfkpz":"首付款凭证",
	    "hksm":"划款申明",
	    "grdzjj":"个人垫资借据",
	    "gcxy":"购车协议",
	    "dkhtqzy":"贷款合同签字页",
	    "dkhtsy":"贷款合同首页",
	    "skqrh":"收款确认函",
	    "cwdzpz":"财务垫资凭证",
	    "gcfp":"购车发票",
	    "clqjx":"车辆交强险",
	    "xlhgz":"车辆合格证",
	    "gd":"关单",
	    "jyd":"检验单",
	    "cjhhy":"车架号和申请人身份证合影",
	    "cjhzp":"车架号照片",
	    "cqmzp":"车全貌照片",
	    "fdjhzp":"发动机号照片",
	    "ywysqrhy":"业务员申请人车辆合影照片",
	    "clsyx":"车辆商业险",
	    "pd1":"批单1",
	    "pd2":"批单2",
	    "zcdjz":"注册登记证",
	    "djzysjbh":"登记证右上角编号",
	    "pgbg":"评估报告",
	    "ywykhcgshy":"业务员和客户在车管所的合影",
	    "cszczp":"车身左侧照片",
	    "csyczp":"车身右侧照片",
	    "tczp":"天窗照片",
	    "cnzp1":"车内照片一",
	    "cnzp2":"车内照片二",
	    "cnzp3":"车内照片三",
	    "lcszp":"里程数照片",
	    "zsz":"行驶证",
	    "ccnx":"出厂年限",
	    "cwzp":"车尾照片",
	    "esczcdjz":"二手车注册登记证",
	    "esccjh":"二手车车架号",
	    "ctzp":"车头照片",
	    "xtzqtzs":"系统知情通知书/惠融授权书"
	}
})(window);