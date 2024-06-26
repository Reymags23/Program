import * as CFBModule from 'cfb';
type CFBType = typeof CFBModule;
declare var CFB: CFBType;

var CT_VBA = "application/vnd.ms-office.vbaProject";
function make_vba_xls(cfb: CFBModule.CFB$Container) {
	var newcfb = CFB.utils.cfb_new({root:"R"});
	cfb.FullPaths.forEach(function(p, i) {
		if(p.slice(-1) === "/" || !p.match(/_VBA_PROJECT_CUR/)) return;
		var newpath = p.replace(/^[^\/]*/,"R").replace(/\/_VBA_PROJECT_CUR\u0000*/, "");
		CFB.utils.cfb_add(newcfb, newpath, cfb.FileIndex[i].content);
	});
	return CFB.write(newcfb);
}

function fill_vba_xls(cfb: CFBModule.CFB$Container, vba: CFBModule.CFB$Container): void {
	vba.FullPaths.forEach(function(p, i) {
		if(i == 0) return;
		var newpath = p.replace(/^[\/]*[^\/]*[\/]/, "/_VBA_PROJECT_CUR/");
		if(newpath.slice(-1) !== "/") CFB.utils.cfb_add(cfb, newpath, vba.FileIndex[i].content);
	});
}

var VBAFMTS: string[] = [ "xlsb", "xlsm", "xlam", "biff8", "xla" ];
