var FRAME = {
    MAIN: 1,
    INTERPRETING: 2
};

var interpretingChannelURL;
var interpreterMode;

function removeOldContent(){
    var content = ['interpreterChannel', 'controllerContainer'];
    content.forEach((item, index) => {
        var elem = document.getElementById(item);
        if (elem != null){
            elem.remove();
        }
    });
}

function addIFrame() {
    var iFrame = document.createElement("iframe");
    iFrame.setAttribute("id", "interpreterChannel")
    iFrame.classList.add("interpreterMain");
    iFrame.setAttribute("src", interpretingChannelURL);
    iFrame.style.zIndex = "-1";

    iFrame.onload = function() {
        muteMicrophone(FRAME.INTERPRETING);
        closeVideo(FRAME.INTERPRETING);
        joinMeet(FRAME.INTERPRETING);
    };

    // Insert iFrame on page
    var firstDiv = document.getElementsByClassName("MCcOAc")[0];
    firstDiv.parentNode.insertBefore(iFrame, firstDiv.nextSibling);

    // Style the sidebar (comments etc) so that it doesn't go under the 
    // controls box
    (document.querySelector('.usGiVb')).style.height='90%';
}

function styleIFrame() {
    var iDoc = (document.getElementById("interpreterChannel")).contentWindow.document;

    function removeElementFromIFrame(qSelector, hardRemove=false){
        var removeItem = setInterval(() => {
            var elem = iDoc.querySelector(qSelector);
            if (elem){
                hardRemove ? elem.remove() : elem.style.display = 'none';
                clearInterval(removeItem);
            }
        }, 500);
    }

    function makeInvisible(qSelector) {
        var hideItem = setInterval(() => {
            var elem = iDoc.querySelector(qSelector);
            if (elem){
                elem.style.visibility = 'hidden';
                clearInterval(hideItem);
            }
        }, 500);
    };

    function setHeight50(qSelector, height) {
        var editHeight = setInterval(() => {
            var elem = iDoc.querySelector(qSelector);
            if (elem){
                elem.style.height = '50px';
                clearInterval(editHeight);
            }
        }, 500);
    };

    // Style bottom bar
    setHeight50('.SQHmX');
    setHeight50('.x4JyWe');
    setHeight50('.n8i9t');
    setHeight50('.XMjwIe');
    setHeight50('.nByyte');
    var removeMargin = setInterval(() => {
        var elems = iDoc.querySelectorAll('.sUZ4id, .zCbbgf');
        elems.forEach((e) => {
            if (e){
                e.style.margin = '0 8px';
            }
            clearInterval(removeMargin)
        });
    }, 500);

    // Remove top bar
    removeElementFromIFrame('.NzPR9b');

    // Remove meeting details, mic/end-call/video controls, 
    // present and raise hand controls respectively.
    removeElementFromIFrame('.jzP6rf', true);
    makeInvisible('.q2u11');
    // removeElementFromIFrame('.uD3s5c');
    removeElementFromIFrame('.p2SYhf');
    removeElementFromIFrame('.M5zXed');
}

function addEndCallObserver(){
    var observedElement = document.getElementsByClassName("U26fgb")[2];

    var observer = new MutationObserver(function(mutations) {
        var endChecker = setInterval(() => {
            var endElements = document.querySelector('.qCHScd');
            if (endElements) {
                console.log("User has quit");
                clearInterval(endChecker);
                removeOldContent();
            }
        }, 500);
    });

    observer.observe(observedElement, { childList: true, attributes: true, subtree: true });
}

function isHomeScreen(){
    // If 'Join' button exists, we are on home screen
    var target = (document.getElementById("interpreterChannel")).contentWindow.document.getElementsByClassName("Y5sE8d")[0];
    return target;
}

function isMutedUpdate(delay = 500){
    setTimeout(() => {
        var muteBtn = (document.getElementById("interpreterChannel")).contentWindow.document.querySelector(".U26fgb");
        isMuted = muteBtn.classList.contains("FTMc0c");
        updateMicBtn(isMuted, "micSwitchInterp");
    }, delay);
}

function updateMicBtn(isMuted, micId) {
    var micBtn = document.getElementById(micId);
    if (isMuted){
        micBtn.style.backgroundColor = "#d93025";
        micBtn.querySelector("svg").style.fill = "#fff";
    } else {
        micBtn.style.backgroundColor = "#fff";
        micBtn.querySelector("svg").style.fill = "#000";
    }
}

function showInterpMicSwitch(){
    var micSwitchInterp = document.getElementById('micSwitchInterp');
    micSwitchInterp.style.display="block";
}

function showScreenToggleSwitch(){
    var screenToggleSwitch = document.getElementById('screenToggle');
    screenToggleSwitch.style.display="block";
}

