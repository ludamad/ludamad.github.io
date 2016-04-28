var React = require('react');
function StatefulThis(func, startState) {
    if (startState === void 0) { startState = {}; }
    return React.createClass({
        getInitialState: function () {
            return startState;
        },
        render: function () {
            return func.call(this, this.props);
        }
    });
}
exports.StatefulThis = StatefulThis;
