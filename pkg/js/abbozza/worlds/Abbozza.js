/**
 * @license
 * abbozza!
 *
 * Copyright 2018 Michael Brinkmeier ( michael.brinkmeier@uni-osnabrueck.de )
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * The list of exceptions
 * @type Array
 */
Abbozza.exceptions = [];

/**
 * This operation initializes the gui of abbozza worlds.
 * 
 * @returns {undefined}
 */
Abbozza.initWorlds = function () {
    this.defaultTaskWidth="50%";
    this.defaultTaskHeight="50%";
    
    try {
        Abbozza.initSystem('worlds', true, 'http://inf-didaktik.rz.uos.de/abbozza/calliope/help');
    } catch (ex) {
    }


    Abbozza.worldId = worldId;
    // Desktop.init("js/abbozza/desktop/");

    Abbozza.worldFrame = new Frame("World", null, false, "world");
    Abbozza.worldFrame.setPosition(0, 0);
    Abbozza.worldFrame.setSize("50%", "50%");
    Abbozza.worldFrame.show();
    Abbozza.worldFrame.div.addEventListener("frame_resize",
            function (event) {
                if (World.resize) World.resize();
            }
    );
    Abbozza.worldView = document.createElement("DIV");
    Abbozza.worldView.className = "abzWorldView";    
    Abbozza.worldControl = document.createElement("DIV");
    Abbozza.worldControl.className = "abzWorldControl";
    Abbozza.worldFrame.content.appendChild(Abbozza.worldView);
    Abbozza.worldFrame.content.appendChild(Abbozza.worldControl);
    Abbozza.worldControl.appendChild(document.getElementById("speedslider"));
    
    var controls = document.getElementById("infoFrame").contentDocument.getElementById("controls");
    if ( controls ) {
        document.adoptNode(controls);
        var ctrls = controls.getElementsByClassName("control");
        while ( ctrls[0] ) {
            var el = ctrls[0];
            Abbozza.worldControl.appendChild(el);
        }   
    } 
    
    var desktopBody = document.getElementById("infoFrame").contentDocument.getElementById("desktop");
    if ( desktopBody ) {
        document.adoptNode(desktopBody);
        Desktop.desktop.appendChild(desktopBody);
    }
    
    
    ToolboxMgr.rebuild();
    Blockly.svgResize(Blockly.mainWorkspace);

    World.init(Abbozza.worldView);

    /**
     * Register abbozza event handlers
     */
    // document.addEventListener("abz_clearSketch", Abbozza.resetWorld);
    // document.addEventListener("abz_setSketch", Abbozza.setWorld);

    AbbozzaInterpreter.reset();

    var debugPane = document.getElementById("debug");
    if (Configuration.getParameter("option.debug") == "true") {
        Abbozza.debugFrame = Abbozza.createFrame(_("gui.debug"), "debug" , null, debugPane, 0, "50%", "50%", "50%");
        Abbozza.initDebugger(debugPane);
    } else {
        Abbozza.debugFrame = null;
        debugPane.style.display = "none";
    }

    var sourcePane = document.getElementById("source");
    var sourcefont;
    if (Configuration.getParameter("option.source") == "true") {
        Abbozza.sourceFrame = Abbozza.createFrame(_("gui.source"), "source", null, sourcePane, 0, "50%", "50%", "50%");
        sourcefont = document.getElementById("sourcefont");
        sourcefont.value = Abbozza.overlayEditorFontSize;
        document.getElementById("sourcefontlabel").textContent = _("gui.font_size");
    } else {
        Abbozza.sourceFrame = null;
        sourcePane.style.display = "none";
    }

    var callsPane = document.getElementById("calls");
    if (Configuration.getParameter("option.calls") == "true") {
        Abbozza.callsFrame = Abbozza.createFrame(_("gui.calls"), "calls", null, callsPane, 0, "50%", "50%", "50%");
        Abbozza.initCallView(callsPane);
    } else {
        Abbozza.callsFrame = null;
        callsPane.style.display = "none";
    }

    Abbozza.sourceEditor = CodeMirror.fromTextArea(document.getElementById("sourceeditor"), {
        mode: "javascript",
        lineNumbers: true,
        styleSelectedText: true,
        showCursorWhenSelecting : true
    });
    Abbozza.sourceEditor.setSize(null, "100%");
    
    Abbozza.sourceEditor.getWrapperElement().style["font-size"] = Abbozza.overlayEditorFontSize + "px";
    Abbozza.sourceEditor.refresh();
            
    if ( Abbozza.sourceFrame != null ) {
        sourcefont.oninput = function(event) {
            Abbozza.sourceEditor.getWrapperElement().style["font-size"] = this.value + "px";
            Abbozza.sourceEditor.refresh();
            Abbozza.overlayEditorFontSize = this.value;
        }
    }

    Desktop.addScene("Task", "img/taskscene.png", this.setTaskScene );
    
    Abbozza.parseQuery();    
};



