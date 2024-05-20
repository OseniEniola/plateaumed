import React from "react";
import MainLayout from "../../components/shared/layout/main-layout";
import Kebab from "../../assets/dashboard/kebab.svg";
import "./lessonplan.scss";
import { CaretDownFill, CaretUpFill, Search, InfoCircle, XCircle } from "react-bootstrap-icons";
import WhiteDropDown from "../../assets/dashboard/dropdown-button.svg";
import Dropdown from "react-bootstrap/Dropdown";
import EditPlan from "../../assets/dashboard/edit-lessonplan.svg";
import GalleryAdd from "../../assets/dashboard/gallery-add.svg";
import GalleryManage from "../../assets/dashboard/gallery-manage.svg";
import DownloadPdf from "../../assets/dashboard/download-pdf.svg";
import DownloadMsWord from "../../assets/dashboard/download-Msword.svg";
import DeletePlan from "../../assets/dashboard/delete-lessonplan.svg";
import AddBulkLesson from "../../assets/images/lesson/add-bulk-lesson.svg";
import AddSinglePlan from "../../assets/images/lesson/add-single-lesson.svg";
import CloseCircle from "../../assets/dashboard/close-circle.svg";
import FileUpload from "../../assets/images/lesson/fileupload-icon.svg";
import { showCard, closeCard } from "../../data/helpers/show-hide-card";
import PaginationComponent from "../../components/shared/pagination/pagination";
import { Circles } from "react-loader-spinner";
import {
    addLessonPlanImage,
    bulkdeleteLessonPlan,
    deleteLessonPlan,
    downloadLessonPlanDoc,
    downloadLessonPlanPDF,
    getClasses,
    getLessonPlan,
    getSubjectsAPI,
    getSubjectsByClassAPI,
    searchLessonPlan,
    updateLessonPlan,
    uploadBulkLessonPlan,
    uploadLessonPlan,
} from "../../data/helpers/services";
import { CreateLessonPlan, LessonPlanModel } from "../../data/models/lessonplan";
import moment from "moment";
import { ClassModel } from "../../data/models/class";
import debounce from "lodash/debounce";
import { toast } from "react-hot-toast";
import { confirmDialog } from "primereact/confirmdialog";
import { ClassSubjectModel, SubjectModel } from "../../data/models/subjects";
import { Link } from "react-router-dom";
import {isObjArray, sortClass} from "../../data/helpers/utility";
import { Spinner } from "react-bootstrap";

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
    tableData: LessonPlanModel[];
    classes: ClassModel[];
    lessonObj: CreateLessonPlan;
    dataPerPage: number;
    totalPageDate: number;
    currentPage: number;
    files: File[];
    lessonImg: File[];
    selectedItems: any;
    subject: ClassSubjectModel[];
    isLoading: boolean;
    isSearching: boolean;
    searchQuery: string;
    isShowMobileSearch:boolean
}

class LessonPlan extends React.Component<any, State> {
    constructor(props: any) {
        super(props);

        let tableData: LessonPlanModel[] = [];

        this.state = {
            dataField: "SN",
            order: "asc",
            tableData: tableData,
            lessonObj: {} as CreateLessonPlan,
            dataPerPage: 20,
            totalPageDate: 0,
            currentPage: 1,
            files: [] as File[],
            lessonImg: {} as File[],
            classes: [],
            subject: [],
            selectedItems: [],
            isLoading: false,
            isSearching: false,
            searchQuery: "",
            isShowMobileSearch:false
        };
        this.searchData = debounce(this.searchData.bind(this), 500);
        this.searchClass = debounce(this.searchClass.bind(this), 500);
    }

    componentDidMount(): void {
        this.getLessonPlans();
        this.nextClass();
        getSubjectsAPI();
    }

