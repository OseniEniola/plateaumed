import Pagination from "react-js-pagination";
import { useState } from "react";
import './pagination.scss'
import React from "react";

function PaginationComponent(props:any) {
  const [currentPage, setCurrentPage] = useState(1);
  const [width, setWidth] = useState<number>(window.innerWidth);
  // total records per page to display
  const recordPerPage = props.postsPerPage;
  // total number of the records
  const totalRecords = props.totalPosts;
  // range of pages in paginator
  const pageRange = width <= 820 ? 5 : 7;
  // handle change event
  const handlePageChange = (pageNumber:any) => {
    setCurrentPage(pageNumber);
    props.onChangepage(pageNumber);
    window.scrollTo(0, 0);
  };
  return (
    <div>
      <div className="page-pagination">
        <div className="tracker"> Showing {(currentPage - 1) * recordPerPage + 1 } - {(currentPage * recordPerPage)} of {totalRecords} results</div>
        <Pagination
         
          activePage={currentPage}
          itemsCountPerPage={recordPerPage}
          totalItemsCount={totalRecords}
          pageRangeDisplayed={pageRange}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}
export default PaginationComponent;
