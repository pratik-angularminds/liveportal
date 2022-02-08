import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import {
  Navbar,
  Nav,
  Container,
  Form,
  InputGroup,
  Button,
  Alert,
  Toast,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Addq() {
  const [optarr, setOptarr] = useState([]);
  const [sub, setSub] = useState([]);
  const [queflag, setQueflag] = useState(false);
  let navigate = useNavigate();
  const [top, setTop] = useState([]);
  const [right, setRight] = useState(1);
  const [wrong, setWrong] = useState(0);
  const [topic, setTopic] = useState([]);
  const [validated, setValidated] = useState(false);
  const [positions, setPositions] = useState();
  const [flagopt, setFlagopt] = useState(false);
  const [c, setC] = useState("MULTIPLE CHOICE");
  const location = useLocation();
  const [text, setText] = useState("");
  const [opt, setOpt] = useState([1, 2, 3, 4]);
  const [final, setFinal] = useState({
    diffLevel: "",
    options: [
      { option: "", isCorrect: false, richTextEditor: false },
      { option: "", isCorrect: false, richTextEditor: false },
      { option: "", isCorrect: false, richTextEditor: false },
      { option: "", isCorrect: false, richTextEditor: false },
    ],
    questionText: "",
    rightMarks: 1,
    subject: "",
    topic: "",
    type: "",
    wrongMarks: 0,
  });

  let toolbar = [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ];

  let formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "align",
    "color",
    "background",
    "Blockquote",
    "Header",
    "Indent",
    "List",
    "Text Alignment",
    "Text Direction",
    "Code Block",
    "Formula",
    "Image",
    "Video",
  ];

  axios.interceptors.request.use(
    (config) => {
      config.headers.authorization = `${location.state.accesstoken}`;
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );
  useEffect(() => {
    axios
      .get(` http://admin.liveexamcenter.in/api/subjects?term=`)
      .then((res) => {
        console.log(res);
        setSub(res.data);
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
        setTop(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    //  setOpt();
    final.subject = sub.result && sub.result[0] && sub.result[0]._id;
  }, [sub]);

  const tchange = (e) => {
    let temp = top.result.filter((t) => t.name === e.target.value);
    final.topic = temp[0]._id;
  };

  const setposition = (i) => {
    setPositions(i);
  };
  const rteChange = (content, delta, source, editor) => {
    final.options.map((o, pos) =>
      pos === positions ? (o.option = editor.getText()) : o.option
    );
  };

  const qtextchange = (content, delta, source, editor) => {
    console.log(editor.getText());
    final.questionText = editor.getText();
  };

  const callforquetext = () => {
    if (queflag === false) setQueflag(true);
    else setQueflag(false);
  };

  useEffect(() => {
    setOptarr(final.options.map((o) => o.richTextEditor));
  }, [final]);

  const schange = (e) => {
    let temp =
      sub && sub.result && sub.result.filter((s) => s.name === e.target.value);
    setTopic(
      top &&
        top.result &&
        top.result.filter((t) => t.subject._id === temp[0]._id)
    );
    final.subject = temp[0]._id;
  };

  const richtextopt = (i, e) => {
    let opts = final.options.filter((o, pos) => pos === i);
    console.log(opts);
    if (opts[0].richTextEditor === false) opts[0].richTextEditor = true;
    else opts[0].richTextEditor = false;
    setOptarr(final.options.map((o) => o.richTextEditor));
  };

  const choice = (e) => {
    setC(e.target.value);
    final.type = e.target.value;
  };

  const difflevel = (e) => {
    final.diffLevel = e.target.value;
  };

  const rightv = (event) => {
    setRight(event.target.value);
    final.rightMarks = parseInt(event.target.value);
  };
  const wrongv = (e) => {
    setWrong(e.target.value);
    final.wrongMarks = parseInt(e.target.value);
  };

  const checkrad = (i) => {
    let opts = final.options.filter((o, pos) => pos === i);
    if (c === "MULTIPLE CHOICE")
      final.options.map((o, pos) =>
        pos === i ? (o.isCorrect = true) : (o.isCorrect = false)
      );
    else {
      if (opts[0].isCorrect === false) opts[0].isCorrect = true;
      else opts[0].isCorrect = false;
    }
  };

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
  const addopt = () => {
    setOpt([...opt, 1]);
    final.options = [
      ...final.options,
      { option: "", isCorrect: false, richTextEditor: false },
    ];
    console.log(final);
  };
  const removeopt = (i) => {
    setOpt(opt.filter((o, p) => p !== i));
    final.options = final.options.filter((o, p) => p !== i);
  };

  const finalcall = () => {
    console.log(final);
    setValidated(true);
    let flag1 = final.options.map((o) => o.option === "");
    let flag2 = false;
    final.questionText === "" ? (flag2 = true) : (flag2 = false);

    let flag = "QueAddFail";
    if (!flag1.includes("true") && !flag2) {
      axios
        .post(`http://admin.liveexamcenter.in/api/questions`, final)
        .then((res) => {
          console.log(res);
          success();
          timeSensativeAction();
          navigate(`/api`, { state: location.state.accesstoken });
        })
        .catch((err) => {
          console.log(err);
          fail();
          timeSensativeAction();
        });

      navigate(`/api`, { state: location.state.accesstoken });
    } else {
    }
  };

  async function timeSensativeAction() {
    await sleep(5000);
  }
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const cancelreq = () => {
    navigate(`/api`, { state: location.state.accesstoken });
  };

  return (
    <div className="header">
      <Form noValidate validated={validated}>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        <div className="container border">
          <div className="row border-bottom">
            <div className="col-sm ">
              <h1 className="fw-bolder">
                <br />
                Add Question
              </h1>
            </div>
          </div>
          <br />
          <Toast>
            <Toast.Header>
              <strong className="me-auto">Bootstrap</strong>
              <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
          </Toast>
          <div className="row">
            <div className="col-sm">
              Select Subject : <br />
              <select
                name="subjects"
                className="form-select form-select-lg mb-3"
                id="sizes"
                onClick={schange}
              >
                {sub &&
                  sub.result &&
                  sub.result.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-sm">
              Select Topic : <br />
              <select
                name="topics"
                className="form-select form-select-lg mb-3"
                id="topics"
                onClick={tchange}
                required
              >
                {topic &&
                  topic.map((topics, p) => (
                    <option key={p} value={topics.name}>
                      {topics.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-sm">
              Question Type : <br />
              <select
                name="choice"
                className="form-select form-select-lg mb-3"
                id="sizes"
                onClick={choice}
              >
                <option value="MULTIPLE CHOICE">MULTIPLE CHOICE</option>
                <option value="MULTIPLE RESPONSE">MULTIPLE RESPONSE</option>
                <option value="FILL IN BLANKS">FILL IN BLANKS</option>
              </select>
            </div>
            <div className="col-sm">
              Difficulty Level : <br />
              <select
                name="Diff level"
                className="form-select form-select-lg mb-3"
                id="sizes"
                onClick={difflevel}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="col-sm">
              Right Marks :<br />
              <input
                type={"text"}
                placeholder="Enter right Mark"
                id="right"
                onChange={rightv}
                className="form-control"
                style={{ height: "35px" }}
                value={right}
                required
              />
            </div>
            <div className="col-sm">
              Wrong Marks :<br />
              <input
                type={"text"}
                placeholder="Enter Wrong Mark"
                id="wrong"
                className="form-control"
                style={{ height: "35px" }}
                onChange={wrongv}
                value={wrong}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm">
              Question :
              <InputGroup hasValidation>
                <ReactQuill
                  theme="snow"
                  onChange={qtextchange}
                  id="quill"
                  className="form-control"
                  modules={(module = { toolbar: queflag && toolbar })}
                  placeholder="Enter que"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Option is Required.
                </Form.Control.Feedback>
              </InputGroup>
              <br />
              <br />
              <button className="btn btn-link" onClick={callforquetext}>
                {" "}
                Rich Text Editor
              </button>
            </div>
          </div>
          <br />
          Options
          <br />
          <br />
          {opt.map((o, i) => (
            <div key={i}>
              <br />
              <br />
              <div className="input-group">
                {/* <div className={optarr[i] === true ? "input-group-text2" : "input-group-text1"}> */}
                <InputGroup.Text
                  id={optarr[i] ? "inputGroupPrepend2" : "inputGroupPrepend"}
                >
                  <input
                    className="form-check-input mt-0"
                    type={c === "MULTIPLE RESPONSE" ? "checkbox" : "radio"}
                    value=""
                    name={c === "MULTIPLE RESPONSE" ? "checkbox" : "radio"}
                    onChange={() => checkrad(i)}
                  />
                </InputGroup.Text>
                {/* </div> */}

                {optarr[i] ? (
                  <InputGroup hasValidation>
                    <ReactQuill
                      theme="snow"
                      formats={formats}
                      onFocus={() => setposition(i)}
                      onChange={rteChange}
                      className={"form-control"}
                      placeholder="Enter Option..."
                      modules={(module = { toolbar: optarr[i] && toolbar })}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Option is Required.
                    </Form.Control.Feedback>
                  </InputGroup>
                ) : (
                  <Form.Group md="4">
                    <InputGroup hasValidation>
                      <Form.Control
                        type="textarea"
                        placeholder="Enter Option Here.."
                        aria-describedby="inputGroupPrepend"
                        id="texts"
                        onChange={(e) =>
                          final.options.map((o, pos) =>
                            pos === i
                              ? (o.option = e.target.value)
                              : console.log(final)
                          )
                        }
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Option is Required.
                      </Form.Control.Feedback>
                    </InputGroup>
                    <div></div>
                  </Form.Group>
                )}
              </div>
              <br />
              <br />
              <Form.Group md="4">
                <button className="btn btn-link" onClick={() => removeopt(i)}>
                  Remove option
                </button>
                {" | "}
                <button className="btn btn-link" onClick={() => richtextopt(i)}>
                  {" "}
                  Rich Text Editor
                </button>
              </Form.Group>
            </div>
          ))}
          <button className="btn btn-link" onClick={addopt}>
            Add Option
          </button>
          <br />
          <br />
          <div></div>
          <div className="row">
            <div className="col-2">
              {opt.length > 2 ? (
                <Button className="btn btn-primary" onClick={finalcall}>
                  Submit
                </Button>
              ) : (
                <div style={{ color: "red" }}>
                  Minimum 2 options Required...!!
                </div>
              )}
              <ToastContainer />
            </div>
            <div className="col-2">
              <button className="btn btn-outline-danger" onClick={cancelreq}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default Addq;
