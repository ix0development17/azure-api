import axios from "axios";
import "./App.css";
import { useState } from "react";

function App() {
  const [img, setImg] = useState("");
  const [newImg, setNewImg] = useState("");
  const [data, setData] = useState("");

  function imageUploaded(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const e = reader.result.replace("data:image/jpeg;base64,", "");
        setImg(e);
      };
      reader.readAsDataURL(file);
    }
  }

  function fetchResult() {
    axios.post("http://127.0.0.1:999", { image: img }).then((response) => {
      setNewImg(`data:image/jpeg;base64,${response.data.image}`);
      setData(response.data);
    });
  }

  return (
    <div className="App">
      <h2>upload image: </h2>
      <div className="file-input-container">
        <input
          type="file"
          id="file-input"
          className="file-input"
          onChange={imageUploaded}
        />
        <label htmlFor="file-input" className="file-label">
          upload
        </label>
      </div>
      <button onClick={fetchResult}>fire :)</button>
      {newImg && (
        <div>
          <img src={newImg} style={{ width: "500px" }} alt="Processed Result" />
          <ul>
            <li>
              <b>Corrosion:</b> {data.generated_text.corrosion}
            </li>
            <li>
              <b>Non Detected:</b> {data.generated_text.non_defetected}
            </li>
            <li>
              <b>Image Shape Before Crackdent Model:</b>{" "}
              {data.generated_text.image_shape_before_crackdent_model}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
