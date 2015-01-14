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
                    <PlayerControls/>
                </header>
                <ArtistsTable artistsModel={this.props.artistsModel} />
            </div>
        );
    }

});

module.exports = Home;