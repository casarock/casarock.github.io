(function () {

  var template = xtag.createFragment('<video></video>');

  navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  window.URL = window.URL ||
    window.webkitURL ||
    window.mozURL ||
    window.msURL;

  var streamSuccessCallback = function (stream) {

    if (this.xtag.video.mozSrcObject !== undefined) {
      this.xtag.video.mozSrcObject = stream;
    } else {
      this.xtag.video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
    }

    if (this.getAttribute('play') !== 'false') {
      this.play();
    }

    xtag.fireEvent(this, 'canplay');
  };

  var streamErrorCallback = function (error) {
    console.log('An error occurred: ', error);
  };

  xtag.register('x-camera', {
    lifecycle: {
      created: function () {
        this.videoWidth = this.getAttribute('videowidth') || 480;
        this.videoHeight = this.getAttribute('videoheight') || 320;

        this.appendChild(template.cloneNode(true));

        this.xtag.video = this.querySelector('video');
        this.xtag.video.width = this.videoWidth;
        this.xtag.video.height = this.videoHeight;

        if (this.getAttribute('video') === 'hidden') {
          this.xtag.video.style.display = 'none';
        }

        if (navigator.getUserMedia) {
          navigator.getUserMedia({
            video: true
          }, streamSuccessCallback.bind(this), streamErrorCallback.bind(this));
        } else {
          console.log('Native web camera streaming (getUserMedia) not supported in this browser.');
        }

      }
    },

    accessors: {
      videoCanvas: {
        get: function () {
          return this.xtag.video;
        }
      }
    },

    methods: {
      play: function() {
        this.xtag.video.play();
      },

      pause: function() {
        this.xtag.video.pause();
      }
    }

  });
})();