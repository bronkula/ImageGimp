var IG = {

	isCreated : false,  			// gimpCSS has been instantiated
	isShowing : false,				// ImageGimp panel is showing
	imShowing : false,				// Image is showing inside panel
	isLoading : false,				// Image is currently loading
	preLoading : false,				// Image is currently loading
	isFullSize : false,				// Images should be set to full size when opening
	jqxhr : false,
	trigger : false,
	dlBytes : false,
	totalBytes : false,
	percent : false,
	lsBoxShowing : false,			// List Box is showing
	imBoxShowing : false,			// Image Box is showing
	maxSize : false,					// Maximum height and width for show all images
		
	widths : [
		275,	// width of the side panel
		10,		// general padding width
		26,		// length of link strings
		12,		// font-size
		0		// Y-offset for scroll placement
	],

	// various arrays for use throughout ImageGimp
	gimpLinks : [],
	matches : [],
	tempArray : [],
	ratios : [],
	localStorage : {},
	LSarray : ["addDate"],
	linkFindTypes : [
		{name:"Link",cssVal:"#000088"},
		{name:"Image",cssVal:"#008800"},
		{name:"Html",cssVal:"#880000"},
		{name:"Fusker",cssVal:"#888800"},
		{name:"Insert",cssVal:"#880088"},
		{name:"Replace",cssVal:"#008888"}
		],
	linkSizeTypes : [
		{name:"Tiny",minVal:0,maxVal:2500,cssVal:"#333333 !important"},
		{name:"Small",minVal:2501,maxVal:90000,cssVal:"#666666 !important"},
		{name:"Medium",minVal:90001,maxVal:480000,cssVal:"#999999 !important"},
		{name:"Large",minVal:480001,maxVal:6250000,cssVal:"#cccccc !important"},
		{name:"Extra Large",minVal:6250001,maxVal:1600000000,cssVal:"#ffffff !important"},
		],
		
	// lowercase and uppercase alphabets from 
	ll : "abcdefghijklmnopqrstuvwxyz",
	lu : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	
	currentImage : 0,
	I : {		// current image object
		id : false, // id in the gimpLinks list
		iw : 0, // current image width
		ih : 0, // current image height
		src : false,
		pre : false
	},
	
	Ims : {
		loading			: chrome.extension.getURL("images/loading.gif"),
		failed			: chrome.extension.getURL("images/failed.png"),
		arrowleft		: chrome.extension.getURL("images/arrowleft.png"),
		arrowright	: chrome.extension.getURL("images/arrowright.png"),
		arrowup			: chrome.extension.getURL("images/arrowup.png"),
		arrowdown		: chrome.extension.getURL("images/arrowdown.png"),
		scroll_dwn	: chrome.extension.getURL("images/scroll_dwn.png"),
		scroll_gutterbtm	: chrome.extension.getURL("images/scroll_gutterbtm.png"),
		scroll_guttermid	: chrome.extension.getURL("images/scroll_guttermid.png"),
		scroll_guttertop	: chrome.extension.getURL("images/scroll_guttertop.png"),
		scroll_thumb	: chrome.extension.getURL("images/scroll_thumb.png"),
		scroll_up	: chrome.extension.getURL("images/scroll_up.png"),
		icon_128 : chrome.extension.getURL("icon_128.png"),
		logo_128t : chrome.extension.getURL("images/full_logo_128t.png"),
		background : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAADUlEQVQYV2NgYGCYDwAApACgVZ+BQgAAAABJRU5ErkJggg=="
	},
	
	fileFormats : [
		// Image formats
		",ani,anim,apng,art,bef,bmf,bmp,bsave,cal,cgm,cin,cpc,dpx,ecw,exr,fits,flic,fpx,gif,hdri,icer,icns,ico,cur,ics,iges,"+
		"ilbm,jbig,jbig2,jng,jpeg,jpg,mng,miff,pbm,pcx,pgf,pgm,png,ppm,psp,qtvr,rad,rgbe,sgi,tga,tiff,wbmp,webp,xar,xbm,xcf,xpm,",
		// Video formats
		",aiff,wav,xmf,fits,3gp,asf,avi,flv,f4v,iff,mkv,mj2,qt,mpeg,mpg,mp4,ogg,rm,"
		],

	init : function() {
		IG.isCreated = true;
		
		// CSS
		$("html").append("<style id='gimpCSS' class='gimpnecessary' type='text/css'>"+
		'#gimpNHTML { display:none; }\n'+
		
		'#gimpListBox { position:fixed; top:0px; left:0px; z-index:9999999; width: '+IG.widths[0]+'px; height:0px; background:#222222; overflow:hidden; font-family: verdana, arial; }\n'+
		
		'#gimpListBoxHeader { height:20px; padding:'+IG.widths[1]+'px '+IG.widths[1]+'px 0px '+IG.widths[1]+'px ; }\n'+
		'#gimpListBoxInput { border:#888888 1px solid !important; background:#000000 !important; color:#ffffff !important; font:normal 12px/14px verdana, arial !important; width:'+(IG.widths[0]-(IG.widths[1]*2))+'px !important; height:17px !important; padding:0px !important; margin:0px !important; }\n'+
		
		'#gimpListBoxContent { position:relative; width: '+(IG.widths[0]-(IG.widths[1]*2))+'px; height:100%; background:#000000; margin:'+IG.widths[1]+'px; color:#ffffff; overflow:auto; font-size:'+IG.widths[3]+'px; }\n'+
		'.listAnchors { cursor:pointer; padding:1px; color:#ffffff; font:normal '+IG.widths[3]+'px/14px verdana, arial !important; text-align:left !important; }\n'+
		'.IGLA { float:right; margin:1px; height:10px; width:10px; border:#222222 1px solid; }\n'+
		'.IGLAChosen { background:#113311 !important; }\n'+
		'.listAnchors:hover { background:#333333; }\n'+

		'#gimpListBoxFooter { height:15px; padding:0px '+IG.widths[1]+'px '+IG.widths[1]+'px '+IG.widths[1]+'px !important; font:normal 10px/12px verdana, arial !important; color:#ffffff !important; text-align:center !important; }\n'+
				
		'#gimpImageBox { position:fixed; top:0px; left:'+IG.widths[0]+'px; z-index:9999998; width: '+(IG.widths[0]-(IG.widths[1]*2))+'px; height:100%; background:#000000 url("'+IG.Ims.logo_128t+'") no-repeat center; ; overflow:hidden; font-size:'+IG.widths[3]+'px; font-family: verdana, arial; }\n'+
		'#gimpImageBoxUnder { position:relative; overflow:auto; height:100%; width:100%; }\n'+	
		'#gimpImageBoxDummy { position:relative; overflow:auto; height:100%; width:100%; }\n'+	
		'#gimpImageBoxImage { position:absolute; top:0px; right:0px; bottom:0px; left:0px; margin:auto; }\n'+
		
		'#gimpImageBoxOver { visibility:hidden; }\n'+		
		'#gimpImageBoxTitle { position:absolute; bottom:25px; left:0px; right:0px; margin:auto; text-align:center; }\n'+
		'#gimpImageBoxTitleA { font:normal '+IG.widths[3]+'px/14px verdana, arial !important; color:white !important; text-decoration:none !important; min-width:150px ; max-width:500px; padding:5px 10px 5px 10px !important; border-radius:10px !important; background-image:url('+IG.Ims.background+'); }\n'+			
		
		'#gimpImageBoxArrows { height:60px; width:160px; bottom:44px; left:0px; right:0px; margin-right:auto; margin-left:auto; position:absolute; }\n'+
		'#gimpImageBoxArrows:hover .arrowInner { visibility:visible; }\n'+

		'.arrowBut { cursor:pointer; }\n'+
		'.arrowInner { height:50px; width:150px; padding:5px; border-radius:10px; visibility:hidden; background-image:url('+IG.Ims.background+'); }\n'+
		"</style>");

		$("html").append(
			$("<div id='gimpNHTML' class='gimpnecessary'/>").append(
				$("<div id='gimpListBox' />").append( 
					$("<div id='gimpListBoxHeader' />").append($("<input type='text' id='gimpListBoxInput' />")),
					$("<div id='gimpListBoxContent' />"), 
					$("<div id='gimpListBoxFooter' />")
				),
				
				$("<div id='gimpImageBox' />").append(
					$("<div id='gimpImageBoxUnder' />").append(
						$("<div id='gimpImageBoxDummy' />"),
						$("<div id='gimpImageBoxOver' />").append(
							$("<div id='gimpImageBoxArrows' />").append(
								$("<div class='arrowInner' />").append(
									$("<img class='arrowBut' id='gimpImageBoxArrowsL' src='"+IG.Ims.arrowleft+"' />")
										.click(function(){IG.setImagePrev();}),
									$("<img class='arrowBut' id='gimpImageBoxArrowsU' src='"+IG.Ims.arrowup+"' />")
										.click(function(){
											if($("#gimpImageBoxArrowsU").attr("src")==IG.Ims.arrowup){ IG.setImageUp(); } 
											else { IG.setImageDown(); } 
										}),
									$("<img class='arrowBut' id='gimpImageBoxArrowsR' src='"+IG.Ims.arrowright+"' />")
									.click(function(){IG.setImageNext();})
								)
							),
								
							$("<div id='gimpImageBoxTitle' />")
						)
					)
				)
			)
		);
		
		IG.clearImage();
	},
	
	showListBox : function() {
		if(IG.isShowing == false) {
			window.addEventListener("resize", IG.getResize, false);
			window.addEventListener("keydown", IG.getKeypress, false);
			IG.isShowing = true;
			$otherhtml = $("html").children().not(".gimpnecessary");
			$otherhtml.each(function(index){ 
				if($(this).css("display")!='none') { $(this).css("display","none"); $(this).data('doremove',true); } 
				else $(this).data('doremove',false);
			});
			IG.fitBox();
			$("#gimpNHTML").fadeIn("fast");		
		}
	},
	
	hideListBox : function() {
		if(IG.isShowing == true) {
			window.removeEventListener("resize", IG.getResize, false);
			window.removeEventListener("keydown", IG.getKeypress, false);
			IG.isShowing = false;
			$otherhtml = $("html").children().not(".gimpnecessary");
			$otherhtml.each(function(index){ if($(this).data('doremove')==true) $(this).css("display",""); });
			$("#gimpNHTML").fadeOut("fast");
		}
	},

	writeLinkList : function(d) {
		if(d==undefined) d = IG.gimpLinks;
		if(d.length==0) return;

		$("#gimpListBoxContent").html("");
		$.each(d, function(k,v) {
			if(v.loaded==undefined || v.loaded==true) var b = {"border-color":IG.getIGLABorder(v.gst),"background-color":IG.linkFindTypes[v.gft].cssVal};
			else var b = {"border-color":"#FF0000","background-color":"#000000"};
			$("#gimpListBoxContent").append(
				$("<div class='listAnchors' id='IGLA"+k+"' title='"+IG.getAnchorTitle(k)+"'>"+IG.getNameTruncated(v.gn)+"</div>")
				.click(function(){IG.popImage(k);})
				.append($("<div class='IGLA' />").css(b))
			);
		}); 
	},
	
	writeImgList : function(d) {
		if(d==undefined) d = IG.gimpLinks;
		if(d.length==0) return;
		
		var msize = (IG.maxSize!==false) ? " style='max-width:"+IG.maxSize.w+"px;max-height:"+IG.maxSize.h+"px;'" : "";
		
		console.log(msize);

		IG.hideArrows();
		$("#gimpImageBoxDummy").empty();
		$.each(d,function(k,v) {
			$("#gimpImageBoxDummy").append(
				$("<img class='dummyimages' src='"+v.gl+"'"+msize+" />")
					.data("oid",v.oid)
					.mouseover(function(){ IG.setCurrentIGLA(v.oid); })
					.click(function(){ IG.popImage(v.oid); })
					
			);
		});
		$.preload($(".dummyimages"),{
			onRequest:function(data){ 
				IG.preLoading = true;
				IG.gLog("Attempting "+(data.index+1)+" of "+data.total);
			},
			onFinish:function(data){ 
				IG.preLoading = false;
				IG.gLog(data.loaded+" of "+data.total+" loaded successfully");
			},
			onComplete:function(data) {
				IG.imageLoaded($(data.original).data("oid"),data,1);
			},
			placeholder:IG.Ims.loading,
			notFound:IG.Ims.failed
		});
	},
	
	grabLinkList : function(d) {
		var temp = [];
		if(!IG.tempArray.length) { return; }
		if(d.type=='num') {
			for(var a=d.start;a<=d.end;a++) { 
				IG.tempArray[a].oid=(IG.tempArray[a].oid==undefined)?a:IG.tempArray[a].oid; 
				temp.push(IG.tempArray[a]); 
			}
		} 
		else if(d.type=='str') {
			$.each(IG.tempArray,function(k,v) {
				if(RegExp(d.str).exec(v.gl)) { 
					v.oid=(v.oid==undefined)?k:v.oid; 
					temp.push(v); 
				}
			});
		}
		else if(d.type=='size') {
			$.each(IG.tempArray,function(k,v) {
				if(v.gst!==false && v.gst==d.size) { 
					v.oid=(v.oid==undefined)?k:v.oid; 
					temp.push(v); 
				}
			});
			if(temp.length==0) IG.gLog("Try preloading all images");
		}
		IG.tempArray=temp;
	},
	
	makeListFromLinks : function() {
		$("a").each(function(i){
			str = $(this).attr("href");
			if(str!=undefined && !str.match(/^(javascript:|mailto:)/)) { 
				title = $(this).text();
				IG.makeFileCheck(unescape(str),title,"gimpLinks",0); 
			}
		}); 
	},
	
	makeListFromImages : function() {
		$("*").each(function(i){
			if($(this).attr("src")!=undefined && ($(this).context.nodeName=="IMG" || $(this).attr("type")=="image")) {
				IG.makeFilePath(unescape($(this).attr("src")),false,"gimpLinks",IG.gimpLinks.length,1);				
			}
			if(/url\((.+)\)/.exec($(this).css("background-image"))) {
				IG.makeFilePath(unescape(RegExp.$1),false,"gimpLinks",IG.gimpLinks.length,1);				
			}
		}); 
	},
	
	makeListFromHtml : function() {
		docLinks = $("html").html().match(
			RegExp('(\\(|"|\'|=)((\\w+:\/\/|)[^\\n\'?&=:">]+\\.(jpg|jpeg|jpe|gif|png|xpm|bmp|tif|tiff|art))("|\'|>|&|\\)|\\W)','ig')
		);
		var listlength=(docLinks==null)?0:docLinks.length;
		for (var i=0; i<listlength; i++) {
			filename=docLinks[i]=unescape(
				docLinks[i].replace(/^\(|\)$|\"|^\s*\'|\'\s*$|=|\?|>|&|\\$|^\s+|\s+$/g,'')
				// fix unicode colon and slash in urls
				.replace(/\\u00253A/gi,':').replace(/\\u00252F/gi,'/')
				);
			IG.makeFilePath(filename,false,"gimpLinks",IG.gimpLinks.length,2);	
		}
	},

	makeFileCheck : function(str,title,arr,type) {
		//console.log(arguments);
		var ext = str.match(/\.([^\.\/\\\?\)]+)$/);
		// if the link has what appears to be a file extension
		if(ext != null) {						
			var hit = IG.fileFormats[0].match(RegExp(","+ext[1]+",","i"));
			// if the extension matches the image extension list
			if(hit != null) {					
				IG.makeFilePath(str,title,arr,IG[arr].length,type);
			}
		}
	},
	
	// Update link at any position in array, including new
	makeFilePath : function(str,title,arr,pos,type) { 
		var d = new Date();
	
		//console.log(arguments);
		// create full link from full url
		if(/^https?:|^ftp:/.test(str)) {
			// separate link and get prefix
			var prefix = str.match(/^(.+):\/\/([^?]+)/); 
			var gp = prefix[2].split("/");
			gp[0] = prefix[1]+"://"+gp[0];
			
			var gn = gp.pop();
			/\.([^\.\/\\\?]+)$/.exec(gn);
			var ext = RegExp.$1;
			var gt = d.valueOf();
			//console.log("1 "+str)
		}
		// create full link from base64 data
		else if(/^[^\/]+:/.test(str)) {
			if(/data:(.+?)\/(.+?);(.+?),/.exec(str)){
				var dt = RegExp.$1; // data type
				var ext = RegExp.$2; // data extension
				var gt = RegExp.$3; // data base type
				var gn = dt+"/"+ext+";"+gt;
				var gp = false;
				//console.log("2.1 "+str)
			}
			else {
				if(/^chrome/.exec(str)) return;
				var ext = ""; 
				var gt = ""; 
				var gn = "Other Data Type";
				var gp = false;
				//console.log("2.2 "+str)
			}
		}
		else if(/^(ftp|https?)[^:]+$/.test(str)) {
			
		}
		// create full link from virtual url
		else {
			var po = window.location.origin;
			var pp = window.location.pathname.split("/");
			pp[0]=po;
			var script = pp.pop();
			var gp1 = pp;
			var gp2 = str.split("/");
			
			if(gp2[0] == '') {
				gp2[0] = gp1[0];
				gp = gp2;
				str = gp.join("/");
				//console.log("3.1 "+str)
			} else if(gp2[0] == '..') {
				gp1.pop();
				gp2.shift();
				gp = gp1.concat(gp2);
				str = gp.join("/");
				//console.log("3.2 "+str)
			} else {
				if(gp2[0]=='.') gp2.shift();
				gp = gp1.concat(gp2);
				str = gp.join("/");	
				//console.log("3.3 "+str)
			}
			
			var gn = gp.pop();
			/\.([^\.\/\\\?]+)$/.exec(gn);
			var ext = RegExp.$1;
			var gt = d.valueOf();
		} 
		
		IG[arr][pos] = {
			gl : str,					// Original Link
			gn : gn,					// File Name
			ge : ext,					// File extension
			gp : gp,					// File Path
			gi : title,				// Link title
			gt : gt,					// Date string
			gft : type,				// Type of entry 0 link, 1 image, 2 html, 3 fusker, 4 insert, 5 replace
			gsv : false,			// Size of image in pixels
			gst : false,			// CSS style type based on size
			// loaded 					 This starts undefined
			gw : false,
			gh : false
		};
	},
	
	// load image and resize to fit the box
	popImage : function(num) {
		if(IG.isLoading!==false) return false;
		if(IG.preLoading!==false && IG.gimpLinks[num].loaded==undefined) return false;
		IG.I.pre = IG.I.id;
		IG.I.id = num;
		IG.showArrows();
		$("#gimpImageBoxDummy").empty();
		$("#gimpImageBoxOver").css("visibility","visible");
		$("#gimpImageBoxDummy").prepend($("<img id='gimpImageBoxImage' />"));
		
		IG.setImageTitle();
		if(IG.gimpLinks[num].gt == "base64" || IG.localStorage.addDate == undefined || IG.localStorage.addDate == "false") {
			$("#gimpImageBoxImage").attr("src",IG.gimpLinks[num].gl);
		} else {
			$("#gimpImageBoxImage").attr("src",IG.gimpLinks[num].gl+"?"+IG.gimpLinks[num].gt);
		}

		$.preload("#gimpImageBoxImage",{
			onRequest:function(data){ 
				IG.isLoading = true;
				$("#gimpImageBoxImage").removeAttr("class");
			},
			onFinish:function(data){ 
			},
			onComplete:function(data) {
				IG.isLoading = false;
				IG.imageLoaded(IG.I.id,data,0);
			},
			placeholder:IG.Ims.loading,
			notFound:IG.Ims.failed
		});
			
		IG.setCurrentIGLA(num);
		IG.imShowing = true;
	},
	
	setCurrentIGLA : function(num) {
		// this sets the selected link to be recolored, and uncolors the previous 
		$("#IGLA"+num).attr("class","listAnchors IGLAChosen");
		if(IG.I.pre!==false) $("#IGLA"+IG.I.pre).attr("class","listAnchors");
		IG.I.pre = num;
		
		// this is to make sure that the current image should always be visible in the list
		$sbi = $("#gimpListBoxContent")
		if($("#IGLA"+num).position().top>$sbi.height()-16) { 
			$sbi.scrollTop($sbi.scrollTop()+(16-($sbi.height()-$("#IGLA"+num).position().top))); } 
		else if($("#IGLA"+num).position().top < 0) { $sbi.scrollTop(16*num); }
	},
	
	// set the title div to the url of the current image
	setImageTitle : function() {
		gt = IG.gimpLinks[IG.I.id].gn+((IG.gimpLinks[IG.I.id].gi==false || IG.gimpLinks[IG.I.id].gn==IG.gimpLinks[IG.I.id].gi)?"":" : "+IG.gimpLinks[IG.I.id].gi);
		
		$("#gimpImageBoxTitle").html("<a href='"+IG.gimpLinks[IG.I.id].gl+"' id='gimpImageBoxTitleA'>"+gt+"</a>");
		//console.log(IG.gimpLinks[IG.I.id]);
	},
	
	getAnchorTitle : function(num) {
		var o = IG.gimpLinks[num];
		return num+"\n"+
			o.gl+"\n"+
			IG.linkFindTypes[o.gft].name+"\n"+
			((o.gst===false) ? "Unloaded" : IG.linkSizeTypes[o.gst].name+" ("+o.gw+"x"+o.gh+")");
	},
	
	// get the size type css information
	getIGLABorder : function(num) {
		if(num===false) return "#000000 !important";
		else return IG.linkSizeTypes[num].cssVal;
	},
	
	getGST : function(num) {
		var b = false;
		$.each(IG.linkSizeTypes, function(k,v) {
			if(num>=v.minVal && num<=v.maxVal) { b = k; return false; }
		});
		return b;
	},
	
	// do this when image has loaded
	imageIsLoaded : function() {
		IG.gimpLinks[IG.I.id].loaded = true;
		IG.fitImageInBox();
	},
	
	// do this after loading an image
	imageLoaded : function(index,data,pre) {
		var o = IG.gimpLinks[index];
		//console.log(arguments,o);
		if(data.found) {
			o.loaded = true;
			o.gw = data.element.naturalWidth;
			o.gh = data.element.naturalHeight;
			o.gsv = o.gw*o.gh;
			o.gst = IG.getGST(o.gsv);
			$("#IGLA"+index+" div")
				.css("border-color",IG.linkSizeTypes[o.gst].cssVal);
			$("#IGLA"+index)
				.attr("title",IG.getAnchorTitle(index))
		} else if(!data.found) {
			o.loaded = false;
			$("#IGLA"+index+" div").css({"border-color":"#FF0000 !important","background-color":"#000000 !important"});
		}
		if(!pre) { 
			IG.fitImageInBox();
			$("#gimpImageBoxImage").fadeIn("slow");
			IG.gLog("("+IG.gimpLinks[IG.I.id].gw+" x "+IG.gimpLinks[IG.I.id].gh+") "+IG.gimpLinks[IG.I.id].ge);
		}
	},
	
	// fit the imagegimp box into the window
	fitBox : function() {
		$("#gimpListBox")
			.width(IG.widths[0])
			.height($(window).height());
		$("#gimpListBoxContent")
			.height($(window).height()-(IG.widths[1]*2)-55);
		$("#gimpImageBox")
			.width($(document).width()-IG.widths[0])
			.height($(window).height());
		if(IG.imShowing == true) IG.fitImageInBox();
	},

	// fit the image inside the box
	fitImageInBox : function(d) {
		if(d==undefined) d = $("#gimpImageBoxImage");
		var w = $("#gimpImageBox").width()-(IG.widths[1]*2); 
		var h = $("#gimpImageBox").height()-(IG.widths[1]*2); 
		if(IG.isFullSize == true) { 
			if(d.context.naturalWidth>w && d.context.naturalHeight<h) { d.css({margin:"auto auto auto 0px"}); }
			else if(d.context.naturalWidth<w && d.context.naturalHeight>h) { d.css({margin:"0px auto auto auto"}); }
			else if(d.context.naturalWidth>w && d.context.naturalHeight>h) { d.css({margin:"0px 0px 0px 0px"}); }
			else if(d.context.naturalWidth<w && d.context.naturalHeight<h) { d.css({margin:"auto"}); }
			w = h = "";
		} else { 
			w = $("#gimpImageBox").width()-(IG.widths[1]*2); 
			h = $("#gimpImageBox").height()-(IG.widths[1]*2); 
			d.css({margin:"auto"});
		}
		d.css({ "max-height":h, "max-width":w });
	},
	
	// cut long names in half and put ellipses in the middle
	getNameTruncated : function(str) {
		//console.log(str)
		if(str.length > IG.widths[2]) {
			var str1 = str.substr(0,((IG.widths[2]/2)-1));
			var str2 = str.substr(-((IG.widths[2]/2)-1));
			return str1+"..."+str2;
		} else return str;
	},
	
	// set image to the next image in list
	setImageNext : function() {
		if(IG.I.id==IG.gimpLinks.length-1 || IG.I.id===false) i = 0; else i = IG.I.id+1;
		//console.log(i);
		IG.popImage(i);
	},
	
	// set image to the previous image in list
	setImagePrev : function() {
		if(IG.I.id==0) i = IG.gimpLinks.length-1; else i = IG.I.id-1;
		//console.log(i);
		IG.popImage(i);
	},
	
	// set image images to display at full size
	setImageUp : function() {
		IG.isFullSize = true;
		$("#gimpImageBoxArrowsU").attr("src",IG.Ims.arrowdown);
		IG.fitImageInBox();
	},
	
	// set images to display fit on the screen
	setImageDown : function() {
		IG.isFullSize = false;
		$("#gimpImageBoxArrowsU").attr("src",IG.Ims.arrowup);
		IG.fitImageInBox();
	},
	
	// handle window resize
	getResize : function() {
		IG.fitBox();
	},
	
	// clear the link list and array
	clearList : function() {
		IG.gimpLinks = [];
		$("#gimpListBoxContent").text("");
		IG.gLog("");
	},
	
	// clear the image from view
	clearImage : function() {
		$("#gimpImageBoxDummy").empty();
		$("#gimpImageBoxTitle").text("");
	},
	
	hideArrows : function() { $("#gimpImageBoxOver").css("visibility","hidden"); },
	showArrows : function() { $("#gimpImageBoxOver").css("visibility","visible"); },
	
	// upon image error, set image to the failed logo
	imerr : function() {
		IG.isLoading = false;
		$("#gimpImageBoxOver").attr(chrome.extension.getURL("images/failed2.gif"));
	},
	
	// remove duplicate images
	noDupes : function() {
		var temp=[IG.gimpLinks[0]];
		var c;
		for(var a=0;a<IG.gimpLinks.length;a++){
			c=0;
			for(var b=0;b<temp.length;b++){
				if(IG.gimpLinks[a].gl==temp[b].gl) { c++; break; }
			}
			if(!c) temp.push(IG.gimpLinks[a]);
		}
		if(IG.gimpLinks.length!=temp.length) {
			IG.gLog((IG.gimpLinks.length-temp.length)+' dupes removed, '+temp.length+' remain');
			IG.gimpLinks=temp;
		} else { IG.gLog('No duplicates found'); }
	},

	// fusker parser for deep link fuskering
	parseLinkFusker : function(strip,num){
		var next=num+1;
		var zeros, let, check, b;
		var start=/\w+/.exec(IG.matches[1][num])+'';
		var end=/\w+/.exec(IG.matches[2][num])+'';
		
		var check1=IG.ll.indexOf(start.substr(0,1));
		var check2=IG.ll.indexOf(end.substr(0,1));
		var check3=IG.lu.indexOf(start.substr(0,1));
		var check4=IG.lu.indexOf(end.substr(0,1));
		
		if(/\d+\D+|\D+\d+/.test(start) || /\d+\D+|\D+\d+/.test(end)) { var zeros=0; start=parseInt(start); end=parseInt(end); }
		else if(check1!=-1 && check2!=-1) { zeros=0; let=1; start=check1; end=check2; }
		else if(check1!=-1 && check4!=-1) { zeros=0; let=1; start=check1; end=check4; }
		else if(start=='' && check2!=-1) { zeros=0; let=1; start=-1; end=check2; }
		else if(check3!=-1 && check4!=-1) { zeros=0; let=2; start=check3; end=check4; }
		else if(check3!=-1 && check2!=-1) { zeros=0; let=2; start=check3; end=check2; }
		else if(start=='' && check4!=-1) { zeros=0; let=2; start=-1; end=check4; }
		else if(start.substr(0,1)=='0' && start!='') { zeros=1; let=0;}
		else { zeros=0; let=0; }
		
		if(start>end) { check=start; start=end; end=check; }
		
		for(var i=start;i<=end;i++){
			if(zeros) b=IG.leadingZeros(i,String(start).length);
			else if(let==1) b=IG.ll.charAt(i);
			else if(let==2) b=IG.lu.charAt(i);
			else b=i;
			var newstrip=strip+b+splits[next];
			if(IG.matches[1][next]==null) { 
				var ext = newstrip.match(/\.([^\.\/\\\?]+)$/);
				
				IG.tempArray[IG.tempArray.length]=newstrip;
				IG.makeFilePath(newstrip,"","gimpLinks",IG.gimpLinks.length,3);
			} else {
				IG.parseFusker(newstrip,next);
			}
		}
	},
	
	// add zeros to fusker numbers
	leadingZeros : function(a,n) {
		var sign=''; var x; var r="";
		if (a<0) { a=0-a; sign='-'; }
		for (var i=0;i<n;i++) { x=a%10; a=(a-x)/10; r=x+r; }
		return sign + r;
	},
	
	// get localstorage value from extension
	getLocalStorage : function() {
		for(var a=0;a<IG.LSarray.length;a++) {
			chrome.extension.sendRequest({method: "getLocalStorage", key: IG.LSarray[a]}, function(response) {
				IG.localStorage[response.key] = response.data;
				//console.log(a,response.key,IG.localStorage[response.key],response.data);
			});
		}
	},
	
	// log information to the listbox footer
	gLog : function(str) {
		$("#gimpListBoxFooter").text(str);
	},
	
	// dump empty links from the list
	linkDump : function() {
		var c = 0; var temp = [];
		$.each(IG.gimpLinks,function(k,v){
			if(v.loaded == undefined || v.loaded == true) temp.push(v); else c++; 
		});
		IG.gimpLinks = temp;
		IG.gLog(c+" links removed from list");
	},
	
	// handle keypresses
	getKeypress : function(e) {
		//console.log(e.keyCode);
		var stop=false;
		//IG.gLog(" ("+e.keyCode+") ["+String.fromCharCode(e.keyCode)+"] {"+e.charCode+"}");
		switch(e.keyCode) {
			case 13: IG.addUrl(); stop=1; break;
			case 37: if(!$("#gimpListBoxInput").is(":focus")) { IG.setImagePrev(); stop=1; break; }
			case 38: if(!$("#gimpListBoxInput").is(":focus")) { IG.setImageUp(); stop=1; break; }
			case 39: if(!$("#gimpListBoxInput").is(":focus")) { IG.setImageNext(); stop=1; break; }
			case 40: if(!$("#gimpListBoxInput").is(":focus")) { IG.setImageDown(); stop=1; break; }
			default: $("#gimpListBoxInput").focus(); 
		}
		if(stop) {
			if (e.stopPropagation) e.stopPropagation();
			e.cancelBubble = true;
			e.returnValue = false;
		}
	},
	
	clearOIDs : function() {
		$.each(IG.gimpLinks,function(k,v){ delete v.oid; });
	},
	
	// run a string through the commandline from the listbox header
	addUrl : function(e) {
		//console.log(e);
		var val = $("#gimpListBoxInput").val();
		if(val == "") $("#gimpListBoxFooter").text("Command empty");
		else { $("#gimpListBoxInput").val(""); IG.getCMD(val); }
	},
	
	getCMD : function(url) {
		// show - show the image box
		//try{
		if(/^show ?(.+)?$/i.exec(url)) {
			var reg = RegExp.$1;
			if(reg=="") { 
				IG.showListBox();
				return;
			} 
			
			// show all image links
			if(/all/i.exec(reg)) {
				IG.tempArray = IG.gimpLinks;
				IG.grabLinkList({type:'num',start:0,end:IG.gimpLinks.length-1});
				IG.writeImgList(IG.tempArray);
				return;
			} 
			// show a single image with a list id of ##
			if(/^(\d+)$/i.exec(reg)) {
					var num=RegExp.$1*1;
					if(IG.gimpLinks.length>num && num>=0) IG.popImage(num);
					else IG.gLog("That link is outside my scope");
					return;
			}
			IG.tempArray = IG.gimpLinks;
			var match=reg.match(/\(\d*,?\d*\)|\{.+?\}|\[.+?\]/g);
			while(reg = match.shift()) {
				// show image list with a length of ##
				if(/^\((\d+)\)$/i.exec(reg)) {
					IG.grabLinkList({type:'num',start:0,end:RegExp.$1-1});
				} 
				// show image list from ## to ##, either can be blank
				else if(/^\((\d*),(\d*)\)$/i.exec(reg)) {
					var n1 = RegExp.$1==''?0:RegExp.$1*1;
					var n2 = RegExp.$2==''?IG.gimpLinks.length-1:RegExp.$2*1;
					IG.grabLinkList({type:'num',start:n1,end:n2});
				} 
				// show image list if link contains string
				else if(/^\{(.+)\}$/i.exec(reg)) {
					IG.grabLinkList({type:'str',str:RegExp.$1});
				} 
				// show image list from size of image
				else if(/^\[(.+)\]$/i.exec(reg)) {
					var n1 = RegExp.$1;
					var b = (function(){
						if(/\d+/.exec(n1)) return n1*1;
						for(var a=0;a<IG.linkSizeTypes.length;a++) { 
							if(IG.linkSizeTypes[a].name.toLowerCase()==n1.toLowerCase()) return a; 
						}
						return false;
					})();
					IG.grabLinkList({type:'size',size:b});
				}
			}
			IG.writeImgList(IG.tempArray);
		} 
		// hide - hide the image box
		else if(/^hide ?(.+)?$/i.exec(url)) {
			IG.hideListBox();
		} 
		// make - create list from the dom and show the box if not already showing
		else if(/^make ?(.+)?$/i.exec(url)) {
			var reg = RegExp.$1;
			IG.showListBox();
			IG.I.id = false;
			IG.gimpLinks = [];
			if(reg=="" || /all/i.exec(reg)) {
				IG.makeListFromLinks();
				IG.makeListFromImages();
				IG.makeListFromHtml();
			} else {
				if(/links?/i.exec(reg)) IG.makeListFromLinks();
				if(/images?|imgs?/i.exec(reg)) IG.makeListFromImages();
				if(/html/i.exec(reg)) IG.makeListFromHtml();
			}
			if(IG.gimpLinks.length>0) { 
				IG.clearImage();
				IG.gLog(IG.gimpLinks.length+" images found");
				if(/nodupes/i.exec(reg)) IG.noDupes(); 
			} else IG.gLog("No images found");
			IG.writeLinkList();
		} 
		// list - redraw the link list
		else if(/^list$/i.exec(url)) {
			IG.writeLinkList();
		} 
		// maxsize - sets the maximum height and width for 
		else if(/^maxsize ?(.+)$/i.exec(url) || /^(\<.+\>)$/i.exec(url)) {
			var reg = RegExp.$1;
			if(reg=="default") { IG.maxSize = false; IG.gLog("MaxSize reset to default"); }
			else {
				/^\<(\d+),(\d+)\>$/i.exec(reg);
				IG.maxSize = { w:RegExp.$1 , h:RegExp.$2 };
				IG.gLog("MaxSize set to <"+RegExp.$1+","+RegExp.$2+">");
			}
		} 
		// clear - clear image list and current image
		else if(/^clear ?(.+)?$/i.exec(url)) {
			var reg = RegExp.$1;
			if(reg=="" || /all/i.exec(reg)) { 
				IG.clearList();
				IG.clearImage();
			} else if (/list/i.exec(reg)) {
				IG.clearList();
			} else if (/image|img/i.exec(reg)) {
				IG.clearImage();
			}
			IG.isLoading = false; 
		} 
		// nodupes - remove all duplicate images from the list
		else if(/^nodupes$/i.exec(url)) {
			if(IG.gimpLinks.length>0) {
				IG.noDupes();
				IG.clearOIDs();
				IG.writeLinkList();
			}
		} 
		// dump - remove all images 
		else if(/^deep ?(.+)$/i.exec(url)) {
			IG.linkDump();
			IG.clearOIDs();
			IG.writeLinkList();
		}
		// dump - remove all images 
		else if(/^dump$/i.exec(url)) {
			IG.linkDump();
			IG.clearOIDs();
			IG.writeLinkList();
		}
		// background regex - change background color of image box
		else if(/^background ?(.+)/i.exec(url)) {
			var reg = RegExp.$1;
			if(IG.isCreated == true) {
				$("#gimpImageBox").css("background-color",reg);
				//console.log(reg);
			}
		} 
		// keep regex - keep phrase syntax
		else if(/^keep ?([^ ]+)$/i.exec(url)) {
			regex=RegExp(RegExp.$1,'i');
			b=0;
			for(var a=0;a<IG.gimpLinks.length;a++) {
				if(!regex.test(IG.gimpLinks[a].gl)) { IG.gimpLinks.splice(a,1); a--; b++; }
			}
			IG.gLog(b+" images removed from list");
			IG.clearOIDs();
			IG.writeLinkList();
		}
		// del/rem regex - keep phrase syntax
		else if(/^(?:del|rem|delete|remove) ?([^ ]+)$/i.exec(url)) {
			regex=RegExp(RegExp.$1,'i');
			b=0;
			for(var a=0;a<IG.gimpLinks.length;a++) {
				if(regex.test(IG.gimpLinks[a].gl)) { IG.gimpLinks.splice(a,1); a--; b++; }
			}
			IG.gLog(b+" images removed from list");
			IG.clearOIDs();
			IG.writeLinkList();
		}
		// keept/keeph N - keep number of images from head or tail syntax
		else if(/^keep(h|t) ?(\d+)$/i.exec(url)) {
			var b = IG.gimpLinks.length-RegExp.$2
			if(RegExp.$1=='h') IG.gimpLinks.splice(RegExp.$2,IG.gimpLinks.length);
			else IG.gimpLinks.splice(0,b);
			IG.gLog(b+" images removed from list");
			IG.clearOIDs();
			IG.writeLinkList();
		}
		// remt/remh/delt/delh N - remove number of images from head or tail syntax
		else if(/^(?:del|rem|delete|remove)(h|t) ?(\d+)$/i.exec(url)) {
			var b = IG.gimpLinks.length-RegExp.$2
			if(RegExp.$1=='h') IG.gimpLinks.splice(0,RegExp.$2);
			else IG.gimpLinks.splice(b,RegExp.$2);
			IG.gLog(b+" images remain in list");
			IG.clearOIDs();
			IG.writeLinkList();
		}
		// preload all
		else if(/^preload ?(.+)?$/i.exec(url)) {
			if(IG.preLoading) return;
			var reg = RegExp.$1;
			if(reg=="" || /all/i.exec(reg)) {
				var ilinks = [];
				$.each(IG.gimpLinks,function(k,v){ ilinks.push(v.gl); });
			}
			$.preload(ilinks,{
				onRequest:function(data){ 
					IG.preLoading = true;
					IG.gLog("Attempting "+(data.index+1)+" of "+data.total);
					//console.log('attempting ',data.image); 
				},
				onFinish:function(data){ 
					IG.preLoading = false;
					IG.gLog(data.loaded+" of "+data.total+" loaded successfully");
					console.log(data);
				},
				onComplete:function(data) {
					IG.imageLoaded(data.index,data,1);
				},
			});
		}
		// /regex/replace/ - replace some text with something else
		else if(/^\{(.+?)\} ?\[(.*)\]$/i.exec(url)) {
			toreplace=RegExp.$2;
			tomatch=RegExp.$1;
			var c = 0;
			for(var a=0;a<IG.gimpLinks.length;a++) {
				var ol = IG.gimpLinks[a].gl;
				var rep = ol.replace(RegExp(tomatch),toreplace);
				if(ol != rep) { c++; IG.makeFilePath(rep,"","gimpLinks",a,5); }
			}
			IG.gLog(c+" links affected");
			IG.writeLinkList();
		} 
		// url[1-10].jpg - fusker syntax for url parsing.  can accept letters, numbers, and leading zeros
		else if(/\w+:\/\/[^\/]+\/.*(\[\w*\-\w+].*)/.test(url)) {
			//console.log("Parse Url with Fusker Syntax");
			IG.matches[1] = url.match(/\[(\w*)-/g);
			IG.matches[2] = url.match(/-(\w+)]/g);
			
			splits = new Array();
			var i = 0; 
			searchstring = url;
			while(/\[\w*\-\w+]/.exec(searchstring)){
				splits[i] = RegExp.leftContext;
				searchstring = RegExp.rightContext;
				i++;
			}
			splits[i] = searchstring;
			
			IG.parseLinkFusker(splits[0],0);
			
			IG.gLog(IG.tempArray.length+" new links added");
			IG.writeLinkList();
		} 
		// add a single image link to the list
		else if(/\w+:\/\/[^\/]+\/.+/.test(url)) {
			//console.log("Add single url");
			IG.makeFilePath(url,"","gimpLinks",IG.gimpLinks.length,4);
			IG.gLog("1 new link added");
			IG.writeLinkList();
		} else IG.gLog("That command made no sense");
		/* }catch(e) {
		 console.log(e);
		 IG.gLog("You just accidentally the whole thing");
		} */
	}
} 

IG.getLocalStorage();



chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		//console.log(request.add);
		var url = request.add;

		if(IG.isCreated == false) { IG.init(); }
		
		IG.getCMD(url);
	}
);