/**
 * Initialize the system specific features.
 *  
 * @param {type} systemPrefix The systems prefix
 * @param {type} devAllow A flag indicating wether the device/object block is allowed
 * @param {type} helpUrl a common help Url
 * @returns {undefined}
 */
Abbozza.initSystem = function (systemPrefix, devAllow, helpUrl) {
    window.name = "abbozzaWorkspace";

    // Check APIs
    if (window.File && window.FileReader && window.FileList && window.Blob) {
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }

    // Adding String.prototype.startsWith for JavaFX WebEngine
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (searchString, position) {
            position = position || 0;
            return this.indexOf(searchString, position) == position;
        };
    }

    // Disable context menu of browser
    document.oncontextmenu = function (event) {
        return false;
    };

    // Set help URL
    if (typeof helpUrl != "undefined")
        this.HELP_URL = helpUrl;

    // Set the systems prefix
    this.systemPrefix = systemPrefix;
    this.pathPrefix = this.systemPrefix + "/";

    // Check if devices are allowed
    if (devAllow)
        this.devicesAllowed = devAllow;

    /**
     * React to back and forward button
     */
    window.addEventListener("popstate",
            function (event) {
                Abbozza.setSketchFromPath(document.location.search.substring(1));
            }
    );

    Desktop.init("/js/abbozza/desktop/");

    Abbozza.createModeIcon();
    
    Abbozza.workspaceDiv = document.createElement("DIV");
    Abbozza.workspaceDiv.id = "workspace";

    Abbozza.workspaceFrame = Abbozza.createFrame("Workspace", "workspace", null, Abbozza.workspaceDiv, "50%", "50%", "50%", "100%");

    Abbozza.workspaceFrame.div.addEventListener("frame_resize",
            function (event) {
                Abbozza.workspaceFrame.content.width = "100%";
                if ( Blockly.mainWorkspace )
                  Blockly.svgResize(Blockly.mainWorkspace);
            }
    );

    Abbozza.workspaceFrame.content.appendChild(Abbozza.workspaceDiv);
    Abbozza.workspaceFrame.show();
    Abbozza.workspaceFrame.setPosition("50%", 0);
    Abbozza.workspaceFrame.setSize("50%", "100%");
    Abbozza.workspaceFrame.bringToFront();

    // Load Configuration
    Configuration.load();

    // Initialize board
    Board.init(this.systemPrefix);

    // Initialize the TaskWindow
    TaskWindow.init();
    TaskWindow.frame.setSize(this.defaultTaskWidth, this.defaultTaskHeight);
    TaskWindow.frame.setPosition("67%", "0%")

    // Register change listeners
    Blockly.bindEvent_(document, 'blocklySelectChange', null, Abbozza.changeSelection);
    Blockly.mainWorkspace.addChangeListener(Abbozza.onChange);

    window.Blockly = Blockly;

    Abbozza.initButtons();

    // Build the Tools menu
    Abbozza.buildToolsMenu();

    // Initalize generator
    // This operation reads the code template
    this.Generator.init();

    /**
     * Before the page is unloaded, store the changes in the browser storage.
     */
    window.onbeforeunload = Abbozza.onUnload;

    // ToolboxMgr.rebuild();
    Blockly.svgResize(Blockly.mainWorkspace);
};