function hideLoadingIcons(){
    var loadingIcons = document.querySelectorAll('.loading-icon');
    loadingIcons.forEach((elem) => {
        elem.remove();
    });
}

function toggleScreen(){
    var screen = document.getElementById("interpreterChannel");
    var screenZ = screen.style.zIndex;
    screenZ == "-1" ? 
            screen.style.zIndex = "100" :
            screen.style.zIndex = "-1";
}

function joinMeet(frameId){
    // For some reason, refuses to work without a 5.5s delay.
    // (Unless you have devtools open?! No idea whats happening here)
    setTimeout(() => {
        var target = (frameId == FRAME.MAIN) ? 
                document.querySelector(".Y5sE8d") : 
                (document.getElementById("interpreterChannel")).contentWindow.document.querySelector('.Y5sE8d');
        target.click();
        if (frameId == FRAME.INTERPRETING) {
            isMutedUpdate(1000);
            hideLoadingIcons();
            if (interpreterMode) { setTimeout(showInterpMicSwitch, 2000); }
            setTimeout(showScreenToggleSwitch, 2000);
            styleIFrame();
        }
    }, 5500);
}

function muteMicrophone(){
    var target = (document.getElementById("interpreterChannel")).contentWindow.document.getElementsByClassName("U26fgb")[0];
    target.click();
}

function closeVideo(frameId) {
    var index = isHomeScreen(frameId) ? 1 : 3;
    var target = (frameId == FRAME.MAIN) ? 
                document.getElementsByClassName("U26fgb")[index] : 
                (document.getElementById("interpreterChannel")).contentWindow.document.getElementsByClassName("U26fgb")[index];
    target.click();
}

function modifyAudio(frameId, value) {
    let audios = (frameId == FRAME.MAIN) ?
            [...document.getElementsByTagName('audio')] :
            [...(document.getElementById("interpreterChannel")).contentWindow.document.getElementsByTagName('audio')];
    audios.forEach(audio => audio.volume = value);
}

