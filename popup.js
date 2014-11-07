
function addUrl(str) {
    console.log(str)
    $val = str !== void[] ? str : $(".toadd").val();
    if(chrome.tabs) {
        chrome.tabs.getSelected(null, function(tab) {
            chrome.extension.getBackgroundPage().console.log(tab.id,$val);
            chrome.tabs.sendRequest(tab.id, {add:$val}, function(response){});
        });
    }
}

function insertSyntax(str,send) {
    console.log(str)
    $(".toadd").focus();
    $(".toadd").val(str);
    if(send) addUrl(str);
}

function getKeep() {
    var r=confirm("To keep items press OK, to remove press Cancel");
    if (r==true) { var kord = "keep "; }
    else { var kord = "rem "; }
    insertSyntax(kord);
}
function getKeept() {
    var r=confirm("To keep items press OK, to remove press Cancel");
    if (r==true) { var kord = "keep";} else { var kord = "rem"; }
    var r=confirm("To affect items at the top of the list press OK,\nto affect items at the bottom of the list press Cancel");
    if (r==true) { var hort = "h "; } else { var hort = "t "; }
    insertSyntax(kord+hort);
}


$(function(){
    $(".toadd").focus();

    $(".form-main").on("submit",function(e){
        e.preventDefault();
        addUrl();
    });

    funcs = [
        function(){ insertSyntax('dump',1) },
        function(){ insertSyntax('preload all',1) },
        function(){ getKeep() },
        function(){ getKeept() },
        function(){ insertSyntax('nodupes',1) },
        function(){ insertSyntax('{} []') },
        function(){ insertSyntax('make all nodupes',1) },
        function(){ insertSyntax('clear',1) },
        function(){ insertSyntax('show',1) },
        function(){ insertSyntax('hide',1) }
    ];

    for(var i=0,l=funcs.length; i<l; i++){
        $(".nav-list>div").eq(i)
            .on("click",funcs[i])
            .on("mouseenter",function(){
                $(".description>span").html($(this).data("title"));
            })
            .on("mouseleave",function(){
                $(".description>span").empty();
            });
    }
    
});