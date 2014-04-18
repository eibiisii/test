/**
 * Swift Parallax
 * @author: Timothee Moulin
 * @website: timothee-moulin.me
 *
 * This plugin allows you to simply make parallax effect on DOM elements and backgrounds.
 *
 * Backgrounds can be fixed or scrolled (default)
 *  background-attachment: fixed;
 *  background-attachment: scroll;
 *
 * DOM elements must be relatives
 *  position: relative;
 *
 * Examples and documentation are availables on swift.timothee-moulin.me
 */


swiftListDOM = new Array();
swiftListBg = new Array();

/**
 * Run Swift when DOM is loaded
 */
$(function(){
    swift();
    
    document.documentElement.style.overflowX = 'hidden';
});


/**
 * Run Swift during scroll
 */
function swift() {

    // uncomment the following line to show debug info
    // swiftDebug();

    swiftDOM();
    swiftBackground();
}


/** 
 * Run Swift DOM Elements
 */
function swiftDOM() {

    // For each DOM elements rule
    $.each(swiftListDOM, function(key, rule) {

        if (swiftMustMove(rule))
            $(rule.selector).css(rule.axis, swiftCalculatePosition(rule) + 'px');
    });
    
}


/** 
 * Run Swift Backgrounds
 */
function swiftBackground() {

    // For each Background elements rule
    $.each(swiftListBg, function(key, rule) {

        if (swiftMustMove(rule)) {
            if (rule.axis == 'top')
                $(rule.selector).css('background-position', '0 ' + swiftCalculatePosition(rule) + 'px');

            else if (rule.axis == 'left')
                $(rule.selector).css('background-position', swiftCalculatePosition(rule) + 'px 0');
        }
    });
    
}


/** 
 * Defines if the element must move
 */
function swiftMustMove(rule) {

    var move = false;

    var deltaScrolled = swiftCurrentScroll() - rule.delay;

    if (deltaScrolled > 0 && swiftCurrentScroll() < rule.end && swiftCurrentScroll() > rule.delay)
        move = true;

    else if (deltaScrolled <= 0 && (rule.links == 'after' || rule.links === undefined))
        move = true;

    else if (swiftCurrentScroll() >= rule.end && (rule.links == 'before' || rule.links === undefined))
        move = true;

    return move;
}


/**
 * Return the new position for the given object and axis
 */
function swiftCalculatePosition(rule) {

    var position = 0;
    var deltaScrolled = swiftCurrentScroll() - rule.delay;

    if (deltaScrolled > 0 && swiftCurrentScroll() < rule.end)
        position = rule.speed * deltaScrolled + rule.positionStart;

    else if (deltaScrolled <= 0) 
        position = rule.positionStart;

    else if (swiftCurrentScroll() >= rule.end)
        position = rule.speed * (rule.end - rule.delay) + rule.positionStart;

    return parseFloat(position);
}


/**
 * Add a new Swift Rule
 */
function swiftAdd(type, selector, axis, positionStart, positionEnd, length, delay, links) {

    var index = 0;

    $(selector).each(function() {

        var calculatedDelay = swiftGetDelay($(this), axis, delay);
        var calculatedLength = (parseFloat(calculatedDelay) + parseFloat(length) > $(document).height()) ? $(document).height() - calculatedDelay : parseFloat(length);

        uniqueSelector = selector + ':eq(' + index + ')';

        var rule = {
            'selector': uniqueSelector,
            'axis': axis,
            'positionStart': parseFloat(swiftGetInitialPosition($(this), positionStart)),
            'positionEnd': parseFloat(positionEnd),
            'speed': parseFloat((parseFloat(positionEnd) - swiftGetInitialPosition($(this), positionStart)) / calculatedLength),
            'delay': parseFloat(calculatedDelay),
            'end': parseFloat(calculatedDelay + calculatedLength),
            'links': links,
        };

        if (type == 'dom')
            swiftListDOM.push(rule);

        else if (type == 'bg')
            swiftListBg.push(rule);

        $(this).addClass('swift ' + type);

        index++;
    });
}


/**
 * Return the current scroll position
 */
function swiftCurrentScroll() {

    return parseFloat($(window).scrollTop());
}


/**
 * Return the initial position
 */
function swiftGetInitialPosition(element, position) {

    if (position === undefined)
        position = 0;

    if (isNaN(position)) {

        if (position == 'bottom') {

            var windowHeight = $(window).height();
            var documentHeight = $(document).height();

            if (element.offset().top + windowHeight > documentHeight)
                position = documentHeight - element.offset().top - element.height() - 10;

            else
                position = windowHeight;
        }

        else if (position == 'top')
            position = 0 - element.offset().top - element.height();

        else if (position == 'right')
            position = $(document).width();

        else if (position == 'left')
            position = 0 - element.offset().left - element.width();
    }

    return parseFloat(position);
}


/**
 * Return the delay (scroll before swifting) for the given element and axis
 */
function swiftGetDelay(element, axis, delay) {

    if (delay === undefined)
        delay = 0;

    if (isNaN(delay)) {

        if (delay == 'auto')
            delay = element.position().top - $(window).height();
    }

    if (delay < 0)
        delay = 0;

    return parseFloat(delay);
}


/**
 * Display debug info
 */
function swiftDebug()
{
    if ($('#debug').length == 0)
        $('body').prepend('<div id="debug"><span id="currentScroll"></span></div>');

    $('#debug #currentScroll').html('scroll: ' + swiftCurrentScroll() + 'px');
}