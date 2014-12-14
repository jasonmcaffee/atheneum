var React = require('react');
var ArtistsTable = require('../components/ArtistTable.react');

var Header = React.createClass({

    /**
     * @return {object}
     */
    render: function() {
        return (
            <div>
                <header id="header">
                    <h1>Atheneum</h1>
                </header>
                <ArtistsTable artists={this.props.artists} />
            </div>
        );
    }

});

module.exports = Header;