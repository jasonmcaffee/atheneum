var React = require('react');
var musicPlayer = require('../model/MusicPlayer.js');

var PlayerControls = React.createClass({
    render:function(){
        return (
            <div class="player-controls">
                <ul>
                    <li onClick={this.handlePlayClick}>Play/Pause</li>
                    <li>Previous</li>
                    <li>Next</li>
                </ul>
            </div>
        )
    },
    handlePlayClick:function(){
        if(musicPlayer.isSongCurrentlyPlaying){
            musicPlayer.stopSong();
        } else{
            musicPlayer.unPauseSong();
        }
    },
    handlePreviousClick:function(){
        musicPlayer.playPreviousSong();
    },
    handleNextClick:function(){
        musicPlayer.playNextSong();
    }

});

module.exports = PlayerControls;
