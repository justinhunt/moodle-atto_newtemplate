Template for new Atto plugins for Moodle
========================================

The following steps should get you up and running with
this module template code.

* DO NOT PANIC!

* Unzip the archive and read this file. (so far so good eh)

* Rename the NEWTEMPLATE/ folder to the name of your module (eg "widget").
  The plugin folder MUST be lower case and can't contain underscores.
  You shoudl check the Moodle plugin repository at
  https://moodle.org/plugins/browse.php?list=category&id=53 to confirm that
  the name you wish to use isn't already in use.
  Registering the plugin name at http://moodle.org/plugins will secure it
  for you.

* Edit all the files in this directory and its subdirectories and change
  all the instances of the string "NEWTEMPLATE" to your atto plugin name
  (eg "widget"). If you are using Linux, you can use the following command
  $ find . -type f -exec sed -i 's/NEWTEMPLATE/widget/g' {} \;

  On a mac, use:
  $ find . -type f -exec sed -i '' 's/NEWTEMPLATE/widget/g' {} \;

* Rename the file lang/en/atto_NEWTEMPLATE.php to lang/en/atto_widget.php
  where "widget" is the name of your atto plugin

* Open yui/src/button/build.json and yui/src/button/meta/button.json and
  replace NEWTEMPLATE with the name of your plugin.

* Place the plugin folder folder into the /lib/editor/atto/plugins folder of the moodle
  directory.

* Modify version.php and set the initial version of your module.

* Visit Settings > Site Administration > Notifications, and let Moodle guide you through the install.

* Go to Site Administration > Plugins > Text Editors > Atto Toolbar Settings
  and you should find that this plugin has been added to the list of
  installed modules.
  IMPORTANT: Now add the name of your plugin to the menu structure near the bottom of the page
  e.g style1 = title, bold, italic, widget
  (where widget is the name of your atto plugin)

* You may now proceed to run your own code in an attempt to develop
  your module. You will probably want to modify lib.php and
  yui/src/button/js/button.js
  Changes to button.js won't do anything until you have run "shifter" over them.
  See:  http://docs.moodle.org/dev/YUI/Shifter

  For more information on developing Atto plugins
  see: http://docs.moodle.org/dev/Atto#Atto_Plugins

Good luck!
