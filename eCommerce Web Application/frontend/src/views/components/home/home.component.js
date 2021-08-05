import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from "react-router-dom";
import './home.css';
import {CircularProgress} from '@material-ui/core';


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

// Fetch detailed information of the phones with least quantity
class LeastQuantityData extends React.Component {
  constructor(props) {
    super(props);
  }

  // Append phone id to url
  gotoItemPage = (id) => {
    //window.location.href = "/main/item?id=" + id;

    this.props.props.history.push("/main/item?id=" + id);
    //console.log("props: ", this.props.props);
  }

  render() {
    return (
      this.props.phones.map((phone, i) => {
        var id = phone._id;
        return (
          <tr key={phone.title}>
            <td><img src={imgArray[indexOf(brandArray, phone.brand)]} alt={phone.brand} title={phone.brand} className="homeImg" /></td>
            <td><a href="" onClick={() => { this.gotoItemPage(id) }}>{phone.title}</a></td>
            <td>${phone.price}</td>
            <td>{phone.stock}</td>
          </tr>
        )
      })
    )
  }
}

// Fetch detailed information of the phones with highest average ratings
class HighestRatingsData extends React.Component {
  constructor(props) {
    super(props);
  }

  // Append phone id to url
  gotoItemPage = (id) => {
    //window.location.href = "/main/item?id=" + id;
    this.props.props.history.push("/main/item?id=" + id);
  }

  render() {
    return (
      this.props.phones2.map((phone, i) => {
        var id = phone._id;
        return (
          <tr key={phone.title}>
            <td><img src={imgArray[indexOf(brandArray, phone.brand)]} alt={phone.brand} title={phone.brand} className="homeImg" /></td>
            <td><a href="" onClick={() => { this.gotoItemPage(id) }}>{phone.title}</a></td>
            <td>${phone.price}</td>
            <td>{phone.rating_average.toFixed(2)}</td>
          </tr>
        )
      })
    )
  }
}

// Export 2 phone list tables
class DefaultPhoneLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phones: [],
      phones2: [],
      isLoaded: false
    }
    props.setSearchState(false);
  }
  async componentDidMount() {
    const _this = this;
    await axios.get('http://localhost:5000/home/leastquantity')
      .then(function (response) {
        _this.setState({
          phones: response.data,
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
    await axios.get('http://localhost:5000/home/highestratings')
      .then(function (response) {
        _this.setState({
          phones2: response.data,
          isLoaded: true
        });
      })
      .catch(function (error) {
        console.log(error);
        _this.setState({
          isLoaded: false,
          error: error
        })
      });
  }
  render() {
    return (
      
        <>
          <h4 className="homeTableTitle">Sold Out Soon</h4>
          <div className="border bg-white shadow p-3 mt-4" style={{ borderRadius: "15px" }}>
            <table className="table text-center align-middle">
              <thead className="thead-dark">
                <tr className="homeTableHeaders">
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {!this.state.phones ? <CircularProgress/> :
                (<LeastQuantityData phones={this.state.phones} props={this.props} />)
                }
              </tbody>
            </table>
          </div>

          <h4 className="homeTableTitle">Best Sellers</h4>
          <div className="border bg-white shadow p-3 my-4" style={{ borderRadius: "15px" }}>
            <table className="table text-center align-middle">
              <thead className="thead-dark">
                <tr className="homeTableHeaders">
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Ratings</th>
                </tr>
              </thead>
              <tbody>
                {!this.state.phones2 ? <CircularProgress/> :
                (<HighestRatingsData phones2={this.state.phones2} props={this.props} />)
                }
              </tbody>
            </table>
          </div>
        </>
      )
    
  }
}
export default withRouter(DefaultPhoneLists);