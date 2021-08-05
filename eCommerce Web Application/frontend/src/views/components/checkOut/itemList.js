import React, { useContext, Component, useState } from 'react';
import axios from 'axios';
import AuthContext from "../../context/AuthContext";
import './itemList.css';

var itemArr = [];
var itemQuantityArr = [];

// Load the cart information of the user
class CartData extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);

        this.updateQuantity = this.updateQuantity.bind(this);
        this.remove = this.remove.bind(this);
    }

    updateQuantity = (itemId, index) => {
        const _this = this;
        const { logState, userId } = this.context;
        const [loggedIn, getLoggedIn] = logState;
        const [user, setUser] = userId;
        var checkInt = /^\+?[1-9][0-9]*$/;
        var editQuantity = window.prompt("Please input the new quantity.");

        if (editQuantity) {
            if (!checkInt.test(editQuantity)) {
                alert("Please input a valid number.");
                return;
            } else if (parseInt(editQuantity) > this.props.carts[index].itemStock) {
                alert("There aren't enough phones in stock. (Current stock: " + this.props.carts[index].itemStock + ")");
                console.log(itemId);
                return;
            } else {
                axios.get("http://localhost:5000/home/item/api/editcarts?buyerid=" + user + "&itemid=" + itemId + "&quantity=" + editQuantity)
                .then(function (response) {
                  console.log("confirm");
                  window.location.reload();
                })
                .catch(function (error) {
                  if (error.response) {
                    console.log(error.response.data);
                  }
                })
                itemQuantityArr[index] = editQuantity;
            return;
            }
        } else if (editQuantity === '') {
            alert("Please input a valid number.");
            return;
        } else {
            return;
        }
    }

    remove = (itemId, index) => {
        const _this = this;
        const { logState, userId } = this.context;
        const [loggedIn, getLoggedIn] = logState;
        const [user, setUser] = userId;
        var isDelete = window.confirm("Are you sure that you want to delete this item?");
        if (isDelete == true) {
            axios.get("http://localhost:5000/home/item/api/deleteitem?buyerid=" + user + "&itemid=" + itemId)
            .then(function (response) {
              console.log("confirm");
            })
            .catch(function (error) {
              if (error.response) {
                console.log(error.response.data);
              }
            })
            itemArr.splice(index, 1);
            itemQuantityArr.splice(index, 1);
        } else {
            return;
        }
        window.location.reload();
    }

    render() {
        if (this.props.carts.length > 0) {
            return (
            this.props.carts.map((cart, i) => {
                itemArr.push(cart.itemId);
                itemQuantityArr.push(cart.quantity);
                return (
                <tr key={cart.itemId}>
                    <td>{cart.itemTitle}</td>
                    <td>${cart.itemPrice}</td>
                    <td>{cart.quantity}</td>
                    <td className="text-end position-relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#6c757d" cursor="pointer" className="bi bi-pencil-fill position-absolute top-40 start-50 translate-middle-x" viewBox="0 0 16 16"
                            onClick={() => this.updateQuantity(cart.itemId, i)}>
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                        </svg>
                    </td>
                    <td className="text-start position-relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#6c757d" cursor="pointer" className="bi bi-trash-fill position-absolute top-40 start-50 translate-middle-x" viewBox="0 0 16 16"
                            onClick={() => this.remove(cart.itemId, i)}>
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                        </svg>
                    </td>
                </tr>
                )
            })
            )
        } else {
            return (
                <tr>
                    <td colSpan="5">You don't have anything in your cart!</td>
                </tr>
            )
        }
      }
}

// Load total price
class TotalPrice extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
    }

    confirmCart = () => {
        //const _this = this;
        const { logState, userId } = this.context;
        const [loggedIn, getLoggedIn] = logState;
        const [user, setUser] = userId;
        var isConfirm = window.confirm("Are you sure that you want to buy these items?");
        if (isConfirm == true) {
            for (var i = 0; i < itemArr.length; i++) {
                if (itemQuantityArr[i] > this.props.carts[i].itemStock) {
                    alert("There aren't enough phones in stock. (Current stock: " + this.props.carts[i].itemStock + ")");
                    return;
                }
            }
            for (var i = 0; i < itemArr.length; i++) {
                var newQuantity = this.props.carts[i].itemStock - itemQuantityArr[i];
                axios.get("http://localhost:5000/home/item/api/buyphones?id=" + itemArr[i] + "&quantity=" + newQuantity)
                .then(function (response) {
                    console.log("confirm");
                })
                .catch(function (error) {
                    if (error.response) {
                        console.log(error.response.data);
                    }
                })
            }
            axios.get("http://localhost:5000/home/item/api/deletecarts?buyerid=" + user)
            .then(function (response) {
              console.log("confirm");
            })
            .catch(function (error) {
              if (error.response) {
                console.log(error.response.data);
              }
            })
            //alert(itemQuantityArr[1])
        } else {
            return;
        }
        window.location.href = "/main";
    }

    render() {
        var totalPrice = 0;
        if (this.props.carts.length > 0) {
            this.props.carts.map((cart, i) => {
                totalPrice = totalPrice + cart.itemPrice * cart.quantity;
              })
            return (
                <div id="checkoutContrl">
                    <p id="totalPrice">Total price: ${totalPrice.toFixed(2)}</p>
                    <button className="btn-hover color-3" id="checkoutConfirm" onClick={this.confirmCart}>Confirm</button>
                </div>
            )
        } else {
            return (
                <p>Total price: $0</p>
            )
        }
        
      }
}

export default class ItemList extends Component {
    static contextType = AuthContext;
    
    constructor(props) {
        super(props);
        this.state = {
          carts: [],
          totalPrice: 0,
          isLoaded: false
        }
    }

    async componentDidMount() {
        const _this = this;
        const { userId } = this.context;
        const [user] = userId;
        await axios.get('http://localhost:5000/account/searchuser?id=' + user)
          .then(function (response) {
              if (response.data[0].carts != undefined) {
                _this.setState({
                    carts: response.data[0].carts,
                    isLoaded: true
                  });
              }
          })
          .catch(function (error) {
            console.log(error);
            _this.setState({
              isLoaded: false,
              error: error
            })
          })
    }

    render() {
        return (
            <div className="border bg-white shadow p-5 mt-5" style={{ borderRadius: "15px" }}>
                <table className="table text-center">
                    <thead className="thead-dark">
                        <tr className="homeTableHeaders">
                            <th>Title</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <CartData carts={this.state.carts}/>    
                    </tbody>
                </table>
                <TotalPrice carts={this.state.carts}/>
                
            </div>
        )
    }

}