/**
 * Create a new frame on the desktop
 * 
 * @param {type} title The title of the frame
 * @param {type} icon An icon for the frame
 * @param {type} content An Element contining the contents
 * @param {type} x x-coordinate of the upper left corner
 * @param {type} y y-coordinate of the upper left corner
 * @param {type} w width of the frame
 * @param {type} h height of the frame
 * @returns {Frame|Abbozza.createFrame.frame}
 */
Abbozza.createFrame = function (title, id, icon, content, x, y, w, h) {
    var frame = new Frame(title, icon, false, id);
    frame.setContent(content);
    frame.setPosition(x, y);
    frame.setSize(w, h);
    frame.hide();
    frame.div.addEventListener("frame_resize",
            function (event) {
                if (frame.content.resize) frame.content.resize();
            }
    );
    return frame;
};



Abbozza.openFullscreen = function () {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
};


/**
 * Load a sketch.
 * A request is sent to the AbbozzaServer to ask the user for a sketch to be
 * loaded. Beforethat the user is asked wetherthe current sketch should be 
 * saved.
 * 
 * @returns {undefined}
 */
Abbozza.loadSketch = function () {
// Check if sketch was modified, ask if it should be saved
    if (this.modified && !this.askForSave()) {
        return;
    }

    // Store current sketch
    if ((document.location.search != null) && (document.location.search != "")) {
        Abbozza.storeSketch(document.location.search.substring(1));
    }

    var xml = document.createElement("abbozza");
    Abbozza.openOverlay(_("msg.load_sketch"));
    var sketch = Connection.getXML("/abbozza/load",
            function (sketch, xhttp) {
                var editMode = xhttp.getResponseHeader("X-abbozza-mode");
                
                switch ( editMode ) {
                    case "workshop" :
                        Abbozza.setEditMode( Abbozza.WORKSHOP_MODE );
                        break;
                    case "authors" :
                        Abbozza.setEditMode( Abbozza.AUTHORS_MODE );
                        break;
                    case "regular": 
                        Abbozza.setEditMode( Abbozza.REGULAR_MODE );
                        break;
                }

                var location = xhttp.getResponseHeader("Content-Location");
                var tags = sketch.getElementsByTagName("system");
                if (tags.length > 0) {
                    var tag = tags[0];
                    var world = tag.getAttribute("world");
                    if (world != Abbozza.worldId) {
                        Abbozza.worldId = world;
                        Abbozza.setContentLocation(location);
                        Abbozza.clearStoredSketch(location);
                        Abbozza.reloadForced = true;
                        document.location.reload();
                        return;
                    }
                }
                Abbozza.closeOverlay();
                Abbozza.clearSketch( Abbozza.getEditMode() != Abbozza.WORKSHOP_MODE );
                if ( Abbozza.setSketch(sketch) ) {
                    Abbozza.setContentLocation(location);
                }
            },
            function (response) {
                Abbozza.closeOverlay();
            }
    );
};

/**
 * set Sketch
 * @type Abbozza.setSketch
 */
Abbozza.originalSetSketch = Abbozza.setSketch;

