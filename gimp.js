var IG = {

	isCreated : false,  // gimpCSS has been instantiated
	isShowing : false,	// ImageGimp panel is showing
	imShowing : false,	// Image is showing inside panel
	isLoading : false,	// Image is currently loading
	isFullSize : false,	// Images should be set to full size when opening
	
	localStorage : {},
	LSarray : ["addDate"],
	
	widths : [
		275,	// width of the side panel
		10,		// general padding width
		26,		// length of link strings
		12,		// font-size
		0		// Y-offset for scroll placement
	],

	// various arrays for use throughout ImageGimp
	gimpLinks : [],
	imageLinks : [],
	videoLinks : [],
	matches : [],
	tempArray : [],
	ratios : [],
		
	// lowercase and uppercase alphabets from 
	ll : "abcdefghijklmnopqrstuvwxyz",
	lu : "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	
	currentImage : 0,
	I : {		// current image object
		id : false, // id in the imagelinks list
		iw : 0, // current image width
		ih : 0, // current image height
	},
	
	base64Im : {
		loading			: chrome.extension.getURL("images/loading.gif"),
		failed			: chrome.extension.getURL("images/failed.png"),
		arrowleft		: chrome.extension.getURL("images/arrowleft.png"),
		arrowright	: chrome.extension.getURL("images/arrowright.png"),
		arrowup			: chrome.extension.getURL("images/arrowup.png"),
		arrowdown		: chrome.extension.getURL("images/arrowdown.png"),
		loading64		: "data:image/gif;base64,R0lGODlhIgAiAMwCAD04OVRPUKGgoDgxM4OBgjMtLkxHSUA7PGtoaC8oKnx6eoKAgHVyc1tXWFFMTY2MjEQ/QJSTlEdCQ2JeX5ybmzw2N2ZjZG9sbQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAUPABgAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAIgAiAAAF/yAmjmRpnmhKDoJwqPAIFWTQBiUdk5MQ1bcVQLfDNFqNkU2AExUAgEFxRGnplk3MADodGVoMEdZZGXZHhBYAM8ZApTGDoQRoPdjBp5lUIIoABAQMLyMILRADAQEDCW98WwAJfAiBBAhwBQRzJQmMIp1QUScGCpUBfimQUah8DQQLCxYxqqwnA5SEKo2eU2s7kikFA8PEA7UofQkFystiis+KvjEFZaFQFc7Qitg7etZcGMLFw8cmyufLzSnAMexFT+Uj1PGPjjCq7uaqvLr7td7GRgTMwUtYKFYH+UBJt6yRKHmhTCRTKEoPjS0VUPXZAUmSxT8Pz3wMBwXYk4xntB+AIxlJ4Mp3AFA6KQlxD0w4M22qpDeNZsoYPn8KRRECACH5BAUPABgALAEAAgAZABAAAAV0ICaOIkBihpiSwTk6BEKuqxgJj4sSRE2PAYEgosMwCIrRTyQUDIoHXkNFxSCEhKLIwqumBk0SwHTiyX4EYUtUCAQczxfPZEgdwjN3oIaxHFwGAn8nAHoBZFqJEHoSiY4oAXGPWgWTlpZjFWOblZebnwCdliEAIfkEBQ8AGAAsAwABAB0ADgAABYEgJo7kqChlqopFeRDEURorCQT0+MYkytSiWwCgW/BEORQQ4wgEdISFTBRZkgZOiOhgnDZECKtI4txGpyLKqtAqOWlcXhiTGzF+AMDA5Wwd0BgPJBMChQYDeXokEnslEFVIhZIsiQBtSwMRkgJzIwWJjUCbBKEliGIGAhGAYjV1JCEAIfkEBQ8AGAAsCAABABkAEgAABX4gJo5iEJBoqg7mgB4qVgDuyAa1OBGNOgMFW2t0IBAmsQEAIMSNEARFTLQMYm41w4JwmiqZ1yFGQWBMR0sXFhMwwkgTJOknGtSMCFKAIoKgciQAeX0PI4VnKlIiFD2IKQRPjjESY5JnfpZeJpsmb5YBAqGioZlso6OlB5ybByEAIfkEBQ8AGAAsEAABABAAGQAABXAgAGBkaZriiQ0qlppSAKkvOQSBRI+lgbc1AO4A5GFwjpaLd8CxTI6kCWeAMQgEI6ZQJQEQhAUBocRMsARGt2URKwJlL2ESR9VPhrx+jb/3/D17eUpEfgECBE9xAowCZHEHjYxwcYeND3cEjX4DaRghACH5BAUPABgALBMAAwAOABwAAAV7ICZiA1CMKAoAQ5qWgIsW6ymLa3tjdJyuoxxq4AgEbKRRwWAMGGSSpsOXihoPu0JAslN2UYewGJs6EM5ogqJ8Xrjd6/I4/L09Ed/IqNF9jCJPIwECZAYUIwwiBwICeiN4KRGMASkIEyMDjAJfBIyQO5o6N4MCiV2Mly4hACH5BAUPABgALA8ACAASABkAAAV2ICaOJFkUZToWAwCoaesO8CgDA1pjt76LuJ9QOCgaabVBYMlcJpvN3dE4rB4IgSoGQSAoDFVuF3GAGSKjA6NLaIiuhLJIQQoouqKAQJClY8B1Dnl7WSNoMHp8IggibiqJhRgUO5AjgBOPhCQPGJF1mkMDe3JCIQAh+QQFDwAYACwIABAAGQAQAAAFbyAmjmQpAmiKmiypqm0sz3QtDsFht0bgAztTz2cYmAaCgOmAGA0cvgCk9BAIDBhEE0MgTEiHKNgqwGDNmElXBwaOyLrzWUHYtgJWgkguCnTPLGRGaIQYDAQKLQhWdnwiB10OLBNWJI4iCAQSNpczIQAh+QQFDwAYACwDABMAHAAOAAAFeSAmjsdonmg6EEKQokDxIkItvOYA7PJo2DUDLrcDDEQP4GQUEZ4GTpGOZyNURgwRBBNwcQMSU6HIeJRQD8yBQChJukdx75Qmsc/d6NCJEK0XZwddAEMiFCcHC20jDl2FDSKQfncjA4NDLhEmiYs+AXGFm5ShoQoKpCEAIfkEBQ8AGAAsAQAPABkAEgAABXfgEYxkcGBoqq6Y4L4uws4pDMv0LJbjmf/A4EpmEM4aFFTSmII8Ug8IE8VIUQKpi281yOFQDQIBgDn4AICualJdiWWDUXeADiLEqHhAjVbTDmJYGHpqBWgFOQwECimEjXUzBmJFeXIqhzMSBBcqjo+IQp5TKiM0IQAh+QQFDwAYACwCAAgAEAAZAAAFbiCGIFhpnqYhrAHqYmt8vCcSCwR9PrduHizfyUAzGI9E4amhNDFfyGNzegooZj4Dg0Bg6AAILgEBoDUIi64kNUBxFS2TJBAoYAp2x7MaSALKUHQmfy8DdFgYhC4OgoOAJwB0j4mTJYZJjlOKSn8hACH5BAkPABgALAAAAAAiACIAAAWQICaOZGmeaKquq8G+JyMIcC0iM2LXM72/gdnj9+oRS42GyXjEQEQU14gwkx4jU5Ig0BwpR7puLCs+Da3l0jN9aLsPaYyCQK8T0E3FYr+n45tvbnGDMAcBA4QYAA4BAQ6DBQaNAQYFcRCTDogim12TcCMFBwBiAGskAACdgwOpiSKplomtpIkFsa+3q6+8vYQhADs=",
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
		$("html").append("<style id='gimpCSS' type='text/css'>"+
		'#gimpNHTML { display:none; }\n'+
		
		'#gimpListBox { position:fixed; top:0px; left:0px; z-index:9999999; width: '+IG.widths[0]+'px; height:0px; background:#111111; overflow:hidden; font-family: verdana, arial; }\n'+
		'#gimpListBoxInner { position:relative; width: '+(IG.widths[0]-(IG.widths[1]*2))+'px; height:100%; background:#000000; margin:'+IG.widths[1]+'px; color:#ffffff; overflow:auto; font-size:'+IG.widths[3]+'px; }\n'+
		
		'.listAnchors { cursor:pointer; padding:1px; color:#ffffff; font:normal '+IG.widths[3]+'px/14px verdana, arial !important; text-align:left !important; }\n'+
		'.listAnchors:hover { background:#333333; }\n'+
		
		'#gimpImageBox { position:fixed; top:0px; left:'+IG.widths[0]+'px; z-index:9999998; width: '+(IG.widths[0]-(IG.widths[1]*2))+'px; height:100%; background:#000000; overflow:hidden; font-size:'+IG.widths[3]+'px; font-family: verdana, arial; }\n'+
		'#gimpImageBoxInner { position:relative; height:100%; width:100%; text-align:center; }\n'+
		'#gimpImageBoxImage { position:absolute; top:0px; right:0px; bottom:0px; left:0px; margin:auto; }\n'+
		'.gimpImageBoxImageF { position:absolute; top:0px; right:0px; margin:0px !important; }\n'+
		'#gimpImageBoxLoading { position:absolute; visibility:hidden; }\n'+
		'#gimpImageBoxTitle { position:absolute; bottom:20px; width:100%; text-align:center; height:14px; background-image:url('+IG.base64Im.background+'); padding:5px 0px 5px 0px; }\n'+
		'#gimpImageBoxTitleA { font:normal '+IG.widths[3]+'px/14px verdana, arial !important; color:white !important; text-decoration:none !important; }\n'+	
		
		'#gimpImageBoxArrowL { width:50px; height:100%; position:absolute; left:0px; }'+
		'#gimpImageBoxArrowR { width:50px; height:100%; position:absolute; right:0px; }'+
		'#gimpImageBoxArrowU { height:50px; width:100%; position:absolute; top:0px; }'+
		'#gimpImageBoxArrowL:hover .arrowInner { visibility:visible; }'+
		'#gimpImageBoxArrowR:hover .arrowInner { visibility:visible; }'+
		'#gimpImageBoxArrowU:hover .arrowInner { visibility:visible; }'+
		'.arrowBut { position:absolute; top:0px; right:0px; bottom:0px; left:0px; margin:auto; cursor:pointer; }'+
		'.arrowInner { visibility:hidden; width:100%; height:100%; background-image:url('+IG.base64Im.background+'); }'+
		"</style>");

		$("body").append(
			$("<div id='gimpNHTML' />").append(
				$("<div id='gimpListBox' />").append( 
					$("<div id='gimpListBoxInner' />") 
				),
				
				$("<div id='gimpImageBox' />").append(
					$("<div id='gimpImageBoxInner' />").append(
						$("<div id='gimpImageBoxArrowL' />")
							.click(function(){IG.setImagePrev();})
							.append($("<div class='arrowInner' />").append("<img class='arrowBut' src='"+IG.base64Im.arrowleft+"' />")),
							
						$("<div id='gimpImageBoxArrowR' />")
							.click(function(){IG.setImageNext();})
							.append($("<div class='arrowInner' />").append("<img class='arrowBut' src='"+IG.base64Im.arrowright+"' />")),
							
						$("<div id='gimpImageBoxArrowU' />")
							.click(function(){
								if($("#gimpImageBoxArrowU img").attr("src")==IG.base64Im.arrowup){
									IG.setImageUp();
								} else {
									IG.setImageDown();
								}
							})
							.append($("<div class='arrowInner' />").append("<img class='arrowBut' src='"+IG.base64Im.arrowup+"' />")),
							
						$("<div id='gimpImageBoxTitle' />")
					)
				)
			)
		);
	},
	
	showListBox : function() {
		IG.isShowing = true;
		IG.fitBox();
		$("#gimpNHTML").fadeIn("fast");		
	},
	
	hideListBox : function() {
		IG.isShowing = false;
		$("#gimpNHTML").fadeOut("fast");
	},

	writeLinkList : function() {
		if(IG.imageLinks.length===0) return;
		$("#gimpListBoxInner").html("");
		$.each(IG.imageLinks, function(k,v) {
			//console.log(v);
			$("#gimpListBoxInner").append(
				$("<div class='listAnchors' title='"+v.gl+"'>"+IG.getNameTruncated(v.gn)+"</div>")
				.click(function(){IG.popImage(k);})
				);
		}); 
	},
	
	makeLinkList : function() {
		//console.log(window.location);

		IG.imageLinks = [];
		IG.I.id = false;
		$("a").each(function(i){
			str = $(this).attr("href");
			if(str!=undefined && !str.match(/^(javascript:|mailto:)/)) { 
				title = $(this).text();
				IG.makeFileCheck(str,title,"imageLinks",IG.imageLinks.length); 
			}
		}); 
		$("img").each(function(i){
			str = $(this).attr("src");
			if(str!=undefined) { 
				IG.makeFilePath(str,false,"imageLinks",IG.imageLinks.length);				
			}
		}); 
		
		docLinks = $("html").html().match(
			RegExp('(\\(|"|\'|=)((\\w+:\/\/|)[^\\n\'?&=:">]+\\.(jpg|jpeg|jpe|gif|png|xpm|bmp|tif|tiff|art))("|\'|>|&|\\)|\\W)','ig')
		);
		var listlength=(docLinks==null)?0:docLinks.length;
		//console.log(docLinks);
		for (var i=0; i<listlength; i++) {
			filename=docLinks[i]=unescape(
				docLinks[i].replace(/^\(|\)$|\"|^\s*\'|\'\s*$|=|\?|>|&|\\$|^\s+|\s+$/g,'')
				// fix unicode colon and slash in urls
				.replace(/\\u00253A/gi,':').replace(/\\u00252F/gi,'/')
				);
			
			//console.log(filename);
			IG.makeFilePath(filename,false,"imageLinks",IG.imageLinks.length);	
		}
		//console.log(IG.imageLinks);
	},
	
	makeFileCheck : function(str,title,arr) {
		//console.log(arguments);
		var ext = str.match(/\.([^\.\/\\\?\)]+)$/);
		// if the link has what appears to be a file extension
		if(ext != null) {						
			var hit = IG.fileFormats[0].match(RegExp(","+ext[1]+",","i"));
			// if the extension matches the image extension list
			if(hit != null) {					
				IG.makeFilePath(str,title,arr,IG[arr].length);
			}
		}
	},
	
	// Update link at any position in array, including new
	makeFilePath : function(str,title,arr,pos) { 
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
			loaded : false,
			gl : str,					// Original Link
			gn : gn,					// File Name
			ge : ext,					// File extension
			gp : gp,					// File Path
			gi : title,					// Link title
			gt : gt,					// Date string
			gw : false,
			gh : false
		};
	},

	// load image and resize to fit the box
	popImage : function(num) {
		IG.I.id = num;
		$("#gimpImageBoxImage").remove();
		$("#gimpImageBoxInner").prepend($("<img id='gimpImageBoxImage' />").load(
			//function(){console.log("onload",$("#gimpImageBoxImage").width());}
			));
		
		IG.setImageTitle();
		if(IG.imageLinks[num].gt == "base64" || IG.localStorage.addDate == undefined || IG.localStorage.addDate == "false") {
			$("#gimpImageBoxImage").attr("src",IG.imageLinks[num].gl);
		} else {
			$("#gimpImageBoxImage").attr("src",IG.imageLinks[num].gl+"?"+IG.imageLinks[num].gt);
		}

		$.preload("#gimpImageBoxImage",{
			onRequest:function(data){ 
				//console.log('attempting ',data.image); 
				$("#gimpImageBoxImage").removeAttr("class");
				},
			onFinish:function(data){ 
				//console.log(data.loaded,'loaded successfully'); 
				IG.imageIsLoaded(); 
				if(IG.imageLinks[IG.I.id].gw===false) {
					//IG.imageLinks[IG.I.id].gw = $("#gimpImageBoxImage");
					//console.log("onfinish",$("#gimpImageBoxImage").width());
					}
				},
			onComplete:function(data) {
				//console.log("oncomplete",$("#gimpImageBoxImage").width());
				//console.log(num);
				},
			placeholder:IG.base64Im.loading,
			notFound:IG.base64Im.failed
			});
		
		IG.imShowing = true;
	},
	
	// set the title div to the url of the current image
	setImageTitle : function() {
		gt = IG.imageLinks[IG.I.id].gn+((IG.imageLinks[IG.I.id].gi==false)?"":" : "+IG.imageLinks[IG.I.id].gi);
		
		$("#gimpImageBoxTitle").html("<a href='"+IG.imageLinks[IG.I.id].gl+"' id='gimpImageBoxTitleA'>"+gt+"</a>");
		//console.log(IG.imageLinks[IG.I.id]);
	},
	
	// do this when image has loaded
	imageIsLoaded : function() {
		IG.imageLinks[IG.I.id].loaded = true;
		IG.fitImageInBox();
	},
	
	// fit the imagegimp box into the window
	fitBox : function() {
		$("#gimpListBox")
			.width(IG.widths[0])
			.height($(window).height());
		$("#gimpListBoxInner")
			.height($(window).height()-(IG.widths[1]*2));
		$("#gimpImageBox")
			.width($(document).width()-IG.widths[0])
			.height($(window).height());
		if(IG.imShowing == true) IG.fitImageInBox();
	},
	
	// fit the image inside the box
	fitImageInBox : function() {
		//console.log(IG.imageLinks[IG.I.id]);
		if(IG.isFullSize == true) { 
			w = ""; 
			h = ""; 
			$("#gimpImageBoxImage").attr("class","gimpImageBoxImageF");
		} else { 
			w = $("#gimpImageBox").width()-(IG.widths[1]*2); 
			h = $("#gimpImageBox").height()-(IG.widths[1]*2); 
			$("#gimpImageBoxImage").removeAttr("class");
		}
		$("#gimpImageBoxImage").css({ "max-height":h, "max-width":w });
	},
	
	// set the position of the image and title
	positionImageInner : function() {
		if(IG.isFullSize == false) {
			$("#gimpImageBoxImage").position({
				my:"center",
				at:"center",
				of:"#gimpImageBox"
			});
		} else {
			$iw = $("#gimpImageBoxImage").width();
			$ih = $("#gimpImageBoxImage").height();
			$bw = $("#gimpImageBox").width();
			$bh = $("#gimpImageBox").height();
			
			if($iw>$bw && $ih>$bh) { $("#gimpImageBoxImage").css({top:"0px",left:"0px"}); }
			else if($iw>$bw) { $("#gimpImageBoxImage").css({top:(($bh/2)-($ih/2))+"px",left:"0px"}); }
			else if($ih>$bh) { $("#gimpImageBoxImage").css({top:"0px",left:(($bw/2)-($iw/2))+"px"}); }
			else { $("#gimpImageBoxImage").position({ my:"center", at:"center", of:"#gimpImageBox" }); }
		}
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
		if(IG.I.id==IG.imageLinks.length-1 || IG.I.id===false) i = 0; else i = IG.I.id+1;
		//console.log(i);
		IG.popImage(i);
	},
	
	// set image to the previous image in list
	setImagePrev : function() {
		if(IG.I.id==0) i = IG.imageLinks.length-1; else i = IG.I.id-1;
		//console.log(i);
		IG.popImage(i);
	},
	
	// set image images to display at full size
	setImageUp : function() {
		IG.isFullSize = true;
		$("#gimpImageBoxArrowU img").attr("src",IG.base64Im.arrowdown);
		IG.fitImageInBox();
		//IG.positionImageInner();
		$("#gimpImageBox").css("overflow","auto");
	},
	
	// set images to display fit on the screen
	setImageDown : function() {
		IG.isFullSize = false;
		$("#gimpImageBoxArrowU img").attr("src",IG.base64Im.arrowup);
		IG.fitImageInBox();
		//IG.positionImageInner();
		$("#gimpImageBox").css("overflow","hidden");
	},
	
	// handle keypresses
	getKeypress : function(e) {
		//console.log(e.keyCode);
		switch(e.keyCode) {
			case 37: IG.setImagePrev(); break;
			case 38: IG.setImageUp(); break; 
			case 39: IG.setImageNext(); break;
			case 40: IG.setImageDown(); break;
		}
		if (e.stopPropagation) e.stopPropagation();
		e.cancelBubble = true;
		e.returnValue = false;
	},
	
	// handle window resize
	getResize : function() {
		IG.fitBox();
	},
	
	// clear the link list and array
	clearList : function() {
		IG.imageLinks = [];
		$("#gimpListBoxInner").text("");
	},
	
	// clear the image from view
	clearImage : function() {
		$("#gimpImageBox").html("").append( $("<div id='gimpImageBoxTitle' />") );
	},
	
	// upon image error, set image to the failed logo
	imerr : function() {
		IG.isLoading = false;
		$("#gimpImageBoxInner").attr(chrome.extension.getURL("images/failed2.gif"));
	},
	
	// fusker parser
	parseFusker : function(strip,num){
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
				IG.makeFilePath(newstrip,"","imageLinks",IG.imageLinks.length);
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
	}
} 

