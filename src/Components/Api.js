import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Pagination from "react-js-pagination";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

function Api() {
  const [posts, setPosts] = useState([]);
  const [id, setId] = useState(1);
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [topic, setTopic] = useState([]);
  const [qperp, setQperp] = useState(20);
  const [result, setResult] = useState([]);
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState([]);
  let navigate = useNavigate();
  let data;
  const accesstoken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWRkMjUzZWU2ZDdkNzdjOGU0ZjY4ODgiLCJfYWN0aXZlT3JnIjoiNjE5Y2U0YThlNTg2ODUxNDYxMGM4ZGE3IiwiaWF0IjoxNjQzMjYyOTEwLCJleHAiOjE2NDMzMDYxMTB9.-cEREE3t6uYIj8vm97fuYhM-zB4YJBl4VK4IuWhCk0I";

  axios.interceptors.request.use(
    (config) => {
      config.headers.authorization = `${accesstoken}`;
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  useEffect(() => {
    axios
      .get(`http://admin.liveexamcenter.in/api/questions?page=1&term=`)
      .then((res) => {
        console.log(res);
        setPosts(res.data);
        if(location.state==="QueAddsuccess")
          success();
        else if(location.state==="QueAddFail")
          fail();
        else if(location.state==="Questiondeleted")
          questiondeleted(); 
          console.log(location.state);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `http://admin.liveexamcenter.in/api/topics?page=1&limit=9007199254740991&term=`
      )
      .then((res) => {
        console.log(res);
        setTopic(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setResult(posts && posts.result);
  }, [posts])

  useEffect(() => {
    if (tests !== []) {
      setResult(tests);
    }
    console.log(tests);
  }, [tests])

  useEffect(() => {
    if (search !== []) {
      setResult(search);
    }
    else {
      setResult(posts && posts.result);
    }
    console.log(search);
  }, [search])

  useEffect(() => {
    setPages(result && result.slice(page, page + qperp));
  }, [result])
  useEffect(() => {
    setPages(result && result.slice(page, page + qperp));
  }, [qperp])

  useEffect(() => {
    setPages(result && result.slice(page, page + qperp));
  }, [page])

  useEffect(() => {
    console.log(pages);
  }, [pages])

  function htmlfunc(q, i) {
    return { __html: i + 1 + ")" + q.questionText };
  }

  let top = topic && topic.result;

  function deleteq(q) {
    if(window.confirm("Are You sure to delete the Question..."))
    {
    axios
      .delete(`http://admin.liveexamcenter.in/api/questions/${q._id}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    }
    navigate(`/`,{state:"Questiondeleted"});
  }

  function medium(e) {
    let tid;
    let temp = posts && posts.result;
    console.log(e.target.value);
    if (e.target.value === "All") {
      setTests(posts && posts.result);
      return;
    }
    top && top.map(t => t.name === e.target.value ? tid = t._id : t);
    setTests(temp && temp.filter(q => q.topic === tid));

    return;
  }

  function toggle() {

  }
  const success = () => toast.success("Question Added Succesfully....",{
    position: "bottom-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true,
    pauseOnHover: true, draggable: true, progress: undefined, });
  const fail = () => toast.error("Question Not Added Failed....",{position: "bottom-right", autoClose: 5000,
    hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined,
    });
   const questiondeleted =()=>{
    toast.success("Question Deleted Succesfully....",{
      position: "bottom-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true,
      pauseOnHover: true, draggable: true, progress: undefined, });
   };
  function searchs() {
    let name = document.getElementById("name").value;
    console.log(name);
    let temp = posts && posts.result;
    setSearch(temp && temp.filter(q => q.questionText.includes(name)));
  }

  function size(e) {

    if (document.getElementById("check").checked)
      setQperp(parseInt(e.target.value));
    setPage(0);
    console.log(qperp);
  }

  function handlePageChange(pagen) {
    setId(pagen);
    setPage(pagen * qperp);
  }

  let rcount = result && result.length;

  return (
   
    <div className="container border">
      <div><ToastContainer />
        <div className="row border">
        <div className="col-sm"><h1  className="fw-bolder"><br/>Questions</h1></div>
          <div className="col-sm">
            <button
              className="next"
              onClick={() => {
                navigate(`/Addq`, { state: { accesstoken } })
              }}
            >
              + Add Question
            </button>
          </div>
        </div>
        <br />
        <div className="row border-bottom">
          <div className="col-1">
            Show &nbsp;
            <input type="checkbox" id="check" />
          </div>
          <div className="col-1">
          Records Per Page</div>
          <div className="col-2"> 
            <select name="topics" className="form-select form-select-lg mb-3" id="sizes" defaultValue={20} id="topics" onClick={size}>
              <option className="dropdown-item" value={5} >5</option>
              <option className="dropdown-item" value={10} >10</option>
              <option className="dropdown-item" value={20} >20</option>
              <option className="dropdown-item" value={30} >30</option>
              <option className="dropdown-item" value={50} >50</option>
            </select>
          </div>
          <div className="col"></div>
          <div className="col-3">
            {/* <div className="col-xs-4" > */}
            <input type="text" className="form-control" onChange={searchs} id="name" name="search" placeholder="Search Question" />
            {/* </div> */}
          </div>
          <div className="col-2">

            <select name="topics" className="form-select form-select-lg mb-3" id="topics" onClick={medium}>
              <option value="All" >All</option>
              {top &&
                top.map((topics, p) => (
                  <option key={p} value={topics.name} >{topics.name}</option>
                ))}
            </select>
          </div>
        </div>
        <br/>
        {pages &&
          pages.map((q, i) => (
            <div key={i}>
              <div key={i} dangerouslySetInnerHTML={htmlfunc(q, i)} />
              <div className="singleque">
                {q.options.map((o, j) => (
                  <div key={j}>
                    <input key={o}
                      type={
                        q.type === "MULTIPLE CHOICE"
                          ? "checkbox"
                          : q.type === "MULTIPLE RESPONSE"
                            ? "radio"
                            : "radio"
                      }
                      onChange={toggle}
                      checked={o.isCorrect}
                    />

                    {o.option}
                  </div>
                ))}
                <br />
                <div className="row">
                  <div className="col-1">
                    <button className="btn btn-outline-primary" onClick={() => { navigate(`./Edit`, { state: { q, accesstoken } }) }}>Edit</button>
                  </div>
                  <div className="col-1">
                    <button className="btn btn-outline-danger" onClick={() => deleteq(q)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="border-top d-flex justify-content-around">
      {
        <Pagination
          activePage={id}
          itemsCountPerPage={qperp}
          totalItemsCount={result && result.length}
          pageRangeDisplayed={8}
          onChange={handlePageChange}
        />
      }
      </div>
    </div >

  );
}

export default Api;