Abbozza.setSketch = function (sketch, page = - 1) {
    var taskChanged = Abbozza.originalSetSketch(sketch,page);

    /*
    // Restore the layout
    var layouts = sketch.getElementsByTagName("layout");
    for ( var i = 0; i < layouts.length; i++ ) {
        var layout = layouts[i];
        var frames = layout.getElementsByTagName("frame");
        for ( var j = 0; j < frames.length; j++ ) {
            var id = frames[j].id;
            var frame = null;
            switch (id) {
                case "world" : frame = Abbozza.worldFrame; break;
                case "workspace" : frame = Abbozza.workspaceFrame; break;
                case "task" : frame = TaskWindow.frame; break;
                case "debug" : frame = Abbozza.debugFrame; break;
                case "source" : frame = Abbozza.callsFrame; break;
                case "calls" : frame = Abbozza.sourceFrame; break;                    
            }
            if ( frame ) {
                frame.restoreLayoutXML(frames[j]);
            }
        }
    }
    */

    var worlds = null;
    
    if (Abbozza.worldFromDom) {
        worlds = sketch.getElementsByTagName("world");
        World.setWorldDom(worlds)
    }
    AbbozzaInterpreter.reset();
    if (Abbozza.sourceEditor)
        Abbozza.sourceEditor.value = "";

    return taskChanged;
}


Abbozza.originalClearSketch = Abbozza.clearSketch;

Abbozza.clearSketch = function(cleanTask = true) {
    Abbozza.originalClearSketch(cleanTask);

    var worlds = null;
    AbbozzaInterpreter.reset();
    if (Abbozza.sourceEditor)
        Abbozza.sourceEditor.value = "";    
}

/**
 * To cleanup the Task, remove all hooks privided by the World.
 * 
 * @returns {undefined}
 */
Abbozza.cleanupTask = function () {
    World.purgeHooks();
}

/**
 * Reset the world and the interpreter
 * 
 * @param {type} event
 * @returns {undefined}
 */
Abbozza.resetWorld = function (event) {
    var worlds = null;
    var sketch = null;
    
    World.setWorldDom(null);
    AbbozzaInterpreter.reset();
    if (Abbozza.sourceEditor)
        Abbozza.sourceEditor.value = "";
}

/**
 * Reset the world and the interpreter
 * 
 * @param {type} event
 * @returns {undefined}
 */
Abbozza.setWorld = function (event) {
    var worlds = null;
    var sketch = null;
    
    if (event.detail) {
        sketch = event.detail;
        if (Abbozza.worldFromDom) {
            worlds = sketch.getElementsByTagName("world");
            World.setWorldDom(worlds)
        }
    }
    AbbozzaInterpreter.reset();
    if (Abbozza.sourceEditor)
        Abbozza.sourceEditor.value = "";
}

/**
 * Laod a new sketch.
 * 
 * @param {type} path
 * @returns {undefined}
 */
Abbozza.goToSketch = function (path) {
    Abbozza.setSketchFromPath(path);
    World.reset();
}

/**
 * Get the number of blocks in the workspace
 * 
 * @returns {unresolved}
 */
Abbozza.getNumberOfBlocks = function () {
    return Blockly.mainWorkspace.getAllBlocks().length;
}

/**
 * Read world from DOM
 * 
 * @param {type} worldXml
 * @returns {undefined}
 */
Abbozza.worldFromDom = function (worldXml) {
    if (World.fromDom) {
        World.fromDom(worldXml);
    }
}

/**
 * Construct a DOM representing the world.
 * 
 * @returns {unresolved}
 */
Abbozza.worldToDom = function () {
    if (World.toDom) {
        return World.toDom();
    }
    return null;
}


Abbozza.getContentBase = function () {
    return "/abbozza/world/" + Abbozza.worldId + "/";
};
Abbozza.getFeaturePath = function () {
    return "/abbozza/features/" + Abbozza.worldId + "/";
}


Abbozza.getWorldIdFromPath = function (path) {
    var prefix = "/abbozza/world/";
    var start = path.indexOf(prefix);
    if (start >= 0) {
        var start = start + prefix.length;
        var end = path.indexOf("/", start);
        return path.substring(start + 1, end);
    } else {
        // Default context is console
        return "console";
    }
};
Abbozza.initButtons = function () {
    // Set the buttons toolstips
    var but = document.getElementById("step");
    but.setAttribute("title", _("gui.generate_button"));
    but = document.getElementById("run");
    but.setAttribute("title", _("gui.upload_button"));
    but = document.getElementById("stop");
    but.setAttribute("title", _("gui.upload_button"));
    but = document.getElementById("new");
    but.setAttribute("title", _("gui.new_button"));
    but = document.getElementById("load");
    but.setAttribute("title", _("gui.load_button"));
    but = document.getElementById("save");
    but.setAttribute("title", _("gui.save_button"));
    but = document.getElementById("config");
    but.setAttribute("title", _("gui.config_button"));
    but = document.getElementById("info");
    but.setAttribute("title", _("gui.info_button"));
};



