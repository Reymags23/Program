function parse_Cache(data/*:string*/)/*:[Array<number|string>, string, ?string]*/ {
	var col/*:Array<number|string>*/ = [];
	var num = data.match(/^<c:numCache>/);
	var f;

	/* 21.2.2.150 pt CT_NumVal */
	(data.match(/<c:pt idx="(\d*)"[^<>\/]*><c:v>([^<])<\/c:v><\/c:pt>/mg)||[]).forEach(function(pt) {
		var q = pt.match(/<c:pt idx="(\d*)"[^<>\/]*><c:v>([^<]*)<\/c:v><\/c:pt>/);
		if(!q) return;
		col[+q[1]] = num ? +q[2] : q[2];
	});

	/* 21.2.2.71 formatCode CT_Xstring */
	var nf = unescapexml((str_match_xml(data, "c:formatCode") || ["","General"])[1]);

	(str_match_ng(data, "<c:f>", "</c:f>")||[]).forEach(function(F) { f = F.replace(/<[^<>]*>/g,""); });

	return [col, nf, f];
}

/* 21.2 DrawingML - Charts */
function parse_chart(data/*:?string*/, name/*:string*/, opts, rels, wb, csheet) {
	var cs/*:Worksheet*/ = ((csheet || {"!type":"chart"})/*:any*/);
	if(!data) return csheet;
	/* 21.2.2.27 chart CT_Chart */

	var C = 0, R = 0, col = "A";
	var refguess = {s: {r:2000000, c:2000000}, e: {r:0, c:0} };

	/* 21.2.2.120 numCache CT_NumData */
	(str_match_ng(data, "<c:numCache>", "</c:numCache>")||[]).forEach(function(nc) {
		var cache = parse_Cache(nc);
		refguess.s.r = refguess.s.c = 0;
		refguess.e.c = C;
		col = encode_col(C);
		cache[0].forEach(function(n,i) {
			if(cs["!data"]) {
				if(!cs["!data"][i]) cs["!data"][i] = [];
				cs["!data"][i][C] = {t:'n', v:n, z:cache[1] };
			} else cs[col + encode_row(i)] = {t:'n', v:n, z:cache[1] };
			R = i;
		});
		if(refguess.e.r < R) refguess.e.r = R;
		++C;
	});
	if(C > 0) cs["!ref"] = encode_range(refguess);
	return cs;
}
