//  Author: Dustin Hardin
//
//  Description:
//  Ussed to display a list of items (i.e., ordered or unordered list)
//  in a pagified manner.
//
//  References:
//  jQuery: https://jquery.com/
//  jQuery UI: https://jqueryui.com/
//  GitHub: https://github.com/dhardin/jTable


(function ($, document, window) {
    'use strict'
    //----------------- BEGIN MODULE SCOPE VARIABLES ---------------
    var configMap = {
        main_html : String()
            + '<div class="jPagenation">'
                + '<span class="prev"><a href="#"><</a></span>'
                + '<span class="first"><a href="#"></a></span>'
                + '<span class="cont"><a href="#">...</a></span>'
                + '<span class="pages"></span>'
                + '<span class="cont"><a href="#">...</a></span>'
                + '<span class="last"><a href="#"></a></span>'
                + '<span class="next"><a href="#">></a></span>'
            + '</div>',
        listHideClass: 'page-item-hide'
    },
    settingsMap = {
        maxPageItems: 10,
        maxPagesDisplayed: 4,
        pageNavButtons: true,
        firstLastIndex: true
    },
    stateMap = {
        $list: null,
        $container: null,
        $activeListItems: null,
        $firstListItem: null,
        $lastListItem: null,
        numListItems: 0,
        pageIndex: 1,
        lastPageIndex: null
    },
    jqueryMap = {},
    setJqueryMap, setPageNav, objectCreate, extendObject,
    configModule, initModule;

    //----------------- END MODULE SCOPE VARIABLES ---------------
    //------------------- BEGIN UTILITY METHODS ------------------
    // ** Utility function to set inheritance
    // Cross-browser method to inherit Object.create()
    // Newer js engines (v1.8.5+) support it natively
    objectCreate = function (arg) {
        if (!arg) { return {}; }
        function obj() { };
        obj.prototype = arg;
        return new obj;
    };

    Object.create = Object.create || objectCreate;

    // ** Utility function to extend an object
    extendObject = function (orig_obj, ext_obj) {
        var key_name;
        for (key_name in ext_obj) {
            if (ext_obj.hasOwnProperty(key_name)) {
                orig_obj[key_name] = ext_obj[key_name];
            }
        }
    };
    //-------------------- END UTILITY METHODS -------------------
    //--------------------- BEGIN DOM METHODS --------------------
    // Begin dom method /setJqueryMap/
    setJqueryMap = function () {
        var 
            $list = stateMap.$list,
            $container = stateMap.$container
        ;

        jqueryMap = {
            $container    : $container,
            $list         : $list,
            $listItems    : $list.children('li'),
            $firstListItem: stateMap.$firstListItem,
            $lastListItem : stateMap.$lastListItem,
            $midListItems : $list.children('li').not(':first').not(':last'),
            $firstPage    : $container.children('span.first'),
            $lastPage     : $container.children('span.last'),
            $prevPage     : $container.children('span.prev'),
            $nextPage     : $container.children('span.next'),
            $pages        : $container.children('span.pages'),
            $contPages    : $container.children('span.cont')

        };
    };
    // End dom method /setJqueryMap/
  
    // Begin dom method /setPageNav/
    setPageNav = function (index) {
        var
            i,
            endIndex
        ;
        
        if (!index) {
            index = 2;
        }
        if (index >= stateMap.numListItems) {
            console.log('Error: index out of bounds.\nIndex: ' + index + '\nList Item Length: ' + stateMap.numListItems);
            return false;
        }

        endIndex = index + settingsMap.maxPagesDisplayed;

        //clear pages html
        jqueryMap.$pages.html("");

        
        jqueryMap.$firstPage.find('a').text("1");
        if (stateMap.lastPageIndex >1) {
            jqueryMap.$lastPage.find('a').text(stateMap.lastPageIndex);1
        }
        
        jqueryMap.$contPages.hide();
        jqueryMap.$prevPage.hide();
        jqueryMap.$nextPage.hide();
        //if (stateMap.numListItems <= settingsMap.maxPageItems) {
        //    jqueryMap.$contPages.hide();
        //}
        //if (stateMap.pageIndex == 1) {
        //    jqueryMap.$contPages.hide();
        //}
        //if (stateMap.pageIndex >= stateMap.lastPageIndex - settingsMap.maxPagesDisplayed) {
        //    jqueryMap.$contPages.get(1).hide();
        //}
        
        for (i = index; i < endIndex && i < stateMap.lastPageIndex; i++) {
            jqueryMap.$pages.append('<a href="#">' + i + '</a>');
        }
    };
    // End dom method /setPageNav/
    
    //---------------------- END DOM METHODS ---------------------
    //------------------- BEGIN EVENT HANDLERS -------------------


    //-------------------- END EVENT HANDLERS --------------------
    //-------------------- BEGIN PRIVATE METHODS------------------
    // Begin private method /configModule/
    // Purpose : Adjust configuration of allowed keys
    // Arguments : A map of settable keys and values
    // * color_name - color to use
    // Settings :
    // * configMap.settable_map declares allowed keys
    // Returns : true
    // Throws : none
    //
    configModule = function (settings_map) {
        var setting;
        for (setting in settings_map) {
            if (settingsMap.hasOwnProperty(setting)) {
                settingsMap[setting] = settings_map[setting];
            }
        }
        return true;
    };
    // End private method /configModule/
    // Begin private method /initModule/
    // Purpose : Initializes module
    // Arguments :
    // * $container the jquery element used by this feature
    // Returns : true
    // Throws : nonaccidental
    //
    initModule = function ($list) {
        var
            $parent = $list.parent(),
            $element = $(configMap.main_html).prependTo($parent)
        ;

   

        //insert the element into the parent of the table
        $list.prependTo($element);

        stateMap.$container = $element;
        stateMap.$list = $list;
        stateMap.numListItems = $list.children('li').length;
        stateMap.$lastListItem = $list.find("li:last");
        stateMap.$firstListItem = $list.find("li:first");
        stateMap.lastPageIndex = stateMap.numListItems/settingsMap.maxPageItems;
        setJqueryMap();
        setPageNav();
        return true;
    };
    // End private method /initModule/
    //-------------------- END PRIVATE METHODS--------------------
    //------------------- BEGIN PUBLIC METHODS ---------------------
    $.fn.jPagination = function (settings_map) {
        var $list = $(this);
        if ($list[0].nodeName == "UL" || $list[0].nodeName == "OL") {
            if (settings_map){
                configModule(settings_map);
            }
            initModule($list);
        }
        return this;
    };
    // return public methods
    //return {
    //    configModule: configModule,
    //    jTable: jTable
    //};
    //------------------- END PUBLIC METHODS ---------------------

})(jQuery, document, window);