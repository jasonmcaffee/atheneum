var React = require('react');
var musicPlayer = require('model/MusicPlayer');
var V = require('core/viewFactory');
var PlayerControls = V({
    signals:{
        "musicPlayer:play":function(songInfo){
            this.forceUpdate();
        }
    },
    render:function(){
        var currentSong = musicPlayer.currentSongInfo;
        var currentSongInfo = null;
        if(currentSong){
            currentSongInfo =
            <div className="current-song-info">
                <ul>
                    <li>{currentSong.artistName}</li>
                    <li>{currentSong.albumName}</li>
                    <li>{currentSong.songName}</li>
                </ul>
            </div>;
        }
        return (
            <div className="player-controls">
                <ul>
                    <li onClick={this.handlePlayClick}>Play/Pause</li>
                    <li onClick={this.handlePreviousClick}>Previous</li>
                    <li onClick={this.handleNextClick}>Next</li>
                </ul>
                {currentSongInfo}
            </div>
        )
    },
    handlePlayClick:function(){
        if(musicPlayer.isSongCurrentlyPlaying){
            musicPlayer.stopSong();
        } else{
            musicPlayer.unPauseSong();
        }
        this.forceUpdate();
    },
    handlePreviousClick:function(){
        musicPlayer.playPreviousSong();
        this.forceUpdate();
    },
    handleNextClick:function(){
        musicPlayer.playNextSong();
        this.forceUpdate();
    }

});

module.exports = PlayerControls;
