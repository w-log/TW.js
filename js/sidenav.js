(function() {
    "use strict";


    function triggerCheck(e) {

        var sideNav_trigger = getSidenavtrigger(e);



        if (sideNav_trigger !== null) {
            var trigger_type = sideNav_trigger.getAttribute("data-trigger") || "open";
            if ("ontouchstart" in window && sideNav_trigger.getAttribute("id") === "drag-target") {
                return false;
            } else {
                sideNav[trigger_type](e, sideNav_trigger);
            }

        }
    }

    function swipe(e, element) {
        var sidenav_element = getSidenavElement(e, element);
        var shadowELement = createShadow(sidenav_element);

        var sideEle_css = twCom.fn.cssObject(sidenav_element);
        var width = sideEle_css.getCss("width").split("px")[0];
        width = Number(width);
        var x = (e.center.x - width);


        if (x > 0) {
            x = 0;
        }

        if (x < -width) {
            x = -width;
        }
        var opacity = (10000 / width);
        opacity = opacity / (opacity * width);
        opacity = opacity * (width + x);

        shadowELement.setAttribute("style", "opacity :" + opacity + ";");

        var cssObject = {};
        var translateX = "translateX(" + x + "px)";

        cssObject['width']             = width + "px";
        cssObject['-webkit-transform'] = translateX;
        cssObject['-moz-transform']    = translateX;
        cssObject['-ms-transform']     = translateX;
        cssObject['-o-transform']      = translateX;
        cssObject.transform            = translateX;
        sidenav_element.setAttribute("style", twCom.fn.convertStyle(cssObject));
    }

    function swipeEnd(e, element) {
        var sidenav_element = getSidenavElement(e, element);
        var sideEle_css = twCom.fn.cssObject(sidenav_element);
        var width = sideEle_css.getCss("width").split("px")[0];
        var tx = sideEle_css.getCss("transform").split(",")[4];
        var currentX = Number(width) + Number(tx);


        if (currentX >= (width / 2)) {
            sideNav.open(e, element);
        } else {
            sideNav.close(e, element);
        }
    }

    function tap(e, element) {
        var sidenav_element = getSidenavElement(e, element);
        var sideEle_css = twCom.fn.cssObject(sidenav_element);

        var shadowElement = document.getElementById("shadow-area");
        if (shadowElement === null) {
            sideNav.open(e, element);
        } else {
            sideNav.close(e, element);
        }
    }

    function getSidenavtrigger(e) {

        var element = e.target || e.srcElement;
        var target = null;
        while (element.parentElement !== null) {
            if (element.getAttribute("data-sidenav")) {
                target = element;
                break;
            }
            element = element.parentElement;
        }

        return target;
    }

    function getSidenavElement(e, element) {
        var sidenav_id;
        if (typeof e === "object" && typeof element === "object") {
            sidenav_id = element.getAttribute("data-sidenav");
            return document.getElementById(sidenav_id);
        } else {
            sidenav_id = e || element;
            return document.getElementById(sidenav_id);
        }
    }

    function createShadow(sidenavElement) {
        var shadow_bool = Boolean(sidenavElement.getAttribute("shadow")) || true;

        if (!shadow_bool) {
            return false;
        }
        var element = document.getElementById("shadow-area");
        if (element === null) {
            var shadow_ele = document.createElement("div");
            shadow_ele.setAttribute("id", "shadow-area");
            shadow_ele.setAttribute("data-sidenav", sidenavElement.getAttribute("id"));
            shadow_ele.setAttribute("data-trigger", "close");

            return document.body.appendChild(shadow_ele);
        } else {
            return element;
        }
    }

    function getShadowElement(element) {
        if (element.getAttribute("id") === "shadow-area") {
            return element;
        } else {
            return document.getElementById("shadow-area");
        }
    }

    function createdragTarget(element) {
        if (document.getElementById("drag-target") === null && element !== null) {
            var dragTarget = document.createElement("div");
            dragTarget.setAttribute("id", "drag-target");
            dragTarget.setAttribute("data-sidenav", element.getAttribute("id"));
            dragTarget.setAttribute("data-trigger", "close");
            dragEvent(dragTarget);
            return document.body.appendChild(dragTarget);
        } else {
            return document.getElementById("drag-target");
        }
    }

    function dragEvent(drag_element) {
        if (!drag_element) { return false; }
            var mc = new Hammer(drag_element);

            mc.on("panleft panright panend pancancel tap", function(e) {
                if (e.eventType === 8 || e.pointerType !== 'touch') {
                    return false;
                }

                if (e.type === "panright" || e.type === "panleft") {
                    swipe(e, drag_element);
                } else if (e.type === "tap") {
                    tap(e, drag_element);
                } else {
                    swipeEnd(e, drag_element);
                }
            });
    }
    var sideNav = {
        duration: 300,
        open: function(e, element) {
            var sidenavElement = getSidenavElement(e, element);

            if (sidenavElement === null) {
              return false;
            }

            var cssObject = {},
            duration = sideNav.duration,
            shadowELement = createShadow(sidenavElement),
            dragTarget = createdragTarget(sidenavElement),
            sidenav_css = twCom.fn.cssObject(sidenavElement),
            shadow_css = twCom.fn.cssObject(shadowELement);


            //drag target CSS 변경
            var dragTarget_css = twCom.fn.cssObject(dragTarget);
            cssObject = {
              right: 0,
              width: "90%",
            };

            dragTarget_css.cssEach(cssObject);
            document.body.style.overflow = "hidden";
            twCom.fn.cssAnimate(shadow_css, "opacity" , 1, undefined, duration, "easeOut");
            twCom.fn.cssAnimate(sidenav_css, "transform" , 0 , undefined, duration, "easeOut");
        },
        close: function(e, element) {

            var shadow_element = getShadowElement(element);

            if (shadow_element === null) {
                return false;
            }

            var sidenav_element = getSidenavElement(e, shadow_element);
            var sidenav_css = twCom.fn.cssObject(sidenav_element),
                shadow_css = twCom.fn.cssObject(shadow_element);
            var cssObject = {}, duration = sideNav.duration, unitExp = new RegExp("px|rem|em");


            //drag target CSS 변경
            var dragTarget = document.getElementById("drag-target");
            var dragTarget_css = twCom.fn.cssObject(dragTarget);
            cssObject = {
                right: "",
                width: "",
            };

            dragTarget_css.cssEach(cssObject);
            document.body.style.overflow = "";
            var x = parseInt("-" + sidenav_css.getCss("width").replace(unitExp, ""));
            twCom.fn.cssAnimate(sidenav_css, "transform" , x , function(){
              sidenav_css.setCss("transform", "");
            }, duration, "easeOut");
            twCom.fn.cssAnimate(shadow_css, "opacity" , 0, function(){
                try {
                   shadow_element.parentElement.removeChild(shadow_element);
                 } catch (exception) {
                     return false;
                 }
            }, duration, "easeOut");
        }
    };

    twCom.fn.setDrag = createdragTarget;
    window.addEventListener("DOMContentLoaded", function(e) {
        if ('ontouchstart' in window) {
            document.body.addEventListener('touchend', triggerCheck, false);
        } else {
            document.body.addEventListener('click', triggerCheck, false);
        }
        twCom.fn.setDrag(document.getElementById("myside-nav"));
    });
})();
