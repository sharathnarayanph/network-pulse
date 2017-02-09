import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import moment from 'moment';
import { getBookmarks, saveBookmarks } from '../../js/bookmarks-manager';

const Details = (props) => {
  let getInvolvedText = props.getInvolved ? props.getInvolved : null;
  let getInvolvedLink = props.getInvolvedUrl ? ( <a href={props.getInvolvedUrl} target="_blank">Get Involved</a>) : null;

  return props.onDetailView ?
          (<div>
            { props.interest ? <p className="interest">{props.interest}</p> : null }
            { getInvolvedText || getInvolvedLink ? <p className="get-involved">{getInvolvedText} {getInvolvedLink}</p> : null }
            { props.contentUrl ? <a href={props.contentUrl} target="_blank" className="btn btn-block btn-view">Visit</a> : null }
          </div>) : null;
};

export default React.createClass({
  getInitialState() {
    return {
      bookmarked: false
    };
  },
  getDefaultProps() {
    return {
      onDetailView: false
    };
  },
  propTypes: {
    id: React.PropTypes.number.isRequired,
    creators: React.PropTypes.array,
    description: React.PropTypes.string.isRequired,
    featured: React.PropTypes.bool,
    getInvolved: React.PropTypes.string,
    getInvolvedUrl: React.PropTypes.string,
    interest: React.PropTypes.string,
    issues: React.PropTypes.arrayOf(React.PropTypes.string),
    thumbnailUrl: React.PropTypes.string,
    timestamp: React.PropTypes.string,
    title: React.PropTypes.string.isRequired,
    contentUrl: React.PropTypes.string,
    onDetailView: React.PropTypes.bool
  },
  componentDidMount() {
    if (this.urlToShare) {
      // TODO:FIXME: not sure if this is the best way to display URL of the current page
      this.urlToShare.value = window.location.href;
    }

    this.setInitialBookmarkedStatus();

  },
  setInitialBookmarkedStatus() {
    let bookmarks = getBookmarks();
    let bookmarked;
    let index;

    if (bookmarks) {
      index = bookmarks.indexOf(this.props.id);
      if (index > -1) {
        bookmarked = true;
      } else {
        bookmarked = false;
      }
      this.setState({bookmarked: bookmarked});
    }
  },
  bookmarkProject(bookmarks) {
    bookmarks.unshift(this.props.id);
    this.setState({bookmarked: true});
  },
  unbookmarkProject(bookmarks,index) {
    bookmarks.splice(index,1);
    this.setState({bookmarked: false});
  },
  toggleBookmarkedState() {
    let bookmarks = getBookmarks();
    let index;

    if (bookmarks) {
      index = bookmarks.indexOf(this.props.id);
      if (index > -1) {
        this.unbookmarkProject(bookmarks,index);
      } else {
        this.bookmarkProject(bookmarks);
      }
      saveBookmarks(bookmarks);
    }
  },
  handleShareBtnClick() {
    this.shareBtn.classList.add(`active`);
    this.urlToShare.focus();
    this.urlToShare.select();
  },
  render() {
    let classnames = classNames({"project-card": true, "single": this.props.onDetailView, "bookmarked": this.state.bookmarked});
    let detailViewLink = `/entry/${this.props.id}`;
    let thumbnail = this.props.thumbnailUrl ?
                    <Link to={detailViewLink} className="thumbnail">
                      <div className="img-container">
                        <img src={this.props.thumbnailUrl} />
                      </div>
                    </Link>
                    : null;
    let actions = this.props.onDetailView ?
                  (<div className="share">
                    <a className="btn" onClick={this.handleShareBtnClick} ref={(btn) => { this.shareBtn = btn; }}></a>
                    <input readOnly type="text" ref={(input) => { this.urlToShare = input; }} />
                  </div>)
                  : (<div>
                      <Link to={detailViewLink}>Read more</Link>
                    </div>);
    let creators = this.props.creators ? `By ${this.props.creators.join(`, `)}` : null;
    let timestamp = this.props.timestamp ? `Added ${moment(this.props.timestamp).format(`MMM DD, YYYY`)}` : null;

    return (
      <div className={classnames}>
        <div className="main-content">
          {thumbnail}
          <div className="content">
            <h2><Link to={detailViewLink}>{this.props.title}</Link></h2>
            <h3>{creators}{creators && timestamp ? <span className="dot-separator"></span> : null}{timestamp}</h3>
            <p className="description">{this.props.description}</p>
            <Details {...this.props} />
          </div>
          <div className="fade-overlay"></div>
        </div>
        <div className="project-links">
          <div className="action-panel">
            {actions}
            <a className="heart" onClick={this.toggleBookmarkedState}></a>
          </div>
        </div>
      </div>
    );
  }
});