import React from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { ReactComponent as Logo } from "./static/blank-heart.svg";
import "./App.css";

const LIKETION_API_ROOT_URL = "http://localhost:3000/root_path";

type Like = {
  id: number;
  contentId: number;
  name: string;
};

type getLikesProps = {
  contentId: string;
};
const getLikes = async (props: getLikesProps) => {
  const response = await axios.get(`${LIKETION_API_ROOT_URL}/${props.contentId}`).catch((error) => {
    console.log(error);
    throw new Error("getLikes API is failed");
  });

  if (response.status === 200) {
    return response.data.likes;
  } else {
    throw new Error("getLikes API is failed");
  }
};

type postLikeProps = {
  name: string;
  contentId: string;
};
const postLike = async (props: postLikeProps) => {
  const postBody = { name: props.name, contentId: props.contentId };
  const response = await axios.post(`${LIKETION_API_ROOT_URL}/${props.contentId}`, postBody).catch((error) => {
    console.log(error);
    throw new Error("getLikes API is failed");
  });

  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("postLike API is failed");
  }
};

function App() {
  const [likes, setLikes] = React.useState<Like[]>([]);

  const handleClick = () => {
    const handleClickMain = async () => {
      await postLike({ name: name, contentId: contentId });
      const likes = await getLikes({ contentId: contentId });
      setLikes(likes);
    };
    handleClickMain();
  };

  const [name, setName] = React.useState("");
  const handleChangeNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const [contentId, setContentId] = React.useState("");
  const handleChangeContentIdInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContentId(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Box
        // conponent="form"
        // sx={{
        //   "& > :not(style)": { m: 1, width: "25ch" },
        // }}
        // noValidate
        // autoComplete="off"
        >
          <TextField id="name-input" label="name" variant="outlined" onChange={handleChangeNameInput} />
          <TextField
            id="content-id-input"
            label="content ID"
            variant="outlined"
            onChange={handleChangeContentIdInput}
          />
          <Logo className="Like-logo" onClick={handleClick} />
        </Box>
        <div>
          Total likes number (contentID = {contentId}) is {likes.length}
        </div>
      </header>
    </div>
  );
}

export default App;
