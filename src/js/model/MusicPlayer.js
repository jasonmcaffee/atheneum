var ArtistsModel = require('model/Artists');
var artistsModel = new ArtistsModel(viewModel.viewModel.artists);
var dispatcher = require('core/dispatcher');
/**
 * API for playing and manipulating songs/music.
 * Responsibilities include:
 * - playing a song
 * - pausing
 * -
 */
function MusicPlayer(){
    this.currentSong = undefined;
    //this.onPlayListeners = [];
    //this.onStopListeners = [];
    //this.onMetadataListeners = [];
    //this.onProgressListeners = [];
    //this.onTimeUpdateListeners = [];
    this.isSongCurrentlyPlaying = false;
    this.currentSongId = 0;
}
function log(message){
    console.log(message);
}


/**
 * Controls    ==============================================================================================
 */
/**
 *
 * @param songId  - id used to fetch binary song from server
 * @param songInfo - info about the song, including ablum, artist, song name. needed since musicPlayer is only aware of ids, and can't get info about song.
 */
MusicPlayer.prototype.playSong = function(songId){
    log('playing song with id: ' + songId);
    //stop the current song
    this.stopSong();
    var songInfo = artistsModel.findArtistInfoBySongId(songId);
    this.currentSongInfo = songInfo;

    //create an audio tag with src = '/getSong?songId='+songId
    if(!this.currentSong){
        try{
            this.currentSong = new Audio();
        }catch(ex){
            alert('error playing audio: ' + ex);
            return;
        }
        //events
        this.handleLoadedMetadata();
        this.currentSong.addEventListener('ended', this.handleSongEnd.bind(this));
        this.currentSong.addEventListener('progress', this.notifyProgressListeners.bind(this));
        this.currentSong.addEventListener('timeupdate', this.notifyTimeUpdateListeners.bind(this));
    }
    this.currentSong.lastTime = 0;//fix progress bar.

    this.currentSong.src = '/getSong?songId='+songId;

    //http://html5doctor.com/html5-audio-the-state-of-play/
    this.currentSong.type = 'audio/mpeg; codecs="mp3"';

    this.currentSong.play();

    this.currentSongId = parseInt(songId);//so we can ++ for next song, -- for previous song.

    this.isSongCurrentlyPlaying = true;
    this.notifyPlayListeners();
};

//stop means pause for now
MusicPlayer.prototype.stopSong = function(){
    if(!this.currentSong){return false;}
    this.currentSong.pause();
    //this.currentSong.currentTimeDisplayString = 0;   //doesn't work due to accept-range lacking on server
    this.isSongCurrentlyPlaying = false;
    this.notifyStopListeners();
};

MusicPlayer.prototype.unPauseSong = function(){
    if(!this.currentSong){
        this.playSong(1);
    }else{
        this.currentSong.play();
        this.isSongCurrentlyPlaying = true;
    }

};

MusicPlayer.prototype.playNextSong = function(){
    log('play next song called');
    this.handleSongEnd();
};

MusicPlayer.prototype.playPreviousSong = function(){
    log('play previous song called');

    this.notifyStopListeners();

    if(this.currentSongId < 1){return;}

    this.playSong(--this.currentSongId);

};

/**
 * Formatted current time.
 */
MusicPlayer.prototype.getCurrentTime = function(){
    if(!this.currentSong || isNaN(this.currentSong.currentTime)){return;}

};

/**
 * Event handlers    ==============================================================================================
 */
    //when duration, etc become available
MusicPlayer.prototype.handleLoadedMetadata = function(){
    var self = this;
    this.currentSong.addEventListener('loadedmetadata', function(e){
        log('metadata: ' + self.currentSong.duration );
        self.notifyMetadataListeners(self);
    }, false);

};

MusicPlayer.prototype.handleSongEnd = function(){
    log('song has ended. playing next song');
    this.notifyStopListeners();
    this.playSong(++this.currentSongId);
};

/**
 *
 * @param positionPercentage - eg. 75 would be 75% and it would move a 2 minute song to the 1:30 marker.
 */
MusicPlayer.prototype.setCurrentTimeViaPercentage = function(positionPercentage){
    var total = this.currentSong.duration;
    if(isNaN(total) || !this.currentSong){return;}
    positionPercentage = positionPercentage / 100;
    var newTime = total * positionPercentage;
    if(isNaN(newTime)){console.error('bad time');return;};
    this.currentSong.currentTime = newTime;
};


//returns in hours:minutes string
MusicPlayer.prototype.getDuration = function(){
    var totalSeconds = this.currentSong.duration;
    log('seconds: '+ totalSeconds);

    var displaySeconds = Math.round( ((totalSeconds % 60) * 100) / 100); //round to 2 decimal places
    if(displaySeconds < 10){displaySeconds = '0'+displaySeconds;} //add 0 to front if less than 10
    var displayMinutes = Math.floor(totalSeconds/60);

    return displayMinutes + ':' + displaySeconds;
};


MusicPlayer.prototype.notifyPlayListeners = function(){
    dispatcher.trigger('musicPlayer:play', {});
};

//
MusicPlayer.prototype.notifyMetadataListeners = function(metadata){
    dispatcher.trigger('musicPlayer:metadata', metadata);
    //console.log('metadata: ' + JSON.stringify(metadata));
};
MusicPlayer.prototype.notifyStopListeners = function(){
    dispatcher.trigger('musicPlayer:stop', {});
};

//will only fire once a second
MusicPlayer.prototype.notifyTimeUpdateListeners = function(){
    //console.log('time update');
    try{
        //log(''+this.currentSong.currentTimeDisplayString);
        if(this.currentSong.lastTime){
            if(this.currentSong.currentTime- 1 < this.currentSong.lastTime){
                //log('not notifying because a second hasnt passed');
                return;
            }
        }
        //log('notifying time update ' + this.currentSong.duration + ' currentTimeDisplayString' + this.currentSong.currentTimeDisplayString);
        this.currentSong.lastTime = this.currentSong.currentTime;
        var data = {
            currentTime : this.currentSong.currentTime,
            progressPercent: Math.floor((100 / this.currentSong.duration) * this.currentSong.currentTime)          //duration is infinity on iphone5. http://stackoverflow.com/questions/9629223/audio-duration-returns-infinity-on-safari-when-mp3-is-served-from-php
        };

        dispatcher.trigger('musicPlayer:timeUpdate', data);
    }catch(exception){
        alert('error notifying time updates: ' + exception);
    }

};

MusicPlayer.prototype.notifyProgressListeners = function(data){
    //alert('progress');
    log('notifyProgressListeners');
    dispatcher.trigger('musicPlayer:progress', data);
};


module.exports = new MusicPlayer();