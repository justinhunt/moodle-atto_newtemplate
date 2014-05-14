<?php
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

/**
 * Atto text editor integration version file.
 *
 * @package    atto_NEWTEMPLATE
 * @copyright  COPYRIGHTINFO
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();


/**
 * Initialise this plugin
 * @param string $elementid
 */
function atto_NEWTEMPLATE_strings_for_js() {
    global $PAGE;

    $PAGE->requires->strings_for_js(array('insert',
                                          'cancel',
                                          'enterflavor',
                                          'dialogtitle'),
                                    'atto_NEWTEMPLATE');
}

/**
 * Return the js params required for this module.
 * @return array of additional params to pass to javascript init function for this module.
 */
function atto_NEWTEMPLATE_params_for_js($elementid, $options, $fpoptions) {
	global $USER, $COURSE;
	//coursecontext
	$coursecontext=context_course::instance($COURSE->id);	
	
	//usercontextid
	$usercontextid=context_user::instance($USER->id)->id;
	$disabled=false;
	
	//config our array of data
	$params = array();
	$params['usercontextid'] = $usercontextid;

		//If they don't have permission don't show it
		if(!has_capability('atto/NEWTEMPLATE:visible', $coursecontext) ){
			$disabled=true;
		 }
        
        //add our disabled param
        $params['disabled'] = $disabled;
        
        //add our default flavor
        $params['defaultflavor'] = get_config('atto_NEWTEMPLATE','defaultflavor');

    return $params;
}

