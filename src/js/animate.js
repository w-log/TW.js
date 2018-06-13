    var util = require('./global');

    (function(root, factory) {
        'use strict';
        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module.
            define([], factory);
        } else if (typeof exports === 'object') {
            // Node. Does not work with strict CommonJS, but
            // only CommonJS-like enviroments that support module.exports,
            // like Node.
            module.exports = factory();
        }
    }(this, function() {
        // easing 함수 주소 : http://goo.gl/5HLl8
        var easing = {
            linear: function(t, b, c, d) {
                t /= d;
                return b + c * (t);
            },
            easeOut: function(t, b, c, d) {
                var ts = (t /= d) * t;
                var tc = ts * t;
                return b + c * (0.9 * tc * ts + -4.35 * ts * ts + 8.6 * tc + -8.7 * ts + 4.55 * t);
            }
        };

        var requestAniFrame = (function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
        })();

        // scroll move funtion
        function move(y) {
            document.body.scrollTop = y;
            document.documentElement.scrollTop = y;
            if (document.body.parentNode) {
                document.body.parentNode.scrollTop = y
            }
        }


        // 현재 scrollTop 을 반환하는 함수
        function position() {
            return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop;
        }

        function getPropertyValue(element_css, propertyName) {
            if (propertyName === "transform") {
                return parseInt(element_css.getCss(propertyName).split(",")[4]);
            } else {
                return parseInt(element_css.getCss(propertyName));
            }
        }

        function cssAnimation(element_css, propertyName, value, callback, duration, easingCommand) {


            var start = getPropertyValue(element_css, propertyName),
                currentTime = 0,
                change = value - start,
                cycle = 1000 / 60;

            var animate = function() {
                currentTime += cycle;
                var val = easing[easingCommand] ? easing[easingCommand](currentTime, start, change, duration) : easing["easeOut"](currentTime, start, change, duration);
                var cssText = propertyName === "opacity" ? val : "translateX(" + val + "px)";
                element_css.setCss(propertyName, cssText);
                if (currentTime <= duration) {
                    requestAniFrame(animate);
                } else {
                    if (typeof callback === "function") { callback(); }
                }
            };
            animate();
        }

        // scrollAnimation 설정함수
        function scrollAnimation(to, callback, duration, easingCommand) {
            //변수 초기화
            var start = position(),
                change = to - start,
                currentTime = 0,
                increment = 1000 / 60;
            duration = (typeof(duration) === 'undefined') ? 500 : duration; //anmation time
            //animate 진행 requireAnimation을 통한 호출로 인한 60프레임이 보장됨
            var animateScroll = function() {
                // 애니메이션 시간누적 1프레임당 1000ms에서 60으로 나눈값이 누적됨 ( 1000 / 60 === 1초당 60프레임 )
                currentTime += increment;
                // easing 함수 호출
                var val = easingCommand ? easing[easingCommand](currentTime, start, change, duration) :
                    easing["easeOut"](currentTime, start, change, duration);
                // move 함수 호출
                move(val);
                // 현재 애니메이션 시간이 druation을 초과했는지 확인 현재시간이 < 애니메이션 시간보다 작으면 애니메이션 진행 초과시에는 콜백함수 호출
                if (currentTime <= duration) {
                    requestAniFrame(animateScroll);
                } else {
                    if (callback && typeof(callback) === 'function') {
                        callback();
                    }
                }
            };
            animateScroll();
        }
        
        return {
            scrollAnimate: scrollAnimation,
            cssAnimate: cssAnimation
        };
    }));