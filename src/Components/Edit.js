import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
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
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
function Edit() {
  let navigate = useNavigate();
  const location = useLocation();
  const [sub, setSub] = useState([]);
  const [right, setRight] = useState(1);
  const [type, setType] = useState();
  const [position, setposition] = useState();
  const [top, setTop] = useState([]);
  const [validated, setValidated] = useState(false);
  const [options, setOptions] = useState([]);
  const accesstoken = location.state.accesstoken;
  const [checked, setChecked] = useState();
  const [wrong, setWrong] = useState(0);
  const [topic, setTopic] = useState([]);
  const [quetexts, setQuetexts] = useState();
  const [opttext, setOpttext] = useState([]);
  const [final, setFinal] = useState([]);
  const [optarr, setOptarr] = useState([false, false, false, false]);
  const [querichtext, setQuerichtext] = useState(false);
  let toolbar = [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, true] }],
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

  const rteChange = (content, delta, source, editor) => {
    // console.log(editor.getText()); // plain text
    final.questionText = editor.getText();
  };

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
      .get(` http://admin.liveexamcenter.in/api/subjects?term=`)
      .then((res) => {
        console.log(res);
        setSub(res.data);
        setFinal(location.state.q);
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
    setFinal(location.state.q);
  }, [location.state.q]);

  useEffect(() => {
    setType(final && final.type);
    setOptions(final.options && final.options);
    setChecked(final.options && final.options.map((o) => o.isCorrect));
    setQuerichtext(
      final.questionText && final.questionText.includes("<p>", "\n", "<b>")
    );
    setOptarr(
      final.options &&
        final.options.map((o) => o.option.includes("<p>", "\n", "<b>"))
    );
    setOpttext(final.options && final.options.map((o) => o.option));
    setQuetexts(final && final.questionText);
    console.log(final);
  }, [final]);

  useEffect(() => {}, [optarr]);

  const rightv = (event) => {
    setRight(event.target.value);
  };
  useEffect(() => {
    setTopic(
      top &&
        top.result &&
        top.result.filter((t) => t.subject._id === location.state.q.subject)
    );
  }, [top]);
  const schange = (e) => {
    let temp =
      sub && sub.result && sub.result.filter((s) => s.name === e.target.value);
    console.log(temp);
    setTopic(
      top &&
        top.result &&
        top.result.filter((t) => t.subject._id === temp[0]._id)
    );
    final.subject = temp[0]._id;
    console.log(topic);
  };

  const wrongv = (e) => {
    setWrong(e.target.value);
  };

  const tchange = () => {};
  const addopt = () => {
    final.options = [...final.options, { option: "", isCorrect: false }];
    setOptions([...options, { option: "", isCorrect: false }]);
    console.log(final);
  };

  function finalcall() {
    let flag1 = final.options.map((o) => o.option === "");
    let flag2 = false;
    setValidated(true);
    final.questionText === "" ? (flag2 = true) : (flag2 = false);
    console.log(flag1, flag2);
    if (!flag1.includes(true) && !flag2) {
      axios
        .put(`http://admin.liveexamcenter.in/api/questions/${final._id}`, final)
        .then((res) => {
          console.log(res);
          success();
          timeSensativeAction();
          navigate(`/api`, { state: accesstoken });
        })
        .catch((err) => {
          console.log(err);
          fail();
          timeSensativeAction();
          navigate(`/api`, { state: accesstoken });
        });
    }
  }
  async function timeSensativeAction() {
    await sleep(5000);
  }
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  const success = () =>
    toast.success("Question Updated Succesfully....", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  const fail = () =>
    toast.error("Question Not Updated Failed....", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  const cancelreq = () => {
    navigate(`/api`, { state: accesstoken });
  };
  const checkrad = (i) => {
    let opts = options;
    if (type === "MULTIPLE CHOICE")
      opts.map((o, pos) =>
        pos === i ? (o.isCorrect = true) : (o.isCorrect = false)
      );
    else {
      opts.map((o, pos) =>
        pos === i && o.isCorrect === false
          ? (o.isCorrect = true)
          : pos === i && o.isCorrect === true
          ? (o.isCorrect = false)
          : o.isCorrect
      );
    }
    setChecked(options.map((o) => o.isCorrect));
    final.options = opts;
    setOptions(opts);
  };
  const removeopt = (i) => {
    let temp = final;
    temp.options = temp.options.filter((o, p) => p !== i);
    setOptions(temp.options);
    setOpttext(temp.options.map((o) => o.option));
    setFinal(temp);

    console.log(final);
  };

  const difflevel = (e) => {
    final.diffLevel = e.target.value;
  };

  const quetext = () => {
    if (querichtext === false) setQuerichtext(true);
    else setQuerichtext(false);
  };

  const choice = (e) => {
    final.type = e.target.value;
    setType(e.target.value);
    console.log(final);
  };

  const opttextset = (content, delta, source, editor) => {
    final.options &&
      final.options.map((o, pos) =>
        pos === position ? (o.option = editor.getText()) : o.option
      );
    setOpttext(
      opttext.map((o, pos) => (pos === position ? (o = editor.getText()) : o))
    );
  };
  const optrichtext = (i) => {
    setOptarr(
      optarr.map((o, pos) =>
        pos === i && o === true
          ? (o = false)
          : pos === i && o === false
          ? (o = true)
          : o
      )
    );
  };

  const quetextchange = (e) => {
    setQuetexts(e.target.value);
    final.questionText = e.target.value;
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    console.log(form.checkValidity());
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    return false;
  };
  const select = (id) => {
    let flag;
    topic &&
      topic.map((topics) =>
        topics._id === id ? (flag = topics.name) : (flag = "")
      );
    return flag;
  };

  return (
    <div className="container border">
      <div className="row border-bottom">
        <div className="col-sm ">
          <h1 className="fw-bolder">
            <br />
            Edit Question
          </h1>
        </div>
      </div>
      <br />
      <Form noValidate validated={validated}>
        <div className="row">
          <div className="col-sm">
            Select Subject : <br />
            <select
              name="subjects"
              className="form-select form-select-lg mb-3"
              id="sizes"
              onClick={schange}
            >
              <option defaultValue="" hidden>
                {sub &&
                  sub.result &&
                  sub.result.map((s) =>
                    s._id == location.state.q.subject ? s.name : console.log()
                  )}
              </option>
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
              id="topics"
              className="form-select form-select-lg mb-3"
              onClick={tchange}
              required
            >
              <option defaultValue="" hidden>
                {topic &&
                  topic.map((t) =>
                    t._id == location.state.q.topic ? t.name : console.log()
                  )}
              </option>
              {topic &&
                topic.map((topics, p) => (
                  <option
                    key={p}
                    value={topics.name}
                    defaultValue={select(topics._id)}
                  >
                    {topics.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <br />
        <br />
        <div className="row">
          <div className="col-sm">
            Question Type : <br />
            <select
              name="choice"
              className="form-select form-select-lg mb-3"
              id="sizes"
              onClick={choice}
            >
              {" "}
              <option defaultValue="" hidden>
                {final.type}
              </option>
              <option value="MULTIPLE CHOICE">MULTIPLE CHOICE</option>
              <option
                value="MULTIPLE RESPONSE"
                defaultValue="MULTIPLE RESPONSE"
              >
                MULTIPLE RESPONSE
              </option>
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
              {" "}
              <option defaultValue="Easy" value="Easy">
                Easy
              </option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="col-sm">
            Right Marks :<br />
            <input
              type={"text"}
              className="form-control"
              style={{ height: "35px" }}
              placeholder="Enter right Mark"
              id="right"
              onChange={rightv}
              value={right}
              required
            />
          </div>
          <div className="col-sm">
            Wrong Marks :<br />
            <input
              type={"text"}
              className="form-control"
              style={{ height: "35px" }}
              placeholder="Enter Wrong Mark"
              id="wrong"
              onChange={wrongv}
              value={wrong}
              required
            />
          </div>
        </div>
        <br />
        <br />
        <div className="row">
          <div className="col-sm">
            Question :
            {querichtext ? (
              <ReactQuill
                theme="snow"
                className={"form-control"}
                formats={formats}
                onChange={rteChange}
                id="quill"
                placeholder="Enter que"
                value={final && final.questionText}
                modules={(module = { toolbar: querichtext ? toolbar : false })}
                required
              />
            ) : (
              <Form.Group md="4">
                <InputGroup hasValidation></InputGroup>
                <Form.Control
                  type="textarea"
                  placeholder="Enter Option Here.."
                  aria-describedby="inputGroupPrepend"
                  id="texts"
                  value={quetexts}
                  onChange={(e) => quetextchange(e)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Option is Required.
                </Form.Control.Feedback>
              </Form.Group>
            )}
            <br />
            <br />
            <Button variant="link" onClick={quetext}>
              {" "}
              Rich Text Editor
            </Button>
          </div>
        </div>
        <br /> <br />
        Options :
        <div className="row">
          <div className="col-sm">
            {options &&
              options.map((o, i) => (
                <div key={i}>
                  <div className="input-group">
                    <InputGroup.Text
                      id={
                        optarr[i] ? "inputGroupPrepend2" : "inputGroupPrepend"
                      }
                    >
                      <div className="tag">
                        <input
                          key={o.option}
                          type={
                            type && type === "MULTIPLE RESPONSE"
                              ? "checkbox"
                              : "radio"
                          }
                          className="form-check-input mt-0"
                          onChange={() => checkrad(i)}
                          name={
                            type && type === "MULTIPLE RESPONSE"
                              ? o._id
                              : "radio"
                          }
                          checked={checked[i]}
                        />
                      </div>
                    </InputGroup.Text>
                    {optarr[i] ? (
                      <Form.Group md="4">
                        <ReactQuill
                          theme="snow"
                          formats={formats}
                          onFocus={() => setposition(i)}
                          onChange={() => opttextset}
                          className={"form-control"}
                          placeholder="Enter Option..."
                          value={opttext[i]}
                          modules={(module = { toolbar: toolbar })}
                          required
                        />
                      </Form.Group>
                    ) : (
                      <Form.Group md="4">
                        <InputGroup hasValidation></InputGroup>
                        <Form.Control
                          type="textarea"
                          placeholder="Enter Option Here.."
                          aria-describedby="inputGroupPrepend"
                          id="texts"
                          value={opttext[i]}
                          onChange={(e) => {
                            final.options.map((o, pos) =>
                              pos === i ? (o.option = e.target.value) : o.option
                            );
                            setOpttext(
                              opttext.map((o, pos) =>
                                pos === i ? (o = e.target.value) : o
                              )
                            );
                          }}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Option is Required.
                        </Form.Control.Feedback>
                      </Form.Group>
                    )}
                  </div>
                  <br />
                  <br />
                  <br />
                  <br />
                  <Form.Group md="4">
                    <Button variant="link" onClick={() => removeopt(i)}>
                      Remove option
                    </Button>
                    {" | "}
                    <Button variant="link" onClick={() => optrichtext(i)}>
                      Rich Text Editor
                    </Button>
                    <br /> <br />
                  </Form.Group>
                </div>
              ))}
            <button className="btn btn-link" onClick={addopt}>
              Add Option
            </button>
            <br />
            <br />
            {options && options.length < 2 ? (
              <div style={{ color: "red" }}>
                {" "}
                Minimum 2 option required...!! <br />
                <br />
              </div>
            ) : (
              console.log()
            )}
            <div className="row">
              <div className="col-2">
                <Button className="btn btn-primary" onClick={finalcall}>
                  Submit
                </Button>
              </div>
              <div className="col-2">
                <button
                  type="submit"
                  className="btn btn-outline-danger"
                  onClick={cancelreq}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default Edit;
