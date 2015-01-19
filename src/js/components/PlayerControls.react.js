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
            this.currentTimeDisplayString = Math.ceil(musicPlayer.currentSong.currentTime) + " : " + musicPlayer.getDuration();
            console.log('currentTimeDisplayString is: ' + this.currentTimeDisplayString);
            this.forceUpdate();

            if(this.secondCountInterval){
                window.clearInterval(this.secondCountInterval);
            }

            this.secondCountInterval = window.setInterval(function(){
                //todo: chill out when paused.
                this.currentTimeDisplayString = Math.ceil(musicPlayer.currentSong.currentTime) + " : " + musicPlayer.getDuration();
                this.forceUpdate();
            }.bind(this), 1000);
        },
        "musicPlayer:timeUpdate":function(data){
            console.log('onTimeUpdate with percentage: ' + data.progressPercent);
            this.props.songTimeProgressPercent = data.progressPercent;
            this.forceUpdate();
        }
    },
    render:function(){
        console.log('render');
        var currentSong = musicPlayer.currentSongInfo;
        var currentSongInfo = null;
        if(!this.props.songTimeProgressPercent){
            this.props.songTimeProgressPercent = 0;
        }
        console.log('songTimeProgressPercent' + this.props.songTimeProgressPercent);
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
                    <li><input type="range" min="0" max="100" value={this.props.songTimeProgressPercent} onClick={this.handleRangeClick} onTouchEnd={this.handleRangeClick}/></li>
                    <li>{this.currentTimeDisplayString}</li>
                </ul>
                {currentSongInfo}
            </div>
        )
    },
    handleRangeClick:function(e){
        //step="1"  value={this.songTimeProgressPercent}
        console.log('new range value:' + e.target.value);
        var rangeVal = parseInt(e.target.value);
        if(isNaN(rangeVal)){
            console.error('no range value');
            return;
        }

    },
    //handleRangeChange:function(e){
    //    console.log('range change: ' + e.target.value);
    //},
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
