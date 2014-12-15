var React = require('react');
var ArtistsTable = require('../components/ArtistTable.react');
var PlayerControls = require('../components/PlayerControls.react');

var Header = React.createClass({

    /**
     * @return {object}
     */
    render: function() {
        return (
            <div>
                <header id="header">
                    <PlayerControls />
                </header>
                <ArtistsTable artistsModel={this.props.artistsModel} />
            </div>
        );
    }

});

module.exports = Header;