(function () {
    var fourShadesOfGrey = {
            'light': [80, '#999', '#000'],
            'medium': [40, '#666', '#000'],
            'dark': [20, '#333', '#fff'],
            'sunshine': [130, '#fff470', '#000']
        },
        coverElement = document.querySelector('.cover'),
        baseClassName = coverElement.className,
        actualShading = 'light',
        blocked = false;

    var animendFunction = function() {
        coverElement.style = 'background-color: ' + fourShadesOfGrey[actualShading][1];

        coverElement.removeEventListener('animationend', animendFunction);

        blocked = false;
    };

    /** Here is the Magic! **/
    window.ondevicelight = function(event) {
        var lux = event.value || 130;

        if (lux < fourShadesOfGrey.dark[0]) {
            setShadeOfGrey('dark');
        } else if (lux > fourShadesOfGrey.dark[0] && lux < fourShadesOfGrey.medium[0]) {
            setShadeOfGrey('medium');
        } else if (lux > fourShadesOfGrey.medium[0] && lux < fourShadesOfGrey.light[0]) {
            setShadeOfGrey('light');
        } else if (lux > fourShadesOfGrey.light[0]) {
            setShadeOfGrey('sunshine');
        }
    };

    /** Playroom */
    function setShadeOfGrey(shade) {
        if (actualShading !== shade && !blocked) {
            coverElement.className = baseClassName + ' grey_' + shade;
            actualShading = shade;
            coverElement.addEventListener('animationend', animendFunction);
            blocked = true;
        }
    }
})();
