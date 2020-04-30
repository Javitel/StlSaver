//download.js v4.2, by dandavis; 2008-2017. [MIT] see http://danml.com/download.html for tests/usage
(function(r,l){"function"==typeof define&&define.amd?define([],l):"object"==typeof exports?module.exports=l():r.download=l()})(this,function(){return function l(a,e,k){function q(a){var h=a.split(/[:;,]/);a=h[1];var h=("base64"==h[2]?atob:decodeURIComponent)(h.pop()),d=h.length,b=0,c=new Uint8Array(d);for(b;b<d;++b)c[b]=h.charCodeAt(b);return new f([c],{type:a})}function m(a,b){if("download"in d)return d.href=a,d.setAttribute("download",n),d.className="download-js-link",d.innerHTML="downloading...",d.style.display="none",document.body.appendChild(d),setTimeout(function(){d.click(),document.body.removeChild(d),!0===b&&setTimeout(function(){g.URL.revokeObjectURL(d.href)},250)},66),!0;if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent))return/^data:/.test(a)&&(a="data:"+a.replace(/^data:([\w\/\-\+]+)/,"application/octet-stream")),!window.open(a)&&confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")&&(location.href=a),!0;var c=document.createElement("iframe");document.body.appendChild(c),!b&&/^data:/.test(a)&&(a="data:"+a.replace(/^data:([\w\/\-\+]+)/,"application/octet-stream")),c.src=a,setTimeout(function(){document.body.removeChild(c)},333)}var g=window,b=k||"application/octet-stream",c=!e&&!k&&a,d=document.createElement("a");k=function(a){return String(a)};var f=g.Blob||g.MozBlob||g.WebKitBlob||k,n=e||"download",f=f.call?f.bind(g):Blob;"true"===String(this)&&(a=[a,b],b=a[0],a=a[1]);if(c&&2048>c.length&&(n=c.split("/").pop().split("?")[0],d.href=c,-1!==d.href.indexOf(c))){var p=new XMLHttpRequest;return p.open("GET",c,!0),p.responseType="blob",p.onload=function(a){l(a.target.response,n,"application/octet-stream")},setTimeout(function(){p.send()},0),p}if(/^data:([\w+-]+\/[\w+.-]+)?[,;]/.test(a)){if(!(2096103.424<a.length&&f!==k))return navigator.msSaveBlob?navigator.msSaveBlob(q(a),n):m(a);a=q(a),b=a.type||"application/octet-stream"}else if(/([\x80-\xff])/.test(a)){e=0;var c=new Uint8Array(a.length),t=c.length;for(e;e<t;++e)c[e]=a.charCodeAt(e);a=new f([c],{type:b})}a=a instanceof f?a:new f([a],{type:b});if(navigator.msSaveBlob)return navigator.msSaveBlob(a,n);if(g.URL)m(g.URL.createObjectURL(a),!0);else{if("string"==typeof a||a.constructor===k)try{return m("data:"+b+";base64,"+g.btoa(a))}catch(h){return m("data:"+b+","+encodeURIComponent(a))}b=new FileReader,b.onload=function(a){m(this.result)},b.readAsDataURL(a)}return!0}});


function init() {
    (function(){

    RK.STLExporter = function () {};

    RK.STLExporter.prototype = {

        constructor: THREE.STLExporter,

        parse: ( function () {

 var vertex = new Vector3();
        var i, l = [];
        var nbVertex = 0;
        var geometry = mesh.geometry;

        var mrot = new Matrix4().makeRotationX(90 * Math.PI / 180);

        var msca = new Matrix4().makeScale(10, 10, 10);
        if (geometry.isBufferGeometry) {
            var newGeometry = geometry.clone(geometry);
            var vertices = geometry.getAttribute('position');

            // vertices
            if (vertices !== undefined) {
                for (i = 0, l = vertices.count; i < l; i++ , nbVertex++) {
                    vertex.x = vertices.getX(i);
                    vertex.y = vertices.getY(i);
                    vertex.z = vertices.getZ(i);

                    if (geometry.skinIndexNames == undefined
                      || geometry.skinIndexNames == 0) {
                        vertex.applyMatrix4(mesh.matrixWorld).applyMatrix4(mrot).applyMatrix4(msca);
                        newGeometry.attributes.position.setXYZ(i, vertex.x, vertex.y, vertex.z);
                    } else {
                        var finalVector = new Vector4();
                        if (geometry.morphTargetInfluences !== undefined) {

                            var morphVector = new Vector4(vertex.x, vertex.y, vertex.z);
                            var tempMorph = new Vector4();

                            for (var mt = 0; mt < geometry.morphAttributes.position.length; mt++) {
                                if (geometry.morphTargetInfluences[mt] == 0) continue;
                                if (geometry.morphTargetDictionary.hide == mt) continue;

                                var morph = new Vector4(
                                    geometry.morphAttributes.position[mt].getX(i),
                                    geometry.morphAttributes.position[mt].getY(i),
                                    geometry.morphAttributes.position[mt].getZ(i));

                                tempMorph.addScaledVector(morph.sub(morphVector), geometry.morphTargetInfluences[mt]);
                            }
                            morphVector.add(tempMorph);
                        }

                        for (var si = 0; si < geometry.skinIndexNames.length; si++) {

                            var skinIndices = geometry.getAttribute([geometry.skinIndexNames[si]])
                            var weights = geometry.getAttribute([geometry.skinWeightNames[si]])

                            var skinIndex = [];
                            skinIndex[0] = skinIndices.getX(i);
                            skinIndex[1] = skinIndices.getY(i);
                            skinIndex[2] = skinIndices.getZ(i);
                            skinIndex[3] = skinIndices.getW(i);

                            var skinWeight = [];
                            skinWeight[0] = weights.getX(i);
                            skinWeight[1] = weights.getY(i);
                            skinWeight[2] = weights.getZ(i);
                            skinWeight[3] = weights.getW(i);

                            var inverses = [];
                            inverses[0] = mesh.skeleton.boneInverses[skinIndex[0]];
                            inverses[1] = mesh.skeleton.boneInverses[skinIndex[1]];
                            inverses[2] = mesh.skeleton.boneInverses[skinIndex[2]];
                            inverses[3] = mesh.skeleton.boneInverses[skinIndex[3]];

                            var skinMatrices = [];
                            skinMatrices[0] = mesh.skeleton.bones[skinIndex[0]].matrixWorld;
                            skinMatrices[1] = mesh.skeleton.bones[skinIndex[1]].matrixWorld;
                            skinMatrices[2] = mesh.skeleton.bones[skinIndex[2]].matrixWorld;
                            skinMatrices[3] = mesh.skeleton.bones[skinIndex[3]].matrixWorld;

                            for (var k = 0; k < 4; k++) {
                                if (geometry.morphTargetInfluences !== undefined) {
                                    var tempVector = new Vector4(morphVector.x, morphVector.y, morphVector.z);
                                } else {
                                    var tempVector = new Vector4(vertex.x, vertex.y, vertex.z);
                                }

                                tempVector.multiplyScalar(skinWeight[k]);
                                //the inverse takes the vector into local bone space
                                //which is then transformed to the appropriate world space
                                tempVector.applyMatrix4(inverses[k])
                                    .applyMatrix4(skinMatrices[k])
                                    .applyMatrix4(mrot).applyMatrix4(msca);
                                finalVector.add(tempVector);
                            }
                        }
                        newGeometry.attributes.position.setXYZ(i, finalVector.x, finalVector.y, finalVector.z);
                    }
                }
            }
        } else {
            console.warn( 'Geometry type unsupported', geometry );
        }

        return newGeometry;
    
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = RK.STLExporter
    } 
    else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
        define([], function() {
            return saveAs;
        });
    }


	var characterArea_hook = ".headerMenu-container";
	var menu_style = { "margin-left": "20px", "width": "80px" };
	
    var character_area, stl_base, sjson, ljson, labeljson;
    
	stl_base = 			jQuery("<a class='jss7 jss9 jss10' />").css(menu_style).text("Export STL");
	sjson = 			jQuery("<a class='jss7 jss9 jss10' />").css(menu_style).text("Export JSON");
	ljson  = 			jQuery("<input/>").attr({"type": "file", "id": "ljson"}).css({"display":"none"}).text("Import (JSON)");
	labeljson  = 		jQuery("<label class='jss7 jss9 jss10' />").attr({"for": "ljson"}).css(menu_style).text("Import (JSON)");
	
    character_area = 	jQuery(".headerMenu-container").first();
    character_area.css({"display": "flex", "justify-content": "center", "align-content": "center"});
    
    character_area.append(stl_base);
    character_area.append(sjson);
    character_area.append(ljson);
    character_area.append(labeljson);

    stl_base.click(function(e) {
        e.preventDefault(); 
        var exporter = new RK.STLExporter();    
        var stlString = exporter.parse([CK.character])
        var name = get_name();
        download(stlString, name + '.stl', 'application/sla');
    });


    sjson.click(function(e) {
        e.preventDefault();
        var char_json = JSON.stringify(CK.data);
        var name = get_name();
        download(char_json, name + ".json", "text/plain");
    });

    ljson.on('change', function(e) {
        e.preventDefault();
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(e) {
                e.preventDefault();
                CK.change(JSON.parse(e.target.result));
            };
        })(file);
        reader.readAsText(file);
    });
})()};

function inject_script(url, callback) {
  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.src = url; 
  script.onload = function(e) { 
      callback() };
  head.appendChild(script);
}

inject_script("//code.jquery.com/jquery-3.3.1.min.js", function () {
    inject_script("//cdnjs.cloudflare.com/ajax/libs/three.js/100/three.js", function () { init() })
});

function get_name() {
  var timestamp = new Date().getUTCMilliseconds();
  var uqID = timestamp.toString(36);
  var name = "Character " + uqID; 
  try {
    var getName = CK.character.data.meta.character_name
    name = getName === "" ? name : getName;
  } catch (e) {
    if (e instanceof ReferenceError) {
        console.log("Name of character data location has changed");
        console.log(e);
    } else {
        console.log("Other Error");
        console.log(e);
    }
  }
  return name;
}