function addControls() {
    var controlDiv = document.createElement("div");
    controlDiv.setAttribute('id', 'controllerContainer');
    controlDiv.classList.add("controllerContainer");

    var iFrame = document.getElementById("interpreterChannel");
    iFrame.parentNode.insertBefore(controlDiv, iFrame.nextSibling);

    var controlSet = `
            <div class="channelControl">
                <div class="mainChannelControl">
                    <div class="object">
                        <div class="button" aria-label="${chrome.i18n.getMessage("toggleScreen")}" id="screenToggle">
                            <svg class="svg-icon" viewBox="0 0 20 20">
                                <path d="M17.237,3.056H2.93c-0.694,0-1.263,0.568-1.263,1.263v8.837c0,0.694,0.568,1.263,1.263,1.263h4.629v0.879c-0.015,0.086-0.183,0.306-0.273,0.423c-0.223,0.293-0.455,0.592-0.293,0.92c0.07,0.139,0.226,0.303,0.577,0.303h4.819c0.208,0,0.696,0,0.862-0.379c0.162-0.37-0.124-0.682-0.374-0.955c-0.089-0.097-0.231-0.252-0.268-0.328v-0.862h4.629c0.694,0,1.263-0.568,1.263-1.263V4.319C18.5,3.625,17.932,3.056,17.237,3.056 M8.053,16.102C8.232,15.862,8.4,15.597,8.4,15.309v-0.89h3.366v0.89c0,0.303,0.211,0.562,0.419,0.793H8.053z M17.658,13.156c0,0.228-0.193,0.421-0.421,0.421H2.93c-0.228,0-0.421-0.193-0.421-0.421v-1.263h15.149V13.156z M17.658,11.052H2.509V4.319c0-0.228,0.193-0.421,0.421-0.421h14.308c0.228,0,0.421,0.193,0.421,0.421V11.052z"></path>
                            </svg>
                        </div>
                        <svg stroke="#000" class="loading-icon" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
                            <g fill="none" fill-rule="evenodd" stroke-width="2">
                            <circle cx="22" cy="22" r="1">
                            <animate attributeName="r" begin="0s" calcMode="spline" dur="1.8s" keySplines="0.165, 0.84, 0.44, 1" keyTimes="0; 1" repeatCount="indefinite" values="1; 20"/>
                            <animate attributeName="stroke-opacity" begin="0s" calcMode="spline" dur="1.8s" keySplines="0.3, 0.61, 0.355, 1" keyTimes="0; 1" repeatCount="indefinite" values="1; 0"/>
                            </circle>
                            <circle cx="22" cy="22" r="1">
                            <animate attributeName="r" begin="-0.9s" calcMode="spline" dur="1.8s" keySplines="0.165, 0.84, 0.44, 1" keyTimes="0; 1" repeatCount="indefinite" values="1; 20"/>
                            <animate attributeName="stroke-opacity" begin="-0.9s" calcMode="spline" dur="1.8s" keySplines="0.3, 0.61, 0.355, 1" keyTimes="0; 1" repeatCount="indefinite" values="1; 0"/>
                            </circle>
                            </g>
                        </svg>
                    </div>
                    
                    <div class="divider" style="width:1px; height:20px; background-color:#f1f3f4"></div>

                    <label>${chrome.i18n.getMessage("mainChannel")}</label>

                    <div class="divider"></div>

                    <svg class="vol-icon" viewBox="0 0 100 77" xmlns="http://www.w3.org/2000/svg">
                        <path id="speakB" class="volElem" stroke="#9E7818" d="M51.2,18.5v-13c0-2.1-2.5-3.3-4.1-1.9L21.8,25.9c-1.4,1.2-3.1,1.9-4.9,1.9H8.2c-2.3,0-4.2,1.9-4.2,4.2v13.3c0,2.3,1.9,4.2,4.2,4.2H17c1.9,0,3.7,0.7,5.1,1.9l25,22c1.6,1.4,4.1,0.3,4.1-1.9v-13" opacity="0.4"/>
                        <path id="speakF" class="volElem" stroke="#F4AF0A" d="M51.2,18.5v-13c0-2.1-2.5-3.3-4.1-1.9L21.8,25.9c-1.4,1.2-3.1,1.9-4.9,1.9H8.2c-2.3,0-4.2,1.9-4.2,4.2v13.3c0,2.3,1.9,4.2,4.2,4.2H17c1.9,0,3.7,0.7,5.1,1.9l25,22c1.6,1.4,4.1,0.3,4.1-1.9v-13"/>
                        <path id="arcBigB" class="volElem" stroke="#9E7818" d="M72.2,64.1C81.1,59,87,49.4,87,38.5c0-10.9-5.9-20.5-14.8-25.6" opacity="0.4"/>
                        <path id="arcBigF" class="volElem" stroke="#F4AF0A" d="M72.2,64.1C81.1,59,87,49.4,87,38.5c0-10.9-5.9-20.5-14.8-25.6"/>
                        <path id="arcSmB" class="volElem" stroke="#9E7818" d="M59,51.3c4.4-2.6,7.4-7.4,7.4-12.8s-3-10.3-7.4-12.8" opacity="0.4" />
                        <path id="arcSmF" class="volElem" stroke="#F4AF0A" d="M59,51.3c4.4-2.6,7.4-7.4,7.4-12.8s-3-10.3-7.4-12.8"/>
                        <line id="crossLtRb" class="volElem" opacity="0.6" stroke="#CE9610" x1="43.8" y1="29.2" x2="62.6" y2="47.8" transform="scale(0)" />
                        <line id="crossLbRt" class="volElem" opacity="0.6" stroke="#CE9610" x1="62.6" y1="29.2" x2="43.8" y2="47.8" transform="scale(0)" />
                    </svg>
                    <input id="volSliderMain" type="range" min="0" max="100" value="100" aria-label="${chrome.i18n.getMessage("mainVolControl")}">

                </div>
                <div class="intrChannelControl">
                    <div class="object">
                        <div class="button" aria-label="${chrome.i18n.getMessage("toggleMic")}" id="micSwitchInterp">
                            <svg class="mic-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve" style="fill:#1E2D70">
                                <g><path d="M500,683.8c84.6,0,153.1-68.6,153.1-153.1V163.1C653.1,78.6,584.6,10,500,10c-84.6,0-153.1,68.6-153.1,153.1v367.5C346.9,615.2,415.4,683.8,500,683.8z M714.4,438.8v91.9C714.4,649,618.4,745,500,745c-118.4,0-214.4-96-214.4-214.4v-91.9h-61.3v91.9c0,141.9,107.2,258.7,245,273.9v124.2H346.9V990h306.3v-61.3H530.6V804.5c137.8-15.2,245-132.1,245-273.9v-91.9H714.4z"/></g>
                            </svg>
                        </div>
                        <svg stroke="#000" class="loading-icon" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
                            <g fill="none" fill-rule="evenodd" stroke-width="2">
                            <circle cx="22" cy="22" r="1">
                            <animate attributeName="r" begin="0s" calcMode="spline" dur="1.8s" keySplines="0.165, 0.84, 0.44, 1" keyTimes="0; 1" repeatCount="indefinite" values="1; 20"/>
                            <animate attributeName="stroke-opacity" begin="0s" calcMode="spline" dur="1.8s" keySplines="0.3, 0.61, 0.355, 1" keyTimes="0; 1" repeatCount="indefinite" values="1; 0"/>
                            </circle>
                            <circle cx="22" cy="22" r="1">
                            <animate attributeName="r" begin="-0.9s" calcMode="spline" dur="1.8s" keySplines="0.165, 0.84, 0.44, 1" keyTimes="0; 1" repeatCount="indefinite" values="1; 20"/>
                            <animate attributeName="stroke-opacity" begin="-0.9s" calcMode="spline" dur="1.8s" keySplines="0.3, 0.61, 0.355, 1" keyTimes="0; 1" repeatCount="indefinite" values="1; 0"/>
                            </circle>
                            </g>
                        </svg>
                    </div>

                    <div class="divider"></div>

                    <label>${chrome.i18n.getMessage("interpChannel")}</label>
                    
                    <div class="divider"></div>

                    <svg class="vol-icon" viewBox="0 0 100 77" xmlns="http://www.w3.org/2000/svg">
                        <path id="speakB" class="volElem" stroke="#9E7818" d="M51.2,18.5v-13c0-2.1-2.5-3.3-4.1-1.9L21.8,25.9c-1.4,1.2-3.1,1.9-4.9,1.9H8.2c-2.3,0-4.2,1.9-4.2,4.2v13.3c0,2.3,1.9,4.2,4.2,4.2H17c1.9,0,3.7,0.7,5.1,1.9l25,22c1.6,1.4,4.1,0.3,4.1-1.9v-13" opacity="0.4"/>
                        <path id="speakF" class="volElem" stroke="#F4AF0A" d="M51.2,18.5v-13c0-2.1-2.5-3.3-4.1-1.9L21.8,25.9c-1.4,1.2-3.1,1.9-4.9,1.9H8.2c-2.3,0-4.2,1.9-4.2,4.2v13.3c0,2.3,1.9,4.2,4.2,4.2H17c1.9,0,3.7,0.7,5.1,1.9l25,22c1.6,1.4,4.1,0.3,4.1-1.9v-13"/>
                        <path id="arcBigB" class="volElem" stroke="#9E7818" d="M72.2,64.1C81.1,59,87,49.4,87,38.5c0-10.9-5.9-20.5-14.8-25.6" opacity="0.4"/>
                        <path id="arcBigF" class="volElem" stroke="#F4AF0A" d="M72.2,64.1C81.1,59,87,49.4,87,38.5c0-10.9-5.9-20.5-14.8-25.6"/>
                        <path id="arcSmB" class="volElem" stroke="#9E7818" d="M59,51.3c4.4-2.6,7.4-7.4,7.4-12.8s-3-10.3-7.4-12.8" opacity="0.4" />
                        <path id="arcSmF" class="volElem" stroke="#F4AF0A" d="M59,51.3c4.4-2.6,7.4-7.4,7.4-12.8s-3-10.3-7.4-12.8"/>
                        <line id="crossLtRb" class="volElem" opacity="0.6" stroke="#CE9610" x1="43.8" y1="29.2" x2="62.6" y2="47.8" transform="scale(0)" />
                        <line id="crossLbRt" class="volElem" opacity="0.6" stroke="#CE9610" x1="62.6" y1="29.2" x2="43.8" y2="47.8" transform="scale(0)" />
                    </svg>
                    <input id="volSliderInterp" type="range" min="0" max="100" value="100" aria-label="${chrome.i18n.getMessage("intrVolControl")}">
                    
                </div>
            </div>
    `;

    controlDiv.innerHTML = controlSet;

    var screenToggle = document.getElementById('screenToggle');
    screenToggle.addEventListener("click", () => {
        toggleScreen();
    });

    var micSwitchInterp = document.getElementById('micSwitchInterp');
    micSwitchInterp.addEventListener("click", () => {
        muteMicrophone(FRAME.INTERPRETING);
        isMutedUpdate(500);
    });

    var volSliderMain = document.getElementById('volSliderMain');
    volSliderMain.addEventListener("change", () => {
        modifyAudio(FRAME.MAIN, (volSliderMain.value / 100))
    });

    var volSliderInterp = document.getElementById('volSliderInterp');
    volSliderInterp.addEventListener("change", () => {
        modifyAudio(FRAME.INTERPRETING, (volSliderInterp.value / 100))
    });
}

/************/
/*ENTRYPOINT*/
/************/

function setUpInterpretation(url, iMode){
    interpretingChannelURL = url;
    interpreterMode = iMode;
    removeOldContent()
    addIFrame()
    addEndCallObserver()
    addControls()
}

chrome.storage.sync.get("interpreterURL", ({interpreterURL}) => {
    chrome.storage.sync.get("isInterpreter", ({isInterpreter}) => {
        setUpInterpretation(interpreterURL, isInterpreter);
    });
});