IG.getLocalStorage();

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		//console.log(request.add);
		var url = request.add;

		if(IG.isCreated == false) { IG.init(); }
		
		// show - show the image box
		if(url == "show") {
			if(IG.isShowing == false) {
				window.addEventListener("resize", IG.getResize, false);
				window.addEventListener("keydown", IG.getKeypress, false);
			}
			IG.showListBox();
			IG.writeLinkList();
			if(IG.I.id !== false) IG.popImage(IG.I.id);
		} 
		// hide - hide the image box
		else if(url == "hide") {
			IG.hideListBox();
			
			window.removeEventListener("resize", IG.getResize, false);
			window.removeEventListener("keydown", IG.getKeypress, false);
		} 
		// make - create list from the dom and show the box if not already showing
		else if(url == "make") {
			if(IG.isShowing == false) {
				window.addEventListener("resize", IG.getResize, false);
				window.addEventListener("keydown", IG.getKeypress, false);
				IG.showListBox();
			}
			
			IG.makeLinkList();
			IG.writeLinkList();
		} 
		// list - redraw the image list
		else if(url == "list") {
			IG.writeLinkList();
		} 
		// clear - clear image list and current image
		else if(url == "clear") {
			IG.clearList();
			IG.clearImage();
			IG.isLoading = false;
		} 
		// loadcancel - cancel loading image
		else if(url == "loadcancel") {
			IG.clearImage();
			IG.isLoading = false;
		} 
		// background regex - change background color of image box
		else if(/^background ?([^ ]+)/.exec(url)) {
			var c = RegExp.$1;
			if(IG.isCreated == true) {
				$("#gimpImageBox").css("background",c);
				//console.log(c);
			}
		} 
		// keep regex - keep phrase syntax
		else if(/^keep ?([^ ]+)$/.exec(url)) {
			regex=RegExp(RegExp.$1,'i');
			b=0;
			for(var a=0;a<IG.imageLinks.length;a++) {
				if(!regex.test(IG.imageLinks[a].gl)) { IG.imageLinks.splice(a,1); a--; b++; }
			}
			console.log(b+" images removed from list");
			IG.writeLinkList();
		}
		// del/rem regex - keep phrase syntax
		else if(/^(?:del|rem) ?([^ ]+)$/.exec(url)) {
			regex=RegExp(RegExp.$1,'i');
			b=0;
			for(var a=0;a<IG.imageLinks.length;a++) {
				if(regex.test(IG.imageLinks[a].gl)) { IG.imageLinks.splice(a,1); a--; b++; }
			}
			console.log(b+" images removed from list");
			IG.writeLinkList();
		}
		// keept/keeph N - keep number of images from head or tail syntax
		else if(/^keep(h|t) ?(\d+)$/.exec(url)) {
			if(RegExp.$1=='h') IG.imageLinks.splice(RegExp.$2,IG.imageLinks.length);
			else IG.imageLinks.splice(0,IG.imageLinks.length-RegExp.$2);
			IG.writeLinkList();
		}
		// remt/remh/delt/delh N - keep number of images from head or tail syntax
		else if(/^(?:del|rem)(h|t) ?(\d+)$/.exec(url)) {
			if(RegExp.$1=='h') IG.imageLinks.splice(0,RegExp.$2);
			else IG.imageLinks.splice(IG.imageLinks.length-RegExp.$2,RegExp.$2);
			IG.writeLinkList();
		}
		// nodupes - remove all duplicate images from the list
		else if(/^nodupes$/.exec(url)) {
			var temp=[IG.imageLinks[0]];
			var c;
			for(var a=0;a<IG.imageLinks.length;a++){
				c=0;
				for(var b=0;b<temp.length;b++){
					if(IG.imageLinks[a].gl==temp[b].gl) { c++; break; }
				}
				if(!c) temp.push(IG.imageLinks[a]);
			}
			if(IG.imageLinks.length!=temp.length) {
				console.log((IG.imageLinks.length-temp.length)+' duplicates removed');
				IG.imageLinks=temp;
				IG.writeLinkList();
			} else { console.log('No duplicates found'); }
		} 
		// /regex/replace/ - replace some text with something else
		else if(/^r\:(.+?)\; ?w\:(.*)\;$/.exec(url)) {
			toreplace=RegExp.$2;
			tomatch=RegExp.$1;
			var c = 0;
			for(var a=0;a<IG.imageLinks.length;a++) {
				var ol = IG.imageLinks[a].gl;
				var rep = ol.replace(RegExp(tomatch),toreplace);
				if(ol != rep) c++;
				IG.makeFilePath(rep,"","imageLinks",a);
			}
			console.log(c+" links affected");
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
			
			IG.parseFusker(splits[0],0);
			
			if(IG.tempArray.length>0){
				//console.log(IG.imageLinks);
				IG.writeLinkList();
			} else {
				//console.log('URL string contained invalid sequence!');
			}
		} 
		// add a single image link to the list
		else if(/\w+:\/\/[^\/]+\/.+/.test(url)) {
			//console.log("Add single url");
			IG.makeFilePath(url,"","imageLinks",IG.imageLinks.length);
			IG.writeLinkList();
		}
	}
);