Blockly.BlockSvg.prototype.addSystemContextMenuItems = function (menuOptions) {
    var block = this;
    var breakpointOption = {
        text: _("gui.toggle_breakpoint"),
        enabled: true,
        callback: function () {
            if (block.isBreakpoint && (block.isBreakpoint == true)) {
                block.isBreakpoint = false;
            } else {
                block.isBreakpoint = true;
            }
            block.updateBreakpointMark();
        }
    };
    menuOptions.push(breakpointOption);
};

Abbozza.waitingForAnimation = false;
/**
 * Create the system tag for sainbg
 * 
 * @param {type} workspace
 * @returns {Abbozza.workspaceToDom.xml}
 */
Abbozza.getSystemTag = function () {
    var tag = document.createElement("system");
    tag.textContent = Abbozza.systemPrefix;
    tag.setAttribute("world", Abbozza.worldId);
    return tag;
}

/**
 * Adds an exception to the list of exceptions
 * 
 * @param {type} code A numerical code describing the type of exception
 * @param {type} msg A textual message to be shown to the user.
 */
Abbozza.throwException = function (code, msg) {
    Abbozza.exceptions.push([code, msg]);
}

/**
 * 
 * @returns {undefined}
 */

Abbozza.generateSource = function () {
    Abbozza.openOverlay(_("msg.generate_sketch"));
    var code = this.Generator.workspaceToCode();
    Abbozza.sourceEditor.setValue(code);
    if (!ErrorMgr.hasErrors()) {
        Abbozza.appendOverlayText(_("msg.code_generated"));
    }
    Abbozza.closeOverlay();
}


Abbozza.waitForAnimation = function (anim, callback) {
    Abbozza.waitingForAnimation = true;
    anim.onfinish = function () {
        Abbozza.waitingForAnimation = false;
        if (callback)
            callback.call(this);
    }
}



Abbozza.loadSource = function () {
    Abbozza.openOverlay(_("msg.load_source"));
    var sketch = Connection.getText("/abbozza/loadsource",
            function (code, xhttp) {
                Abbozza.closeOverlay();
                Abbozza.sourceEditor.setValue(code);
            },
            function (response) {
                Abbozza.closeOverlay();
            }
    );
}


Abbozza.saveSource = function () {
    var source = Abbozza.sourceEditor.getValue();
    Abbozza.openOverlay(_("msg.save_source"));
    Connection.sendText("/abbozza/savesource", source,
            function (response, xhttp) {
                Abbozza.closeOverlay();
            },
            function (response, xhttp) {
                Abbozza.closeOverlay();
            }
    );
}

/**
 * Initialize the call View
 * @param {type} callPane
 * @returns {undefined}
 */