    getLessonPlans = (query?: any) => {
    this.setState({ isLoading: true });
    getLessonPlan(this.state.currentPage, this.state.dataPerPage, query || "")
.then((res) => {
    this.setState({ tableData: res.data.data, totalPageDate: res.data.totalRecords, isLoading: false });
})
.catch((err) => {
    toast.error(err.message);
    this.setState({ isLoading: false });
});
};
searchLessonPlans = (query?: any) => {
    this.setState({ isSearching: true, tableData: [] });
    searchLessonPlan(query || "")
        .then((res) => {
            this.setState({ tableData: res.data.data, totalPageDate: res.data.totalRecords, isSearching: false });
        })
        .catch((err) => {
            this.setState({ isSearching: true });
            toast.error(err.message);
        });
};
nextClass = (query?: string) => {
    getClasses("", "", query || "")
        .then((res) => {
            this.setState({ classes: sortClass(res.data) });
        })
        .catch((err) => {
            toast.error(err.message);
        });
};
getSubjects = (query?: string) => {
    getSubjectsByClassAPI(this.state.lessonObj.className || "", query).then((res) => {
        this.setState((prev) => ({ subject: res.data.data }));
    });
};
pageHandler = (pageNumber: any) => {
    if (this.state.searchQuery.length > 0) {
        this.setState({ currentPage: pageNumber }, () => {
            searchLessonPlan(this.state.searchQuery, pageNumber)
                .then((res) => {
                    this.setState({ tableData: res.data.data, totalPageDate: res.data.totalRecords });
                })
                .catch((err) => {
                    toast.error(err.message);
                });
        });
    } else {
        this.setState({ currentPage: pageNumber }, () => {
            this.getLessonPlans();
        });
    }
};

handleAllChecked = (event: any) => {
    let records: any = this.state.tableData;
    records.forEach((record: any) => (record.isChecked = event.target.checked));
    this.setState({ tableData: records });
    if (event.target.checked) {
        this.setSelectedItemState();
    } else {
        this.setState({ selectedItems: [] });
    }
};

handleCheckChieldElement = (event: any) => {
    let records: any = this.state.tableData;
    records.forEach((record: any) => {
        if (record.id == event.target.value) record.isChecked = event.target.checked;
    });
    this.setState({ tableData: records }, () => {
        this.setSelectedItemState();
    });
};
setSelectedItemState() {
    let tempdata: any = [];
    this.state.tableData.map((e) => {
        if (e.isChecked == true) {
            tempdata.push(e.id);
        }
    });
    this.setState({ selectedItems: [...tempdata] });
}
sortTableData(key: any, order: any) {
    let records: any[] = this.state.tableData;
    if (order === "asc") {
        records.sort((a, b) => (a[key] < b[key] ? -1 : 1));
    } else {
        records.sort((a, b) => (a[key] > b[key] ? -1 : 1));
    }
    this.setState({ dataField: key, order: order, tableData: records });
}

uploadFile = (event: any) => {
    if (this.state.lessonObj.lesson_doc == undefined || this.state.lessonObj.lesson_pdf == undefined) {
        if (event.target.files[0].type.includes("pdf") && this.state.lessonObj.lesson_pdf == undefined) {
            this.setState((prev) => ({ lessonObj: { ...prev.lessonObj, lesson_pdf: event.target.files[0] as File } }));
        } else if ((event.target.files[0].type.includes("doc") || event.target.files[0].type.includes("docx")
            || event.target.files[0].type.includes("dotx")) && this.state.lessonObj.lesson_doc == undefined) {
            this.setState((prev) => ({ lessonObj: { ...prev.lessonObj, lesson_doc: event.target.files[0] as File } }));
        } else {
            toast.error("You can only upload 1 pdf and 1 word document,use the bulk create for multiple documents");
        }
    } else {
        toast.error("You can only upload 1 pdf and 1 word document,use the bulk create for multiple documents");
    }
};

addBulkLessonPlan = () => {
    this.clearLessonObjValue();
    showCard("bulkLessonPlanCard", "bulkLessonPlanCardOverlay");
};
uploadExcel = (event: any) => {
    if (this.state.lessonObj.excel == undefined || this.state.lessonObj.zip == undefined) {
        if (event.target.files[0].type.includes("zip") && this.state.lessonObj.zip == undefined) {
            this.setState((prev) => ({ lessonObj: { ...prev.lessonObj, zip: event.target.files[0] as File } }));
        } else if (!event.target.files[0].type.includes("zip") && this.state.lessonObj.excel == undefined) {
            this.setState((prev) => ({ lessonObj: { ...prev.lessonObj, excel: event.target.files[0] as File } }));
        } else {
            toast.error("You can only upload 1 excel and 1 zip,use the bulk create for multiple documents");
        }
    } else {
        toast.error("Kindly upload excela and zip");
    }
};
removeExcelFile = (file: string) => {
    if (file == "excel") {
        this.setState((prev) => ({ lessonObj: { ...prev.lessonObj, excel: null } }));
    } else if (file == "zip") {
        this.setState((prev) => ({ lessonObj: { ...prev.lessonObj, zip: null } }));
    }
};
removeFile = (i: any) => {
    if (i == "pdf") {
        this.setState((prev) => ({ lessonObj: { ...prev.lessonObj, lesson_pdf: null } }));
    } else {
        this.setState((prev) => ({ lessonObj: { ...prev.lessonObj, lesson_doc: null } }));
    }
};

uploadLessonPlan = () => {
    this.setState(
        (prev) => ({ lessonObj: { ...prev.lessonObj } }),
        () => {
            toast
                .promise(uploadLessonPlan(this.state.lessonObj), {
                    loading: "Uploading",
                    success: "Upload successful",
                    error: "Error adding lesson plan, Please try again",
                })
                .then(() => {
                    this.getLessonPlans();
                    this.clearLessonObjValue();
                    closeCard("singleLessonPlanCard", "singleLessonPlanCardOverlay");
                });
        }
    );
};
uploadBulkLessonPlan = () => {
    if (this.state.lessonObj.excel == undefined || this.state.lessonObj.zip == undefined) {
        toast.error("Please upload the excel and zip file");
        return;
    }
    this.setState(
        (prev) => ({ lessonObj: { ...prev.lessonObj } }),
        () => {
            toast
                .promise(uploadBulkLessonPlan(this.state.lessonObj), {
                    loading: "Uploading excel",
                    success: "Excel upload successfull",
                    error: "Error uploading excel, Please try again",
                })
                .then(() => {
                    this.clearLessonObjValue();
                    closeCard("bulkLessonPlanCard", "bulkLessonPlanCardOverlay");
                    setTimeout(() => {
                        this.getLessonPlans();
                    }, 3000);
                });
        }
    );
};

setUpdateLessonPlanObj = (lessonplan: LessonPlanModel) => {
    this.setState(
        (prev) => ({
            lessonObj: {
                ...prev.lessonObj,
                serialNo: lessonplan.serialNo,
                classId: lessonplan.classId,
                subjectId: lessonplan.subjectId,
                topicNo: lessonplan.topicNo.toString(),
                topic: lessonplan.topic,
                className: lessonplan.Class.name,
                subjectName: lessonplan.Subject?.name,
                lessonId: lessonplan.id,
                keywords: lessonplan.keywords,
                lesson_doc: lessonplan.docName,
                lesson_pdf: lessonplan.docPdfName,
            },
        }),
        () => {
            showCard("editLessonPlanCard", "editLessonPlanCardOverlay");
        }
    );
};

downloadLessonPlanDoc = (lessonplan: LessonPlanModel) => {
    this.setState(
        (prev) => ({
            lessonObj: {
                ...prev.lessonObj,
                classId: lessonplan.classId,
                subjectId: lessonplan.subjectId,
                topicNo: lessonplan.topicNo.toString(),
                topic: lessonplan.topic,
                className: lessonplan.Class?.name,
                subjectName: lessonplan.Subject?.name,
                lessonId: lessonplan.id,
            },
        }),
        () => {
            toast.promise(downloadLessonPlanDoc(lessonplan.docName, this.state.lessonObj), {
                loading: "Downloading lesson plan",
                success: "Donwload complete",
                error: "Error downloading lesson plan, Please try again",
            });
        }
    );
};

downloadLessonPlanPdf = (lessonplan: LessonPlanModel) => {
    this.setState(
        (prev) => ({
            lessonObj: {
                ...prev.lessonObj,
                classId: lessonplan.classId,
                subjectId: lessonplan.subjectId,
                topicNo: lessonplan.topicNo.toString(),
                topic: lessonplan.topic,
                className: lessonplan.Class.name,
                subjectName: lessonplan.Subject?.name,
                lessonId: lessonplan.id,
            },
        }),
        () => {
            toast.promise(downloadLessonPlanPDF(lessonplan.docPdfName, this.state.lessonObj), {
                loading: "Downloading lesson plan",
                success: "Donwload complete",
                error: "Error downloading lesson plan, Please try again",
            });
        }
    );
};
updateLessonPlan = () => {
    toast
        .promise(updateLessonPlan(this.state.lessonObj, this.state.lessonObj.lessonId), {
            loading: "Updating lesson plan",
            success: "Your have successfully updated your lesson planner",
            error: "Error updating lesson plan, Please try again",
        })
        .then(() => {
            closeCard("editLessonPlanCard", "editLessonPlanCardOverlay");
            this.getLessonPlans();
        });
};
clearLessonObjValue = () => {
    this.setState({ lessonObj: {} as any, files: [] });
};
deleteLessonPlan = (data: LessonPlanModel) => {
    confirmDialog({
        message: "Do you want to delete this record?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        acceptClassName: "p-button-danger",
        accept: () => {
            toast.promise(
                deleteLessonPlan(data.id).then(() => {
                    this.getLessonPlans();
                }),
                {
                    loading: "Deleting lesson plan",
                    success: (res: any) => `Lesson plan deleted successfully`,
                    error: `Error deleting class`,
                }
            );
        },
        reject: () => {},
    });
};
bulkdeleteLessonPlan = () => {
    confirmDialog({
        message: "Do you want to delete selected record?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        acceptClassName: "p-button-danger",
        accept: () => {
            toast.promise(
                bulkdeleteLessonPlan(this.state.selectedItems).then(() => {
                    this.getLessonPlans();
                    this.setState({ selectedItems: [] });
                }),
                {
                    loading: "Deleting lessonplans",
                    success: (res: any) => `Lesson plans deleted successfully`,
                    error: `Error deleting class`,
                }
            );
        },
        reject: () => {},
    });
};
setAddimageLessonPlanObj = (lessonplan: LessonPlanModel) => {
    this.setState(
        (prev) => ({
            lessonObj: {
                ...prev.lessonObj,
                serialNo: lessonplan.serialNo,
                classId: lessonplan.classId,
                subjectId: lessonplan.subjectId,
                topicNo: lessonplan.topicNo.toString(),
                topic: lessonplan.topic,
                className: lessonplan.Class.name,
                subjectName: lessonplan.Subject?.name,
                lessonId: lessonplan.id,
                keywords: lessonplan.keywords,
                lesson_doc: lessonplan.docName,
                lesson_pdf: lessonplan.docPdfName,
            },
        }),
        () => {
            showCard("addPictureCard", "addPictureCardOverlay");
        }
    );
};
uploadLessonImage = (e: any) => {
    if(this.state.lessonImg[0]){
        const images = this.state.lessonImg as File[]
        const imageCopy = [...images,...Array.from(e.target.files)]
        this.setState({ lessonImg: imageCopy as File[] });
    } else{
        this.setState({ lessonImg: Array.from(e.target.files)});
    }

};
removeLessonImage = (index:any) => {
    const images = this.state.lessonImg.filter((_,i) => i != index)
    this.setState({ lessonImg: images });
};
addLessonPlanImage = () => {
    let body = {
        lessonId: this.state.lessonObj.lessonId,
    };
    toast
        .promise(addLessonPlanImage(body, this.state.lessonImg), {
            loading: "Adding lesson plan image",
            success: "Picture added succesfully",
            error: "Error adding picture, Please try again",
        })
        .then(() => {
            closeCard("addPictureCard", "addPictureCardOverlay");
            this.clearLessonObjValue();
        })
        .catch(() => {
            closeCard("addPictureCard", "addPictureCardOverlay");
            this.clearLessonObjValue();
            this.setState({lessonImg: []})
        });
};

searchData = (e: any) => {
    let query = e.target.value;
    this.setState({ searchQuery: e.target.value });
    this.searchLessonPlans(query);
};

searchClass = (e: any) => {
    let query = e.target.value;
    this.nextClass(query);
};
searchSubject = (e: any) => {
    let query = e.target.value;
    this.getSubjects(query);
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
                    <div className="header">Lesson Plan</div>
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
                            placeholder="Search for a serial number, subject, topic etc"
                        />
                        <XCircle onClick={()=>this.setState({isShowMobileSearch:false})} className="hideSearch"/>
                    </div>
                    <div className="inner-btn-wrap">
                        {this.state.selectedItems.length > 0 ? (
                            <div onClick={() => this.bulkdeleteLessonPlan()} className="delete-button">
                                Delete selected items
                            </div>
                        ) : (
                            ""
                        )}
                        <div className="btn-wrap-drop">
                            {" "}
                            <Dropdown className="more-dropdown">
                                <Dropdown.Toggle className="add-lesson" variant="success" id="dropdown-basic">
                                    <div className="cta-button" style={ctaBtn}>
                                        Add Lesson Plan
                                    </div>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        onClick={() => {
                                            showCard("singleLessonPlanCard", "singleLessonPlanCardOverlay");
                                            this.setState({ lessonObj: {} as any });
                                        }}
                                    >
                                        {" "}
                                        <img src={AddBulkLesson} alt="EditPlan" /> Add single lesson plan
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.addBulkLessonPlan()}>
                                        <img src={AddSinglePlan} alt="DownloadPdf" /> Add bulk lesson plan
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>{" "}
                        </div>
                    </div>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead>
                        <tr>
                            <th>
                                <input type="checkbox" name="selectAll" id="selectAll" onChange={this.handleAllChecked} />
                            </th>
                            <th>
                                SN{" "}
                                {this.state.dataField === "id" ? (
                                    <CaretUpFill onClick={() => this.sortTableData("id", "asc")} style={ArrowUp} />
                                ) : (
                                    <CaretDownFill onClick={() => this.sortTableData("id", "desc")} style={ArrowDown} />
                                )}{" "}
                            </th>
                            <th>
                                Serial Number{" "}
                                {this.state.dataField === "serialNo" ? (
                                    <CaretUpFill onClick={() => this.sortTableData("serialNo", "asc")} style={ArrowUp} />
                                ) : (
                                    <CaretDownFill onClick={() => this.sortTableData("serialNo", "desc")} style={ArrowDown} />
                                )}{" "}
                            </th>
                            <th>
                                Subject{" "}
                                {this.state.dataField === "Subject.name}" ? (
                                    <CaretUpFill style={ArrowUp} onClick={() => this.sortTableData("Subject.name}", "asc")} />
                                ) : (
                                    <CaretDownFill style={ArrowDown} onClick={() => this.sortTableData("Subject.name}", "desc")} />
                                )}{" "}
                            </th>
                            <th>
                                Topic{" "}
                                {this.state.dataField === "topic" ? (
                                    <CaretUpFill style={ArrowUp} onClick={() => this.sortTableData("topic", "asc")} />
                                ) : (
                                    <CaretDownFill style={ArrowDown} onClick={() => this.sortTableData("topic", "desc")} />
                                )}{" "}
                            </th>
                            <th>
                                Topic No{" "}
                                {this.state.dataField === "topicNo" ? (
                                    <CaretUpFill style={ArrowUp} onClick={() => this.sortTableData("topicNo", "asc")} />
                                ) : (
                                    <CaretDownFill style={ArrowDown} onClick={() => this.sortTableData("topicNo", "desc")} />
                                )}{" "}
                            </th>
                            <th>
                                Doc Type{" "}
                                {this.state.dataField === "docName" ? (
                                    <CaretUpFill style={ArrowUp} onClick={() => this.sortTableData("docName", "asc")} />
                                ) : (
                                    <CaretDownFill style={ArrowDown} onClick={() => this.sortTableData("docName", "desc")} />
                                )}{" "}
                            </th>
                            <th>
                                free{" "}
                                {this.state.dataField === "freeStatus" ? (
                                    <CaretUpFill style={ArrowUp} onClick={() => this.sortTableData("freeStatus", "asc")} />
                                ) : (
                                    <CaretDownFill style={ArrowDown} onClick={() => this.sortTableData("freeStatus", "desc")} />
                                )}{" "}
                            </th>
                            <th>
                                Date Posted{" "}
                                {this.state.dataField === "created" ? (
                                    <CaretUpFill style={ArrowUp} onClick={() => this.sortTableData("created", "asc")} />
                                ) : (
                                    <CaretDownFill style={ArrowDown} onClick={() => this.sortTableData("created", "desc")} />
                                )}{" "}
                            </th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.tableData &&
                            this.state.tableData.map((value: any, index: any) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name="selectAll"
                                                id="selectAll"
                                                onChange={this.handleCheckChieldElement}
                                                checked={this.state.tableData[index].isChecked}
                                                value={this.state.tableData[index].id}
                                            />
                                        </td>
                                        <td>{this.state.tableData[index].id}</td>
                                        <td>{this.state.tableData[index].serialNo}</td>
                                        <td>{this.state.tableData[index].Subject?.name}</td>
                                        <td>{this.state.tableData[index].topic}</td>
                                        <td>{this.state.tableData[index].topicNo}</td>
                                        <td>{`${this.state.tableData[index].docName ? "MsWord" : ""} ${
                                            this.state.tableData[index].docName && this.state.tableData[index].docPdfName ? "," : ""
                                        } ${this.state.tableData[index].docPdfName ? "pdf" : ""} `}</td>
                                        <td>{this.state.tableData[index].freeStatus}</td>
                                        <td>{moment(this.state.tableData[index].created).format("MMM Do, YYYY")}</td>
                                        <td>
                                            <Dropdown className="more-dropdown">
                                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                    <img src={Kebab} alt="more action" />
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => this.setUpdateLessonPlanObj(value)}>
                                                        {" "}
                                                        <img src={EditPlan} alt="EditPlan" /> Edit Lesson Plan
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => this.setAddimageLessonPlanObj(value)}>
                                                        <img src={GalleryAdd} alt="DownloadPdf" /> Add Picture
                                                    </Dropdown.Item>
                                                    <Dropdown.Item as={Link} to={`managepicture/${value.id}`}>
                                                        <img src={GalleryManage} alt="DownloadPdf" />
                                                        Manage Picture
                                                    </Dropdown.Item>
                                                    <Dropdown.Item  as={Link} to={value.docPdfName}>
                                                        <img src={DownloadPdf} alt="DownloadPdf" /> Download PDF
                                                    </Dropdown.Item>
                                                    <Dropdown.Item as={Link} to={value.docName}>
                                                        <img src={DownloadMsWord} alt="DownloadMsWord" /> Download Ms Word
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => this.deleteLessonPlan(value)}>
                                                        <img src={DeletePlan} alt="DeletePlan" /> Delete Lesson Plan
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </td>
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
                        totalPosts={this.state.totalPageDate}
                    />
                </div>

                {/* Mobile Screen */}
                <div className="mobile-section">
                    <div className="content-wrap">
                        {this.state.tableData &&
                            this.state.tableData.map((value: any, index: any) => {
                                return (
                                    <div key={index} className="card">
                                        <div className="row">
                                            <div className="bold-text">{this.state.tableData[index].Subject?.name}</div>
                                            <div className="light-text">{this.state.tableData[index].serialNo} | {moment(this.state.tableData[index].created).format('MMM Do, YYYY')}</div>
                                        </div>
                                        <div className="row">
                                            <div className="green-text">{`${this.state.tableData[index].docName ? "MsWord" : ""} ${
                                                this.state.tableData[index].docName && this.state.tableData[index].docPdfName ? "," : ""
                                            } ${this.state.tableData[index].docPdfName ? "pdf" : ""} `}</div>
                                            <div className="normal-text">Yes</div>
                                        </div>
                                        <div className="row">
                                            <Dropdown className="more-dropdown">
                                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                    <img src={Kebab} alt="more action" />
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => this.setUpdateLessonPlanObj(value)}>
                                                        {" "}
                                                        <img src={EditPlan} alt="EditPlan" /> Edit Lesson Plan
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => this.setAddimageLessonPlanObj(value)}>
                                                        <img src={GalleryAdd} alt="DownloadPdf" /> Add Picture
                                                    </Dropdown.Item>
                                                    <Dropdown.Item as={Link} to={`managepicture/${value.id}`}>
                                                        <img src={GalleryManage} alt="DownloadPdf" />
                                                        Manage Picture
                                                    </Dropdown.Item>
                                                    <Dropdown.Item  as={Link} to={value.docPdfName}>
                                                        <img src={DownloadPdf} alt="DownloadPdf" /> Download PDF
                                                    </Dropdown.Item>
                                                    <Dropdown.Item as={Link} to={value.docName}>
                                                        <img src={DownloadMsWord} alt="DownloadMsWord" /> Download Ms Word
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => this.deleteLessonPlan(value)}>
                                                        <img src={DeletePlan} alt="DeletePlan" /> Delete Lesson Plan
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
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
                        <div className="btn-wrap-drop">
                            {" "}
                            <Dropdown className="more-dropdown">
                                <Dropdown.Toggle className="add-lesson" variant="success" id="dropdown-basic">
                                    <div className="cta-button">
                                        Add Lesson Plan
                                    </div>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        onClick={() => {
                                            showCard("singleLessonPlanCard", "singleLessonPlanCardOverlay");
                                            this.setState({ lessonObj: {} as any });
                                        }}
                                    >
                                        {" "}
                                        <img src={AddBulkLesson} alt="EditPlan" /> Add single lesson plan
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => this.addBulkLessonPlan()}>
                                        <img src={AddSinglePlan} alt="DownloadPdf" /> Add bulk lesson plan
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>{" "}
                        </div>
                    </div>
                </div>

                {/* Add Single Lesson Plan Card */}
                <div id="singleLessonPlanCardOverlay" className="action-overlay">
                    <div id="singleLessonPlanCard" className="action-card-wrap">
                        <div className="card-header">
                            <div className="card-title">Add a Single Lesson Plan</div>
                            <img onClick={() => closeCard("singleLessonPlanCard", "singleLessonPlanCardOverlay")} src={CloseCircle} alt="close" />
                        </div>
                        <div className="form-wrap">
                            <div className="input-wrap">
                                <Dropdown className="select-dropdown">
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        <label htmlFor="class">Class</label>
                                        <input value={this.state.lessonObj.className || ""} readOnly className="control select" name="class" type="text" />
                                        <img className="arrow-down" src={WhiteDropDown} alt="dropdown" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <div className="searchClass">
                                            {" "}
                                            <Search className="search-icon" />{" "}
                                            <input
                                                type="text"
                                                onKeyUp={this.searchClass}
                                                className="search-input"
                                                name="searchClass"
                                                id="searchClass"
                                                placeholder="Search class"
                                            />
                                        </div>
                                        {this.state.classes &&
                                            this.state.classes.map((value: ClassModel, index: any) => {
                                                return (
                                                    <Dropdown.Item
                                                        key={index}
                                                        onClick={() =>
                                                            this.setState(
                                                                (prev) => ({
                                                                    lessonObj: { ...prev.lessonObj, classId: value.classId, className: value.name },
                                                                }),
                                                                () => this.getSubjects()
                                                            )
                                                        }
                                                    >
                                                        {value.name}
                                                    </Dropdown.Item>
                                                );
                                            })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="input-wrap">
                                <Dropdown className="select-dropdown">
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        <label htmlFor="class">Subject</label>
                                        <input value={this.state.lessonObj.subjectName || ""} readOnly className="control select" name="class" type="text" />
                                        <img className="arrow-down" src={WhiteDropDown} alt="dropdown" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <div className="searchClass">
                                            {" "}
                                            <Search className="search-icon" />{" "}
                                            <input
                                                type="text"
                                                onKeyUp={this.searchSubject}
                                                className="search-input"
                                                name="searchClass"
                                                id="searchClass"
                                                placeholder="Search class"
                                            />
                                        </div>
                                        {this.state.subject &&
                                            this.state.subject.map((value: ClassSubjectModel, index: any) => {
                                                return (
                                                    <Dropdown.Item
                                                        key={index}
                                                        onClick={() =>
                                                            this.setState((prev) => ({
                                                                lessonObj: { ...prev.lessonObj, subjectId: value.subjectId, subjectName: value.subjectName },
                                                            }))
                                                        }
                                                    >
                                                        {value.subjectName}
                                                    </Dropdown.Item>
                                                );
                                            })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="input-wrap">
                                <label htmlFor="class">Topic</label>
                                <input
                                    value={this.state.lessonObj.topic || ""}
                                    onChange={(event) => this.setState((prev) => ({ lessonObj: { ...prev.lessonObj, topic: event.target.value } }))}
                                    className="control text"
                                    name="Topic"
                                    type="text"
                                />
                            </div>
                            {/* <div className="input-wrap">
                  <label htmlFor="topicNo">Topic No</label>
                  <input
                    value={this.state.lessonObj.topicNo || ""}
                    onChange={(event) => this.setState((prev) => ({ lessonObj: { ...prev.lessonObj, topicNo: event.target.value } }))}
                    className="control text"
                    name="TopicNo"
                    type="number"
                  />
                </div> */}
                            <div className="input-wrap">
                                <label htmlFor="class">Keywords</label>
                                <input
                                    value={this.state.lessonObj.keywords || ""}
                                    onChange={(event) => this.setState((prev) => ({ lessonObj: { ...prev.lessonObj, keywords: event.target.value } }))}
                                    className="control text"
                                    name="Keywords"
                                    type="text"
                                />
                            </div>

                            <div className="input-wrap file">
                                <label htmlFor="class">Upload Document</label>
                                <div className="file-input-wrap">
                                    <input onChange={this.uploadFile} type="file" accept={'.doc,.docx,.pdf'} className="control text file" name="Upload Document" />
                                    <span className="input-label">
                      <img src={FileUpload} alt="FileUpload" /> Upload file here or <span className="green-text">Choose</span> from your
                      device
                    </span>
                                </div>
                                <div className="info-wrap">
                                    <InfoCircle />
                                    <div>Please note that the documents types that can be uploaded (Ms Word & PDF)</div>
                                </div>
                            </div>
                            <div className="uploaded-file-list">
                                {this.state.lessonObj.lesson_doc ? (
                                    <div className="file">
                                        <p className="file-name"> {this.state.lessonObj.lesson_doc.name}</p>
                                        <XCircle onClick={() => this.removeFile("word")} className="remove" />
                                    </div>
                                ) : (
                                    ""
                                )}
                                {this.state.lessonObj.lesson_pdf ? (
                                    <div className="file">
                                        <p className="file-name"> {this.state.lessonObj.lesson_pdf.name}</p>
                                        <XCircle onClick={() => this.removeFile("pdf")} className="remove" />
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="submit-button">
                                <button onClick={this.uploadLessonPlan}>Upload Lesson Plan</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add bulk lesson plan */}
                <div id="bulkLessonPlanCardOverlay" className="action-overlay">
                    <div id="bulkLessonPlanCard" className="action-card-wrap">
                        <div className="card-header">
                            <div className="card-title">Add a Bulk Lesson Plan</div>
                            <img src={CloseCircle} alt="close" onClick={() => closeCard("bulkLessonPlanCard", "bulkLessonPlanCardOverlay")} />
                        </div>
                        <div className="form-wrap">
                            <div className="input-wrap">
                                <Dropdown className="select-dropdown">
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        <label htmlFor="class">Class</label>
                                        <input value={this.state.lessonObj.className || ""} readOnly className="control select" name="class" type="text" />
                                        <img className="arrow-down" src={WhiteDropDown} alt="dropdown" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <div className="searchClass">
                                            {" "}
                                            <Search className="search-icon" />{" "}
                                            <input
                                                type="text"
                                                onKeyUp={this.searchClass}
                                                className="search-input"
                                                name="searchClass"
                                                id="searchClass"
                                                placeholder="Search class"
                                            />
                                        </div>

                                        {this.state.classes &&
                                            this.state.classes.map((value: ClassModel, index: any) => {
                                                return (
                                                    <Dropdown.Item
                                                        onClick={() =>
                                                            this.setState(
                                                                (prev) => ({ lessonObj: { ...prev.lessonObj, className: value.name, classId: value.classId } }),
                                                                () => {
                                                                    this.getSubjects();
                                                                }
                                                            )
                                                        }
                                                        key={index}
                                                    >
                                                        {value.name}
                                                    </Dropdown.Item>
                                                );
                                            })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="input-wrap">
                                <Dropdown className="select-dropdown">
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        <label htmlFor="class">Subject</label>
                                        <input value={this.state.lessonObj.subjectName || ""} readOnly className="control select" name="class" type="text" />
                                        <img className="arrow-down" src={WhiteDropDown} alt="dropdown" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <div className="searchClass">
                                            {" "}
                                            <Search className="search-icon" />{" "}
                                            <input
                                                type="text"
                                                onKeyUp={this.searchSubject}
                                                className="search-input"
                                                name="searchClass"
                                                id="searchClass"
                                                placeholder="Search subject"
                                            />
                                        </div>
                                        {this.state.subject &&
                                            this.state.subject.map((value: ClassSubjectModel, index: any) => {
                                                return (
                                                    <Dropdown.Item
                                                        onClick={() =>
                                                            this.setState((prev) => ({
                                                                lessonObj: { ...prev.lessonObj, subjectName: value.subjectName, subjectId: value.subjectId },
                                                            }))
                                                        }
                                                        key={index}
                                                    >
                                                        {value.subjectName}
                                                    </Dropdown.Item>
                                                );
                                            })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="input-wrap file">
                                <label htmlFor="class">Upload Files (Zipped & Excel)</label>
                                <div className="file-input-wrap">
                                    <input
                                        onChange={this.uploadExcel}
                                        accept=".xls,.xlsx,.zip,.rar,.7zip"
                                        className="control text file"
                                        name="Upload Document"
                                        type="file"
                                    />
                                    <span className="input-label">
                      <img src={FileUpload} alt="FileUpload" /> Upload file here or <span className="green-text">Choose</span> from your
                      device
                    </span>
                                </div>
                                <div className="info-wrap">
                                    <InfoCircle />
                                    <div>
                                        Compress all documents into a ZIp archive and Upload via the form above. For Auto mapping of Zip documents to Excel
                                        Content Upload, ensure that each Ms Document or PDF is renamed as the exact Lesson Plan Serial Number you wish to map
                                        it to.
                                    </div>
                                </div>
                            </div>
                            <div className="upload-template">
                                <a href="https://drive.google.com/uc?export=download&id=147Ry1qf-MFTBdbXjPQcT2zuTPGi15NQC" download>
                                    Download Excel Template
                                </a>
                            </div>
                            <div className="uploaded-file-list">
                                {this.state.lessonObj.excel ? (
                                    <div className="file">
                                        <p className="file-name"> {this.state.lessonObj.excel.name}</p>
                                        <XCircle onClick={() => this.removeExcelFile("excel")} className="remove" />
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="uploaded-file-list">
                                {this.state.lessonObj.zip ? (
                                    <div className="file">
                                        <p className="file-name"> {this.state.lessonObj.zip.name}</p>
                                        <XCircle onClick={() => this.removeExcelFile("zip")} className="remove" />
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="submit-button">
                                <button onClick={this.uploadBulkLessonPlan}>Upload Lesson Plan</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Lesson Plan Card */}
                <div id="editLessonPlanCardOverlay" className="action-overlay">
                    <div id="editLessonPlanCard" className="action-card-wrap">
                        <div className="card-header">
                            <div className="card-title">Edit Lesson</div>
                            <img onClick={() => closeCard("editLessonPlanCard", "editLessonPlanCardOverlay")} src={CloseCircle} alt="close" />
                        </div>
                        <div className="form-wrap">
                            <div className="input-wrap">
                                <label htmlFor="serialNumber">Serial Number</label>
                                <input disabled value={this.state.lessonObj.serialNo || ""} className="control text" name="Title" type="text" />
                            </div>

                            <div className="input-wrap">
                                <Dropdown className="select-dropdown">
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        <label htmlFor="class">Class</label>
                                        <input value={this.state.lessonObj.className || ""} readOnly className="control select" name="class" type="text" />
                                        <img className="arrow-down" src={WhiteDropDown} alt="dropdown" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <div className="searchClass">
                                            {" "}
                                            <Search className="search-icon" />{" "}
                                            <input
                                                type="text"
                                                onKeyUp={this.searchClass}
                                                className="search-input"
                                                name="searchClass"
                                                id="searchClass"
                                                placeholder="Search class"
                                            />
                                        </div>

                                        {this.state.classes &&
                                            this.state.classes.map((value: ClassModel, index: any) => {
                                                return (
                                                    <Dropdown.Item
                                                        onClick={() =>
                                                            this.setState(
                                                                (prev) => ({ lessonObj: { ...prev.lessonObj, className: value.name, classId: value.classId } }),
                                                                () => {
                                                                    this.getSubjects();
                                                                }
                                                            )
                                                        }
                                                        key={index}
                                                    >
                                                        {value.name}
                                                    </Dropdown.Item>
                                                );
                                            })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="input-wrap">
                                <Dropdown className="select-dropdown">
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        <label htmlFor="subject">Subject</label>
                                        <input value={this.state.lessonObj.subjectName || ""} readOnly className="control select" name="class" type="text" />
                                        <img className="arrow-down" src={WhiteDropDown} alt="dropdown" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <div className="searchClass">
                                            {" "}
                                            <Search className="search-icon" />{" "}
                                            <input
                                                type="text"
                                                onKeyUp={this.searchClass}
                                                className="search-input"
                                                name="searchClass"
                                                id="searchClass"
                                                placeholder="Search subject"
                                            />
                                        </div>
                                        {this.state.subject &&
                                            this.state.subject.map((value: ClassSubjectModel, index: any) => {
                                                return <Dropdown.Item key={index}>{value.subjectName}</Dropdown.Item>;
                                            })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>

                            <div className="input-wrap">
                                <label htmlFor="topic">Topic</label>
                                <input
                                    value={this.state.lessonObj.topic || ""}
                                    className="control text"
                                    name="topic"
                                    type="text"
                                    onChange={(event) => this.setState((prev) => ({ lessonObj: { ...prev.lessonObj, topic: event.target.value } }))}
                                />
                            </div>
                            <div className="input-wrap">
                                <label htmlFor="topicNumber">Topic Number</label>
                                <input
                                    className="control text"
                                    value={this.state.lessonObj.topicNo || ""}
                                    name="topicNumber"
                                    type="text"
                                    onChange={(event) => this.setState((prev) => ({ lessonObj: { ...prev.lessonObj, topicNo: event.target.value } }))}
                                />
                            </div>
                            <div className="input-wrap">
                                <label htmlFor="keywords">keywords</label>
                                <textarea
                                    value={this.state.lessonObj.keywords || ""}
                                    className="control text"
                                    placeholder="Write Content"
                                    name="keywords"
                                    onChange={(event) => this.setState((prev) => ({ lessonObj: { ...prev.lessonObj, keywords: event.target.value } }))}
                                ></textarea>
                            </div>
                            <div className="input-wrap">
                                <label htmlFor="keywords">Additional Content</label>
                                <textarea className="control text" placeholder="Write Content" name="keywords"></textarea>
                            </div>
                            <div className="input-wrap file">
                                <label htmlFor="class">Upload Document</label>
                                <div className="file-input-wrap">
                                    <input multiple onChange={this.uploadFile} className="control text file" name="Upload Document" type="file" />
                                    <span className="input-label">
                      <img src={FileUpload} alt="FileUpload" /> Upload file here or <span className="green-text">Choose</span> from your
                      device
                    </span>
                                </div>
                                <div className="info-wrap">
                                    <InfoCircle />
                                    <div>Please note that the documents types can be uploaded (Ms Word & PDF)</div>
                                </div>
                            </div>
                            {/* <div className="uploaded-file-list">
                  {this.state.lessonObj.lesson_doc ? (
                    <div className="file">
                      <p className="file-name">
                        {" "}
                        {this.state.lessonObj.lesson_doc.name ? this.state.lessonObj.lesson_doc.name : this.state.lessonObj.lesson_doc}
                      </p>
                      <XCircle onClick={() => this.removeFile("word")} className="remove" />
                    </div>
                  ) : (
                    ""
                  )}
                  {this.state.lessonObj.lesson_pdf ? (
                    <div className="file">
                      <p className="file-name">
                        {" "}
                        {this.state.lessonObj.lesson_pdf.name ? this.state.lessonObj.lesson_pdf.name : this.state.lessonObj.lesson_pdf}
                      </p>
                      <XCircle onClick={() => this.removeFile("pdf")} className="remove" />
                    </div>
                  ) : (
                    ""
                  )}
                </div> */}

                            <div className="submit-button">
                                <button onClick={this.updateLessonPlan}>Save Update</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Picture Card */}
                <div id="addPictureCardOverlay" className="action-overlay">
                    <div id="addPictureCard" className="action-card-wrap">
                        <div className="card-header">
                            <div className="card-title">Add Picture</div>
                            <img onClick={() => closeCard("addPictureCard", "addPictureCardOverlay")} src={CloseCircle} alt="close" />
                        </div>
                        <div className="form-wrap">
                            <div className="input-wrap">
                                <label htmlFor="class">Title</label>
                                <input className="control text" name="Title" type="text" />
                            </div>

                            <div className="input-wrap file">
                                <label htmlFor="class">Upload Document</label>
                                <div className="file-input-wrap">
                                    <input onChange={this.uploadLessonImage} multiple accept=".jpg,.jpeg,.png"  className="control text file" name="Upload Document" type="file" />
                                    <span className="input-label">
                      <img src={FileUpload} alt="FileUpload" /> Upload file here or <span className="green-text">Choose</span> from your
                      device
                    </span>
                                </div>
                                <div className="info-wrap">
                                    <InfoCircle />
                                    <div>Please note that you can upload multiple pictures in the format (JPG & PNG)</div>
                                </div>
                            </div>
                            <div className="uploaded-file-list">
                                {isObjArray(this.state.lessonImg) && this.state.lessonImg.map((img,index) => {
                                    return <div key={index} className="file">
                                        <p className="file-name"> {img.name}</p>
                                        <XCircle onClick={() => this.removeLessonImage(index)} className="remove" />
                                    </div>
                                })}
                            </div>
                            <div className="submit-button">
                                <button onClick={this.addLessonPlanImage}>Upload Picture</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
}

export default LessonPlan;
