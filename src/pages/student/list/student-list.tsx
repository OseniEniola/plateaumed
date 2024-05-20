import React from "react";
import MainLayout from "../../../../src/components/shared/layout/main-layout";
import "./student-list.scss";
import { CaretDownFill, CaretUpFill, Search, InfoCircle, XCircle } from "react-bootstrap-icons";
import WhiteDropDown from "../../../assets/images/dropdown-button.svg";
import PaginationComponent from "../../../components/shared/pagination/pagination";
import { Circles } from "react-loader-spinner";
import moment from "moment-mini";
import debounce from "lodash/debounce.js";
import { Spinner } from "react-bootstrap";
import {UserDto} from "../../../common/dto/User";
import {getAllStudent} from "../../../helpers/services/api";


const ArrowUp = {
    color: "#753BBD",
    width: "7px",
};
const ArrowDown = {
    color: "#837DA1",
    width: "7px",
};
const cellWidth = {
    width: "20%",
};
const ctaBtn = {
    backgroundImage: `url(${WhiteDropDown})`,
    backgroundPosition: "91% 50%",
    backgroundRepeat: "no-repeat",
    backgroundSize: "10px",
};

export interface State {
    dataField: string;
    order: string;
    tableData: UserDto[];
    dataPerPage: number;
    totalPageData: number;
    currentPage: number;
    isLoading: boolean;
    isSearching: boolean;
    searchQuery: string;
    isShowMobileSearch:boolean
}

class StudentList extends React.Component<any, State> {
    constructor(props: any) {
        super(props);

        let tableData: UserDto[] = [];

        this.state = {
            dataField: "SN",
            order: "asc",
            tableData: tableData,
            dataPerPage: 20,
            totalPageData: 0,
            currentPage: 1,
            isLoading: false,
            isSearching: false,
            searchQuery: "",
            isShowMobileSearch:false
        };
        this.searchData = debounce(this.searchData.bind(this), 500);
    }

