import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";

function MyEditor() {
  const [content, setContent] = useState();
  const sumitHandler = () => {
    console.log(content);
  };
  return (
    <>
      <Editor
        apiKey="zdh706xe2t82ab6kx6fbhrozfjvpysck8wj9scb2fx2c1byg"
        initialValue="<p>Write your article...</p>"
        value={content}
        onEditorChange={(content) => setContent(content)}
        init={{
          height: 400,
          menubar: true,
          plugins: ["link", "image", "lists", "table", "code"],
          toolbar:
            "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link image",
        }}
      />
      <p>{content}</p>
      <button onClick={sumitHandler}>Submit</button>
    </>
  );
}

export default MyEditor;
