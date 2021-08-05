import React, { useContext, Component } from 'react';
import axios from 'axios';
import { withRouter } from "react-router-dom";
import "./item.css";
import ReactStars from "react-rating-stars-component";

import AuthContext from "../../context/AuthContext";

import Images from "../images";


var imgArray = [Images.Apple, Images.BlackBerry, Images.HTC, Images.Huawei, Images.LG, Images.Motorola, Images.Nokia, Images.Samsung, Images.Sony];
var brandArray = ['Apple', 'BlackBerry', 'HTC', 'Huawei', 'LG', 'Motorola', 'Nokia', 'Samsung', 'Sony'];

// Find the index of the brand in order to map with the image array
function indexOf(arr, str) {
  if (arr && arr.indexOf) {
    return arr.indexOf(str);
  }
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    if (arr[i] === str) {
      return i;
    }
  }
  return -1;
}

// Get phone title
class PhoneTitle extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      this.props.phones.map((phone, i) => {
        return (
          <h5 key={phone._id}>{phone.title}</h5>
        )
      })
    )
  }
}

// Get phone details
class PhoneData extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      quantity: 0,
      buyer: ""
    }
  }

  // Click add to cart button to prompt an input field
  handleAddToCart = async () => {
    if (this.props.userID) {
      var checkInt = /^\+?[1-9][0-9]*$/;
      var phoneQuantity = window.prompt("Please input the quantity.");

      if (phoneQuantity) {
        if (!checkInt.test(phoneQuantity)) {
          alert("Please input a valid number.");
          return;
        } else if ((parseInt(this.state.quantity) + parseInt(phoneQuantity)) > this.props.phones[0].stock) {
          alert("There aren't enough phones in stock.");
          return;
        }
        else {
          // Update user field
          var param = { itemId: this.props.itemId, buyerid: this.props.userID, title: this.props.phones[0].title, price: this.props.phones[0].price, stock: this.props.phones[0].stock, quantity: phoneQuantity }
          const that = this;
          await axios.patch("http://localhost:5000/home/item/api/addtocart", param)
            .then(function (response) {
              //console.log(response.data);
              //window.alert("Updated successfully!");            
              that.setState({
                quantity: parseInt(that.state.quantity) + parseInt(phoneQuantity)
              });
              console.log("current state quantity: ", that.state.quantity);
            })
            .catch(function (error) {
              if (error.response) {
                console.log(error.response.data);
              }
            })
          return;
        }
      } else if (phoneQuantity === '') {
        alert("Please input a valid number.");
        return;
      } else {
        return;
      }
    } else {
      alert("Please log in first.");
    }
  }

  async getCurrentQuantity() {
    const _this = this;
    if (_this.props.userID) {
      var parameter = { itemId: this.props.itemId, buyerid: this.props.userID };
      //var parameter = { itemId: this.props.location.search.split('=')[1], buyerid: _this.props.userID };
      await axios.post("http://localhost:5000/home/item/api/currentItemQuantityInCarts", parameter)
        .then(function (response) {
          _this.setState({
            //currentAddedQuantity: response.data,
            quantity: response.data,
          })

        })
        .catch(async function (error) {
          if (error.response) {
            _this.setState({
              //commentsError: error.response.data
              quantity: error.response.data
            })
          }
        })
    } else {
      _this.setState({
        //currentAddedQuantity: 0
        quantity: 0
      })
    }
  }

  async componentDidMount() {
    this.getCurrentQuantity();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.userID !== this.props.userID) {
      this.getCurrentQuantity();
    }

  }
  render() {
    return (
      this.props.phones.map((phone, i) => {
        var addtocartBtnDisable = false;
        return (
          <div key={phone._id}>
            <table id="itemTable">
              <tbody>
                <tr>
                  <td>
                    <img src={imgArray[indexOf(brandArray, phone.brand)]} alt={phone.brand} title={phone.brand} id="itemImage" />
                  </td>
                  <td className="itemTitle">
                    <div>
                      <p>Brand</p>
                      <p>Stock</p>
                      <p>Price</p>
                      <button className="btn-hover color-3" onClick={this.handleAddToCart}>Add To Cart</button>
                    </div>
                  </td>
                  <td className="itemDetails">
                    <div>
                      <p>{phone.brand}</p>
                      <p>{phone.stock}</p>
                      <p>${phone.price}</p>
                      {/* <p id="currentQuantity">Current added quantity: {this.state.quantity} this.props.currentAddedQuantity</p> */}
                      {this.props.userID !== null ?
                        <p id="currentQuantity">Current added quantity: {this.state.quantity}</p> :
                        <p id="currentQuantity">Current added quantity: 0</p>
                      }
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )
      })
    )
  }
}

// Get seller details
class SellerName extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      this.props.users.map((user, i) => {
        return (
          <p key={user._id} id="itemSeller">Provided by: {user.firstname} {user.lastname}</p>
        )
      })
    )
  }
}

