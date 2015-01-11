var React = require('react');
var ArtistsTable = require('components/ArtistTable.react');
var PlayerControls = require('components/PlayerControls.react');
var V = require('core/viewFactory');

var Home = V({

    /**
     * @return {object}
     */
    render: function() {
        return (
            <div>
                <header id="header">
                    <PlayerControls signal={this.props.signal}/>
                </header>
                <ArtistsTable artistsModel={this.props.artistsModel} signal={this.props.signal} />
            </div>
        );
    }

});

module.exports = Home;