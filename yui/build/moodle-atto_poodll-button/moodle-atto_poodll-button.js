YUI.add('moodle-atto_NEWTEMPLATE-button', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_NEWTEMPLATE
 * @copyright  2013 Damyon Wiese  <damyon@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_NEWTEMPLATE-button
 */

/**
 * Atto text editor NEWTEMPLATE plugin.
 *
 * @namespace M.atto_NEWTEMPLATE
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

var COMPONENTNAME = 'atto_NEWTEMPLATE';
var NEWTEMPLATEFILENAME = 'NEWTEMPLATEfilename';
var LOGNAME = 'atto_NEWTEMPLATE';



var CSS = {
        INPUTSUBMIT: 'atto_media_urlentrysubmit',
        INPUTCANCEL: 'atto_media_urlentrycancel'     
    };

var TEMPLATE = '' +
  '<form class="atto_form">' +
   '<div id="{{elementid}}_{{innerform}}" class="mdl-align">' +
   '<input id="{{elementid}}_{{NEWTEMPLATEfilename}}" type="hidden" name="{{elementid}}_{{NEWTEMPLATEfilename}}" />' +
	'<button class="{{CSS.INPUTSUBMIT}}">{{get_string "insert" component}}</button>' +
    '</div>' +
	'</form>';

var IMAGETEMPLATE = '' + '<img src="{{url}}" alt="{{alt}}"/>';


Y.namespace('M.atto_NEWTEMPLATE').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

    /**
     * A reference to the current selection at the time that the dialogue
     * was opened.
     *
     * @property _currentSelection
     * @type Range
     * @private
     */
    _currentSelection: null,

    /**
     * A reference to the dialogue content.
     *
     * @property _content
     * @type Node
     * @private
     */
    _content: null,
    _currentrecorder: null,
    _usercontextid: null,
    _itemid: null,

    initializer: function(config) {
    
        this._usercontextid = config.usercontextid;
        var host = this.get('host');
        var options = host.get('filepickeroptions');
        if (options.image && options.image.itemid) {
            this._itemid =  options.image.itemid;
        } else {
            return;
        }
        
        //if we don't have the capability, or no file uploads allowed, give up.
        if(config.disabled){
        	return;
        }
    
    	var recorders = new Array('audiomp3','audiored5','video', 'whiteboard','snapshot');
    	for (var therecorder = 0; therecorder < recorders.length; therecorder++) {
			// Add the NEWTEMPLATE button first (if we are supposed to)
			if(config.hasOwnProperty(recorders[therecorder])){
				this.addButton({
					icon: recorders[therecorder],
					iconComponent: 'atto_NEWTEMPLATE',
					buttonName: recorders[therecorder],
					callback: this._displayDialogue,
					callbackArgs: recorders[therecorder]
				});
			}
        }
       
    },
 
     /**
     * Display the NEWTEMPLATE Recorder files.
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function(e, therecorder) {
    	e.preventDefault();
    	this._currentrecorder = therecorder;
    	
    	var width=400;
    	var height=260;
    	switch(therecorder){
    		case 'audiomp3': 
    		case 'audiored5': width=400;
    						height=260;
    						break;
    		case 'video': 
    		case 'snapshot':width=400;
    						height=450;
    						break;
    		case 'whiteboard': width=680;
    						height=540;
    						break;
    	}

        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('dialogtitle', COMPONENTNAME),
            width: width + 'px',
            focusAfterHide: therecorder
        });
        if(dialogue.width != width + 'px'){
        	dialogue.set('width',width+'px');
        }

        var iframe = Y.Node.create('<iframe></iframe>');
        iframe.setStyles({
            height: height + 'px',
            border: 'none',
            width: '100%'
        });
        iframe.setAttribute('src', this._getIframeURL(therecorder));
        
        //append buttons to iframe
        var buttonform = this._getFormContent();
        
        var bodycontent =  Y.Node.create('<div></div>');
        bodycontent.append(iframe).append(buttonform);
       // iframe.append(iform);
        //set to bodycontent
        dialogue.set('bodyContent', bodycontent);
        dialogue.show();
        this.markUpdated();
    },
    

    /**
     * Returns the URL to the file manager.
     *
     * @param _getIframeURL
     * @return {String} URL
     * @private
     */
    _getIframeURL: function(therecorder) {
        return M.cfg.wwwroot + '/lib/editor/atto/plugins/NEWTEMPLATE/dialog/NEWTEMPLATE.php?' + 
          'itemid='+ this._itemid + '&recorder=' + therecorder + 
          '&updatecontrol=' + this._getFilenameControlName();
    },
    
        /**
     * Return the dialogue content for the tool, attaching any required
     * events.
     *
     * @method _getDialogueContent
     * @return {Node} The content to place in the dialogue.
     * @private
     */
    _getFormContent: function() {
        var template = Y.Handlebars.compile(TEMPLATE),
            content = Y.Node.create(template({
                elementid: this.get('host').get('elementid'),
                CSS: CSS,
                NEWTEMPLATEfilename: NEWTEMPLATEFILENAME,
                component: COMPONENTNAME
            }));

        this._form = content;
        this._form.one('.' + CSS.INPUTSUBMIT).on('click', this._doInsert, this);
        return content;
    },

	
        /**
     * Get the id of the filename control where NEWTEMPLATE stores filename
     *
     * @method _getFilenameControlName
     * @return {String} the name/id of the filename form field
     * @private
     */
	_getFilenameControlName: function(){
		return(this.get('host').get('elementid') + '_' + NEWTEMPLATEFILENAME);
	},
	
	
        /**
     * Inserts the url/link onto the page
     * @method _getDialogueContent
     * @private
     */
	_doInsert : function(e){
		e.preventDefault();
		this.getDialogue({
            focusAfterHide: null
        }).hide();
        
        var thefilename = document.getElementById(this._getFilenameControlName());
        //if no file is there to insert, don't do it
        if(!thefilename.value){
        	return;
        }

         var thefilename = thefilename.value;
         var wwwroot = M.cfg.wwwroot;
         var mediahtml='';
           
		   // It will store in mdl_question with the "@@PLUGINFILE@@/myfile.mp3" for the filepath.
		   var filesrc =wwwroot+'/draftfile.php/'+ this._usercontextid +'/user/draft/'+this._itemid+'/'+thefilename;

		//if this is an image, insert the image
		if(this._currentrecorder==='snapshot' ||this._currentrecorder==='whiteboard'){
			template = Y.Handlebars.compile(IMAGETEMPLATE);
            mediahtml = template({
                url: filesrc,
                alt: thefilename
            });		
        //otherwise insert the link
		}else{
			mediahtml = '<a href="'+filesrc+'">'+thefilename+'</a>';
		}

		this.editor.focus();
		this.get('host').insertContentAtFocusPoint(mediahtml);
		this.markUpdated();
		
	},

	    /**
     * Called by NEWTEMPLATE recorders directly to update filename field on page
     * @method updatefilename
     * @public
     */
	updatefilename : function(args) {
		//record the url on the html page						
		//var filenamecontrol = document.getElementById(args[3]);
		var filenamecontrol = document.getElementById(this._getFilenameControlName());
		if(filenamecontrol===null){ filenamecontrol = parent.document.getElementById(args[3]);} 			
		if(filenamecontrol){
			filenamecontrol.value = args[2];
			//var insertbutton = document.getElementById('insert');
			 this._form.one('.' + CSS.INPUTSUBMIT).disabled=false;
			//insertbutton.disabled = false;
		}
		
		//console.log("just  updated: " + args[3] + ' with ' + args[2]);
	}
});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