Abbozza.initCallView = function () {
    Abbozza.callCount = 0;
    var view = document.getElementById("callView");
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // svg.setAttribute("width","100%");
    // svg.setAttribute("height","100%");
    // svg.setAttribute("transform", "scale(1 -1)");
    view.appendChild(svg);
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M 0,0");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "black");
    svg.appendChild(path);
    // Register event handlers
    document.addEventListener("abz_start", function (event) {
        Abbozza.callCount = 0;
        Abbozza.lastCallStep = 0;
        if (AbbozzaInterpreter.threads[0]) AbbozzaInterpreter.threads[0].callList = [];
        path.setAttribute("d", "M 0,0");
    });
    document.addEventListener("abz_step", function (event) {
        if (AbbozzaInterpreter.threads[0] == null) {
            return;
        }
        var list = AbbozzaInterpreter.threads[0].callList;
        if (Abbozza.callCount != list.length) {
            for (var i = Abbozza.callCount; i < list.length; i++) {
                var d = path.getAttribute("d");
                var step = list[i][0];
                var dx = step - Abbozza.lastCallStep;
                if (list[i][1] != null) {
                    d = d + " l " + dx + ",0 l 0,10 ";
                } else {
                    d = d + " l " + dx + ",0 l 0,-10 ";
                }
                path.setAttribute("d", d);
                Abbozza.lastCallStep = list[i][0];
            }

            svg.setAttribute("width", path.getBBox().width);
            svg.setAttribute("height", path.getBBox().height);

            Abbozza.callCount = list.length;
            var ph = path.getBBox().height;
            var vh = 0.9*view.offsetHeight;
            var scale = -(1.0*vh)/ph;
            var dy = 45.0*vh/100.0;
            svg.setAttribute("transform","matrix(1,0,0," + scale + ",0," + dy + ")");
            view.scrollLeft = path.getBBox().width;
            // callPane.textContent = AbbozzaInterpreter.threads[0].callList;
        }
    });
    document.addEventListener("abz_stop", function (event) { });
    document.addEventListener("abz_error", function (event) { });
}


/**
 * Initialize debug Panel
 * 
 * @param {type} debugPane The pane into which the debug panel should be injected
 * @returns {undefined}
 */
Abbozza.initDebugger = function () {
    document.getElementById("stepLabel").textContent = _("gui.executed_steps") + " ";
    document.getElementById("blockLabel").textContent = _("gui.executed_blocks") + " ";
    // Register event handlers
    document.addEventListener("abz_start", function (event) {
        Abbozza.updateDebugger();
    });
    document.addEventListener("abz_step", function (event) {
        Abbozza.updateDebugger();
    });
    document.addEventListener("abz_stop", function (event) {
        Abbozza.updateDebugger();
    });
    document.addEventListener("abz_error", function (event) {
        Abbozza.updateDebugger();
    });
}

/**
 * Update the debug panel
 * 
 * @param {type} debugPan
 * @returns {undefined}
 */
Abbozza.updateDebugger = function () {
    document.getElementById("stepCounter").textContent = AbbozzaInterpreter.executedSteps;
    document.getElementById("blockCounter").textContent = AbbozzaInterpreter.executedBlocks;
    if (!Abbozza.debugViews)
        return;
    for (var i = 0; i < Abbozza.debugViews.length; i++) {
        var view = Abbozza.debugViews[i];
        var name = view.nameField.value;
        var value = view.valueField;
        var symbol = AbbozzaInterpreter.getSymbol(name);
        value.textContent = String(symbol);
    }
}


/**
 * Add a watch to the debugger.
 * 
 * @returns {undefined}
 */
Abbozza.addDebugView = function () {
    if (!Abbozza.debugViews) {
        Abbozza.debugViews = [];
    }
    var view = new DebugView();
    var views = document.getElementById("debugViews");
    views.appendChild(view.view);
    Abbozza.debugViews.push(view);
}



function DebugView() {
    this.view = document.createElement("div");
    this.view.className = "debugView";
    this.nameField = document.createElement("input");
    this.nameField.setAttribute("type", "text");
    this.nameField.className = "debugViewName";
    this.nameField.placeholder = "<Name>";
    this.view.appendChild(this.nameField);
    this.valueField = document.createElement("span");
    this.valueField.className = "debugViewValue";
    this.view.appendChild(this.valueField);
    this.button = document.createElement("span");
    this.button.className = "debugViewButton";
    this.button.textContent = "-";
    var parent = document.getElementById("debugViews");
    var child = this.view;
    this.button.onclick = function (event) {
        parent.removeChild(child);
        // TODO
    }
    this.view.appendChild(this.button);
}