    componentDidMount(): void {
       this.getTeachers()
    }
    getTeachers = () => {
        this.setState({ isLoading: true });
        getAllStudent.then((res:any) => {
            this.setState({ tableData: res, dataPerPage:res.length, totalPageData: res.length, isLoading: false });
        });
    };
pageHandler = (pageNumber: any) => {
    if (this.state.searchQuery.length > 0) {
        this.setState({ currentPage: pageNumber }, () => {

        });
    } else {
        this.setState({ currentPage: pageNumber }, () => {

        });
    }
};


sortTableData(key: any, order: any) {
    let records: any[] = this.state.tableData;
    if (order === "asc") {
        records.sort((a, b) => (a[key] < b[key] ? -1 : 1));
    } else {
        records.sort((a, b) => (a[key] > b[key] ? -1 : 1));
    }
    this.setState({ dataField: key, order: order, tableData: records });
}

searchData = (e: any) => {
    let query = e.target.value;
    this.setState({ searchQuery: e.target.value });
   // this.searchLessonPlans(query);
};

render() {
    return (
        <MainLayout>
            {this.state.isLoading && this.state.isLoading ? (
                <div className="overlay">
                    <Circles
                        height="50"
                        width="50"
                        color="#fff"
                        ariaLabel="circles-loading"
                        wrapperStyle={{}}
                        wrapperClass="loading-spinner"
                        visible={true}
                    />
                </div>
            ) : (
                ""
            )}
            <div className="page-wrap">
                <div className="table-title">
                    <div className="header">Students List</div>
                    <Search className="mobileSearchIcon" onClick={()=>this.setState({isShowMobileSearch:true})}></Search>
                </div>
                <div className={`action-btn-wrap ${this.state.isShowMobileSearch ? 'showMobile' : ''} `}>
                    <div className="search-wrap">
                        {" "}
                        <Search className="search-icon" />{" "}
                        <input
                            type="text"
                            onKeyUp={this.searchData}
                            className="search-input"
                            id="search-input"
                            placeholder="Search for a serial number,name of email etc"
                        />
                        <XCircle onClick={()=>this.setState({isShowMobileSearch:false})} className="hideSearch"/>
                    </div>
                    <div className="inner-btn-wrap">
                        <div className="btn-wrap-drop">
                        </div>
                    </div>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead>
                        <tr>
                            <th>
                                SN{" "}
                                {this.state.dataField === "id" ? (
                                    <CaretUpFill onClick={() => this.sortTableData("id", "asc")} style={ArrowUp} />
                                ) : (
                                    <CaretDownFill onClick={() => this.sortTableData("id", "desc")} style={ArrowDown} />
                                )}{" "}
                            </th>
                            <th>
                               National ID
                                {this.state.dataField === "national_no" ? (
                                    <CaretUpFill onClick={() => this.sortTableData("national_no", "asc")} style={ArrowUp} />
                                ) : (
                                    <CaretDownFill onClick={() => this.sortTableData("national_no", "desc")} style={ArrowDown} />
                                )}{" "}
                            </th>
                            <th>
                                First Name
                                {this.state.dataField === "firstname" ? (
                                    <CaretUpFill style={ArrowUp} onClick={() => this.sortTableData("firstname", "asc")} />
                                ) : (
                                    <CaretDownFill style={ArrowDown} onClick={() => this.sortTableData("firstname", "desc")} />
                                )}{" "}
                            </th>
                            <th>
                                Last Name
                                {this.state.dataField === "lastname" ? (
                                    <CaretUpFill style={ArrowUp} onClick={() => this.sortTableData("lastname", "asc")} />
                                ) : (
                                    <CaretDownFill style={ArrowDown} onClick={() => this.sortTableData("lastname", "desc")} />
                                )}{" "}
                            </th>
                            <th>
                                DOB
                                {this.state.dataField === "dob" ? (
                                    <CaretUpFill style={ArrowUp} onClick={() => this.sortTableData("dob", "asc")} />
                                ) : (
                                    <CaretDownFill style={ArrowDown} onClick={() => this.sortTableData("dob", "desc")} />
                                )}{" "}
                            </th>
                            <th>
                                Student Number
                                {this.state.dataField === "student_no" ? (
                                    <CaretUpFill style={ArrowUp} onClick={() => this.sortTableData("student_no", "asc")} />
                                ) : (
                                    <CaretDownFill style={ArrowDown} onClick={() => this.sortTableData("student_no", "desc")} />
                                )}{" "}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.tableData &&
                            this.state.tableData.map((value: UserDto, index: any) => {
                                return (
                                    <tr key={index}>

                                        <td>{value.id}</td>
                                        <td>{value.profile.national_no}</td>
                                        <td>{value.profile.firstname}</td>
                                        <td>{value.profile.lastname}</td>
                                        <td>{moment(value.profile.dob).format("MMM Do, YYYY")}</td>
                                        <td>{value.profile.student_no}</td>
                                    </tr>
                                );
                            })}
                        {this.state.isSearching ? (
                            <tr className="no-data">
                                <td colSpan={9}>
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </td>
                            </tr>
                        ) : (
                            ""
                        )}
                        {this.state.tableData && this.state.tableData.length < 1 && !this.state.isSearching ? (
                            <tr className="no-data">
                                <td colSpan={9}>
                                    <p>No data available</p>
                                </td>
                            </tr>
                        ) : (
                            ""
                        )}
                        </tbody>
                    </table>
                    <PaginationComponent
                        onChangepage={this.pageHandler}
                        postsPerPage={this.state.dataPerPage}
                        totalPosts={this.state.totalPageData}
                    />
                </div>

                {/* Mobile Screen */}
                <div className="mobile-section">
                    <div className="content-wrap">
                        {this.state.tableData &&
                            this.state.tableData.map((value: UserDto, index: any) => {
                                return (
                                    <div key={index} className="card">
                                        <div className="row">
                                            <div className="bold-text">{value.username}</div>
                                            <div className="light-text">{value.profile.national_no} | {moment(value.profile.dob).format('MMM Do, YYYY')}</div>
                                        </div>
                                        <div className="row">
                                            <div className="green-text">{value.profile.teacher_no}</div>
                                            <div className="normal-text">{value.profile.salary}</div>
                                        </div>

                                    </div>
                                )})}
                        {this.state.tableData && this.state.tableData.length < 1 && !this.state.isSearching ? (
                            <div className="card" style={{"padding": '15px'}}>
                                <div className="row" style={{'width':'100%'}}>
                                    <p style={{'textAlign':'center','marginBottom':'0'}}>No data available</p>
                                </div>
                            </div>

                        ) : (
                            ""
                        )}

                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
}

export default StudentList;
