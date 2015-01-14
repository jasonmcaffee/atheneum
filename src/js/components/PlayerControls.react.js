var React = require('react');
var musicPlayer = require('model/MusicPlayer');
var V = require('core/viewFactory');
var PlayerControls = V({
    signals:{
        "musicPlayer:play":function(songInfo){
            this.playOrPause = "icon-pause";
            this.forceUpdate();
        },
        "musicPlayer:metadata": function(metadata){
            this.currentTime = Math.ceil(musicPlayer.currentSong.currentTime) + " : " + musicPlayer.getDuration();
            console.log('currentTime is: ' + this.currentTime);
            this.forceUpdate();

            if(this.secondCountInterval){
                window.clearInterval(this.secondCountInterval);
            }

            this.secondCountInterval = window.setInterval(function(){
                this.currentTime = Math.ceil(musicPlayer.currentSong.currentTime) + " : " + musicPlayer.getDuration();
                this.forceUpdate();
            }.bind(this), 1000);
        }
    },
    render:function(){
        var currentSong = musicPlayer.currentSongInfo;
        var currentSongInfo = null;
        if(this.playOrPause == undefined){
            this.playOrPause = "icon-play";
        }
        var playButton = <li className={this.playOrPause}/>;

        if(currentSong){
            currentSongInfo =
            <marquee behavior="scroll" direction="left" className="current-song-info">
                <ul>
                    <li>{currentSong.artistName}</li>
                    <li>{currentSong.albumName}</li>
                    <li>{currentSong.songName}</li>
                </ul>
            </marquee>;
        }
        return (
            <div className="player-controls">
                <ul className="buttons">
                    <li onClick={this.handlePlayClick}>{playButton}</li>
                    <li onClick={this.handlePreviousClick}><li className="icon-angle-circled-left"/></li>
                    <li onClick={this.handleNextClick}><li className="icon-angle-circled-right"/></li>
                    <li>{this.currentTime}</li>
                </ul>
                {currentSongInfo}
            </div>
        )
    },
    handlePlayClick:function(){
        if(musicPlayer.isSongCurrentlyPlaying){
            musicPlayer.stopSong();
            this.playOrPause = "icon-play";
        } else{
            musicPlayer.unPauseSong();
            this.playOrPause = "icon-pause";
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