Abbozza.setTaskScene = function() {
    Desktop.hideAllFrames();
    
    Abbozza.workspaceFrame.setPosition("50%", "0");
    Abbozza.workspaceFrame.setSize("50%", "100%");
    Abbozza.workspaceFrame.show();
     
    Abbozza.worldFrame.setPosition(0, 0);
    Abbozza.worldFrame.setSize("50%", "50%");
    Abbozza.worldFrame.show();
    
    TaskWindow.setPosition("0","50%");
    TaskWindow.setSize("50%","50%");
    TaskWindow.show();
}


/**
 * Adapt the stored xml.
 * 
 * @param {type} xml
 * @returns {undefined}
 */
Abbozza.storeSketchSystemSpecific = function(xml) {
    // Don't store the world in WORKSHOP_MODE 
    if ( Abbozza.editMode != Abbozza.WORKSHOP_MODE ) {
        var world = Abbozza.worldToDom();
        if ( world ) xml.appendChild(world);
    }
}

/**
 * Stores the current sketch in the session storage.
 * 
 * @param {String} key The key under which the sketch should be stored.
 * @returns {undefined}
 */
Abbozza._storeSketch = function (key) {
    // Remove sequences of /
    while (key.indexOf("//") >= 0) {
        key = key.replace("//", "/");
    }

    // Get the current sketch
    var xml = Abbozza.workspaceToDom(Blockly.mainWorkspace);
    ml.appendChild(Abbozza.getSystemTag());

    var desc = document.createElement("description");
    desc.textContent = Abbozza.sketchDescription;
    xml.appendChild(desc);

    var opts = document.createElement("options");
    xml.appendChild(opts);
    opts.setAttribute("apply", Abbozza.sketchApplyOptions ? "yes" : "no");
    opts.setAttribute("protected", Abbozza.sketchProtected ? "yes" : "no");
    opts.textContent = Configuration.getOptionString();

    var task = TaskWindow.getHTML();
    xml.appendChild(task);
    
    var tasks = xml.getElementsByTagName("task");
    if (tasks[0]) {
        tasks[0].setAttribute("curpage", TaskWindow.currentPage_);
    }
    
    // Store the layout
    var layout = document.createElement("layout");
    var id;
    for ( id in Desktop.frames ) {
        layout.appendChild(DesTaskWindow.frame.getLayoutXML(id));        
    }
    
    
    xml.appendChild(layout);   

/*
    // Store the layout
    var layout = document.createElement("layout");
    layout.appendChild(Abbozza.worldFrame.getLayoutXML("world"));
    layout.appendChild(Abbozza.workspaceFrame.getLayoutXML("workspace"));
    layout.appendChild(TaskWindow.frame.getLayoutXML("task"));
    if (Abbozza.debugFrame) layout.appendChild(Abbozza.debugFrame.getLayoutXML("debug"));
    if (Abbozza.debugFrame) layout.appendChild(Abbozza.debugFrame.getLayoutXML("calls"));
    if (Abbozza.sourceFrame) layout.appendChild(Abbozza.sourceFrame.getLayoutXML("source"));
    xml.appendChild(layout);   
*/
 
    sessionStorage.setItem(key, Blockly.Xml.domToText(xml));
    
    return xml;
};

/**
 * Add the variable blocks of the current world
 * @param {type} list
 */
Abbozza.addVariableBlocks = function(list) {
    if ( World.addVariableBlocks ) {
        World.addVariableBlocks(list);
    }
}

Abbozza.addTypes = function(list) {
    if ( World.addTypes ) {
        World.addTypes(list);
    }
}

Abbozza.addTypesToMenu = function(list) {
    if ( World.addTypesToMenu ) {
        World.addTypesToMenu(list);
    }
}

Abbozza.getBlockForSymbolEntry = function(entry, workspace) {
    if ( World.getBlockForSymbolEntry) {
        return World.getBlockForSymbolEntry(entry, workspace);
    } else {
        return null;
    }
}

