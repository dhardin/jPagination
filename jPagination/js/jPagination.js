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
        main_html: String()
            + '<div class="jPagenation">'
                + '<span class="prev"><a href="#prev"><</a></span>'
                + '<span class="first"><a href="#"></a></span>'
                + '<span class="cont"><a href="#">...</a></span>'
                + '<span class="pages"></span>'
                + '<span class="cont"><a href="#">...</a></span>'
                + '<span class="last"><a href="#"></a></span>'
                + '<span class="next"><a href="#next">></a></span>'
            + '</div>',
        listHideClass: 'page-item-hide'
    },
    settingsMap = {
        maxPageItems: 5,
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
        $currentPage: null,
        numListItems: 0,
        numPages: 0,
        pageIndex: 1,
    },
    css_map = {
        activePage: {
            "color": "#aa0000"
        },
        nonActivePage: {
            "color": "#000"
        }
    },
    jqueryMap = {},
    setJqueryMap, initPageNav, objectCreate, extendObject,
    configModule, initModule, onNextClick, onPrevClick,onPageClick, changePageIndex;

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
  
    // Begin dom method /initPageNav/
    initPageNav = function () {
        var
            i,
            endIndex
        ;

        stateMap.numPages = stateMap.numListItems / settingsMap.maxPageItems;
      
        endIndex = settingsMap.maxPagesDisplayed;

        
        
        if (stateMap.numPages > settingsMap.maxPagesDisplayed) {
            jqueryMap.$contPages.show();
        }
        if (stateMap.numPages > 1) {
            jqueryMap.$prevPage.show();
            jqueryMap.$nextPage.show();
        }

        //hide page elements that are out of our max page items count
        stateMap.$activeListItems = jqueryMap.$list.find('li:lt(' + (stateMap.pageIndex * settingsMap.maxPageItems ) + ')');
        jqueryMap.$list.find('li:gt(' + (settingsMap.maxPageItems - 1) + ')').hide();

        
        for (i = 1; i < endIndex && i <= stateMap.numPages; i++) {
            jqueryMap.$pages.append('<a href="#'+i+'">' + i + '</a>');
        }

        //highlight the current page number
        stateMap.pageIndex = 1;
        stateMap.$currentPage = jqueryMap.$pages.children('a:nth-child(' + stateMap.pageIndex + ')');
        stateMap.$currentPage.css(css_map.activePage);
    };
    // End dom method /initPageNav/
    
    //---------------------- END DOM METHODS ---------------------
    //------------------- BEGIN EVENT HANDLERS -------------------
    onNextClick = function () {
        changePageIndex(stateMap.pageIndex + 1);
    };
    onPrevClick = function () {
        changePageIndex(stateMap.pageIndex - 1);
    };
    onPageClick = function () {
        var pageIndex = parseInt($(this).text());
        changePageIndex(pageIndex);
    };

    changePageIndex = function (pageIndex) {
        if (pageIndex < 1 || pageIndex > stateMap.numPages) {
            return false;
        }

        stateMap.pageIndex = pageIndex;
        stateMap.$currentPage.css(css_map.nonActivePage);
        stateMap.$currentPage = jqueryMap.$pages.children('a:nth-child(' + stateMap.pageIndex + ')');
        stateMap.$currentPage.css(css_map.activePage);
        //hide page elements that are out of our max page items count
        stateMap.$activeListItems = (stateMap.pageIndex > 1
                                        ? jqueryMap.$list.find('li:lt(' + (stateMap.pageIndex * settingsMap.maxPageItems) + '):gt(' + ((stateMap.pageIndex - 1) * settingsMap.maxPageItems - 1) + ')')
                                        : jqueryMap.$list.find('li:lt(' + (stateMap.pageIndex * settingsMap.maxPageItems) + ')')
                                    );
        jqueryMap.$listItems.hide();
        stateMap.$activeListItems.show();
    };
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
    
        setJqueryMap();
        initPageNav();

        jqueryMap.$prevPage
            .on('click', onPrevClick);
        jqueryMap.$nextPage
            .on('click', onNextClick);
        jqueryMap.$pages.find('a')
            .on('click', onPageClick);
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