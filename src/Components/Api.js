import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Pagination from "react-js-pagination";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Navbar,
  Nav,
  Container,
  Form,
  NavDropdown,
  InputGroup,
  Button,
  Alert,
  Toast,
} from "react-bootstrap";

function Api() {
  const [posts, setPosts] = useState([]);
  const [id, setId] = useState(1);
  const location = useLocation();
  const [flag, setFlag] = useState(false);
  const [count, setCount] = useState();
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [topic, setTopic] = useState([]);
  const [qperp, setQperp] = useState(20);
  const [result, setResult] = useState([]);
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState([]);
  let navigate = useNavigate();
  let data;
  const accesstoken = location.state;

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
  }, [posts]);

  useEffect(() => {
    if (tests !== []) {
      setResult(tests);
    }
  }, [tests]);

  useEffect(() => {
    if (search !== []) {
      setResult(search);
    } else {
      setResult(posts && posts.result);
    }
  }, [search]);

  useEffect(() => {
    setPages(result && result.slice(page, page + qperp));
  }, [result]);
  useEffect(() => {
    setPages(result && result.slice(page, page + qperp));
  }, [qperp]);

  useEffect(() => {
    setPages(result && result.slice(page, page + qperp));
  }, [page]);

  useEffect(() => {}, [pages]);

  function htmlfunc(q) {
    return { __html: q.questionText };
  }

  let top = topic && topic.result;

  function deleteq(q) {
    if (window.confirm("Are You sure to delete the Question...")) {
      axios
        .delete(`http://admin.liveexamcenter.in/api/questions/${q._id}`)
        .then((res) => {
          timeSensativeAction();
          questiondeleted();
          navigate(`/api`, { state: accesstoken });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  async function timeSensativeAction() {
    await sleep(5000);
  }
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  function medium(e) {
    let tid;
    let temp = posts && posts.result;
    console.log(e.target.value);
    if (e.target.value === "All") {
      setTests(posts && posts.result);
      return;
    }
    top && top.map((t) => (t.name === e.target.value ? (tid = t._id) : t));
    setTests(temp && temp.filter((q) => q.topic === tid));

    return;
  }

  function toggle() {}
  const success = () =>
    toast.success("Question Added Succesfully....", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  const fail = () =>
    toast.error("Question Not Added Failed....", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  const questiondeleted = () => {
    toast.success("Question Deleted Succesfully....", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  function searchs() {
    let name = document.getElementById("name").value;
    console.log(name);
    let temp = posts && posts.result;
    setSearch(temp && temp.filter((q) => q.questionText.includes(name)));
  }

  function size(e) {
    setQperp(parseInt(e.target.value));
    setPage(0);
    console.log(qperp);
  }

  function handlePageChange(pagen) {
    setId(pagen);
    setPage(pagen * qperp - qperp);
  }

  const setshow = () => {
    if (flag == false) {
      setFlag(true);
      setCount(page);
    } else setFlag(false);
  };
  const logoutto = () => {
    axios
      .get(`http://admin.liveexamcenter.in/api/auth/logout`)
      .then((res) => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <h1 className="navbar-brand" href="#">
          Angular Minds
        </h1>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <a className="nav-item nav-link active" href="#">
              Home <span className="sr-only">(current)</span>
            </a>
            <a className="nav-item nav-link" href="#">
              Questions
            </a>
            <a className="nav-item nav-link" href="#">
              Topics
            </a>
            <a className="nav-item nav-link" onClick={logoutto}>
              logout
            </a>
          </div>
        </div>
      </nav>
      <div className="container border">
        <div>
          <ToastContainer />
          <div className="row border">
            <div className="col-sm">
              <h1 className="fw-bolder">
                <br />
                Questions
              </h1>
            </div>
            <div className="col-sm">
              <button
                className="next"
                onClick={() => {
                  navigate(`./Addq`, { state: { accesstoken } });
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
              <input type="checkbox" id="check" onChange={setshow} />
            </div>
            <div className={flag ? "col-2" : "col-1"}>
              {flag ? <button>{"delete" + count + "questions"}</button> : flag}
            </div>
            <div className="col-1">Records Per Page</div>
            <div className="col-2">
              <select
                name="topics"
                className="form-select form-select-lg mb-3"
                id="sizes"
                defaultValue={20}
                id="topics"
                onClick={size}
              >
                <option className="dropdown-item" value={5}>
                  5
                </option>
                <option className="dropdown-item" value={10}>
                  10
                </option>
                <option className="dropdown-item" value={20}>
                  20
                </option>
                <option className="dropdown-item" value={30}>
                  30
                </option>
                <option className="dropdown-item" value={50}>
                  50
                </option>
              </select>
            </div>
            <div className="col"></div>
            <div className="col-3">
              {/* <div className="col-xs-4" > */}
              <input
                type="text"
                className="form-control"
                onChange={searchs}
                id="name"
                name="search"
                placeholder="Search Question"
                style={{ height: "40px", border: "1px solid gray" }}
              />
              {/* </div> */}
            </div>
            <div className="col-2">
              <select
                name="topics"
                className="form-select form-select-lg mb-3"
                id="topics"
                onClick={medium}
              >
                <option value="All">All</option>
                {top &&
                  top.map((topics, p) => (
                    <option key={p} value={topics.name}>
                      {topics.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <br />
          {pages &&
            pages.map((q, i) => (
              <div key={i}>
                <input type="checkbox" value={q._id} />
                <div key={i} dangerouslySetInnerHTML={htmlfunc(q)} />
                <div className="singleque">
                  {q.options.map((o, j) => (
                    <div key={j}>
                      <input
                        key={o}
                        type={
                          q.type === "MULTIPLE CHOICE"
                            ? "radio"
                            : q.type === "MULTIPLE RESPONSE"
                            ? "checkbox"
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
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => {
                          navigate(`./Edit`, { state: { q, accesstoken } });
                        }}
                      >
                        Edit
                      </button>
                    </div>
                    <div className="col-1">
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => deleteq(q)}
                      >
                        Delete
                      </button>
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
      </div>
    </div>
  );
}

export default Api;
