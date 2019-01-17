;

var MobileEmoticon = (function () {
    
    var that = this;

    var MobileEmoticon = function (bodyEl) {
        MobileEmoticon.prototype.bodyEl = bodyEl;
        getEmotionData();
    }

    MobileEmoticon.prototype.emotionStore = null;
    MobileEmoticon.prototype.emotionUl = null;
    MobileEmoticon.prototype.emocticonInsertDiv = null;

    MobileEmoticon.prototype.init = function () {
        
        var maxCnt = 1000;
        var cnt = 0;
        var that = this;
  
        setTimeout(function timmer() {

            if (MobileEmoticon.prototype.emotionStore) {
                that.initLayout();
            } else {
                if (maxCnt < cnt) {
                    alert("이모티콘을 다운로드하는 중 오류가 발생했습니다.");
                } else {
                    setTimeout(function () {
                        cnt++;
                        timmer();
                    }, 100);
                }
            }
        },100);
    }

    MobileEmoticon.prototype.initLayout = function (emotionArr) {

        var bodyEl = MobileEmoticon.prototype.bodyEl;
        var emotiWrap = document.createElement("div");
        var imotiThumb = document.createElement("div");
        var emoticonMobile = document.createElement("div");
        var emocticonInsertDiv = document.createElement("div");
        var emotionUl = document.createElement("ul");

        emotiWrap.className = "emotiWrap";
        imotiThumb.className = "imotiThumb";
        emocticonInsertDiv.className = "emocticon-insert";
        emoticonMobile.className = "emoticon-mobile";

        emocticonInsertDiv.style.display = "none";

        emotiWrap.appendChild(imotiThumb);
        emotiWrap.appendChild(emoticonMobile);
        emotiWrap.appendChild(emocticonInsertDiv);
        emoticonMobile.appendChild(emotionUl);

        bodyEl.appendChild(emotiWrap);

        MobileEmoticon.prototype.emotionUl = emotionUl;
        MobileEmoticon.prototype.emocticonInsertDiv = emocticonInsertDiv;

        this.appendEmotionGroupIcons(emotiWrap, imotiThumb);
        this.appendEmotions();
    }

    MobileEmoticon.prototype.appendEmotionGroupIcons = function (emotiWrap, imotiThumb) {

        var emotionStore = MobileEmoticon.prototype.emotionStore;
        var imotiThumbUl = document.createElement("ul");
        var tempData = null;
        var tempEmotionli = null;
        var tempImg = null;

        for (var ix = 0, ixLen = emotionStore.length; ix < ixLen; ix++) {

            tempData = emotionStore[ix];

            tempEmotionli = document.createElement("li");
            tempImg = document.createElement("img");

            tempImg.src = tempData["emoThumb"];

            if (ix === 0) {
                tempEmotionli.classList.add("on")
            }

            tempEmotionli.setAttribute("data-groupIdx", tempData.emoIdx);
            tempEmotionli.setAttribute("data-idx", ix);
            
            this.addEmotionsGroupsClickEvent(imotiThumbUl, tempEmotionli);
            
            tempEmotionli.appendChild(tempImg);
            imotiThumbUl.appendChild(tempEmotionli);
        }

        imotiThumb.appendChild(imotiThumbUl);  
    }

    MobileEmoticon.prototype.appendEmotions = function (selectedEl) {

        var groupIdx = selectedEl == null ? 0 : selectedEl.getAttribute("data-groupIdx");
        var idx = selectedEl == null ? 0 : selectedEl.getAttribute("data-idx");
        var emotionObj = MobileEmoticon.prototype.emotionStore[idx];
        var emotionPositions = emotionObj["itemsMobileThumbPos"];
        var positionsArr = emotionPositions["positions"];
        var POSITIONX = 0;
        var POSITIONY = 1;
        var tempData = null;
        var tempEmotionli = null;
        var tempButton = null;
        var emotionUl = MobileEmoticon.prototype.emotionUl;
        var width = null;
        var height = null;

        if (selectedEl) {
            emotionUl.innerHTML = "";
        }

        for (var ix = 0, ixLen = positionsArr.length; ix < ixLen; ix++) {

            tempEmotionli = document.createElement("li");
            tempButton = document.createElement("span");

            width = emotionPositions["width"];
            height = emotionPositions["height"];

            tempButton.style.cssText = "background: url('" + emotionObj["itemsMobileThumb"] + "') " + positionsArr[ix][POSITIONX] + "% " + positionsArr[ix][POSITIONY] + "% no-repeat; background-size: 100vw;"
    

            tempEmotionli.setAttribute("data-emoIdx", emotionObj.emoIdx);
            tempEmotionli.setAttribute("data-itemIdx", ix);
            tempEmotionli.setAttribute("data-width", width);
            tempEmotionli.setAttribute("data-height", height);

            tempEmotionli.appendChild(tempButton);
            emotionUl.appendChild(tempEmotionli);

            tempEmotionli.addEventListener("click", showPreviewEmoticon);
        }

    }


    MobileEmoticon.prototype.addEmotionsGroupsClickEvent = function (imotiThumbUl, emotionli) {
        emotionli.addEventListener("click", function () {
            removeOnClass(imotiThumbUl);
            addOnClass(this);
            MobileEmoticon.prototype.appendEmotions(this);
        })
    }

    var removeOnClass = function (imotiThumbUl) {

        var emotionGroupsArr = imotiThumbUl.children;
        var tempLi = null;

        for (var ix = 0, ixLen = emotionGroupsArr.length; ix < ixLen; ix++) {
            tempLi = emotionGroupsArr[ix];
            if(tempLi.classList.contains("on")){
                tempLi.classList.remove("on");
                break;
            }
        }
    }

    var addOnClass = function (that) {
        that.classList.add("on");
    }

   
    var showPreviewEmoticon = function () {

        var emocticonInsertDiv = MobileEmoticon.prototype.emocticonInsertDiv;
        var selectedEmoticonImg = document.createElement("div");
        var closeBtn = document.createElement("button");
        var emoIdx = this.getAttribute("data-emoIdx");
        var itemIdx = this.getAttribute("data-itemIdx");
        var width = this.getAttribute("data-width") + "px";
        var height = this.getAttribute("data-height") + "px";
        var iframeSrc = "http://app.hsp.net/M/Emoticon/EmoticonView.aspx?emoIdx=" + emoIdx + "&itemIdx=" + itemIdx;

        emocticonInsertDiv.innerHTML = "";

        emocticonInsertDiv.style.display = "block";
        selectedEmoticonImg.style.display = "inline-block";

        closeBtn.type = "button"
        closeBtn.className = "close";
        closeBtn.textContent = "닫기";
  
        selectedEmoticonImg.style.background = this.children[0].style.background;
        
        selectedEmoticonImg.style.width = width;
        selectedEmoticonImg.style.height = height;

        emocticonInsertDiv.appendChild(selectedEmoticonImg);
        emocticonInsertDiv.appendChild(closeBtn);


        selectedEmoticonImg.addEventListener("click", function () {
            exportEmotion(iframeSrc, width, height);
            hidePreview(emocticonInsertDiv);
            parent.EmotionController.prototype.toggleBtn.click();
        });

        closeBtn.addEventListener("click", function () {
            hidePreview(emocticonInsertDiv);
        });

        var hidePreview = function (emocticonInsertDiv) {
            emocticonInsertDiv.innerHTML = "";
            emocticonInsertDiv.style.display = "none";
        }
    }

    var exportEmotion = function (iframeSrc, width, height) {
        parent.EmotionController.prototype.attachEmoticon(iframeSrc, width, height);
    }
    
    var getEmotionData = function () {

        var xhttp = new XMLHttpRequest();
        var reqDomain = location.host.indexOf("192.168") > -1 ? "http://192.168.3.26:82" : "";
        var url = reqDomain + "/m/AjaxForm/EmotionList.aspx";

        xhttp.open("GET", url, true);
        xhttp.send(null);

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    MobileEmoticon.prototype.emotionStore = JSON.parse(this.responseText);
                }
            }
        }
    }

    return MobileEmoticon;

})();
