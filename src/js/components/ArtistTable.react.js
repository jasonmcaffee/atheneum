var React = require('react');

var ArtistTable = React.createClass({
    /**
     *
     * @returns {XML}
     */
    render:function(){
        var rows = this.createArtistRows(this.props.artists);
        return(
            <div class="artists">
            {rows}
            </div>
        );
    },

    /**
     *
     * @param artists
     * @returns {Array}
     */
    createArtistRows:function(artists){
        var rows = [],
            x = 0;
        for(var artistName in artists){
            var artist = artists[artistName];
            var row = this.createArtistRow(artist, artistName, ++x);
            rows.push(row);
        }
        return rows;
    },

    /**
     *
     * @param artist
     * @param artistName
     * @param index
     * @returns {XML}
     */
    createArtistRow:function(artist, artistName, index){
        var id = "artist_" + index;
        var row = <div id={id}>{artistName}</div>;
        return row;
    }
});

module.exports = ArtistTable;