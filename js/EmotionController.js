;

var EmotionController = (function () {

    var EmotionController = function (iframeSrc, targetEl, toggleBtn, contentsArea) {

        if (iframeSrc == null || iframeSrc.length == 0) {
            alert("아이프레임 주소가 입력되지 않았습니다.\n 모바일 주소: /emoticon/m/index.html \n PC 주소 : /emoticon/index.html");
            return;
        }

        if (targetEl == null || targetEl.nodeType != 1) {
            alert("iframe을 붙일 엘리먼트가 지정되지 않았습니다. \n document.getElementById를 이용해 지정해주세요.");
            return;
        }
        
        if (toggleBtn == null || toggleBtn.nodeType != 1) {
            alert("이모티콘 보기/접기 버튼 엘리먼트가 지정되지 않았습니다. \n document.getElementById를 이용해 지정해주세요.");
            return;
        }

        if (contentsArea == null) {
            alert("이모티콘을 붙일 영역이 지정되지 않았습니다. document.getElementById를 이용해 지정해주세요.");
            return;
        }

        this.iframeSrc = iframeSrc;

        EmotionController.prototype.toggleBtn = toggleBtn;
        EmotionController.prototype.targetEl = targetEl;
        EmotionController.prototype.contentsArea = contentsArea;
        EmotionController.prototype.targetRange = null;
    }

    EmotionController.prototype.createFrame = function () {
       
        var emoticonObj = null;
        var targetEl = this.targetEl;
        var iframeSrc = this.iframeSrc;
        var emotionIframe = document.createElement('iframe');

        emotionIframe.src = iframeSrc;

        emotionIframe.style.cssText = "width:100%; height:100%;";
        
        targetEl.style.display = "none";

        targetEl.appendChild(emotionIframe);

        toggleEmotion(this);

        setContentsDiv(EmotionController.prototype.contentsArea);

    }

    EmotionController.prototype.placeCaretAtEnd = function (el) {
        el.focus();

        if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }

        saveRange(EmotionController.prototype.contentsArea);
    }


    var setContentsDiv = function (contentsDiv) {

        contentsDiv.addEventListener("focus", function(){saveRange(event.target)});
        contentsDiv.addEventListener("click", function(){saveRange(event.target)});
        contentsDiv.addEventListener("keyup", function(){saveRange(event.target)});
        contentsDiv.setAttribute("contenteditable", true);
    }

    function saveRange(that) {

        if (that.nodeName === "DIV" && that.id === "contentsArea") {
            var sel = window.getSelection();
            if (sel.rangeCount > 0) {
                EmotionController.prototype.targetRange = sel.getRangeAt(0);
            } else {
                setTimeout(function () {
                    //saveRange(this);
                    saveRange(that);
                }, 100)
            }

        }

    }

    var toggleEmotion = function (that) {

        var toggleBtn = that.toggleBtn;
        var targetEl = that.targetEl;
        
        toggleBtn.addEventListener("click", function () {

            var displayState = targetEl.style.display;
            var parentEl = this.parentElement;
            if (displayState === "none") {
                targetEl.style.display = "block";
                parentEl.classList.add("active");
            } else {
                targetEl.style.display = "none";
                parentEl.classList.remove("active");
            }
        })
    }

    EmotionController.prototype.attachEmoticon = function (iframeSrc, width, height) {

        var cnt = 0;
        var maxWaitCnt = 100;
        var insertIframe = document.createElement('iframe');
        var contentsArea = EmotionController.prototype.contentsArea;
        var targetRange = null;

        setTimeout(function timmer() {

            targetRange = EmotionController.prototype.targetRange;

            if (targetRange == null) {

                EmotionController.prototype.placeCaretAtEnd(contentsArea);

                if (cnt >= maxWaitCnt) {
                    alert("이모티콘을 첨부하는 동안 오류가 발생했습니다. 관리자에게 문의하세요.");
                    return;
                }

                setTimeout(function () {
                    timmer();
                    cnt++;
                }, 100)

            } else {
                insertIframe.src = iframeSrc;
                insertIframe.scrolling = "no";
                insertIframe.frameborder = 0;
                insertIframe.style.width = width;
                insertIframe.style.height = height;

                targetRange.insertNode(insertIframe);
                targetRange.setStartAfter(insertIframe);

            }
        }, 100);
    }


    return EmotionController;

})();

