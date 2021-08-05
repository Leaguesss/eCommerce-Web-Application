import React from 'react';
import axios from 'axios';
import { withRouter } from "react-router-dom";


import Images from "../images";

var imgArray = [Images.Apple, Images.BlackBerry, Images.HTC, Images.Huawei, Images.LG, Images.Motorola, Images.Nokia, Images.Samsung, Images.Sony];
var brandArray = ['Apple', 'BlackBerry', 'HTC', 'Huawei', 'LG', 'Motorola', 'Nokia', 'Samsung', 'Sony'];

class SearchState extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resultList: [],
            resultError: "",
            displayResultList: [],
        }
        props.setSearchState(true);
        this.indexOf = this.indexOf.bind(this);
        this.gotoItemPage = this.gotoItemPage.bind(this);
        this.fetchResult = this.fetchResult.bind(this);
        //this.updatePhoneByBrand = this.updatePhoneByBrand.bind(this);
        this.filterResultByBrand = this.filterResultByBrand.bind(this);
    }
    // Find the index of the brand in order to map with the image array
    indexOf(arr, str) {
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

    fetchResult = async () => {
        const that = this;
        await axios.get('http://localhost:5000/home/searchTitle' + this.props.location.search)
            .then(function (response) {
                that.setState({
                    resultList: response.data,
                    // displayResultList: response.data,
                });
                var brandRes = that.filterResultByBrand(response.data);
                //console.log("filter after brand: ", brandRes);
                that.filterResultByPrice(brandRes);
            })
            .catch(function (error) {
                if (error.response) {
                    that.setState({
                        resultError: error.response.data,
                        displayResultList: []
                    });
                }
            });
    }

    filterResultByBrand = (data) => {
        var brandSelected = this.props.brandSelect;
        var result = JSON.parse(JSON.stringify(data));
        if (brandSelected === null || brandSelected.length === 0) {
            this.setState({ displayResultList: result });
        } else {
            Object.keys(result).forEach((index) => {
                if (brandSelected && brandSelected.length !== 0) {
                    const i = result[index].brand.indexOf(brandSelected);
                    if (!(i > -1)) {
                        delete result[index];
                    }
                }
            });
            result = result.filter(function (e) { return e != null; });
            if (result.length === 0) {
                this.setState({ resultError: "There is no relevant result. Please try other search factors." })
            }
            this.setState({
                displayResultList: result
            });
        }
        var currentRes = result;
        return currentRes;
    }

    filterResultByPrice = (data) => {
        var priceSelected = this.props.priceSelect;
        var result = JSON.parse(JSON.stringify(data));
        if (priceSelected === 1000) {
            this.setState({ displayResultList: result });
        } else if (priceSelected === 0) {
            this.setState({ displayResultList: [] });
        } else {
            Object.keys(result).forEach((index) => {
                //console.log(result[index]);
                if (result[index].price > priceSelected) {
                    delete result[index]
                }
            });
            result = result.filter(function (e) { return e != null; });
            if (result.length === 0) {
                this.setState({ resultError: "There is no relevant result. Please try other search factors." })
            }
            this.setState({
                displayResultList: result
            });
        }
       //console.log("display result: ", this.state.displayResultList);
    }

    async componentDidMount() {
        await this.fetchResult();
        //this.updatePhoneByBrand();
    }

    async componentDidUpdate(prevProps, prevState) {   
        if ((this.props.location.search !== prevProps.location.search)
            || (this.props.brandSelect !== prevProps.brandSelect)
            || (this.props.priceSelect !== prevProps.priceSelect)){
            await this.fetchResult();
        }
    }

    // Append phone id to url
    gotoItemPage = (id) => {
        //window.location.href = "/main/item?id=" + id;
        this.props.history.push("/main/item?id=" + id);
    }

    render() {
        return (
            <div className="container py-5">
                <div className="text-primary border bg-white shadow p-3" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '15px',
                }}>
                    <h1 style={{ color: "#00b7ff" }}>Results we found</h1>
                </div>
                <hr />
                <div className="row py-5 border bg-white shadow p-3">
                    <div className="col">
                        <table className="table text-center">
                            <thead className="thead-dark table-primary fs-5">
                                <tr className="homeTableHeaders">
                                    <th scope="col">#</th>
                                    <th>Image</th>
                                    <th>Brand</th>
                                    <th>Title</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    {/* <th>Ratings</th> */}
                                </tr>
                            </thead>
                            <tbody className="align-middle">
                                {(this.state.displayResultList.length === 0) ?
                                    <tr className="fs-5 fw-bold text-primary fst-italic">
                                        <td colSpan="5" style={{ color: "#00b7ff" }}>
                                            {this.state.resultError}
                                        </td>
                                    </tr>
                                    :
                                    this.state.displayResultList.map((phone, i) => {
                                        var id = phone._id;
                                        return (
                                            <tr key={phone.title} className="text-center">
                                                <td>{i + 1}</td>
                                                <td ><img src={imgArray[this.indexOf(brandArray, phone.brand)]} alt={phone.brand} title={phone.brand} className="homeImg" /></td>
                                                <td>{phone.brand}</td>
                                                <td><a href="" onClick={() => { this.gotoItemPage(id) }}>{phone.title}</a></td>
                                                <td>{phone.price}</td>
                                                <td>{phone.stock}</td>
                                                {/* <td>{phone.rating_average.toFixed(2)}</td> */}
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                            <tfoot>
                                <tr className="fs-5 fw-bold table-primary">
                                    <td>Total: </td>
                                    <td className="text-end" colSpan="5">{this.state.displayResultList.length}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div >
            </div>
        );
    }
}

export default withRouter(SearchState);