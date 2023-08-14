import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { decryptStringWithKey } from "@/utils/encrypt";
import html2canvas from "html2canvas";

type Props = {
  question: string | undefined;
};

const CodeSnippet = (props: Props) => {
  // console.log(props.question);
  // const [codeImage, setCodeImage] = React.useState("");
  // const [shouldShowCodeImage, setShouldShowCodeImage] = React.useState(true);
  // React.useEffect(() => {
  //   setShouldShowCodeImage(true);
  // }, [props.question]);

  // React.useEffect(() => {
  //   if (!shouldShowCodeImage) return;
  //   const codeSnippetDiv = document.getElementById(
  //     "code-snippet"
  //   ) as HTMLDivElement;
  //   html2canvas(codeSnippetDiv, {
  //     onclone: function (clonedDoc) {
  //       const clonedCodeSnippetDiv = clonedDoc.getElementById(
  //         "code-snippet"
  //       ) as HTMLDivElement;
  //       clonedCodeSnippetDiv.style.opacity = "1";
  //     },
  //   })
  //     .then((canvas) => {
  //       const url = canvas.toDataURL("image/png");
  //       setShouldShowCodeImage(false);
  //       setCodeImage(url);
  //     })
  //     .catch(console.error);
  // }, [shouldShowCodeImage]);
  return (
    <>
      <SyntaxHighlighter
        // wrapLines={true}
        // wrapLongLines
        id="code-snippet"
        customStyle={{
          width: "100%",
          border: "3px solid #1565c0",
          borderRadius: "10px",
          // position: "absolute",
          whiteSpace: "normal",
          wordBreak: "break-word",
        }}
        showLineNumbers={true}
        language="javascript"
      >
        {props.question ?? ""}
      </SyntaxHighlighter>
      {/* {shouldShowCodeImage && (
        <SyntaxHighlighter
          // wrapLines={true}
          // wrapLongLines
          id="code-snippet"
          customStyle={{
            width: "100%",
            border: "3px solid #1565c0",
            opacity: 0,
            borderRadius: "10px",
            position: "absolute",
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
          showLineNumbers={true}
          language="javascript"
        >
          {decryptStringWithKey(props.question ?? "")}
        </SyntaxHighlighter>
      )}
      <img
        src={codeImage}
        // src={codeImage === "" ? "/code_skeleton.png" : codeImage}
        alt="code"
        style={{
          maxWidth: "800px",
        }}
      /> */}
    </>
  );
};

export default CodeSnippet;