class ItemDetail extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      phones: [],
      users: [],
      isLoaded: false,
      lastDisplayedComment: 0,
      reviews: [],
      reviewerList: [],
      commentsError: "",
      currentAddedQuantity: '',
      newComments: "",
      newRatings: 2,
    }
    props.setSearchState(false);

    this.showMoreComments = this.showMoreComments.bind(this);
    this.showLessComments = this.showLessComments.bind(this);
    this.displayMoreComments = this.displayMoreComments.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleRatingChanged = this.handleRatingChanged.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  showMoreComments = (index, comments) => {
    let moreBtnId = "showMoreBtn" + index;
    let lessBtnId = "showLessBtn" + index;
    let commentId = "comments" + index;
    document.getElementById(moreBtnId).style.display = "none";
    document.getElementById(commentId).innerHTML = comments;
    document.getElementById(lessBtnId).style.display = "";
  }

  showLessComments = (index, comments) => {
    let moreBtnId = "showMoreBtn" + index;
    let lessBtnId = "showLessBtn" + index;
    let commentId = "comments" + index;
    document.getElementById(moreBtnId).style.display = "";
    document.getElementById(commentId).innerHTML = comments.substring(0, 201) + "......";
    document.getElementById(lessBtnId).style.display = "none";
  }

  displayMoreComments = (index, allComments) => {
    if (index + 3 < allComments.length - 1) {
      for (var i = index + 1; i < index + 4; ++i) {
        let commentsId = "commentBlock" + i;
        let lineId = "line" + i;
        document.getElementById(commentsId).style.display = "";
        document.getElementById(lineId).style.display = "";
      }
      this.setState({
        lastDisplayedComment: index + 3,
      })
      //console.log("last index: ", index + 3);
    } else {
      for (var i = index + 1; i < allComments.length; ++i) {
        let commentsId = "commentBlock" + i;
        let lineId = "line" + i;
        document.getElementById(commentsId).style.display = "";
        document.getElementById(lineId).style.display = "";
      }
      this.setState({
        lastDisplayedComment: allComments.length - 1,
      });
      let num = allComments.length - 1;
      let downBtn = "downBtn" + num;
      document.getElementById(downBtn).style.display = "none";
    }
  }

  handleChange = (e) => {
    this.setState({
      newComments: e.target.value,
    })
  }

  handleReset = async (e) => {
    await this.setState({
      newComments: "",
    })
  }

  handleSubmit = async (itemId, reviewerId, seller) => {
    if (reviewerId === null || reviewerId === undefined) {
      window.alert("You have not logged in yet! Please login and then leave your comments!");
    } else if (reviewerId === seller[0]._id) {
      window.alert("As a seller, you cannot leave comments for what you sell!");
    } else {
      if (this.state.newComments.length === 0) {
        window.alert("Please input some comments!");
      } else {
        var exists = false;
        if (this.state.reviews.length === 0) { exists = false; }
        else {
          for (var index = 0; index < this.state.reviews.length; index++) {
            if (this.state.reviews[index].reviewer === reviewerId) {
              exists = true;
              break;
            }
          }
        }
        if (exists) {
          window.alert("You have already left a comment! You can go to your Profile to edit it or delete it!");
        } else {
          var param = {
            itemId: itemId,
            reviewer: reviewerId,
            rating: this.state.newRatings,
            comment: this.state.newComments
          };
          const _this = this;
          await axios.post("http://localhost:5000/home/item/api/addNewComments", param)
            .then(async function (response) {
              //console.log("new comments feedback: ", response.data);
              window.alert("Your comments are added successfully!");
              var newComment = {
                reviewer: reviewerId,
                rating: _this.state.newRatings,
                comment: _this.state.newComments
              }
              var reviewer = response.data;
              await _this.setState({ reviews: _this.state.reviews.concat(newComment) });
              await _this.setState({ reviewerList: _this.state.reviewerList.concat(reviewer) });
              if (_this.state.reviews.length <= 3) {
                await _this.setState({ lastDisplayedComment: _this.state.reviews.length });
              } else {
                await _this.setState({ lastDisplayedComment: 2 });
              }
            })
            .catch(function (error) {
              if (error.response) {
                console.log(error.response.data);
                window.alert(error.response.data);
              }
            })
        }
      }
    }
    await this.setState({
      newComments: ""
    })

  }

  handleRatingChanged = (newRatings) => {
    this.setState({
      newRatings: newRatings
    })
  }

  async componentDidMount() {
    const _this = this;
    await axios.get("http://localhost:5000/home/item" + this.props.location.search)
      .then(function (response) {
        _this.setState({
          phones: response.data,
          reviews: response.data[0].reviews,
          isLoaded: true,
          lastDisplayedComment: response.data[0].reviews.length > 3 ? 2 : response.data[0].reviews.length,
        });
      })
      .catch(function (error) {
        console.log(error);
        _this.setState({
          isLoaded: false,
          error: error
        })
      })

    await axios.get("http://localhost:5000/home/item/seller" + this.props.location.search)
      .then(function (response) {
        _this.setState({
          users: response.data,
          isLoaded: true
        });
      })
      .catch(function (error) {
        console.log(error);
        _this.setState({
          isLoaded: false,
          error: error
        })
      })

    await axios.post("http://localhost:5000/home/item/reviewer", { id: this.props.location.search.split('=')[1] })
      .then(function (response) {
        _this.setState({
          reviewerList: response.data,
        })
      })
      .catch(function (error) {
        if (error.response) {
          _this.setState({
            commentsError: error.response.data
          })
        }
      })
  }

  // async componentDidUpdate(prevProps, prevState) {
  //   if (prevState.reviews !== this.state.reviews) {
  //     console.log("current change! ", this.state.reviews);
  //   }
  // }

  render() {
    return (
      <div className="border bg-white shadow p-5 mt-5" style={{ borderRadius: "15px" }}>
        <PhoneTitle phones={this.state.phones} />
        <SellerName users={this.state.users} />
        <PhoneData phones={this.state.phones}
          currentAddedQuantity={this.state.currentAddedQuantity}
          itemId={this.props.location.search.split('=')[1]}
          userID={this.props.userID} />
        <hr />
        <h4 id="itemReviews" className="text-info" style={{ marginLeft: "0" }}>
          Reviews{' '}
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
            className="bi bi-chat-dots-fill mb-4" viewBox="0 0 16 16">
            <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
          </svg>
        </h4>
        <div className="text-end" >
          <label className="fw-bold" style={{ display: 'flex', marginBottom: "0" }}>
            Leave your ratings: {this.state.newRatings}
          </label>
          <ReactStars
            count={5}
            isHalf={true}
            value={this.state.newRatings}
            onChange={(e) => { this.handleRatingChanged(e) }}
            size={24}
            emptyIcon={<i className="far fa-star"></i>}
            halfIcon={<i className="fa fa-star-half-alt"></i>}
            fullIcon={<i className="fa fa-star"></i>}
            activeColor="#ffd700"
          />
          <textarea className="form-control" placeholder="You can Leave any comments here......"
            rows={4} id="floatingTextarea2"
            value={this.state.newComments}
            onChange={this.handleChange} />
          <button type="reset" onClick={() => this.handleReset()} className="btn btn-warning me-5 mt-4 text-white">reset</button>
          <button type="submit" onClick={() => this.handleSubmit(this.props.location.search.split('=')[1], this.props.userID, this.state.users)}
            className="btn btn-info mt-4 text-white">Submit</button>
          <hr />
        </div>

        {(this.state.phones.length !== 0) &&
          (this.state.reviews.length !== 0) &&
          (this.state.reviewerList.length !== 0) &&
          (this.state.reviews.length === this.state.reviewerList.length) &&
          this.state.reviews.sort((a, b) => a.reviewer > b.reviewer && 1 || -1)
            .map((review, index) => {
              return (
                <>
                  <div key={review._id} className="card" id={"commentBlock" + index} style={{ display: index / 3 >= 1 ? "none" : "" }}>
                    <div className="card-body">
                      <h5 className="card-title ms-0">
                        Reviewer: {this.state.reviewerList[index].firstname + " " + this.state.reviewerList[index].lastname}
                      </h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        Rating: {review.rating}
                      </h6>
                      <ReactStars
                        count={5}
                        isHalf={true}
                        value={review.rating}
                        edit={false}
                        size={24}
                        emptyIcon={<i className="far fa-star"></i>}
                        halfIcon={<i className="fa fa-star-half-alt"></i>}
                        fullIcon={<i className="fa fa-star"></i>}
                        activeColor="#ffd700"
                      />
                      <div className="card-text">
                        Comment: {review.comment.length > 200 ?
                          <>
                            <p className="lh-lg" id={"comments" + index}>
                              {review.comment.substring(0, 201)}......
                          </p>
                            <button className="btn btn-outline-info" id={"showMoreBtn" + index}
                              onClick={() => this.showMoreComments(index, review.comment)}>
                              Show More
                          </button>
                            <button className="btn btn-outline-warning" id={"showLessBtn" + index}
                              style={{ display: "none" }}
                              onClick={() => this.showLessComments(index, review.comment)}>
                              Show Less
                            </button></> :
                          <p>{review.comment}</p>
                        }
                      </div>
                    </div>
                  </div>
                  <hr id={"line" + index} style={{ display: index / 3 >= 1 ? "none" : "" }} />
                  <div className="text-center" id={"downBtn" + index}
                    style={{
                      display: ((index === this.state.lastDisplayedComment) &&
                        (this.state.reviews.length > 3)) &&
                        (index !== this.state.reviews.length - 1) ? "" : "none"
                    }}>
                    <button type="button" className="btn btn-secondary"
                      onClick={() => this.displayMoreComments(index, this.state.reviews)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-down" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                        <path fillRule="evenodd" d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                      </svg>
                    </button>
                  </div>
                </>
              )
            })
        }

        {(this.state.phones.length !== 0) &&
          (this.state.reviews.length === 0) &&
          (this.state.reviewerList.length === 0) &&
          <div className="alert alert-warning" role="alert">
            {this.state.commentsError}
          </div>
        }

      </div>


    )
  }
}
export default withRouter(ItemDetail);